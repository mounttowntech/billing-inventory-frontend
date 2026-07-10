import API from "../../services/api";

// ================= Get All Measurements =================
const getMeasurements = async () => {
  const response = await API.get("/measurements/all");
  return response.data;
};

// ================= Get Measurement By Id =================
const getMeasurementById = async (id) => {
  const response = await API.get(`/measurements/${id}`);
  return response.data;
};

// ================= Create Measurement =================
const createMeasurement = async (measurement) => {
  const response = await API.post("/measurements/create", measurement);
  return response.data;
};

// ================= Update Measurement =================
const updateMeasurement = async ({ id, measurement }) => {
  const response = await API.put(`/measurements/update/${id}`, measurement);
  return response.data;
};

// ================= Delete Measurement =================
const deleteMeasurement = async (id) => {
  const response = await API.delete(`/measurements/delete/${id}`);
  return response.data;
};

const measurementService = {
  getMeasurements,
  getMeasurementById,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
};

export default measurementService;
