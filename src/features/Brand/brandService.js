import API from "../../services/api";
// Change this path if your axios file is elsewhere

export const getBrands = async () => {
  const response = await API.get("/brands/all");
  return response.data.data;
};

export const createBrand = async (data) => {
  const response = await API.post("/brands/create", data);
  return response.data.data;
};

export const updateBrand = async ({ id, brand }) => {
  const response = await API.put(`/brands/update/${id}`, brand);
  return response.data.data;
};

export const deleteBrand = async (id) => {
  await API.delete(`/brands/delete/${id}`);
  return id;
};
