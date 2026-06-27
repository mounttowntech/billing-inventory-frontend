import { NavLink } from "react-router-dom";

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
      </nav>
    </aside>
  );
};

export default Sidebar;