import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import Input from "../../components/Common/Input";
import Select from "../../components/Common/Select";
import { storeValidation } from "../../validations/StoreValidation";
import { CancelButton, SaveButton } from "../../components/Common/Button";

const StoreForm = ({ mode, store, onSubmit, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(storeValidation),
  });

  useEffect(() => {
    if (store) {
      reset({
        storeCode: store.storeCode || "",
        storeName: store.storeName || "",
        gstNumber: store.gstNumber || "",
        phone: store.phone || "",
        email: store.email || "",

        addressLine: store.address?.addressLine || "",
        city: store.address?.city || "",
        state: store.address?.state || "",
        pincode: store.address?.pincode || "",

        status: store.status || "active",
      });
    } else {
      reset({
        storeCode: "",
        storeName: "",
        gstNumber: "",
        phone: "",
        email: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        status: "active",
      });
    }
  }, [store, reset]);

  return (
    <form className="store-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-grid">
        <Input
          label="Store Code"
          name="storeCode"
          placeholder="Enter Store Code"
          register={register}
          error={errors.storeCode?.message}
        />

        <Input
          label="Store Name"
          name="storeName"
          placeholder="Enter Store Name"
          register={register}
          error={errors.storeName?.message}
        />
      </div>
      <div className="form-grid">
        <Input
          label="GST Number"
          name="gstNumber"
          placeholder="Enter GST Number"
          register={register}
          error={errors.gstNumber?.message}
        />

        <Input
          label="Phone"
          name="phone"
          placeholder="Enter Phone Number"
          register={register}
          error={errors.phone?.message}
        />
      </div>
      <div className="form-grid">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter Email"
          register={register}
          error={errors.email?.message}
        />

        <Input
          label="Address"
          name="addressLine"
          placeholder="Enter Address"
          register={register}
          error={errors.addressLine?.message}
        />
      </div>
      <div className="form-grid">
        <Input
          label="City"
          name="city"
          placeholder="Enter City"
          register={register}
          error={errors.city?.message}
        />

        <Input
          label="State"
          name="state"
          placeholder="Enter State"
          register={register}
          error={errors.state?.message}
        />
      </div>
      <div className="form-grid">
        <Input
          label="Pincode"
          name="pincode"
          placeholder="Enter Pincode"
          register={register}
          error={errors.pincode?.message}
        />

        <Select
          label="Status"
          name="status"
          register={register}
          error={errors.status?.message}
          options={[
            { _id: "active", label: "Active" },
            { _id: "inactive", label: "Inactive" },
          ]}
        />
      </div>
      <div className="roles-form-buttons">
        <SaveButton type="submit">
          {mode === "edit" ? "Update " : "Add "}
        </SaveButton>

        <CancelButton
          type="button"
          onClick={() => {
            reset();
            onClose();
          }}
        >
          Cancel
        </CancelButton>
      </div>
    </form>
  );
};

export default StoreForm;
