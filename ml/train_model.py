"""
ml/train_model.py
-----------------
Train baseline + XGBoost models for Smart Retail forecasting.

Uses:
  - ml.preprocessing
  - ml.feature_engineering
  - ml.metrics

Saves:
  ml/models/linear_model.pkl
  ml/models/random_forest_model.pkl
  ml/models/xgboost_model.pkl
  ml/models/best_model.pkl
  ml/models/model_comparison.json
"""

from __future__ import annotations

import json
import pickle
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import Ridge

from ml.feature_engineering import (
    get_model_feature_columns,
    load_or_build_features,
)
from ml.metrics import evaluate_splits, format_metrics, rank_models, regression_metrics
from ml.preprocessing import default_paths

# Optional XGBoost
try:
    from xgboost import XGBRegressor
    HAS_XGB = True
except ImportError:
    HAS_XGB = False


# ---------------------------------------------------------------------------
# Data helpers
# ---------------------------------------------------------------------------

def make_xy(
    df: pd.DataFrame,
    feature_cols: List[str],
    target: str = "y",
) -> Tuple[pd.DataFrame, np.ndarray]:
    X = df[feature_cols].copy()
    y = df[target].astype(float).values
    X = X.fillna(X.median(numeric_only=True))
    return X, y


def split_matrices(
    features: pd.DataFrame,
    feature_cols: Optional[List[str]] = None,
    target: str = "y",
) -> Dict[str, Any]:
    if feature_cols is None:
        feature_cols = get_model_feature_columns(features)

    out: Dict[str, Any] = {"feature_cols": feature_cols}
    for name in ("train", "val", "test"):
        part = features[features["split"] == name].copy()
        if len(part) == 0:
            out[f"X_{name}"] = pd.DataFrame(columns=feature_cols)
            out[f"y_{name}"] = np.array([])
            out[f"ds_{name}"] = np.array([])
            continue
        X, y = make_xy(part, feature_cols, target=target)
        out[f"X_{name}"] = X
        out[f"y_{name}"] = y
        out[f"ds_{name}"] = part["ds"].values
    return out


# ---------------------------------------------------------------------------
# Trainers
# ---------------------------------------------------------------------------

def train_ridge(
    X_train: pd.DataFrame,
    y_train: np.ndarray,
    alpha: float = 1.0,
) -> Ridge:
    model = Ridge(alpha=alpha, random_state=42)
    model.fit(X_train, y_train)
    return model


def train_random_forest(
    X_train: pd.DataFrame,
    y_train: np.ndarray,
    n_estimators: int = 200,
    max_depth: int = 12,
    min_samples_leaf: int = 5,
) -> RandomForestRegressor:
    model = RandomForestRegressor(
        n_estimators=n_estimators,
        max_depth=max_depth,
        min_samples_leaf=min_samples_leaf,
        n_jobs=-1,
        random_state=42,
    )
    model.fit(X_train, y_train)
    return model


def train_xgboost(
    X_train: pd.DataFrame,
    y_train: np.ndarray,
    X_val: Optional[pd.DataFrame] = None,
    y_val: Optional[np.ndarray] = None,
    params: Optional[Dict[str, Any]] = None,
) -> Any:
    if not HAS_XGB:
        raise ImportError("xgboost is not installed. Run: pip install xgboost")

    default_params = {
        "n_estimators": 400,
        "learning_rate": 0.05,
        "max_depth": 6,
        "min_child_weight": 5,
        "subsample": 0.8,
        "colsample_bytree": 0.8,
        "reg_lambda": 1.0,
        "objective": "reg:squarederror",
        "random_state": 42,
        "n_jobs": -1,
    }
    if params:
        default_params.update(params)

    model = XGBRegressor(**default_params)

    fit_kwargs: Dict[str, Any] = {}
    if X_val is not None and y_val is not None and len(X_val) > 0:
        fit_kwargs["eval_set"] = [(X_val, y_val)]
        fit_kwargs["verbose"] = False
        try:
            model.set_params(early_stopping_rounds=30)
        except Exception:
            pass

    model.fit(X_train, y_train, **fit_kwargs)
    return model


