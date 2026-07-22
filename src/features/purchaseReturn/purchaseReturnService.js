/* Purchase Return */
import API from "../../services/api";

const getPurchasesReturn = async () => {
  const response = await API.get("/purchasereturn/all");
  return response.data.data;
};

const getPurchaseReturnById = async (id) => {
  const response = await API.get(`/purchasereturn/${id}`);
  return response.data.data;
};

const createPurchaseReturn = async (purchaseData) => {
  const response = await API.post("/purchasereturn/create", purchaseData);
  return response.data.data;
};

const updatePurchaseReturn = async (id, purchaseData) => {
  const response = await API.put(`/purchasereturn/update/${id}`, purchaseData);
  return response.data.data;
};

const deletePurchaseReturn = async (id) => {
  const response = await API.delete(`/purchasereturn/delete/${id}`);
  return response.data;
};

const purchaseReturnService = {
  getPurchasesReturn,
  getPurchaseReturnById,
  createPurchaseReturn,
  updatePurchaseReturn,
  deletePurchaseReturn,
};

export default purchaseReturnService;
