import * as yup from "yup";

export const productValidation = (mode) => yup.object({
  productName: yup.string().required("Product name is required"),
  category: yup.string().required("Category is required"),
  stock: yup.number().min(0, "Stock cannot be negative"),
  variants: yup.array().of(
    yup.object({
      color: yup.string().required("Color is required"),
      size: yup.string().required("Size is required"),
      price: yup.number().optional(),
      mrp: yup.number().required("MRP is required"),
      sellingPrice: yup.number().required("Selling price is required"),
      currentStock: yup.number().min(0, "Stock cannot be negative").required("Stock is required"),
      skuCode: yup.string().optional("SKU code is required"),
      barcode: yup.string().optional("Barcode is required"),
      discountType: yup.string().oneOf(["percentage", "amount"]).required("Discount type is required"),
      discountPercentage: yup.number().min(0).max(100).optional(),
      discountAmount: yup.number().min(0).optional(),
    })
  ),
});
