import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { customerAddressValidation } from "../../validations/CustomerAddressValidation";
import { SaveButton, CancelButton } from "../../components/Common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";

const CustomerAddressForm = ({
  mode,
  address,
  customers,
  onSubmit,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(customerAddressValidation),
    defaultValues: {
      customer: "",
      label: "home",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    },
  });

  // Populate form when editing, reset when adding
  useEffect(() => {
    if (address) {
      reset({
        customer: address.customer?._id || "",
        label: address.label || "home",
        addressLine1: address.addressLine1 || "",
        addressLine2: address.addressLine2 || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
        isDefault: address.isDefault || false,
      });
    } else {
      reset({
        customer: "",
        label: "home",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
    }
  }, [address, reset]);

  const handleCancel = () => {
    reset();
    onClose();
  };

  const submitHandler = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <form
      className="customeraddress-form"
      onSubmit={handleSubmit(submitHandler)}
    >
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
          label="Label"
          name="label"
          register={register}
          error={errors.label?.message}
          options={[
            { _id: "home", label: "Home" },
            { _id: "office", label: "Office" },
            { _id: "billing", label: "Billing" },
            { _id: "shipping", label: "Shipping" },
          ]}
        />
      </div>

      <div className="form-grid">
        <Input
          label="Address Line 1"
          name="addressLine1"
          type="text"
          placeholder="Enter Address Line 1"
          register={register}
          error={errors.addressLine1?.message}
        />

        <Input
          label="Address Line 2"
          name="addressLine2"
          type="text"
          placeholder="Enter Address Line 2"
          register={register}
          error={errors.addressLine2?.message}
        />
      </div>

      <div className="form-grid">
        <Input
          label="City"
          name="city"
          type="text"
          placeholder="Enter City"
          register={register}
          error={errors.city?.message}
        />

        <Input
          label="State"
          name="state"
          type="text"
          placeholder="Enter State"
          register={register}
          error={errors.state?.message}
        />
      </div>

      <div className="form-grid">
        <Input
          label="Pincode"
          name="pincode"
          type="text"
          placeholder="Enter Pincode"
          register={register}
          error={errors.pincode?.message}
        />

        <Input
          label="Default Address"
          name="isDefault"
          type="checkbox"
          register={register}
          error={errors.isDefault?.message}
        />
      </div>

      <div className="form-buttons">
        <SaveButton type="submit">
          {mode === "edit" ? "Update " : "Save "}
        </SaveButton>

        <CancelButton type="button" onClick={handleCancel}>
          Cancel
        </CancelButton>
      </div>
    </form>
  );
};

export default CustomerAddressForm;
