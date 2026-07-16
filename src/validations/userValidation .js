import * as yup from "yup";

export const userValidation = (mode) => yup.object({

    firstName:yup.string().required(),

    lastName:yup.string(),

    email:yup
        .string()
        .email()
        .required(),

    phone:yup
        .string()
        .required(),

   password:
      mode === "add"
        ? yup
            .string()
            .min(6, "Minimum 6 characters")
            .required("Password is required")
        : yup
            .string()
            .test(
              "password-length",
              "Minimum 6 characters",
              (value) => !value || value.length >= 6
            ),

    role:yup
        .string()
        .required()

});