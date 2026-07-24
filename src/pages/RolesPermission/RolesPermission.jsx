import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
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
} from "../../components/Common/Button";
import RolesPermissionForm from "./RolesPermissionForm";

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

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

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
            <th>#</th>
            <th>Role Name</th>
            {/* <th>Permissions</th> */}
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {roles?.length > 0 ? (
            roles.map((role) => (
              <tr key={role._id}>
                <td>{roles.indexOf(role) + 1}</td>
                <td>{role.roleName}</td>

                {/* <td>
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
                </td> */}

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

      <RolesPermissionForm
        showForm={showForm}
        setShowForm={setShowForm}
        modules={modules}
        register={register}
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        reset={reset}
        setEditId={setEditId}
        editId={editId}
      />
    </div>
  );
};

export default RolesPermission;
