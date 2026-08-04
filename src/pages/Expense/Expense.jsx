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
  PreviousButton,
  NextButton,
  EditButton,
  DeleteButton,
} from "../../components/Common/Button";
import ExpenseForm from "./ExpenseForm";
import Modal from "../../components/Common/Modal";

const Expense = () => {
  const dispatch = useDispatch();

  const { expenses = [], loading = false } = useSelector(
    (state) => state.expense,
  );

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const itemsPerPage = rowsPerPage;
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
    const expenseData = {
      expenseNo: data.expenseNo,
      title: data.title,
      category: data.category,
      amount: Number(data.amount),
      expenseDate: data.expenseDate,
      note: data.note,
    };

    let result;

    if (editingId && editingId !== "add") {
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
    setSelectedExpense(expense);
    reset({
      expenseNo: expense.expenseNo,
      title: expense.title,
      category: expense.category?.toLowerCase(),
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
    <div className="expense-page">
      <div className="expense-header">
        <h2>Expense Management</h2>

        <AddButton
          className="add-btn"
          onClick={() => {
            setEditingId(null);
            reset({
              expenseNo: "",
              title: "",
              category: "",
              amount: "",
              expenseDate: "",
              note: "",
            });
            setEditingId("add");
            setShowModal(true);
          }}
        >
          Add
        </AddButton>
      </div>

      <div className="expense-container">
        <div className="table-toolbar">
          <div className="entries">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>

            <span>Entries</span>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <SearchBox
              placeholder="Search Expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <Modal
          open={showModal}
          title={editingId === "add" ? "Add Expense" : "Edit Expense"}
          size="md"
          onClose={() => setShowModal(false)}
        >
          <ExpenseForm
            mode={editingId === "add" ? "add" : "edit"}
            expense={selectedExpense}
            onSubmit={onSubmit}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false);
              dispatch(getExpenses());
            }}
          />
        </Modal>
        <div className="table-wrapper">
          <table className="expense-table">
            <thead>
              <tr>
                <th>#</th>
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
                    <td>
                      {indexOfFirst + currentExpenses.indexOf(expense) + 1}
                    </td>
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

        <div className="user-pagination">
          <p>
            Showing {filteredExpenses.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredExpenses.length)}
            of {filteredExpenses.length} entries
          </p>

          <div className="page-buttons">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              &laquo;
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              &lsaquo;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              &rsaquo;
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expense;
