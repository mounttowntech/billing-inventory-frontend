import { NavLink } from "react-router-dom";
import "./Sidebar.css";
const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>BI System</h2>

      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/billing">POS Billing</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/customers">Customers</NavLink>
        <NavLink to="/purchases">Purchases</NavLink>
        <NavLink to="/invoices">Invoices</NavLink>
        <NavLink to="/reports">Reports</NavLink>
        <details>
          <summary>Settings</summary>

          <NavLink to="/categories">Category</NavLink>
          <NavLink to="/brands">Brand</NavLink>
          <NavLink to="/styles">Style</NavLink>
          <NavLink to="/fabrics">Fabric</NavLink>
          <NavLink to="/seasons">Season</NavLink>
        </details>
      </nav>
    </aside>
  );
};

export default Sidebar;
