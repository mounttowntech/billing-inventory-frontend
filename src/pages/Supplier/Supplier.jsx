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
import {
  AddButton,
  SaveButton,
  CancelButton,
  EditButton,
  DeleteButton,
} from "../../components/Common/Button";

const Supplier = () => {
  const dispatch = useDispatch();

  const { suppliers, loading, error } = useSelector((state) => state.supplier);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

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
    setEditId(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    reset({});
  };

  const handleEdit = (supplier) => {
    setEditId(supplier._id);
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
    <div className="supplier-container">
      <div className="supplier-header">
        <h2>Supplier Management</h2>

        <AddButton onClick={openAddModal}>+ Add Supplier</AddButton>
      </div>

      {error && <div className="supplier-error-banner">{error}</div>}

      {showModal && (
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
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div
            className="supplier-modal confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Delete Supplier</h3>
              <button
                className="close-btn"
                onClick={() => setDeleteTarget(null)}
              >
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
              {suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <tr key={supplier._id}>
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
                      <DeleteButton onClick={() => handleDelete(supplier._id)}>
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
    </div>
  );
};

export default Supplier;
