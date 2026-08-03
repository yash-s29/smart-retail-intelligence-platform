"""
Demand forecasting service — Smart Retail Intelligence Platform

Two modes:
1) Product-level (PostgreSQL sales) → save Forecast row
   - baseline moving average (short history)
   - XGBoost (enough history)
2) Chain-level ML (features.csv + best_model.pkl) → dashboard / charts
   - ml.predict.forecast_service
"""

from __future__ import annotations

from datetime import date, datetime, timezone
from math import ceil
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.forecast import Forecast
from app.models.inventory import Inventory
from app.models.product import Product
from app.models.sales import Sale


# =====================================================
# Helpers — product daily sales from DB
# =====================================================

def _daily_sales(db: Session, product_id: int) -> pd.DataFrame:
    rows = db.execute(
        select(Sale.sale_date, func.sum(Sale.quantity_sold))
        .where(Sale.product_id == product_id, Sale.status == "Completed")
        .group_by(Sale.sale_date)
        .order_by(Sale.sale_date)
    ).all()

    if not rows:
        return pd.DataFrame(columns=["ds", "y"])

    frame = pd.DataFrame(rows, columns=["ds", "y"])
    frame["ds"] = pd.to_datetime(frame["ds"])
    frame["y"] = frame["y"].astype(float)

    full_dates = pd.date_range(frame["ds"].min(), frame["ds"].max(), freq="D")
    return (
        frame.set_index("ds")
        .reindex(full_dates, fill_value=0)
        .rename_axis("ds")
        .reset_index()
    )


def _baseline(
    frame: pd.DataFrame,
    period_days: int,
) -> Tuple[float, str, float, Optional[float], Optional[str]]:
    if frame.empty:
        return (
            1.0,
            "baseline-no-history",
            0.0,
            None,
            "No completed sales yet; add sales to enable ML forecasting.",
        )

    recent = frame["y"].tail(min(28, len(frame)))
    demand = max(float(recent.mean() * period_days), 1.0)
    confidence = min(0.55, 0.2 + len(frame) / 200)
    return (
        demand,
        "baseline-moving-average",
        confidence,
        None,
        "More history is needed before an ML model is used.",
    )


