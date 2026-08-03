from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base


class Product(Base):
    __tablename__ = "products"

    # Primary Key
    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    # Owner (User)
    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )

    # Product Information
    name: Mapped[str] = mapped_column(
        String(160),
        index=True,
        nullable=False
    )

    category: Mapped[str | None] = mapped_column(
        String(120),
        nullable=True
    )

    sku: Mapped[str | None] = mapped_column(
        String(80),
        nullable=True,
        index=True
    )

    # Pricing
    selling_price: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    cost_price: Mapped[float] = mapped_column(
        Float,
        default=0,
        nullable=False
    )

    # Audit
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # ==========================
    # Relationships
    # ==========================

    # Product Owner
    owner = relationship(
        "User",
        back_populates="products"
    )

    # One Product -> One Inventory Record
    inventory = relationship(
        "Inventory",
        back_populates="product",
        uselist=False,
        cascade="all, delete-orphan"
    )

    # One Product -> Many Sales
    sales = relationship(
        "Sale",
        back_populates="product",
        cascade="all, delete-orphan"
    )

    # One Product -> Many Forecasts
    forecasts = relationship(
        "Forecast",
        back_populates="product",
        cascade="all, delete-orphan"
    )