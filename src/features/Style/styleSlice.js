import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import styleService from "./styleService";

const initialState = {
  styles: [],
  loading: false,
  error: null,
};

export const getStyles = createAsyncThunk(
  "style/getAll",
  async (_, thunkAPI) => {
    try {
      return await styleService.getStyles();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const createStyle = createAsyncThunk(
  "style/create",
  async (styleData, thunkAPI) => {
    try {
      return await styleService.createStyle(styleData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const updateStyle = createAsyncThunk(
  "style/update",
  async ({ id, styleData }, thunkAPI) => {
    try {
      return await styleService.updateStyle({
        id,
        styleData,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const deleteStyle = createAsyncThunk(
  "style/delete",
  async (id, thunkAPI) => {
    try {
      return await styleService.deleteStyle(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const styleSlice = createSlice({
  name: "style",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(getStyles.pending, (state) => {
        state.loading = true;
      })

      .addCase(getStyles.fulfilled, (state, action) => {
        state.loading = false;
        state.styles = action.payload;
      })

      .addCase(getStyles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createStyle.fulfilled, (state, action) => {
        state.styles.push(action.payload);
      })

      .addCase(updateStyle.fulfilled, (state, action) => {
        state.styles = state.styles.map((style) =>
          style._id === action.payload._id ? action.payload : style,
        );
      })

      .addCase(deleteStyle.fulfilled, (state, action) => {
        state.styles = state.styles.filter(
          (style) => style._id !== action.payload,
        );
      });
  },
});

export default styleSlice.reducer;
