import api from "./api";

/**
 * reportsApi.js  ← your actual filename
 */

const reportsApi = {
  dashboard: async ({ from_date, to_date, product_limit = 10 } = {}) => {
    const { data } = await api.get("/reports/dashboard", {
      params: {
        from_date: from_date || undefined,
        to_date: to_date || undefined,
        product_limit,
      },
    });
    return data;
  },

  overview: async (params = {}) => {
    const { data } = await api.get("/reports/overview", { params });
    return data;
  },

  trend: async (params = {}) => {
    const { data } = await api.get("/reports/trend", { params });
    return data;
  },

  products: async (params = {}) => {
    const { data } = await api.get("/reports/products", { params });
    return data;
  },

  inventory: async () => {
    const { data } = await api.get("/reports/inventory");
    return data;
  },

  categoryMix: async (params = {}) => {
    const { data } = await api.get("/reports/category-mix", { params });
    return data;
  },

  forecastAccuracy: async (params = {}) => {
    const { data } = await api.get("/reports/forecast-accuracy", {
      params: { history_days: params.history_days ?? 30 },
    });
    return data;
  },

  listSaved: async () => (await api.get("/reports/saved")).data,

  saveSnapshot: async ({ title, report_type = "summary", from_date, to_date } = {}) => {
    const { data } = await api.post("/reports/saved", null, {
      params: { title, report_type, from_date, to_date },
    });
    return data;
  },

  removeSaved: async (id) => {
    await api.delete(`/reports/saved/${id}`);
    return true;
  },
};

/** Profile.jsx expects these field names */
export async function getDashboardReport(params = {}) {
  try {
    const data = await reportsApi.dashboard(params);
    const o = data?.overview || {};
    const inv = data?.inventory || {};

    return {
      total_products: inv.total_skus ?? o.unique_products_sold ?? 0,
      total_units_sold: o.total_units ?? 0,
      total_sales_amount: o.total_revenue ?? 0,
      low_stock_alerts:
        (inv.low_stock_count || 0) + (inv.out_of_stock_count || 0),
      expected_profit_next_30_days: o.total_profit ?? 0,
      overview: o,
      inventory: inv,
      raw: data,
    };
  } catch (err) {
    console.error("getDashboardReport failed:", err);
    return {
      total_products: 0,
      total_units_sold: 0,
      total_sales_amount: 0,
      low_stock_alerts: 0,
      expected_profit_next_30_days: 0,
    };
  }
}

export default reportsApi;

export const getReportOverview = (p) => reportsApi.overview(p);
export const getReportTrend = (p) => reportsApi.trend(p);
export const getReportProducts = (p) => reportsApi.products(p);
export const getReportInventory = () => reportsApi.inventory();