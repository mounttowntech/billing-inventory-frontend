import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import salesReturnService from "./salesReturnService";

// ======================= GET =======================

export const getSalesReturns = createAsyncThunk(
  "salesReturn/getAll",
  async (_, thunkAPI) => {
    try {
      return await salesReturnService.getSalesReturns();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ======================= GET BY ID =======================

export const getSalesReturnById = createAsyncThunk(
  "salesReturn/getById",
  async (id, thunkAPI) => {
    try {
      return await salesReturnService.getSalesReturnById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ======================= CREATE =======================

export const createSalesReturn = createAsyncThunk(
  "salesReturn/create",
  async (salesReturnData, thunkAPI) => {
    try {
      return await salesReturnService.createSalesReturn(salesReturnData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ======================= UPDATE =======================

export const updateSalesReturn = createAsyncThunk(
  "salesReturn/update",
  async ({ id, salesReturnData }, thunkAPI) => {
    try {
      return await salesReturnService.updateSalesReturn({
        id,
        salesReturnData,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ======================= DELETE =======================

export const deleteSalesReturn = createAsyncThunk(
  "salesReturn/delete",
  async (id, thunkAPI) => {
    try {
      await salesReturnService.deleteSalesReturn(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const initialState = {
  salesReturns: [],
  salesReturn: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const salesReturnSlice = createSlice({
  name: "salesReturn",
  initialState,

  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // GET
      .addCase(getSalesReturns.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getSalesReturns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.salesReturns = action.payload;
      })

      .addCase(getSalesReturns.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // GET BY ID
      .addCase(getSalesReturnById.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getSalesReturnById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesReturn = action.payload;
      })

      .addCase(getSalesReturnById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // CREATE
      .addCase(createSalesReturn.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(createSalesReturn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.salesReturns.push(action.payload);
      })

      .addCase(createSalesReturn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // UPDATE
      .addCase(updateSalesReturn.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(updateSalesReturn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.salesReturns = state.salesReturns.map((item) =>
          item._id === action.payload._id ? action.payload : item,
        );
      })

      .addCase(updateSalesReturn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // DELETE
      .addCase(deleteSalesReturn.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(deleteSalesReturn.fulfilled, (state, action) => {
        state.isLoading = false;

        state.salesReturns = state.salesReturns.filter(
          (item) => item._id !== action.payload,
        );
      })

      .addCase(deleteSalesReturn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = salesReturnSlice.actions;

export default salesReturnSlice.reducer;
