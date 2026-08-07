import React from "react";
import "./InventoryDashboard.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFullDashboard } from "../../features/Dashboard/GarmentDashboardSlice";

const IconBox = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 8l-9-5-9 5 9 5 9-5z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <path d="M12 13v8" />
  </svg>
);

const IconLayers = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2 2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const IconAlertTriangle = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const IconArrowDown = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14" />
    <path d="M6 13l6 6 6-6" />
  </svg>
);

const IconArrowUp = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 19V5" />
    <path d="M6 11l6-6 6 6" />
  </svg>
);

const IconTrendUp = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 15l5-5 4 4 7-8" />
    <path d="M15 6h5v5" />
  </svg>
);

const IconTrendDown = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 9l5 5 4-4 7 8" />
    <path d="M15 18h5v-5" />
  </svg>
);

const IconChevronRight = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 6l6 6-6 6" />
  </svg>
);

const IconShirt = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 4l4 3-2.5 3L16 8.5V20H8V8.5L6.5 10 4 7l4-3 2 2h4l2-2z" />
  </svg>
);

const IconPants = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 3h12l1 6-1 12h-4l-1-9-1 9H8L7 9 6 3z" />
  </svg>
);

const IconDress = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 3h6l1 4-2 2 4 12H6l4-12-2-2 1-4z" />
  </svg>
);

const IconPlus = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const IconList = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 6h11" />
    <path d="M9 12h11" />
    <path d="M9 18h11" />
    <path d="M4 6h.01" />
    <path d="M4 12h.01" />
    <path d="M4 18h.01" />
  </svg>
);

const IconDoc = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M9 13h6" />
    <path d="M9 17h6" />
  </svg>
);

const IconCoin = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v10" />
    <path d="M9.5 9.5c0-1.4 1.2-2.2 2.5-2.2s2.5.8 2.5 2c0 2.2-5 1.6-5 4 0 1.3 1.2 2.2 2.5 2.2s2.5-.8 2.5-2.2" />
  </svg>
);

const IconCubeOutline = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 8l-9-5-9 5 9 5 9-5z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <path d="M12 13v8" />
  </svg>
);

const IconBan = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M5.5 5.5l13 13" />
  </svg>
);

const IconUsers = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="8" r="3" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <circle cx="17.5" cy="9" r="2.5" />
    <path d="M15 13.2a5.5 5.5 0 0 1 6.5 5.3" />
  </svg>
);

