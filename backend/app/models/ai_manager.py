"""
AI Store Manager ORM models

Live brief/actions are computed in ai_manager_service.py.
These tables store optional chat history and saved brief snapshots.
"""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base

if TYPE_CHECKING:
    from app.models.user import User


class AIManagerChat(Base):
    __tablename__ = "ai_manager_chats"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    question: Mapped[str] = mapped_column(Text, nullable=False)

    answer: Mapped[str] = mapped_column(Text, nullable=False)

    meta: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        nullable=False,
        default=dict,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    owner: Mapped["User"] = relationship(
        "User",
        back_populates="ai_manager_chats",
    )

    def __repr__(self):
        return f"<AIManagerChat(id={self.id}, owner_id={self.owner_id})>"


class AIManagerBriefSnapshot(Base):
    __tablename__ = "ai_manager_briefs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(180),
        nullable=False,
        default="Daily brief",
    )

    greeting: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default="",
    )

    payload: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        nullable=False,
        default=dict,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="saved",
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    owner: Mapped["User"] = relationship(
        "User",
        back_populates="ai_manager_briefs",
    )

    def __repr__(self):
        return f"<AIManagerBriefSnapshot(id={self.id}, title={self.title!r})>"