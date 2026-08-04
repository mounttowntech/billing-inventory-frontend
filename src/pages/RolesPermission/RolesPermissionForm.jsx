import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import rolePermissionValidation from "../../validations/RolePermissionValidation";
import Input from "../../components/Common/Input";
import { CancelButton, SaveButton } from "../../components/Common/Button";

const RolesPermissionForm = ({
  mode,
  role,
  modules,
  onSubmit,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(rolePermissionValidation),
  });

  useEffect(() => {
    if (role) {
      reset({
        roleName: role.roleName || "",
        permissions: role.permissions || [],
      });
    } else {
      reset({
        roleName: "",
        permissions: modules.map((module) => ({
          module,
          create: false,
          read: false,
          update: false,
          delete: false,
        })),
      });
    }
  }, [role, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Role Name"
        name="roleName"
        placeholder="Enter Role Name"
        register={register}
        error={errors.roleName?.message}
      />

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
          {mode === "edit" ? "Update " : "Add "}
        </SaveButton>

        <CancelButton
          type="button"
          onClick={() => {
            reset();
            onClose();
          }}
        >
          Cancel
        </CancelButton>
      </div>
    </form>
  );
};

export default RolesPermissionForm;
