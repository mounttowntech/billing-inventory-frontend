import { invoiceValidation } from "../../validations/InvoiceValidation";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import { SaveButton, CancelButton } from "../../components/common/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

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
  onCancel,
}) => {
  const { reset, watch } = useForm({
    resolver: yupResolver(invoiceValidation),
  });

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-grid">
        <Select
          label="Customer"
          name="customer"
          register={register}
          error={errors.customer?.message}
          options={[
            ...customers.map((customer) => ({
              _id: customer._id,
              label: `${customer.customerCode} - ${customer.customerName}`,
            })),
          ]}
        />

        <Select
          label="Product"
          name="product"
          register={register}
          error={errors.product?.message}
          options={[
            ...products.map((product) => ({
              _id: product._id,
              label: product.productName,
            })),
          ]}
        />
      </div>

      <div className="form-grid">
        <Select
          label="SKU Code"
          name="skuCode"
          register={register}
          error={errors.skuCode?.message}
          options={[
            ...(selectedProduct?.variants?.map((variant) => ({
              _id: variant.skuCode,
              label: variant.skuCode,
            })) || []),
          ]}
        />

        <Input
          label="Quantity"
          name="quantity"
          type="number"
          placeholder="Quantity"
          register={register}
          error={errors.quantity?.message}
        />
      </div>
      <div className="form-grid">
        <Input
          label="Discount Amount"
          name="discountAmount"
          type="number"
          placeholder="Discount"
          register={register}
          error={errors.discountAmount?.message}
        />
        <Input
          label="Paid Amount"
          name="paidAmount"
          type="number"
          placeholder="Paid Amount"
          register={register}
          error={errors.paidAmount?.message}
        />
      </div>
      <div className="form-grid">
        <Select
          label="Payment Method"
          name="paymentMethod"
          register={register}
          error={errors.paymentMethod?.message}
          options={[
            { _id: "cash", label: "Cash" },
            { _id: "upi", label: "UPI" },
            { _id: "card", label: "Card" },
            { _id: "wallet", label: "Wallet" },
            { _id: "credit", label: "Credit" },
          ]}
        />

        <Input
          label="Remarks"
          name="remarks"
          type="text"
          placeholder="Remarks"
          register={register}
          error={errors.remarks?.message}
        />
      </div>

      <div className="form-footer">
        <SaveButton>{editingId === "add" ? "Add " : "Update "}</SaveButton>

        <CancelButton type="button" onClick={handleCancel}>
          Cancel
        </CancelButton>
      </div>
    </form>
  );
};

export default InvoiceForm;
