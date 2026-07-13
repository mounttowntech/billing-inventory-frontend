import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import auditLogService from "./auditLogService";

const initialState = {
  auditLogs: [],
  auditLog: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// ================= Get Audit Logs =================
export const getAuditLogs = createAsyncThunk(
  "auditLogs/getAuditLogs",
  async (_, thunkAPI) => {
    try {
      return await auditLogService.getAuditLogs();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Get Audit Log By Id =================
export const getAuditLogById = createAsyncThunk(
  "auditLogs/getAuditLogById",
  async (id, thunkAPI) => {
    try {
      return await auditLogService.getAuditLogById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ================= Create Audit Log =================
export const createAuditLog = createAsyncThunk(
  "auditLogs/createAuditLog",
  async (auditData, thunkAPI) => {
    try {
      return await auditLogService.createAuditLog(auditData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const updateAuditLog = createAsyncThunk(
  "auditLogs/updateAuditLog",
  async (data, thunkAPI) => {
    try {
      return await auditLogService.updateAuditLog(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const deleteAuditLog = createAsyncThunk(
  "auditLogs/deleteAuditLog",
  async (id, thunkAPI) => {
    try {
      await auditLogService.deleteAuditLog(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const auditLogSlice = createSlice({
  name: "auditLogs",
  initialState,
  reducers: {
    resetAuditLogState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // Get All
      .addCase(getAuditLogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAuditLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.auditLogs = action.payload.data;
      })
      .addCase(getAuditLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get By Id
      .addCase(getAuditLogById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAuditLogById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auditLog = action.payload.data;
      })
      .addCase(getAuditLogById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Create
      .addCase(createAuditLog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAuditLog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.auditLogs.unshift(action.payload.data);
      })
      .addCase(createAuditLog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================= Update =================
      .addCase(updateAuditLog.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(updateAuditLog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.auditLogs = state.auditLogs.map((log) =>
          log._id === action.payload.data._id ? action.payload.data : log,
        );
      })

      .addCase(updateAuditLog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Delete
      .addCase(deleteAuditLog.fulfilled, (state, action) => {
        state.auditLogs = state.auditLogs.filter(
          (item) => item._id !== action.payload,
        );
      });
  },
});

export const { resetAuditLogState } = auditLogSlice.actions;

export default auditLogSlice.reducer;
