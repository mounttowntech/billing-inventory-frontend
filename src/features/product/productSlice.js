import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProductsApi,
  getProductByIdApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  searchBySKUApi,
  searchByBarcodeApi,
  getStockSummaryApi,
} from "./productService";

export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (_, thunkAPI) => {
    try {
      return await getProductsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (id, thunkAPI) => {
    try {
      return await getProductByIdApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch product",
      );
    }
  },
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (data, thunkAPI) => {
    try {
      return await createProductApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create product",
      );
    }
  },
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateProductApi(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update product",
      );
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, thunkAPI) => {
    try {
      await deleteProductApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete product",
      );
    }
  },
);

export const searchBySKU = createAsyncThunk(
  "product/searchBySKU",
  async (sku, thunkAPI) => {
    try {
      return await searchBySKUApi(sku);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "SKU not found",
      );
    }
  },
);

export const searchByBarcode = createAsyncThunk(
  "product/searchByBarcode",
  async (barcode, thunkAPI) => {
    try {
      return await searchByBarcodeApi(barcode);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Barcode not found",
      );
    }
  },
);

export const getStockSummary = createAsyncThunk(
  "product/getStockSummary",
  async (_, thunkAPI) => {
    try {
      return await getStockSummaryApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch stock summary",
      );
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    selectedProduct: null,
    searchResult: null,
    stockSummary: { totalProducts: 0, totalStock: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearSearchResult: (state) => {
      state.searchResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------- get all ----------
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data || [];
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------- get by id ----------
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload.data;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------- create ----------
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload.data);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------- update ----------
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p) => p._id === action.payload.data._id,
        );
        if (index !== -1) state.products[index] = action.payload.data;
        if (state.selectedProduct?._id === action.payload.data._id) {
          state.selectedProduct = action.payload.data;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------- delete ----------
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------- search by SKU ----------
      .addCase(searchBySKU.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchBySKU.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResult = action.payload.data;
      })
      .addCase(searchBySKU.rejected, (state, action) => {
        state.loading = false;
        state.searchResult = null;
        state.error = action.payload;
      })

      // ---------- search by barcode ----------
      .addCase(searchByBarcode.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchByBarcode.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResult = action.payload.data;
      })
      .addCase(searchByBarcode.rejected, (state, action) => {
        state.loading = false;
        state.searchResult = null;
        state.error = action.payload;
      })

      // ---------- stock summary ----------
      .addCase(getStockSummary.fulfilled, (state, action) => {
        state.stockSummary = {
          totalProducts: action.payload.totalProducts,
          totalStock: action.payload.totalStock,
        };
      });
  },
});

export const { clearProductError, clearSearchResult } = productSlice.actions;

export default productSlice.reducer;
