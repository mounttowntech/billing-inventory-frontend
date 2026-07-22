import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import {
  DashboardIcon,
  POSIcon,
  ProductsIcon,
  CustomersIcon,
  MeasurementIcon,
  AuditLogIcon,
  PurchaseIcon,
  SalesReturnIcon,
  SupplierIcon,
  RolesIcon,
  UnitIcon,
  InvoiceIcon,
  ReportsIcon,
  SettingsIcon,
  DotIcon,
  BrandLogoIcon,
  MenuIcon,
} from "./SidebarIcons";
import { hasPermission } from "../../utils/permission";
import { useSelector } from "react-redux";
import { getDashboardRoute } from "../../utils/getDashboardRoute";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const closeSidebar = () => setOpen(false);

  const { user } = useSelector((state) => state.auth);

  return (
    <>
      {/* Mobile toggle button — place this in your top navbar/header */}
      <button
        className="sidebar-toggle"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>

      {/* Dark overlay behind the sidebar on mobile */}
      <div
        className={`sidebar-overlay ${open ? "active" : ""}`}
        onClick={closeSidebar}
      />

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-brand">
          <span className="sidebar-brand-logo">
            <BrandLogoIcon />
          </span>
          <div className="sidebar-brand-text">
            <h2>WonderBill</h2>
            <span>Enterprise Edition</span>
          </div>
        </div>

        <nav onClick={closeSidebar}>
          {hasPermission(user, "dashboard") && (
            <NavLink to={getDashboardRoute(user?.role?.roleName)} end>
              <span className="nav-icon">
                <DashboardIcon />
              </span>
              <span>Dashboard</span>
            </NavLink>
          )}

          {hasPermission(user, "settings") && (
            <details>
              <summary>
                <span className="summary-label">
                  <span className="nav-icon">
                    <SettingsIcon />
                  </span>
                  <span>Masters</span>
                </span>
              </summary>
              <NavLink to="/brands">
                <span className="nav-icon">
                  <DotIcon />
                </span>
                <span>Brand</span>
              </NavLink>
              <NavLink to="/categories">
                <span className="nav-icon">
                  <DotIcon />
                </span>
                <span>Category</span>
              </NavLink>
              <NavLink to="/colors">
                <span className="nav-icon">
                  <DotIcon />
                </span>
                <span>Colors</span>
              </NavLink>
              <NavLink to="/sizes">
                <span className="nav-icon">
                  <DotIcon />
                </span>
                <span>Sizes</span>
              </NavLink>

              <NavLink to="/units">
                <span className="nav-icon">
                  <UnitIcon />
                </span>
                <span>Unit</span>
              </NavLink>

              <NavLink to="/fabrics">
                <span className="nav-icon">
                  <DotIcon />
                </span>
                <span>Fabric</span>
              </NavLink>

              <NavLink to="/seasons">
                <span className="nav-icon">
                  <DotIcon />
                </span>
                <span>Season</span>
              </NavLink>

              <NavLink to="/styles">
                <span className="nav-icon">
                  <DotIcon />
                </span>
                <span>Styles</span>
              </NavLink>

              <NavLink to="/alterations">
                <span className="nav-icon">
                  <DotIcon />
                </span>
                <span>Alterations</span>
              </NavLink>

              <NavLink to="/measurements">
                <span className="nav-icon">
                  <DotIcon />
                </span>
                <span>Measurements</span>
              </NavLink>

              <NavLink to="/tax-settings">
                <span className="nav-icon">
                  <DotIcon />
                </span>
                <span>Tax Settings</span>
              </NavLink>
            </details>
          )}

          {hasPermission(user, "products") && (
            <NavLink to="/products">
              <span className="nav-icon">
                <ProductsIcon />
              </span>
              <span>Products</span>
            </NavLink>
          )}

          {hasPermission(user, "purchases") && (
            <details>
              <summary>
                <span className="summary-label">
                  <span className="nav-icon">
                    <PurchaseIcon />
                  </span>
                  <span>Purchase Type</span>
                </span>
              </summary>

              <NavLink to="/purchases">
                <span className="nav-icon">
                  <DotIcon />
                </span>
                <span>Purchases</span>
              </NavLink>

              <NavLink to="/purchase-return">
                <span className="nav-icon">
                  <DotIcon />
                </span>
                <span>Purchase Return</span>
              </NavLink>
            </details>
          )}

          {hasPermission(user, "sales") && (
            <details>
              <summary>
                <span className="summary-label">
                  <span className="nav-icon">
                    <SettingsIcon />
                  </span>
                  <span>Sales</span>
                </span>
              </summary>
              <NavLink to="/billing">
                <span className="nav-icon">
                  <POSIcon />
                </span>
                <span>POS Billing</span>
              </NavLink>
              <NavLink to="/invoices">
                <span className="nav-icon">
                  <InvoiceIcon />
                </span>
                <span>Sales Invoices</span>
              </NavLink>

              <NavLink to="/sales-return">
                <span className="nav-icon">
                  <SalesReturnIcon />
                </span>
                <span>Sales Returns</span>
              </NavLink>
            </details>
          )}

          {hasPermission(user, "inventory") && (
            <details>
              <summary>
                <span className="summary-label">
                  <span className="nav-icon">
                    <SettingsIcon />
                  </span>
                  <span>Inventory</span>
                </span>
              </summary>
              <NavLink to="/stock-ledger">
                <span className="nav-icon">
                  <POSIcon />
                </span>
                <span>Stock Ledger</span>
              </NavLink>
              <NavLink to="/stock-adjustments">
                <span className="nav-icon">
                  <InvoiceIcon />
                </span>
                <span>Stock Adjustments</span>
              </NavLink>
            </details>
          )}

          {hasPermission(user, "crm") && (
            <details>
              <summary>
                <span className="summary-label">
                  <span className="nav-icon">
                    <SettingsIcon />
                  </span>
                  <span>CRM</span>
                </span>
              </summary>

              <NavLink to="/customers">
                <span className="nav-icon">
                  <CustomersIcon />
                </span>
                <span>Customers</span>
              </NavLink>

              <NavLink to="/customer-addresses">
                <span className="nav-icon">
                  <CustomersIcon />
                </span>
                <span>Customer Addresses</span>
              </NavLink>

              <NavLink to="/suppliers">
                <span className="nav-icon">
                  <SupplierIcon />
                </span>
                <span>Suppliers</span>
              </NavLink>
            </details>
          )}

          {hasPermission(user, "finance") && (
            <details>
              <summary>
                <span className="summary-label">
                  <span className="nav-icon">
                    <SettingsIcon />
                  </span>
                  <span>Finance</span>
                </span>
              </summary>

              <NavLink to="/payments">
                <span className="nav-icon">
                  <CustomersIcon />
                </span>
                <span>Payments</span>
              </NavLink>

              <NavLink to="/expenses">
                <span className="nav-icon">
                  <CustomersIcon />
                </span>
                <span>Expenses</span>
              </NavLink>
            </details>
          )}

          {hasPermission(user, "administration") && (
            <details>
              <summary>
                <span className="summary-label">
                  <span className="nav-icon">
                    <SettingsIcon />
                  </span>
                  <span>Administration</span>
                </span>
              </summary>

              <NavLink to="/users">
                <span className="nav-icon">
                  <CustomersIcon />
                </span>
                <span>Users</span>
              </NavLink>

              <NavLink to="/roles">
                <span className="nav-icon">
                  <CustomersIcon />
                </span>
                <span>Roles & Permissions</span>
              </NavLink>

              <NavLink to="/stores">
                <span className="nav-icon">
                  <DotIcon />
                </span>
                <span>Store</span>
              </NavLink>

              <NavLink to="/audit-logs">
                <span className="nav-icon">
                  <AuditLogIcon />
                </span>
                <span>Audit Logs</span>
              </NavLink>
            </details>
          )}

          {hasPermission(user, "reports") && (
            <NavLink to="/reports">
              <span className="nav-icon">
                <ReportsIcon />
              </span>
              <span>Reports</span>
            </NavLink>
          )}

          {/* {hasPermission(user, "pos-billing") && (
          <NavLink to="/billing">
            <span className="nav-icon">
              <POSIcon />
            </span>
            <span>POS Billing</span>
          </NavLink>
          )} */}
          {/* {hasPermission(user, "sales-returns") && (
          <NavLink to="/sales-return">
            <span className="nav-icon">
              <SalesReturnIcon />
            </span>
            <span>Sales Returns</span>
          </NavLink>
          )} */}
          {/* {hasPermission(user, "roles") && (
          <NavLink to="/roles">
            <span className="nav-icon">
              <RolesIcon />
            </span>
            <span>Roles</span>
          </NavLink>
          )}
          {hasPermission(user, "expense") && (
          <NavLink to="/expense">
            <span className="nav-icon">
              <POSIcon />
            </span>
            <span>Expense</span>
          </NavLink>
          )}
      
          {hasPermission(user, "customers") && (
          <NavLink to="/customers">
            <span className="nav-icon">
              <CustomersIcon />
            </span>
            <span>Customers</span>
          </NavLink>
          )}
          {hasPermission(user, "measurement") && (
          <NavLink to="/measurement">
            <span className="nav-icon">
              <MeasurementIcon />
            </span>
            <span>Measurements</span>
          </NavLink>
          )}

          {hasPermission(user, "audit-logs") && (
          <NavLink to="/audit-logs">
            <span className="nav-icon">
              <AuditLogIcon />
            </span>
            <span>Audit Logs</span>
          </NavLink>
          )}
          
          {hasPermission(user, "suppliers") && (
          <NavLink to="/suppliers">
            <span className="nav-icon">
              <SupplierIcon />
            </span>
            <span>Suppliers</span>
          </NavLink>
          )} */}
          {/* {hasPermission(user, "invoices") && (
          <NavLink to="/invoices">
            <span className="nav-icon">
              <InvoiceIcon />
            </span>
            <span>Invoices</span>
          </NavLink>
          )} */}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
