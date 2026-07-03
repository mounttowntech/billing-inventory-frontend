import * as yup from "yup";

export const categoryValidation = yup.object({
  categoryName: yup
    .string()
    .required("Category Name is required")
    .min(3, "Minimum 3 characters"),
});
