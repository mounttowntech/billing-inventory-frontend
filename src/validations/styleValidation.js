import * as yup from "yup";

export const styleValidation = yup.object({
  styleName: yup
    .string()
    .required("Style Name is required")
    .min(2, "Minimum 2 characters"),

  styleCode: yup.string().required("Style Code is required"),
});
