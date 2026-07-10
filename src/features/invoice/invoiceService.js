import API from "../../services/api";

// ================= Get All Invoices =================
export const getInvoices = async () => {
  const response = await API.get("/invoice/all");
  return response.data.data;
};

// ================= Get Invoice By Id =================
export const getInvoiceById = async (id) => {
  const response = await API.get(`/invoice/${id}`);
  return response.data.data;
};

// ================= Create Invoice =================
export const createInvoice = async (invoice) => {
  const response = await API.post("/invoice/create", invoice);
  return response.data.data;
};

export const updateInvoice = async ({ id, invoice }) => {
  const response = await API.put(`/invoice/update/${id}`, invoice);
  return response.data.data;
};

// ================= Delete Invoice =================
export const deleteInvoice = async (id) => {
  await API.delete(`/invoice/delete/${id}`);
};
