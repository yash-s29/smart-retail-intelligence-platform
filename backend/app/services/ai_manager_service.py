"""
AI Store Manager service

Builds:
  - daily brief (greeting + bullets + KPIs)
  - action cards (stock / forecast / margin / data)
  - grounded Q&A (rule-based over live metrics — no external LLM required)

Reuses reports_service + ml.predict when available.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.ai_manager import AIManagerChat
from app.services.reports_service import (
    get_forecast_accuracy,
    get_inventory_health,
    get_overview,
)


# =====================================================
# Helpers
# =====================================================

def _now() -> datetime:
    return datetime.now(timezone.utc)


def _money(n: float) -> str:
    try:
        return f"₹{float(n):,.0f}"
    except Exception:
        return "₹0"


def _greeting(n_high: int) -> str:
    hour = datetime.now().hour
    if hour < 12:
        part = "Good morning"
    elif hour < 17:
        part = "Good afternoon"
    else:
        part = "Good evening"
    if n_high <= 0:
        return f"{part} — your store looks stable today"
    if n_high == 1:
        return f"{part} — 1 item needs attention"
    return f"{part} — {n_high} things need attention"


def _ml_forecast(horizon: int = 7) -> Dict[str, Any]:
    try:
        from pathlib import Path
        import sys

        here = Path(__file__).resolve()
        for root in (here.parents[3], here.parents[2], Path.cwd(), Path.cwd().parent):
            if (root / "ml").exists() and str(root) not in sys.path:
                sys.path.insert(0, str(root))
                break

        from ml.predict import forecast_service

        return forecast_service(
            horizon=horizon,
            model_name="best",
            include_history_days=14,
        )
    except Exception as exc:
        return {
            "status": "error",
            "error": str(exc),
            "forecast_total_revenue": 0,
            "forecast_avg_daily_revenue": 0,
            "recommendation": None,
            "model_type": None,
        }


# =====================================================
# Action cards
# =====================================================

def build_actions(
    inventory: Dict[str, Any],
    overview: Dict[str, Any],
    forecast: Dict[str, Any],
) -> List[Dict[str, Any]]:
    actions: List[Dict[str, Any]] = []

    out_n = int(inventory.get("out_of_stock_count") or 0)
    low_n = int(inventory.get("low_stock_count") or 0)
    low_items = inventory.get("low_stock_items") or []
    out_items = inventory.get("out_of_stock_items") or []

    if out_n > 0:
        names = ", ".join(
            (i.get("product_name") or "SKU") for i in out_items[:3]
        )
        actions.append(
            {
                "id": f"out-{uuid4().hex[:8]}",
                "priority": "high",
                "category": "stock",
                "title": f"{out_n} product(s) out of stock",
                "message": f"Restock soon: {names}" if names else "Open inventory to restock.",
                "metric_label": "Out of stock",
                "metric_value": str(out_n),
                "link": {"label": "Open inventory", "href": "/inventory"},
            }
        )

    if low_n > 0:
        names = ", ".join(
            (i.get("product_name") or "SKU") for i in low_items[:3]
        )
        actions.append(
            {
                "id": f"low-{uuid4().hex[:8]}",
                "priority": "high" if low_n >= 3 else "medium",
                "category": "stock",
                "title": f"{low_n} product(s) below reorder",
                "message": f"Review: {names}" if names else "Check reorder levels.",
                "metric_label": "Low stock",
                "metric_value": str(low_n),
                "link": {"label": "View alerts", "href": "/inventory/alerts"},
            }
        )

    if forecast.get("status") == "ok":
        total = float(forecast.get("forecast_total_revenue") or 0)
        avg = float(forecast.get("forecast_avg_daily_revenue") or 0)
        actions.append(
            {
                "id": f"fc-{uuid4().hex[:8]}",
                "priority": "medium",
                "category": "forecast",
                "title": "Next 7 days demand outlook",
                "message": (
                    forecast.get("recommendation")
                    or f"Expected about {_money(total)} total · {_money(avg)} per day."
                ),
                "metric_label": "7-day forecast",
                "metric_value": _money(total),
                "link": {"label": "Open forecast", "href": "/forecast"},
            }
        )
    else:
        actions.append(
            {
                "id": f"fc-off-{uuid4().hex[:8]}",
                "priority": "medium",
                "category": "data",
                "title": "Forecast engine offline",
                "message": "Train models and ensure the API can import ml.predict.",
                "metric_label": "ML",
                "metric_value": "Offline",
                "link": {"label": "Setup forecast", "href": "/forecast"},
            }
        )

    revenue = float(overview.get("total_revenue") or 0)
    profit = float(overview.get("total_profit") or 0)
    margin = float(overview.get("profit_margin_pct") or 0)
    if revenue > 0 and margin < 10:
        actions.append(
            {
                "id": f"margin-{uuid4().hex[:8]}",
                "priority": "medium",
                "category": "margin",
                "title": "Margin looks tight",
                "message": (
                    f"Period margin is {margin:.1f}% "
                    f"(profit {_money(profit)} on {_money(revenue)} revenue). "
                    "Review cost price or discounting."
                ),
                "metric_label": "Margin",
                "metric_value": f"{margin:.1f}%",
                "link": {"label": "Open reports", "href": "/reports"},
            }
        )

    if int(overview.get("total_orders") or 0) == 0:
        actions.append(
            {
                "id": f"sales-{uuid4().hex[:8]}",
                "priority": "low",
                "category": "data",
                "title": "No sales in selected period",
                "message": "Add completed sales so reports and product tips improve.",
                "metric_label": "Orders",
                "metric_value": "0",
                "link": {"label": "Add sale", "href": "/sales/add"},
            }
        )

    # sort high → medium → low
    order = {"high": 0, "medium": 1, "low": 2}
    actions.sort(key=lambda a: order.get(a.get("priority", "medium"), 1))
    return actions


# =====================================================
# Brief
# =====================================================

def build_brief(db: Session, owner_id: int) -> Dict[str, Any]:
    overview = get_overview(db, owner_id)
    inventory = get_inventory_health(db, owner_id)
    forecast = _ml_forecast(horizon=7)

    actions = build_actions(inventory, overview, forecast)
    high = sum(1 for a in actions if a.get("priority") == "high")

    bullets: List[Dict[str, Any]] = []
    out_n = int(inventory.get("out_of_stock_count") or 0)
    low_n = int(inventory.get("low_stock_count") or 0)

    if out_n or low_n:
        bullets.append(
            {
                "icon": "warning",
                "text": f"{out_n} out of stock · {low_n} below reorder",
                "href": "/inventory",
            }
        )
    else:
        bullets.append(
            {
                "icon": "success",
                "text": "Inventory levels look healthy",
                "href": "/inventory",
            }
        )

    if forecast.get("status") == "ok":
        bullets.append(
            {
                "icon": "trend",
                "text": (
                    f"Next 7 days ≈ {_money(forecast.get('forecast_total_revenue') or 0)} "
                    f"(avg {_money(forecast.get('forecast_avg_daily_revenue') or 0)}/day)"
                ),
                "href": "/forecast",
            }
        )
    else:
        bullets.append(
            {
                "icon": "info",
                "text": "Connect / train ML forecast for demand outlook",
                "href": "/forecast",
            }
        )

    if overview.get("total_revenue"):
        bullets.append(
            {
                "icon": "tip",
                "text": (
                    f"Recent period: {_money(overview.get('total_revenue'))} revenue · "
                    f"{overview.get('profit_margin_pct', 0):.1f}% margin"
                ),
                "href": "/reports",
            }
        )

    kpis = [
        {
            "label": "7-day forecast",
            "value": _money(forecast.get("forecast_total_revenue") or 0)
            if forecast.get("status") == "ok"
            else "Offline",
            "sub": forecast.get("model_type") or "ML",
            "tone": "success" if forecast.get("status") == "ok" else "info",
        },
        {
            "label": "Low stock",
            "value": str(low_n),
            "sub": "Below reorder",
            "tone": "warning" if low_n else "success",
        },
        {
            "label": "Out of stock",
            "value": str(out_n),
            "sub": "Needs restock",
            "tone": "error" if out_n else "success",
        },
        {
            "label": "Period revenue",
            "value": _money(overview.get("total_revenue") or 0),
            "sub": f"{overview.get('total_orders') or 0} orders",
            "tone": "info",
        },
    ]

    return {
        "status": "ok",
        "greeting": _greeting(high),
        "generated_at": _now(),
        "bullets": bullets,
        "kpis": kpis,
        "actions": actions,
        "forecast_summary": {
            "total": forecast.get("forecast_total_revenue"),
            "avg_daily": forecast.get("forecast_avg_daily_revenue"),
            "model_type": forecast.get("model_type"),
            "status": forecast.get("status"),
        },
        "inventory_summary": {
            "low_stock_count": low_n,
            "out_of_stock_count": out_n,
            "total_skus": inventory.get("total_skus"),
            "total_stock_value": inventory.get("total_stock_value"),
        },
        "recommendation": forecast.get("recommendation"),
        "model_type": forecast.get("model_type"),
    }


def get_actions_only(db: Session, owner_id: int) -> Dict[str, Any]:
    overview = get_overview(db, owner_id)
    inventory = get_inventory_health(db, owner_id)
    forecast = _ml_forecast(horizon=7)
    return {
        "status": "ok",
        "actions": build_actions(inventory, overview, forecast),
        "generated_at": _now(),
    }


# =====================================================
# Grounded Q&A (rule-based)
# =====================================================

def _match(question: str, *keywords: str) -> bool:
    q = question.lower()
    return any(k in q for k in keywords)


def ask(
    db: Session,
    owner_id: int,
    question: str,
    include_forecast: bool = True,
    include_inventory: bool = True,
    include_sales: bool = True,
    save_chat: bool = True,
) -> Dict[str, Any]:
    q = (question or "").strip()
    overview = get_overview(db, owner_id) if include_sales else {}
    inventory = get_inventory_health(db, owner_id) if include_inventory else {}
    forecast = _ml_forecast(7) if include_forecast else {}
    accuracy = get_forecast_accuracy(30) if include_forecast else {}

    actions: List[Dict[str, Any]] = []
    sources: List[Dict[str, Any]] = []
    answer = ""

    if _match(q, "reorder", "restock", "low stock", "out of stock", "inventory"):
        low = int(inventory.get("low_stock_count") or 0)
        out = int(inventory.get("out_of_stock_count") or 0)
        low_items = inventory.get("low_stock_items") or []
        out_items = inventory.get("out_of_stock_items") or []
        lines = [
            f"Inventory check: {out} out of stock, {low} below reorder.",
        ]
        if out_items:
            lines.append(
                "Out of stock: "
                + ", ".join(i.get("product_name", "?") for i in out_items[:5])
            )
        if low_items:
            lines.append(
                "Low stock: "
                + ", ".join(
                    f"{i.get('product_name')} ({i.get('current_stock')}/{i.get('reorder_level')})"
                    for i in low_items[:5]
                )
            )
        if not out and not low:
            lines.append("No urgent restock actions right now.")
        answer = " ".join(lines)
        actions = [
            a
            for a in build_actions(inventory, overview, forecast)
            if a.get("category") == "stock"
        ]
        sources.append({"name": "inventory", "detail": "live stock levels"})

    elif _match(q, "forecast", "demand", "next week", "predict", "revenue outlook"):
        if forecast.get("status") == "ok":
            answer = (
                f"Using model `{forecast.get('model_type') or 'best'}`: "
                f"next 7 days ≈ {_money(forecast.get('forecast_total_revenue') or 0)} "
                f"(about {_money(forecast.get('forecast_avg_daily_revenue') or 0)} per day). "
            )
            if forecast.get("recommendation"):
                answer += str(forecast["recommendation"])
            if accuracy.get("mape") is not None:
                answer += f" Recent MAPE ≈ {accuracy['mape']:.1f}%."
        else:
            answer = (
                "Forecast is offline. Train with `python -m ml.train_model` "
                "and ensure the API PYTHONPATH includes the project root."
            )
        actions = [
            a
            for a in build_actions(inventory, overview, forecast)
            if a.get("category") in ("forecast", "data")
        ]
        sources.append({"name": "ml.predict", "detail": "7-day chain forecast"})

    elif _match(q, "sales", "revenue", "profit", "margin", "orders"):
        answer = (
            f"In the default report window: "
            f"revenue {_money(overview.get('total_revenue') or 0)}, "
            f"profit {_money(overview.get('total_profit') or 0)}, "
            f"margin {float(overview.get('profit_margin_pct') or 0):.1f}%, "
            f"orders {int(overview.get('total_orders') or 0)}, "
            f"units {float(overview.get('total_units') or 0):.0f}."
        )
        sources.append({"name": "sales", "detail": "reports overview"})
        actions.append(
            {
                "id": f"rep-{uuid4().hex[:8]}",
                "priority": "low",
                "category": "data",
                "title": "See full reports",
                "message": "Open the Reports page for trends and product ranks.",
                "link": {"label": "Reports", "href": "/reports"},
            }
        )

    elif _match(q, "what should i do", "priority", "today", "attention", "help"):
        brief = build_brief(db, owner_id)
        answer = brief["greeting"] + ". " + " ".join(
            b.get("text", "") for b in brief.get("bullets", [])[:3]
        )
        actions = brief.get("actions") or []
        sources.append({"name": "brief", "detail": "combined inventory + forecast + sales"})

    else:
        answer = (
            "I can help with restock priorities, 7-day demand forecast, "
            "sales/revenue/margin, or “what should I do today?”. "
            "Ask one of those for a grounded answer from your live data."
        )
        sources.append({"name": "assistant", "detail": "capability hint"})

    result = {
        "status": "ok",
        "question": q,
        "answer": answer,
        "actions": actions[:5],
        "sources": sources,
        "generated_at": _now(),
    }

    if save_chat and q:
        try:
            row = AIManagerChat(
                owner_id=owner_id,
                question=q,
                answer=answer,
                meta={
                    "actions": actions[:5],
                    "sources": sources,
                },
            )
            db.add(row)
            db.commit()
        except Exception:
            db.rollback()

    return result


def list_chat_history(
    db: Session,
    owner_id: int,
    limit: int = 20,
) -> Dict[str, Any]:
    from sqlalchemy import select

    limit = max(1, min(int(limit or 20), 50))
    rows = db.scalars(
        select(AIManagerChat)
        .where(AIManagerChat.owner_id == owner_id)
        .order_by(AIManagerChat.created_at.desc())
        .limit(limit)
    ).all()

    messages: List[Dict[str, Any]] = []
    for r in reversed(list(rows)):
        messages.append(
            {
                "role": "user",
                "content": r.question,
                "actions": [],
                "created_at": r.created_at,
            }
        )
        messages.append(
            {
                "role": "assistant",
                "content": r.answer,
                "actions": (r.meta or {}).get("actions") or [],
                "created_at": r.created_at,
            }
        )

    return {"status": "ok", "messages": messages}