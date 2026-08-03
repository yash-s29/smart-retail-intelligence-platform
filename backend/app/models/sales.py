from datetime import date, datetime
from typing import Optional

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


class Sale(Base):
    __tablename__ = "sales"

    # =====================================
    # Primary Key
    # =====================================

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    # =====================================
    # Foreign Keys
    # =====================================

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

    # =====================================
    # Invoice Information
    # =====================================

    invoice_number: Mapped[str] = mapped_column(
        String(40),
        unique=True,
        index=True,
        nullable=False,
    )

    sale_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )

    # =====================================
    # Product Details
    # =====================================

    quantity_sold: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    unit_price: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    discount: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False,
    )

    tax: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False,
    )

    total_amount: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    profit: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False,
    )

    # =====================================
    # Customer Information
    # =====================================

    customer_name: Mapped[Optional[str]] = mapped_column(
        String(150),
        nullable=True,
    )

    customer_phone: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True,
    )

    customer_email: Mapped[Optional[str]] = mapped_column(
        String(150),
        nullable=True,
    )

    # =====================================
    # Payment
    # =====================================

    payment_method: Mapped[str] = mapped_column(
        String(30),
        default="Cash",
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="Completed",
        nullable=False,
    )

    # =====================================
    # Extra Information
    # =====================================

    notes: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # =====================================
    # Audit Fields
    # =====================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # =====================================
    # Relationships
    # =====================================

    owner = relationship(
        "User",
        back_populates="sales",
    )

    product = relationship(
        "Product",
        back_populates="sales",
    )

    @property
    def product_name(self) -> str | None:
        """Expose the related product name in sale API responses."""
        return self.product.name if self.product else None

    # =====================================
    # Representation
    # =====================================

    def __repr__(self):
        return (
            f"<Sale("
            f"id={self.id}, "
            f"invoice='{self.invoice_number}', "
            f"product_id={self.product_id}, "
            f"quantity={self.quantity_sold}, "
            f"total={self.total_amount})>"
        )
