import * as yup from "yup";

export const alterationValidation = yup.object({
  customer: yup.string().required("Customer is required"),

  invoice: yup.string().required("Invoice is required"),

  productName: yup.string().required("Product Name is required"),

  alterationType: yup.string().required("Alteration Type is required"),

  alterationCharge: yup
    .number()
    .typeError("Charge must be a number")
    .min(0)
    .required("Alteration Charge is required"),

  expectedDeliveryDate: yup
    .date()
    .required("Expected Delivery Date is required"),

  status: yup.string().required("Status is required"),
});
