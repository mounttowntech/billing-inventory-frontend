import { useMemo, useState } from "react";
import AddProductModal from "../../pages/products/AddProductModal";
import "./Dashboard.css";

/* ===================== STATIC MOCK DATA ===================== */
/* Swap these out for real API data later — the shape is what matters. */

const STATS_BY_RANGE = {
  today: [
    {
      label: "Sales Today",
      value: "₹18,420",
      trend: "+8.2%",
      up: true,
      icon: "",
    },
    { label: "Invoices", value: "34", trend: "+4", up: true, icon: "🧾" },
    {
      label: "Low Stock Items",
      value: "7",
      trend: "+2",
      up: false,
      icon: "",
    },
    { label: "New Customers", value: "5", trend: "+1", up: true, icon: "🧑‍🤝‍🧑" },
  ],
  week: [
    {
      label: "Sales This Week",
      value: "₹1,24,980",
      trend: "+12.6%",
      up: true,
      icon: "",
    },
    { label: "Invoices", value: "221", trend: "+18", up: true, icon: "🧾" },
    {
      label: "Low Stock Items",
      value: "11",
      trend: "+3",
      up: false,
      icon: "",
    },
    { label: "New Customers", value: "29", trend: "+6", up: true, icon: "🧑‍🤝‍🧑" },
  ],
  month: [
    {
      label: "Sales This Month",
      value: "₹5,42,300",
      trend: "+9.4%",
      up: true,
      icon: "",
    },
    { label: "Invoices", value: "902", trend: "+64", up: true, icon: "🧾" },
    {
      label: "Low Stock Items",
      value: "18",
      trend: "-4",
      up: true,
      icon: "",
    },
    {
      label: "New Customers",
      value: "112",
      trend: "+22",
      up: true,
      icon: "",
    },
  ],
};

const WEEKLY_SALES = [
  { day: "Mon", value: 42 },
  { day: "Tue", value: 58 },
  { day: "Wed", value: 36 },
  { day: "Thu", value: 71 },
  { day: "Fri", value: 64 },
  { day: "Sat", value: 88 },
  { day: "Sun", value: 53 },
];

const INVOICES = [
  {
    id: "INV-1042",
    customer: "Ravi Kumar",
    items: 6,
    amount: 2450,
    status: "Paid",
    date: "Jun 30, 2026",
  },
  {
    id: "INV-1041",
    customer: "Anita Sharma",
    items: 3,
    amount: 980,
    status: "Pending",
    date: "Jun 30, 2026",
  },
  {
    id: "INV-1040",
    customer: "Suresh Traders",
    items: 14,
    amount: 15680,
    status: "Paid",
    date: "Jun 29, 2026",
  },
  {
    id: "INV-1039",
    customer: "Deepa Stores",
    items: 2,
    amount: 540,
    status: "Overdue",
    date: "Jun 28, 2026",
  },
  {
    id: "INV-1038",
    customer: "Karthik R.",
    items: 8,
    amount: 3320,
    status: "Paid",
    date: "Jun 28, 2026",
  },
  {
    id: "INV-1037",
    customer: "Meena Enterprises",
    items: 5,
    amount: 1750,
    status: "Pending",
    date: "Jun 27, 2026",
  },
  {
    id: "INV-1036",
    customer: "Vignesh S.",
    items: 1,
    amount: 199,
    status: "Paid",
    date: "Jun 27, 2026",
  },
  {
    id: "INV-1035",
    customer: "Priya Textiles",
    items: 22,
    amount: 28900,
    status: "Overdue",
    date: "Jun 26, 2026",
  },
];

const LOW_STOCK = [
  { name: "Basmati Rice 5kg", sku: "GRN-1042", qty: 4, threshold: 15 },
  { name: "Sunflower Oil 1L", sku: "OIL-2087", qty: 6, threshold: 20 },
  { name: "Toor Dal 1kg", sku: "PLS-3310", qty: 3, threshold: 10 },
  { name: "Tea Powder 500g", sku: "BEV-4471", qty: 5, threshold: 12 },
];

const TOP_PRODUCTS = [
  { name: "Basmati Rice 5kg", sold: 128, revenue: 38400 },
  { name: "Sunflower Oil 1L", sold: 104, revenue: 20800 },
  { name: "Tea Powder 500g", sold: 96, revenue: 14400 },
  { name: "Toor Dal 1kg", sold: 81, revenue: 9720 },
  { name: "Wheat Flour 10kg", sold: 65, revenue: 19500 },
];

const ACTIVITY = [
  {
    text: "Invoice INV-1042 marked as Paid",
    time: "10 min ago",
    type: "success",
  },
  {
    text: "Stock alert: Toor Dal 1kg is low (3 left)",
    time: "42 min ago",
    type: "warning",
  },
  {
    text: "New customer Meena Enterprises added",
    time: "1 hr ago",
    type: "info",
  },
  {
    text: "Purchase order #PO-118 received from supplier",
    time: "3 hrs ago",
    type: "info",
  },
  {
    text: "Invoice INV-1035 is overdue by 3 days",
    time: "5 hrs ago",
    type: "danger",
  },
];

