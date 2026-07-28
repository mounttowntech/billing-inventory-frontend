import { SaveButton } from "../../components/Common/Button";

/**
 * Modal form for creating / editing an Invoice.
 * All state (react-hook-form, customers, products, etc.) is owned by the
 * parent <Invoice /> component and passed down as props.
 */
const InvoiceForm = ({
  showModal,
  setShowModal,
  customers,
  products,
  selectedProduct,
  register,
  handleSubmit,
  onSubmit,
  errors,
  editingId,
}) => {
  if (!showModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingId ? "Edit Invoice" : "Add Invoice"}</h3>

          <button className="close-btn" onClick={() => setShowModal(false)}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="purchase-form">
          <div className="form-group">
            <label>Customer</label>

            <select {...register("customer")}>
              <option value="">Select Customer</option>

              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.customerCode} - {customer.customerName}
                </option>
              ))}
            </select>

            <span>{errors.customer?.message}</span>
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
              <option value="">Select SKU</option>

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
            <label>Discount Amount</label>

            <input
              type="number"
              placeholder="Discount"
              defaultValue={0}
              {...register("discountAmount")}
            />

            <span>{errors.discountAmount?.message}</span>
          </div>

          <div className="form-group">
            <label>Paid Amount</label>

            <input
              type="number"
              placeholder="Paid Amount"
              defaultValue={0}
              {...register("paidAmount")}
            />

            <span>{errors.paidAmount?.message}</span>
          </div>

          <div className="form-group">
            <label>Payment Method</label>

            <select {...register("paymentMethod")}>
              <option value="">Select Payment Method</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="wallet">Wallet</option>
              <option value="credit">Credit</option>
            </select>

            <span>{errors.paymentMethod?.message}</span>
          </div>

          <div className="form-group">
            <label>Remarks</label>

            <textarea rows="3" placeholder="Remarks" {...register("remarks")} />
          </div>

          <SaveButton type="submit">
            {editingId ? "Update Invoice" : "Save Invoice"}
          </SaveButton>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;
