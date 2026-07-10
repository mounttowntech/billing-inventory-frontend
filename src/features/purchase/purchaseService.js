import API from "../../services/api";

const getPurchases = async () => {
  const response = await API.get("/purchase/all");
  return response.data.data;
};

const getPurchaseById = async (id) => {
  const response = await API.get(`/purchase/${id}`);
  return response.data.data;
};

const createPurchase = async (purchaseData) => {
  const response = await API.post("/purchase/create", purchaseData);
  return response.data.data;
};

const updatePurchase = async (id, purchaseData) => {
  const response = await API.put(`/purchase/update/${id}`, purchaseData);
  return response.data.data;
};

const deletePurchase = async (id) => {
  const response = await API.delete(`/purchase/delete/${id}`);
  return response.data;
};

const purchaseService = {
  getPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
};

export default purchaseService;
