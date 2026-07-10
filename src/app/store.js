import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/product/productSlice";
import customerReducer from "../features/customer/customerSlice";
import invoiceReducer from "../features/invoice/invoiceSlice";
import categoryReducer from "../features/Category/categorySlice";
import brandReducer from "../features/Brand/brandSlice";
import fabricReducer from "../features/fabric/fabricSlice";
import seasonReducer from "../features/season/seasonSlice";
import styleReducer from "../features/style/styleSlice";
import purchaseReducer from "../features/purchase/purchaseSlice";
import supplierReducer from "../features/supplier/supplierSlice";
import expenseReducer from "../features/expense/expenseSlice";
import storeReducer from "../features/store/storeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    customer: customerReducer,
    invoice: invoiceReducer,
    category: categoryReducer,
    brand: brandReducer,
    fabric: fabricReducer,
    season: seasonReducer,
    style: styleReducer,
    purchase: purchaseReducer,
    supplier: supplierReducer,
    expense: expenseReducer,
    store: storeReducer,
  },
});
