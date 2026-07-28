import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { customerAddressValidation } from "../../validations/CustomerAddressValidation";
import { SaveButton, CancelButton } from "../../components/Common/Button";

const CustomerAddressForm = ({
  address,
  editId,
  customers,
  onSubmit,
  onCancel,
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
    onCancel();
  };

  const submitHandler = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div
        className="customeraddress-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{editId ? "Update Customer Address" : "Add Customer Address"}</h3>

          <button className="close-btn" onClick={handleCancel}>
            ×
          </button>
        </div>

        <form
          className="customeraddress-form"
          onSubmit={handleSubmit(submitHandler)}
        >
          {/* Customer */}
          <div className="form-group">
            <label>Customer</label>

            <select {...register("customer")}>
              <option value="">Select Customer</option>

              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.customerName}
                </option>
              ))}
            </select>

            <p>{errors.customer?.message}</p>
          </div>

          {/* Label */}
          <div className="form-group">
            <label>Label</label>

            <select {...register("label")}>
              <option value="">Select Label</option>
              <option value="home">Home</option>
              <option value="office">Office</option>
              <option value="billing">Billing</option>
              <option value="shipping">Shipping</option>
            </select>

            <p>{errors.label?.message}</p>
          </div>

          {/* Address Line 1 */}
          <div className="form-group">
            <label>Address Line 1</label>

            <input
              type="text"
              placeholder="Enter Address Line 1"
              {...register("addressLine1")}
            />

            <p>{errors.addressLine1?.message}</p>
          </div>

          {/* Address Line 2 */}
          <div className="form-group">
            <label>Address Line 2</label>

            <input
              type="text"
              placeholder="Enter Address Line 2"
              {...register("addressLine2")}
            />

            <p>{errors.addressLine2?.message}</p>
          </div>

          {/* City */}
          <div className="form-group">
            <label>City</label>

            <input type="text" placeholder="Enter City" {...register("city")} />

            <p>{errors.city?.message}</p>
          </div>

          {/* State */}
          <div className="form-group">
            <label>State</label>

            <input
              type="text"
              placeholder="Enter State"
              {...register("state")}
            />

            <p>{errors.state?.message}</p>
          </div>

          {/* Pincode */}
          <div className="form-group">
            <label>Pincode</label>

            <input
              type="text"
              placeholder="Enter Pincode"
              {...register("pincode")}
            />

            <p>{errors.pincode?.message}</p>
          </div>

          {/* Default Address */}
          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" {...register("isDefault")} />
              &nbsp;Set as Default Address
            </label>
          </div>

          <div className="form-buttons">
            <SaveButton type="submit">
              {editId ? "Update Address" : "Save Address"}
            </SaveButton>

            <CancelButton type="button" onClick={handleCancel}>
              Cancel
            </CancelButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerAddressForm;
