import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import inventoryDashboardService from "./InventoryDashboardService";

const initialState = {
  totalProducts: 0,
  inStock: 0,
  lowStock: 0,
  stockValue: 0,

  stockSummary: [],

  recentStockActivities: [],

  lowStockAlerts: [],

  inventorySummary: null,

  isLoading: false,
  isError: false,
  message: "",
};

// ================= Inventory Dashboard =================

export const getInventoryDashboard = createAsyncThunk(
  "inventoryDashboard/getInventoryDashboard",
  async (_, thunkAPI) => {
    try {
      return await inventoryDashboardService.getInventoryDashboard();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const inventoryDashboardSlice = createSlice({
  name: "inventoryDashboard",
  initialState,

  reducers: {
    resetInventoryDashboardState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= GET INVENTORY DASHBOARD =================

      .addCase(getInventoryDashboard.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })

      .addCase(getInventoryDashboard.fulfilled, (state, action) => {
        const data = action.payload.data;

        state.isLoading = false;

        state.totalProducts = data.totalProducts;
        state.inStock = data.inStock;
        state.lowStock = data.lowStock;
        state.stockValue = data.stockValue;

        state.stockSummary = data.stockSummary || [];

        state.recentStockActivities = data.recentStockActivities || [];

        state.lowStockAlerts = data.lowStockAlerts || [];

        state.inventorySummary = data.inventorySummary || null;
      })

      .addCase(getInventoryDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetInventoryDashboardState } = inventoryDashboardSlice.actions;

export default inventoryDashboardSlice.reducer;
