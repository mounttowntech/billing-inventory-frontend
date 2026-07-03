import * as yup from "yup";

export const brandValidation = yup.object({
  brandCode: yup
    .string()
    .trim()
    .required("Brand Code is required")
    .min(2, "Brand Code must be at least 2 characters")
    .max(20, "Brand Code must not exceed 20 characters"),

  brandName: yup
    .string()
    .trim()
    .required("Brand Name is required")
    .min(2, "Brand Name must be at least 2 characters")
    .max(50, "Brand Name must not exceed 50 characters"),

  logo: yup
    .string()
    .trim()
    .url("Enter a valid Logo URL")
    .nullable()
    .transform((value) => (value === "" ? null : value)),

  description: yup
    .string()
    .trim()
    .max(200, "Description must not exceed 200 characters")
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});
