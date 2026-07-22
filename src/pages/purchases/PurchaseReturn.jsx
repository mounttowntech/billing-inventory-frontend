import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import "./PurchaseReturn.css";

import {
  getPurchasesReturn,
  createPurchaseReturn,
  updatePurchaseReturn,
  deletePurchaseReturn,
} from "../../features/purchaseReturn/purchaseReturnSlice";

import { getPurchases } from "../../features/purchase/purchaseSlice";
import { getSuppliers } from "../../features/supplier/supplierSlice";

import SearchBox from "../../components/common/SearchBox";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";

import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
} from "../../components/Common/Button";

const PurchaseReturn = () => {
  const dispatch = useDispatch();

  const { purchases: purchaseReturns, loading } = useSelector(
    (state) => state.purchaseReturn,
  );
  const { purchases } = useSelector((state) => state.purchase);
  const { suppliers } = useSelector((state) => state.supplier);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [entriesPerPage, setEntriesPerPage] = useState(10);

  useEffect(() => {
    dispatch(getPurchasesReturn());
    dispatch(getPurchases());
    dispatch(getSuppliers());
  }, [dispatch]);

  const filteredPurchaseReturns = useMemo(() => {
    return purchaseReturns.filter((item) => {
      return (
        item.returnNo?.toLowerCase().includes(search.toLowerCase()) ||
        item.reason?.toLowerCase().includes(search.toLowerCase()) ||
        item.supplier?.supplierName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        item.purchase?.purchaseNo?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [purchaseReturns, search]);

  const indexOfLast = currentPage * entriesPerPage;

  const indexOfFirst = indexOfLast - entriesPerPage;

  const currentPurchaseReturns = filteredPurchaseReturns.slice(
    indexOfFirst,
    indexOfLast,
  );

  const totalPages = Math.ceil(filteredPurchaseReturns.length / entriesPerPage);

  const openAddModal = () => {
    reset();
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    console.log("Editing Purchase Return:", item);
    setEditingId(item._id);

    setValue("returnNo", item.returnNo);
    setValue("purchase", item.purchase);
    setValue("supplier", item.supplier);
    setValue(
      "returnDate",
      item.returnDate ? item.returnDate.substring(0, 10) : "",
    );
    setValue("refundAmount", item.refundAmount);
    setValue("reason", item.reason);

    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this Purchase Return?")) {
      dispatch(deletePurchaseReturn(id));
    }
  };

  const onSubmit = (data) => {
    if (editingId) {
      dispatch(
        updatePurchaseReturn({
          id: editingId,
          purchase: data,
        }),
      );
    } else {
      dispatch(createPurchaseReturn(data));
    }
    dispatch(getPurchasesReturn());
    setShowModal(false);
    reset();
    setEditingId(null);
    console.log(data);
  };

  const purchaseOptions = purchases.map((purchase) => ({
    value: purchase._id,
    label: purchase.purchaseNo,
  }));

  const supplierOptions = suppliers.map((supplier) => ({
    value: supplier._id,
    label: supplier.supplierName,
  }));

  return (
    <>
      <div className="purchase-return-container">
        <div className="purchase-return-header">
          <h2>Purchase Returns</h2>

          <AddButton onClick={openAddModal}>+ Add Purchase Return</AddButton>
        </div>

        <div className="purchase-return-toolbar">
          <SearchBox
            placeholder="Search Purchase Return..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <select
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="purchase-return-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Return No</th>
                <th>Purchase</th>
                <th>Supplier</th>
                <th>Return Date</th>
                <th>Refund Amount</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8">Loading...</td>
                </tr>
              ) : currentPurchaseReturns.length === 0 ? (
                <tr>
                  <td colSpan="8">No Purchase Returns Found</td>
                </tr>
              ) : (
                currentPurchaseReturns.map((item, index) => (
                  <tr key={item._id}>
                    <td>{indexOfFirst + index + 1}</td>

                    <td>{item.returnNo}</td>

                    <td>{item.purchase || "-"}</td>

                    <td>{item.supplier || "-"}</td>

                    <td>
                      {item.returnDate
                        ? new Date(item.returnDate).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>₹ {item.refundAmount}</td>

                    <td>{item.reason}</td>

                    <td className="action-buttons">
                      <EditButton onClick={() => handleEdit(item)}>
                        Edit
                      </EditButton>

                      <DeleteButton onClick={() => handleDelete(item._id)}>
                        Delete
                      </DeleteButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowModal(false);
            setEditingId(null);
            reset();
          }}
        >
          <div
            className="purchase-return-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                {editingId ? "Edit Purchase Return" : "Add Purchase Return"}
              </h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-grid">
                <Input
                  label="Return No"
                  name="returnNo"
                  register={register}
                  error={errors.returnNo}
                  validation={{
                    required: "Return No is required",
                  }}
                />

                <Select
                  label="Purchase"
                  name="purchase"
                  register={register}
                  error={errors.purchase}
                  options={purchaseOptions}
                  validation={{
                    required: "Purchase is required",
                  }}
                />

                <Select
                  label="Supplier"
                  name="supplier"
                  register={register}
                  error={errors.supplier}
                  options={supplierOptions}
                  validation={{
                    required: "Supplier is required",
                  }}
                />

                <Input
                  type="date"
                  label="Return Date"
                  name="returnDate"
                  register={register}
                  error={errors.returnDate}
                  validation={{
                    required: "Return Date is required",
                  }}
                />

                <Input
                  type="number"
                  label="Refund Amount"
                  name="refundAmount"
                  register={register}
                  error={errors.refundAmount}
                  validation={{
                    required: "Refund Amount is required",
                  }}
                />

                <Input
                  label="Reason"
                  name="reason"
                  register={register}
                  error={errors.reason}
                  validation={{
                    required: "Reason is required",
                  }}
                />
              </div>

              <div className="modal-buttons">
                <CancelButton
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    reset();
                  }}
                >
                  Cancel
                </CancelButton>

                <SaveButton type="submit">
                  {editingId ? "Update" : "Save"}
                </SaveButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PurchaseReturn;
