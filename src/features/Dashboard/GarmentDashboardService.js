import API from "../../services/api";

const BASE_URL = "/dashboard"; // <-- adjust to match how dashboardRoutes is mounted in server.js

// ================= Full Dashboard (single call, initial page load) =================
const getFullDashboard = async (params) => {
  const response = await API.get(`${BASE_URL}/all`, { params });
  return response.data;
};

// ================= Summary Cards =================
const getDashboardSummary = async (params) => {
  const response = await API.get(`${BASE_URL}/summary`, { params });
  return response.data;
};

// ================= Sales Overview (this month vs last month) =================
const getSalesOverview = async () => {
  const response = await API.get(`${BASE_URL}/sales-overview`);
  return response.data;
};

// ================= Sales By Category =================
const getSalesByCategory = async (params) => {
  const response = await API.get(`${BASE_URL}/sales-by-category`, { params });
  return response.data;
};

// ================= Top Selling Products =================
const getTopSellingProducts = async (params) => {
  const response = await API.get(`${BASE_URL}/top-products`, { params });
  return response.data;
};

// ================= Quick Stats =================
const getQuickStats = async () => {
  const response = await API.get(`${BASE_URL}/quick-stats`);
  return response.data;
};

// ================= Recent Transactions =================
const getRecentTransactions = async (params) => {
  const response = await API.get(`${BASE_URL}/recent-transactions`, {
    params,
  });
  return response.data;
};

// ================= Top Customers =================
const getTopCustomers = async (params) => {
  const response = await API.get(`${BASE_URL}/top-customers`, { params });
  return response.data;
};

// ================= Low Stock Alerts =================
const getLowStockAlerts = async (params) => {
  const response = await API.get(`${BASE_URL}/low-stock-alerts`, { params });
  return response.data;
};

const dashboardService = {
  getFullDashboard,
  getDashboardSummary,
  getSalesOverview,
  getSalesByCategory,
  getTopSellingProducts,
  getQuickStats,
  getRecentTransactions,
  getTopCustomers,
  getLowStockAlerts,
};

export default dashboardService;
