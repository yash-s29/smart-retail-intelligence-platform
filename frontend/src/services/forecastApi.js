import api from "./api";

/**
 * Forecast API client
 * - Product-level (DB forecasts)
 * - Chain-level ML (dashboard / charts)
 */

const forecastApi = {
  // =====================================================
  // Product-level (existing)
  // =====================================================

  /** List saved product forecasts for current user */
  list: async () => {
    const { data } = await api.get("/forecast");
    return data;
  },

  /** Product forecast summary KPIs */
  summary: async () => {
    const { data } = await api.get("/forecast/summary");
    return data;
  },

  /** Generate forecast for one product */
  generate: async (productId, periodDays = 30) => {
    const { data } = await api.post("/forecast/generate", {
      product_id: Number(productId),
      period_days: Number(periodDays) || 30,
    });
    return data;
  },

  /** Generate forecasts for all products of current user */
  generateAll: async (periodDays = 30) => {
    const { data } = await api.post("/forecast/generate-all", null, {
      params: { period_days: Number(periodDays) || 30 },
    });
    return data;
  },

  /** Get one forecast by id */
  getById: async (forecastId) => {
    const { data } = await api.get(`/forecast/${forecastId}`);
    return data;
  },

  /** Delete one forecast */
  remove: async (forecastId) => {
    await api.delete(`/forecast/${forecastId}`);
    return true;
  },

  // =====================================================
  // Chain-level ML (Forecast page)
  // =====================================================

  /**
   * Main dashboard payload for Forecasting.jsx
   * @param {Object} params
   * @param {number} [params.horizon_days=7]
   * @param {string} [params.model_name="best"]
   * @param {number} [params.include_history_days=30]
   */
  mlDashboard: async ({
    horizon_days = 7,
    model_name = "best",
    include_history_days = 30,
  } = {}) => {
    const { data } = await api.get("/forecast/ml/dashboard", {
      params: {
        horizon_days: Number(horizon_days) || 7,
        model_name: model_name || "best",
        include_history_days: Number(include_history_days) || 30,
      },
    });
    return data;
  },

  /**
   * On-demand ML predict (custom horizon / model)
   * @param {Object} body
   */
  mlPredict: async ({
    horizon_days = 7,
    model_name = "best",
    include_history_days = 30,
  } = {}) => {
    const { data } = await api.post("/forecast/ml/predict", {
      horizon_days: Number(horizon_days) || 7,
      model_name: model_name || "best",
      include_history_days: Number(include_history_days) || 30,
    });
    return data;
  },

  /** List available ML model pickles */
  mlModels: async () => {
    const { data } = await api.get("/forecast/ml/models");
    return data;
  },

  /**
   * Retrain global ML models (admin-style)
   * @param {Object} body
   */
  mlTrain: async ({
    retrain = true,
    tune_xgb = true,
    force_rebuild_features = false,
  } = {}) => {
    const { data } = await api.post("/forecast/ml/train", {
      retrain,
      tune_xgb,
      force_rebuild_features,
    });
    return data;
  },
};

export default forecastApi;