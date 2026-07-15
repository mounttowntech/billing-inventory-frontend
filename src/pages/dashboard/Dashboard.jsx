import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getPurchases } from "../../features/purchase/purchaseSlice";
import "./Dashboard.css";
import {
  AddButton,
  SaveButton,
  PreviousButton,
  NextButton,
  EditButton,
  DeleteButton,
} from "../../components/Common/Button";
import {
  getFullDashboard,
  getRecentTransactions,
} from "../../features/Dashboard/GarmentDashboardSlice";

import { dashboardFilterValidation } from "../../validations/Dashboardvalidation";

/* ==========================================
   Helpers
========================================== */

const formatINR = (amount = 0) =>
  `\u20B9${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "-";

const toInputDate = (date) => new Date(date).toISOString().slice(0, 10);

const defaultStartDate = () => {
  const now = new Date();
  return toInputDate(new Date(now.getFullYear(), now.getMonth(), 1));
};

const defaultEndDate = () => toInputDate(new Date());

/* ==========================================
   Icons
========================================== */

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

/** Smooth-ish sparkline built from a plain array of numbers. Renders nothing if there isn't enough data. */
const Sparkline = ({ data, accent, width = 240, height = 64 }) => {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 8) - 4;
    return [x, y];
  });

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

/* ==========================================
   Build stat cards from real API data
========================================== */

const buildStatCards = (summary, quickStats, salesOverview) => {
  const salesSpark =
    salesOverview?.thisMonth?.map((d) => d.total).filter((v) => v != null) ||
    null;

  return [
    {
      key: "sales",
      label: "Total Sales",
      value: formatINR(summary?.totalSales?.amount),
      trendValue: `${Math.abs(summary?.totalSales?.changePercent || 0)}%`,
      trendLabel: "vs previous period",
      up: (summary?.totalSales?.changePercent || 0) >= 0,
      accent: "blue",
      icon: "bag",
      spark: salesSpark,
    },
    {
      key: "purchase",
      label: "Total Purchases",
      value: formatINR(summary?.totalPurchases?.amount),
      trendValue: `${Math.abs(summary?.totalPurchases?.changePercent || 0)}%`,
      trendLabel: "vs previous period",
      up: (summary?.totalPurchases?.changePercent || 0) >= 0,
      accent: "green",
      icon: "cart",
      spark: null,
    },
    {
      key: "lowstock",
      label: "Low Stock",
      value: String(quickStats?.lowStockItems ?? 0),
      trendValue: `${quickStats?.lowStockItems ?? 0} items`,
      trendLabel: "need reorder",
      up: false,
      accent: "orange",
      icon: "stack",
      spark: null,
    },
    {
      key: "pnl",
      label: "Net Profit",
      value: formatINR(summary?.netProfit?.amount),
      trendValue: `${Math.abs(summary?.netProfit?.changePercent || 0)}%`,
      trendLabel: "vs previous period",
      up: (summary?.netProfit?.changePercent || 0) >= 0,
      accent: "purple",
      icon: "trend",
      spark: null,
    },
  ];
};

const STATUS_CLASS_MAP = {
  paid: "badge-paid",
  received: "badge-paid",
  pending: "badge-pending",
  partial: "badge-pending",
  overdue: "badge-overdue",
  unpaid: "badge-overdue",
};

const Dashboard = () => {
  const dispatch = useDispatch();

  const {
    summary,
    salesOverview,
    quickStats,
    recentTransactions,
    isLoading,
    isError,
    message,
  } = useSelector((state) => state.dashboard);

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(dashboardFilterValidation),
    defaultValues: {
      startDate: defaultStartDate(),
      endDate: defaultEndDate(),
    },
  });

  // ================= Load Data =================
  useEffect(() => {
    dispatch(getPurchases());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getFullDashboard({
        startDate: defaultStartDate(),
        endDate: defaultEndDate(),
      }),
    );
  }, [dispatch]);

  // ================= Filter Submit =================

  const onApplyFilter = (values) => {
    dispatch(getFullDashboard(values));
  };

  // ================= View All Transactions =================

  const handleViewAll = () => {
    dispatch(getRecentTransactions({ limit: 50 }));
  };

  const handleAddSale = () => {
    console.log("Add new sale clicked");
  };

  const statCards = useMemo(
    () => buildStatCards(summary, quickStats, salesOverview),
    [summary, quickStats, salesOverview],
  );

  // Only show "Sale" type rows in the Recent Sales table
  const recentSales = useMemo(
    () => (recentTransactions || []).filter((item) => item.type === "Sale"),
    [recentTransactions],
  );

  return (
    <div className="dashboard">
      {/* ===== Date range filter ===== */}
      <form className="dashboard-filter" onSubmit={handleSubmit(onApplyFilter)}>
        <div className="filter-group">
          <label htmlFor="startDate">From</label>
          <input id="startDate" type="date" {...register("startDate")} />
        </div>
        <div className="filter-group">
          <label htmlFor="endDate">To</label>
          <input id="endDate" type="date" {...register("endDate")} />
        </div>
        <button type="submit" className="filter-apply-btn" disabled={isLoading}>
          {isLoading ? "Loading..." : "Apply"}
        </button>
      </form>

      {isError && message && <div className="dashboard-error">{message}</div>}

      {/* ===== Stat cards ===== */}
      <div className="stat-grid">
        {statCards.map((card) => (
          <StatCard card={card} key={card.key} />
        ))}
      </div>

      {/* ===== Recent sales table ===== */}
      <div className="card sales-card">
        <div className="sales-header">
          <div>
            <h2 className="sales-title">Recent Sales</h2>
            <p className="sales-subtitle">
              Monitoring your latest transactions
            </p>
          </div>
          {/* <AddButton onClick={handleAddSale}>
            <span>+</span> Add New Sale
          </AddButton> */}
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
              {recentSales.map((sale) => (
                <tr key={sale.referenceNo}>
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
                      <span className="invoice-id">{sale.referenceNo}</span>
                    </div>
                  </td>
                  <td>{sale.party}</td>
                  <td className="muted-cell">{formatDate(sale.date)}</td>
                  <td className="total-cell">{formatINR(sale.amount)}</td>
                  <td>
                    <span
                      className={`badge ${
                        STATUS_CLASS_MAP[(sale.status || "").toLowerCase()] ||
                        "badge-default"
                      }`}
                    >
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
          {/* <button className="view-all-btn" onClick={handleViewAll}>
            View All Transactions <span className="arrow">&rarr;</span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
