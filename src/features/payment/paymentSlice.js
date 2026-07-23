import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllPayments, createPaymentApi, updatePaymentApi, deletePaymentApi  } from "./paymentService";

//get all payments
export const getPayments = createAsyncThunk(
  "payment/getPayments",
  async (_, thunkAPI) => {
    try {
      return await getAllPayments();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch payments"
      );
    }
  }
);

export const createPayment = createAsyncThunk(
  "payment/createPayment",
  async (data, thunkAPI) => {
    try {
      return await createPaymentApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create payment"
      );
    }
  }
);



export const updatePayment = createAsyncThunk(
  "payment/updatePayment",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updatePaymentApi(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update payment"
      );
    }
  }
);

//delete payment
export const deletePayment = createAsyncThunk(
  "payment/deletePayment",
  async (id, thunkAPI) => {
    try {
      return await deletePaymentApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete payment"
      );
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    payments: [],
    loading: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("billing_user");
      localStorage.removeItem("billing_token");
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(getPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(updatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(deletePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addAsyncThunk(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = paymentSlice.actions;
export default paymentSlice.reducer;