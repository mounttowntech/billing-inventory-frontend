import API from "../../services/api";

const getSeasons = async () => {
  const response = await API.get("/season/all");
  return response.data.data;
};

const getSeasonById = async (id) => {
  const response = await API.get(`/season/${id}`);
  return response.data.data;
};

const createSeason = async (seasonData) => {
  const response = await API.post("/season/create", seasonData);
  return response.data.data;
};

const updateSeason = async ({ id, seasonData }) => {
  const response = await API.put(`/season/update/${id}`, seasonData);
  return response.data.data;
};

const deleteSeason = async (id) => {
  await API.delete(`/season/delete/${id}`);
  return id;
};

const seasonService = {
  getSeasons,
  getSeasonById,
  createSeason,
  updateSeason,
  deleteSeason,
};

export default seasonService;
