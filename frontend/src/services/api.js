import axios from "axios";

// Prefer Vite env; fallback for local dev
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // ML forecast / train can be slower
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// --------------------------------------------------
// Request: attach JWT
// --------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------------------------------------
// Response: handle 401 + normalize errors
// --------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("access_token");
      // Optional: soft redirect only if not already on login
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/auth")
      ) {
        // keep soft — don't hard force if you use client router guards
        // window.location.href = "/login";
      }
    }

    // Attach a readable message for UI toasts
    const detail =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Request failed";

    error.friendlyMessage = Array.isArray(detail)
      ? detail.map((d) => d.msg || d).join(", ")
      : String(detail);

    return Promise.reject(error);
  }
);

export default api;

// --------------------------------------------------
// Optional helpers (Forecast page can import these)
// --------------------------------------------------

/** GET chain-level ML dashboard */
export const getForecastDashboard = (params = {}) =>
  api.get("/forecast/ml/dashboard", {
    params: {
      horizon_days: params.horizon_days ?? 7,
      model_name: params.model_name ?? "best",
      include_history_days: params.include_history_days ?? 30,
    },
  });

/** POST custom ML predict */
export const postForecastPredict = (body = {}) =>
  api.post("/forecast/ml/predict", {
    horizon_days: body.horizon_days ?? 7,
    model_name: body.model_name ?? "best",
    include_history_days: body.include_history_days ?? 30,
  });

/** GET available models */
export const getForecastModels = () => api.get("/forecast/ml/models");

/** POST retrain ML models */
export const postForecastTrain = (body = {}) =>
  api.post("/forecast/ml/train", {
    retrain: body.retrain ?? true,
    tune_xgb: body.tune_xgb ?? true,
    force_rebuild_features: body.force_rebuild_features ?? false,
  });

/** Product-level list / summary (optional tabs) */
export const getProductForecasts = () => api.get("/forecast");
export const getProductForecastSummary = () => api.get("/forecast/summary");
export const generateProductForecast = (payload) =>
  api.post("/forecast/generate", payload);