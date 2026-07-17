import * as yup from "yup";

export const customerAddressValidation = yup.object({
  customer: yup.string().required("Customer is required"),

  label: yup
    .string()
    .oneOf(["home", "office", "billing", "shipping"])
    .required("Label is required"),

  addressLine1: yup.string().required("Address Line 1 is required"),

  addressLine2: yup.string().nullable(),

  city: yup.string().required("City is required"),

  state: yup.string().required("State is required"),

  pincode: yup
    .string()
    .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
    .required("Pincode is required"),

  isDefault: yup.boolean(),
});
