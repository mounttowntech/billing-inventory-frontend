import * as yup from "yup";

export const paymentValidation = (mode) => yup.object({

  type: yup
    .string()
    .oneOf(["sale", "purchase", "refund"])
    .required("Payment type is required"),

  customer: yup
    .string()
    .nullable()
    .when("type", {
      is: (type) => type === "sale" || type === "refund",
      then: (schema) => schema.required("Customer is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  supplier: yup
    .string()
    .nullable()
    .when("type", {
      is: "purchase",
      then: (schema) => schema.required("Supplier is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  invoice: yup
    .string()
    .nullable()
    .when("type", {
      is: (type) => type === "sale" || type === "refund",
      then: (schema) => schema.required("Invoice is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  purchase: yup
    .string()
    .nullable()
    .when("type", {
      is: "purchase",
      then: (schema) => schema.required("Purchase is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),

  paymentMethod: yup
    .string()
    .oneOf([
      "cash",
      "upi",
      "card",
      "wallet",
      "net_banking",
      "cheque",
    ])
    .required("Payment method is required"),

  paymentDate: yup
    .date()
    .required("Payment date is required"),

  remarks: yup
    .string()
    .max(500, "Maximum 500 characters"),

  paymentStatus: yup
    .string()
    .oneOf([
      "pending",
      "completed",
      "failed",
    ])
    .required("Payment status is required"),
});