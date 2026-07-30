import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/common/Modal";

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

import {
  AddButton,
  EditButton,
  DeleteButton,
} from "../../components/Common/Button";
import PurchaseReturnForm from "./PurchaseReturnForm";

const PurchaseReturn = () => {
  const dispatch = useDispatch();

  const { purchases: purchaseReturns, loading } = useSelector(
    (state) => state.purchaseReturn,
  );
  const { purchases } = useSelector((state) => state.purchase);
  const { suppliers } = useSelector((state) => state.supplier);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [entriesPerPage, setEntriesPerPage] = useState(5);

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

  const totalPages =
    filteredPurchaseReturns.length > 0
      ? Math.ceil(filteredPurchaseReturns.length / entriesPerPage)
      : 1;

  const openAddModal = () => {
    setEditingId(null);
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingId(null);
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this Purchase Return?")) {
      dispatch(deletePurchaseReturn(id));
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingId) {
        await dispatch(
          updatePurchaseReturn({
            id: editingId,
            purchase: data,
          }),
        ).unwrap();
      } else {
        await dispatch(createPurchaseReturn(data)).unwrap();
      }

      await dispatch(getPurchasesReturn()).unwrap();

      setShowModal(false);
      setEditingId(null);
      setEditingItem(null);
    } catch (error) {
      console.error(error);
    }
  };

  const purchaseOptions = purchases.map((purchase) => ({
    _id: purchase._id,
    label: purchase.purchaseNo,
  }));

  const supplierOptions = suppliers.map((supplier) => ({
    _id: supplier._id,
    label: supplier.supplierName,
  }));

  return (
    <div className="purchase-return-main">
      <div className="purchase-return-header">
        <h2>Purchase Returns</h2>

        <AddButton onClick={openAddModal}>+ Add </AddButton>
      </div>
      <div className="purchase-return-container">
        <div className="table-toolbar">
          <div className="entries">
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
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
              placeholder="Search Purchase Return..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <Modal
          open={showModal}
          title={editingId ? "Edit " : "Add "}
          size="md"
          onClose={() => setShowModal(false)}
        >
          <PurchaseReturnForm
            item={editingItem}
            editId={editingId}
            purchaseOptions={purchaseOptions}
            supplierOptions={supplierOptions}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
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
                    <td>{item.purchase?.purchaseNo || "-"}</td>
                    <td>{item.supplier?.supplierName || "-"}</td>
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
        <div className="user-pagination">
          <p>
            Showing{" "}
            {filteredPurchaseReturns.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredPurchaseReturns.length)}
            of {filteredPurchaseReturns.length} entries
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

export default PurchaseReturn;
