import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTaxesApi, createTaxApi, updateTaxApi, deleteTaxApi  } from "./taxService";

//get all taxes
export const getTaxes = createAsyncThunk(
  "tax/getTaxes",
  async (_, thunkAPI) => {
    try {
      return await getTaxesApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch taxes"
      );
    }
  }
);

export const createTax = createAsyncThunk(
  "tax/createTax",
  async (data, thunkAPI) => {
    try {
      return await createTaxApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create tax"
      );
    }
  }
);



export const updateTax = createAsyncThunk(
  "tax/updateTax",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateTaxApi(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update tax"
      );
    }
  }
);

//delete tax
export const deleteTax = createAsyncThunk(
  "tax/deleteTax",
  async (id, thunkAPI) => {
    try {
      return await deleteTaxApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete tax"
      );
    }
  }
);

const taxSlice = createSlice({
  name: "tax",
  initialState: {
    taxes: [],
    loading: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("billing_user");
      localStorage.removeItem("billing_token");
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getTaxes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaxes.fulfilled, (state, action) => {
        state.loading = false;
        state.taxes = action.payload;
      })
      .addCase(getTaxes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(updateTax.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTax.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTax.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(deleteTax.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTax.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteTax.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addAsyncThunk(createTax.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTax.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createTax.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = taxSlice.actions;
export default taxSlice.reducer;