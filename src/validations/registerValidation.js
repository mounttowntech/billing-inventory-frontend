import * as yup from "yup";

export const registerValidation = yup.object({
  companyName: yup.string().required("Company name is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().optional(),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  businessType: yup.string().required("Business type is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});