def _xgboost_forecast(
    frame: pd.DataFrame,
    period_days: int,
) -> Tuple[float, Optional[float]]:
    from xgboost import XGBRegressor

    values = frame["y"].astype(float).tolist()
    if len(values) < 30:
        raise ValueError("XGBoost needs at least 30 daily observations")

    def features(history: list[float], day_index: int) -> list[float]:
        return [
            history[-1],
            history[-7] if len(history) >= 7 else history[-1],
            history[-14] if len(history) >= 14 else history[-1],
            day_index % 7,
        ]

    start = 14
    X = [features(values[:index], index) for index in range(start, len(values))]
    y = values[start:]
    split = max(1, len(X) - min(7, max(1, len(X) // 4)))

    model = XGBRegressor(
        n_estimators=120,
        max_depth=3,
        learning_rate=0.05,
        objective="reg:squarederror",
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X[:split], y[:split])

    accuracy: Optional[float] = None
    if len(X) > split:
        actual = np.array(y[split:], dtype=float)
        predicted = np.maximum(model.predict(X[split:]), 0)
        denominator = np.maximum(actual, 1.0)
        accuracy = max(
            0.0,
            min(1.0, 1.0 - float(np.mean(np.abs(actual - predicted) / denominator))),
        )

    model.fit(X, y)
    history = values[:]
    forecast: list[float] = []
    for _ in range(period_days):
        next_value = max(
            0.0,
            float(model.predict([features(history, len(history))])[0]),
        )
        forecast.append(next_value)
        history.append(next_value)

    return float(sum(forecast)), accuracy


def _predict_demand(
    frame: pd.DataFrame,
    period_days: int,
) -> Tuple[float, str, float, Optional[float], Optional[str]]:
    """
    Product-level model selection (no Prophet).
    - < 30 days  → baseline
    - >= 30 days → XGBoost (fallback to baseline on error)
    """
    try:
        if len(frame) >= 30:
            demand, accuracy = _xgboost_forecast(frame, period_days)
            conf = 0.70 if accuracy is None else max(0.45, float(accuracy))
            return demand, "xgboost", conf, accuracy, None
    except Exception as error:
        demand, model, confidence, accuracy, warning = _baseline(frame, period_days)
        return (
            demand,
            model,
            confidence,
            accuracy,
            f"ML fallback: {error}",
        )

    return _baseline(frame, period_days)


# =====================================================
# Product-level forecast (DB)
# =====================================================

def generate_baseline_forecast(
    db: Session,
    product: Product,
    period_days: int = 30,
    model_name_hint: str = "best",
) -> Forecast:
    """Generate and persist a product forecast from completed sales."""
    history = _daily_sales(db, product.id)
    demand, model_name, confidence, accuracy, warning = _predict_demand(
        history, period_days
    )

    # Prefer saved global model label when useful
    if model_name == "xgboost" and model_name_hint:
        display_model = model_name
    else:
        display_model = model_name

    expected_demand = max(ceil(demand), 1)

    inventory = db.scalar(
        select(Inventory).where(Inventory.product_id == product.id)
    )
    safety_stock = inventory.safety_stock if inventory else 20
    current_stock = inventory.current_stock if inventory else 0

    recommended_stock = expected_demand + max(int(safety_stock or 0), 0)
    expected_revenue = float(expected_demand * (product.selling_price or 0))
    expected_profit = float(
        expected_demand * max((product.selling_price or 0) - (product.cost_price or 0), 0)
    )
    stock_gap = max(recommended_stock - int(current_stock or 0), 0)

    if stock_gap > 0:
        recommendation = (
            f"Restock {stock_gap} units to reach the recommended "
            f"{recommended_stock} units."
        )
    else:
        recommendation = (
            f"Current stock covers the recommended {recommended_stock} units."
        )

    forecast = Forecast(
        owner_id=product.owner_id,
        product_id=product.id,
        forecast_date=date.today(),
        period_days=period_days,
        predicted_demand=float(expected_demand),
        recommended_stock=int(recommended_stock),
        expected_revenue=expected_revenue,
        expected_profit=expected_profit,
        model_name=display_model,
        model_version="v1",
        confidence_score=round(float(confidence), 2),
        accuracy_score=round(float(accuracy), 2) if accuracy is not None else None,
        status="Generated",
        recommendation=recommendation,
        warning=warning,
    )
    db.add(forecast)
    db.commit()
    db.refresh(forecast)
    return forecast


# =====================================================
# Chain-level ML (ml package) — for Forecast page
# =====================================================

def _ensure_project_root_on_path() -> None:
    """Allow `import ml` when API runs from backend/."""
    import sys

    # backend/app/services/this_file → project root = parents[3]
    # services → app → backend → project root
    here = Path(__file__).resolve()
    candidates = [
        here.parents[3],  # project root
        here.parents[2],  # backend
        Path.cwd(),
        Path.cwd().parent,
    ]
    for root in candidates:
        if (root / "ml").exists() and str(root) not in sys.path:
            sys.path.insert(0, str(root))
            break


def ml_forecast_dashboard(
    horizon_days: int = 7,
    model_name: str = "best",
    include_history_days: int = 30,
) -> Dict[str, Any]:
    """
    Live chain revenue forecast from ml.predict.
    Used by GET/POST forecast dashboard endpoints.
    """
    _ensure_project_root_on_path()
    try:
        from ml.predict import forecast_service as ml_forecast_service
    except Exception as exc:
        return {
            "status": "error",
            "model_type": None,
            "model_path": None,
            "horizon_days": horizon_days,
            "forecast_total_revenue": 0.0,
            "forecast_avg_daily_revenue": 0.0,
            "recommendation": "ML package not available. Train models first.",
            "history": [],
            "forecast": [],
            "metrics": {},
            "error": str(exc),
        }

    try:
        result = ml_forecast_service(
            horizon=horizon_days,
            model_name=model_name,
            include_history_days=include_history_days,
        )
        return result
    except FileNotFoundError as exc:
        return {
            "status": "error",
            "model_type": None,
            "model_path": None,
            "horizon_days": horizon_days,
            "forecast_total_revenue": 0.0,
            "forecast_avg_daily_revenue": 0.0,
            "recommendation": "Model file missing. Run: python -m ml.train_model",
            "history": [],
            "forecast": [],
            "metrics": {},
            "error": str(exc),
        }
    except Exception as exc:
        return {
            "status": "error",
            "model_type": None,
            "model_path": None,
            "horizon_days": horizon_days,
            "forecast_total_revenue": 0.0,
            "forecast_avg_daily_revenue": 0.0,
            "recommendation": f"Forecast failed: {exc}",
            "history": [],
            "forecast": [],
            "metrics": {},
            "error": str(exc),
        }


def list_ml_models() -> Dict[str, Any]:
    """List available pickle models under ml/models."""
    _ensure_project_root_on_path()
    try:
        from ml.preprocessing import default_paths

        models_dir = default_paths()["models_dir"]
    except Exception:
        models_dir = Path(__file__).resolve().parents[3] / "ml" / "models"

    names = {
        "best": "best_model.pkl",
        "xgboost": "xgboost_model.pkl",
        "random_forest": "random_forest_model.pkl",
        "ridge": "linear_model.pkl",
    }
    items = []
    for name, filename in names.items():
        path = models_dir / filename
        model_type = None
        if path.exists():
            try:
                import pickle

                with open(path, "rb") as f:
                    bundle = pickle.load(f)
                model_type = bundle.get("model_type")
            except Exception:
                model_type = None
        items.append(
            {
                "name": name,
                "path": str(path),
                "exists": path.exists(),
                "model_type": model_type,
                "is_best": name == "best",
            }
        )
    return {"models": items, "default_model": "best"}


def retrain_ml_models(
    tune_xgb: bool = True,
    force_rebuild_features: bool = False,
) -> Dict[str, Any]:
    """Trigger full ML training pipeline (admin)."""
    _ensure_project_root_on_path()
    try:
        from ml.train_model import train_all
    except Exception as exc:
        return {
            "success": False,
            "message": f"Cannot import ml.train_model: {exc}",
            "model_name": "none",
            "model_version": "v1",
            "training_rows": 0,
            "accuracy_score": 0.0,
            "trained_at": datetime.now(timezone.utc).isoformat(),
            "metrics": {},
        }

    try:
        out = train_all(
            force_rebuild_features=force_rebuild_features,
            tune_xgb=tune_xgb,
            save=True,
        )
        best = out.get("best_model", "best")
        ranking = out.get("ranking") or []
        acc = 0.0
        if ranking:
            # convert MAE rank info if MAPE present in metrics later
            acc = float(ranking[0].get("MAPE", 0) or 0)
            # store as 0-1 style if MAPE was percent
            if acc > 1:
                acc = max(0.0, min(1.0, 1.0 - acc / 100.0))

        return {
            "success": True,
            "message": f"Training complete. Best model: {best}",
            "model_name": best,
            "model_version": "v1",
            "training_rows": int(
                (out.get("models") or {}).get(best, {}).get("metrics", {}).get("train", {}).get("n", 0)
            ),
            "accuracy_score": float(acc),
            "trained_at": datetime.now(timezone.utc).isoformat(),
            "metrics": {
                k: v.get("metrics") for k, v in (out.get("models") or {}).items()
            },
        }
    except Exception as exc:
        return {
            "success": False,
            "message": f"Training failed: {exc}",
            "model_name": "none",
            "model_version": "v1",
            "training_rows": 0,
            "accuracy_score": 0.0,
            "trained_at": datetime.now(timezone.utc).isoformat(),
            "metrics": {},
        }