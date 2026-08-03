from datetime import date
from typing import Optional

from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.models.forecast import Forecast


# ==========================================================
# Create Forecast
# ==========================================================

def create_forecast(
    db: Session,
    forecast: Forecast,
) -> Forecast:
    db.add(forecast)
    db.commit()
    db.refresh(forecast)
    return forecast


# ==========================================================
# Get Forecast By ID
# ==========================================================

def get_forecast_by_id(
    db: Session,
    forecast_id: int,
    owner_id: int,
) -> Optional[Forecast]:
    return (
        db.query(Forecast)
        .filter(
            Forecast.id == forecast_id,
            Forecast.owner_id == owner_id,
        )
        .first()
    )


# ==========================================================
# Get Latest Forecast For Product
# ==========================================================

def get_latest_product_forecast(
    db: Session,
    owner_id: int,
    product_id: int,
) -> Optional[Forecast]:
    return (
        db.query(Forecast)
        .filter(
            Forecast.owner_id == owner_id,
            Forecast.product_id == product_id,
        )
        .order_by(desc(Forecast.forecast_date))
        .first()
    )


# ==========================================================
# Get All Forecasts
# ==========================================================

def get_all_forecasts(
    db: Session,
    owner_id: int,
):
    return (
        db.query(Forecast)
        .filter(
            Forecast.owner_id == owner_id,
        )
        .order_by(desc(Forecast.forecast_date))
        .all()
    )


# ==========================================================
# Get Product Forecast History
# ==========================================================

def get_product_forecast_history(
    db: Session,
    owner_id: int,
    product_id: int,
):
    return (
        db.query(Forecast)
        .filter(
            Forecast.owner_id == owner_id,
            Forecast.product_id == product_id,
        )
        .order_by(desc(Forecast.forecast_date))
        .all()
    )


# ==========================================================
# Get Forecast By Date
# ==========================================================

def get_forecasts_by_date(
    db: Session,
    owner_id: int,
    forecast_date: date,
):
    return (
        db.query(Forecast)
        .filter(
            Forecast.owner_id == owner_id,
            Forecast.forecast_date == forecast_date,
        )
        .all()
    )


# ==========================================================
# Update Forecast
# ==========================================================

def update_forecast(
    db: Session,
    forecast: Forecast,
) -> Forecast:
    db.commit()
    db.refresh(forecast)
    return forecast


# ==========================================================
# Delete Forecast
# ==========================================================

def delete_forecast(
    db: Session,
    forecast: Forecast,
):
    db.delete(forecast)
    db.commit()


# ==========================================================
# Delete All Forecasts Of Owner
# ==========================================================

def delete_all_forecasts(
    db: Session,
    owner_id: int,
):
    (
        db.query(Forecast)
        .filter(
            Forecast.owner_id == owner_id,
        )
        .delete()
    )

    db.commit()


# ==========================================================
# Dashboard Summary
# ==========================================================

def get_dashboard_summary(
    db: Session,
    owner_id: int,
):
    forecasts = (
        db.query(Forecast)
        .filter(
            Forecast.owner_id == owner_id,
        )
        .all()
    )

    total_expected_revenue = sum(
        forecast.expected_revenue
        for forecast in forecasts
    )

    total_expected_profit = sum(
        forecast.expected_profit
        for forecast in forecasts
    )

    average_confidence = (
        sum(
            forecast.confidence_score
            for forecast in forecasts
        )
        / len(forecasts)
        if forecasts
        else 0
    )

    low_stock_products = sum(
        1
        for forecast in forecasts
        if forecast.recommended_stock <= 10
    )

    return {
        "total_expected_revenue": total_expected_revenue,
        "total_expected_profit": total_expected_profit,
        "average_confidence": round(
            average_confidence,
            2,
        ),
        "total_forecasts": len(forecasts),
        "low_stock_products": low_stock_products,
        "forecasts": forecasts,
    }