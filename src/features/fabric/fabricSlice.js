import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fabricService from "./fabricService";

const initialState = {
  fabrics: [],
  fabric: null,
  loading: false,
  error: null,
};

// Get All
export const getFabrics = createAsyncThunk(
  "fabric/getAll",
  async (_, thunkAPI) => {
    try {
      return await fabricService.getFabrics();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Get By Id
export const getFabricById = createAsyncThunk(
  "fabric/getById",
  async (id, thunkAPI) => {
    try {
      return await fabricService.getFabricById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Create
export const createFabric = createAsyncThunk(
  "fabric/create",
  async (fabricData, thunkAPI) => {
    try {
      return await fabricService.createFabric(fabricData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Update
export const updateFabric = createAsyncThunk(
  "fabric/update",
  async ({ id, fabricData }, thunkAPI) => {
    try {
      return await fabricService.updateFabric(id, fabricData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Delete
export const deleteFabric = createAsyncThunk(
  "fabric/delete",
  async (id, thunkAPI) => {
    try {
      await fabricService.deleteFabric(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const fabricSlice = createSlice({
  name: "fabric",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // Get All
      .addCase(getFabrics.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFabrics.fulfilled, (state, action) => {
        state.loading = false;
        state.fabrics = action.payload;
      })
      .addCase(getFabrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get By Id
      .addCase(getFabricById.fulfilled, (state, action) => {
        state.fabric = action.payload;
      })

      // Create
      .addCase(createFabric.fulfilled, (state, action) => {
        state.fabrics.push(action.payload);
      })

      // Update
      .addCase(updateFabric.fulfilled, (state, action) => {
        state.fabrics = state.fabrics.map((item) =>
          item._id === action.payload._id ? action.payload : item,
        );
      })

      // Delete
      .addCase(deleteFabric.fulfilled, (state, action) => {
        state.fabrics = state.fabrics.filter(
          (item) => item._id !== action.payload,
        );
      });
  },
});

export default fabricSlice.reducer;
