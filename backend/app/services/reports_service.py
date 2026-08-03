"""
Reports service — Smart Retail Intelligence Platform

Builds overview, product performance, inventory health,
sales trend, category mix, and ML forecast accuracy.
"""

from __future__ import annotations

from datetime import date, datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.inventory import Inventory
from app.models.product import Product
from app.models.sales import Sale


# =====================================================
# Date helpers
# =====================================================

def _resolve_range(
    from_date: Optional[date],
    to_date: Optional[date],
    default_days: int = 30,
) -> Tuple[date, date]:
    end = to_date or date.today()
    start = from_date or (end - timedelta(days=default_days - 1))
    if start > end:
        start, end = end, start
    return start, end


def _owner_product_ids(db: Session, owner_id: int) -> List[int]:
    rows = db.scalars(
        select(Product.id).where(Product.owner_id == owner_id)
    ).all()
    return list(rows)


# =====================================================
# Overview KPIs
# =====================================================

def get_overview(
    db: Session,
    owner_id: int,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
) -> Dict[str, Any]:
    start, end = _resolve_range(from_date, to_date)
    product_ids = _owner_product_ids(db, owner_id)

    empty = {
        "from_date": start,
        "to_date": end,
        "total_revenue": 0.0,
        "total_profit": 0.0,
        "total_units": 0.0,
        "total_orders": 0,
        "avg_order_value": 0.0,
        "unique_products_sold": 0,
        "profit_margin_pct": 0.0,
        "revenue_change_pct": None,
        "status": "ok",
    }
    if not product_ids:
        return empty

    # Prefer explicit revenue/profit columns; fallback to price * qty
    q = (
        select(
            func.coalesce(func.sum(Sale.total_amount), 0).label("revenue"),
            func.coalesce(func.sum(Sale.quantity_sold), 0).label("units"),
            func.count(Sale.id).label("orders"),
            func.count(func.distinct(Sale.product_id)).label("products"),
        )
        .where(
            Sale.product_id.in_(product_ids),
            Sale.sale_date >= start,
            Sale.sale_date <= end,
        )
    )
    # Optional status filter if column exists in data
    try:
        q = q.where(Sale.status == "Completed")
    except Exception:
        pass

    row = db.execute(q).one()
    revenue = float(row.revenue or 0)
    units = float(row.units or 0)
    orders = int(row.orders or 0)
    products = int(row.products or 0)

    # Profit: try sale-level profit, else estimate from product margins
    profit = 0.0
    try:
        profit_q = (
            select(func.coalesce(func.sum(Sale.profit), 0))
            .where(
                Sale.product_id.in_(product_ids),
                Sale.sale_date >= start,
                Sale.sale_date <= end,
            )
        )
        try:
            profit_q = profit_q.where(Sale.status == "Completed")
        except Exception:
            pass
        profit = float(db.scalar(profit_q) or 0)
    except Exception:
        # estimate: sum (selling - cost) * qty via join
        try:
            est = db.execute(
                select(
                    func.coalesce(
                        func.sum(
                            (Product.selling_price - Product.cost_price)
                            * Sale.quantity_sold
                        ),
                        0,
                    )
                )
                .join(Product, Product.id == Sale.product_id)
                .where(
                    Sale.product_id.in_(product_ids),
                    Sale.sale_date >= start,
                    Sale.sale_date <= end,
                )
            ).scalar()
            profit = float(est or 0)
        except Exception:
            profit = 0.0

    avg_order = revenue / orders if orders else 0.0
    margin = (profit / revenue * 100.0) if revenue else 0.0

    return {
        "from_date": start,
        "to_date": end,
        "total_revenue": round(revenue, 2),
        "total_profit": round(profit, 2),
        "total_units": round(units, 2),
        "total_orders": orders,
        "avg_order_value": round(avg_order, 2),
        "unique_products_sold": products,
        "profit_margin_pct": round(margin, 2),
        "revenue_change_pct": None,
        "status": "ok",
    }


# =====================================================
# Daily sales trend
# =====================================================

