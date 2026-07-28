import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PurchaseValidation from "../../validations/PurchaseValidation";
import { SaveButton } from "../../components/Common/Button";

const PurchaseForm = ({
  purchase,
  editId,
  suppliers,
  products,
  onSubmit,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(PurchaseValidation),
    defaultValues: {
      supplier: "",
      product: "",
      skuCode: "",
      quantity: "",
      purchasePrice: "",
      gstAmount: "",
      totalAmount: "",
      paidAmount: "",
    },
  });

  const selectedProductId = watch("product");
  const selectedProduct = products.find(
    (product) => product._id === selectedProductId,
  );

  // Populate form when editing, reset when adding
  useEffect(() => {
    if (purchase) {
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
    } else {
      reset({
        supplier: "",
        product: "",
        skuCode: "",
        quantity: "",
        purchasePrice: "",
        gstAmount: "",
        totalAmount: "",
        paidAmount: "",
      });
    }
  }, [purchase, reset]);

  const submitHandler = async (data) => {
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

    const success = await onSubmit(purchaseData);

    if (success) {
      reset();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Purchase</h3>

          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="purchase-form">
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
  );
};

export default PurchaseForm;
