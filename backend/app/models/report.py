"""
Report ORM model — saved report snapshots for the owner.

Live analytics (overview / products / inventory / forecast accuracy)
are computed on demand in reports_service.py.
This table stores optional saved/exportable report records.
"""

from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING, Any, Dict, Optional

from sqlalchemy import Date, DateTime, ForeignKey, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base

if TYPE_CHECKING:
    from app.models.user import User  # noqa: F401


class Report(Base):
    __tablename__ = "reports"

    # ==========================================
    # Primary key
    # ==========================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    # ==========================================
    # Owner
    # ==========================================

    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # ==========================================
    # Report identity
    # ==========================================

    title: Mapped[str] = mapped_column(
        String(180),
        nullable=False,
    )

    # summary | sales | products | inventory | forecast | custom
    report_type: Mapped[str] = mapped_column(
        String(80),
        nullable=False,
        default="summary",
        index=True,
    )

    summary: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="",
    )

    # Flexible payload: KPIs, tables, chart points, etc.
    metrics: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        nullable=False,
        default=dict,
    )

    # ==========================================
    # Optional period covered by this snapshot
    # ==========================================

    from_date: Mapped[Optional[date]] = mapped_column(
        Date,
        nullable=True,
    )

    to_date: Mapped[Optional[date]] = mapped_column(
        Date,
        nullable=True,
    )

    # draft | generated | archived
    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="generated",
        index=True,
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
        back_populates="reports",
    )

    def __repr__(self) -> str:
        return (
            f"<Report(id={self.id}, type={self.report_type!r}, "
            f"title={self.title!r}, owner_id={self.owner_id})>"
        )