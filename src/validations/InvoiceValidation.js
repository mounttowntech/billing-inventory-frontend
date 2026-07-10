import * as yup from "yup";

export const invoiceValidation = yup.object({
  customer: yup.string().required("Customer is required"),

  product: yup.string().required("Product is required"),

  skuCode: yup.string().required("SKU Code is required"),

  quantity: yup
    .number()
    .typeError("Quantity is required")
    .positive("Quantity must be greater than 0")
    .required("Quantity is required"),

  paidAmount: yup
    .number()
    .typeError("Paid Amount must be a number")
    .min(0, "Paid Amount cannot be negative")
    .required("Paid Amount is required"),

  discountAmount: yup
    .number()
    .typeError("Discount Amount must be a number")
    .min(0, "Discount Amount cannot be negative"),

  paymentMethod: yup.string().required("Payment Method is required"),

  remarks: yup.string().max(250),
});
