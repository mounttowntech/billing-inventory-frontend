import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import rolePermissionService from "./rolePermissionService";

const initialState = {
  roles: [],
  role: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// ================= Get All Roles =================
export const getRoles = createAsyncThunk(
  "roles/getRoles",
  async (_, thunkAPI) => {
    try {
      return await rolePermissionService.getRoles();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Get Role By Id =================
export const getRoleById = createAsyncThunk(
  "roles/getRoleById",
  async (id, thunkAPI) => {
    try {
      return await rolePermissionService.getRoleById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Create Role =================
export const createRole = createAsyncThunk(
  "roles/createRole",
  async (roleData, thunkAPI) => {
    try {
      return await rolePermissionService.createRole(roleData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Update Role =================
export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async (data, thunkAPI) => {
    try {
      return await rolePermissionService.updateRole(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Delete Role =================
export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (id, thunkAPI) => {
    try {
      await rolePermissionService.deleteRole(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const rolePermissionSlice = createSlice({
  name: "rolePermission",
  initialState,
  reducers: {
    resetRolePermissionState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Get All =================
      .addCase(getRoles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.roles = action.payload.data;
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================= Get By Id =================
      .addCase(getRoleById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRoleById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.role = action.payload.data;
      })
      .addCase(getRoleById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================= Create =================
      .addCase(createRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.roles.unshift(action.payload.data);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================= Update =================
      .addCase(updateRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.roles = state.roles.map((role) =>
          role._id === action.payload.data._id ? action.payload.data : role,
        );
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================= Delete =================
      .addCase(deleteRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.roles = state.roles.filter((role) => role._id !== action.payload);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetRolePermissionState } = rolePermissionSlice.actions;

export default rolePermissionSlice.reducer;
