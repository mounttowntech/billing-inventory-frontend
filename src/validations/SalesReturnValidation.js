import * as yup from "yup";

export const salesReturnValidation = yup.object({
  invoice: yup.string().required("Invoice is required"),

  customer: yup.string().required("Customer is required"),

  returnDate: yup.date().required("Return Date is required"),

  refundAmount: yup
    .number()
    .typeError("Refund Amount must be a number")
    .min(0, "Refund Amount cannot be negative")
    .required("Refund Amount is required"),

  reason: yup
    .string()
    .required("Reason is required")
    .min(5, "Reason must be at least 5 characters")
    .max(300, "Reason cannot exceed 300 characters"),
});
