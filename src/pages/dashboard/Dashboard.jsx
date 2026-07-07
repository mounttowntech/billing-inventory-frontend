import { useMemo, useState } from "react";
import "./Dashboard.css";

const STAT_CARDS = [
  {
    key: "sales",
    label: "Today Sales",
    value: "\u20B982,00450",
    trendValue: "12.4%",
    trendLabel: "vs yesterday",
    up: true,
    accent: "blue",
    icon: "bag",
    spark: [24, 300, 40, 405, 208, 49, 500, 6, 0, 502, 44, 60, 50, 68, 602],
  },
  {
    key: "purchase",
    label: "Purchase order",
    value: "\u20B943,200",
    trendValue: "8.7%",
    trendLabel: "vs yesterday",
    up: true,
    accent: "green",
    icon: "cart",
    spark: [200, 340, 260, 380, 800, 402, 602, 404, 506, 46, 38, 48, 600, 500, 406],
  },
  {
    key: "lowstock",
    label: "Low Stock",
    value: "18",
    trendValue: "3 items",
    trendLabel: "vs yesterday",
    up: false,
    accent: "orange",
    icon: "stack",
    spark: [180, 320, 224, 400, 300, 460, 840, 500, 38, 540, 42, 580, 460, 620, 560],
  },
  {
    key: "pnl",
    label: "Profit and loss",
    value: "\u20B919,650",
    trendValue: "15.3%",
    trendLabel: "vs yesterday",
    up: true,
    accent: "purple",
    icon: "trend",
    spark: [2, 36, 28, 42, 34, 480, 38, 54, 46, 60, 50, 606, 58, 72, 64],
  },
];

const RECENT_SALES = [
  {
    id: "INV-8492",
    customer: "James Mitchell",
    date: "Oct 12, 2024",
    total: 1240.0,
    status: "Paid",
  },
  {
    id: "INV-8491",
    customer: "Sarah Connor",
    date: "Oct 12, 2024",
    total: 3820.0,
    status: "Pending",
  },
  {
    id: "INV-8490",
    customer: "David Miller",
    date: "Oct 11, 2024",
    total: 850.5,
    status: "Paid",
  },
  {
    id: "INV-8489",
    customer: "Wilson Store Corp",
    date: "Oct 11, 2024",
    total: 12940.0,
    status: "Overdue",
  },
];

const formatUSD = (amount) =>
  `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const ICONS = {
  bag: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 8h12l1 12.5a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 20.5L6 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 8V6.5a3 3 0 1 1 6 0V8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  cart: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 4h2l1.6 10.6a2 2 0 0 0 2 1.7h7.6a2 2 0 0 0 2-1.6L20 8H6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="20" r="1.3" fill="currentColor" />
      <circle cx="17" cy="20" r="1.3" fill="currentColor" />
    </svg>
  ),
  stack: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3.5 21 8l-9 4.5L3 8l9-4.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M3 12l9 4.5 9-4.5M3 16l9 4.5 9-4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  trend: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 17l6-6 4 4 8-9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 6h6v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const ArrowUp = () => (
  <svg
    className="trend-arrow"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 19V5M6 11l6-6 6 6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowDown = () => (
  <svg
    className="trend-arrow"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 5v14M6 13l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DotsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="5" r="1.6" fill="currentColor" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    <circle cx="12" cy="19" r="1.6" fill="currentColor" />
  </svg>
);

/** Smooth-ish sparkline built from a plain array of numbers. */
const Sparkline = ({ data, accent, width = 240, height = 64 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 8) - 4;
    return [x, y];
  });

  // Build a gently-curved path through the points.
  const path = points.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x} ${y}`;
    const [px, py] = points[i - 1];
    const mx = (px + x) / 2;
    return `${acc} C ${mx} ${py}, ${mx} ${y}, ${x} ${y}`;
  }, "");

  return (
    <svg
      className={`sparkline sparkline-${accent}`}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <path d={path} fill="none" strokeWidth="2.5" />
    </svg>
  );
};

const StatCard = ({ card }) => (
  <div className="card stat-card">
    <div className="stat-head">
      <span className={`stat-icon icon-${card.accent}`}>
        {ICONS[card.icon]}
      </span>
      <span className={`stat-label label-${card.accent}`}>{card.label}</span>
    </div>

    <div className="stat-value">{card.value}</div>

    <div className={`stat-trend ${card.up ? "trend-up" : "trend-down"}`}>
      {card.up ? <ArrowUp /> : <ArrowDown />}
      <span className="trend-value">{card.trendValue}</span>
      <span className="trend-label">{card.trendLabel}</span>
    </div>

    <Sparkline data={card.spark} accent={card.accent} />
  </div>
);

const Dashboard = () => {
  const [sales] = useState(RECENT_SALES);

  const statusClass = useMemo(
    () => ({
      Paid: "badge-paid",
      Pending: "badge-pending",
      Overdue: "badge-overdue",
    }),
    [],
  );

  const handleAddSale = () => {
    console.log("Add new sale clicked");
  };

  return (
    <div className="dashboard">
      {/* ===== Stat cards ===== */}
      <div className="stat-grid">
        {STAT_CARDS.map((card) => (
          <StatCard card={card} key={card.key} />
        ))}
      </div>

      {/* ===== Recent sales table ===== */}
      <div className="card sales-card">
        <div className="sales-header">
          <div>
            <h2 className="sales-title">Recent Sales</h2>
            <p className="sales-subtitle">
              Monitoring your last 10 transactions
            </p>
          </div>
          <button className="add-sale-btn" onClick={handleAddSale}>
            <span className="add-sale-plus">+</span> Add New Sale
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td>
                    <div className="invoice-cell">
                      <span className="invoice-icon">
                        <svg viewBox="0 0 24 24" fill="none">
                          <rect
                            x="5"
                            y="3"
                            width="14"
                            height="18"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />
                          <path
                            d="M8.5 8h7M8.5 12h7M8.5 16h4"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <span className="invoice-id">{sale.id}</span>
                    </div>
                  </td>
                  <td>{sale.customer}</td>
                  <td className="muted-cell">{sale.date}</td>
                  <td className="total-cell">{formatUSD(sale.total)}</td>
                  <td>
                    <span className={`badge ${statusClass[sale.status]}`}>
                      <span className="badge-dot" />
                      {sale.status}
                    </span>
                  </td>
                  <td>
                    <button className="row-action" aria-label="Row actions">
                      <DotsIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sales-footer">
          <button className="view-all-btn">
            View All Transactions <span className="arrow">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
