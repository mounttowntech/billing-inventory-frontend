import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dashboardService from "../Dashboard/GarmentDashboardService";

const initialState = {
  range: null,
  summary: null,
  salesOverview: null,
  salesByCategory: null,
  topSellingProducts: [],
  quickStats: null,
  recentTransactions: [],
  topCustomers: [],
  lowStockAlerts: [],
  isLoading: false,
  isError: false,
  message: "",
};

// ================= Get Full Dashboard =================
// params: { startDate, endDate } (both optional - backend defaults to current month)
export const getFullDashboard = createAsyncThunk(
  "dashboard/getFullDashboard",
  async (params, thunkAPI) => {
    try {
      return await dashboardService.getFullDashboard(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Get Recent Transactions =================
// used for "View All Transactions" (re-fetch with a bigger limit)
export const getRecentTransactions = createAsyncThunk(
  "dashboard/getRecentTransactions",
  async (params, thunkAPI) => {
    try {
      return await dashboardService.getRecentTransactions(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Get Top Selling Products =================
export const getTopSellingProducts = createAsyncThunk(
  "dashboard/getTopSellingProducts",
  async (params, thunkAPI) => {
    try {
      return await dashboardService.getTopSellingProducts(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Get Low Stock Alerts =================
export const getLowStockAlerts = createAsyncThunk(
  "dashboard/getLowStockAlerts",
  async (params, thunkAPI) => {
    try {
      return await dashboardService.getLowStockAlerts(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetDashboardState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------- Full Dashboard ----------
      .addCase(getFullDashboard.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getFullDashboard.fulfilled, (state, action) => {
        const data = action.payload.data;

        state.isLoading = false;
        state.range = data.summary?.range || null;
        state.summary = data.summary || null;
        state.salesOverview = data.salesOverview || null;
        state.salesByCategory = data.salesByCategory || null;
        state.topSellingProducts = data.topSellingProducts || [];
        state.quickStats = data.quickStats || null;
        state.recentTransactions = data.recentTransactions || [];
        state.topCustomers = data.topCustomers || [];
        state.lowStockAlerts = data.lowStockAlerts || [];
      })
      .addCase(getFullDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ---------- Recent Transactions ----------
      .addCase(getRecentTransactions.fulfilled, (state, action) => {
        state.recentTransactions = action.payload.data;
      })
      .addCase(getRecentTransactions.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })

      // ---------- Top Selling Products ----------
      .addCase(getTopSellingProducts.fulfilled, (state, action) => {
        state.topSellingProducts = action.payload.data;
      })
      .addCase(getTopSellingProducts.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })

      // ---------- Low Stock Alerts ----------
      .addCase(getLowStockAlerts.fulfilled, (state, action) => {
        state.lowStockAlerts = action.payload.data;
      })
      .addCase(getLowStockAlerts.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetDashboardState } = dashboardSlice.actions;

export default dashboardSlice.reducer;
