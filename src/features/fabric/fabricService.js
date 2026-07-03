import axios from "axios";

import API from "../../services/api";

const getFabrics = async () => {
  const response = await API.get("/fabric/all");
  return response.data.data;
};

const getFabricById = async (id) => {
  const response = await API.get(`/fabric/${id}`);
  return response.data.data;
};

const createFabric = async (fabricData) => {
  const response = await API.post("/fabric/create", fabricData);
  return response.data.data;
};

const updateFabric = async (id, fabricData) => {
  const response = await API.put(`/fabric/update/${id}`, fabricData);
  return response.data.data;
};

const deleteFabric = async (id) => {
  const response = await API.delete(`/fabric/delete/${id}`);
  return response.data;
};

const fabricService = {
  getFabrics,
  getFabricById,
  createFabric,
  updateFabric,
  deleteFabric,
};

export default fabricService;
