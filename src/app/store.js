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
import roleReducer from "../features/rolls/roleSlice";
import expenseReducer from "../features/expense/expenseSlice";
import storeReducer from "../features/store/storeSlice";
import auditLogReducer from "../features/auditLog/auditLogSlice";
import rolePermissionReducer from "../features/rolePermission/rolePermissionSlice";
import salesReturnReducer from "../features/salesReturn/salesReturnSlice";
import unitReducer from "../features/unit/unitSlice";
import stockAdjustmentReducer from "../features/StockAdjustment/stockAdjustmentSlice";
import dashboardReducer from "../features/Dashboard/GarmentDashboardSlice";
import alterationReducer from "../features/alteration/alterationSlice";
import sizesReducer from "../features/Sizes/sizesSlice";
import colorsReducer from "../features/color/colorSlice";
import taxReducer from "../features/tax/taxSlice";

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
    role: roleReducer,
    expense: expenseReducer,
    store: storeReducer,
    auditLogs: auditLogReducer,
    rolePermission: rolePermissionReducer,
    salesReturn: salesReturnReducer,
    unit: unitReducer,
    stockAdjustment: stockAdjustmentReducer,
    dashboard: dashboardReducer,
    alteration: alterationReducer,
    sizes: sizesReducer,
    colors: colorsReducer,
    tax: taxReducer,
  },
});
