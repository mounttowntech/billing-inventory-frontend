import API from "../../services/api";

// Get All
export const getAlterations = async () => {
  const response = await API.get("/alteration/all");
  return response.data;
};

// Get By Id
export const getAlterationById = async (id) => {
  const response = await API.get(`/alteration/${id}`);
  return response.data;
};

// Create
export const addAlteration = async (data) => {
  const response = await API.post("/alteration/create", data);
  return response.data;
};

// Update
export const updateAlteration = async (id, data) => {
  const response = await API.put(`/alteration/update/${id}`, data);
  return response.data;
};

// Delete
export const deleteAlteration = async (id) => {
  const response = await API.delete(`/alteration/delete/${id}`);
  return response.data;
};

const alterationService = {
  getAlterations,
  getAlterationById,
  addAlteration,
  updateAlteration,
  deleteAlteration,
};

export default alterationService;
