import API from "../../services/api";

// ================= Get All Addresses =================
const getAddresses = async () => {
  const response = await API.get("/customerdetails/all");
  return response.data.data;
};

// ================= Get Address By ID =================
const getAddressById = async (id) => {
  const response = await API.get(`/customerdetails/${id}`);
  return response.data.data;
};

// ================= Create Address =================
const createAddress = async (addressData) => {
  const response = await API.post("/customerdetails/create", addressData);
  return response.data.data;
};

// ================= Update Address =================
const updateAddress = async ({ id, addressData }) => {
  const response = await API.put(`/customerdetails/update/${id}`, addressData);
  return response.data.data;
};

// ================= Delete Address =================
const deleteAddress = async (id) => {
  const response = await API.delete(`/customerdetails/delete/${id}`);
  return response.data;
};

const customerAddressService = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};

export default customerAddressService;
