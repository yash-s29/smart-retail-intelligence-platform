from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    full_name: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    store_name: Mapped[str] = mapped_column(
        String(160),
        nullable=False,
    )

    store_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    location: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    business_category: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # ==========================================================
    # Product Relationship
    # ==========================================================
    products = relationship(
        "Product",
        back_populates="owner",
        cascade="all, delete-orphan",
    )

    # ==========================================================
    # Sales Relationship
    # ==========================================================
    sales = relationship(
        "Sale",
        back_populates="owner",
        cascade="all, delete-orphan",
    )

    # ==========================================================
    # Reports Relationship
    # ==========================================================
    reports = relationship(
        "Report",
        back_populates="owner",
        cascade="all, delete-orphan",
    )

    # ==========================================================
    # Forecast Relationship
    # ==========================================================
    forecasts = relationship(
        "Forecast",
        back_populates="owner",
        cascade="all, delete-orphan",
    )

    # ==========================================================
    # AI Store Manager Relationships
    # ==========================================================
    ai_manager_chats = relationship(
        "AIManagerChat",
        back_populates="owner",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    ai_manager_briefs = relationship(
        "AIManagerBriefSnapshot",
        back_populates="owner",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}')>"