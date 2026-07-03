import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import seasonService from "./seasonService";

const initialState = {
  seasons: [],
  loading: false,
  error: null,
};

// Get All
export const getSeasons = createAsyncThunk(
  "season/all",
  async (_, thunkAPI) => {
    try {
      return await seasonService.getSeasons();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Create
export const createSeason = createAsyncThunk(
  "season/create",
  async (seasonData, thunkAPI) => {
    try {
      return await seasonService.createSeason(seasonData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Update
export const updateSeason = createAsyncThunk(
  "season/update",
  async ({ id, seasonData }, thunkAPI) => {
    try {
      return await seasonService.updateSeason({
        id,
        seasonData,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Delete
export const deleteSeason = createAsyncThunk(
  "season/delete",
  async (id, thunkAPI) => {
    try {
      return await seasonService.deleteSeason(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const seasonSlice = createSlice({
  name: "season",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(getSeasons.pending, (state) => {
        state.loading = true;
      })

      .addCase(getSeasons.fulfilled, (state, action) => {
        state.loading = false;
        state.seasons = action.payload;
      })

      .addCase(getSeasons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createSeason.fulfilled, (state, action) => {
        state.seasons.push(action.payload);
      })

      .addCase(updateSeason.fulfilled, (state, action) => {
        state.seasons = state.seasons.map((season) =>
          season._id === action.payload._id ? action.payload : season,
        );
      })

      .addCase(deleteSeason.fulfilled, (state, action) => {
        state.seasons = state.seasons.filter(
          (season) => season._id !== action.payload,
        );
      });
  },
});

export default seasonSlice.reducer;
