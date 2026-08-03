import { useState, useEffect, useCallback } from "react";
import salesApi from "../services/salesApi";

export const useSales = () => {
  // ==========================================================
  // State
  // ==========================================================

  const [sales, setSales] = useState([]);

  const [dashboard, setDashboard] = useState(null);

  const [analytics, setAnalytics] = useState(null);

  const [recentSales, setRecentSales] = useState([]);

  const [topProducts, setTopProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  // ==========================================================
  // Load Sales
  // ==========================================================

  const fetchSales = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const data = await salesApi.getAllSales(params);

      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.detail ||
          err.message ||
          "Unable to load sales."
      );

      setSales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================
  // Dashboard
  // ==========================================================

  const fetchDashboard = useCallback(async () => {
    try {
      const data = await salesApi.getDashboard();

      setDashboard(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // ==========================================================
  // Analytics
  // ==========================================================

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await salesApi.getAnalytics();

      setAnalytics(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // ==========================================================
  // Recent Sales
  // ==========================================================

  const fetchRecentSales = useCallback(async () => {
    try {
      const data = await salesApi.getRecentSales();

      setRecentSales(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // ==========================================================
  // Top Products
  // ==========================================================

  const fetchTopProducts = useCallback(async () => {
    try {
      const data = await salesApi.getTopProducts();

      setTopProducts(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // ==========================================================
  // Create Sale
  // ==========================================================

  const createSale = async (saleData) => {
    const sale = await salesApi.createSale(saleData);

    await refreshAll();

    return sale;
  };

  // ==========================================================
  // Update Sale
  // ==========================================================

  const updateSale = async (id, saleData) => {
    const sale = await salesApi.updateSale(
      id,
      saleData
    );

    await refreshAll();

    return sale;
  };

  // ==========================================================
  // Delete Sale
  // ==========================================================

  const deleteSale = async (id) => {
    await salesApi.deleteSale(id);

    await refreshAll();
  };

  // ==========================================================
  // Upload CSV
  // ==========================================================

  const uploadCSV = async (file) => {
    const result =
      await salesApi.uploadSalesCSV(file);

    await refreshAll();

    return result;
  };

  // ==========================================================
  // Refresh Everything
  // ==========================================================

  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchSales(),
      fetchDashboard(),
      fetchAnalytics(),
      fetchRecentSales(),
      fetchTopProducts(),
    ]);
  }, [
    fetchSales,
    fetchDashboard,
    fetchAnalytics,
    fetchRecentSales,
    fetchTopProducts,
  ]);

  // ==========================================================
  // Initial Load
  // ==========================================================

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // ==========================================================
  // Return
  // ==========================================================

  return {
    sales,

    dashboard,

    analytics,

    recentSales,

    topProducts,

    loading,

    error,

    fetchSales,

    fetchDashboard,

    fetchAnalytics,

    fetchRecentSales,

    fetchTopProducts,

    createSale,

    updateSale,

    deleteSale,

    uploadCSV,

    refreshAll,
    refreshSales: refreshAll,
  };
};
