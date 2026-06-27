import API from "../../services/api";

export const getInvoicesApi = async () => {
  const response = await API.get("/invoices");
  return response.data;
};

export const createInvoiceApi = async (data) => {
  const response = await API.post("/invoices", data);
  return response.data;
};