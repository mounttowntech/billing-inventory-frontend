import { useEffect, useState } from "react";
import "./StockLedger.css";
import Modal from "../../components/Common/Modal";
import { useDispatch, useSelector } from "react-redux";

import {
  getStockLedgers,
  createStockLedger,
  updateStockLedger,
  deleteStockLedger,
} from "../../features/stockLedger/stockLedgerSlice";

import { getProducts } from "../../features/product/productSlice";

import SearchBox from "../../components/Common/SearchBox";

import {
  AddButton,
  EditButton,
  DeleteButton,
  PreviousButton,
  NextButton,
} from "../../components/Common/Button";

import StockLedgerForm from "./StockLedgerForm";

const StockLedger = () => {
  const dispatch = useDispatch();
  const { stockLedgers = [], isLoading } = useSelector(
    (state) => state.stockLedger || {},
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [mode, setMode] = useState("add");
  const { products = [] } = useSelector((state) => state.product || {});

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // ================= Search =================

  const filteredLedgers = stockLedgers.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      (item.product?.productName || "").toLowerCase().includes(keyword) ||
      (item.skuCode || "").toLowerCase().includes(keyword) ||
      (item.movementType || "").toLowerCase().includes(keyword) ||
      (item.referenceNumber || "").toLowerCase().includes(keyword)
    );
  });

  const totalPages =
    filteredLedgers.length > 0
      ? Math.ceil(filteredLedgers.length / rowsPerPage)
      : 1;

  const indexOfLast = currentPage * rowsPerPage;

  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentLedgers = filteredLedgers.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ================= Load Data =================

  useEffect(() => {
    dispatch(getStockLedgers());
    dispatch(getProducts());
  }, [dispatch]);

  // ================= Submit =================

  const handleFormSubmit = (data) => {
    if (editingId) {
      dispatch(
        updateStockLedger({
          id: editingId,
          ledgerData: data,
        }),
      ).then(() => {
        dispatch(getStockLedgers());

        setEditingId(null);
        setEditingItem(null);

        setShowModal(false);
      });
    } else {
      dispatch(createStockLedger(data)).then(() => {
        dispatch(getStockLedgers());

        setShowModal(false);
      });
    }
  };

  // ================= Edit =================

  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditingItem(item);
    setMode("edit");
    setShowModal(true);
  };

  // ================= Cancel / Close =================

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setEditingItem(null);
  };

  // ================= Delete =================

  const handleDelete = (id) => {
    if (window.confirm("Delete this Stock Ledger?")) {
      dispatch(deleteStockLedger(id)).then(() => {
        dispatch(getStockLedgers());
      });
    }
  };
  return (
    <>
      <div className="stockledger-page-header">
        <h2>Stock Ledger Management</h2>

        <AddButton
          onClick={() => {
            setEditingId(null);
            setEditingItem(null);
            setMode("add");
            setShowModal(true);
          }}
        >
          Add
        </AddButton>
      </div>
      <div className="stockledger-container">
        <div className="table-wrapper-stockledger">
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

            <input
              className="user-search-box"
              placeholder="Search stock ledgers..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <table className="stockledger-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Product</th>
                <th>SKU Code</th>
                <th>Movement</th>
                <th>Quantity</th>
                <th>Before Stock</th>
                <th>After Stock</th>
                <th>Reference No</th>
                <th>Remarks</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : currentLedgers.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center" }}>
                    No Stock Ledger Records Found
                  </td>
                </tr>
              ) : (
                currentLedgers.map((item, index) => (
                  <tr key={item._id}>
                    <td>{indexOfFirst + index + 1}</td>

                    <td>{item.product?.productName || "-"}</td>

                    <td>{item.skuCode}</td>

                    <td
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "600",
                      }}
                    >
                      {item.movementType}
                    </td>

                    <td>{item.quantity}</td>

                    <td>{item.beforeStock}</td>

                    <td>{item.afterStock}</td>

                    <td>{item.referenceNumber || "-"}</td>

                    <td>{item.remarks || "-"}</td>

                    <td>
                      {new Date(item.createdAt).toLocaleDateString()}
                      <br />
                      <small>
                        {new Date(item.createdAt).toLocaleTimeString()}
                      </small>
                    </td>

                    <td className="action-buttons">
                      <EditButton onClick={() => handleEdit(item)} />

                      <DeleteButton onClick={() => handleDelete(item._id)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="user-pagination">
          <p>
            Showing {filteredLedgers.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredLedgers.length)}
            of {filteredLedgers.length} entries
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
      <Modal
        open={showModal}
        title={mode === "add" ? "Add Stock Ledger" : "Edit Stock Ledger"}
        size="md"
        onClose={() => setShowModal(false)}
      >
        <StockLedgerForm
          products={products}
          editingId={editingId}
          editingItem={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default StockLedger;
