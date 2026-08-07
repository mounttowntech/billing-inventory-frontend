import * as yup from "yup";

export const changePasswordValidation = yup.object({
  currentPassword: yup.string().required("Current Password is required"),

  newPassword: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("New Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Confirm Password is required"),
});
