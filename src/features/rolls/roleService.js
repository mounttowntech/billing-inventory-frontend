import axios from "axios";
import API from "../../services/api";

export const getRoles = async () => {
  const response = await API.get("/roles/all");
  return response.data.data;
};

export const addRole = async (data) => {
  const response = await API.post("/roles/create", data);
  return response.data;
};

export const updateRole = async (id, roleName) => {
  console.log("Updating role with ID:", id, "and name:", roleName);
  const response = await API.put(`/roles/update/${id}`, roleName);
  return response.data;
};

export const deleteRole = async (id) => {
  const response = await API.delete(`/roles/delete/${id}`);
  return response.data;
};
