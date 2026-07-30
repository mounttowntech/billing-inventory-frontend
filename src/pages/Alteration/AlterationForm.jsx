import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { alterationValidation } from "../../validations/AlterationValidation";
import { SaveButton, CancelButton } from "../../components/Common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";

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

  const statusOptions = [
    { _id: "pending", label: "Pending" },
    { _id: "in_progress", label: "In Progress" },
    { _id: "completed", label: "Completed" },
    { _id: "delivered", label: "Delivered" },
  ];

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
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="form-grid">
        <Select
          label="Customer"
          name="customer"
          register={register}
          error={errors.customer?.message}
          options={[
            ...customers.map((customer) => ({
              _id: customer._id,
              label: customer.customerName,
            })),
          ]}
        />
        <Select
          label="Invoice"
          name="invoice"
          register={register}
          error={errors.invoice?.message}
          options={[
            ...filteredInvoices.map((invoice) => ({
              _id: invoice._id,
              label: invoice.invoiceNo,
            })),
          ]}
        />
      </div>
      <div className="form-grid">
        <Input
          label="Product Name"
          name="productName"
          placeholder="Enter Product Name"
          register={register}
          error={errors.productName?.message}
        />

        <Input
          label="Alteration Type"
          name="alterationType"
          type="text"
          placeholder="Enter Alteration Type"
          register={register}
          error={errors.alterationType?.message}
        />
      </div>
      <div className="form-grid">
        <Input
          label="Alteration Charge"
          name="alterationCharge"
          type="number"
          placeholder="Enter Charge"
          register={register}
          error={errors.alterationCharge?.message}
        />

        <Input
          label="Expected Delivery Date"
          name="expectedDeliveryDate"
          type="date"
          register={register}
          error={errors.expectedDeliveryDate?.message}
        />
      </div>
      <Select
        label="Status"
        name="status"
        register={register}
        error={errors.status?.message}
        options={statusOptions}
      />

      <div className="form-buttons">
        <SaveButton>
          {editId ? "Update Alteration" : "Save Alteration"}
        </SaveButton>
        <CancelButton type="button" onClick={handleCancel}>
          Cancel
        </CancelButton>
      </div>
    </form>
  );
};

export default AlterationForm;
