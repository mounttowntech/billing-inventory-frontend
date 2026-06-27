import API from "../../services/api";

export const getCustomersApi = async () => {
  const response = await API.get("/customers");
  return response.data;
};

export const createCustomerApi = async (data) => {
  const response = await API.post("/customers", data);
  return response.data;
};