def get_sales_trend(
    db: Session,
    owner_id: int,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
) -> Dict[str, Any]:
    start, end = _resolve_range(from_date, to_date)
    product_ids = _owner_product_ids(db, owner_id)

    if not product_ids:
        return {
            "from_date": start,
            "to_date": end,
            "points": [],
            "status": "ok",
        }

    q = (
        select(
            Sale.sale_date.label("ds"),
            func.coalesce(func.sum(Sale.total_amount), 0).label("revenue"),
            func.coalesce(func.sum(Sale.quantity_sold), 0).label("units"),
            func.count(Sale.id).label("orders"),
        )
        .where(
            Sale.product_id.in_(product_ids),
            Sale.sale_date >= start,
            Sale.sale_date <= end,
        )
        .group_by(Sale.sale_date)
        .order_by(Sale.sale_date)
    )
    try:
        q = q.where(Sale.status == "Completed")
    except Exception:
        pass

    rows = db.execute(q).all()

    # profit per day (best effort)
    profit_map: Dict[str, float] = {}
    try:
        pq = (
            select(
                Sale.sale_date.label("ds"),
                func.coalesce(func.sum(Sale.profit), 0).label("profit"),
            )
            .where(
                Sale.product_id.in_(product_ids),
                Sale.sale_date >= start,
                Sale.sale_date <= end,
            )
            .group_by(Sale.sale_date)
        )
        for r in db.execute(pq).all():
            profit_map[str(r.ds)] = float(r.profit or 0)
    except Exception:
        pass

    points = []
    for r in rows:
        ds = r.ds.isoformat() if hasattr(r.ds, "isoformat") else str(r.ds)
        points.append(
            {
                "ds": ds,
                "revenue": float(r.revenue or 0),
                "profit": profit_map.get(ds, 0.0),
                "units": float(r.units or 0),
                "orders": int(r.orders or 0),
            }
        )

    return {
        "from_date": start,
        "to_date": end,
        "points": points,
        "status": "ok",
    }


# =====================================================
# Product performance
# =====================================================

def get_product_performance(
    db: Session,
    owner_id: int,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    limit: int = 10,
) -> Dict[str, Any]:
    start, end = _resolve_range(from_date, to_date)
    limit = max(1, min(int(limit or 10), 50))

    q = (
        select(
            Product.id.label("product_id"),
            Product.name.label("product_name"),
            getattr(Product, "category", None),
            func.coalesce(func.sum(Sale.quantity_sold), 0).label("units_sold"),
            func.coalesce(func.sum(Sale.total_amount), 0).label("revenue"),
            func.count(Sale.id).label("orders"),
        )
        .join(Sale, Sale.product_id == Product.id)
        .where(
            Product.owner_id == owner_id,
            Sale.sale_date >= start,
            Sale.sale_date <= end,
        )
        .group_by(Product.id, Product.name)
        .order_by(func.sum(Sale.total_amount).desc())
    )
    try:
        q = q.where(Sale.status == "Completed")
    except Exception:
        pass

    # category group_by if column exists
    try:
        if hasattr(Product, "category"):
            q = (
                select(
                    Product.id.label("product_id"),
                    Product.name.label("product_name"),
                    Product.category.label("category"),
                    func.coalesce(func.sum(Sale.quantity_sold), 0).label("units_sold"),
                    func.coalesce(func.sum(Sale.total_amount), 0).label("revenue"),
                    func.count(Sale.id).label("orders"),
                )
                .join(Sale, Sale.product_id == Product.id)
                .where(
                    Product.owner_id == owner_id,
                    Sale.sale_date >= start,
                    Sale.sale_date <= end,
                )
                .group_by(Product.id, Product.name, Product.category)
                .order_by(func.sum(Sale.total_amount).desc())
            )
            try:
                q = q.where(Sale.status == "Completed")
            except Exception:
                pass
    except Exception:
        pass

    rows = db.execute(q).all()

    # profit map
    profit_by_pid: Dict[int, float] = {}
    try:
        pq = (
            select(
                Sale.product_id,
                func.coalesce(func.sum(Sale.profit), 0).label("profit"),
            )
            .join(Product, Product.id == Sale.product_id)
            .where(
                Product.owner_id == owner_id,
                Sale.sale_date >= start,
                Sale.sale_date <= end,
            )
            .group_by(Sale.product_id)
        )
        for r in db.execute(pq).all():
            profit_by_pid[int(r.product_id)] = float(r.profit or 0)
    except Exception:
        # estimate from product prices
        try:
            for p in db.scalars(select(Product).where(Product.owner_id == owner_id)).all():
                pass
        except Exception:
            pass

    items: List[Dict[str, Any]] = []
    for r in rows:
        pid = int(r.product_id)
        revenue = float(r.revenue or 0)
        profit = profit_by_pid.get(pid)
        if profit is None:
            # estimate
            prod = db.get(Product, pid)
            if prod and hasattr(prod, "selling_price") and hasattr(prod, "cost_price"):
                units = float(r.units_sold or 0)
                profit = float(
                    (float(prod.selling_price or 0) - float(prod.cost_price or 0)) * units
                )
            else:
                profit = 0.0
        margin = (profit / revenue * 100.0) if revenue else 0.0
        cat = getattr(r, "category", None)
        items.append(
            {
                "product_id": pid,
                "product_name": r.product_name or f"Product #{pid}",
                "category": cat,
                "units_sold": float(r.units_sold or 0),
                "revenue": round(revenue, 2),
                "profit": round(float(profit), 2),
                "margin_pct": round(margin, 2),
                "orders": int(r.orders or 0),
            }
        )

    top = items[:limit]
    bottom = list(reversed(items[-limit:])) if len(items) > limit else list(reversed(items))

    return {
        "from_date": start,
        "to_date": end,
        "top": top,
        "bottom": bottom,
        "limit": limit,
        "status": "ok",
    }


