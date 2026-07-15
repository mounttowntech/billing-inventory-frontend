import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import alterationService from "./alterationService";

// Get
export const getAlterations = createAsyncThunk(
  "alteration/getAlterations",
  async (_, thunkAPI) => {
    try {
      return await alterationService.getAlterations();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

// Create
export const createAlteration = createAsyncThunk(
  "alteration/createAlteration",
  async (data, thunkAPI) => {
    try {
      return await alterationService.addAlteration(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

// Update
export const editAlteration = createAsyncThunk(
  "alteration/updateAlteration",
  async ({ id, alterationData }, thunkAPI) => {
    try {
      return await alterationService.updateAlteration(id, alterationData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

// Delete
export const removeAlteration = createAsyncThunk(
  "alteration/deleteAlteration",
  async (id, thunkAPI) => {
    try {
      return await alterationService.deleteAlteration(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

const initialState = {
  alterations: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const alterationSlice = createSlice({
  name: "alteration",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Get
      .addCase(getAlterations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAlterations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.alterations = action.payload.data;
      })
      .addCase(getAlterations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Create
      .addCase(createAlteration.fulfilled, (state, action) => {
        state.alterations.push(action.payload.data);
      })

      // Update
      .addCase(editAlteration.fulfilled, (state, action) => {
        state.alterations = state.alterations.map((item) =>
          item._id === action.payload.data._id ? action.payload.data : item,
        );
      })

      // Delete
      .addCase(removeAlteration.fulfilled, (state, action) => {
        state.alterations = state.alterations.filter(
          (item) => item._id !== action.meta.arg,
        );
      });
  },
});

export default alterationSlice.reducer;
