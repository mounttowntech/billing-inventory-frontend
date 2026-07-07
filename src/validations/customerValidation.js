import * as yup from "yup";

const CustomerValidation = yup.object({
  customerCode: yup.string().required("Customer Code is required"),

  customerName: yup.string().required("Customer Name is required"),

  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),

  email: yup.string().email("Invalid Email").required("Email is required"),
});

export default CustomerValidation;
