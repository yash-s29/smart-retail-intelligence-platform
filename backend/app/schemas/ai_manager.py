"""
AI Store Manager schemas — Smart Retail Intelligence Platform

Daily brief, action cards, and optional grounded Q&A chat.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# =====================================================
# Shared
# =====================================================

class ActionLink(BaseModel):
    label: str
    href: str = Field(..., description="Frontend path, e.g. /inventory")


class ActionCard(BaseModel):
    id: str
    priority: str = Field(
        default="medium",
        description="high | medium | low",
    )
    category: str = Field(
        default="general",
        description="stock | forecast | promo | margin | data",
    )
    title: str
    message: str
    metric_label: Optional[str] = None
    metric_value: Optional[str] = None
    link: Optional[ActionLink] = None


class BriefBullet(BaseModel):
    icon: str = Field(default="info", description="warning | trend | tip | success | info")
    text: str
    href: Optional[str] = None


class ManagerKPI(BaseModel):
    label: str
    value: str
    sub: Optional[str] = None
    tone: str = Field(default="info", description="info | success | warning | error")


# =====================================================
# Daily brief (main page load)
# =====================================================

class AIManagerBriefResponse(BaseModel):
    status: str = "ok"
    greeting: str
    generated_at: datetime
    bullets: List[BriefBullet] = Field(default_factory=list)
    kpis: List[ManagerKPI] = Field(default_factory=list)
    actions: List[ActionCard] = Field(default_factory=list)
    forecast_summary: Optional[Dict[str, Any]] = None
    inventory_summary: Optional[Dict[str, Any]] = None
    recommendation: Optional[str] = None
    model_type: Optional[str] = None


class AIManagerActionsResponse(BaseModel):
    status: str = "ok"
    actions: List[ActionCard] = Field(default_factory=list)
    generated_at: datetime


# =====================================================
# Chat / Q&A
# =====================================================

class AIManagerAskRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=2,
        max_length=500,
        description="Natural language question about store operations",
    )
    include_forecast: bool = True
    include_inventory: bool = True
    include_sales: bool = True


class ChatSource(BaseModel):
    name: str
    detail: Optional[str] = None


class AIManagerAskResponse(BaseModel):
    status: str = "ok"
    question: str
    answer: str
    actions: List[ActionCard] = Field(default_factory=list)
    sources: List[ChatSource] = Field(default_factory=list)
    generated_at: datetime


class ChatMessage(BaseModel):
    role: str = Field(..., description="user | assistant")
    content: str
    actions: List[ActionCard] = Field(default_factory=list)
    created_at: Optional[datetime] = None


class AIManagerChatHistoryResponse(BaseModel):
    status: str = "ok"
    messages: List[ChatMessage] = Field(default_factory=list)