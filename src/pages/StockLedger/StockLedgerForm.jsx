import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
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
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="form-grid">
        <Select
          label="Product"
          name="product"
          register={register}
          error={errors.product?.message}
          options={[
            { _id: "", label: "Select Product" },
            ...products.map((product) => ({
              _id: product._id,
              label: product.productName,
            })),
          ]}
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
        />

        <Input
          label="SKU Code"
          name="skuCode"
          type="text"
          placeholder="Enter SKU Code"
          register={register}
          error={errors.skuCode?.message}
        />
      </div>

      <div className="form-grid">
        <Select
          label="Movement Type"
          name="movementType"
          register={register}
          error={errors.movementType?.message}
          options={[
            { _id: "", label: "Select Movement" },
            { _id: "purchase", label: "Purchase" },
            { _id: "sale", label: "Sale" },
            { _id: "sales_return", label: "Sales Return" },
            { _id: "sale_cancel", label: "Sale Cancel" },
            { _id: "purchase_return", label: "Purchase Return" },
            { _id: "adjustment_in", label: "Adjustment In" },
            { _id: "adjustment_out", label: "Adjustment Out" },
          ]}
        />

        <Input
          label="Quantity"
          name="quantity"
          type="number"
          placeholder="Enter Quantity"
          register={register}
          error={errors.quantity?.message}
        />
      </div>

      <div className="form-grid">
        <Input
          label="Before Stock"
          name="beforeStock"
          type="number"
          placeholder="Enter Before Stock"
          register={register}
          error={errors.beforeStock?.message}
        />

        <Input
          label="After Stock"
          name="afterStock"
          type="number"
          placeholder="Enter After Stock"
          register={register}
          error={errors.afterStock?.message}
        />
      </div>

      <div className="form-grid">
        <Input
          label="Reference Number"
          name="referenceNumber"
          type="text"
          placeholder="Enter Reference Number"
          register={register}
          error={errors.referenceNumber?.message}
        />

        <Input
          label="Remarks"
          name="remarks"
          type="textarea"
          placeholder="Enter Remarks"
          register={register}
          error={errors.remarks?.message}
          rows={4}
        />
      </div>

      {/* Buttons */}
      <div className="form-buttons">
        <SaveButton type="submit">{editingId ? "Update " : "Save"}</SaveButton>

        <CancelButton type="button" onClick={handleCancel}>
          Cancel
        </CancelButton>
      </div>
    </form>
  );
};

export default StockLedgerForm;