def light_tune_xgboost(
    X_train: pd.DataFrame,
    y_train: np.ndarray,
    X_val: pd.DataFrame,
    y_val: np.ndarray,
) -> Tuple[Any, Dict[str, Any]]:
    """Small validation grid (same spirit as notebook 05)."""
    grid = [
        {"max_depth": 4, "learning_rate": 0.05, "min_child_weight": 5},
        {"max_depth": 6, "learning_rate": 0.05, "min_child_weight": 5},
        {"max_depth": 8, "learning_rate": 0.03, "min_child_weight": 3},
        {"max_depth": 6, "learning_rate": 0.03, "min_child_weight": 5},
    ]
    best_model = None
    best_params: Dict[str, Any] = {}
    best_mae = np.inf

    for params in grid:
        model = train_xgboost(X_train, y_train, X_val, y_val, params=params)
        pred = model.predict(X_val)
        score = regression_metrics(y_val, pred)["MAE"]
        if score < best_mae:
            best_mae = score
            best_model = model
            best_params = params

    return best_model, best_params


# ---------------------------------------------------------------------------
# Bundle / save
# ---------------------------------------------------------------------------

def make_bundle(
    model: Any,
    model_type: str,
    feature_cols: List[str],
    metrics: Dict[str, Any],
    extra: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    bundle: Dict[str, Any] = {
        "model": model,
        "model_type": model_type,
        "feature_cols": feature_cols,
        "metrics": metrics,
        "target": "y",
    }
    if extra:
        bundle.update(extra)
    return bundle


def save_bundle(bundle: Dict[str, Any], path: Path) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "wb") as f:
        pickle.dump(bundle, f)
    return path


def load_bundle(path: Path) -> Dict[str, Any]:
    with open(path, "rb") as f:
        return pickle.load(f)


# ---------------------------------------------------------------------------
# Full training workflow
# ---------------------------------------------------------------------------

