"""
ml/preprocessing.py
-------------------
Load, clean, and prepare Smart Retail sales data for feature engineering
and model training / inference.

Mirrors logic from backend/notebooks/02_preprocessing.ipynb
so notebooks and production stay consistent.

Used by:
  - feature_engineering.py
  - train_model.py
  - predict.py
  - FastAPI forecast service
"""

from __future__ import annotations

import json
import pickle
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

import numpy as np
import pandas as pd

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

def project_root() -> Path:
    """
    Resolve project root whether called from:
      - project root
      - ml/
      - backend/notebooks/
      - backend/app/...
    """
    here = Path(__file__).resolve().parent  # ml/
    candidates = [
        here.parent,                         # project root (ml/..)
        here.parent.parent,                  # if nested deeper
        Path.cwd(),
        Path.cwd().parent,
    ]
    for root in candidates:
        if (root / "datasets").exists() or (root / "ml").exists():
            return root.resolve()
    return here.parent.resolve()


def default_paths() -> Dict[str, Path]:
    root = project_root()
    return {
        "root": root,
        "raw_csv": root / "datasets" / "smart_retail_sales_dataset.csv",
        "processed_dir": root / "datasets" / "processed",
        "clean_csv": root / "datasets" / "processed" / "clean_sales.csv",
        "encoders_pkl": root / "datasets" / "processed" / "label_encoders.pkl",
        "preprocess_meta": root / "datasets" / "processed" / "preprocess_meta.json",
        "models_dir": root / "ml" / "models",
    }


# ---------------------------------------------------------------------------
# Load
# ---------------------------------------------------------------------------

def load_raw_sales(csv_path: Optional[Union[str, Path]] = None) -> pd.DataFrame:
    """Load raw transaction-level sales CSV."""
    paths = default_paths()
    path = Path(csv_path) if csv_path else paths["raw_csv"]
    if not path.exists():
        raise FileNotFoundError(f"Raw sales file not found: {path}")

    df = pd.read_csv(path, low_memory=False)
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    return df


def load_clean_sales(csv_path: Optional[Union[str, Path]] = None) -> pd.DataFrame:
    """Load already-preprocessed clean_sales.csv if available."""
    paths = default_paths()
    path = Path(csv_path) if csv_path else paths["clean_csv"]
    if not path.exists():
        raise FileNotFoundError(
            f"clean_sales.csv not found: {path}\n"
            "Run preprocessing or notebook 02_preprocessing.ipynb first."
        )
    df = pd.read_csv(path, low_memory=False)
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
    return df


# ---------------------------------------------------------------------------
# Cleaning steps (same rules as notebook 02)
# ---------------------------------------------------------------------------

NONE_LIKE = {"none", "nan", "null", "", "na", "n/a"}


def _normalize_none_strings(df: pd.DataFrame, cols: List[str]) -> pd.DataFrame:
    df = df.copy()
    for col in cols:
        if col not in df.columns:
            continue
        df[col] = df[col].fillna("None").astype(str)
        mask = df[col].str.strip().str.lower().isin(NONE_LIKE)
        df.loc[mask, col] = "None"
    return df


def clean_missing(df: pd.DataFrame) -> pd.DataFrame:
    """Fill event-like categoricals with 'None'; numeric NaNs with median."""
    df = _normalize_none_strings(df, ["promotion", "holiday", "festival"])

    num_cols = df.select_dtypes(include=[np.number]).columns
    for col in num_cols:
        if df[col].isna().any():
            df[col] = df[col].fillna(df[col].median())
    return df


def drop_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """Drop exact duplicates and duplicate sale_id if present."""
    df = df.drop_duplicates().copy()
    if "sale_id" in df.columns:
        df = df.drop_duplicates(subset=["sale_id"], keep="first").copy()
    return df


