import { useCallback, useEffect, useState } from "react";
import forecastApi from "../services/forecastApi";

export function useForecast() {
  const [forecasts, setForecasts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [forecastData, summaryData] = await Promise.all([
        forecastApi.list(),
        forecastApi.summary(),
      ]);
      setForecasts(forecastData);
      setSummary(summaryData);
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to load forecasts.");
    } finally {
      setLoading(false);
    }
  }, []);

  const generate = async (productId, periodDays) => {
    const forecast = await forecastApi.generate(productId, periodDays);
    await refresh();
    return forecast;
  };

  const generateAll = async (periodDays) => {
    const generated = await forecastApi.generateAll(periodDays);
    await refresh();
    return generated;
  };

  useEffect(() => { refresh(); }, [refresh]);

  return { forecasts, summary, loading, error, refresh, generate, generateAll };
}
