import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import measurementService from "./measurementService";

// ================= Get Measurements =================
export const getMeasurements = createAsyncThunk(
  "measurements/getMeasurements",
  async (_, thunkAPI) => {
    try {
      return await measurementService.getMeasurements();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Get Measurement By Id =================
export const getMeasurementById = createAsyncThunk(
  "measurements/getMeasurementById",
  async (id, thunkAPI) => {
    try {
      return await measurementService.getMeasurementById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Create Measurement =================
export const createMeasurement = createAsyncThunk(
  "measurements/createMeasurement",
  async (measurement, thunkAPI) => {
    try {
      return await measurementService.createMeasurement(measurement);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Update Measurement =================
export const updateMeasurement = createAsyncThunk(
  "measurements/updateMeasurement",
  async ({ id, measurement }, thunkAPI) => {
    try {
      return await measurementService.updateMeasurement({
        id,
        measurement,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Delete Measurement =================
export const deleteMeasurement = createAsyncThunk(
  "measurements/deleteMeasurement",
  async (id, thunkAPI) => {
    try {
      await measurementService.deleteMeasurement(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const initialState = {
  measurements: [],
  measurement: null,
  loading: false,
  error: null,
};

const measurementSlice = createSlice({
  name: "measurement",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // ================= Get Measurements =================
      .addCase(getMeasurements.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMeasurements.fulfilled, (state, action) => {
        state.loading = false;
        state.measurements = action.payload.data;
      })
      .addCase(getMeasurements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Get Measurement By Id =================
      .addCase(getMeasurementById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMeasurementById.fulfilled, (state, action) => {
        state.loading = false;
        state.measurement = action.payload.data;
      })
      .addCase(getMeasurementById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Create Measurement =================
      .addCase(createMeasurement.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMeasurement.fulfilled, (state, action) => {
        state.loading = false;
        state.measurements.push(action.payload.data);
      })
      .addCase(createMeasurement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Update Measurement =================
      .addCase(updateMeasurement.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMeasurement.fulfilled, (state, action) => {
        state.loading = false;

        state.measurements = state.measurements.map((measurement) =>
          measurement._id === action.payload.data._id
            ? action.payload.data
            : measurement,
        );
      })
      .addCase(updateMeasurement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Delete Measurement =================
      .addCase(deleteMeasurement.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMeasurement.fulfilled, (state, action) => {
        state.loading = false;

        state.measurements = state.measurements.filter(
          (measurement) => measurement._id !== action.payload,
        );
      })
      .addCase(deleteMeasurement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default measurementSlice.reducer;