/* ===================== COMPONENT ===================== */

const RANGE_OPTIONS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
];

const STATUS_FILTERS = ["All", "Paid", "Pending", "Overdue"];

const Dashboard = () => {
  const [range, setRange] = useState("today");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddProduct, setShowAddProduct] = useState(false);

  const stats = STATS_BY_RANGE[range];
  const maxSale = Math.max(...WEEKLY_SALES.map((d) => d.value));

  const filteredInvoices = useMemo(() => {
    return INVOICES.filter((inv) => {
      const matchesSearch =
        inv.customer.toLowerCase().includes(search.toLowerCase()) ||
        inv.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="dashboard">
      {/* ===== Page header ===== */}
      <div className="dash-heading">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back — here's what's happening in your store today.
          </p>
        </div>
        {/* <div className="dash-actions">
          <button className="secondary" onClick={() => setShowAddProduct(true)}>
            + Add Product
          </button>
          <button>+ New Sale</button>
        </div> */}
      </div>

      {/* ===== Range toggle ===== */}
      <div className="range-toggle">
        {RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            className={`range-btn ${range === opt.key ? "active" : ""}`}
            onClick={() => setRange(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ===== Stat cards ===== */}
      <div className="cards stat-cards">
        {stats.map((s) => (
          <div className="card stat-card" key={s.label}>
            <div className="stat-icon">{s.icon}</div>
            <div className="card-title">{s.label}</div>
            <div className="card-value">{s.value}</div>
            <div className={`card-trend ${s.up ? "up" : "down"}`}>
              {s.up ? "▲" : "▼"} {s.trend} vs last period
            </div>
          </div>
        ))}
      </div>

      {/* ===== Main grid: chart + invoices | side panel ===== */}
      <div className="dash-grid">
        <div className="dash-main">
          {/* Sales chart */}
          <div className="card chart-card">
            <div className="card-header">
              <h3>Weekly Sales Overview</h3>
              <span className="card-header-note">Units sold per day</span>
            </div>
            <div className="bar-chart">
              {WEEKLY_SALES.map((d) => (
                <div className="bar-col" key={d.day}>
                  <div
                    className="bar"
                    style={{ height: `${(d.value / maxSale) * 100}%` }}
                    title={`${d.day}: ${d.value} units`}
                  >
                    <span className="bar-value">{d.value}</span>
                  </div>
                  <span className="bar-label">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Invoices table */}
          <div className="card table-card">
            <div className="card-header">
              <h3>Recent Invoices</h3>
              <div className="table-controls">
                <input
                  type="text"
                  placeholder="Search customer or invoice #"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="table-search"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="table-filter"
                >
                  {STATUS_FILTERS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className="mono">{inv.id}</td>
                        <td>{inv.customer}</td>
                        <td>{inv.items}</td>
                        <td>₹{inv.amount.toLocaleString("en-IN")}</td>
                        <td>
                          <span
                            className={`badge badge-${inv.status.toLowerCase()}`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td>{inv.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="empty-row">
                        No invoices match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ===== Side panel ===== */}
        <div className="dash-side">
          {/* Low stock alerts */}
          <div className="card side-card">
            <div className="card-header">
              <h3>Low Stock Alerts</h3>
              <span className="badge badge-overdue">
                {LOW_STOCK.length} items
              </span>
            </div>
            <ul className="stock-list">
              {LOW_STOCK.map((item) => (
                <li key={item.sku} className="stock-item">
                  <div>
                    <div className="stock-name">{item.name}</div>
                    <div className="stock-sku">{item.sku}</div>
                  </div>
                  <div className="stock-qty-wrap">
                    <span className="stock-qty">{item.qty} left</span>
                    <div className="stock-bar">
                      <div
                        className="stock-bar-fill"
                        style={{
                          width: `${Math.min((item.qty / item.threshold) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Top products */}
          <div className="card side-card">
            <div className="card-header">
              <h3>Top Selling Products</h3>
            </div>
            <ul className="top-products">
              {TOP_PRODUCTS.map((p, i) => (
                <li key={p.name} className="top-product-item">
                  <span className="rank">{i + 1}</span>
                  <div className="top-product-info">
                    <div className="stock-name">{p.name}</div>
                    <div className="stock-sku">{p.sold} sold</div>
                  </div>
                  <div className="top-product-revenue">
                    ₹{p.revenue.toLocaleString("en-IN")}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Activity feed */}
          <div className="card side-card">
            <div className="card-header">
              <h3>Recent Activity</h3>
            </div>
            <ul className="activity-feed">
              {ACTIVITY.map((a, i) => (
                <li className="activity-item" key={i}>
                  <span className={`activity-dot dot-${a.type}`} />
                  <div>
                    <div className="activity-text">{a.text}</div>
                    <div className="activity-time">{a.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
