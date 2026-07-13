import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import unitService from "./unitService";

// ======================
// Get Units
// ======================
export const getUnits = createAsyncThunk(
  "unit/getUnits",
  async (_, thunkAPI) => {
    try {
      return await unitService.getUnits();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ======================
// Get Unit By Id
// ======================
export const getUnitById = createAsyncThunk(
  "unit/getUnitById",
  async (id, thunkAPI) => {
    try {
      return await unitService.getUnitById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ======================
// Create Unit
// ======================
export const createUnit = createAsyncThunk(
  "unit/createUnit",
  async (unitData, thunkAPI) => {
    try {
      return await unitService.createUnit(unitData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ======================
// Update Unit
// ======================
export const updateUnit = createAsyncThunk(
  "unit/updateUnit",
  async ({ id, unitData }, thunkAPI) => {
    try {
      return await unitService.updateUnit({ id, unitData });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ======================
// Delete Unit
// ======================
export const deleteUnit = createAsyncThunk(
  "unit/deleteUnit",
  async (id, thunkAPI) => {
    try {
      await unitService.deleteUnit(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const initialState = {
  units: [],
  unit: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const unitSlice = createSlice({
  name: "unit",
  initialState,
  reducers: {
    resetUnitState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder

      // Get Units
      .addCase(getUnits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUnits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.units = action.payload;
      })
      .addCase(getUnits.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get Unit By Id
      .addCase(getUnitById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUnitById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unit = action.payload;
      })
      .addCase(getUnitById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Create Unit
      .addCase(createUnit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.units.push(action.payload);
      })
      .addCase(createUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Update Unit
      .addCase(updateUnit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.units = state.units.map((unit) =>
          unit._id === action.payload._id ? action.payload : unit,
        );
      })
      .addCase(updateUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Delete Unit
      .addCase(deleteUnit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.units = state.units.filter((unit) => unit._id !== action.payload);
      })
      .addCase(deleteUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetUnitState } = unitSlice.actions;

export default unitSlice.reducer;
