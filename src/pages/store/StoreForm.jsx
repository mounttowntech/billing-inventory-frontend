import { SaveButton } from "../../components/Common/Button";

/**
 * Modal form for creating / editing a Store.
 * All state (react-hook-form, etc.) is owned by the parent <Store />
 * component and passed down as props.
 */
const StoreForm = ({
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
      <div className="store-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingId ? "Edit Store" : "Add Store"}</h3>

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

        <form className="store-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Store Code</label>

            <input
              type="text"
              placeholder="Enter Store Code"
              {...register("storeCode")}
            />

            <span>{errors.storeCode?.message}</span>
          </div>

          <div className="form-group">
            <label>Store Name</label>

            <input
              type="text"
              placeholder="Enter Store Name"
              {...register("storeName")}
            />

            <span>{errors.storeName?.message}</span>
          </div>

          <div className="form-group">
            <label>GST Number</label>

            <input
              type="text"
              placeholder="Enter GST Number"
              {...register("gstNumber")}
            />

            <span>{errors.gstNumber?.message}</span>
          </div>

          <div className="form-group">
            <label>Phone</label>

            <input
              type="text"
              placeholder="Enter Phone Number"
              {...register("phone")}
            />

            <span>{errors.phone?.message}</span>
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter Email"
              {...register("email")}
            />

            <span>{errors.email?.message}</span>
          </div>

          <div className="form-group">
            <label>Address</label>

            <input
              type="text"
              placeholder="Enter Address"
              {...register("addressLine")}
            />

            <span>{errors.addressLine?.message}</span>
          </div>

          <div className="form-group">
            <label>City</label>

            <input type="text" placeholder="Enter City" {...register("city")} />

            <span>{errors.city?.message}</span>
          </div>

          <div className="form-group">
            <label>State</label>

            <input
              type="text"
              placeholder="Enter State"
              {...register("state")}
            />

            <span>{errors.state?.message}</span>
          </div>

          <div className="form-group">
            <label>Pincode</label>

            <input
              type="text"
              placeholder="Enter Pincode"
              {...register("pincode")}
            />

            <span>{errors.pincode?.message}</span>
          </div>

          <div className="form-group">
            <label>Status</label>

            <select {...register("status")}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <span>{errors.status?.message}</span>
            <SaveButton type="submit">
              {editingId ? "Update Store" : "Save Store"}
            </SaveButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreForm;
