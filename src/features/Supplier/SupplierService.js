import API from "../../services/api";

const getSuppliers = async () => {
  const response = await API.get("/suppliers/all");
  return response.data.data;
};

const getSupplierById = async (id) => {
  const response = await API.get(`/suppliers/${id}`);
  return response.data.data;
};

const createSupplier = async (supplierData) => {
  const response = await API.post("/suppliers/create", supplierData);
  return response.data.data;
};

const updateSupplier = async ({ id, supplierData }) => {
  const response = await API.put(`/suppliers/update/${id}`, supplierData);
  return response.data.data;
};

const deleteSupplier = async (id) => {
  const response = await API.delete(`/suppliers/delete/${id}`);
  return response.data;
};

const supplierService = {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};

export default supplierService;