def fix_invalid_values(df: pd.DataFrame) -> pd.DataFrame:
    """
    Remove impossible rows; clip discount; flag selling < cost.
    Does NOT drop promotional loss rows.
    """
    df = df.copy()

    if "date" in df.columns:
        df = df.dropna(subset=["date"]).copy()

    bad = pd.Series(False, index=df.index)
    if "quantity_sold" in df.columns:
        bad |= df["quantity_sold"] <= 0
    if "cost_price" in df.columns:
        bad |= df["cost_price"] < 0
    if "selling_price" in df.columns:
        bad |= df["selling_price"] < 0
    if "current_stock" in df.columns:
        bad |= df["current_stock"] < 0

    df = df.loc[~bad].copy()

    if "discount_percent" in df.columns:
        df["discount_percent"] = df["discount_percent"].clip(0, 1)

    if "selling_price" in df.columns and "cost_price" in df.columns:
        df["is_loss_price"] = (df["selling_price"] < df["cost_price"]).astype(int)
    else:
        df["is_loss_price"] = 0

    return df


def soft_cap_outliers(
    df: pd.DataFrame,
    cols: Optional[List[str]] = None,
    upper_q: float = 0.999,
) -> pd.DataFrame:
    """
    Soft-cap extreme tails only (keeps real high-ticket electronics).
    Default: top 0.1% on quantity_sold and revenue.
    """
    df = df.copy()
    if cols is None:
        cols = [c for c in ["quantity_sold", "revenue"] if c in df.columns]

    for col in cols:
        hi = df[col].quantile(upper_q)
        df[col] = df[col].clip(upper=hi)
    return df


def cast_dtypes(df: pd.DataFrame) -> pd.DataFrame:
    """Stable dtypes for downstream modules."""
    df = df.copy()

    int_cols = [
        "sale_id", "store_id", "product_id", "year", "month", "quarter",
        "week_of_year", "is_weekend", "reorder_level", "current_stock",
        "quantity_sold",
    ]
    for col in int_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0).astype(int)

    float_cols = [
        "cost_price", "selling_price", "revenue", "profit", "discount_percent",
    ]
    for col in float_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").astype(float)

    str_cols = [
        "store_name", "city", "state", "sku", "product_name", "category",
        "brand", "supplier", "promotion", "holiday", "festival",
        "day_of_week", "season", "weather", "customer_type", "payment_method",
        "invoice_number",
    ]
    for col in str_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()

    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"], errors="coerce")

    return df


def add_helper_flags(df: pd.DataFrame) -> pd.DataFrame:
    """Binary / calendar helpers used by feature engineering."""
    df = df.copy()

    if "promotion" in df.columns:
        df["is_promo"] = (df["promotion"] != "None").astype(int)
    if "holiday" in df.columns:
        df["is_holiday"] = (df["holiday"] != "None").astype(int)
    if "festival" in df.columns:
        df["is_festival"] = (df["festival"] != "None").astype(int)

    if "revenue" in df.columns and "profit" in df.columns:
        df["profit_margin"] = np.where(
            df["revenue"] > 0,
            df["profit"] / df["revenue"],
            0.0,
        )

    if "current_stock" in df.columns and "reorder_level" in df.columns:
        df["stockout_flag"] = (df["current_stock"] <= df["reorder_level"]).astype(int)

    if "date" in df.columns:
        df["year"] = df["date"].dt.year
        df["month"] = df["date"].dt.month
        df["quarter"] = df["date"].dt.quarter
        df["week_of_year"] = df["date"].dt.isocalendar().week.astype(int)
        df["day_of_week_num"] = df["date"].dt.dayofweek
        df["is_weekend"] = (df["day_of_week_num"] >= 5).astype(int)
        df["is_month_start"] = df["date"].dt.is_month_start.astype(int)
        df["is_month_end"] = df["date"].dt.is_month_end.astype(int)

    return df


# ---------------------------------------------------------------------------
# Time split
# ---------------------------------------------------------------------------

