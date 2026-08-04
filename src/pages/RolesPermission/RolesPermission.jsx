import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Modal from "../../components/Common/Modal";
import "./RolesPermission.css";
import SearchBox from "../../components/Common/SearchBox";
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
  const dispatch = useDispatch();

  const { roles, isLoading } = useSelector((state) => state.rolePermission);

  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const itemsPerPage = rowsPerPage;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const filteredRoles = roles.filter((role) =>
    role.roleName.toLowerCase().includes(search.toLowerCase()),
  );
  const currentRoles = filteredRoles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage) || 1;

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

  const onSubmit = async (data) => {
    let result;

    if (editId && editId !== "add") {
      result = await dispatch(
        updateRole({
          id: editId,
          ...data,
        }),
      );
    } else {
      result = await dispatch(createRole(data));
    }

    if (!result.error) {
      dispatch(getRoles());
      reset();
      setEditId(null);
      setSelectedRole(null);
      setShowForm(false);
    }
  };

  const handleEdit = (role) => {
    setEditId(role._id);
    setSelectedRole(role);
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
    <div className="roles-permission-container">
      <div className="roles-permission-header">
        <h2 className="roles-header">Roles & Permissions</h2>

        <AddButton
          onClick={() => {
            setEditId("add");
            setSelectedRole(null);

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
          Add
        </AddButton>
      </div>
      <div className="roles-container">
        <div className="table-toolbar">
          <div className="entries">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>

            <span>Entries</span>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <SearchBox
              placeholder="Search Roles..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
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
            {currentRoles?.length > 0 ? (
              currentRoles.map((role, index) => (
                <tr key={role._id}>
                  <td>{indexOfFirst + index + 1}</td>
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
        <Modal
          open={showForm}
          title={editId === "add" ? "Add Role" : "Edit Role"}
          onClose={() => setShowForm(false)}
        >
          <RolesPermissionForm
            mode={editId === "add" ? "add" : "edit"}
            role={selectedRole}
            modules={modules}
            onSubmit={onSubmit}
            onClose={() => setShowForm(false)}
          />
        </Modal>
        <div className="user-pagination">
          <p>
            Showing {filteredRoles.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredRoles.length)}
            of {filteredRoles.length} entries
          </p>

          <div className="page-buttons">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              &laquo;
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              &lsaquo;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              &rsaquo;
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesPermission;
