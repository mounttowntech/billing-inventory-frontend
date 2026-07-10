import * as yup from "yup";

export const storeValidation = yup.object({
  storeCode: yup
    .string()
    .required("Store Code is required")
    .max(20, "Maximum 20 characters"),

  storeName: yup
    .string()
    .required("Store Name is required")
    .min(3, "Minimum 3 characters"),

  gstNumber: yup
    .string()
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GST Number",
    )
    .nullable(),

  phone: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Phone number must be 10 digits")
    .required("Phone Number is required"),

  email: yup.string().email("Invalid Email").required("Email is required"),

  addressLine: yup.string().required("Address is required"),

  city: yup.string().required("City is required"),

  state: yup.string().required("State is required"),

  pincode: yup
    .string()
    .matches(/^[1-9][0-9]{5}$/, "Invalid Pincode")
    .required("Pincode is required"),

  status: yup.string().required("Status is required"),
});
