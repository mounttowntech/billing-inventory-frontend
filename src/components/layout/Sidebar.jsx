import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import {
  DashboardIcon,
  POSIcon,
  ProductsIcon,
  CustomersIcon,
  PurchaseIcon,
  SupplierIcon,
  InvoiceIcon,
  ReportsIcon,
  SettingsIcon,
  DotIcon,
  BrandLogoIcon,
  MenuIcon,
} from "./SidebarIcons";
import { hasPermission } from "../../utils/permission";
import { useSelector } from "react-redux";

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
            <h2>BI System</h2>
            <span>Enterprise Edition</span>
          </div>
        </div>

        <nav onClick={closeSidebar}>
          {hasPermission(user, "dashboard") && (
          <NavLink to="/" end>
            <span className="nav-icon">
              <DashboardIcon />
            </span>
            <span>Dashboard</span>
          </NavLink>
          )}
          {hasPermission(user, "billing") && (
          <NavLink to="/billing">
            <span className="nav-icon">
              <POSIcon />
            </span>
            <span>POS Billing</span>
          </NavLink>
          )}
          {hasPermission(user, "Product") && (
          <NavLink to="/products">
            <span className="nav-icon">
              <ProductsIcon />
            </span>
            <span>Products</span>
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
          {hasPermission(user, "purchases") && (
          <NavLink to="/purchases">
            <span className="nav-icon">
              <PurchaseIcon />
            </span>
            <span>Purchases</span>
          </NavLink>
          )}
          {hasPermission(user, "suppliers") && (
          <NavLink to="/suppliers">
            <span className="nav-icon">
              <SupplierIcon />
            </span>
            <span>Suppliers</span>
          </NavLink>
          )}
          {hasPermission(user, "invoices") && (
          <NavLink to="/invoices">
            <span className="nav-icon">
              <InvoiceIcon />
            </span>
            <span>Invoices</span>
          </NavLink>
          )}
          {hasPermission(user, "reports") && (
          <NavLink to="/reports">
            <span className="nav-icon">
              <ReportsIcon />
            </span>
            <span>Reports</span>
          </NavLink>
          )}

          {hasPermission(user, "settings") && (

          <details>
            <summary>
              <span className="summary-label">
                <span className="nav-icon">
                  <SettingsIcon />
                </span>
                <span>Settings</span>
              </span>
            </summary>

            <NavLink to="/categories">
              <span className="nav-icon">
                <DotIcon />
              </span>
              <span>Category</span>
            </NavLink>
            <NavLink to="/brands">
              <span className="nav-icon">
                <DotIcon />
              </span>
              <span>Brand</span>
            </NavLink>
            <NavLink to="/styles">
              <span className="nav-icon">
                <DotIcon />
              </span>
              <span>Style</span>
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
          </details>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
