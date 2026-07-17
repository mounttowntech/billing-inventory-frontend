import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerAddressService from "./customerAddressService";

// ================= Get Addresses =================
export const getAddresses = createAsyncThunk(
  "customerdetails/getAll",
  async (_, thunkAPI) => {
    try {
      return await customerAddressService.getAddresses();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Create Address =================
export const createAddress = createAsyncThunk(
  "customerdetails/create",
  async (addressData, thunkAPI) => {
    try {
      return await customerAddressService.createAddress(addressData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Update Address =================
export const updateAddress = createAsyncThunk(
  "customerdetails/update",
  async ({ id, addressData }, thunkAPI) => {
    try {
      return await customerAddressService.updateAddress({
        id,
        addressData,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Delete Address =================
export const deleteAddress = createAsyncThunk(
  "customerdetails/delete",
  async (id, thunkAPI) => {
    try {
      await customerAddressService.deleteAddress(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const initialState = {
  addresses: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const customerAddressSlice = createSlice({
  name: "customerAddress",
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

      // ================= Get =================
      .addCase(getAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAddresses.fulfilled, (state, action) => {
        console.log("Reducer is running");
        console.log("Payload:", action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        state.addresses = action.payload;
        console.log("Redux state addresses:", state.addresses);
      })
      .addCase(getAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================= Create =================
      .addCase(createAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.addresses.push(action.payload);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================= Update =================
      .addCase(updateAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.addresses = state.addresses.map((item) =>
          item._id === action.payload._id ? action.payload : item,
        );
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================= Delete =================
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.addresses = state.addresses.filter(
          (item) => item._id !== action.payload,
        );
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = customerAddressSlice.actions;
export default customerAddressSlice.reducer;
