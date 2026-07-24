import { SaveButton } from "../../components/Common/Button";

/**
 * Modal form for creating / editing an Expense.
 * All state (react-hook-form, etc.) is owned by the parent <Expense />
 * component and passed down as props.
 */
const ExpenseForm = ({
  showModal,
  setShowModal,
  editingId,
  setEditingId,
  register,
  handleSubmit,
  onSubmit,
  errors,
  reset,
}) => {
  if (!showModal) return null;

  return (
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
            <textarea rows="3" placeholder="Enter Note" {...register("note")} />
            <span>{errors.note?.message}</span>
          </div>

          <SaveButton className="save-btn" type="submit">
            {editingId ? "Update Expense" : "Save Expense"}
          </SaveButton>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
