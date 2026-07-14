import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as roleService from "./roleService";

export const fetchRoles = createAsyncThunk(
  "role/fetchRoles",
  async () => {
    return await roleService.getRoles();
  },
);

export const createRole = createAsyncThunk(
  "role/createRole",
  async (role) => {
    return await roleService.addRole(role);
  },
);

export const updateRole = createAsyncThunk(
  "role/updateRole",
  async ({ id, roleName }) => {
    console.log("Updating role with ID:", id, "and name:", roleName);
    return await roleService.updateRole(id, roleName);
  },
);

export const deleteRole = createAsyncThunk(
  "role/deleteRole",
  async (id) => {
    await roleService.deleteRole(id);
    return id;
  },
);

const roleSlice = createSlice({
  name: "role",

  initialState: {
    roles: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload || [];
      })

      .addCase(fetchRoles.rejected, (state) => {
        state.loading = false;
      })

      .addCase(createRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      })

      .addCase(updateRole.fulfilled, (state, action) => {
        state.roles = state.roles.map((item) =>
          item._id === action.payload._id ? action.payload : item,
        );
      })

      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter(
          (item) => item._id !== action.payload,
        );
      });
  },
});

export default roleSlice.reducer;
