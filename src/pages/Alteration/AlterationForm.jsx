import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { alterationValidation } from "../../validations/AlterationValidation";
import { SaveButton, CancelButton } from "../../components/Common/Button";

const AlterationForm = ({
  alteration,
  editId,
  customers,
  invoices,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(alterationValidation),
    defaultValues: {
      customer: "",
      invoice: "",
      productName: "",
      alterationType: "",
      alterationCharge: 0,
      expectedDeliveryDate: "",
      status: "",
    },
  });

  const selectedCustomer = watch("customer");
  const filteredInvoices = invoices.filter(
    (invoice) => invoice.customer?._id === selectedCustomer,
  );

  // Populate form when editing, reset when adding
  useEffect(() => {
    if (alteration) {
      reset({
        customer: alteration.customer?._id || alteration.customer || "",
        invoice: alteration.invoice?._id || alteration.invoice || "",
        productName: alteration.productName || "",
        alterationType: alteration.alterationType || "",
        alterationCharge: alteration.alterationCharge || 0,
        expectedDeliveryDate: alteration.expectedDeliveryDate
          ? alteration.expectedDeliveryDate.substring(0, 10)
          : "",
        status: alteration.status || "",
      });
    } else {
      reset({
        customer: "",
        invoice: "",
        productName: "",
        alterationType: "",
        alterationCharge: 0,
        expectedDeliveryDate: "",
        status: "",
      });
    }
  }, [alteration, reset]);

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const submitHandler = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="alteration-form"
        onClick={(e) => e.stopPropagation()}
      >
        <select {...register("customer")}>
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer._id} value={customer._id}>
              {customer.customerName}
            </option>
          ))}
        </select>

        <select {...register("invoice")}>
          <option value="">Select Invoice</option>
          {filteredInvoices.map((invoice) => (
            <option key={invoice._id} value={invoice._id}>
              {invoice.invoiceNo}
            </option>
          ))}
        </select>

        <input placeholder="Product Name" {...register("productName")} />
        <p>{errors.productName?.message}</p>

        <input placeholder="Alteration Type" {...register("alterationType")} />
        <p>{errors.alterationType?.message}</p>

        <input
          type="number"
          placeholder="Charge"
          {...register("alterationCharge")}
        />
        <p>{errors.alterationCharge?.message}</p>

        <input type="date" {...register("expectedDeliveryDate")} />
        <p>{errors.expectedDeliveryDate?.message}</p>

        <select {...register("status")}>
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="delivered">Delivered</option>
        </select>
        <p>{errors.status?.message}</p>

        <div className="form-buttons">
          <SaveButton type="submit" />

          <CancelButton type="button" onClick={handleCancel}>
            Cancel
          </CancelButton>
        </div>
      </form>
    </div>
  );
};

export default AlterationForm;
