"""
Reports API routes
- Live analytics (overview, products, inventory, trend, forecast accuracy)
- Optional saved report snapshots
"""

from __future__ import annotations

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.report import Report
from app.models.user import User
from app.schemas.report import (
    CategoryMixResponse,
    ForecastAccuracyResponse,
    InventoryHealthResponse,
    ProductPerformanceResponse,
    ReportOverviewResponse,
    ReportsDashboardResponse,
    SalesTrendResponse,
)
from app.services.auth_service import get_current_user
from app.services.reports_service import (
    get_category_mix,
    get_forecast_accuracy,
    get_inventory_health,
    get_overview,
    get_product_performance,
    get_reports_dashboard,
    get_sales_trend,
)

router = APIRouter(prefix="/reports", tags=["Reports"])


# =====================================================
# Live analytics
# =====================================================

@router.get("/overview", response_model=ReportOverviewResponse)
def reports_overview(
    from_date: Optional[date] = Query(default=None),
    to_date: Optional[date] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = get_overview(db, current_user.id, from_date, to_date)
    return ReportOverviewResponse(**data)


@router.get("/trend", response_model=SalesTrendResponse)
def reports_trend(
    from_date: Optional[date] = Query(default=None),
    to_date: Optional[date] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = get_sales_trend(db, current_user.id, from_date, to_date)
    return SalesTrendResponse(**data)


@router.get("/products", response_model=ProductPerformanceResponse)
def reports_products(
    from_date: Optional[date] = Query(default=None),
    to_date: Optional[date] = Query(default=None),
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = get_product_performance(
        db, current_user.id, from_date, to_date, limit=limit
    )
    return ProductPerformanceResponse(**data)


@router.get("/inventory", response_model=InventoryHealthResponse)
def reports_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = get_inventory_health(db, current_user.id)
    return InventoryHealthResponse(**data)


@router.get("/category-mix", response_model=CategoryMixResponse)
def reports_category_mix(
    from_date: Optional[date] = Query(default=None),
    to_date: Optional[date] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = get_category_mix(db, current_user.id, from_date, to_date)
    return CategoryMixResponse(**data)


@router.get("/forecast-accuracy", response_model=ForecastAccuracyResponse)
def reports_forecast_accuracy(
    history_days: int = Query(default=30, ge=7, le=180),
    current_user: User = Depends(get_current_user),
):
    data = get_forecast_accuracy(history_days=history_days)
    return ForecastAccuracyResponse(**data)


@router.get("/dashboard", response_model=ReportsDashboardResponse)
def reports_dashboard(
    from_date: Optional[date] = Query(default=None),
    to_date: Optional[date] = Query(default=None),
    product_limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """One-call payload for the Reports page load."""
    data = get_reports_dashboard(
        db,
        current_user.id,
        from_date=from_date,
        to_date=to_date,
        product_limit=product_limit,
    )
    return ReportsDashboardResponse(**data)


# =====================================================
# Saved report snapshots (optional)
# =====================================================

@router.get("/saved")
def list_saved_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = db.scalars(
        select(Report)
        .where(Report.owner_id == current_user.id)
        .order_by(Report.created_at.desc())
    ).all()
    return [
        {
            "id": r.id,
            "title": r.title,
            "report_type": r.report_type,
            "summary": r.summary,
            "metrics": r.metrics,
            "from_date": r.from_date,
            "to_date": r.to_date,
            "status": r.status,
            "created_at": r.created_at,
            "updated_at": getattr(r, "updated_at", None),
        }
        for r in rows
    ]


@router.post("/saved", status_code=status.HTTP_201_CREATED)
def save_report_snapshot(
    title: str = Query(..., min_length=1, max_length=180),
    report_type: str = Query(default="summary"),
    from_date: Optional[date] = Query(default=None),
    to_date: Optional[date] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Save current dashboard metrics as a snapshot."""
    bundle = get_reports_dashboard(
        db, current_user.id, from_date=from_date, to_date=to_date
    )
    overview = bundle.get("overview") or {}
    summary = (
        f"Revenue {overview.get('total_revenue', 0)} · "
        f"Profit {overview.get('total_profit', 0)} · "
        f"Orders {overview.get('total_orders', 0)}"
    )
    row = Report(
        owner_id=current_user.id,
        title=title,
        report_type=report_type or "summary",
        summary=summary,
        metrics=bundle,
        from_date=overview.get("from_date") or from_date,
        to_date=overview.get("to_date") or to_date,
        status="generated",
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {
        "id": row.id,
        "title": row.title,
        "report_type": row.report_type,
        "summary": row.summary,
        "created_at": row.created_at,
    }


@router.delete("/saved/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_saved_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    row = db.scalar(
        select(Report).where(
            Report.id == report_id,
            Report.owner_id == current_user.id,
        )
    )
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    db.delete(row)
    db.commit()
    return None