import API from "../../services/api";

export const loginApi = async (data) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};