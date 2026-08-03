"""
Forecast API routes
- Product-level forecasts (DB)
- Chain-level ML dashboard (ml.predict)
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.forecast import Forecast
from app.models.inventory import Inventory
from app.models.product import Product
from app.models.user import User
from app.schemas.forecast import (
    ForecastCreate,
    ForecastDashboardResponse,
    ForecastPoint,
    ForecastRead,
    ForecastSummary,
    ForecastTrainRequest,
    ForecastTrainResponse,
    MLForecastRequest,
    MLForecastResponse,
    ModelsListResponse,
    ModelInfo,
)
from app.services.auth_service import get_current_user
from app.services.forecast_service import (
    generate_baseline_forecast,
    list_ml_models,
    ml_forecast_dashboard,
    retrain_ml_models,
)

router = APIRouter(prefix="/forecast", tags=["Forecasting"])


# =====================================================
# Product-level (existing)
# =====================================================

@router.post(
    "/generate",
    response_model=ForecastRead,
    status_code=status.HTTP_201_CREATED,
)
def generate_forecast(
    payload: ForecastCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product = db.scalar(
        select(Product).where(
            Product.id == payload.product_id,
            Product.owner_id == current_user.id,
        )
    )
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return generate_baseline_forecast(db, product, payload.period_days)


@router.post(
    "/generate-all",
    response_model=list[ForecastRead],
    status_code=status.HTTP_201_CREATED,
)
def generate_all_forecasts(
    period_days: int = Query(default=30, ge=7, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    products = db.scalars(
        select(Product).where(Product.owner_id == current_user.id)
    ).all()
    return [
        generate_baseline_forecast(db, product, period_days)
        for product in products
    ]


@router.get("", response_model=list[ForecastRead])
def list_forecasts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.scalars(
        select(Forecast)
        .join(Product)
        .where(Product.owner_id == current_user.id)
        .order_by(Forecast.created_at.desc())
    ).all()


@router.get("/summary", response_model=ForecastSummary)
def forecast_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    forecasts = db.scalars(
        select(Forecast)
        .join(Product)
        .where(Product.owner_id == current_user.id)
        .order_by(Forecast.created_at.desc())
    ).all()

    low_stock_count = db.scalar(
        select(func.count(Inventory.id))
        .join(Product)
        .where(
            Product.owner_id == current_user.id,
            Inventory.current_stock <= Inventory.reorder_level,
        )
    ) or 0

    return ForecastSummary(
        total_expected_revenue=sum(item.expected_revenue for item in forecasts),
        total_expected_profit=sum(item.expected_profit for item in forecasts),
        average_confidence=(
            sum(item.confidence_score for item in forecasts) / len(forecasts)
            if forecasts
            else 0.0
        ),
        total_forecasts=len(forecasts),
        low_stock_products=int(low_stock_count),
        forecasts=list(forecasts),
    )


@router.get("/{forecast_id}", response_model=ForecastRead)
def get_forecast(
    forecast_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    forecast = db.scalar(
        select(Forecast)
        .join(Product)
        .where(
            Forecast.id == forecast_id,
            Product.owner_id == current_user.id,
        )
    )
    if not forecast:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Forecast not found",
        )
    return forecast


@router.delete("/{forecast_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_forecast(
    forecast_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    forecast = db.scalar(
        select(Forecast)
        .join(Product)
        .where(
            Forecast.id == forecast_id,
            Product.owner_id == current_user.id,
        )
    )
    if not forecast:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Forecast not found",
        )
    db.delete(forecast)
    db.commit()
    return None


# =====================================================
# Chain-level ML (Forecast page)
# =====================================================

def _to_points(rows: list) -> list[ForecastPoint]:
    points: list[ForecastPoint] = []
    for row in rows or []:
        if isinstance(row, dict):
            points.append(ForecastPoint(**{
                k: row.get(k)
                for k in (
                    "ds", "yhat", "y_actual", "residual",
                    "horizon_step", "split", "model_type",
                )
                if k in row or k in ("ds", "yhat")
            }))
    return points


@router.get("/ml/dashboard", response_model=ForecastDashboardResponse)
def ml_dashboard(
    horizon_days: int = Query(default=7, ge=1, le=90),
    model_name: str = Query(default="best"),
    include_history_days: int = Query(default=30, ge=0, le=365),
    current_user: User = Depends(get_current_user),
):
    """Main payload for frontend Forecasting.jsx page load."""
    raw = ml_forecast_dashboard(
        horizon_days=horizon_days,
        model_name=model_name,
        include_history_days=include_history_days,
    )

    history = _to_points(raw.get("history") or [])
    forecast = _to_points(raw.get("forecast") or [])

    kpis = {
        "forecast_total_revenue": raw.get("forecast_total_revenue", 0.0),
        "forecast_avg_daily_revenue": raw.get("forecast_avg_daily_revenue", 0.0),
        "horizon_days": raw.get("horizon_days", horizon_days),
        "history_points": len(history),
        "forecast_points": len(forecast),
        "status": raw.get("status", "ok"),
    }

    return ForecastDashboardResponse(
        status=raw.get("status", "ok"),
        kpis=kpis,
        model_type=raw.get("model_type"),
        recommendation=raw.get("recommendation") or "",
        history=history,
        forecast=forecast,
        metrics=raw.get("metrics") or {},
    )


@router.post("/ml/predict", response_model=MLForecastResponse)
def ml_predict(
    payload: MLForecastRequest,
    current_user: User = Depends(get_current_user),
):
    """On-demand ML forecast (horizon / model selectable)."""
    raw = ml_forecast_dashboard(
        horizon_days=payload.horizon_days,
        model_name=payload.model_name,
        include_history_days=payload.include_history_days,
    )
    return MLForecastResponse(
        status=raw.get("status", "ok"),
        model_type=raw.get("model_type"),
        model_path=raw.get("model_path"),
        horizon_days=raw.get("horizon_days", payload.horizon_days),
        forecast_total_revenue=float(raw.get("forecast_total_revenue") or 0.0),
        forecast_avg_daily_revenue=float(raw.get("forecast_avg_daily_revenue") or 0.0),
        recommendation=raw.get("recommendation") or "",
        history=_to_points(raw.get("history") or []),
        forecast=_to_points(raw.get("forecast") or []),
        metrics=raw.get("metrics") or {},
    )


@router.get("/ml/models", response_model=ModelsListResponse)
def ml_models(
    current_user: User = Depends(get_current_user),
):
    data = list_ml_models()
    models = [ModelInfo(**m) for m in data.get("models", [])]
    return ModelsListResponse(
        models=models,
        default_model=data.get("default_model", "best"),
    )


@router.post("/ml/train", response_model=ForecastTrainResponse)
def ml_train(
    payload: ForecastTrainRequest,
    current_user: User = Depends(get_current_user),
):
    """Retrain global ML models (admin-style; still requires auth)."""
    result = retrain_ml_models(
        tune_xgb=payload.tune_xgb,
        force_rebuild_features=payload.force_rebuild_features,
    )
    return ForecastTrainResponse(
        success=bool(result.get("success")),
        message=str(result.get("message") or ""),
        model_name=str(result.get("model_name") or "none"),
        model_version=str(result.get("model_version") or "v1"),
        training_rows=int(result.get("training_rows") or 0),
        accuracy_score=float(result.get("accuracy_score") or 0.0),
        trained_at=result.get("trained_at"),
        metrics=result.get("metrics"),
    )