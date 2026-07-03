import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as brandService from "./brandService";

// ================= Fetch Brands =================
export const fetchBrands = createAsyncThunk("brands/fetchBrands", async () => {
  return await brandService.getBrands();
});

// ================= Create Brand =================
export const createBrand = createAsyncThunk(
  "brands/createBrand",
  async (brand) => {
    return await brandService.createBrand(brand);
  },
);

// ================= Update Brand =================
export const updateBrand = createAsyncThunk(
  "brands/updateBrand",
  async ({ id, brand }) => {
    return await brandService.updateBrand({ id, brand });
  },
);

// ================= Delete Brand =================
export const deleteBrand = createAsyncThunk(
  "brands/deleteBrand",
  async (id) => {
    await brandService.deleteBrand(id);
    return id;
  },
);

const brandSlice = createSlice({
  name: "brands",

  initialState: {
    brands: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ================= Fetch =================
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ================= Create =================
      .addCase(createBrand.pending, (state) => {
        state.loading = true;
      })

      .addCase(createBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands.push(action.payload);
      })

      .addCase(createBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ================= Update =================
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;

        state.brands = state.brands.map((brand) =>
          brand._id === action.payload._id ? action.payload : brand,
        );
      })

      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ================= Delete =================
      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.loading = false;

        state.brands = state.brands.filter(
          (brand) => brand._id !== action.payload,
        );
      })

      .addCase(deleteBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default brandSlice.reducer;
