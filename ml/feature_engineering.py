"""
ml/feature_engineering.py
-------------------------
Build daily forecasting features from cleaned transaction sales.

Mirrors backend/notebooks/03_feature_engineering.ipynb

Pipeline:
  clean_sales (transactions)
       │
       ▼
  daily aggregation
       │
       ▼
  time + lag + rolling + business features
       │
       ▼
  features.csv  (+ features_meta.json)

Used by:
  - train_model.py
  - predict.py
  - FastAPI forecast service
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Tuple, Union

import numpy as np
import pandas as pd

from ml.preprocessing import default_paths, load_clean_sales, load_or_preprocess

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

DEFAULT_LAGS: List[int] = [1, 7, 14, 30]
DEFAULT_WINDOWS: List[int] = [7, 14, 30]

TARGET_COL = "y"  # primary target = daily revenue


# ---------------------------------------------------------------------------
# Daily aggregation
# ---------------------------------------------------------------------------

def aggregate_daily(df: pd.DataFrame) -> pd.DataFrame:
    """
    Collapse transaction rows → one row per day.
    Expects cleaned columns from preprocessing (is_promo, etc. if present).
    """
    if "date" not in df.columns:
        raise ValueError("clean sales must include 'date'")

    work = df.copy()
    work["date"] = pd.to_datetime(work["date"]).dt.normalize()

    agg: Dict[str, tuple] = {
        "y_revenue": ("revenue", "sum"),
        "y_quantity": ("quantity_sold", "sum"),
        "y_profit": ("profit", "sum"),
        "y_transactions": ("sale_id", "count"),
        "avg_discount": ("discount_percent", "mean"),
        "avg_stock": ("current_stock", "mean"),
        "n_stores": ("store_id", "nunique"),
        "n_products": ("product_id", "nunique"),
    }

    # optional helper flags from preprocessing
    if "is_promo" in work.columns:
        agg["promo_share"] = ("is_promo", "mean")
    if "is_festival" in work.columns:
        agg["festival_share"] = ("is_festival", "mean")
    if "is_holiday" in work.columns:
        agg["holiday_share"] = ("is_holiday", "mean")
    if "stockout_flag" in work.columns:
        agg["stockout_share"] = ("stockout_flag", "mean")

    daily = work.groupby("date", as_index=False).agg(**agg)
    daily = daily.rename(columns={"date": "ds"})
    daily["ds"] = pd.to_datetime(daily["ds"])
    daily = daily.sort_values("ds").reset_index(drop=True)

    # primary model target
    daily[TARGET_COL] = daily["y_revenue"]
    return daily


def reindex_full_calendar(daily: pd.DataFrame) -> pd.DataFrame:
    """Ensure continuous daily index so lags mean true calendar days."""
    daily = daily.copy()
    daily["ds"] = pd.to_datetime(daily["ds"])
    full_idx = pd.date_range(daily["ds"].min(), daily["ds"].max(), freq="D")
    daily = (
        daily.set_index("ds")
        .reindex(full_idx)
        .rename_axis("ds")
        .reset_index()
    )

    zero_cols = [
        "y_revenue", "y_quantity", "y_profit", "y_transactions",
        "promo_share", "festival_share", "holiday_share",
        "avg_discount", "stockout_share", "n_stores", "n_products",
    ]
    for c in zero_cols:
        if c in daily.columns:
            daily[c] = daily[c].fillna(0.0)

    if "avg_stock" in daily.columns:
        daily["avg_stock"] = daily["avg_stock"].ffill().bfill()

    daily[TARGET_COL] = daily["y_revenue"].fillna(0.0)
    return daily


# ---------------------------------------------------------------------------
# Feature groups
# ---------------------------------------------------------------------------

def add_time_features(daily: pd.DataFrame) -> pd.DataFrame:
    d = daily.copy()
    d["year"] = d["ds"].dt.year
    d["month"] = d["ds"].dt.month
    d["day"] = d["ds"].dt.day
    d["day_of_week"] = d["ds"].dt.dayofweek
    d["week_of_year"] = d["ds"].dt.isocalendar().week.astype(int)
    d["quarter"] = d["ds"].dt.quarter
    d["is_weekend"] = (d["day_of_week"] >= 5).astype(int)
    d["is_month_start"] = d["ds"].dt.is_month_start.astype(int)
    d["is_month_end"] = d["ds"].dt.is_month_end.astype(int)

    # cyclical
    d["month_sin"] = np.sin(2 * np.pi * d["month"] / 12)
    d["month_cos"] = np.cos(2 * np.pi * d["month"] / 12)
    d["dow_sin"] = np.sin(2 * np.pi * d["day_of_week"] / 7)
    d["dow_cos"] = np.cos(2 * np.pi * d["day_of_week"] / 7)

    # season
    def month_to_season(m: int) -> str:
        if m in (12, 1, 2):
            return "Winter"
        if m in (3, 4, 5):
            return "Summer"
        if m in (6, 7, 8, 9):
            return "Monsoon"
        return "Autumn"

    season_map = {"Winter": 0, "Summer": 1, "Monsoon": 2, "Autumn": 3}
    d["season"] = d["month"].map(month_to_season)
    d["season_enc"] = d["season"].map(season_map).astype(int)
    return d


def add_lag_features(
    daily: pd.DataFrame,
    target: str = TARGET_COL,
    lags: Sequence[int] = DEFAULT_LAGS,
) -> pd.DataFrame:
    d = daily.copy()
    for lag in lags:
        d[f"lag_{lag}"] = d[target].shift(lag)
    # optional quantity lags
    if "y_quantity" in d.columns:
        for lag in (1, 7):
            d[f"lag_qty_{lag}"] = d["y_quantity"].shift(lag)
    return d


def add_rolling_features(
    daily: pd.DataFrame,
    target: str = TARGET_COL,
    windows: Sequence[int] = DEFAULT_WINDOWS,
) -> pd.DataFrame:
    """
    Rolling stats use shift(1) so current day is not leaked into features.
    """
    d = daily.copy()
    shifted = d[target].shift(1)
    for w in windows:
        rolled = shifted.rolling(window=w, min_periods=max(1, w // 2))
        d[f"roll_mean_{w}"] = rolled.mean()
        d[f"roll_std_{w}"] = rolled.std()
        d[f"roll_min_{w}"] = rolled.min()
        d[f"roll_max_{w}"] = rolled.max()
    return d


def add_business_features(daily: pd.DataFrame) -> pd.DataFrame:
    d = daily.copy()

    if "promo_share" in d.columns:
        d["is_promo_day"] = (d["promo_share"] > 0.05).astype(int)
    else:
        d["is_promo_day"] = 0

    if "festival_share" in d.columns:
        d["is_festival_day"] = (d["festival_share"] > 0).astype(int)
    else:
        d["is_festival_day"] = 0

    if "holiday_share" in d.columns:
        d["is_holiday_day"] = (d["holiday_share"] > 0).astype(int)
    else:
        d["is_holiday_day"] = 0

    if "avg_discount" in d.columns:
        d["high_discount_day"] = (d["avg_discount"] >= 0.2).astype(int)
    else:
        d["high_discount_day"] = 0

    if "stockout_share" in d.columns:
        d["high_stockout_day"] = (d["stockout_share"] >= 0.1).astype(int)
    else:
        d["high_stockout_day"] = 0

    d["weekend_x_promo"] = d["is_weekend"] * d["is_promo_day"]
    d["festival_x_promo"] = d["is_festival_day"] * d["is_promo_day"]
    return d


def attach_split_from_meta(
    daily: pd.DataFrame,
    meta: Optional[Dict[str, Any]] = None,
) -> pd.DataFrame:
    """
    Attach train/val/test using preprocess_meta boundaries when available.
    Fallback: 70/15/15 by day count.
    """
    d = daily.copy()
    paths = default_paths()

    train_end = val_end = None
    if meta and meta.get("train_end") and meta.get("val_end"):
        train_end = pd.Timestamp(meta["train_end"])
        val_end = pd.Timestamp(meta["val_end"])
    elif paths["preprocess_meta"].exists():
        m = json.loads(paths["preprocess_meta"].read_text(encoding="utf-8"))
        train_end = pd.Timestamp(m["train_end"])
        val_end = pd.Timestamp(m["val_end"])

    if train_end is None or val_end is None:
        dates = d["ds"].values
        n = len(dates)
        train_end = pd.Timestamp(dates[max(0, int(n * 0.70) - 1)])
        val_end = pd.Timestamp(dates[max(0, int(n * 0.85) - 1)])

    d["split"] = "test"
    d.loc[d["ds"] <= train_end, "split"] = "train"
    d.loc[(d["ds"] > train_end) & (d["ds"] <= val_end), "split"] = "val"
    return d


def drop_warmup_rows(daily: pd.DataFrame) -> pd.DataFrame:
    """Drop rows where lag/rolling features are NaN."""
    lag_roll = [c for c in daily.columns if c.startswith(("lag_", "roll_"))]
    if not lag_roll:
        return daily.copy()
    return daily.dropna(subset=lag_roll).reset_index(drop=True)


def order_feature_columns(daily: pd.DataFrame) -> pd.DataFrame:
    id_cols = ["ds", "split"]
    target_cols = ["y", "y_revenue", "y_quantity", "y_profit", "y_transactions"]
    time_cols = [
        "year", "month", "day", "day_of_week", "week_of_year", "quarter",
        "is_weekend", "is_month_start", "is_month_end",
        "month_sin", "month_cos", "dow_sin", "dow_cos", "season", "season_enc",
    ]
    lag_cols = [c for c in daily.columns if c.startswith("lag_")]
    roll_cols = [c for c in daily.columns if c.startswith("roll_")]
    biz_cols = [
        "promo_share", "festival_share", "holiday_share", "avg_discount",
        "avg_stock", "stockout_share", "n_stores", "n_products",
        "is_promo_day", "is_festival_day", "is_holiday_day",
        "high_discount_day", "high_stockout_day",
        "weekend_x_promo", "festival_x_promo",
    ]

    ordered = id_cols + target_cols + time_cols + lag_cols + roll_cols + biz_cols
    ordered = [c for c in ordered if c in daily.columns]
    ordered += [c for c in daily.columns if c not in ordered]
    return daily[ordered].copy()


def get_model_feature_columns(features: pd.DataFrame) -> List[str]:
    """Numeric feature list for XGBoost / RF / Ridge (excludes targets & ids)."""
    exclude = {
        "ds", "split", "y", "y_revenue", "y_quantity", "y_profit", "y_transactions",
        "season",
    }
    return [
        c for c in features.columns
        if c not in exclude and pd.api.types.is_numeric_dtype(features[c])
    ]


# ---------------------------------------------------------------------------
# Full pipeline
# ---------------------------------------------------------------------------

def build_features(
    clean_df: Optional[pd.DataFrame] = None,
    meta: Optional[Dict[str, Any]] = None,
    lags: Sequence[int] = DEFAULT_LAGS,
    windows: Sequence[int] = DEFAULT_WINDOWS,
    save: bool = True,
) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Build model-ready daily feature matrix.

    Returns
    -------
    features_df, features_meta
    """
    if clean_df is None:
        clean_df, loaded_meta = load_or_preprocess(force_recompute=False)
        meta = meta or loaded_meta

    daily = aggregate_daily(clean_df)
    daily = reindex_full_calendar(daily)
    daily = add_time_features(daily)
    daily = add_lag_features(daily, lags=lags)
    daily = add_rolling_features(daily, windows=windows)
    daily = add_business_features(daily)
    daily = attach_split_from_meta(daily, meta=meta)
    daily = drop_warmup_rows(daily)
    features = order_feature_columns(daily)

    feature_cols = get_model_feature_columns(features)
    feat_meta: Dict[str, Any] = {
        "n_rows": int(len(features)),
        "n_cols": int(features.shape[1]),
        "date_min": str(features["ds"].min().date()),
        "date_max": str(features["ds"].max().date()),
        "target": TARGET_COL,
        "split_counts": features["split"].value_counts().to_dict(),
        "feature_cols": feature_cols,
        "lags": list(lags),
        "windows": list(windows),
    }

    if save:
        paths = default_paths()
        paths["processed_dir"].mkdir(parents=True, exist_ok=True)
        out_csv = paths["processed_dir"] / "features.csv"
        features.to_csv(out_csv, index=False)
        feat_meta["features_csv"] = str(out_csv)

        meta_path = paths["processed_dir"] / "features_meta.json"
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(feat_meta, f, indent=2, default=str)
        feat_meta["features_meta"] = str(meta_path)

    return features, feat_meta


