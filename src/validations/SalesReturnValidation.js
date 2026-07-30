import * as yup from "yup";

export const salesReturnValidation = (mode) => yup.object({
  product: yup.string().required("Product is required"),

  skuCode: yup.string().required("SKU Code is required"),

  quantity: yup.number().required("Quantity is required"),

  returnAmount: yup
    .number()
    .typeError("Return Amount must be a number")
    .min(0, "Return Amount cannot be negative")
    .required("Return Amount is required"),

  reason: yup
    .string()
    .required("Reason is required")
    .min(5, "Reason must be at least 5 characters")
    .max(300, "Reason cannot exceed 300 characters"),
});
