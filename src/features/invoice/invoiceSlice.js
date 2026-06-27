import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getInvoicesApi,
  createInvoiceApi,
} from "./invoiceService";

export const getInvoices = createAsyncThunk(
  "invoice/getInvoices",
  async (_, thunkAPI) => {
    try {
      return await getInvoicesApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch invoices"
      );
    }
  }
);

export const createInvoice = createAsyncThunk(
  "invoice/createInvoice",
  async (data, thunkAPI) => {
    try {
      return await createInvoiceApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create invoice"
      );
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    invoices: [],
    invoice: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearInvoiceError: (state) => {
      state.error = null;
    },
    clearSelectedInvoice: (state) => {
      state.invoice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data || [];
      })
      .addCase(getInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoice = action.payload.data;
        state.invoices.unshift(action.payload.data);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInvoiceError, clearSelectedInvoice } = invoiceSlice.actions;

export default invoiceSlice.reducer;