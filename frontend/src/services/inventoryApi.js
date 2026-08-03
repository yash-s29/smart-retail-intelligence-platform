import api from "./api";

// ======================================================
// Get All Inventory
// ======================================================

export const getInventory = async () => {
  const response = await api.get("/inventory");
  return response.data;
};

// ======================================================
// Get Inventory By ID
// ======================================================

export const getInventoryById = async (id) => {
  const response = await api.get(`/inventory/${id}`);
  return response.data;
};

// ======================================================
// Create Inventory
// ======================================================

export const createInventory = async (inventoryData) => {
  const response = await api.post("/inventory", inventoryData);
  return response.data;
};

// ======================================================
// Update Inventory
// ======================================================

export const updateInventory = async (id, inventoryData) => {
  const response = await api.put(
    `/inventory/${id}`,
    inventoryData
  );

  return response.data;
};

// ======================================================
// Delete Inventory
// ======================================================

export const deleteInventory = async (id) => {
  const response = await api.delete(`/inventory/${id}`);
  return response.data;
};

// ======================================================
// Search Inventory
// ======================================================

export const searchInventory = async (keyword) => {
  const response = await api.get(
    `/inventory/search?keyword=${keyword}`
  );

  return response.data;
};

// ======================================================
// Low Stock Alerts
// ======================================================

export const getLowStock = async () => {
  const response = await api.get("/inventory/alerts");
  return response.data;
};

// ======================================================
// Restock Recommendations
// ======================================================

export const getRestockRecommendations = async () => {
  const response = await api.get("/inventory/restock");
  return response.data;
};

// ======================================================
// Update Stock Only
// ======================================================

export const updateStock = async (id, quantity) => {
  const response = await api.patch(
    `/inventory/${id}/stock?quantity=${quantity}`
  );

  return response.data;
};

// ======================================================
// Bulk Update (Future)
// ======================================================

export const bulkUpdate = async (inventoryList) => {
  const response = await api.post(
    "/inventory/bulk-update",
    inventoryList
  );

  return response.data;
};