import API from "../../services/api";

// ========================
// Get All Stock Adjustments
// ========================
const getStockAdjustments = async () => {
  const response = await API.get("/stock-adjustments/all");
  return response.data.data;
};

// ========================
// Get Stock Adjustment By Id
// ========================
const getStockAdjustmentById = async (id) => {
  const response = await API.get(`/stock-adjustments/${id}`);
  return response.data.data;
};

// ========================
// Create Stock Adjustment
// ========================
const createStockAdjustment = async (adjustmentData) => {
  const response = await API.post("/stock-adjustments/create", adjustmentData);

  return response.data.data;
};

// ========================
// Update Stock Adjustment
// ========================
const updateStockAdjustment = async (id, adjustmentData) => {
  const response = await API.put(
    `/stock-adjustments/update/${id}`,
    adjustmentData,
  );

  return response.data.data;
};

// ========================
// Delete Stock Adjustment
// ========================
const deleteStockAdjustment = async (id) => {
  const response = await API.delete(`/stock-adjustments/delete/${id}`);

  return response.data;
};

// ========================
// Export Services
// ========================
const stockAdjustmentService = {
  getStockAdjustments,
  getStockAdjustmentById,
  createStockAdjustment,
  updateStockAdjustment,
  deleteStockAdjustment,
};

export default stockAdjustmentService;
