import API from "../../services/api";

// ==========================================
// Get All Payments
// ==========================================

export const getAllPayments = async () => {
  const response = await API.get("/payments/all");
  return response.data;
};

// ==========================================
// Get Payment By Id
// ==========================================

export const getPaymentByIdApi = async (id) => {
  const response = await API.get(`/payments/${id}`);
  return response.data;
};

// ==========================================
// Create Cashfree Payment
// ==========================================

export const createPaymentApi = async (data) => {
    try {
  const response = await API.post("/payments/create", data);
  return response.data;
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error?.response?.data?.message; // Rethrow the error to be handled by the caller
    }
};

// ==========================================
// Verify Payment
// ==========================================

export const verifyPaymentApi = async (orderId) => {
    try {
      const response = await API.post(`/payments/verify/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error?.response?.data?.message; // Rethrow the error to be handled by the caller
    }
  
};

// ==========================================
// Refund Payment
// ==========================================

export const refundPaymentApi = async (paymentId, refundAmount) => {
  try {
  const response = await API.post(`/payments/refund/${paymentId}`, {
    refundAmount,
  });

  return response.data;
  } catch (error) {
    console.error("Error refunding payment:", error);
    throw error?.response?.data?.message; // Rethrow the error to be handled by the caller
  }
};

// ==========================================
// Update Payment
// ==========================================

export const updatePaymentApi = async (id, data) => {
  try {
  const response = await API.put(`/payments/${id}`, data);

  return response.data;
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error?.response?.data?.message; // Rethrow the error to be handled by the caller
  }
};

// ==========================================
// Delete Payment
// ==========================================

export const deletePaymentApi = async (id) => {
  try {
  const response = await API.delete(`/payments/${id}`);

  return response.data;
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw error?.response?.data?.message; // Rethrow the error to be handled by the caller
  }
};