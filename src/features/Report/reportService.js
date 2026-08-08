import API from "../../services/api";

export const getSummaryApi = async () => {
  const res = await API.get("/reports/summary");
  return res.data;
};

export const getAnalyticsApi = async () => {
  const res = await API.get("/reports/analytics");
  return res.data;
};

export const getSalesTrendApi = async () => {
  const res = await API.get("/reports/sales-trend");
  return res.data;
};

export const getSalesByCategoryApi = async () => {
  const res = await API.get("/reports/sales-by-category");
  return res.data;
};

export const getSalesSummaryApi = async () => {
  console.log("getSalesSummaryApi called");
  const res = await API.get("/reports/sales-summary");
  return res.data;
};

export const getTopProductsApi = async () => {
  const res = await API.get("/reports/top-products");
  return res.data;
};

export const getManagerDashboardApi = async () => {
  const res = await API.get("/reports/manager-dashboard");
  return res.data;
};

export const exportReportPdfApi = async (fromDate, toDate) => {
  const token = localStorage.getItem("token");

  const res = await API.get(
    `/reports/export-pdf?from=${encodeURIComponent(fromDate)}&to=${encodeURIComponent(toDate)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    },
  );

  return res.data;
};