# =====================================================
# Inventory health
# =====================================================

def get_inventory_health(db: Session, owner_id: int) -> Dict[str, Any]:
    q = (
        select(Inventory, Product)
        .join(Product, Product.id == Inventory.product_id)
        .where(Product.owner_id == owner_id)
    )
    rows = db.execute(q).all()

    low: List[Dict[str, Any]] = []
    out: List[Dict[str, Any]] = []
    over: List[Dict[str, Any]] = []
    total_units = 0
    total_value = 0.0

    for inv, prod in rows:
        current = int(getattr(inv, "current_stock", 0) or 0)
        reorder = int(
            getattr(inv, "reorder_level", None)
            or getattr(inv, "minimum_stock", None)
            or 0
        )
        safety = getattr(inv, "safety_stock", None)
        price = float(getattr(prod, "cost_price", None) or getattr(prod, "selling_price", 0) or 0)
        value = current * price
        total_units += current
        total_value += value

        name = getattr(prod, "name", None) or f"Product #{prod.id}"
        row = {
            "product_id": int(prod.id),
            "product_name": name,
            "current_stock": current,
            "reorder_level": reorder,
            "safety_stock": int(safety) if safety is not None else None,
            "stock_value": round(value, 2),
            "status": "ok",
        }

        if current <= 0:
            row["status"] = "out_of_stock"
            out.append(row)
        elif reorder and current <= reorder:
            row["status"] = "low_stock"
            low.append(row)
        elif reorder and current > reorder * 5:
            row["status"] = "overstock"
            over.append(row)

    return {
        "total_skus": len(rows),
        "total_stock_units": total_units,
        "total_stock_value": round(total_value, 2),
        "low_stock_count": len(low),
        "out_of_stock_count": len(out),
        "overstock_count": len(over),
        "low_stock_items": low[:20],
        "out_of_stock_items": out[:20],
        "status": "ok",
    }


# =====================================================
# Category mix
# =====================================================

