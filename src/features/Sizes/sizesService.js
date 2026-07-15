import API from "../../services/api";

// Get All
export const getSizes = async () => {
  const response = await API.get("/size/all");
  return response.data;
};

// Get By Id
export const getSizeById = async (id) => {
  const response = await API.get(`/size/${id}`);
  return response.data;
};

// Create
export const addSize = async (data) => {
  const response = await API.post("/size/create", data);
  return response.data;
};

// Update
export const updateSize = async (id, data) => {
  const response = await API.put(`/size/update/${id}`, data);
  return response.data;
};

// Delete
export const deleteSize = async (id) => {
  const response = await API.delete(`/size/delete/${id}`);
  return response.data;
};

const sizeService = {
  getSizes,
  getSizeById,
  addSize,
  updateSize,
  deleteSize,
};

export default sizeService;
