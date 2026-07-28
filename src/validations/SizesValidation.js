import * as yup from "yup";

export const sizesValidation = yup.object({
  sizeCode: yup.string().required("Size Code is required"),

  sizeName: yup
    .string()
    .required("Size Name is required")
    .min(1, "Minimum 1 character"),

  displayOrder: yup
    .number()
    .typeError("Display Order must be a number")
    .required("Display Order is required"),

  chest: yup
    .number()
    .typeError("Chest must be a number")
    .required("Chest is required"),

  waist: yup
    .number()
    .typeError("Waist must be a number")
    .required("Waist is required"),

  hip: yup
    .number()
    .typeError("Hip must be a number")
    .required("Hip is required"),
  status: yup
    .boolean()
    .transform((value, originalValue) => {
      console.log("typeofval", originalValue);
      console.log("typeof", typeof originalValue);
      if (originalValue == "true") return true;
      if (originalValue == "false") return false;
      return value;
    })
    .required("Status is required"),
});