def add_time_split(
    df: pd.DataFrame,
    date_col: str = "date",
    train_ratio: float = 0.70,
    val_ratio: float = 0.15,
) -> Tuple[pd.DataFrame, Dict[str, str]]:
    """
    Time-based split by unique days (no shuffle).
    Returns df with 'split' column and meta boundaries.
    """
    df = df.copy()
    df[date_col] = pd.to_datetime(df[date_col])
    df = df.sort_values(date_col).reset_index(drop=True)

    dates = np.array(sorted(df[date_col].dt.normalize().unique()))
    n = len(dates)
    i_train = max(1, int(n * train_ratio))
    i_val = max(i_train + 1, int(n * (train_ratio + val_ratio)))

    train_end = pd.Timestamp(dates[i_train - 1])
    val_end = pd.Timestamp(dates[min(i_val, n) - 1])

    df["split"] = "test"
    df.loc[df[date_col] <= train_end, "split"] = "train"
    df.loc[(df[date_col] > train_end) & (df[date_col] <= val_end), "split"] = "val"

    meta = {
        "train_end": str(train_end.date()),
        "val_end": str(val_end.date()),
        "date_min": str(df[date_col].min().date()),
        "date_max": str(df[date_col].max().date()),
    }
    return df, meta


# ---------------------------------------------------------------------------
# Full pipeline
# ---------------------------------------------------------------------------

def preprocess_sales(
    df: Optional[pd.DataFrame] = None,
    csv_path: Optional[Union[str, Path]] = None,
    save: bool = True,
    soft_cap: bool = True,
) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    End-to-end preprocessing.

    Parameters
    ----------
    df : optional raw dataframe (if None, loads from csv_path / default)
    csv_path : optional raw csv path
    save : write clean_sales.csv + preprocess_meta.json
    soft_cap : apply soft outlier cap

    Returns
    -------
    clean_df, meta
    """
    if df is None:
        df = load_raw_sales(csv_path)

    n_raw = len(df)

    df = df.copy()
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=["date"]).sort_values(["date"]).reset_index(drop=True)

    df = clean_missing(df)
    df = drop_duplicates(df)
    df = fix_invalid_values(df)
    if soft_cap:
        df = soft_cap_outliers(df)
    df = cast_dtypes(df)
    df = add_helper_flags(df)
    df, split_meta = add_time_split(df)

    meta: Dict[str, Any] = {
        "n_raw": int(n_raw),
        "n_clean": int(len(df)),
        "n_cols": int(df.shape[1]),
        **split_meta,
        "split_counts": df["split"].value_counts().to_dict(),
    }

    if save:
        paths = default_paths()
        paths["processed_dir"].mkdir(parents=True, exist_ok=True)
        out_csv = paths["clean_csv"]
        df.to_csv(out_csv, index=False)
        meta["clean_csv"] = str(out_csv)

        with open(paths["preprocess_meta"], "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2, default=str)
        meta["preprocess_meta"] = str(paths["preprocess_meta"])

    return df, meta


def load_or_preprocess(
    force_recompute: bool = False,
) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Prefer existing clean_sales.csv; otherwise run full preprocess.
    """
    paths = default_paths()
    if not force_recompute and paths["clean_csv"].exists():
        df = load_clean_sales(paths["clean_csv"])
        meta: Dict[str, Any] = {"source": "cached_clean_sales"}
        if paths["preprocess_meta"].exists():
            meta.update(json.loads(paths["preprocess_meta"].read_text(encoding="utf-8")))
        return df, meta
    return preprocess_sales(save=True)


# ---------------------------------------------------------------------------
# Label encoders (optional reuse from notebook 02)
# ---------------------------------------------------------------------------

def load_label_encoders(path: Optional[Union[str, Path]] = None) -> Dict[str, Any]:
    paths = default_paths()
    p = Path(path) if path else paths["encoders_pkl"]
    if not p.exists():
        return {}
    with open(p, "rb") as f:
        return pickle.load(f)


def save_label_encoders(encoders: Dict[str, Any], path: Optional[Union[str, Path]] = None) -> Path:
    paths = default_paths()
    p = Path(path) if path else paths["encoders_pkl"]
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "wb") as f:
        pickle.dump(encoders, f)
    return p


# ---------------------------------------------------------------------------
# CLI / self-check
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("Project root:", project_root())
    print("Paths:", default_paths())
    try:
        df, meta = load_or_preprocess(force_recompute=False)
        print(f"Loaded clean sales: {df.shape}")
        print("Meta keys:", list(meta.keys()))
        print(df.head(2))
    except FileNotFoundError as e:
        print("Not ready yet:", e)
        print("Place raw CSV under datasets/ or run with force after data is available.")