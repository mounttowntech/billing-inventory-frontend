import API from "../../services/api";

export const getProductsApi = async () => {
  const response = await API.get("/products");
  return response.data;
};

export const getProductByIdApi = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

export const createProductApi = async (data) => {
  const response = await API.post("/products/create", data);
  return response.data;
};

export const updateProductApi = async (id, data) => {
  const response = await API.put(`/products/update/${id}`, data);
  return response.data;
};

export const deleteProductApi = async (id) => {
  const response = await API.delete(`/products/delete/${id}`);
  return response.data;
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
