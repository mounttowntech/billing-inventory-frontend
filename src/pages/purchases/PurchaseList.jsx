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
import { AddButton, SaveButton } from "../../components/Common/Button";

const Purchase = () => {
  const dispatch = useDispatch();

  const { purchases, loading } = useSelector((state) => state.purchase);
  const [showModal, setShowModal] = useState(false);
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

    const result = await dispatch(createPurchase(purchaseData));

    console.log("Result:", result);

    if (!result.error) {
      reset();
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
              <th>Supplier Code</th>
              <th>Supplier Name</th>
              <th>Date</th>
              <th>Sub Total</th>
              <th>GST</th>
              <th>Grand Total</th>
              <th>Paid</th>
              <th>Due</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase._id}>
                <td>{purchase.purchaseNo}</td>
                <td>{purchase.supplier?.supplierCode}</td>
                <td>{purchase.supplier?.supplierName}</td>
                <td>{purchase.purchaseDate?.split("T")[0]}</td>
                <td>₹{purchase.subTotal}</td>
                <td>₹{purchase.gstAmount}</td>
                <td>₹{purchase.grandTotal}</td>
                <td>₹{purchase.paidAmount}</td>
                <td>₹{purchase.dueAmount}</td>
                <td>{purchase.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Purchase;