def load_features(
    csv_path: Optional[Union[str, Path]] = None,
) -> pd.DataFrame:
    """Load existing features.csv."""
    paths = default_paths()
    path = Path(csv_path) if csv_path else paths["processed_dir"] / "features.csv"
    if not path.exists():
        raise FileNotFoundError(
            f"features.csv not found: {path}\nRun build_features() first."
        )
    df = pd.read_csv(path, low_memory=False)
    df["ds"] = pd.to_datetime(df["ds"])
    return df


def load_or_build_features(force_recompute: bool = False) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """Prefer cached features.csv; otherwise build from clean sales."""
    paths = default_paths()
    feat_path = paths["processed_dir"] / "features.csv"
    meta_path = paths["processed_dir"] / "features_meta.json"

    if not force_recompute and feat_path.exists():
        features = load_features(feat_path)
        meta: Dict[str, Any] = {"source": "cached_features"}
        if meta_path.exists():
            meta.update(json.loads(meta_path.read_text(encoding="utf-8")))
        if "feature_cols" not in meta:
            meta["feature_cols"] = get_model_feature_columns(features)
        return features, meta

    return build_features(save=True)


# ---------------------------------------------------------------------------
# CLI / self-check
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("Building / loading features...")
    feats, meta = load_or_build_features(force_recompute=False)
    print(f"Features shape: {feats.shape}")
    print(f"Date range    : {meta.get('date_min')} → {meta.get('date_max')}")
    print(f"Split counts  : {meta.get('split_counts')}")
    print(f"# model cols  : {len(meta.get('feature_cols', []))}")
    print(feats.head(3))