import { SaveButton, CancelButton } from "../../components/Common/Button";

/**
 * Modal form for creating / editing a Sales Return.
 * All state (react-hook-form, customers, invoices, etc.) is owned by the
 * parent <SalesReturn /> component and passed down as props.
 */
const SalesReturnForm = ({
  showForm,
  setShowForm,
  customers,
  filteredInvoices,
  register,
  handleSubmit,
  onSubmit,
  errors,
  reset,
  setEditId,
  editId,
}) => {
  if (!showForm) return null;

  return (
    <div className="modal-overlay">
      <div className="salesreturn-modal">
        <div className="salesreturn-modal-header">
          <h3>{editId ? "Update Sales Return" : "Add Sales Return"}</h3>

          <button className="close-btn" onClick={() => setShowForm(false)}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="salesreturn-form-group">
            <label>Customer</label>
            <select {...register("customer")}>
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.customerName}
                </option>
              ))}
            </select>
            <p>{errors.customer?.message}</p>
          </div>

          <div className="salesreturn-form-group">
            <label>Invoice</label>
            <select {...register("invoice")}>
              <option value="">Select Invoice</option>
              {filteredInvoices.map((invoice) => (
                <option key={invoice._id} value={invoice._id}>
                  {invoice.invoiceNumber || invoice.invoiceNo}
                </option>
              ))}
            </select>
            <p>{errors.invoice?.message}</p>
          </div>

          <div className="salesreturn-form-group">
            <label>Return Date</label>

            <input type="date" {...register("returnDate")} />

            <p>{errors.returnDate?.message}</p>
          </div>

          <div className="salesreturn-form-group">
            <label>Refund Amount</label>

            <input type="number" {...register("refundAmount")} />

            <p>{errors.refundAmount?.message}</p>
          </div>

          <div className="salesreturn-form-group">
            <label>Reason</label>

            <textarea rows="4" {...register("reason")} />

            <p>{errors.reason?.message}</p>
          </div>

          <div className="salesreturn-form-buttons">
            <SaveButton type="submit">
              {editId ? "Update Sales Return" : "Add Sales Return"}
            </SaveButton>

            <CancelButton
              type="button"
              onClick={() => {
                reset();
                setEditId(null);
                setShowForm(false);
              }}
            >
              Cancel
            </CancelButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesReturnForm;
