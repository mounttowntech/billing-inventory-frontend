import API from "../../services/api";

// Get All Sales Returns
const getSalesReturns = async () => {
  const response = await API.get("/salesreturn/all");
  return response.data.data;
};

// Get Sales Return By Id
const getSalesReturnById = async (id) => {
  const response = await API.get(`/salesreturn/${id}`);
  return response.data.data;
};

// Create Sales Return
const createSalesReturn = async (salesReturnData) => {
  const response = await API.post("/salesreturn/create", salesReturnData);
  return response.data.data;
};

// Update Sales Return
const updateSalesReturn = async ({ id, salesReturnData }) => {
  const response = await API.put(`/salesreturn/update/${id}`, salesReturnData);
  return response.data.data;
};

// Delete Sales Return
const deleteSalesReturn = async (id) => {
  const response = await API.delete(`/salesreturn/delete/${id}`);
  return response.data;
};

const salesReturnService = {
  getSalesReturns,
  getSalesReturnById,
  createSalesReturn,
  updateSalesReturn,
  deleteSalesReturn,
};

export default salesReturnService;
