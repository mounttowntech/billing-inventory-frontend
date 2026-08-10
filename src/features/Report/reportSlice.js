import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSummaryApi,
  getAnalyticsApi,
  getSalesTrendApi,
  getSalesByCategoryApi,
  getSalesSummaryApi,
  getTopProductsApi,
  getManagerDashboardApi,
  exportReportPdfApi,
} from "./reportService";

// ====================== ANALYTICS ======================
export const getAnalytics = createAsyncThunk(
  "report/getAnalytics",
  async (_, thunkAPI) => {
    try {
      return await getAnalyticsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ====================== SUMMARY ======================
export const getSummary = createAsyncThunk(
  "report/getSummary",
  async (_, thunkAPI) => {
    try {
      return await getSummaryApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ====================== SALES TREND ======================
export const getSalesTrend = createAsyncThunk(
  "report/getSalesTrend",
  async (_, thunkAPI) => {
    try {
      return await getSalesTrendApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ====================== SALES BY CATEGORY ======================
export const getSalesByCategory = createAsyncThunk(
  "report/getSalesByCategory",
  async (_, thunkAPI) => {
    try {
      return await getSalesByCategoryApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ====================== SALES SUMMARY ======================
export const getSalesSummary = createAsyncThunk(
  "report/getSalesSummary",
  async (_, thunkAPI) => {
    try {
      return await getSalesSummaryApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ====================== TOP PRODUCTS ======================
export const getTopProducts = createAsyncThunk(
  "report/getTopProducts",
  async (_, thunkAPI) => {
    try {
      return await getTopProductsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ====================== MANAGER DASHBOARD ======================
export const getManagerDashboard = createAsyncThunk(
  "report/getManagerDashboard",
  async (_, thunkAPI) => {
    try {
      return await getManagerDashboardApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

//  EXPORT PDF
export const exportReportPdf = createAsyncThunk(
  "report/exportReportPdf",
  async ({ fromDate, toDate }, thunkAPI) => {
    try {
      return await exportReportPdfApi(fromDate, toDate);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ====================== SLICE ======================
const reportSlice = createSlice({
  name: "report",

  initialState: {
    summary: {},
    analytics: {},
    salesTrend: {},
    salesByCategory: {},
    salesSummary: [],
    topProducts: [],
    managerDashboard: {},

    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Summary
      .addCase(getSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.data || action.payload;
      })
      .addCase(getSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Analytics
      .addCase(getAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload.data || action.payload;
      })
      .addCase(getAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Sales Trend
      .addCase(getSalesTrend.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSalesTrend.fulfilled, (state, action) => {
        state.loading = false;
        state.salesTrend = action.payload.data || action.payload;
      })
      .addCase(getSalesTrend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Sales By Category
      .addCase(getSalesByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSalesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.salesByCategory = action.payload.data || action.payload;
      })
      .addCase(getSalesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Sales Summary
      .addCase(getSalesSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSalesSummary.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Sales Summary Response:", action.payload);
        state.salesSummary = action.payload.data || action.payload;
      })
      .addCase(getSalesSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Top Products
      .addCase(getTopProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTopProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.topProducts = action.payload.data || action.payload;
      })
      .addCase(getTopProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Manager Dashboard
      .addCase(getManagerDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(getManagerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Manager Dashboard Payload:", action.payload);
        state.managerDashboard = action.payload.data || action.payload;
      })
      .addCase(getManagerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ====================== EXPORT PDF ======================
      .addCase(exportReportPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportReportPdf.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportReportPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reportSlice.reducer;
