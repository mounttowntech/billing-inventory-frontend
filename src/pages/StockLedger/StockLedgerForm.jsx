import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";

import { stockLedgerValidation } from "../../validations/StockLedgerValidation";

import { SaveButton, CancelButton } from "../../components/Common/Button";

const StockLedgerForm = ({
  products = [],
  editingId,
  editingItem,
  onSubmit,
  onCancel,
}) => {
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

  // ================= Populate / Reset on open =================

  useEffect(() => {
    if (editingItem) {
      reset({
        product: editingItem.product?._id || "",
        skuCode: editingItem.skuCode || "",
        movementType: editingItem.movementType || "",
        quantity: editingItem.quantity || "",
        beforeStock: editingItem.beforeStock || "",
        afterStock: editingItem.afterStock || "",
        referenceNumber: editingItem.referenceNumber || "",
        remarks: editingItem.remarks || "",
      });
    } else {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingItem]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <form
      className="stockledger-form"
      onSubmit={handleSubmit(handleFormSubmit)}
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
          <option value="purchase">Purchase</option>
          <option value="sale">Sale</option>
          <option value="sales_return">Sales Return</option>
          <option value="sale_cancel">Sale Cancel</option>
          <option value="purchase_return">Purchase Return</option>
          <option value="adjustment_in">Adjustment In</option>
          <option value="adjustment_out">Adjustment Out</option>
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

        <CancelButton type="button" onClick={handleCancel}>
          Cancel
        </CancelButton>
      </div>
    </form>
  );
};

export default StockLedgerForm;
