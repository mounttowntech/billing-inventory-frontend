import API from "../../services/api";


//get all payments
export const getAllPayments = async () => {
  try {
  const response = await API.get("/payments/all");
  return response.data;
  } catch (error) {
    console.log("error_response", error.response);
    throw new Error("Failed to fetch payments");
  }
};

//create payment
export const createPaymentApi = async (data) => {
  try {
    const response = await API.post("/payments/create", data);
    return response.data;
  } catch (error) {
    console.log("error_response", error.response);
    throw new Error("Failed to create payment");
  }
};

//update payment
export const updatePaymentApi = async (id, data) => {
  try {
    const response = await API.put(`/payments/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.log("error_response", error.response);
    throw new Error("Failed to update payment");
  }
};

//delete payment
export const deletePaymentApi = async (id) => {
  try {
    const response = await API.delete(`/payments/delete/${id}`);
    return response.data;
  } catch (error) {
    console.log("error_response", error.response);
    throw new Error("Failed to delete payment");
  }
};
