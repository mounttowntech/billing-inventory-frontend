import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCustomersApi,
  createCustomerApi,
  updateCustomerApi,
  deleteCustomerApi,
} from "./customerService";

export const getCustomers = createAsyncThunk(
  "customers/getCustomers",
  async (_, thunkAPI) => {
    try {
      return await getCustomersApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch customers",
      );
    }
  },
);

export const createCustomer = createAsyncThunk(
  "customers/createCustomer",
  async (data, thunkAPI) => {
    try {
      return await createCustomerApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create customer",
      );
    }
  },
);

export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateCustomerApi(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update customer",
      );
    }
  },
);

export const deleteCustomer = createAsyncThunk(
  "customers/deleteCustomer",
  async (id, thunkAPI) => {
    try {
      return await deleteCustomerApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete customer",
      );
    }
  },
);

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customers: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCustomerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.data || [];
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload.data);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.customers.findIndex(
          (customer) => customer._id === action.payload.data.id,
        );
        if (index !== -1) {
          state.customers[index] = action.payload.data;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(
          (customer) => customer._id !== action.payload.data.id,
        );
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCustomerError } = customerSlice.actions;

export default customerSlice.reducer;
