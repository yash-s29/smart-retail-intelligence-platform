"""
AI Store Manager API
- Daily brief
- Action cards
- Grounded Q&A chat + history
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.ai_manager import (
    AIManagerActionsResponse,
    AIManagerAskRequest,
    AIManagerAskResponse,
    AIManagerBriefResponse,
    AIManagerChatHistoryResponse,
)
from app.services.auth_service import get_current_user
from app.services.ai_manager_service import (
    ask,
    build_brief,
    get_actions_only,
    list_chat_history,
)

router = APIRouter(prefix="/ai-manager", tags=["AI Store Manager"])


@router.get("/brief", response_model=AIManagerBriefResponse)
def ai_manager_brief(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Main payload for AI Store Manager page."""
    data = build_brief(db, current_user.id)
    return AIManagerBriefResponse(**data)


@router.get("/actions", response_model=AIManagerActionsResponse)
def ai_manager_actions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = get_actions_only(db, current_user.id)
    return AIManagerActionsResponse(**data)


@router.post("/ask", response_model=AIManagerAskResponse)
def ai_manager_ask(
    payload: AIManagerAskRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Grounded Q&A over inventory / sales / forecast."""
    data = ask(
        db,
        current_user.id,
        question=payload.question,
        include_forecast=payload.include_forecast,
        include_inventory=payload.include_inventory,
        include_sales=payload.include_sales,
        save_chat=True,
    )
    return AIManagerAskResponse(**data)


@router.get("/chat/history", response_model=AIManagerChatHistoryResponse)
def ai_manager_chat_history(
    limit: int = Query(default=20, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = list_chat_history(db, current_user.id, limit=limit)
    return AIManagerChatHistoryResponse(**data)