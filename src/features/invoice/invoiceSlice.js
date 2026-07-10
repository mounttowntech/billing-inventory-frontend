import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as invoiceService from "./invoiceService";

// ================= Get All =================

export const fetchInvoices = createAsyncThunk(
  "invoice/fetchInvoices",
  async () => {
    return await invoiceService.getInvoices();
  },
);

// ================= Get By Id =================

export const fetchInvoiceById = createAsyncThunk(
  "invoice/fetchInvoiceById",
  async (id) => {
    return await invoiceService.getInvoiceById(id);
  },
);

// ================= Create =================

export const createInvoice = createAsyncThunk(
  "invoice/createInvoice",
  async (invoice) => {
    return await invoiceService.createInvoice(invoice);
  },
);

export const updateInvoice = createAsyncThunk(
  "invoice/updateInvoice",
  async ({ id, invoice }) => {
    return await invoiceService.updateInvoice({
      id,
      invoice,
    });
  },
);

// ================= Delete =================

export const deleteInvoice = createAsyncThunk(
  "invoice/deleteInvoice",
  async (id) => {
    await invoiceService.deleteInvoice(id);
    return id;
  },
);

const initialState = {
  invoices: [],
  invoice: null,
  loading: false,
  error: null,
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ================= Get All =================

      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })

      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ================= Get By Id =================

      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.invoice = action.payload;
      })

      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ================= Create =================

      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
      })

      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.unshift(action.payload);
      })

      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ================= Update =================
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false;

        state.invoices = state.invoices.map((invoice) =>
          invoice._id === action.payload._id ? action.payload : invoice,
        );
      })

      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // ================= Delete =================

      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.filter(
          (invoice) => invoice._id !== action.payload,
        );
      })

      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default invoiceSlice.reducer;
