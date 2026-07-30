import { useEffect, useMemo, useState } from "react";
import "./StockAdjustment.css";

import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/Common/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  getStockAdjustments,
  createStockAdjustment,
  updateStockAdjustment,
  deleteStockAdjustment,
} from "../../features/StockAdjustment/stockAdjustmentSlice";

import { getProducts } from "../../features/Product/productSlice";

import { stockAdjustmentValidation } from "../../validations/StockAdjustmentValidation";
import SearchBox from "../../components/Common/SearchBox";
import {
  AddButton,
  EditButton,
  DeleteButton,
} from "../../components/Common/Button";
import StockAdjustmentForm from "./StockAdjustmentForm";

const StockAdjustment = () => {
  const dispatch = useDispatch();

  const { stockAdjustments, isLoading } = useSelector(
    (state) => state.stockAdjustment,
  );
  const { products } = useSelector((state) => state.product);

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(stockAdjustmentValidation),
    defaultValues: {
      product: "",
      skuCode: "",
      adjustmentType: "increase",
      quantity: "",
      reason: "",
    },
  });

  // ================= States =================

  const [showForm, setShowForm] = useState(false);

  const [editId, setEditId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = rowsPerPage;

  // ================= Watch =================

  const selectedProduct = watch("product");

  // ================= Product Variants =================

  const selectedProductData = useMemo(() => {
    return products?.find((item) => item._id === selectedProduct) || null;
  }, [products, selectedProduct]);

  const variants = selectedProductData?.variants || [];

  // ================= Load Data =================

  useEffect(() => {
    dispatch(getStockAdjustments());
    dispatch(getProducts());
  }, [dispatch]);

  // ================= Reset SKU =================

  useEffect(() => {
    setValue("skuCode", "");
  }, [selectedProduct, setValue]);

  // ================= Add =================

  const handleAdd = () => {
    reset({
      product: "",
      skuCode: "",
      adjustmentType: "increase",
      quantity: "",
      reason: "",
    });

    setEditId(null);
    setShowForm(true);
  };

  // ================= Edit =================

  const handleEdit = (adjustment) => {
    reset({
      product: adjustment.product?._id || adjustment.product,
      skuCode: adjustment.skuCode,
      adjustmentType: adjustment.adjustmentType,
      quantity: adjustment.quantity,
      reason: adjustment.reason,
    });

    setEditId(adjustment._id);
    setShowForm(true);
  };

  // ================= Delete =================

  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to delete this stock adjustment?")
    ) {
      dispatch(deleteStockAdjustment(id)).then(() => {
        dispatch(getStockAdjustments());
      });
    }
  };

  // ================= Submit =================

  const onSubmit = (data) => {
    const payload = {
      product: data.product,
      skuCode: data.skuCode,
      adjustmentType: data.adjustmentType,
      quantity: Number(data.quantity),
      reason: data.reason,
    };

    if (editId) {
      dispatch(
        updateStockAdjustment({
          id: editId,
          adjustmentData: payload,
        }),
      ).then(() => {
        dispatch(getStockAdjustments());

        setShowForm(false);
        setEditId(null);

        reset({
          product: "",
          skuCode: "",
          adjustmentType: "increase",
          quantity: "",
          reason: "",
        });
      });
    } else {
      dispatch(createStockAdjustment(payload)).then(() => {
        dispatch(getStockAdjustments());

        setShowForm(false);

        reset({
          product: "",
          skuCode: "",
          adjustmentType: "increase",
          quantity: "",
          reason: "",
        });
      });
    }
  };

  // ================= Cancel =================

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);

    reset({
      product: "",
      skuCode: "",
      adjustmentType: "increase",
      quantity: "",
      reason: "",
    });
  };

  // ================= Search =================

  const filteredAdjustments = stockAdjustments.filter((item) => {
    const productName = item.product?.productName?.toLowerCase() || "";

    const sku = item.skuCode?.toLowerCase() || "";

    const type = item.adjustmentType?.toLowerCase() || "";

    const reason = item.reason?.toLowerCase() || "";

    const keyword = search.toLowerCase();

    return (
      productName.includes(keyword) ||
      sku.includes(keyword) ||
      type.includes(keyword) ||
      reason.includes(keyword)
    );
  });

  // ================= Pagination =================

  const indexOfLastRow = currentPage * itemsPerPage;

  const indexOfFirstRow = indexOfLastRow - itemsPerPage;

  const currentRows = filteredAdjustments.slice(
    indexOfFirstRow,
    indexOfLastRow,
  );

  const totalPages = Math.ceil(filteredAdjustments.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="stock-main">
      <div className="stock-header">
        <h2>Stock Adjustments</h2>
        <AddButton onClick={handleAdd} label="Add Adjustment">
          <span className="add-icon">+</span> Add Adjustment
        </AddButton>
      </div>

      <div className="stock-adjustment-page">
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
              placeholder="Search Stock Adjustments..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <Modal
          open={showForm}
          onClose={() => setShowForm(false)}
          title={editId ? "Edit Stock Adjustment" : "Add Stock Adjustment"}
        >
          <StockAdjustmentForm
            showForm={showForm}
            products={products}
            variants={variants}
            selectedProduct={selectedProduct}
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            errors={errors}
            editingId={editId}
            editId={editId}
            isLoading={isLoading}
            handleCancel={handleCancel}
          />
        </Modal>

        <div className="stock-adjustment-table-wrapper">
          <table className="stock-adjustment-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Adjustment No</th>
                <th>Product</th>
                <th>SKU Code</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="table-status">
                    Loading...
                  </td>
                </tr>
              ) : currentRows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="table-status">
                    No stock adjustments found.
                  </td>
                </tr>
              ) : (
                currentRows.map((item) => (
                  <tr key={item._id}>
                    <td>{indexOfFirstRow + currentRows.indexOf(item) + 1}</td>
                    <td>{item.adjustmentNo}</td>
                    <td>{item.product?.productName || "-"}</td>
                    <td>{item.skuCode}</td>
                    <td>
                      <span
                        className={`badge ${
                          item.adjustmentType === "increase"
                            ? "badge-increase"
                            : "badge-decrease"
                        }`}
                      >
                        {item.adjustmentType}
                      </span>
                    </td>
                    <td>{item.quantity}</td>
                    <td>{item.reason}</td>
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
            Showing {filteredAdjustments.length === 0 ? 0 : indexOfFirstRow + 1}
            to {Math.min(indexOfLastRow, filteredAdjustments.length)}
            of {filteredAdjustments.length} entries
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

export default StockAdjustment;
