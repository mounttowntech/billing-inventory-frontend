import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import managerDashboardService from "./ManagerDashboardService";

const initialState = {
  today: null,
  totalSales: 0,
  salesOverview: null,
  quickSummary: null,
  recentSales: [],
  lowStockItemsList: [],

  isLoading: false,
  isError: false,
  message: "",
};

// ================= Get Manager Dashboard =================

export const getManagerDashboard = createAsyncThunk(
  "managerDashboard/getManagerDashboard",
  async (params, thunkAPI) => {
    try {
      return await managerDashboardService.getManagerDashboard(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const managerDashboardSlice = createSlice({
  name: "managerDashboard",

  initialState,

  reducers: {
    resetManagerDashboard: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Pending =================

      .addCase(getManagerDashboard.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })

      // ================= Fulfilled =================

      .addCase(getManagerDashboard.fulfilled, (state, action) => {
        state.isLoading = false;

        const data = action.payload.data;

        state.today = data.today || null;
        state.totalSales = data.totalSales || 0;
        state.salesOverview = data.salesOverview || null;
        state.quickSummary = data.quickSummary || null;
        state.recentSales = data.recentSales || [];
        state.lowStockItemsList = data.lowStockItemsList || [];
      })

      // ================= Rejected =================

      .addCase(getManagerDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetManagerDashboard } = managerDashboardSlice.actions;

export default managerDashboardSlice.reducer;
