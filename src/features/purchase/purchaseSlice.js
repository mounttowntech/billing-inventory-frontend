import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import purchaseService from "./purchaseService";

const initialState = {
  purchases: [],
  loading: false,
  error: null,
};

export const getPurchases = createAsyncThunk(
  "purchase/getAll",
  async (_, thunkAPI) => {
    try {
      return await purchaseService.getPurchases();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const createPurchase = createAsyncThunk(
  "purchase/create",
  async (purchaseData, thunkAPI) => {
    try {
      return await purchaseService.createPurchase(purchaseData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const updatePurchase = createAsyncThunk(
  "purchase/update",
  async ({ id, purchase }, thunkAPI) => {
    console.log("Updating purchase with ID:", id, "and data:", purchase);
    try {
      return await purchaseService.updatePurchase(id, purchase);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const deletePurchase = createAsyncThunk(
  "purchase/delete",
  async (id, thunkAPI) => {
    try {
      await purchaseService.deletePurchase(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getPurchases.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload;
      })
      .addCase(getPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createPurchase.fulfilled, (state, action) => {
        state.purchases.push(action.payload);
      })

      .addCase(updatePurchase.fulfilled, (state, action) => {
        const index = state.purchases.findIndex(
          (purchase) => purchase._id === action.payload._id,
        );

        if (index !== -1) {
          state.purchases[index] = action.payload;
        }
      })

      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.purchases = state.purchases.filter(
          (purchase) => purchase._id !== action.payload,
        );
      });
  },
});

export default purchaseSlice.reducer;
