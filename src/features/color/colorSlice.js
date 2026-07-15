import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import colorService from "./colorService";

const initialState = {
  colors: [],
  color: null,
  loading: false,
  error: null,
};

// ================= Get All =================

export const getColors = createAsyncThunk(
  "colors/getAll",
  async (_, thunkAPI) => {
    try {
      return await colorService.getColors();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Get By Id =================

export const getColorById = createAsyncThunk(
  "colors/getById",
  async (id, thunkAPI) => {
    try {
      return await colorService.getColorById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Create =================

export const createColor = createAsyncThunk(
  "colors/create",
  async (colorData, thunkAPI) => {
    try {
      return await colorService.createColor(colorData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Update =================

export const updateColor = createAsyncThunk(
  "colors/update",
  async ({ id, colorData }, thunkAPI) => {
    try {
      return await colorService.updateColor(id, colorData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Delete =================

export const deleteColor = createAsyncThunk(
  "colors/delete",
  async (id, thunkAPI) => {
    try {
      await colorService.deleteColor(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const colorSlice = createSlice({
  name: "colors",
  initialState,
  reducers: {
    clearColor: (state) => {
      state.color = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Get All =================

      .addCase(getColors.pending, (state) => {
        state.loading = true;
      })
      .addCase(getColors.fulfilled, (state, action) => {
        state.loading = false;
        state.colors = action.payload;
      })
      .addCase(getColors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Get By Id =================

      .addCase(getColorById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getColorById.fulfilled, (state, action) => {
        state.loading = false;
        state.color = action.payload;
      })
      .addCase(getColorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Create =================

      .addCase(createColor.pending, (state) => {
        state.loading = true;
      })
      .addCase(createColor.fulfilled, (state, action) => {
        state.loading = false;
        state.colors.push(action.payload);
      })
      .addCase(createColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Update =================

      .addCase(updateColor.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateColor.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.colors.findIndex(
          (item) => item._id === action.payload._id,
        );

        if (index !== -1) {
          state.colors[index] = action.payload;
        }

        state.color = action.payload;
      })
      .addCase(updateColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Delete =================

      .addCase(deleteColor.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteColor.fulfilled, (state, action) => {
        state.loading = false;
        state.colors = state.colors.filter(
          (item) => item._id !== action.payload,
        );
      })
      .addCase(deleteColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearColor } = colorSlice.actions;

export default colorSlice.reducer;