def get_category_mix(
    db: Session,
    owner_id: int,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
) -> Dict[str, Any]:
    start, end = _resolve_range(from_date, to_date)

    if not hasattr(Product, "category"):
        return {
            "from_date": start,
            "to_date": end,
            "categories": [],
            "status": "ok",
        }

    q = (
        select(
            Product.category.label("category"),
            func.coalesce(func.sum(Sale.total_amount), 0).label("revenue"),
            func.coalesce(func.sum(Sale.quantity_sold), 0).label("units"),
        )
        .join(Sale, Sale.product_id == Product.id)
        .where(
            Product.owner_id == owner_id,
            Sale.sale_date >= start,
            Sale.sale_date <= end,
        )
        .group_by(Product.category)
        .order_by(func.sum(Sale.total_amount).desc())
    )
    try:
        q = q.where(Sale.status == "Completed")
    except Exception:
        pass

    rows = db.execute(q).all()
    total_rev = sum(float(r.revenue or 0) for r in rows) or 1.0

    categories = []
    for r in rows:
        rev = float(r.revenue or 0)
        categories.append(
            {
                "category": r.category or "Uncategorized",
                "revenue": round(rev, 2),
                "profit": 0.0,
                "units": float(r.units or 0),
                "share_pct": round(rev / total_rev * 100.0, 2),
            }
        )

    return {
        "from_date": start,
        "to_date": end,
        "categories": categories,
        "status": "ok",
    }


# =====================================================
# Forecast accuracy (ML)
# =====================================================

def get_forecast_accuracy(history_days: int = 30) -> Dict[str, Any]:
    """
    Uses ml.predict history (y_actual vs yhat) when available.
    """
    history_days = max(7, min(int(history_days or 30), 180))

    try:
        from pathlib import Path
        import sys

        # project root on path
        here = Path(__file__).resolve()
        for root in (here.parents[3], here.parents[2], Path.cwd(), Path.cwd().parent):
            if (root / "ml").exists() and str(root) not in sys.path:
                sys.path.insert(0, str(root))
                break

        from ml.predict import forecast_service

        raw = forecast_service(
            horizon=7,
            model_name="best",
            include_history_days=history_days,
        )
    except Exception as exc:
        return {
            "model_type": None,
            "n_points": 0,
            "mae": None,
            "rmse": None,
            "mape": None,
            "points": [],
            "recommendation": f"ML accuracy unavailable: {exc}",
            "status": "error",
        }

    hist = raw.get("history") or []
    pairs = [
        (p.get("y_actual"), p.get("yhat"))
        for p in hist
        if p.get("y_actual") is not None and p.get("yhat") is not None
    ]

    mae = rmse = mape = None
    if pairs:
        import math

        errs = [float(a) - float(p) for a, p in pairs]
        mae = sum(abs(e) for e in errs) / len(errs)
        rmse = math.sqrt(sum(e * e for e in errs) / len(errs))
        mape_vals = []
        for a, p in pairs:
            a = float(a)
            if abs(a) > 1e-8:
                mape_vals.append(abs(a - float(p)) / abs(a) * 100.0)
        mape = sum(mape_vals) / len(mape_vals) if mape_vals else None

    points = [
        {
            "ds": p.get("ds"),
            "y_actual": p.get("y_actual"),
            "yhat": p.get("yhat"),
            "residual": p.get("residual"),
        }
        for p in hist
    ]

    return {
        "model_type": raw.get("model_type"),
        "n_points": len(pairs),
        "mae": round(mae, 2) if mae is not None else None,
        "rmse": round(rmse, 2) if rmse is not None else None,
        "mape": round(mape, 2) if mape is not None else None,
        "points": points,
        "recommendation": raw.get("recommendation"),
        "status": raw.get("status", "ok"),
    }


# =====================================================
# Bundle for page load
# =====================================================

def get_reports_dashboard(
    db: Session,
    owner_id: int,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    product_limit: int = 10,
) -> Dict[str, Any]:
    overview = get_overview(db, owner_id, from_date, to_date)
    trend = get_sales_trend(db, owner_id, from_date, to_date)
    products = get_product_performance(
        db, owner_id, from_date, to_date, limit=product_limit
    )
    inventory = get_inventory_health(db, owner_id)
    category_mix = get_category_mix(db, owner_id, from_date, to_date)
    forecast_accuracy = get_forecast_accuracy(history_days=30)

    return {
        "overview": overview,
        "trend": trend,
        "products": products,
        "inventory": inventory,
        "category_mix": category_mix,
        "forecast_accuracy": forecast_accuracy,
        "generated_at": datetime.now(timezone.utc),
        "status": "ok",
    }