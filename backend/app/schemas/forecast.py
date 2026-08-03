"""
Forecast schemas — Smart Retail Intelligence Platform

Two layers:
1) Product-level forecast records (DB / CRUD / history)
2) ML daily-revenue forecast (ml.predict → API → frontend)
"""

from __future__ import annotations

from datetime import date, datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field


# =====================================================
# Create Forecast Request (product-level / DB)
# =====================================================

class ForecastCreate(BaseModel):
    product_id: int
    product_name: Optional[str] = None
    period_days: int = Field(
        default=30,
        ge=7,
        le=365,
        description="Forecast period in days",
    )


# =====================================================
# AI Prediction Request (product-level)
# =====================================================

class ForecastPredictRequest(BaseModel):
    product_id: int
    period_days: int = Field(
        default=30,
        ge=7,
        le=365,
        description="Forecast horizon in days",
    )
    model_name: str = Field(
        default="best",
        description="best | xgboost | random_forest | ridge",
    )


# =====================================================
# Train Model Request
# =====================================================

class ForecastTrainRequest(BaseModel):
    retrain: bool = True
    tune_xgb: bool = True
    force_rebuild_features: bool = False


# =====================================================
# Forecast Response (DB row)
# =====================================================

class ForecastRead(BaseModel):
    id: int
    owner_id: int
    product_id: int
    forecast_date: date
    period_days: int
    predicted_demand: float
    recommended_stock: int
    expected_revenue: float
    expected_profit: float
    model_name: str
    model_version: str
    confidence_score: float
    accuracy_score: Optional[float] = None
    status: str
    recommendation: Optional[str] = None
    warning: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =====================================================
# Forecast Dashboard Summary (DB list)
# =====================================================

class ForecastSummary(BaseModel):
    total_expected_revenue: float
    total_expected_profit: float
    average_confidence: float
    total_forecasts: int
    low_stock_products: int
    forecasts: List[ForecastRead]


# =====================================================
# Training Response
# =====================================================

class ForecastTrainResponse(BaseModel):
    success: bool
    message: str
    model_name: str
    model_version: str
    training_rows: int
    accuracy_score: float
    trained_at: datetime
    metrics: Optional[Dict[str, Any]] = None


# =====================================================
# Prediction Response (product-level wrapper)
# =====================================================

class ForecastPredictionResponse(BaseModel):
    success: bool
    message: str
    forecast: ForecastRead


# =====================================================
# ML daily series point (history / forecast)
# =====================================================

class ForecastPoint(BaseModel):
    ds: str = Field(..., description="YYYY-MM-DD")
    yhat: float
    y_actual: Optional[float] = None
    residual: Optional[float] = None
    horizon_step: Optional[int] = None
    split: Optional[str] = None
    model_type: Optional[str] = None


# =====================================================
# ML chain-level predict request (frontend Forecast page)
# =====================================================

class MLForecastRequest(BaseModel):
    horizon_days: int = Field(
        default=7,
        ge=1,
        le=90,
        description="How many future days to forecast",
    )
    model_name: str = Field(
        default="best",
        description="best | xgboost | random_forest | ridge",
    )
    include_history_days: int = Field(
        default=30,
        ge=0,
        le=365,
        description="Recent history points to return for charts",
    )


# =====================================================
# ML chain-level predict response
# =====================================================

class MLForecastResponse(BaseModel):
    status: str = "ok"
    model_type: Optional[str] = None
    model_path: Optional[str] = None
    horizon_days: int
    forecast_total_revenue: float
    forecast_avg_daily_revenue: float
    recommendation: str
    history: List[ForecastPoint] = Field(default_factory=list)
    forecast: List[ForecastPoint] = Field(default_factory=list)
    metrics: Dict[str, Any] = Field(default_factory=dict)


# =====================================================
# Models available response
# =====================================================

class ModelInfo(BaseModel):
    name: str
    path: str
    exists: bool
    model_type: Optional[str] = None
    is_best: bool = False


class ModelsListResponse(BaseModel):
    models: List[ModelInfo]
    default_model: str = "best"


# =====================================================
# Dashboard KPI payload for frontend
# =====================================================

class ForecastDashboardResponse(BaseModel):
    status: str = "ok"
    kpis: Dict[str, Any] = Field(
        default_factory=dict,
        description="total_forecast_revenue, avg_daily, history_days, etc.",
    )
    model_type: Optional[str] = None
    recommendation: str = ""
    history: List[ForecastPoint] = Field(default_factory=list)
    forecast: List[ForecastPoint] = Field(default_factory=list)
    metrics: Dict[str, Any] = Field(default_factory=dict)