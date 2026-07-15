import * as yup from "yup";

export const stockAdjustmentValidation = yup.object({
  product: yup.string().required("Product is required"),

  skuCode: yup.string().required("SKU Code is required"),

  adjustmentType: yup
    .string()
    .required("Adjustment Type is required")
    .oneOf(["increase", "decrease"]),

  quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .required("Quantity is required")
    .positive("Quantity must be greater than 0")
    .integer("Quantity must be a whole number"),

  reason: yup
    .string()
    .required("Reason is required")
    .min(3, "Minimum 3 characters")
    .max(200, "Maximum 200 characters"),
});
