import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import stockLedgerService from "./stockLedgerService";

const initialState = {
  stockLedgers: [],
  loading: false,
  error: null,
};

// Get All
export const getStockLedgers = createAsyncThunk(
  "stock-ledgers/all",
  async (_, thunkAPI) => {
    try {
      return await stockLedgerService.getStockLedgers();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Create
export const createStockLedger = createAsyncThunk(
  "stock-ledgers/create",
  async (stockLedgerData, thunkAPI) => {
    try {
      return await stockLedgerService.createStockLedger(stockLedgerData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Update
export const updateStockLedger = createAsyncThunk(
  "stock-ledgers/update",
  async ({ id, stockLedgerData }, thunkAPI) => {
    try {
      return await stockLedgerService.updateStockLedger({
        id,
        stockLedgerData,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Delete
export const deleteStockLedger = createAsyncThunk(
  "stock-ledgers/delete",
  async (id, thunkAPI) => {
    try {
      return await stockLedgerService.deleteStockLedger(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const stockLedgerSlice = createSlice({
  name: "stockLedger",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(getStockLedgers.pending, (state) => {
        state.loading = true;
      })

      .addCase(getStockLedgers.fulfilled, (state, action) => {
        state.loading = false;
        state.stockLedgers = action.payload;
      })

      .addCase(getStockLedgers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createStockLedger.fulfilled, (state, action) => {
        state.stockLedgers.push(action.payload);
      })

      .addCase(updateStockLedger.fulfilled, (state, action) => {
        state.stockLedgers = state.stockLedgers.map((stockLedger) =>
          stockLedger._id === action.payload._id ? action.payload : stockLedger,
        );
      })

      .addCase(deleteStockLedger.fulfilled, (state, action) => {
        state.stockLedgers = state.stockLedgers.filter(
          (stockLedger) => stockLedger._id !== action.payload,
        );
      });
  },
});

export default stockLedgerSlice.reducer;
