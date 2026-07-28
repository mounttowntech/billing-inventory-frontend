import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import ForgetPassword from "../pages/forgetpassword/forgetpassword";
import Dashboard from "../pages/dashboard/Dashboard";
import ProductList from "../pages/products/ProductList";
import CustomerList from "../pages/customers/CustomerList";
import CustomerForm from "../pages/customers/CustomerForm";
import POSBilling from "../pages/billing/POSBilling";
import InvoiceList from "../pages/invoices/InvoiceList";
import PurchaseList from "../pages/purchases/PurchaseList";
import Reports from "../pages/reports/Reports";
import NotFound from "../pages/NotFound";
import CategoryOptions from "../pages/Category/CategoryOptions";
import Brand from "../pages/Brand/Brand";
import Fabric from "../pages/fabric/fabric";
import Season from "../pages/season/Season";
import Style from "../pages/Style/Style";
import Supplier from "../pages/Supplier/Supplier";
import Profile from "../pages/profile/Profilepage";
import ProfilePage from "../pages/profile/Profilepage";

import Expense from "../pages/Expense/Expense";
import Store from "../pages/store/Store";
import Measurement from "../pages/measurement/Measurement";
import AuditLog from "../pages/auditLog/AuditLog";
import RolesPermission from "../pages/RolesPermission/RolesPermission";
import SalesReturn from "../pages/SalesReturn/SalesReturn";
import Unit from "../pages/Unit/Unit";
import StockAdjustment from "../pages/StockAdjustment/StockAdjustment";
import Alteration from "../pages/Alteration/Alteration";
import Colors from "../pages/Colors/Colors";
import Sizes from "../pages/sizes/Sizes";
import UserLists from "../pages/users/UserLists";
import ManagerDashboard from "../pages/dashboard/ManagerDashboard";
import TaxList from "../pages/tax/TaxList";
import CashierDashboard from "../pages/dashboard/CashierDashboard";
import InventoryDashboard from "../pages/dashboard/InventoryDashboard";
import CustomerAddress from "../pages/CustomerAddress/CustomerAddress";
import StockLedger from "../pages/StockLedger/StockLedger";
import DashboardRedirect from "../routes/DashboardRedirect";
import PaymentList from "../pages/payments/PaymentList";
import PurchaseReturn from "../pages/purchases/PurchaseReturn";
import Forgetpassword from "../pages/forgetpassword/forgetpassword";
import ResetPassword from "../pages/Resetpassword/ResetPassword";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardRedirect />} />
        <Route path="admin-dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="customers/create" element={<CustomerForm />} />
        <Route path="billing" element={<POSBilling />} />
        <Route path="invoices" element={<InvoiceList />} />
        <Route path="purchases" element={<PurchaseList />} />
        <Route path="reports" element={<Reports />} />
        <Route path="categories" element={<CategoryOptions />} />
        <Route path="brands" element={<Brand />} />
        <Route path="fabrics" element={<Fabric />} />
        <Route path="seasons" element={<Season />} />
        <Route path="styles" element={<Style />} />
        <Route path="suppliers" element={<Supplier />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="expenses" element={<Expense />} />
        <Route path="stores" element={<Store />} />
        <Route path="measurements" element={<Measurement />} />
        <Route path="audit-logs" element={<AuditLog />} />
        <Route path="roles" element={<RolesPermission />} />
        <Route path="sales-return" element={<SalesReturn />} />
        <Route path="units" element={<Unit />} />
        <Route path="stock-adjustments" element={<StockAdjustment />} />
        <Route path="alterations" element={<Alteration />} />
        <Route path="colors" element={<Colors />} />
        <Route path="sizes" element={<Sizes />} />
        <Route path="users" element={<UserLists />} />
        <Route path="tax-settings" element={<TaxList />} />
        <Route path="customer-addresses" element={<CustomerAddress />} />
        <Route path="stock-ledger" element={<StockLedger />} />
        <Route path="manager-dashboard" element={<ManagerDashboard />} />
        <Route path="cashier-dashboard" element={<CashierDashboard />} />
        <Route path="inventory-dashboard" element={<InventoryDashboard />} />
        <Route path="payments" element={<PaymentList />} />
        <Route path="purchase-return" element={<PurchaseReturn />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
