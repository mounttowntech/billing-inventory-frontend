import * as yup from "yup";

export const unitValidation = yup.object({
  name: yup
    .string()
    .required("Unit Name is required")
    .max(50, "Maximum 50 characters"),

  shortName: yup
    .string()
    .required("Short Name is required")
    .max(10, "Maximum 10 characters"),

  allowDecimal: yup
    .boolean()
    .required("Please select whether decimal values are allowed"),

  description: yup.string().max(200, "Maximum 200 characters"),
});