def train_all(
    force_rebuild_features: bool = False,
    tune_xgb: bool = True,
    save: bool = True,
) -> Dict[str, Any]:
    """
    Train Ridge + RandomForest + XGBoost, evaluate, pick best, save artifacts.
    """
    paths = default_paths()
    models_dir = paths["models_dir"]
    models_dir.mkdir(parents=True, exist_ok=True)

    features, feat_meta = load_or_build_features(force_recompute=force_rebuild_features)
    feature_cols = feat_meta.get("feature_cols") or get_model_feature_columns(features)
    data = split_matrices(features, feature_cols=feature_cols)

    X_train, y_train = data["X_train"], data["y_train"]
    X_val, y_val = data["X_val"], data["y_val"]
    X_test, y_test = data["X_test"], data["y_test"]

    if len(X_train) == 0:
        raise ValueError("Train split is empty. Check features.csv split column.")

    X_splits = {"train": X_train, "val": X_val, "test": X_test}
    y_splits = {"train": y_train, "val": y_val, "test": y_test}

    results: Dict[str, Any] = {"feature_cols": feature_cols, "models": {}}

    # ---- Ridge ----
    ridge = train_ridge(X_train, y_train)
    ridge_metrics = evaluate_splits(ridge, X_splits, y_splits)
    results["models"]["ridge"] = {
        "metrics": ridge_metrics,
        "bundle": make_bundle(ridge, "ridge", feature_cols, ridge_metrics),
    }
    print("Ridge :", format_metrics(ridge_metrics.get("val", ridge_metrics.get("train", {})), "val "))

    # ---- Random Forest ----
    rf = train_random_forest(X_train, y_train)
    rf_metrics = evaluate_splits(rf, X_splits, y_splits)
    imp = []
    if hasattr(rf, "feature_importances_"):
        imp = (
            pd.DataFrame({"feature": feature_cols, "importance": rf.feature_importances_})
            .sort_values("importance", ascending=False)
            .to_dict(orient="records")
        )
    results["models"]["random_forest"] = {
        "metrics": rf_metrics,
        "bundle": make_bundle(
            rf, "random_forest", feature_cols, rf_metrics,
            extra={"feature_importance": imp},
        ),
    }
    print("RF    :", format_metrics(rf_metrics.get("val", rf_metrics.get("train", {})), "val "))

    # ---- XGBoost ----
    if HAS_XGB:
        best_params: Dict[str, Any] = {}
        if tune_xgb and len(X_val) > 0:
            xgb_model, best_params = light_tune_xgboost(X_train, y_train, X_val, y_val)
        else:
            xgb_model = train_xgboost(X_train, y_train, X_val if len(X_val) else None, y_val if len(y_val) else None)
        xgb_metrics = evaluate_splits(xgb_model, X_splits, y_splits)
        xgb_imp = []
        if hasattr(xgb_model, "feature_importances_"):
            xgb_imp = (
                pd.DataFrame({"feature": feature_cols, "importance": xgb_model.feature_importances_})
                .sort_values("importance", ascending=False)
                .to_dict(orient="records")
            )
        results["models"]["xgboost"] = {
            "metrics": xgb_metrics,
            "bundle": make_bundle(
                xgb_model, "xgboost", feature_cols, xgb_metrics,
                extra={"params": best_params, "feature_importance": xgb_imp},
            ),
        }
        print("XGB   :", format_metrics(xgb_metrics.get("val", xgb_metrics.get("train", {})), "val "))
    else:
        print("⚠️ xgboost not installed — skipped")

    # ---- Rank & select best (val MAE) ----
    metrics_by_model = {k: v["metrics"] for k, v in results["models"].items()}
    ranked = rank_models(metrics_by_model, split="val", metric="MAE", ascending=True)
    if ranked.empty:
        ranked = rank_models(metrics_by_model, split="test", metric="MAE", ascending=True)
        selection_split = "test"
    else:
        selection_split = "val"

    if ranked.empty:
        raise RuntimeError("Could not rank models — no metrics available.")

    best_name = str(ranked.iloc[0]["model"])
    best_mae = float(ranked.iloc[0]["MAE"])
    results["best_model"] = best_name
    results["selection_rule"] = f"lowest_{selection_split}_MAE"
    results["selection_mae"] = best_mae
    results["ranking"] = ranked.to_dict(orient="records")

    print("=" * 50)
    print(f"BEST MODEL: {best_name} ({selection_split} MAE={best_mae:,.2f})")
    print("=" * 50)

    # ---- Refit winner on train+val for production bundle ----
    train_val = features[features["split"].isin(["train", "val"])].copy()
    X_tv, y_tv = make_xy(train_val, feature_cols)
    best_bundle = results["models"][best_name]["bundle"]

    if best_name == "ridge":
        final_model = train_ridge(X_tv, y_tv)
    elif best_name == "random_forest":
        final_model = train_random_forest(X_tv, y_tv)
    elif best_name == "xgboost":
        final_model = train_xgboost(X_tv, y_tv, params=best_bundle.get("params") or None)
    else:
        final_model = best_bundle["model"]

    prod_bundle = make_bundle(
        final_model,
        best_name if best_name != "ridge" else "ridge",
        feature_cols,
        best_bundle["metrics"],
        extra={
            "selected_as_best": True,
            "selection_rule": results["selection_rule"],
            "selection_mae": best_mae,
            "compared_models": list(results["models"].keys()),
            "feature_importance": best_bundle.get("feature_importance", []),
            "params": best_bundle.get("params", {}),
        },
    )
    results["best_bundle"] = prod_bundle

    if save:
        # individual models (train-only metrics versions already in results;
        # save production-quality objects from current fitted models)
        save_map = {
            "ridge": models_dir / "linear_model.pkl",
            "random_forest": models_dir / "random_forest_model.pkl",
            "xgboost": models_dir / "xgboost_model.pkl",
        }
        for name, bundle_wrap in results["models"].items():
            # refit each on train+val for saved artifacts
            if name == "ridge":
                m = train_ridge(X_tv, y_tv)
            elif name == "random_forest":
                m = train_random_forest(X_tv, y_tv)
            elif name == "xgboost":
                m = train_xgboost(X_tv, y_tv, params=bundle_wrap["bundle"].get("params") or None)
            else:
                continue
            b = make_bundle(
                m, bundle_wrap["bundle"]["model_type"], feature_cols, bundle_wrap["metrics"],
                extra={
                    "feature_importance": bundle_wrap["bundle"].get("feature_importance", []),
                    "params": bundle_wrap["bundle"].get("params", {}),
                },
            )
            save_bundle(b, save_map[name])
            print(f"Saved {save_map[name]}")

        best_path = models_dir / "best_model.pkl"
        save_bundle(prod_bundle, best_path)
        print(f"Saved {best_path}")

        report = {
            "best_model": best_name,
            "selection_rule": results["selection_rule"],
            "selection_mae": best_mae,
            "ranking": results["ranking"],
            "metrics": metrics_by_model,
            "feature_cols": feature_cols,
        }
        report_path = models_dir / "model_comparison.json"
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, default=str)
        print(f"Saved {report_path}")
        results["report_path"] = str(report_path)
        results["best_model_path"] = str(best_path)

    return results


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("Training all models...")
    out = train_all(force_rebuild_features=False, tune_xgb=True, save=True)
    print("\nDone.")
    print("Best:", out.get("best_model"))
    print("Rule:", out.get("selection_rule"), out.get("selection_mae"))