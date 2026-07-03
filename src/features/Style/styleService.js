import axios from "axios";

import API from "../../services/api";

const getStyles = async () => {
  const response = await API.get("/style/all");
  return response.data.data;
};

const getStyleById = async (id) => {
  const response = await API.get(`/style/${id}`);
  return response.data.data;
};

const createStyle = async (styleData) => {
  const response = await API.post("/style/create", styleData);
  return response.data.data;
};

const updateStyle = async ({ id, styleData }) => {
  const response = await API.put(`/style/update/${id}`, styleData);
  return response.data.data;
};

const deleteStyle = async (id) => {
  await API.delete(`/style/delete/${id}`);
  return id;
};

const styleService = {
  getStyles,
  getStyleById,
  createStyle,
  updateStyle,
  deleteStyle,
};

export default styleService;
