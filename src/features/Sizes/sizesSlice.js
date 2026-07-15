import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sizeService from "./sizesService";

export const getSizes = createAsyncThunk(
  "size/getSizes",
  async (_, thunkAPI) => {
    try {
      return await sizeService.getSizes();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const createSize = createAsyncThunk(
  "size/createSize",
  async (data, thunkAPI) => {
    try {
      return await sizeService.addSize(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const editSize = createAsyncThunk(
  "size/editSize",
  async ({ id, sizeData }, thunkAPI) => {
    try {
      return await sizeService.updateSize(id, sizeData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const removeSize = createAsyncThunk(
  "size/removeSize",
  async (id, thunkAPI) => {
    try {
      return await sizeService.deleteSize(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const initialState = {
  sizes: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const sizeSlice = createSlice({
  name: "size",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getSizes.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getSizes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sizes = action.payload.data;
      })

      .addCase(getSizes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(createSize.fulfilled, (state, action) => {
        state.sizes.push(action.payload.data);
      })

      .addCase(editSize.fulfilled, (state, action) => {
        state.sizes = state.sizes.map((item) =>
          item._id === action.payload.data._id ? action.payload.data : item,
        );
      })

      .addCase(removeSize.fulfilled, (state, action) => {
        state.sizes = state.sizes.filter(
          (item) => item._id !== action.meta.arg,
        );
      });
  },
});

export default sizeSlice.reducer;
