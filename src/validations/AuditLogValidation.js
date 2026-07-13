import * as yup from "yup";

export const auditLogValidation = yup.object({
  user: yup.string().required("User is required"),

  module: yup.string().required("Module is required"),

  action: yup.string().required("Action is required"),

  referenceId: yup.string().nullable(),

  oldValue: yup.mixed().nullable(),

  newValue: yup.mixed().nullable(),

  ipAddress: yup.string().nullable(),
});
    