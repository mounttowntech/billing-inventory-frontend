import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import stockAdjustmentService from "./stockAdjustmentService";

// ================= Get Stock Adjustments =================
export const getStockAdjustments = createAsyncThunk(
  "stockAdjustment/getStockAdjustments",
  async (_, thunkAPI) => {
    try {
      return await stockAdjustmentService.getStockAdjustments();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Get Stock Adjustment By Id =================
export const getStockAdjustmentById = createAsyncThunk(
  "stockAdjustment/getStockAdjustmentById",
  async (id, thunkAPI) => {
    try {
      return await stockAdjustmentService.getStockAdjustmentById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Create Stock Adjustment =================
export const createStockAdjustment = createAsyncThunk(
  "stockAdjustment/createStockAdjustment",
  async (adjustmentData, thunkAPI) => {
    try {
      return await stockAdjustmentService.createStockAdjustment(adjustmentData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Update Stock Adjustment =================
export const updateStockAdjustment = createAsyncThunk(
  "stockAdjustment/updateStockAdjustment",
  async ({ id, adjustmentData }, thunkAPI) => {
    try {
      return await stockAdjustmentService.updateStockAdjustment(
        id,
        adjustmentData,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Delete Stock Adjustment =================
export const deleteStockAdjustment = createAsyncThunk(
  "stockAdjustment/deleteStockAdjustment",
  async (id, thunkAPI) => {
    try {
      await stockAdjustmentService.deleteStockAdjustment(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Initial State =================
const initialState = {
  stockAdjustments: [],
  stockAdjustment: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// ================= Slice =================
const stockAdjustmentSlice = createSlice({
  name: "stockAdjustment",
  initialState,

  reducers: {
    resetStockAdjustmentState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.stockAdjustment = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Get All =================
      .addCase(getStockAdjustments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStockAdjustments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stockAdjustments = action.payload;
      })
      .addCase(getStockAdjustments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================= Get By Id =================
      .addCase(getStockAdjustmentById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStockAdjustmentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stockAdjustment = action.payload;
      })
      .addCase(getStockAdjustmentById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================= Create =================
      .addCase(createStockAdjustment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createStockAdjustment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stockAdjustments.push(action.payload);
      })
      .addCase(createStockAdjustment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================= Update =================
      .addCase(updateStockAdjustment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStockAdjustment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.stockAdjustments = state.stockAdjustments.map((item) =>
          item._id === action.payload._id ? action.payload : item,
        );

        state.stockAdjustment = action.payload;
      })
      .addCase(updateStockAdjustment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================= Delete =================
      .addCase(deleteStockAdjustment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteStockAdjustment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.stockAdjustments = state.stockAdjustments.filter(
          (item) => item._id !== action.payload,
        );
      })
      .addCase(deleteStockAdjustment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetStockAdjustmentState } = stockAdjustmentSlice.actions;

export default stockAdjustmentSlice.reducer;
