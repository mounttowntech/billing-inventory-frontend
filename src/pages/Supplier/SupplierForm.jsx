import { SaveButton, CancelButton } from "../../components/Common/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SupplierValidation from "../../validations/SupplierValidation";
import Input from "../../components/Common/Input";
import { useEffect } from "react";

const SupplierForm = ({ mode, supplier, onSubmit, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SupplierValidation),
  });

  useEffect(() => {
    if (supplier) {
      reset({
        supplierName: supplier.supplierName || "",
        contactPerson: supplier.contactPerson || "",
        phone: supplier.phone || "",
        email: supplier.email || "",
        gstNumber: supplier.gstNumber || "",
        address: supplier.address || "",
        city: supplier.city || "",
        state: supplier.state || "",
        pincode: supplier.pincode || "",
        openingBalance: supplier.openingBalance || "",
      });
    } else {
      reset();
    }
  }, [supplier, reset]);

  return (
    <form className="supplier-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-grid">
        <Input
          label="Supplier Name"
          name="supplierName"
          placeholder="Supplier Name"
          register={register}
          error={errors.supplierName?.message}
        />
        <Input
          label="Contact Person"
          name="contactPerson"
          placeholder="Contact Person"
          register={register}
          error={errors.contactPerson?.message}
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
      <div className="form-grid">
        <Input
          label="GST Number"
          name="gstNumber"
          placeholder="GST Number"
          register={register}
          error={errors.gstNumber?.message}
        />
        <Input
          label="Address"
          name="address"
          placeholder="Address"
          register={register}
          error={errors.address?.message}
        />
      </div>
      <div className="form-grid">
        <Input
          label="City"
          name="city"
          placeholder="City"
          register={register}
          error={errors.city?.message}
        />
        <Input
          label="State"
          name="state"
          placeholder="State"
          register={register}
          error={errors.state?.message}
        />
      </div>

      <div className="form-grid">
        <Input
          label="Pincode"
          name="pincode"
          placeholder="Pincode"
          register={register}
          error={errors.pincode?.message}
        />
        <Input
          label="Opening Balance"
          name="openingBalance"
          placeholder="Opening Balance"
          register={register}
          error={errors.openingBalance?.message}
        />
      </div>

      <div className="form-buttons">
        <CancelButton onClick={onClose}>Cancel</CancelButton>
        <SaveButton>{mode === "add" ? "Add " : "Update "}</SaveButton>
      </div>
    </form>
  );
};

export default SupplierForm;
