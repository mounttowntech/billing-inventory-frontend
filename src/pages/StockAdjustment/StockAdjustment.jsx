import { useEffect, useMemo, useState } from "react";
import "./StockAdjustment.css";

import { useDispatch, useSelector } from "react-redux";

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

import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
} from "../../components/Common/Button";

const StockAdjustment = () => {
  const dispatch = useDispatch();

  // ================= Redux =================

  const { stockAdjustments, isLoading } = useSelector(
    (state) => state.stockAdjustment,
  );

  const { products } = useSelector((state) => state.product);

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
  console.log("those products are the ", products);
  // ================= States =================

  const [showForm, setShowForm] = useState(false);

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 2;

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

  // ================= Search Handler =================

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // ================= Render =================

  return (
    <div className="stock-adjustment-page">
      <h2>Stock Adjustments</h2>
      <div className="stock-adjustment-header">
        <div className="stock-adjustment-header-actions">
          <input
            type="text"
            className="search-box"
            placeholder="Search by product, SKU, type or reason..."
            value={search}
            style={{ width: "300px", padding: "8px", borderRadius: "4px" }}
            onChange={handleSearchChange}
          />
        </div>
        <AddButton onClick={handleAdd} label="Add Adjustment">
          <span className="add-icon">+</span> Add Adjustment
        </AddButton>
      </div>

      {showForm && (
        <div className="stock-adjustment-form-wrapper">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="stock-adjustment-form"
          >
            <h3>{editId ? "Edit Stock Adjustment" : "New Stock Adjustment"}</h3>

            <div className="form-row">
              {/* Product */}
              <div className="form-group">
                <label htmlFor="product">Product</label>
                <select {...register("product")}>
                  <option value="">Select Product</option>

                  {products?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.productName}
                    </option>
                  ))}
                </select>
                {errors.product && (
                  <span className="error-text">{errors.product.message}</span>
                )}
              </div>

              {/* SKU Code */}
              <div className="form-group">
                <label htmlFor="skuCode">SKU Code</label>
                <select
                  id="skuCode"
                  {...register("skuCode")}
                  disabled={!selectedProduct}
                >
                  <option value=""> Select SKU </option>
                  {variants.map((variant) => (
                    <option key={variant.skuCode} value={variant.skuCode}>
                      {variant.skuCode}
                    </option>
                  ))}
                </select>
                {errors.skuCode && (
                  <span className="error-text">{errors.skuCode.message}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              {/* Adjustment Type */}
              <div className="form-group">
                <label htmlFor="adjustmentType">Adjustment Type</label>
                <select id="adjustmentType" {...register("adjustmentType")}>
                  <option value="increase">Increase</option>
                  <option value="decrease">Decrease</option>
                </select>
                {errors.adjustmentType && (
                  <span className="error-text">
                    {errors.adjustmentType.message}
                  </span>
                )}
              </div>

              {/* Quantity */}
              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  {...register("quantity")}
                />
                {errors.quantity && (
                  <span className="error-text">{errors.quantity.message}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              {/* Reason */}
              <div className="form-group full-width">
                <label htmlFor="reason">Reason</label>
                <input id="reason" type="text" {...register("reason")} />
                {errors.reason && (
                  <span className="error-text">{errors.reason.message}</span>
                )}
              </div>
            </div>

            <div className="form-actions">
              <SaveButton
                type="submit"
                label={editId ? "Update" : "Save"}
                disabled={isLoading}
              />
              <CancelButton type="button" onClick={handleCancel} />
            </div>
          </form>
        </div>
      )}

      <div className="stock-adjustment-table-wrapper">
        <table className="stock-adjustment-table">
          <thead>
            <tr>
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

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                className={page === currentPage ? "active" : ""}
                onClick={() => paginate(page)}
              >
                {page}
              </button>
            ),
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StockAdjustment;
