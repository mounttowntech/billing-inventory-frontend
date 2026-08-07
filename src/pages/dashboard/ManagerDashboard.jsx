import React from "react";
import "./ManagerDashboard.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getManagerDashboard } from "../../features/Dashboard/ManagerDashboardSlice";

const iconBase = (size, color) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: color,
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

function ShoppingBag({ size = 20, color = "currentColor" }) {
  return (
    <svg {...iconBase(size, color)}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function ShoppingCart({ size = 20, color = "currentColor" }) {
  return (
    <svg {...iconBase(size, color)}>
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 2-1.58l1.65-7.42H5.12" />
    </svg>
  );
}

function TrendingUp({ size = 20, color = "currentColor" }) {
  return (
    <svg {...iconBase(size, color)}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function FileText({ size = 20, color = "currentColor" }) {
  return (
    <svg {...iconBase(size, color)}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2Z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
      <line x1="8" y1="9" x2="10" y2="9" />
    </svg>
  );
}

function Package({ size = 20, color = "currentColor" }) {
  return (
    <svg {...iconBase(size, color)}>
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  );
}

function AlertTriangle({ size = 20, color = "currentColor" }) {
  return (
    <svg {...iconBase(size, color)}>
      <path d="m10.29 3.86-8.18 14.14A2 2 0 0 0 3.82 21h16.36a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function Truck({ size = 20, color = "currentColor" }) {
  return (
    <svg {...iconBase(size, color)}>
      <path d="M1 3h15v13H1z" />
      <path d="M16 8h4l3 3v5h-7V8Z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function CreditCard({ size = 20, color = "currentColor" }) {
  return (
    <svg {...iconBase(size, color)}>
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function Users({ size = 20, color = "currentColor" }) {
  return (
    <svg {...iconBase(size, color)}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function UserCheck({ size = 20, color = "currentColor" }) {
  return (
    <svg {...iconBase(size, color)}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </svg>
  );
}

function ChevronDown({ size = 20, color = "currentColor" }) {
  return (
    <svg {...iconBase(size, color)}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function Shirt({ size = 20, color = "currentColor" }) {
  return (
    <svg {...iconBase(size, color)}>
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z" />
    </svg>
  );
}

const user = JSON.parse(localStorage.getItem("billing_user"));

const userName = user?.firstName || "Manager";

/*  CHART HELPERS*/

function buildSmoothPath(coords) {
  if (coords.length < 2) return "";
  let path = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i];
    const p1 = coords[i + 1];
    const midX = (p0.x + p1.x) / 2;
    path += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return path;
}

function SalesChart({ data }) {
  const width = 560;
  const height = 220;
  const paddingX = 8;
  const paddingTop = 10;
  const paddingBottom = 10;

  const points = data?.points || [];

  const step =
    points.length > 1 ? (width - paddingX * 2) / (points.length - 1) : 0;

  const coords = points.map((p, i) => {
    const x = paddingX + step * i;
    const ratio = (p.value || 0) / (data?.maxValue || 1);
    const y = paddingTop + (height - paddingTop - paddingBottom) * (1 - ratio);

    return { x, y, ...p };
  });

  const linePath = buildSmoothPath(coords);
  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`
      : "";
  return (
    <div className="mgr-dash-chart-wrap">
      <div className="mgr-dash-chart-yaxis">
        {data.yAxis.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="mgr-dash-chart-plot">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="mgr-dash-chart-svg"
        >
          <defs>
            <linearGradient id="salesAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--primary-color)"
                stopOpacity="0.28"
              />
              <stop
                offset="100%"
                stopColor="var(--primary-color)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* horizontal gridlines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="0"
              x2={width}
              y1={(height / 4) * i}
              y2={(height / 4) * i}
              className="mgr-dash-chart-gridline"
            />
          ))}

          <path d={areaPath} fill="url(#salesAreaGradient)" stroke="none" />
          <path d={linePath} fill="none" className="mgr-dash-chart-line" />

          {coords.map((c) => (
            <circle
              key={c.day}
              cx={c.x}
              cy={c.y}
              r="4.5"
              className="mgr-dash-chart-dot"
            />
          ))}
        </svg>
        <div className="mgr-dash-chart-xaxis">
          {points.map((p) => (
            <span key={p.day}>{p.day}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  const dispatch = useDispatch();

  const {
    today,
    totalSales,
    salesOverview,
    quickSummary,
    recentSales,
    lowStockItemsList,
    isLoading,
  } = useSelector((state) => state.managerDashboard);

  useEffect(() => {
    dispatch(getManagerDashboard({ period: "week" }));
  }, [dispatch]);

  const statCards = [
    {
      id: "sales",
      label: "Today's Sales",
      value: `₹${today?.sales || 0}`,
      icon: ShoppingBag,
    },
    {
      id: "orders",
      label: "Today's Orders",
      value: today?.orders || 0,
      icon: ShoppingCart,
    },
    {
      id: "profit",
      label: "Today's Profit",
      value: `₹${today?.profit || 0}`,
      icon: TrendingUp,
    },
    {
      id: "totalSales",
      label: "Total Sales",
      value: `₹${totalSales || 0}`,
      icon: FileText,
    },
  ];

  const points =
    salesOverview?.series?.map((item) => ({
      day: new Date(item.date).toLocaleDateString("en-IN", {
        weekday: "short",
      }),
      value: item.total,
    })) || [];

  const chartData = {
    rangeLabel: salesOverview?.period || "Week",
    yAxis: ["₹100K", "₹75K", "₹50K", "₹25K", "₹0"],
    points,
    maxValue: Math.max(...points.map((p) => p.value), 1),
  };

  const quickSummaryCards = [
    {
      id: "inventory",
      label: "Inventory Value",
      value: `₹${quickSummary?.inventoryValue || 0}`,
      icon: Package,
      tone: "default",
    },
    {
      id: "lowstock",
      label: "Low Stock Items",
      value: quickSummary?.lowStockItems || 0,
      icon: AlertTriangle,
      tone: "alert",
    },
    {
      id: "pending",
      label: "Pending Purchase",
      value: quickSummary?.pendingPurchase || 0,
      icon: Truck,
      tone: "default",
    },
    {
      id: "expenses",
      label: "Today's Expenses",
      value: `₹${quickSummary?.todaysExpenses || 0}`,
      icon: CreditCard,
      tone: "default",
    },
    {
      id: "customers",
      label: "Customers",
      value: quickSummary?.customers || 0,
      icon: Users,
      tone: "default",
    },
    {
      id: "staff",
      label: "Staff Present",
      value: quickSummary?.staffPresent || 0,
      icon: UserCheck,
      tone: "default",
    },
  ];

  return (
    <div className="mgr-dash-dashboard">
      <div className="mgr-dash-dashboard__inner">
        {/* Greeting */}
        <header className="mgr-dash-dashboard-header">
          <h1>Welcome back, {userName}!</h1>
          <p>Here&apos;s what&apos;s happening in your store today.</p>
        </header>

        {/* Stat cards */}
        <section className="mgr-dash-stat-grid">
          {statCards.map(({ id, label, value, change, icon: Icon }) => (
            <div className="mgr-dash-stat-card" key={id}>
              <div className="mgr-dash-stat-card__icon">
                <Icon size={22} />
              </div>
              <div className="mgr-dash-stat-card__body">
                <p className="mgr-dash-stat-card__label">{label}</p>
                <p className="mgr-dash-stat-card__value">{value}</p>
                {/* <p className="mgr-dash-stat-card__change">
                  <span className="mgr-dash-stat-card__arrow">↑</span> {change}{" "}
                  vs yesterday
                </p> */}
              </div>
            </div>
          ))}
        </section>

        {/* Sales overview + Quick summary */}
        <section className="mgr-dash-mid-grid">
          <div className="mgr-dash-panel mgr-dash-panel--chart">
            <div className="mgr-dash-panel__header">
              <h2>
                Sales Overview{" "}
                <span className="mgr-dash-panel__subtitle">(This Week)</span>
              </h2>
              <button type="button" className="mgr-dash-range-select">
                {chartData.rangeLabel}
                <ChevronDown size={16} />
              </button>
            </div>
            <SalesChart data={chartData} />{" "}
          </div>

          <div className="mgr-dash-panel mgr-dash-panel--summary">
            <div className="mgr-dash-panel__header">
              <h2>Quick Summary</h2>
            </div>
            <ul className="mgr-dash-summary-list">
              {quickSummaryCards.map(
                ({ id, label, value, icon: Icon, tone }) => (
                  <li className="mgr-dash-summary-row" key={id}>
                    <span
                      className={`mgr-dash-summary-row__icon mgr-dash-summary-row__icon--${tone}`}
                    >
                      <Icon size={18} />
                    </span>
                    <span className="mgr-dash-summary-row__label">{label}</span>
                    <span
                      className={`mgr-dash-summary-row__value mgr-dash-summary-row__value--${tone}`}
                    >
                      {value}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </section>

        {/* Recent sales + Low stock */}
        <section className="mgr-dash-bottom-grid">
          <div className="mgr-dash-panel mgr-dash-panel--table">
            <div className="mgr-dash-panel__header">
              <h2>Recent Sales</h2>
              <a href="#recent-sales" className="mgr-dash-view-all">
                View All
              </a>
            </div>
            <div className="mgr-dash-table-scroll">
              <table className="mgr-dash-data-table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Customer</th>
                    <th>Time</th>
                    <th>Amount</th>
                    <th>Payment Type</th>
                    <th>Cashier</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((row) => (
                    <tr key={row.referenceNo}>
                      <td className="mgr-dash-cell-link">{row.invoiceNo}</td>
                      <td>{row.customer}</td>
                      <td className="mgr-dash-cell-muted">
                        {new Date(row.date).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td className="mgr-dash-cell-strong">{row.amount}</td>
                      <td>{row.paymentType}</td>
                      <td>{row.cashier}</td>
                      <td>
                        <span className="mgr-dash-status-pill">
                          <span className="mgr-dash-status-pill__dot" />{" "}
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mgr-dash-panel mgr-dash-panel--table">
            <div className="mgr-dash-panel__header">
              <h2>Low Stock Items</h2>
              <a href="#low-stock" className="mgr-dash-view-all">
                View All
              </a>
            </div>
            <div className="mgr-dash-table-scroll">
              <table className="mgr-dash-data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItemsList.map((row) => (
                    <tr key={row.product}>
                      <td>
                        <div className="mgr-dash-product-cell">
                          <span
                            className="mgr-dash-product-cell__swatch"
                            style={{ backgroundColor: row.swatch }}
                          >
                            <Shirt size={16} color="#fff" />
                          </span>
                          <span className="mgr-dash-product-cell__name">
                            {row.product}
                          </span>
                        </div>
                      </td>
                      <td className="mgr-dash-cell-muted">{row.category}</td>
                      <td className="mgr-dash-cell-danger">{row.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
