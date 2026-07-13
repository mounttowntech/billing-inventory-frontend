import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import "./RolesPermission.css";

import RolePermissionValidation from "../../validations/RolePermissionValidation";

import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../../features/rolePermission/rolePermissionSlice";

import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
} from "../../components/Common/Button";

const modules = [
  "Dashboard",
  "Products",
  "Category",
  "Brand",
  "Fabric",
  "Season",
  "Style",
  "Customer",
  "Supplier",
  "Purchase",
  "Expense",
  "Invoice",
  "Reports",
  "Users",
];

const RolesPermission = () => {
  const { roles, isLoading } = useSelector((state) => state.rolePermission);
  const dispatch = useDispatch();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(RolePermissionValidation),
    defaultValues: {
      roleName: "",
      permissions: modules.map((module) => ({
        module,
        create: false,
        read: false,
        update: false,
        delete: false,
      })),
    },
  });

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  const onSubmit = (data) => {
    if (editId) {
      dispatch(
        updateRole({
          id: editId,
          ...data,
        }),
      ).then(() => {
        dispatch(getRoles());
        reset();
        setEditId(null);
        setShowForm(false);
      });
    } else {
      dispatch(createRole(data)).then(() => {
        dispatch(getRoles());
        reset();
        setShowForm(false);
      });
    }
  };

  const handleEdit = (role) => {
    setEditId(role._id);

    reset({
      roleName: role.roleName,
      permissions: modules.map((module) => {
        const existing = role.permissions.find((p) => p.module === module);

        return (
          existing || {
            module,
            create: false,
            read: false,
            update: false,
            delete: false,
          }
        );
      }),
    });

    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Role?")) {
      dispatch(deleteRole(id)).then(() => {
        dispatch(getRoles());
      });
    }
  };
  return (
    <div className="roles-container">
      <h2 className="roles-header">Roles & Permissions</h2>

      <AddButton
        onClick={() => {
          setEditId(null);

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

          setShowForm(true);
        }}
      >
        Add Role
      </AddButton>

      <table className="roles-table">
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Permissions</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {roles?.length > 0 ? (
            roles.map((role) => (
              <tr key={role._id}>
                <td>{role.roleName}</td>

                <td>
                  {role.permissions?.map((permission, index) => (
                    <div key={index} className="permission-row">
                      <strong>{permission.module}</strong> :{" "}
                      {[
                        permission.create && "Create",
                        permission.read && "Read",
                        permission.update && "Update",
                        permission.delete && "Delete",
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  ))}
                </td>

                <td>{new Date(role.createdAt).toLocaleString("en-IN")}</td>

                <td className="action-buttons">
                  <EditButton onClick={() => handleEdit(role)} />

                  <DeleteButton onClick={() => handleDelete(role._id)} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No Roles Found</td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && (
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
      )}
    </div>
  );
};

export default RolesPermission;
