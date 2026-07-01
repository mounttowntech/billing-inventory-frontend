import API from "../../services/api";

export const loginApi = async (data) => {
  const response = await API.post("/users/login", data);
  return response.data;
};

export const registerApi = async (data) => {
  const response = await API.post("/users/register", data);
  return response.data;
};