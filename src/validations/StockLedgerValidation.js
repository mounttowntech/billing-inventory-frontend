import * as yup from "yup";

export const stockLedgerValidation = yup.object({
  product: yup.string().required("Product is required"),

  skuCode: yup
    .string()
    .required("SKU Code is required")
    .min(2, "SKU Code must be at least 2 characters"),

  movementType: yup.string().required("Movement Type is required"),

  quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .required("Quantity is required")
    .min(1, "Quantity must be at least 1"),

  beforeStock: yup
    .number()
    .typeError("Before Stock must be a number")
    .required("Before Stock is required")
    .min(0, "Before Stock cannot be negative"),

  afterStock: yup
    .number()
    .typeError("After Stock must be a number")
    .required("After Stock is required")
    .min(0, "After Stock cannot be negative"),

  referenceNumber: yup.string().nullable(),

  remarks: yup
    .string()
    .max(250, "Remarks cannot exceed 250 characters")
    .nullable(),
});
