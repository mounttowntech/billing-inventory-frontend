import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { expenseValidation } from "../../validations/ExpenseValidation";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../../features/expense/expenseSlice";
import "./Expense.css";
import SearchBox from "../../components/Common/SearchBox";
import {
  AddButton,
  SaveButton,
  PreviousButton,
  NextButton,
  EditButton,
  DeleteButton,
} from "../../components/Common/Button";

const Expense = () => {
  const dispatch = useDispatch();

  const { expenses = [], loading = false } = useSelector(
    (state) => state.expense,
  );

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentExpenses = expenses.slice(indexOfFirst, indexOfLast);
  const totalPages =
    expenses.length > 0 ? Math.ceil(expenses.length / itemsPerPage) : 1;

  const [search, setSearch] = useState("");
  const filteredExpenses = currentExpenses.filter((expense) =>
    expense.title.toLowerCase().includes(search.toLowerCase()),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(expenseValidation),
  });

  useEffect(() => {
    dispatch(getExpenses());
  }, [dispatch]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const onSubmit = async (data) => {
    console.log("Form Data:", data); // Log the form data for debugging
    const expenseData = {
      expenseNo: data.expenseNo,
      title: data.title,
      category: data.category,
      amount: Number(data.amount),
      expenseDate: data.expenseDate,
      note: data.note,
    };

    let result;

    if (editingId) {
      result = await dispatch(
        updateExpense({
          id: editingId,
          expense: expenseData,
        }),
      );
    } else {
      result = await dispatch(createExpense(expenseData));
    }

    if (!result.error) {
      reset();
      setEditingId(null);
      setShowModal(false);
      dispatch(getExpenses());
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);

    reset({
      expenseNo: expense.expenseNo,
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      expenseDate: expense.expenseDate ? expense.expenseDate.split("T")[0] : "",
      note: expense.note || "",
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this expense?")) {
      const result = await dispatch(deleteExpense(id));

      if (!result.error) {
        dispatch(getExpenses());
      }
    }
  };

  return (
    <div className="expense-container">
      <div className="expense-header">
        <h2>Expense Management</h2>
      </div>
      <div className="expense-search-buttons">
        <SearchBox
          placeholder="Search Expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton
          className="add-btn"
          onClick={() => {
            reset();
            setEditingId(null);
            reset({
              expenseNo: "",
              title: "",
              category: "",
              amount: "",
              expenseDate: "",
              note: "",
            });
            setShowModal(true);
          }}
        >
          + Add Expense
        </AddButton>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="expense-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? "Edit Expense" : "Add Expense"}</h3>

              <button
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  reset();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="expense-form">
              <div className="expense-group">
                <label>Expense No</label>
                <input
                  type="number"
                  placeholder="Enter Expense No"
                  {...register("expenseNo")}
                />
                <span>{errors.expenseNo?.message}</span>
              </div>

              <div className="expense-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Enter Title"
                  {...register("title")}
                />
                <span>{errors.title?.message}</span>
              </div>

              <div className="expense-group">
                <label>Category</label>
                <select {...register("category")}>
                  <option value="">Select Category</option>
                  <option value="rent">Rent</option>
                  <option value="salary">Salary</option>
                  <option value="electricity">Electricity</option>
                  <option value="marketing">Marketing</option>
                  <option value="transport">Transport</option>
                  <option value="miscellaneous">Miscellaneous</option>
                </select>
                <span>{errors.category?.message}</span>
              </div>

              <div className="expense-group">
                <label>Amount</label>
                <input
                  type="number"
                  placeholder="Enter Amount"
                  {...register("amount")}
                />
                <span>{errors.amount?.message}</span>
              </div>

              <div className="expense-group">
                <label>Expense Date</label>
                <input type="date" {...register("expenseDate")} />
                <span>{errors.expenseDate?.message}</span>
              </div>

              <div className="expense-group">
                <label>Note</label>
                <textarea
                  rows="3"
                  placeholder="Enter Note"
                  {...register("note")}
                />
                <span>{errors.note?.message}</span>
              </div>

              <SaveButton className="save-btn" type="submit">
                {editingId ? "Update Expense" : "Save Expense"}
              </SaveButton>
            </form>
          </div>
        </div>
      )}
      <div className="table-wrapper">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Expense No</th>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Note</th>
              <th className="supplier-column">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : currentExpenses.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Expenses Found
                </td>
              </tr>
            ) : (
              currentExpenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{expense.expenseNo}</td>

                  <td>{expense.title}</td>

                  <td style={{ textTransform: "capitalize" }}>
                    {expense.category}
                  </td>

                  <td>₹{expense.amount}</td>

                  <td>
                    {expense.expenseDate
                      ? expense.expenseDate.split("T")[0]
                      : ""}
                  </td>

                  <td>{expense.note || "-"}</td>

                  <td className="supplier-column">
                    <EditButton onClick={() => handleEdit(expense)}>
                      Edit
                    </EditButton>

                    <DeleteButton onClick={() => handleDelete(expense._id)}>
                      Delete
                    </DeleteButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <PreviousButton
          className="btn btn-page"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </PreviousButton>

        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>

        <NextButton
          className="btn btn-page"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </NextButton>
      </div>
    </div>
  );
};

export default Expense;
