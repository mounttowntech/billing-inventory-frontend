import API from "../../services/api";

// ================= Get All Stores =================
const getStores = async () => {
  const response = await API.get("/stores/all");
  return response.data;
};

// ================= Get Store By Id =================
const getStoreById = async (id) => {
  const response = await API.get(`/stores/${id}`);
  return response.data;
};

// ================= Create Store =================
const createStore = async (store) => {
  const response = await API.post("/stores/create", store);
  return response.data;
};

// ================= Update Store =================
const updateStore = async ({ id, store }) => {
  const response = await API.put(`/stores/update/${id}`, store);
  return response.data;
};

// ================= Delete Store =================
const deleteStore = async (id) => {
  const response = await API.delete(`/stores/delete/${id}`);
  return response.data;
};

const storeService = {
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
};

export default storeService;
