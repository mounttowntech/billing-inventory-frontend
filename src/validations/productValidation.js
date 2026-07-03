import * as yup from "yup";

export const productValidation = yup.object({
  name: yup.string().required("Product name is required"),
  sku: yup.string().required("SKU is required"),
  category: yup.string().required("Category is required"),
  sellingPrice: yup.number().required("Selling price is required"),
  stock: yup.number().min(0, "Stock cannot be negative"),
});
