import { CancelButton, SaveButton } from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { customerValidation } from "../../validations/customerValidation";
import { useEffect } from "react";

const CustomerForm = ({ mode, customer, onSubmit, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(customerValidation(mode)),
  });

  useEffect(() => {
    if (customer) {
      reset({
        customerCode: customer.customerCode || "",
        customerName: customer.customerName || "",
        phone: customer.phone || "",
        email: customer.email || "",
      });
    } else {
      reset({
        customerCode: "",
        customerName: "",
        phone: "",
        email: "",
      });
    }
  }, [customer, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-grid">
        <Input
          label="Customer Code"
          name="customerCode"
          placeholder="Customer Code"
          register={register}
          error={errors.customerCode?.message}
        />
        <Input
          label="Customer Name"
          name="customerName"
          placeholder="Customer Name"
          register={register}
          error={errors.customerName?.message}
        />
      </div>
      <div className="form-grid">
        <Input
          label="Phone"
          name="phone"
          placeholder="Phone"
          register={register}
          error={errors.phone?.message}
        />
        <Input
          label="Email"
          name="email"
          placeholder="Email"
          register={register}
          error={errors.email?.message}
        />
      </div>
      <div className="form-footer">
        <SaveButton>
          {mode === "add" ? "Add Customer" : "Update Customer"}
        </SaveButton>

        <CancelButton type="button" onClick={onClose}>
          Cancel
        </CancelButton>
      </div>
    </form>
  );
};

export default CustomerForm;
