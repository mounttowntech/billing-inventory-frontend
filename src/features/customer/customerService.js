import API from "../../services/api";

export const getCustomersApi = async () => {
  const response = await API.get("/customers/all");
  return response.data;
};

export const createCustomerApi = async (data) => {
  const response = await API.post("/customers/create", data);
  return response.data;
};

export const updateCustomerApi = async (id, data) => {
  const response = await API.put(`/customers/update/${id}`, data);
  return response.data;
};

export const deleteCustomerApi = async (id) => {
  const response = await API.delete(`/customers/delete/${id}`);
  return response.data;
};
