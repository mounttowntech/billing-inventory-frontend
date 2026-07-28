import API from "../../services/api";

export const getProductsApi = async () => {
  const response = await API.get("products/all");
  return response.data;
};

export const getProductByIdApi = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

export const createProductApi = async (data) => {
  try {
  const response = await API.post("/products/create", data);
  return response.data;
  } catch (error) {
    console.error("Error updating attendance request:", error.response?.data?.message || error.message);
    throw error?.response?.data?.message || "Failed to create product"; // Rethrow the error to be handled by the caller
  }
};

export const updateProductApi = async (id, data) => {
  try {
  const response = await API.put(`/products/update/${id}`, data);
  return response.data;
  } catch (error) {
    console.log("Error updating product:", error);
    throw error?.response?.data?.message || "Failed to update product"; // Rethrow the error to be handled by the caller
  }
};

export const deleteProductApi = async (id) => {
  try {
    const response = await API.delete(`/products/delete/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error deleting product:", error);
    throw error?.response?.data?.message || "Failed to delete product"; // Rethrow the error to be handled by the caller
  }
};

export const searchBySKUApi = async (sku) => {
  const response = await API.get(`/products/sku/${sku}`);
  return response.data;
};

export const searchByBarcodeApi = async (barcode) => {
  const response = await API.get(`/products/barcode/${barcode}`);
  return response.data;
};

export const getStockSummaryApi = async () => {
  const response = await API.get("/products/stock-summary");
  return response.data;
};
