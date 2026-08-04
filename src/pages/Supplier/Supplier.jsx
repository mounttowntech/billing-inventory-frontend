import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import "./Supplier.css";
import { yupResolver } from "@hookform/resolvers/yup";
import SupplierValidation from "../../validations/SupplierValidation";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../features/supplier/supplierSlice";
import SearchBox from "../../components/Common/SearchBox";
import Modal from "../../components/Common/Modal";

import {
  AddButton,
  PreviousButton,
  NextButton,
  CancelButton,
  EditButton,
  DeleteButton,
} from "../../components/Common/Button";
import SupplierForm from "./SupplierForm";

const Supplier = () => {
  const dispatch = useDispatch();

  const { suppliers, loading, error } = useSelector((state) => state.supplier);

  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = rowsPerPage;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSuppliers = suppliers.slice(indexOfFirst, indexOfLast);
  const totalPages =
    suppliers.length > 0 ? Math.ceil(suppliers.length / itemsPerPage) : 1;

  const [search, setSearch] = useState("");
  const filteredSuppliers = currentSuppliers.filter((supplier) =>
    supplier.supplierName.toLowerCase().includes(search.toLowerCase()),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(SupplierValidation),
  });

  useEffect(() => {
    dispatch(getSuppliers());
  }, [dispatch]);

  const openAddModal = () => {
    reset({});
    setSelectedSupplier(null);
    setEditId("add");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    reset({});
  };

  const handleEdit = (supplier) => {
    setEditId(supplier._id);
    setSelectedSupplier(supplier);

    reset({
      supplierName: supplier.supplierName,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      gstNumber: supplier.gstNumber,
      address: supplier.address,
      city: supplier.city,
      state: supplier.state,
      pincode: supplier.pincode,
      openingBalance: supplier.openingBalance,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const target = suppliers.find((s) => s._id === id);
    setDeleteTarget(target || { _id: id, supplierName: "this supplier" });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await dispatch(deleteSupplier(deleteTarget._id));
    setDeleteTarget(null);
  };

  const onSubmit = async (data) => {
    const supplierData = {
      ...data,
      openingBalance: Number(data.openingBalance),
    };
    let result;
    if (editId) {
      result = await dispatch(
        updateSupplier({
          id: editId,
          supplierData,
        }),
      );
    } else {
      result = await dispatch(createSupplier(supplierData));
    }
    if (!result.error) {
      dispatch(getSuppliers());
      reset();
      setEditId(null);
      setShowModal(false);
    }
  };

  return (
    <div className="supplier-main">
      <div className="supplier-header">
        <h2>Supplier Management</h2>
        <AddButton
          onClick={() => {
            openAddModal();
            setSelectedSupplier(null);
          }}
        >
          Add
        </AddButton>
      </div>

      <div className="supplier-container">
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
              placeholder="Search Suppliers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Modal
          open={showModal}
          title={editId === "add" ? "Add Supplier" : "Edit Supplier"}
          size="md"
          onClose={() => setShowModal(false)}
        >
          <SupplierForm
            mode={editId === "add" ? "add" : "edit"}
            supplier={selectedSupplier}
            onSubmit={onSubmit}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false);
              dispatch(getSuppliers());
            }}
          />
        </Modal>

        {deleteTarget && (
          <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
            <div
              className="supplier-modal confirm-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Delete Supplier</h3>
                <button className="" onClick={() => setDeleteTarget(null)}>
                  ×
                </button>
              </div>
              <p>
                Are you sure you want to delete{" "}
                <strong>{deleteTarget.supplierName}</strong>? This cannot be
                undone.
              </p>
              <div className="form-buttons">
                <CancelButton onClick={() => setDeleteTarget(null)}>
                  Cancel
                </CancelButton>
                <DeleteButton onClick={confirmDelete}>Delete</DeleteButton>
              </div>
            </div>
          </div>
        )}

        <div className="table-wrapper">
          {loading && suppliers.length === 0 ? (
            <h3>Loading...</h3>
          ) : (
            <table className="supplier-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Supplier Code</th>
                  <th>Supplier Name</th>
                  <th>Contact Person</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Opening Balance</th>
                  <th>Current Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier) => (
                    <tr key={supplier._id}>
                      <td>
                        {indexOfFirst + filteredSuppliers.indexOf(supplier) + 1}
                      </td>
                      <td>{supplier.supplierCode}</td>
                      <td>{supplier.supplierName}</td>
                      <td>{supplier.contactPerson}</td>
                      <td>{supplier.phone}</td>
                      <td>{supplier.email}</td>
                      <td>{supplier.city}</td>
                      <td>₹{supplier.openingBalance}</td>
                      <td>₹{supplier.currentBalance}</td>
                      <td className="actions-cell">
                        <EditButton onClick={() => handleEdit(supplier)}>
                          Edit
                        </EditButton>
                        <DeleteButton
                          onClick={() => handleDelete(supplier._id)}
                        >
                          Delete
                        </DeleteButton>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9">No Suppliers Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="user-pagination">
          <p>
            Showing {filteredSuppliers.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredSuppliers.length)}
            of {filteredSuppliers.length} entries
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

export default Supplier;
