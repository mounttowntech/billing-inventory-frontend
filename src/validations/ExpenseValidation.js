import * as yup from "yup";

export const expenseValidation = yup.object({
  expenseNo: yup
    .string()
    .required("Expense No is required")
    .min(3, "Minimum 3 characters"),

  category: yup
    .string()
    .required("Category is required")
    .oneOf(
      [
        "rent",
        "salary",
        "electricity",
        "marketing",
        "transport",
        "miscellaneous",
      ],
      "Invalid Category",
    ),

  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),

  expenseDate: yup
    .date()
    .typeError("Expense Date is required")
    .required("Expense Date is required"),

  note: yup.string().max(250, "Maximum 250 characters"),
});
