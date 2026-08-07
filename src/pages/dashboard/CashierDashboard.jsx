import React from "react";
import "./CashierDashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCashierDashboard } from "../../features/Dashboard/CashierDashboardSlice";

const IconRupee = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 6h10M7 10h10M9 6c3.5 0 6 1.5 6 4s-2.5 4-6 4h-1l7 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconBill = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 3.5h9l3 3v14a.8.8 0 0 1-.8.8H6.8a.8.8 0 0 1-.8-.8V4.3a.8.8 0 0 1 .8-.8Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M9 9h6M9 12.5h6M9 16h4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const IconBag = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.5 8h11l1 12.2a1 1 0 0 1-1 1.1H6.5a1 1 0 0 1-1-1.1L6.5 8Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M9 8V6.5a3 3 0 0 1 6 0V8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const IconShoppingBag = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 9h10l.9 10.3a1.2 1.2 0 0 1-1.2 1.3H7.3a1.2 1.2 0 0 1-1.2-1.3L7 9Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 9V7.6a2.5 2.5 0 0 1 5 0V9"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const IconReceipt = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 3.5h9l3 3v14a.8.8 0 0 1-.8.8H6.8a.8.8 0 0 1-.8-.8V4.3a.8.8 0 0 1 .8-.8Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M9 9h6M9 12.5h6M9 16h4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const IconLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 6h10M7 10h10M7 14h6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconWallet = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.5 7.5a1.5 1.5 0 0 1 1.5-1.5h11a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 17.5v-10Z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M14.5 12.5h3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconQr = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="5"
      y="5"
      width="5"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <rect
      x="14"
      y="5"
      width="5"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <rect
      x="5"
      y="14"
      width="5"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M15 15h4M17 15v4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const IconReturn = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.5 9.5 4 12l2.5 2.5M4 12h9.5a5 5 0 1 1 0 10"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconDiscount = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 8.2 8.2 5h7.6L19 8.2v7.6L15.8 19H8.2L5 15.8V8.2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 9.5h.01M14.5 14.5h.01M15 9l-6 6"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const IconRefresh = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 12a8 8 0 0 1 14-5.2M20 12a8 8 0 0 1-14 5.2M18.5 4v4h-4M5.5 20v-4h4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconArrowUp = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 19V5M6 11l6-6 6 6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 12h13M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconDoc = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.5 3.5h7l4 4v12.2a.8.8 0 0 1-.8.8H6.5a.8.8 0 0 1-.8-.8V4.3a.8.8 0 0 1 .8-.8Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M13.3 3.5V8h4.3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

/* ------------------------------ Sparkline -------------------------------- */

