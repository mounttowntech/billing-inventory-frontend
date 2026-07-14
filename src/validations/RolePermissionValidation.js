import * as yup from "yup";

const RolePermissionValidation = yup.object({
  roleName: yup.string().required("Role Name is required"),

  permissions: yup
    .array()
    .of(
      yup.object({
        module: yup.string().required(),

        create: yup.boolean(),

        read: yup.boolean(),

        update: yup.boolean(),

        delete: yup.boolean(),
      }),
    )
    .min(1),
});

export default RolePermissionValidation;
