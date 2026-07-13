import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import ProductList from "../pages/products/ProductList";
import ProductForm from "../pages/products/ProductForm";
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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/create" element={<ProductForm />} />
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
        <Route path="expense" element={<Expense />} />
        <Route path="stores" element={<Store />} />
        <Route path="measurement" element={<Measurement />} />
        <Route path="audit-logs" element={<AuditLog />} />
        <Route path="roles" element={<RolesPermission />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
