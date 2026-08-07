import API from "../../services/api";

const BASE_URL = "/dashboard";

const getInventoryDashboard = async () => {
  const response = await API.get(`${BASE_URL}/inventory-staff`);
  return response.data;
};

const inventoryDashboardService = {
  getInventoryDashboard,
};

export default inventoryDashboardService;
