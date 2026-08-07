import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cashierDashboardService from "./CashierDashboardService";

const initialState = {
  todaySales: null,
  totalBills: null,
  averageBill: null,
  itemsSold: null,
  todaysOverview: null,
  recentSales: [],

  isLoading: false,
  isError: false,
  message: "",
};

// ================= Get Cashier Dashboard =================

export const getCashierDashboard = createAsyncThunk(
  "cashierDashboard/getCashierDashboard",
  async (_, thunkAPI) => {
    try {
      return await cashierDashboardService.getCashierDashboard();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const cashierDashboardSlice = createSlice({
  name: "cashierDashboard",
  initialState,

  reducers: {
    resetCashierDashboard: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Pending =================
      .addCase(getCashierDashboard.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })

      // ================= Fulfilled =================
      .addCase(getCashierDashboard.fulfilled, (state, action) => {
        state.isLoading = false;

        const data = action.payload.data;

        state.todaySales = data.todaySales;
        state.totalBills = data.totalBills;
        state.averageBill = data.averageBill;
        state.itemsSold = data.itemsSold;
        state.todaysOverview = data.todaysOverview;
        state.recentSales = data.recentSales || [];
      })

      // ================= Rejected =================
      .addCase(getCashierDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetCashierDashboard } = cashierDashboardSlice.actions;

export default cashierDashboardSlice.reducer;
