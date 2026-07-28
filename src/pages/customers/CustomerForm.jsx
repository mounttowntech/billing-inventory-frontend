import { CancelButton } from "../../components/Common/Button";

/**
 * Modal form for creating / editing a Customer.
 * All state (react-hook-form, etc.) is owned by the parent <Customer />
 * component and passed down as props.
 */
const CustomerForm = ({
  showModal,
  setShowModal,
  editId,
  setEditId,
  register,
  handleSubmit,
  onSubmit,
  errors,
  reset,
}) => {
  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{editId ? "Update Customer" : "Add Customer"}</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input placeholder="Customer Code" {...register("customerCode")} />
          <p>{errors.customerCode?.message}</p>

          <input placeholder="Customer Name" {...register("customerName")} />
          <p>{errors.customerName?.message}</p>

          <input placeholder="Phone" {...register("phone")} />
          <p>{errors.phone?.message}</p>

          <input placeholder="Email" {...register("email")} />
          <p>{errors.email?.message}</p>

          <button type="submit">{editId ? "Update" : "Save"}</button>

          <CancelButton
            onClick={() => {
              setShowModal(false);
              setEditId(null);
              reset();
            }}
          >
            Cancel
          </CancelButton>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
