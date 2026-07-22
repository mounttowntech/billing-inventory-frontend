import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import purchaseReturnService from "./purchaseReturnService";
/* Purchase Return                                                     */

const purchaseReturnInitialState = {
  purchases: [],
  loading: false,
  error: null,
};

export const getPurchasesReturn = createAsyncThunk(
  "purchasereturn/getAll",
  async (_, thunkAPI) => {
    try {
      return await purchaseReturnService.getPurchasesReturn();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const createPurchaseReturn = createAsyncThunk(
  "purchasereturn/create",
  async (purchaseData, thunkAPI) => {
    try {
      return await purchaseReturnService.createPurchaseReturn(purchaseData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const updatePurchaseReturn = createAsyncThunk(
  "purchasereturn/update",
  async ({ id, purchase }, thunkAPI) => {
    console.log("Updating purchase return with ID:", id, "and data:", purchase);
    try {
      return await purchaseReturnService.updatePurchaseReturn(id, purchase);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const deletePurchaseReturn = createAsyncThunk(
  "purchasereturn/delete",
  async (id, thunkAPI) => {
    try {
      await purchaseReturnService.deletePurchaseReturn(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const purchaseReturnSlice = createSlice({
  name: "purchasereturn",
  initialState: purchaseReturnInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getPurchasesReturn.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPurchasesReturn.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload;
      })
      .addCase(getPurchasesReturn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createPurchaseReturn.fulfilled, (state, action) => {
        state.purchases.push(action.payload);
      })

      .addCase(updatePurchaseReturn.fulfilled, (state, action) => {
        const index = state.purchases.findIndex(
          (purchase) => purchase._id === action.payload._id,
        );

        if (index !== -1) {
          state.purchases[index] = action.payload;
        }
      })

      .addCase(deletePurchaseReturn.fulfilled, (state, action) => {
        state.purchases = state.purchases.filter(
          (purchase) => purchase._id !== action.payload,
        );
      });
  },
});

export default purchaseReturnSlice.reducer;
