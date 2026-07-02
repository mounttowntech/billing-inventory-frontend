import axios from "axios";
import API from "../../services/api";

export const getCategories = async () => {
  const response = await API.get("/category/all");
  return response.data.data;
};

export const addCategory = async (data) => {
  const response = await API.post("/category/create", data);
  return response.data;
};

export const updateCategory = async (id, categoryName) => {
  console.log("Updating category with ID:", id, "and name:", categoryName);
  const response = await API.put(`/category/update/${id}`, categoryName);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await API.delete(`/category/delete/${id}`);
  return response.data;
};
