import * as yup from "yup";

export const colorValidation = yup.object({
  colorCode: yup
    .string()
    .required("Color Code is required")
    .max(20, "Maximum 20 characters"),

  colorName: yup
    .string()
    .required("Color Name is required")
    .max(50, "Maximum 50 characters"),

  hexCode: yup
    .string()
    .matches(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Enter a valid Hex Code (Example: #FF0000)",
    )
    .required("Hex Code is required"),

  status: yup.boolean().required(),
});
