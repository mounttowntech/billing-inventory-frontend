import { SaveButton, CancelButton } from "../../components/Common/Button";

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
    <div className="stock-adjustment-form-wrapper">
      <form onSubmit={handleSubmit(onSubmit)} className="stock-adjustment-form">
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
  );
};

export default StockAdjustmentForm;
