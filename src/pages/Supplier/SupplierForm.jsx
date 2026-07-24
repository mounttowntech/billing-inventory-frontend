import { SaveButton, CancelButton } from "../../components/Common/Button";

/**
 * Modal form for creating / editing a Supplier.
 * All state (react-hook-form, etc.) is owned by the parent <Supplier />
 * component and passed down as props.
 */
const SupplierForm = ({
  showModal,
  closeModal,
  editId,
  register,
  handleSubmit,
  onSubmit,
  errors,
  isSubmitting,
  loading,
}) => {
  if (!showModal) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="supplier-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editId ? "Edit Supplier" : "Add Supplier"}</h3>

          <button className="close-btn" onClick={closeModal}>
            ×
          </button>
        </div>

        <form className="supplier-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Supplier Name</label>
            <input {...register("supplierName")} />
            <span>{errors.supplierName?.message}</span>
          </div>

          <div className="form-group">
            <label>Contact Person</label>
            <input {...register("contactPerson")} />
            <span>{errors.contactPerson?.message}</span>
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input {...register("phone")} />
            <span>{errors.phone?.message}</span>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input {...register("email")} />
            <span>{errors.email?.message}</span>
          </div>

          <div className="form-group">
            <label>GST Number</label>
            <input {...register("gstNumber")} />
            <span>{errors.gstNumber?.message}</span>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea rows="3" {...register("address")} />
            <span>{errors.address?.message}</span>
          </div>

          <div className="form-group">
            <label>City</label>
            <input {...register("city")} />
            <span>{errors.city?.message}</span>
          </div>

          <div className="form-group">
            <label>State</label>
            <input {...register("state")} />
            <span>{errors.state?.message}</span>
          </div>

          <div className="form-group">
            <label>Pincode</label>
            <input {...register("pincode")} />
            <span>{errors.pincode?.message}</span>
          </div>

          <div className="form-group">
            <label>Opening Balance</label>
            <input type="number" {...register("openingBalance")} />
            <span>{errors.openingBalance?.message}</span>
          </div>

          <div className="form-buttons">
            <CancelButton onClick={closeModal}>Cancel</CancelButton>
            <SaveButton disabled={isSubmitting || loading}>
              {editId
                ? isSubmitting || loading
                  ? "Updating..."
                  : "Update Supplier"
                : isSubmitting || loading
                  ? "Saving..."
                  : "Save Supplier"}
            </SaveButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierForm;