function Sparkline({ color, path }) {
  return (
    <svg
      className="invdash-sparkline"
      viewBox="0 0 260 60"
      preserveAspectRatio="none"
    >
      <path
        d={path}
        fill="none"
        style={{ stroke: color }}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STOCK_SUMMARY = [
  {
    id: "shirts",
    name: "Shirts",
    count: 856,
    percent: 88,
    icon: <IconShirt />,
    iconClass: "invdash-summary-icon--teal",
  },
  {
    id: "tshirts",
    name: "T-Shirts",
    count: 542,
    percent: 60,
    icon: <IconShirt />,
    iconClass: "invdash-summary-icon--mint",
  },
  {
    id: "jeans",
    name: "Jeans",
    count: 412,
    percent: 48,
    icon: <IconPants />,
    iconClass: "invdash-summary-icon--navy",
  },
  {
    id: "pants",
    name: "Pants",
    count: 289,
    percent: 34,
    icon: <IconPants />,
    iconClass: "invdash-summary-icon--peach",
  },
  {
    id: "sarees",
    name: "Sarees",
    count: 247,
    percent: 30,
    icon: <IconDress />,
    iconClass: "invdash-summary-icon--violet",
  },
];

const QUICK_ACTIONS = [
  { id: "stockIn", label: "Stock In", icon: <IconArrowDown /> },
  { id: "stockOut", label: "Stock Out", icon: <IconArrowUp /> },
  { id: "addProduct", label: "Add Product", icon: <IconPlus /> },
  {
    id: "lowStockList",
    label: "Low Stock List",
    icon: <IconAlertTriangle />,
    iconClass: "invdash-action-icon--orange",
  },
  { id: "viewReports", label: "View Reports", icon: <IconDoc /> },
];

/* ==========================================================================
   Component
   ========================================================================== */

export default function InventoryDashboard() {
  const dispatch = useDispatch();

  const {
    summary,
    quickStats,
    lowStockAlerts,
    recentTransactions,
    topSellingProducts,
    isLoading,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getFullDashboard());
  }, [dispatch]);

  const statCards = [
    {
      id: "total",
      label: "Total Products",
      value: summary?.totalProducts || 0,
      icon: <IconBox />,
      iconClass: "invdash-stat-icon--teal",
    },
    {
      id: "instock",
      label: "In Stock",
      value: summary?.inStockProducts || 0,
      icon: <IconLayers />,
      iconClass: "invdash-stat-icon--green",
    },
    {
      id: "lowstock",
      label: "Low Stock",
      value: quickStats?.lowStockItems || 0,
      icon: <IconAlertTriangle />,
      iconClass: "invdash-stat-icon--orange",
    },
    {
      id: "stockvalue",
      label: "Stock Value",
      value: `₹${quickStats?.inventoryValue || 0}`,
      icon: <IconArrowDown />,
      iconClass: "invdash-stat-icon--blue",
    },
  ];

  const inventorySummary = [
    {
      id: "value",
      label: "Inventory Value",
      value: `₹${quickStats?.inventoryValue || 0}`,
      icon: <IconCoin />,
      iconClass: "invdash-summary-row-icon--teal",
    },
    {
      id: "products",
      label: "Products",
      value: summary?.totalProducts || 0,
      icon: <IconCubeOutline />,
      iconClass: "invdash-summary-row-icon--navy",
    },
    {
      id: "lowstock",
      label: "Low Stock",
      value: quickStats?.lowStockItems || 0,
      icon: <IconBan />,
      iconClass: "invdash-summary-row-icon--red",
    },
    {
      id: "suppliers",
      label: "Suppliers",
      value: quickStats?.totalSuppliers || 0,
      icon: <IconUsers />,
      iconClass: "invdash-summary-row-icon--slate",
    },
  ];

  return (
    <div className="invdash-root">
      <div className="invdash-container">
        {/* Row 1 — headline stats */}
        <section className="invdash-stats-row">
          {statCards.map((stat) => (
            <article className="invdash-card invdash-stat-card" key={stat.id}>
              <div className="invdash-stat-top">
                <div className={`invdash-stat-icon ${stat.iconClass}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="invdash-stat-label">{stat.label}</p>
                  <div className="invdash-stat-value">{stat.value}</div>
                </div>
              </div>

              <div className="invdash-stat-bottom">
                <span
                  className={`invdash-stat-delta invdash-stat-delta--${stat.direction}`}
                >
                  {stat.direction === "up" ? (
                    <IconTrendUp />
                  ) : (
                    <IconTrendDown />
                  )}
                  {stat.delta}
                </span>
                <span className="invdash-stat-compare">vs yesterday</span>
              </div>

              <Sparkline color={stat.sparkColor} path={stat.sparkPath} />
            </article>
          ))}
        </section>

        {/* Row 2 — stock summary + recent activity */}
        <section className="invdash-row-two">
          <article className="invdash-card">
            <div className="invdash-card-head">
              <h2 className="invdash-card-title">Stock Summary</h2>
              <button className="invdash-view-all" type="button">
                View All
              </button>
            </div>

            <ul className="invdash-summary-list">
              {STOCK_SUMMARY.map((row) => (
                <li className="invdash-summary-item" key={row.id}>
                  <span className={`invdash-summary-icon ${row.iconClass}`}>
                    {row.icon}
                  </span>
                  <span className="invdash-summary-info">
                    <p className="invdash-summary-name">{row.name}</p>
                    <span className="invdash-summary-track">
                      <span
                        className="invdash-summary-fill"
                        style={{ width: `${row.percent}%` }}
                      />
                    </span>
                  </span>
                  <span className="invdash-summary-count">{row.count}</span>
                  <span className="invdash-summary-chevron">
                    <IconChevronRight />
                  </span>
                </li>
              ))}
            </ul>

            <div className="invdash-summary-legend">
              <span className="invdash-legend-item">
                <span className="invdash-legend-dot invdash-legend-dot--filled" />{" "}
                In Stock
              </span>
              <span className="invdash-legend-item">
                <span className="invdash-legend-dot invdash-legend-dot--empty" />{" "}
                Remaining
              </span>
            </div>
          </article>

          <article className="invdash-card">
            <div className="invdash-card-head">
              <h2 className="invdash-card-title">Recent Stock Activities</h2>
              <button className="invdash-view-all" type="button">
                View All
              </button>
            </div>

            <div className="invdash-table-wrap">
              <table className="invdash-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Type</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <span
                          className={`invdash-ref invdash-ref--${row.type === "Purchase" ? "Stock In" : "Stock Out"}`}
                        >
                          {row.referenceNo}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`invdash-type-pill invdash-type-pill--${row.type === "Purchase" ? "Stock In" : "Stock Out"}`}
                        >
                          {row.type === "Purchase" ? (
                            <IconArrowDown />
                          ) : (
                            <IconArrowUp />
                          )}
                          {row.type === "Purchase" ? "Stock In" : "Stock Out"}
                        </span>
                      </td>
                      <td className="invdash-item-name">{row.party}</td>
                      <td className="invdash-qty">{row.amount}</td>
                      {new Date(row.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        {/* Row 3 — low stock, inventory summary, quick actions */}
        <section className="invdash-row-three">
          <article className="invdash-card">
            <div className="invdash-card-head">
              <h2 className="invdash-card-title">Low Stock Alerts</h2>
              <button className="invdash-view-all" type="button">
                View All
              </button>
            </div>

            <ul className="invdash-alert-list">
              {lowStockAlerts.map((row) => (
                <li className="invdash-alert-item" key={row._id}>
                  <span
                    className="invdash-alert-thumb"
                    style={{ background: row.color }}
                    aria-hidden="true"
                  />
                  <span className="invdash-alert-info">
                    <p className="invdash-alert-name">{row.productName}</p>
                    <span className="invdash-alert-sku">
                      SKU: {row.sku || "-"}
                    </span>
                  </span>
                  <span className="invdash-alert-stock">
                    <span className="invdash-alert-count">
                      {row.stockQuantity}
                    </span>
                    <span className="invdash-alert-status">In Stock</span>
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className="invdash-card">
            <div className="invdash-card-head">
              <h2 className="invdash-card-title">Inventory Summary</h2>
            </div>

            <ul className="invdash-summary-rows">
              {inventorySummary.map((row) => (
                <li className="invdash-summary-row" key={row.id}>
                  <span className={`invdash-summary-row-icon ${row.iconClass}`}>
                    {row.icon}
                  </span>
                  <span className="invdash-summary-row-label">{row.label}</span>
                  <span className="invdash-summary-row-value">{row.value}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="invdash-card">
            <div className="invdash-card-head">
              <h2 className="invdash-card-title">Quick Actions</h2>
            </div>

            <div className="invdash-actions-grid">
              {QUICK_ACTIONS.map((action) => (
                <button
                  className="invdash-action-btn"
                  type="button"
                  key={action.id}
                >
                  <span
                    className={`invdash-action-icon ${action.iconClass || ""}`}
                  >
                    {action.icon}
                  </span>
                  <span className="invdash-action-label">{action.label}</span>
                </button>
              ))}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