function Sparkline({ points = [], colorVar }) {
  if (!Array.isArray(points) || points.length < 2) {
    return null;
  }

  const width = 220;
  const height = 46;

  const numericPoints = points.map((p) => Number(p) || 0);

  const max = Math.max(...numericPoints);
  const min = Math.min(...numericPoints);
  const range = max - min || 1;

  const step = width / (numericPoints.length - 1);

  const coords = points.map((p, i) => {
    const x = i * step;
    const y = height - ((p - min) / range) * (height - 8) - 4;
    return [x, y];
  });

  const path = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  return (
    <svg
      className="cshr-sparkline"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={path}
        fill="none"
        stroke={`var(${colorVar})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------ Stat card -------------------------------- */

function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  change,
  sparkData,
  sparkColorVar,
}) {
  return (
    <div className="cshr-stat-card">
      <div className="cshr-stat-top">
        <span
          className="cshr-stat-icon"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </span>
        <span className="cshr-stat-label">{label}</span>
      </div>
      <div className="cshr-stat-value">{value}</div>
      <div className="cshr-stat-change">
        <span className="cshr-stat-change-up">
          <IconArrowUp />
          {change}
        </span>
        <span className="cshr-stat-change-suffix">vs yesterday</span>
      </div>
      <Sparkline points={sparkData} colorVar={sparkColorVar} />
    </div>
  );
}

/* --------------------------- Overview tile -------------------------------- */

function OverviewTile({ icon, iconBg, iconColor, label, value }) {
  return (
    <div className="cshr-overview-tile">
      <span
        className="cshr-overview-icon"
        style={{ background: iconBg, color: iconColor }}
      >
        {icon}
      </span>
      <div>
        <div className="cshr-overview-label">{label}</div>
        <div className="cshr-overview-value">{value}</div>
      </div>
    </div>
  );
}

/* --------------------------------- Data ----------------------------------- */

const STAT_CARDS = [
  {
    icon: <IconRupee />,
    iconBg: "var(--cshr-primary-tint)",
    iconColor: "var(--cshr-primary-color)",
    label: "Today's Sales",
    value: "\u20B928,450.00",
    change: "12.6%",
    sparkData: [1, 2, 3, 4, 5, 5, 4, 3, 2, 1],
    sparkColorVar: "--cshr-primary-color",
  },
  {
    icon: <IconBill />,
    iconBg: "var(--cshr-secondary-tint)",
    iconColor: "var(--cshr-secondary-color)",
    label: "Total Bills",
    value: "56",
    change: "8.4%",
    sparkData: [5, 4, 3, 2, 1, 1, 2, 3, 4, 5],
    sparkColorVar: "--cshr-secondary-color",
  },
  {
    icon: <IconBag />,
    iconBg: "var(--cshr-accent-amber-tint)",
    iconColor: "var(--cshr-accent-amber)",
    label: "Average Bill",
    value: "\u20B9508.04",
    change: "5.3%",
    sparkData: [0, 9, 6, 10, 6, 11, 7, 12, 8, 0],
    sparkColorVar: "--cshr-accent-amber",
  },
  {
    icon: <IconShoppingBag />,
    iconBg: "var(--cshr-accent-violet-tint)",
    iconColor: "var(--cshr-accent-violet)",
    label: "Items Sold",
    value: "142",
    change: "10.2%",
    sparkData: [70, 6, 10, 70, 11, 80, 12, 9, 13, 100],
    sparkColorVar: "--cshr-accent-violet",
  },
];

const OVERVIEW_TILES = [
  {
    icon: <IconReceipt />,
    iconBg: "var(--cshr-secondary-tint)",
    iconColor: "var(--cshr-secondary-color)",
    label: "Total Receipts",
    value: "\u20B928,450.00",
  },
  {
    icon: <IconLayers />,
    iconBg: "var(--cshr-primary-tint)",
    iconColor: "var(--cshr-primary-color)",
    label: "Cash Received",
    value: "\u20B918,600.00",
  },
  {
    icon: <IconWallet />,
    iconBg: "var(--cshr-accent-violet-tint)",
    iconColor: "var(--cshr-accent-violet)",
    label: "Card Payments",
    value: "\u20B97,350.00",
  },
  {
    icon: <IconQr />,
    iconBg: "var(--cshr-accent-amber-tint)",
    iconColor: "var(--cshr-accent-amber)",
    label: "UPI Payments",
    value: "\u20B92,500.00",
  },
  {
    icon: <IconReturn />,
    iconBg: "var(--cshr-accent-rose-tint)",
    iconColor: "var(--cshr-accent-rose)",
    label: "Returns",
    value: "\u20B9650.00",
  },
  {
    icon: <IconDiscount />,
    iconBg: "var(--cshr-secondary-tint)",
    iconColor: "var(--cshr-secondary-color)",
    label: "Discount Given",
    value: "\u20B91,250.00",
  },
];

const RECENT_SALES = [
  {
    invoice: "INV-1052",
    customer: "Walk-in Customer",
    time: "10:42 AM",
    amount: "\u20B91,299.00",
    payment: "UPI",
    status: "Paid",
  },
  {
    invoice: "INV-1051",
    customer: "Walk-in Customer",
    time: "10:30 AM",
    amount: "\u20B9899.00",
    payment: "Cash",
    status: "Paid",
  },
  {
    invoice: "INV-1050",
    customer: "Walk-in Customer",
    time: "10:18 AM",
    amount: "\u20B91,599.00",
    payment: "Card",
    status: "Paid",
  },
  {
    invoice: "INV-1049",
    customer: "Walk-in Customer",
    time: "10:05 AM",
    amount: "\u20B9449.00",
    payment: "UPI",
    status: "Paid",
  },
  {
    invoice: "INV-1048",
    customer: "Walk-in Customer",
    time: "09:52 AM",
    amount: "\u20B91,249.00",
    payment: "Cash",
    status: "Paid",
  },
];

const PAYMENT_CLASS = {
  UPI: "cshr-badge-upi",
  Cash: "cshr-badge-cash",
  Card: "cshr-badge-card",
};

export default function CashierDashboard() {
  const {
    todaySales,
    totalBills,
    averageBill,
    itemsSold,
    todaysOverview,
    recentSales,
    isLoading,
  } = useSelector((state) => state.cashierDashboard);
  const dispatch = useDispatch();

  const { cashierDashboard, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getCashierDashboard());
  }, [dispatch]);

  const stats = cashierDashboard?.stats || {};
  const overview = cashierDashboard?.overview || {};
  return (
    <div className="cshr-dashboard">
      {/* Stat cards row */}
      <div className="cshr-stat-grid">
        {[
          {
            icon: <IconRupee />,
            iconBg: "var(--cshr-primary-tint)",
            iconColor: "var(--cshr-primary-color)",
            label: "Today's Sales",
            value: `₹${stats.todaySales || 0}`,
            change: `${stats.salesGrowth || 0}%`,
            sparkData: stats.todaySalesGraph || [0],
            sparkColorVar: "--cshr-primary-color",
          },
          {
            icon: <IconBill />,
            iconBg: "var(--cshr-secondary-tint)",
            iconColor: "var(--cshr-secondary-color)",
            label: "Total Bills",
            value: stats.totalBills || 0,
            change: `${stats.billGrowth || 0}%`,
            sparkData: stats.billGraph || [0],
            sparkColorVar: "--cshr-secondary-color",
          },
          {
            icon: <IconBag />,
            iconBg: "var(--cshr-accent-amber-tint)",
            iconColor: "var(--cshr-accent-amber)",
            label: "Average Bill",
            value: `₹${stats.averageBill || 0}`,
            change: `${stats.averageGrowth || 0}%`,
            sparkData: stats.averageBillGraph || [0],
            sparkColorVar: "--cshr-accent-amber",
          },
          {
            icon: <IconShoppingBag />,
            iconBg: "var(--cshr-accent-violet-tint)",
            iconColor: "var(--cshr-accent-violet)",
            label: "Items Sold",
            value: stats.itemsSold || 0,
            change: `${stats.itemsGrowth || 0}%`,
            sparkData: stats.itemsGraph || [0],
            sparkColorVar: "--cshr-accent-violet",
          },
        ].map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Bottom two-column section */}
      <div className="cshr-bottom-grid">
        {/* Today's Overview */}
        <section className="cshr-panel cshr-overview-panel">
          <h2 className="cshr-panel-title">Today's Overview</h2>

          <div className="cshr-overview-grid">
            {[
              {
                icon: <IconReceipt />,
                iconBg: "var(--cshr-secondary-tint)",
                iconColor: "var(--cshr-secondary-color)",
                label: "Total Receipts",
                value: `₹${overview.totalReceipts || 0}`,
              },
              {
                icon: <IconLayers />,
                iconBg: "var(--cshr-primary-tint)",
                iconColor: "var(--cshr-primary-color)",
                label: "Cash Received",
                value: `₹${overview.cashReceived || 0}`,
              },
              {
                icon: <IconWallet />,
                iconBg: "var(--cshr-accent-violet-tint)",
                iconColor: "var(--cshr-accent-violet)",
                label: "Card Payments",
                value: `₹${overview.cardPayments || 0}`,
              },
              {
                icon: <IconQr />,
                iconBg: "var(--cshr-accent-amber-tint)",
                iconColor: "var(--cshr-accent-amber)",
                label: "UPI Payments",
                value: `₹${overview.upiPayments || 0}`,
              },
              {
                icon: <IconReturn />,
                iconBg: "var(--cshr-accent-rose-tint)",
                iconColor: "var(--cshr-accent-rose)",
                label: "Returns",
                value: `₹${overview.returns || 0}`,
              },
              {
                icon: <IconDiscount />,
                iconBg: "var(--cshr-secondary-tint)",
                iconColor: "var(--cshr-secondary-color)",
                label: "Discount Given",
                value: `₹${overview.discount || 0}`,
              },
            ].map((tile) => (
              <OverviewTile key={tile.label} {...tile} />
            ))}
          </div>

          <div className="cshr-overview-footer">
            <IconRefresh />
            <span>
              Last updated:{" "}
              {new Date().toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </section>

        {/* Recent Sales */}
        <section className="cshr-panel cshr-sales-panel">
          <div className="cshr-panel-header">
            <h2 className="cshr-panel-title">Recent Sales</h2>
            <a className="cshr-view-all" href="#recent-sales">
              View All <IconArrowRight />
            </a>
          </div>

          <div className="cshr-table-scroll">
            <table className="cshr-sales-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Time</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((row) => (
                  <tr key={row._id || row.invoiceNo}>
                    <td className="cshr-invoice-cell">
                      <IconDoc />
                      <span>{row.invoiceNo}</span>
                    </td>

                    <td>{row.customerName || "Walk-in Customer"}</td>

                    <td className="cshr-muted">
                      {new Date(row.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>

                    <td className="cshr-amount-cell">
                      ₹{Number(row.totalAmount || 0).toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={`cshr-badge ${
                          PAYMENT_CLASS[row.paymentMethod] || ""
                        }`}
                      >
                        {row.paymentMethod}
                      </span>
                    </td>

                    <td>
                      <span className="cshr-status-paid">
                        <i />
                        {row.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="button" className="cshr-view-all-btn">
            <IconDoc />
            View All Sales
          </button>
        </section>
      </div>
    </div>
  );
}
