"""
ml/metrics.py
-------------
Evaluation metrics for Smart Retail forecasting models.

Used by:
  - train_model.py
  - predict.py
  - notebooks 04 / 05 / 06
  - FastAPI forecast service (later)
"""

from __future__ import annotations

from typing import Any, Dict, Iterable, Optional, Union

import numpy as np
import pandas as pd

Number = Union[int, float]
ArrayLike = Union[np.ndarray, pd.Series, list]


# ---------------------------------------------------------------------------
# Core metrics
# ---------------------------------------------------------------------------

def mae(y_true: ArrayLike, y_pred: ArrayLike) -> float:
    """Mean Absolute Error."""
    yt, yp = _prepare(y_true, y_pred)
    return float(np.mean(np.abs(yt - yp)))


def rmse(y_true: ArrayLike, y_pred: ArrayLike) -> float:
    """Root Mean Squared Error."""
    yt, yp = _prepare(y_true, y_pred)
    return float(np.sqrt(np.mean((yt - yp) ** 2)))


def mape(y_true: ArrayLike, y_pred: ArrayLike, eps: float = 1e-8) -> float:
    """
    Mean Absolute Percentage Error (%).
    Uses |y_true| clipped to eps to avoid division by zero.
    """
    yt, yp = _prepare(y_true, y_pred)
    return float(np.mean(np.abs((yt - yp) / np.clip(np.abs(yt), eps, None))) * 100.0)


def r2_score(y_true: ArrayLike, y_pred: ArrayLike) -> float:
    """Coefficient of determination R²."""
    yt, yp = _prepare(y_true, y_pred)
    ss_res = float(np.sum((yt - yp) ** 2))
    ss_tot = float(np.sum((yt - np.mean(yt)) ** 2))
    if ss_tot < 1e-12:
        return 0.0
    return float(1.0 - ss_res / ss_tot)


def smape(y_true: ArrayLike, y_pred: ArrayLike, eps: float = 1e-8) -> float:
    """Symmetric MAPE (%). More stable when actuals are near zero."""
    yt, yp = _prepare(y_true, y_pred)
    denom = np.clip((np.abs(yt) + np.abs(yp)) / 2.0, eps, None)
    return float(np.mean(np.abs(yt - yp) / denom) * 100.0)


# ---------------------------------------------------------------------------
# Bundle helpers
# ---------------------------------------------------------------------------

def regression_metrics(
    y_true: ArrayLike,
    y_pred: ArrayLike,
    eps: float = 1e-8,
) -> Dict[str, float]:
    """
    Standard metric dict used across notebooks and services.

    Returns
    -------
    {
      "MAE": float,
      "RMSE": float,
      "MAPE": float,
      "SMAPE": float,
      "R2": float,
      "n": int
    }
    """
    yt, yp = _prepare(y_true, y_pred)
    return {
        "MAE": mae(yt, yp),
        "RMSE": rmse(yt, yp),
        "MAPE": mape(yt, yp, eps=eps),
        "SMAPE": smape(yt, yp, eps=eps),
        "R2": r2_score(yt, yp),
        "n": int(len(yt)),
    }


def evaluate_splits(
    model: Any,
    X_splits: Dict[str, pd.DataFrame],
    y_splits: Dict[str, ArrayLike],
    splits: Optional[Iterable[str]] = None,
) -> Dict[str, Dict[str, float]]:
    """
    Evaluate a fitted model on multiple splits.

    Parameters
    ----------
    model : fitted estimator with .predict(X)
    X_splits : {"train": X_train, "val": X_val, "test": X_test}
    y_splits : {"train": y_train, ...}
    splits   : which keys to evaluate (default: all keys present in both)

    Returns
    -------
    {"train": {...metrics...}, "val": {...}, "test": {...}}
    """
    if splits is None:
        splits = [k for k in X_splits.keys() if k in y_splits]

    out: Dict[str, Dict[str, float]] = {}
    for name in splits:
        X = X_splits.get(name)
        y = y_splits.get(name)
        if X is None or y is None or len(X) == 0:
            continue
        yhat = model.predict(X)
        out[name] = regression_metrics(y, yhat)
    return out


def metrics_table(metrics_by_model: Dict[str, Dict[str, Dict[str, float]]]) -> pd.DataFrame:
    """
    Flatten nested metrics into a comparison table.

    Input shape:
      {
        "xgboost": {"val": {"MAE": ..., "RMSE": ...}, "test": {...}},
        "ridge": {...}
      }

    Returns long DataFrame: model | split | MAE | RMSE | MAPE | ...
    """
    rows = []
    for model_name, split_dict in metrics_by_model.items():
        for split_name, m in split_dict.items():
            if not isinstance(m, dict):
                continue
            row = {"model": model_name, "split": split_name}
            row.update(m)
            rows.append(row)
    if not rows:
        return pd.DataFrame()
    return pd.DataFrame(rows)


def rank_models(
    metrics_by_model: Dict[str, Dict[str, Dict[str, float]]],
    split: str = "val",
    metric: str = "MAE",
    ascending: bool = True,
) -> pd.DataFrame:
    """
    Rank models by a metric on a given split (default: val MAE).
    """
    table = metrics_table(metrics_by_model)
    if table.empty or split not in set(table["split"]):
        return pd.DataFrame()
    ranked = (
        table[table["split"] == split]
        .sort_values(metric, ascending=ascending)
        .reset_index(drop=True)
    )
    return ranked


def format_metrics(m: Dict[str, float], prefix: str = "") -> str:
    """Pretty one-line summary for logs / API responses."""
    parts = []
    for key in ("MAE", "RMSE", "MAPE", "SMAPE", "R2"):
        if key in m:
            if key in ("MAPE", "SMAPE"):
                parts.append(f"{key}={m[key]:.2f}%")
            elif key == "R2":
                parts.append(f"{key}={m[key]:.4f}")
            else:
                parts.append(f"{key}={m[key]:,.2f}")
    if "n" in m:
        parts.append(f"n={int(m['n'])}")
    text = " | ".join(parts)
    return f"{prefix}{text}" if prefix else text


# ---------------------------------------------------------------------------
# Internal
# ---------------------------------------------------------------------------

def _prepare(y_true: ArrayLike, y_pred: ArrayLike):
    yt = np.asarray(y_true, dtype=float).ravel()
    yp = np.asarray(y_pred, dtype=float).ravel()
    if yt.shape != yp.shape:
        raise ValueError(f"Shape mismatch: y_true {yt.shape} vs y_pred {yp.shape}")
    mask = np.isfinite(yt) & np.isfinite(yp)
    if not mask.any():
        raise ValueError("No finite values to score")
    return yt[mask], yp[mask]


# ---------------------------------------------------------------------------
# Quick self-check
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    y = np.array([100.0, 200.0, 300.0, 400.0])
    p = np.array([110.0, 190.0, 310.0, 380.0])
    m = regression_metrics(y, p)
    print(format_metrics(m, prefix="demo: "))
    print(m)