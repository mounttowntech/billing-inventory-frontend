import API from "../../services/api";

// ================= Get All Expenses =================
export const getExpenses = async () => {
  const response = await API.get("/expenses/all");
  return response.data.data;
};

// ================= Get Expense By Id =================
export const getExpenseById = async (id) => {
  const response = await API.get(`/expenses/${id}`);
  return response.data.data;
};

// ================= Create Expense =================
export const createExpense = async (expense) => {
  const response = await API.post("/expenses/create", expense);
  return response.data.data;
};

// ================= Update Expense =================
export const updateExpense = async ({ id, expense }) => {
  const response = await API.put(`/expenses/update/${id}`, expense);
  return response.data.data;
};

// ================= Delete Expense =================
export const deleteExpense = async (id) => {
  const response = await API.delete(`/expenses/delete/${id}`);
  return response.data;
};
