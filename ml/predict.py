"""
ml/predict.py
-------------
Inference / forecasting for Smart Retail Intelligence Platform.

Loads best_model.pkl (or a named model), uses feature pipeline,
returns demand / revenue forecasts + simple inventory hints.

Used by:
  - FastAPI forecast service
  - CLI / notebooks
  - batch jobs
"""

from __future__ import annotations

import json
import pickle
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

import numpy as np
import pandas as pd

from ml.feature_engineering import (
    get_model_feature_columns,
    load_or_build_features,
)
from ml.preprocessing import default_paths
from ml.train_model import load_bundle

# ---------------------------------------------------------------------------
# Model loading
# ---------------------------------------------------------------------------

def resolve_model_path(model_name: str = "best") -> Path:
    """
    model_name:
      - "best" | "best_model"
      - "xgboost"
      - "random_forest" | "rf"
      - "ridge" | "linear"
    """
    paths = default_paths()
    models_dir = paths["models_dir"]
    mapping = {
        "best": models_dir / "best_model.pkl",
        "best_model": models_dir / "best_model.pkl",
        "xgboost": models_dir / "xgboost_model.pkl",
        "xgb": models_dir / "xgboost_model.pkl",
        "random_forest": models_dir / "random_forest_model.pkl",
        "rf": models_dir / "random_forest_model.pkl",
        "ridge": models_dir / "linear_model.pkl",
        "linear": models_dir / "linear_model.pkl",
    }
    key = model_name.lower().strip()
    path = mapping.get(key, models_dir / f"{key}.pkl")
    if not path.exists():
        raise FileNotFoundError(
            f"Model not found: {path}\n"
            "Train models first: python -m ml.train_model"
        )
    return path


def load_model(model_name: str = "best") -> Dict[str, Any]:
    """Load model bundle dict: model, feature_cols, metrics, ..."""
    path = resolve_model_path(model_name)
    bundle = load_bundle(path)
    bundle["_model_path"] = str(path)
    return bundle


# ---------------------------------------------------------------------------
# Feature matrix for inference
# ---------------------------------------------------------------------------

def prepare_inference_frame(
    features: Optional[pd.DataFrame] = None,
    feature_cols: Optional[List[str]] = None,
    split: Optional[str] = None,
) -> pd.DataFrame:
    """
    Return feature rows ready for model.predict.
    split: None = all rows; or 'train'/'val'/'test'
    """
    if features is None:
        features, meta = load_or_build_features(force_recompute=False)
        if feature_cols is None:
            feature_cols = meta.get("feature_cols") or get_model_feature_columns(features)
    else:
        if feature_cols is None:
            feature_cols = get_model_feature_columns(features)

    df = features.copy()
    if split is not None and "split" in df.columns:
        df = df[df["split"] == split].copy()

    missing = [c for c in feature_cols if c not in df.columns]
    if missing:
        raise ValueError(f"Missing feature columns: {missing}")

    X = df[feature_cols].copy()
    X = X.fillna(X.median(numeric_only=True))
    # keep alignment columns
    out = df[["ds"]].copy() if "ds" in df.columns else pd.DataFrame(index=df.index)
    if "y" in df.columns:
        out["y_actual"] = df["y"].values
    if "split" in df.columns:
        out["split"] = df["split"].values
    out = pd.concat([out.reset_index(drop=True), X.reset_index(drop=True)], axis=1)
    return out


# ---------------------------------------------------------------------------
# Predict
# ---------------------------------------------------------------------------

def predict_frame(
    bundle: Dict[str, Any],
    features: Optional[pd.DataFrame] = None,
    split: Optional[str] = None,
) -> pd.DataFrame:
    """
    Score feature rows with the loaded model.

    Returns DataFrame: ds, y_actual (if any), yhat, split (if any)
    """
    model = bundle["model"]
    feature_cols = bundle["feature_cols"]

    if features is None:
        features, _ = load_or_build_features(force_recompute=False)

    df = features.copy()
    if split is not None and "split" in df.columns:
        df = df[df["split"] == split].copy()

    X = df[feature_cols].copy()
    X = X.fillna(X.median(numeric_only=True))
    yhat = model.predict(X)

    out = pd.DataFrame({
        "ds": pd.to_datetime(df["ds"]).values if "ds" in df.columns else np.arange(len(df)),
        "yhat": yhat,
    })
    if "y" in df.columns:
        out["y_actual"] = df["y"].astype(float).values
        out["residual"] = out["y_actual"] - out["yhat"]
    if "split" in df.columns:
        out["split"] = df["split"].values
    out["model_type"] = bundle.get("model_type", "unknown")
    return out.sort_values("ds").reset_index(drop=True)


