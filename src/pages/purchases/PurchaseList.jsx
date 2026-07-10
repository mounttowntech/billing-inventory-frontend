import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PurchaseValidation from "../../validations/PurchaseValidation";
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
  SaveButton,
  PreviousButton,
  NextButton,
  EditButton,
  DeleteButton,
} from "../../components/Common/Button";

const Purchase = () => {
  const dispatch = useDispatch();

  const { purchases, loading } = useSelector((state) => state.purchase);
  const [editingId, setEditingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPurchases = purchases.slice(indexOfFirst, indexOfLast);
  const totalPages =
    purchases.length > 0 ? Math.ceil(purchases.length / itemsPerPage) : 1;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(PurchaseValidation),
  });
  const { suppliers } = useSelector((state) => state.supplier);
  const { products } = useSelector((state) => state.product);
  useEffect(() => {
    dispatch(getPurchases());
  }, [dispatch]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleEdit = (purchase) => {
    setEditingId(purchase._id);

    reset({
      supplier: purchase.supplier?._id || "",
      product: purchase.items?.[0]?.product || "",
      skuCode: purchase.items?.[0]?.skuCode || "",
      quantity: purchase.items?.[0]?.quantity || "",
      purchasePrice: purchase.items?.[0]?.purchasePrice || "",
      gstAmount: purchase.items?.[0]?.gstAmount || "",
      totalAmount: purchase.items?.[0]?.totalAmount || "",
      paidAmount: purchase.paidAmount || "",
    });

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
  const onSubmit = async (data) => {
    console.log("onSubmit called");
    console.log("Form Data:", data);

    const purchaseData = {
      supplier: data.supplier,
      paidAmount: Number(data.paidAmount),
      items: [
        {
          product: data.product,
          skuCode: data.skuCode,
          quantity: Number(data.quantity),
          purchasePrice: Number(data.purchasePrice),
          gstAmount: Number(data.gstAmount),
          totalAmount: Number(data.totalAmount),
        },
      ],
    };

    console.log("Sending:", purchaseData);

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

    console.log("Result:", result);

    if (!result.error) {
      reset();
      setEditingId(null);
      setShowModal(false);
      dispatch(getPurchases());
    }
  };

  const selectedProductId = watch("product");
  const selectedProduct = products.find(
    (product) => product._id === selectedProductId,
  );
  useEffect(() => {
    dispatch(getPurchases());
    dispatch(getSuppliers());
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <div className="purchase-container">
      <div className="purchase-header">
        <h2>Purchase Management</h2>

        <AddButton className="add-btn" onClick={() => setShowModal(true)}>
          + Add Purchase
        </AddButton>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Purchase</h3>

              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="purchase-form">
              <div className="form-group">
                <label>Supplier</label>
                <select {...register("supplier")}>
                  <option value="">Select Supplier</option>

                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.supplierCode} - {supplier.supplierName}
                    </option>
                  ))}
                </select>
                <span>{errors.supplier?.message}</span>
              </div>

              <div className="form-group">
                <label>Product</label>
                <select {...register("product")}>
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.productName}
                    </option>
                  ))}
                </select>
                <span>{errors.product?.message}</span>
              </div>

              <div className="form-group">
                <label>SKU Code</label>
                <select {...register("skuCode")}>
                  <option value="">Select SKU Code</option>
                  {selectedProduct?.variants?.map((variant) => (
                    <option key={variant.skuCode} value={variant.skuCode}>
                      {variant.skuCode}
                    </option>
                  ))}
                </select>
                <span>{errors.skuCode?.message}</span>
              </div>

              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  placeholder="Quantity"
                  {...register("quantity")}
                />
                <span>{errors.quantity?.message}</span>
              </div>

              <div className="form-group">
                <label>Purchase Price</label>
                <input
                  type="number"
                  placeholder="Purchase Price"
                  {...register("purchasePrice")}
                />
                <span>{errors.purchasePrice?.message}</span>
              </div>

              <div className="form-group">
                <label>GST Amount</label>
                <input
                  type="number"
                  placeholder="GST Amount"
                  {...register("gstAmount")}
                />
                <span>{errors.gstAmount?.message}</span>
              </div>

              <div className="form-group">
                <label>Paid Amount</label>
                <input
                  type="number"
                  placeholder="Paid Amount"
                  {...register("paidAmount")}
                />
                <span>{errors.paidAmount?.message}</span>
              </div>

              <div className="form-group">
                <label>Total Amount</label>
                <input type="number" {...register("totalAmount")} />
                <span>{errors.totalAmount?.message}</span>
              </div>

              <SaveButton className="save-btn" type="submit">
                Save Purchase
              </SaveButton>
            </form>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="purchase-table">
          <thead>
            <tr>
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

                    <DeleteButton onClick={() => handleDelete(purchase._id)} />
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

      <div className="pagination">
        <PreviousButton
          className="btn btn-page"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </PreviousButton>

        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>

        <NextButton
          className="btn btn-page"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </NextButton>
      </div>
    </div>
  );
};

export default Purchase;
