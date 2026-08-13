import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getAllPayments,
  getPaymentByIdApi,
  createPaymentApi,
  verifyPaymentApi,
  refundPaymentApi,
  updatePaymentApi,
  deletePaymentApi,
} from "./paymentService";

// ==========================================
// Get All
// ==========================================

export const getPayments = createAsyncThunk(
  "payment/getPayments",
  async (_, thunkAPI) => {
    try {
      return await getAllPayments();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ==========================================
// Get By Id
// ==========================================

export const getPaymentById = createAsyncThunk(
  "payment/getPaymentById",
  async (id, thunkAPI) => {
    try {
      return await getPaymentByIdApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ==========================================
// Create Payment
// ==========================================

export const createPayment = createAsyncThunk(
  "payment/createPayment",
  async (data, thunkAPI) => {
    try {
      return await createPaymentApi(data);
    } catch (error) {
      console.log("createPayment error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error,
      );
    }
  },
);

// ==========================================
// Verify Payment
// ==========================================

export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (orderId, thunkAPI) => {
    try {
      return await verifyPaymentApi(orderId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ==========================================
// Refund Payment
// ==========================================

export const refundPayment = createAsyncThunk(
  "payment/refundPayment",
  async ({ paymentId, refundAmount }, thunkAPI) => {
    try {
      return await refundPaymentApi(paymentId, refundAmount);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ==========================================
// Update
// ==========================================

export const updatePayment = createAsyncThunk(
  "payment/updatePayment",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updatePaymentApi(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ==========================================
// Delete
// ==========================================

export const deletePayment = createAsyncThunk(
  "payment/deletePayment",
  async (id, thunkAPI) => {
    try {
      await deletePaymentApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ==========================================
// Slice
// ==========================================

const initialState = {
  payments: [],
  payment: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,

  reducers: {
    clearPayment(state) {
      state.payment = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ============================
      // Get Payments
      // ============================

      .addCase(getPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.data || [];
      })

      // ============================
      // Get Payment By Id
      // ============================

      .addCase(getPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload.data;
      })

      // ============================
      // Create Payment
      // ============================

      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload.data;
      }).addCase(createPayment.rejected, (state, action) => {
        console.log("createPayment.rejected action:", action);
        state.loading = false;
        state.error = action.payload?.message || "Failed to create payment";
      })

      // ============================
      // Verify Payment
      // ============================

      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload.data;
      })

      // ============================
      // Refund Payment
      // ============================

      .addCase(refundPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload.data;
      })

      // ============================
      // Update Payment
      // ============================

      .addCase(updatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload.data;
      })

      // ============================
      // Delete Payment
      // ============================

      .addCase(deletePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = state.payments.filter(
          (payment) => payment._id !== action.payload,
        );
      });
  },
});

export const { clearPayment } = paymentSlice.actions;

export default paymentSlice.reducer;
