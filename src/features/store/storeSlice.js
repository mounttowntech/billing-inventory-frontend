import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import storeService from "./storeService";

// ================= Get Stores =================
export const getStores = createAsyncThunk(
  "stores/getStores",
  async (_, thunkAPI) => {
    try {
      return await storeService.getStores();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Get Store By Id =================
export const getStoreById = createAsyncThunk(
  "stores/getStoreById",
  async (id, thunkAPI) => {
    try {
      return await storeService.getStoreById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Create Store =================
export const createStore = createAsyncThunk(
  "stores/createStore",
  async (store, thunkAPI) => {
    try {
      return await storeService.createStore(store);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Update Store =================
export const updateStore = createAsyncThunk(
  "stores/updateStore",
  async ({ id, store }, thunkAPI) => {
    try {
      return await storeService.updateStore({ id, store });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Delete Store =================
export const deleteStore = createAsyncThunk(
  "stores/deleteStore",
  async (id, thunkAPI) => {
    try {
      await storeService.deleteStore(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const initialState = {
  stores: [],
  store: null,
  loading: false,
  error: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // ================= Get Stores =================
      .addCase(getStores.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload.data;
      })
      .addCase(getStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Get Store By Id =================
      .addCase(getStoreById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStoreById.fulfilled, (state, action) => {
        state.loading = false;
        state.store = action.payload.data;
      })
      .addCase(getStoreById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Create Store =================
      .addCase(createStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.loading = false;
        state.stores.push(action.payload.data);
      })
      .addCase(createStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Update Store =================
      .addCase(updateStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.loading = false;

        state.stores = state.stores.map((store) =>
          store._id === action.payload.data._id ? action.payload.data : store,
        );
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Delete Store =================
      .addCase(deleteStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.loading = false;

        state.stores = state.stores.filter(
          (store) => store._id !== action.payload,
        );
      })
      .addCase(deleteStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default storeSlice.reducer;
