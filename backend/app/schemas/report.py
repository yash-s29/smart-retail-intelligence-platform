"""
Report schemas — Smart Retail Intelligence Platform

Used by:
  - app/services/reports_service.py
  - app/api/reports.py
  - frontend Reports page
"""

from __future__ import annotations

from datetime import date, datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# =====================================================
# Shared filters
# =====================================================

class ReportDateRange(BaseModel):
    from_date: Optional[date] = Field(
        default=None,
        description="Start date (inclusive). Default: 30 days ago.",
    )
    to_date: Optional[date] = Field(
        default=None,
        description="End date (inclusive). Default: today.",
    )


# =====================================================
# Overview KPIs
# =====================================================

class ReportOverviewResponse(BaseModel):
    from_date: date
    to_date: date
    total_revenue: float = 0.0
    total_profit: float = 0.0
    total_units: float = 0.0
    total_orders: int = 0
    avg_order_value: float = 0.0
    unique_products_sold: int = 0
    profit_margin_pct: float = 0.0
    # optional comparisons
    revenue_change_pct: Optional[float] = None
    status: str = "ok"


# =====================================================
# Sales trend (chart)
# =====================================================

class SalesTrendPoint(BaseModel):
    ds: str = Field(..., description="YYYY-MM-DD")
    revenue: float = 0.0
    profit: float = 0.0
    units: float = 0.0
    orders: int = 0


class SalesTrendResponse(BaseModel):
    from_date: date
    to_date: date
    points: List[SalesTrendPoint] = Field(default_factory=list)
    status: str = "ok"


# =====================================================
# Product performance
# =====================================================

class ProductPerformanceRow(BaseModel):
    product_id: int
    product_name: str
    category: Optional[str] = None
    units_sold: float = 0.0
    revenue: float = 0.0
    profit: float = 0.0
    margin_pct: float = 0.0
    orders: int = 0


class ProductPerformanceResponse(BaseModel):
    from_date: date
    to_date: date
    top: List[ProductPerformanceRow] = Field(default_factory=list)
    bottom: List[ProductPerformanceRow] = Field(default_factory=list)
    limit: int = 10
    status: str = "ok"


# =====================================================
# Inventory health
# =====================================================

class InventoryRiskRow(BaseModel):
    product_id: int
    product_name: str
    current_stock: int = 0
    reorder_level: int = 0
    safety_stock: Optional[int] = None
    stock_value: float = 0.0
    status: str = Field(
        default="ok",
        description="ok | low_stock | out_of_stock | overstock",
    )


class InventoryHealthResponse(BaseModel):
    total_skus: int = 0
    total_stock_units: int = 0
    total_stock_value: float = 0.0
    low_stock_count: int = 0
    out_of_stock_count: int = 0
    overstock_count: int = 0
    low_stock_items: List[InventoryRiskRow] = Field(default_factory=list)
    out_of_stock_items: List[InventoryRiskRow] = Field(default_factory=list)
    status: str = "ok"


# =====================================================
# Category mix
# =====================================================

class CategoryMixRow(BaseModel):
    category: str
    revenue: float = 0.0
    profit: float = 0.0
    units: float = 0.0
    share_pct: float = 0.0


class CategoryMixResponse(BaseModel):
    from_date: date
    to_date: date
    categories: List[CategoryMixRow] = Field(default_factory=list)
    status: str = "ok"


# =====================================================
# Forecast accuracy (ML loop)
# =====================================================

class ForecastAccuracyPoint(BaseModel):
    ds: str
    y_actual: Optional[float] = None
    yhat: Optional[float] = None
    residual: Optional[float] = None


class ForecastAccuracyResponse(BaseModel):
    model_type: Optional[str] = None
    n_points: int = 0
    mae: Optional[float] = None
    rmse: Optional[float] = None
    mape: Optional[float] = None
    points: List[ForecastAccuracyPoint] = Field(default_factory=list)
    recommendation: Optional[str] = None
    status: str = "ok"


# =====================================================
# Dashboard bundle (optional one-call for Reports page load)
# =====================================================

class ReportsDashboardResponse(BaseModel):
    overview: ReportOverviewResponse
    trend: SalesTrendResponse
    products: ProductPerformanceResponse
    inventory: InventoryHealthResponse
    category_mix: Optional[CategoryMixResponse] = None
    forecast_accuracy: Optional[ForecastAccuracyResponse] = None
    generated_at: datetime
    status: str = "ok"