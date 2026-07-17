import { useEffect, useState } from "react";
import "./StockLedger.css";

import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  getStockLedgers,
  createStockLedger,
  updateStockLedger,
  deleteStockLedger,
} from "../../features/stockLedger/stockLedgerSlice";

import { getProducts } from "../../features/product/productSlice";

import { stockLedgerValidation } from "../../validations/StockLedgerValidation";

import SearchBox from "../../components/Common/SearchBox";

import {
  AddButton,
  SaveButton,
  CancelButton,
  EditButton,
  DeleteButton,
  PreviousButton,
  NextButton,
} from "../../components/Common/Button";

const StockLedger = () => {
  const dispatch = useDispatch();

  const { stockLedgers = [], isLoading } = useSelector(
    (state) => state.stockLedger || {},
  );

  const { products = [] } = useSelector((state) => state.product || {});

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  // ================= Pagination =================

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

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
      ? Math.ceil(filteredLedgers.length / itemsPerPage)
      : 1;

  const indexOfLast = currentPage * itemsPerPage;

  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentLedgers = filteredLedgers.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ================= Form =================

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(stockLedgerValidation),

    defaultValues: {
      product: "",
      skuCode: "",
      movementType: "",
      quantity: "",
      beforeStock: "",
      afterStock: "",
      referenceNumber: "",
      remarks: "",
    },
  });

  // ================= Load Data =================

  useEffect(() => {
    dispatch(getStockLedgers());
    dispatch(getProducts());
  }, [dispatch]);

  // ================= Submit =================

  const onSubmit = (data) => {
    if (editingId) {
      dispatch(
        updateStockLedger({
          id: editingId,
          ledgerData: data,
        }),
      ).then(() => {
        dispatch(getStockLedgers());

        reset();

        setEditingId(null);

        setShowModal(false);
      });
    } else {
      dispatch(createStockLedger(data)).then(() => {
        dispatch(getStockLedgers());

        reset();

        setShowModal(false);
      });
    }
  };

  // ================= Edit =================

  const handleEdit = (item) => {
    setEditingId(item._id);

    reset({
      product: item.product?._id || "",
      skuCode: item.skuCode || "",
      movementType: item.movementType || "",
      quantity: item.quantity || "",
      beforeStock: item.beforeStock || "",
      afterStock: item.afterStock || "",
      referenceNumber: item.referenceNumber || "",
      remarks: item.remarks || "",
    });

    setShowModal(true);
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
    <div className="stockledger-container">
      {/* Header */}
      <div className="stockledger-header">
        <h2>Stock Ledger Management</h2>
      </div>

      {/* Actions */}
      <div className="stockledger-actions">
        <SearchBox
          placeholder="Search Stock Ledger..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <AddButton
          onClick={() => {
            setEditingId(null);

            reset({
              product: "",
              skuCode: "",
              movementType: "",
              quantity: "",
              beforeStock: "",
              afterStock: "",
              referenceNumber: "",
              remarks: "",
            });

            setShowModal(true);
          }}
        >
          Add Stock Ledger
        </AddButton>
      </div>

      {/* Table */}

      <div className="table-wrapper">
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

      {/* Pagination */}

      <div className="pagination">
        <PreviousButton
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </PreviousButton>

        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>

        <NextButton
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </NextButton>
      </div>

      {/* Modal Starts Here */}

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
            className="stockledger-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{editingId ? "Update Stock Ledger" : "Add Stock Ledger"}</h3>

              <button
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  reset();
                }}
              >
                ×
              </button>
            </div>

            <form
              className="stockledger-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Product */}
              <div className="stock-form-group">
                <label>Product</label>

                <select
                  {...register("product")}
                  onChange={(e) => {
                    const selectedProduct = products.find(
                      (p) => p._id === e.target.value,
                    );

                    setValue("product", e.target.value);

                    if (selectedProduct) {
                      setValue(
                        "skuCode",
                        selectedProduct.skuCode ||
                          selectedProduct.variants?.[0]?.skuCode ||
                          "",
                      );
                    }
                  }}
                >
                  <option value="">Select Product</option>

                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.productName}
                    </option>
                  ))}
                </select>

                <p>{errors.product?.message}</p>
              </div>

              {/* SKU Code */}
              <div className="stock-form-group">
                <label>SKU Code</label>

                <input
                  type="text"
                  placeholder="Enter SKU Code"
                  {...register("skuCode")}
                />

                <p>{errors.skuCode?.message}</p>
              </div>

              {/* Movement Type */}
              <div className="stock-form-group">
                <label>Movement Type</label>

                <select {...register("movementType")}>
                  <option value="">Select Movement</option>
                  <option value="IN">IN</option>
                  <option value="OUT">OUT</option>
                  <option value="PURCHASE">PURCHASE</option>
                  <option value="SALE">SALE</option>
                  <option value="RETURN">RETURN</option>
                  <option value="ADJUSTMENT">ADJUSTMENT</option>
                </select>

                <p>{errors.movementType?.message}</p>
              </div>

              {/* Quantity */}
              <div className="stock-form-group">
                <label>Quantity</label>

                <input
                  type="number"
                  placeholder="Enter Quantity"
                  {...register("quantity")}
                />

                <p>{errors.quantity?.message}</p>
              </div>

              {/* Before Stock */}
              <div className="stock-form-group">
                <label>Before Stock</label>

                <input
                  type="number"
                  placeholder="Enter Before Stock"
                  {...register("beforeStock")}
                />

                <p>{errors.beforeStock?.message}</p>
              </div>

              {/* After Stock */}
              <div className="stock-form-group">
                <label>After Stock</label>

                <input
                  type="number"
                  placeholder="Enter After Stock"
                  {...register("afterStock")}
                />

                <p>{errors.afterStock?.message}</p>
              </div>

              {/* Reference Number */}
              <div className="stock-form-group">
                <label>Reference Number</label>

                <input
                  type="text"
                  placeholder="Enter Reference Number"
                  {...register("referenceNumber")}
                />

                <p>{errors.referenceNumber?.message}</p>
              </div>

              {/* Remarks */}
              <div className="stock-form-group full-width">
                <label>Remarks</label>

                <textarea
                  rows="4"
                  placeholder="Enter Remarks"
                  {...register("remarks")}
                />

                <p>{errors.remarks?.message}</p>
              </div>

              {/* Buttons */}
              <div className="form-buttons">
                <SaveButton type="submit">
                  {editingId ? "Update Stock Ledger" : "Save Stock Ledger"}
                </SaveButton>

                <CancelButton
                  type="button"
                  onClick={() => {
                    reset();
                    setEditingId(null);
                    setShowModal(false);
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

export default StockLedger;
