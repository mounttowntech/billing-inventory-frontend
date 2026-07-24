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
  const response = await API.post("/payments/create", data);
  return response.data;
};

// ==========================================
// Verify Payment
// ==========================================

export const verifyPaymentApi = async (orderId) => {
  const response = await API.post(`/payments/verify/${orderId}`);
  return response.data;
};

// ==========================================
// Refund Payment
// ==========================================

export const refundPaymentApi = async (paymentId, refundAmount) => {
  const response = await API.post(`/payments/refund/${paymentId}`, {
    refundAmount,
  });

  return response.data;
};

// ==========================================
// Update Payment
// ==========================================

export const updatePaymentApi = async (id, data) => {
  const response = await API.put(`/payments/${id}`, data);

  return response.data;
};

// ==========================================
// Delete Payment
// ==========================================

export const deletePaymentApi = async (id) => {
  const response = await API.delete(`/payments/${id}`);

  return response.data;
};
