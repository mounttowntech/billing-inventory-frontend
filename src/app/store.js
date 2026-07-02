import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/product/productSlice";
import customerReducer from "../features/customer/customerSlice";
import invoiceReducer from "../features/invoice/invoiceSlice";
import categoryReducer from "../features/Category/categorySlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    customer: customerReducer,
    invoice: invoiceReducer,
    category: categoryReducer,
  },
});
