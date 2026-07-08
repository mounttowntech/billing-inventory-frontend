import * as yup from "yup";

const SupplierValidation = yup.object({
  supplierName: yup.string().required("Supplier Name is required"),

  contactPerson: yup.string().required("Contact Person is required"),

  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone Number is required"),

  email: yup.string().email("Invalid Email").required("Email is required"),

  gstNumber: yup.string().required("GST Number is required"),

  address: yup.string().required("Address is required"),

  city: yup.string().required("City is required"),

  state: yup.string().required("State is required"),

  pincode: yup
    .string()
    .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
    .required("Pincode is required"),

  openingBalance: yup
    .number()
    .typeError("Opening Balance must be a number")
    .required("Opening Balance is required"),
});

export default SupplierValidation;
