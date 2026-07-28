import { Controller } from "react-hook-form";
import { SaveButton, CancelButton } from "../../components/Common/Button";

/**
 * Modal form for creating / editing a Role & its module permissions.
 * All state (react-hook-form, etc.) is owned by the parent
 * <RolesPermission /> component and passed down as props.
 */
const RolesPermissionForm = ({
  showForm,
  setShowForm,
  modules,
  register,
  control,
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
      <div className="roles-modal">
        <div className="roles-modal-header">
          <h3>{editId ? "Update Role" : "Add Role"}</h3>

          <button className="close-btn" onClick={() => setShowForm(false)}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Role Name</label>

            <input type="text" {...register("roleName")} />

            <p>{errors.roleName?.message}</p>
          </div>

          <table className="permission-table">
            <thead>
              <tr>
                <th>Module</th>
                <th>Create</th>
                <th>Read</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {modules.map((module, index) => (
                <tr key={module}>
                  <td>{module}</td>

                  <td>
                    <Controller
                      control={control}
                      name={`permissions.${index}.create`}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </td>

                  <td>
                    <Controller
                      control={control}
                      name={`permissions.${index}.read`}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </td>

                  <td>
                    <Controller
                      control={control}
                      name={`permissions.${index}.update`}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </td>

                  <td>
                    <Controller
                      control={control}
                      name={`permissions.${index}.delete`}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="roles-form-buttons">
            <SaveButton type="submit">
              {editId ? "Update Role" : "Add Role"}
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

export default RolesPermissionForm;
