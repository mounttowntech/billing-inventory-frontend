import API from "../../services/api";

// ================= Get All Colors =================
const getColors = async () => {
  const response = await API.get("/color/all");
  return response.data.data;
};

// ================= Get Color By ID =================
const getColorById = async (id) => {
  const response = await API.get(`/color/${id}`);
  return response.data.data;
};

// ================= Create Color =================
const createColor = async (colorData) => {
  const response = await API.post("/color/create", colorData);
  return response.data.data;
};

// ================= Update Color =================
const updateColor = async (id, colorData) => {
  const response = await API.put(`/color/update/${id}`, colorData);
  return response.data.data;
};

// ================= Delete Color =================
const deleteColor = async (id) => {
  const response = await API.delete(`/color/delete/${id}`);
  return response.data;
};

const colorService = {
  getColors,
  getColorById,
  createColor,
  updateColor,
  deleteColor,
};

export default colorService;
