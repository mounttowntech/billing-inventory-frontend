import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSuppliers } from "../../features/supplier/supplierSlice";
import { getProducts } from "../../features/product/productSlice";
import {
  getPurchases,
  createPurchase,
  updatePurchase,
  deletePurchase,
} from "../../features/purchase/purchaseSlice";
import "./PurchaseList.css";
import {
  AddButton,
  PreviousButton,
  NextButton,
  EditButton,
  DeleteButton,
} from "../../components/Common/Button";
import PurchaseForm from "./PurchaseForm";
import Modal from "../../components/Common/Modal";
import SearchBox from "../../components/Common/SearchBox";

const Purchase = () => {
  const dispatch = useDispatch();

  const { purchases, loading } = useSelector((state) => state.purchase);
  const { suppliers } = useSelector((state) => state.supplier);
  const { products } = useSelector((state) => state.product);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  //  Filter

  const filteredPurchases = purchases.filter((purchase) =>
    purchase.purchaseNo?.toLowerCase().includes(search.toLowerCase()),
  );

  //  Pagination

  const itemsPerPage = rowsPerPage;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentPurchases = filteredPurchases.slice(indexOfFirst, indexOfLast);

  const totalPages =
    filteredPurchases.length > 0
      ? Math.ceil(filteredPurchases.length / itemsPerPage)
      : 1;

  useEffect(() => {
    dispatch(getPurchases());
    dispatch(getSuppliers());
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleEdit = (purchase) => {
    setEditingId(purchase._id);
    setEditingPurchase(purchase);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      const result = await dispatch(deletePurchase(id));

      if (!result.error) {
        dispatch(getPurchases());
      }
    }
  };

  const handleFormSubmit = async (purchaseData) => {
    let result;

    if (editingId) {
      result = await dispatch(
        updatePurchase({
          id: editingId,
          purchase: purchaseData,
        }),
      );
    } else {
      result = await dispatch(createPurchase(purchaseData));
    }

    if (!result.error) {
      setEditingId(null);
      setEditingPurchase(null);
      setShowModal(false);
      dispatch(getPurchases());
      return true;
    }

    return false;
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="purchase-main">
      <div className="purchase-header">
        <h2>Purchase Management</h2>

        <AddButton className="add-btn" onClick={() => setShowModal(true)}>
          Add
        </AddButton>
      </div>
      <div className="purchase-container">
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
              placeholder="Search Measurements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Modal
          open={showModal}
          title={editingId ? "Edit purchase" : "Add purchase"}
          size="md"
          onClose={handleCloseModal}
        >
          <PurchaseForm
            purchase={editingPurchase}
            editId={editingId}
            suppliers={suppliers}
            products={products}
            onSubmit={handleFormSubmit}
            onClose={handleCloseModal}
          />
        </Modal>

        <div className="table-wrapper">
          <table className="purchase-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Purchase No</th>
                <th className="supplier-actions">Supplier Code</th>
                <th className="supplier-column">Supplier Name</th>
                <th>Date</th>
                <th>Sub Total</th>
                <th>GST</th>
                <th>Grand Total</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Status</th>
                <th className="supplier-actions">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentPurchases.length > 0 ? (
                currentPurchases.map((purchase) => (
                  <tr key={purchase._id}>
                    <td>
                      {indexOfFirst + currentPurchases.indexOf(purchase) + 1}
                    </td>
                    <td>{purchase.purchaseNo}</td>
                    <td>{purchase.supplier?.supplierCode}</td>
                    <td className="supplier-column">
                      {purchase.supplier?.supplierName}
                    </td>
                    <td>{purchase.purchaseDate?.split("T")[0]}</td>
                    <td>₹{purchase.subTotal}</td>
                    <td>₹{purchase.gstAmount}</td>
                    <td>₹{purchase.grandTotal}</td>
                    <td>₹{purchase.paidAmount}</td>
                    <td>₹{purchase.dueAmount}</td>
                    <td>{purchase.paymentStatus}</td>
                    <td className="action-buttons">
                      <EditButton onClick={() => handleEdit(purchase)} />
                      <DeleteButton
                        onClick={() => handleDelete(purchase._id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="empty-row">
                  <td colSpan="4">No Styles Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="user-pagination">
          <p>
            Showing {filteredPurchases.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredPurchases.length)}
            of {filteredPurchases.length} entries
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

export default Purchase;
