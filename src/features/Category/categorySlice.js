import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as categoryService from "../Category/categoryService";

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async () => {
    return await categoryService.getCategories();
  },
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (category) => {
    return await categoryService.addCategory(category);
  },
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, category }) => {
    console.log("Updating category with ID:", id, "and name:", category);
    return await categoryService.updateCategory(id, category);
  },
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id) => {
    await categoryService.deleteCategory(id);
    return id;
  },
);

const categorySlice = createSlice({
  name: "category",

  initialState: {
    categories: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
      })

      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
      })

      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categories = state.categories.map((item) =>
          item._id === action.payload._id ? action.payload : item,
        );
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (item) => item._id !== action.payload,
        );
      });
  },
});

export default categorySlice.reducer;
