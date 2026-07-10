import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as expenseService from "./expenseService";

// ================= Get All Expenses =================
export const getExpenses = createAsyncThunk("expense/getExpenses", async () => {
  return await expenseService.getExpenses();
});

// ================= Get Expense By Id =================
export const getExpenseById = createAsyncThunk(
  "expenses/getExpenseById",
  async (id) => {
    return await expenseService.getExpenseById(id);
  },
);

// ================= Create Expense =================
export const createExpense = createAsyncThunk(
  "expenses/createExpense",
  async (expense) => {
    return await expenseService.createExpense(expense);
  },
);

// ================= Update Expense =================
export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async ({ id, expense }) => {
    return await expenseService.updateExpense({
      id,
      expense,
    });
  },
);

// ================= Delete Expense =================
export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (id) => {
    await expenseService.deleteExpense(id);
    return id;
  },
);

const expenseSlice = createSlice({
  name: "expense",

  initialState: {
    expenses: [],
    expense: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ================= Get All =================
      .addCase(getExpenses.pending, (state) => {
        state.loading = true;
      })

      .addCase(getExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })

      .addCase(getExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ================= Get By Id =================
      .addCase(getExpenseById.fulfilled, (state, action) => {
        state.expense = action.payload;
      })

      // ================= Create =================
      .addCase(createExpense.pending, (state) => {
        state.loading = true;
      })

      .addCase(createExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.unshift(action.payload);
      })

      .addCase(createExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ================= Update =================
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;

        state.expenses = state.expenses.map((expense) =>
          expense._id === action.payload._id ? action.payload : expense,
        );
      })

      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ================= Delete =================
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;

        state.expenses = state.expenses.filter(
          (expense) => expense._id !== action.payload,
        );
      })

      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default expenseSlice.reducer;
