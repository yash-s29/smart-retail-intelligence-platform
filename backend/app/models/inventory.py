from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base


class Inventory(Base):
    __tablename__ = "inventory"

    # Primary Key
    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    # Product Relationship (One Product -> One Inventory Record)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"),
        unique=True,
        index=True,
        nullable=False,
    )

    # Stock Information
    current_stock: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    minimum_stock: Mapped[int] = mapped_column(
        Integer,
        default=10,
        nullable=False,
    )

    maximum_stock: Mapped[int] = mapped_column(
        Integer,
        default=1000,
        nullable=False,
    )

    reorder_level: Mapped[int] = mapped_column(
        Integer,
        default=20,
        nullable=False,
    )

    safety_stock: Mapped[int] = mapped_column(
        Integer,
        default=30,
        nullable=False,
    )

    # Inventory Details
    warehouse: Mapped[str] = mapped_column(
        String(100),
        default="Main Warehouse",
        nullable=False,
    )

    supplier: Mapped[str] = mapped_column(
    String(150),
    default="Unknown Supplier",
    nullable=False,
    )

    # Inventory Status
    status: Mapped[str] = mapped_column(
        String(30),
        default="In Stock",
        nullable=False,
    )

    # Audit Fields
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationship
    product = relationship(
        "Product",
        back_populates="inventory",
    )