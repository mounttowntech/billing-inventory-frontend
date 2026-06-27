import API from "../../services/api";

export const getProductsApi = async () => {
  const response = await API.get("/products");
  return response.data;
};

export const createProductApi = async (data) => {
  const response = await API.post("/products", data);
  return response.data;
};