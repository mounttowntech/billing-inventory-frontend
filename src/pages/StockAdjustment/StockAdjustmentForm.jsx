import { SaveButton, CancelButton } from "../../components/Common/Button";
import { invoiceValidation } from "../../validations/InvoiceValidation";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";

/**
 * Form for creating / editing a Stock Adjustment.
 * All state (react-hook-form, products, variants, etc.) is owned by the
 * parent <StockAdjustment /> component and passed down as props.
 */
const StockAdjustmentForm = ({
  showForm,
  products,
  variants,
  selectedProduct,
  register,
  handleSubmit,
  onSubmit,
  errors,
  editId,
  isLoading,
  handleCancel,
}) => {
  if (!showForm) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-grid">
        <Select
          label="Product"
          name="product"
          register={register}
          error={errors.product?.message}
          options={[
            { _id: "", label: "Select Product" },
            ...(products?.map((item) => ({
              _id: item._id,
              label: item.productName,
            })) || []),
          ]}
        />

        <Select
          label="SKU Code"
          name="skuCode"
          register={register}
          error={errors.skuCode?.message}
          disabled={!selectedProduct}
          options={[
            { _id: "", label: "Select SKU" },
            ...variants.map((variant) => ({
              _id: variant.skuCode,
              label: variant.skuCode,
            })),
          ]}
        />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <Select
            label="Adjustment Type"
            name="adjustmentType"
            register={register}
            error={errors.adjustmentType?.message}
            options={[
              { _id: "increase", label: "Increase" },
              { _id: "decrease", label: "Decrease" },
            ]}
          />
        </div>

        {/* Quantity */}
        <Input
          label="Quantity"
          name="quantity"
          type="number"
          placeholder="Enter Quantity"
          register={register}
          error={errors.quantity?.message}
          min={1}
        />
      </div>

      <div className="form-grid">
        <Input
          label="Reason"
          name="reason"
          type="text"
          placeholder="Enter Reason"
          register={register}
          error={errors.reason?.message}
        />
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
  );
};

export default StockAdjustmentForm;
