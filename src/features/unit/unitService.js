import API from "../../services/api";

// ======================
// Get All Units
// ======================
const getUnits = async () => {
  const response = await API.get("/unit/all");
  return response.data.data;
};

// ======================
// Get Unit By Id
// ======================
const getUnitById = async (id) => {
  const response = await API.get(`/unit/${id}`);
  return response.data.data;
};

// ======================
// Create Unit
// ======================
const createUnit = async (unitData) => {
  const response = await API.post("/unit/create", unitData);
  return response.data.data;
};

// ======================
// Update Unit
// ======================
const updateUnit = async ({ id, unitData }) => {
  const response = await API.put(`/unit/update/${id}`, unitData);
  return response.data.data;
};

// ======================
// Delete Unit
// ======================
const deleteUnit = async (id) => {
  const response = await API.delete(`/unit/delete/${id}`);
  return response.data;
};

const unitService = {
  getUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
};

export default unitService;