def predict_latest(
    model_name: str = "best",
    split: str = "test",
) -> pd.DataFrame:
    """Convenience: load best/named model and predict a split."""
    bundle = load_model(model_name)
    return predict_frame(bundle, split=split)


# ---------------------------------------------------------------------------
# Forward forecast (recursive multi-step)
# ---------------------------------------------------------------------------

def forecast_next_days(
    horizon: int = 7,
    model_name: str = "best",
    features: Optional[pd.DataFrame] = None,
) -> pd.DataFrame:
    """
    Multi-step forecast beyond the last date in features.

    Approach (intermediate, production-practical):
      - Start from full historical feature table
      - Iteratively append 1 day, update lag/rolling roughly from predicted y
      - Recompute lag features from extended y history
      - Keep business flags at last-known values (promo/festival unknown → 0)

    Note: For true promo/holiday plans, pass future regressors later via API.
    """
    if horizon < 1:
        raise ValueError("horizon must be >= 1")

    bundle = load_model(model_name)
    model = bundle["model"]
    feature_cols = list(bundle["feature_cols"])

    if features is None:
        features, _ = load_or_build_features(force_recompute=False)

    hist = features.sort_values("ds").copy()
    hist["ds"] = pd.to_datetime(hist["ds"])

    # working y series
    y_hist = hist["y"].astype(float).tolist()
    last_ds = hist["ds"].max()

    # last known business-ish values
    last_row = hist.iloc[-1]

    records = []
    for step in range(1, horizon + 1):
        ds_new = last_ds + pd.Timedelta(days=step)

        # build a minimal feature row from calendar + lags/rolling on y_hist
        row: Dict[str, Any] = {"ds": ds_new}

        # time features
        row["year"] = ds_new.year
        row["month"] = ds_new.month
        row["day"] = ds_new.day
        row["day_of_week"] = ds_new.dayofweek
        row["week_of_year"] = int(ds_new.isocalendar().week)
        row["quarter"] = ds_new.quarter
        row["is_weekend"] = int(ds_new.dayofweek >= 5)
        row["is_month_start"] = int(ds_new.is_month_start)
        row["is_month_end"] = int(ds_new.is_month_end)
        row["month_sin"] = np.sin(2 * np.pi * ds_new.month / 12)
        row["month_cos"] = np.cos(2 * np.pi * ds_new.month / 12)
        row["dow_sin"] = np.sin(2 * np.pi * ds_new.dayofweek / 7)
        row["dow_cos"] = np.cos(2 * np.pi * ds_new.dayofweek / 7)

        # season
        m = ds_new.month
        if m in (12, 1, 2):
            season, season_enc = "Winter", 0
        elif m in (3, 4, 5):
            season, season_enc = "Summer", 1
        elif m in (6, 7, 8, 9):
            season, season_enc = "Monsoon", 2
        else:
            season, season_enc = "Autumn", 3
        row["season_enc"] = season_enc

        # lags from y_hist
        for lag in (1, 7, 14, 30):
            key = f"lag_{lag}"
            row[key] = y_hist[-lag] if len(y_hist) >= lag else y_hist[-1]

        if "lag_qty_1" in feature_cols:
            row["lag_qty_1"] = last_row.get("lag_qty_1", 0)
        if "lag_qty_7" in feature_cols:
            row["lag_qty_7"] = last_row.get("lag_qty_7", 0)

        # rolling from y_hist (past only)
        arr = np.asarray(y_hist, dtype=float)
        for w in (7, 14, 30):
            window = arr[-w:] if len(arr) >= 1 else np.array([0.0])
            row[f"roll_mean_{w}"] = float(np.mean(window[-w:]))
            row[f"roll_std_{w}"] = float(np.std(window[-w:])) if len(window) > 1 else 0.0
            row[f"roll_min_{w}"] = float(np.min(window[-w:]))
            row[f"roll_max_{w}"] = float(np.max(window[-w:]))

        # business flags: default conservative (no future promo plan)
        for col, default in [
            ("promo_share", 0.0),
            ("festival_share", 0.0),
            ("holiday_share", 0.0),
            ("avg_discount", 0.0),
            ("avg_stock", float(last_row.get("avg_stock", 0) or 0)),
            ("stockout_share", 0.0),
            ("n_stores", float(last_row.get("n_stores", 0) or 0)),
            ("n_products", float(last_row.get("n_products", 0) or 0)),
            ("is_promo_day", 0),
            ("is_festival_day", 0),
            ("is_holiday_day", 0),
            ("high_discount_day", 0),
            ("high_stockout_day", 0),
            ("weekend_x_promo", 0),
            ("festival_x_promo", 0),
        ]:
            if col in feature_cols:
                row[col] = default

        # interactions with weekend
        if "weekend_x_promo" in feature_cols:
            row["weekend_x_promo"] = int(row.get("is_weekend", 0)) * int(row.get("is_promo_day", 0))

        # vector in training column order
        x_vals = []
        for c in feature_cols:
            x_vals.append(float(row.get(c, 0.0)))
        X = np.asarray([x_vals], dtype=float)
        yhat = float(model.predict(X)[0])
        yhat = max(0.0, yhat)  # revenue can't be negative

        records.append({
            "ds": ds_new,
            "yhat": yhat,
            "horizon_step": step,
            "model_type": bundle.get("model_type", "unknown"),
        })
        y_hist.append(yhat)

    return pd.DataFrame(records)


