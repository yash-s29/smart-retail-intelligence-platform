"""
Forecast ORM model — product-level forecast records stored in DB.

Chain-level daily ML forecasts (ml.predict) are served live via API.
This table stores saved product forecasts for history / dashboard / audit.
"""

from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import (
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base

if TYPE_CHECKING:
    from app.models.user import User  # noqa: F401
    from app.models.product import Product  # noqa: F401


class Forecast(Base):
    __tablename__ = "forecasts"

    # ==========================================
    # Primary Key
    # ==========================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    # ==========================================
    # Foreign Keys
    # ==========================================

    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # ==========================================
    # Forecast window
    # ==========================================

    forecast_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
        comment="Date the forecast was generated (or start date of horizon)",
    )

    period_days: Mapped[int] = mapped_column(
        Integer,
        default=30,
        nullable=False,
        comment="Horizon length in days",
    )

    # ==========================================
    # AI prediction results
    # ==========================================

    predicted_demand: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
        comment="Predicted units over the period",
    )

    recommended_stock: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        comment="Suggested stock to hold / reorder",
    )

    expected_revenue: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    expected_profit: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    # ==========================================
    # Model metadata
    # ==========================================

    model_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="best",
        comment="best | xgboost | random_forest | ridge",
    )

    model_version: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="v1.0",
    )

    confidence_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
        comment="0–1 confidence style score",
    )

    accuracy_score: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
        comment="Optional MAPE/accuracy from validation",
    )

    # ==========================================
    # Status
    # ==========================================
    # Generated | Processing | Failed | Approved

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="Generated",
        index=True,
    )

    # ==========================================
    # AI notes
    # ==========================================

    recommendation: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    warning: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # ==========================================
    # Audit
    # ==========================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # ==========================================
    # Relationships
    # ==========================================

    owner = relationship(
        "User",
        back_populates="forecasts",
    )

    product = relationship(
        "Product",
        back_populates="forecasts",
    )

    # ==========================================
    # Helpers
    # ==========================================

    @property
    def product_name(self) -> Optional[str]:
        return self.product.name if self.product else None

    def __repr__(self) -> str:
        return (
            f"<Forecast(id={self.id}, product={self.product_id}, "
            f"demand={self.predicted_demand}, model='{self.model_name}', "
            f"confidence={self.confidence_score})>"
        )