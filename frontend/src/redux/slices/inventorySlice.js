import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getInventory,
  getInventoryById,
  createInventory as createInventoryApi,
  updateInventory as updateInventoryApi,
  deleteInventory as deleteInventoryApi,
  getLowStock,
  getRestockRecommendations,
} from "../../services/inventoryApi";

// ======================================================
// Notification Helper
// ======================================================

const createNotification = ({
  type,
  severity,
  title,
  message,
  product,
}) => ({
  id: `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 10)}`,

  type,

  severity,

  title,

  message,

  productId: product?.id ?? null,

  productName:
    product?.product_name ??
    product?.product?.name ??
    "Unknown Product",

  sku: product?.sku ?? "-",

  warehouse:
    product?.warehouse ?? "-",

  supplier:
    product?.supplier ?? "-",

  currentStock:
    product?.current_stock ?? 0,

  minimumStock:
    product?.minimum_stock ?? 0,

  maximumStock:
    product?.maximum_stock ?? 0,

  read: false,

  createdAt: new Date().toISOString(),
});

// ======================================================
// Fetch All Inventory
// ======================================================

export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (_, { rejectWithValue }) => {
    try {
      return await getInventory();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
          "Failed to fetch inventory."
      );
    }
  }
);

// ======================================================
// Fetch Inventory By ID
// ======================================================

export const fetchInventoryById =
  createAsyncThunk(
    "inventory/fetchInventoryById",
    async (id, { rejectWithValue }) => {
      try {
        return await getInventoryById(id);
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.detail ||
            "Inventory not found."
        );
      }
    }
  );

// ======================================================
// Create Inventory
// ======================================================

export const createInventory =
  createAsyncThunk(
    "inventory/createInventory",
    async (
      inventoryData,
      { rejectWithValue }
    ) => {
      try {
        return await createInventoryApi(
          inventoryData
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.detail ||
            "Unable to create inventory."
        );
      }
    }
  );

// ======================================================
// Update Inventory
// ======================================================

export const updateInventory =
  createAsyncThunk(
    "inventory/updateInventory",
    async (
      { id, inventoryData },
      { rejectWithValue }
    ) => {
      try {
        return await updateInventoryApi(
          id,
          inventoryData
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.detail ||
            "Unable to update inventory."
        );
      }
    }
  );

// ======================================================
// Delete Inventory
// ======================================================

export const deleteInventory =
  createAsyncThunk(
    "inventory/deleteInventory",
    async (id, { rejectWithValue }) => {
      try {
        await deleteInventoryApi(id);
        return id;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.detail ||
            "Unable to delete inventory."
        );
      }
    }
  );

// ======================================================
// Fetch Inventory Alerts
// ======================================================

export const fetchAlerts =
  createAsyncThunk(
    "inventory/fetchAlerts",
    async (_, { rejectWithValue }) => {
      try {
        return await getLowStock();
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.detail ||
            "Failed to load alerts."
        );
      }
    }
  );

// ======================================================
// Fetch Restock Recommendations
// ======================================================

export const fetchRecommendations =
  createAsyncThunk(
    "inventory/fetchRecommendations",
    async (_, { rejectWithValue }) => {
      try {
        return await getRestockRecommendations();
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.detail ||
            "Failed to load recommendations."
        );
      }
    }
  );

// ======================================================
// Initial State
// ======================================================

const initialState = {
  // ==========================================
  // Inventory
  // ==========================================

  inventory: [],

  selectedItem: null,

  // ==========================================
  // Alerts
  // ==========================================

  alerts: [],

  recommendations: [],

  // ==========================================
  // Notification Center
  // ==========================================

  notifications: [],

  unreadCount: 0,

  lastNotificationAt: null,

  // ==========================================
  // Request State
  // ==========================================

  loading: false,

  error: null,
};