# ---------------------------------------------------------------------------
# Business-oriented response (API-friendly)
# ---------------------------------------------------------------------------

def forecast_service(
    horizon: int = 7,
    model_name: str = "best",
    include_history_days: int = 30,
) -> Dict[str, Any]:
    """
    High-level response for FastAPI.

    Returns JSON-serializable dict:
      - model info
      - history (recent actuals + in-sample preds if available)
      - forecast next N days
      - simple totals / recommendations
    """
    bundle = load_model(model_name)
    features, _ = load_or_build_features(force_recompute=False)

    # recent history predictions (last N days present in features)
    hist_pred = predict_frame(bundle, features=features)
    if include_history_days > 0:
        hist_pred = hist_pred.tail(include_history_days)

    future = forecast_next_days(horizon=horizon, model_name=model_name, features=features)

    total_forecast = float(future["yhat"].sum())
    avg_daily = float(future["yhat"].mean()) if len(future) else 0.0

    # naive inventory hint: compare forecast avg vs last roll_mean_7 if present
    recommendation = "Monitor stock for top categories; plan replenishment for next week."
    if avg_daily > 0:
        recommendation = (
            f"Expected ~{avg_daily:,.0f} daily revenue over next {horizon} days "
            f"(~{total_forecast:,.0f} total). Review promo calendar and reorder levels."
        )

    def _records(df: pd.DataFrame) -> List[Dict[str, Any]]:
        out = df.copy()
        if "ds" in out.columns:
            out["ds"] = pd.to_datetime(out["ds"]).dt.strftime("%Y-%m-%d")
        return json.loads(out.to_json(orient="records"))

    return {
        "status": "ok",
        "model_type": bundle.get("model_type"),
        "model_path": bundle.get("_model_path"),
        "horizon_days": horizon,
        "forecast_total_revenue": total_forecast,
        "forecast_avg_daily_revenue": avg_daily,
        "recommendation": recommendation,
        "history": _records(hist_pred),
        "forecast": _records(future),
        "metrics": bundle.get("metrics", {}),
    }


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("Loading best model and forecasting 7 days...")
    try:
        result = forecast_service(horizon=7, model_name="best", include_history_days=14)
        print("Model:", result["model_type"])
        print("Path :", result["model_path"])
        print(f"Next 7 days total yhat: {result['forecast_total_revenue']:,.2f}")
        print("Forecast:")
        print(pd.DataFrame(result["forecast"]))
        print("\nRecommendation:", result["recommendation"])
    except FileNotFoundError as e:
        print(e)
        print("Run: python -m ml.train_model")