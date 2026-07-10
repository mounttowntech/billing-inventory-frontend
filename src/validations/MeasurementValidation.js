import * as yup from "yup";

export const measurementValidation = yup.object({
  customer: yup.string().required("Customer is required"),

  chest: yup
    .number()
    .typeError("Chest is required")
    .positive("Must be positive")
    .required("Chest is required"),

  waist: yup
    .number()
    .typeError("Waist is required")
    .positive("Must be positive")
    .required("Waist is required"),

  shoulder: yup
    .number()
    .typeError("Shoulder is required")
    .positive("Must be positive")
    .required("Shoulder is required"),

  sleeve: yup
    .number()
    .typeError("Sleeve is required")
    .positive("Must be positive")
    .required("Sleeve is required"),

  neck: yup
    .number()
    .typeError("Neck is required")
    .positive("Must be positive")
    .required("Neck is required"),

  hip: yup
    .number()
    .typeError("Hip is required")
    .positive("Must be positive")
    .required("Hip is required"),

  inseam: yup
    .number()
    .typeError("Inseam is required")
    .positive("Must be positive")
    .required("Inseam is required"),

  length: yup
    .number()
    .typeError("Length is required")
    .positive("Must be positive")
    .required("Length is required"),

  notes: yup.string().max(500, "Maximum 500 characters"),
});
