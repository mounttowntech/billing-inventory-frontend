import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supplierService from "./supplierService";

const initialState = {
  suppliers: [],
  loading: false,
  error: null,
};

export const getSuppliers = createAsyncThunk(
  "suppliers/getAll",
  async (_, thunkAPI) => {
    try {
      return await supplierService.getSuppliers();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const createSupplier = createAsyncThunk(
  "suppliers/create",
  async (supplierData, thunkAPI) => {
    try {
      return await supplierService.createSupplier(supplierData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const updateSupplier = createAsyncThunk(
  "suppliers/update",
  async ({ id, supplierData }, thunkAPI) => {
    try {
      return await supplierService.updateSupplier({
        id,
        supplierData,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const deleteSupplier = createAsyncThunk(
  "suppliers/delete",
  async (id, thunkAPI) => {
    try {
      await supplierService.deleteSupplier(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // Get All
      .addCase(getSuppliers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload;
      })
      .addCase(getSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.suppliers.unshift(action.payload);
      })

      // Update
      .addCase(updateSupplier.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(
          (supplier) => supplier._id === action.payload._id,
        );

        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.suppliers = state.suppliers.filter(
          (supplier) => supplier._id !== action.payload,
        );
      });
  },
});

export default supplierSlice.reducer;
