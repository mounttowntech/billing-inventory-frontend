import { SaveButton, CancelButton } from "../../components/Common/Button";

/**
 * Modal form for creating / editing an Audit Log entry.
 * All state (react-hook-form, etc.) is owned by the parent <AuditLog />
 * component and passed down as props.
 */
const AuditLogForm = ({
  showForm,
  setShowForm,
  editId,
  setEditId,
  register,
  handleSubmit,
  onSubmit,
  errors,
  reset,
}) => {
  if (!showForm) return null;

  return (
    <div className="modal-overlay">
      <div className="audit-modal">
        <div className="audit-modal-header">
          <h3>Add Audit Log</h3>

          <button className="close-btn" onClick={() => setShowForm(false)}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="audit-form-group">
            <label>User</label>
            <input type="text" {...register("user")} disabled />
            <p>{errors.user?.message}</p>
          </div>

          <div className="audit-form-group">
            <label>Description</label>
            <textarea rows="3" {...register("description")} />
            <p>{errors.description?.message}</p>
          </div>

          <div className="audit-form-group">
            <label>Module</label>
            <input type="text" {...register("module")} />
            <p>{errors.module?.message}</p>
          </div>

          <div className="audit-form-group">
            <label>Action</label>
            <input type="text" {...register("action")} />
            <p>{errors.action?.message}</p>
          </div>

          <div className="audit-form-group">
            <label>Reference Id</label>
            <input type="text" {...register("referenceId")} />
          </div>

          <div className="audit-form-group">
            <label>Old Value (JSON)</label>
            <textarea rows="4" {...register("oldValue")} />
          </div>

          <div className="audit-form-group">
            <label>New Value (JSON)</label>
            <textarea rows="4" {...register("newValue")} />
          </div>

          <div className="audit-form-group">
            <label>IP Address</label>
            <input type="text" {...register("ipAddress")} />
          </div>

          <div className="audit-form-buttons">
            <SaveButton type="submit">
              {editId ? "Update Audit Log" : "Add Audit Log"}
            </SaveButton>

            <CancelButton
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

export default AuditLogForm;