// ======================================================
// Slice
// ======================================================
const inventorySlice = createSlice({
  name: "inventory",

  initialState,

  reducers: {
    // ======================================================
    // Inventory
    // ======================================================

    clearSelectedInventory(state) {
      state.selectedItem = null;
    },

    clearInventoryError(state) {
      state.error = null;
    },

    // ======================================================
    // Notification Center
    // ======================================================

    markNotificationRead(state, action) {
      const notification =
        state.notifications.find(
          (item) => item.id === action.payload
        );

      if (notification) {
        notification.read = true;
      }

      state.unreadCount =
        state.notifications.filter(
          (item) => !item.read
        ).length;
    },

    markAllNotificationsRead(state) {
      state.notifications.forEach(
        (notification) => {
          notification.read = true;
        }
      );

      state.unreadCount = 0;
    },

    deleteNotification(state, action) {
      state.notifications =
        state.notifications.filter(
          (notification) =>
            notification.id !== action.payload
        );

      state.unreadCount =
        state.notifications.filter(
          (notification) => !notification.read
        ).length;
    },

    clearNotifications(state) {
      state.notifications = [];

      state.unreadCount = 0;

      state.lastNotificationAt = null;
    },

    // ======================================================
    // Add Notification
    // ======================================================

    addNotification(state, action) {
      state.notifications.unshift(
        action.payload
      );

      state.unreadCount =
        state.notifications.filter(
          (notification) => !notification.read
        ).length;

      state.lastNotificationAt =
        action.payload.createdAt;
    },

    // ======================================================
    // Generate Notifications
    // ======================================================

    generateNotifications(state) {
      const notifications = [];

      state.inventory.forEach((product) => {
        const current =
          product.current_stock ?? 0;

        const minimum =
          product.minimum_stock ?? 0;

        const maximum =
          product.maximum_stock ?? 0;

        // ===============================
        // Out Of Stock
        // ===============================

        if (current <= 0) {
          notifications.push(
            createNotification({
              type: "out_of_stock",

              severity: "error",

              title: "Out of Stock",

              message: `${product.product_name} is completely out of stock.`,

              product,
            })
          );

          return;
        }

        // ===============================
        // Low Stock
        // ===============================

        if (current <= minimum) {
          notifications.push(
            createNotification({
              type: "low_stock",

              severity: "warning",

              title: "Low Stock",

              message: `${product.product_name} is running low on stock.`,

              product,
            })
          );
        }

        // ===============================
        // Overstock
        // ===============================

        if (
          maximum > 0 &&
          current >= maximum
        ) {
          notifications.push(
            createNotification({
              type: "over_stock",

              severity: "info",

              title: "Overstock",

              message: `${product.product_name} has exceeded the maximum stock level.`,

              product,
            })
          );
        }
      });

      state.notifications =
        notifications;

      state.unreadCount =
        notifications.length;

      state.lastNotificationAt =
        notifications.length > 0
          ? notifications[0].createdAt
          : null;
    },
  },

  extraReducers: (builder) => {
        builder

      // ======================================================
      // Fetch Inventory
      // ======================================================

      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;

        state.inventory = action.payload;

        // ==========================================
        // Generate Real-Time Notifications
        // ==========================================

        const notifications = [];

        action.payload.forEach((product) => {
          const current =
            product.current_stock ?? 0;

          const minimum =
            product.minimum_stock ?? 0;

          const maximum =
            product.maximum_stock ?? 0;

          // ==============================
          // Out Of Stock
          // ==============================

          if (current <= 0) {
            notifications.push(
              createNotification({
                type: "out_of_stock",

                severity: "error",

                title: "Out of Stock",

                message: `${product.product_name} is completely out of stock.`,

                product,
              })
            );

            return;
          }

          // ==============================
          // Low Stock
          // ==============================

          if (current <= minimum) {
            notifications.push(
              createNotification({
                type: "low_stock",

                severity: "warning",

                title: "Low Stock",

                message: `${product.product_name} is running low on stock.`,

                product,
              })
            );
          }

          // ==============================
          // Overstock
          // ==============================

          if (
            maximum > 0 &&
            current >= maximum
          ) {
            notifications.push(
              createNotification({
                type: "over_stock",

                severity: "info",

                title: "Overstock",

                message: `${product.product_name} has exceeded the maximum stock level.`,

                product,
              })
            );
          }
        });

        state.notifications = notifications;

        state.unreadCount =
          notifications.filter(
            (notification) => !notification.read
          ).length;

        state.lastNotificationAt =
          notifications.length > 0
            ? notifications[0].createdAt
            : null;
      })

      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      })

      // ======================================================
      // Fetch Inventory By ID
      // ======================================================

      .addCase(fetchInventoryById.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchInventoryById.fulfilled, (state, action) => {
        state.loading = false;

        state.selectedItem = action.payload;
      })

      .addCase(fetchInventoryById.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      })

      // ======================================================
      // Create Inventory
      // ======================================================
            .addCase(createInventory.fulfilled, (state, action) => {
        state.inventory.unshift(action.payload);

        state.notifications.unshift(
          createNotification({
            type: "inventory_created",

            severity: "success",

            title: "Inventory Created",

            message: `${action.payload.product_name} has been added to inventory.`,

            product: action.payload,
          })
        );

        state.unreadCount =
          state.notifications.filter(
            (notification) => !notification.read
          ).length;

        state.lastNotificationAt =
          state.notifications[0]?.createdAt ?? null;
      })

      .addCase(createInventory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ======================================================
      // Update Inventory
      // ======================================================

      .addCase(updateInventory.fulfilled, (state, action) => {
        const index = state.inventory.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index !== -1) {
          state.inventory[index] = action.payload;
        }

        state.selectedItem = action.payload;

        state.notifications.unshift(
          createNotification({
            type: "inventory_updated",

            severity: "info",

            title: "Inventory Updated",

            message: `${action.payload.product_name} inventory was updated.`,

            product: action.payload,
          })
        );

        state.unreadCount =
          state.notifications.filter(
            (notification) => !notification.read
          ).length;

        state.lastNotificationAt =
          state.notifications[0]?.createdAt ?? null;
      })

      .addCase(updateInventory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ======================================================
      // Delete Inventory
      // ======================================================

      .addCase(deleteInventory.fulfilled, (state, action) => {
        const deletedItem =
          state.inventory.find(
            (item) => item.id === action.payload
          );

        state.inventory =
          state.inventory.filter(
            (item) => item.id !== action.payload
          );

        if (deletedItem) {
          state.notifications.unshift(
            createNotification({
              type: "inventory_deleted",

              severity: "warning",

              title: "Inventory Deleted",

              message: `${deletedItem.product_name} has been removed from inventory.`,

              product: deletedItem,
            })
          );

          state.unreadCount =
            state.notifications.filter(
              (notification) => !notification.read
            ).length;

          state.lastNotificationAt =
            state.notifications[0]?.createdAt ?? null;
        }
      })

      .addCase(deleteInventory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ======================================================
      // Inventory Alerts
      // ======================================================

      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload;
      })

      .addCase(fetchAlerts.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ======================================================
      // Restock Recommendations
      // ======================================================

      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
      })

      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// ======================================================
// Exports
// ======================================================

export const {
  clearSelectedInventory,
  clearInventoryError,

  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearNotifications,

  addNotification,
  generateNotifications,
} = inventorySlice.actions;

export default inventorySlice.reducer;