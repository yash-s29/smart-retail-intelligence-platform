import api from "./api";

const salesApi = {
  // ==========================================================
  // Sales CRUD
  // ==========================================================

  getAllSales: async (params = {}) => {
    try {
      const response = await api.get("/sales", {
        params,
      });

      return response.data;
    } catch (error) {
      console.error("Failed to fetch sales:", error);
      throw error;
    }
  },

  getSaleById: async (saleId) => {
    try {
      const response = await api.get(`/sales/record/${saleId}`);

      return response.data;
    } catch (error) {
      console.error("Failed to fetch sale:", error);
      throw error;
    }
  },

  createSale: async (saleData) => {
    try {
      const response = await api.post(
        "/sales",
        saleData
      );

      return response.data;
    } catch (error) {
      console.error("Failed to create sale:", error);
      throw error;
    }
  },

  updateSale: async (
    saleId,
    saleData
  ) => {
    try {
      const response = await api.put(
        `/sales/record/${saleId}`,
        saleData
      );

      return response.data;
    } catch (error) {
      console.error("Failed to update sale:", error);
      throw error;
    }
  },

  deleteSale: async (saleId) => {
    try {
      const response = await api.delete(
        `/sales/record/${saleId}`
      );

      return response.data;
    } catch (error) {
      console.error("Failed to delete sale:", error);
      throw error;
    }
  },

  // ==========================================================
  // Dashboard
  // ==========================================================

  getDashboard: async () => {
    try {
      const response = await api.get(
        "/sales/dashboard"
      );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch dashboard:",
        error
      );

      throw error;
    }
  },

  getAnalytics: async () => {
    try {
      const response = await api.get(
        "/sales/analytics"
      );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch analytics:",
        error
      );

      throw error;
    }
  },

  getRecentSales: async (limit = 10) => {
    try {
      const response = await api.get(
        "/sales/recent",
        {
          params: {
            limit,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch recent sales:",
        error
      );

      throw error;
    }
  },

  getTopProducts: async (limit = 5) => {
    try {
      const response = await api.get(
        "/sales/top-products",
        {
          params: {
            limit,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch top products:",
        error
      );

      throw error;
    }
  },

  // ==========================================================
  // Reports
  // ==========================================================

  getSalesByDateRange: async (
    startDate,
    endDate
  ) => {
    try {
      const response = await api.get(
        "/sales/date-range",
        {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch sales by date:",
        error
      );

      throw error;
    }
  },

  // ==========================================================
  // CSV Upload
  // ==========================================================

  uploadSalesCSV: async (file) => {
    try {
      const formData = new FormData();

      formData.append(
        "file",
        file
      );

      const response = await api.post(
        "/sales/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "CSV Upload failed:",
        error
      );

      throw error;
      
    }
  },
};

export default salesApi;
