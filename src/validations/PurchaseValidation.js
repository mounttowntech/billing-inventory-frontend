import * as yup from "yup";

const PurchaseValidation = yup.object({
  supplier: yup.string().required("Supplier is required"),

  product: yup.string().required("Product is required"),

  skuCode: yup.string().required("SKU Code is required"),

  quantity: yup
    .number()
    .typeError("Quantity is required")
    .positive("Quantity must be greater than 0")
    .required("Quantity is required"),

  purchasePrice: yup
    .number()
    .typeError("Purchase Price is required")
    .min(0)
    .required("Purchase Price is required"),

  gstAmount: yup
    .number()
    .typeError("GST Amount is required")
    .min(0)
    .required("GST Amount is required"),

  totalAmount: yup
    .number()
    .typeError("Total Amount is required")
    .min(0)
    .required("Total Amount is required"),

  paidAmount: yup
    .number()
    .typeError("Paid Amount is required")
    .min(0)
    .required("Paid Amount is required"),
});

export default PurchaseValidation;
