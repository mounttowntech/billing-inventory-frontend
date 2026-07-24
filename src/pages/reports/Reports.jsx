import React, { useState, useEffect, useMemo } from "react";
import "./Report.css";

/* ==========================================================================
   REPORT DASHBOARD
   --------------------------------------------------------------------------
   Self-contained React component. No external packages (no chart libs, no
   icon libs) — every icon and every chart (sparklines, line chart, donut
   chart) is hand-built inline SVG so the whole page has zero dependencies.

   All class names are prefixed "rpx-" (Report Page X) so this file can sit
   next to other pages / component libraries without colliding with anyone
   else's ".card", ".table", ".button", etc.

   HOW TO EDIT THE CONTENT
   --------------------------------------------------------------------------
   Every number/label on the page lives in the plain data objects/arrays
   below (STAT_CARDS, SALES_TREND, CATEGORY_DATA, PAYMENT_SUMMARY,
   TOP_PRODUCTS). Change the values there and the charts, totals and tables
   redraw themselves automatically — no need to touch the JSX/SVG markup.
   ========================================================================== */

/* -------------------------------- ICONS ---------------------------------- */
/* Tiny, dependency-free icon components. Pass `size` / className as needed. */

const IconBag = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M6 8h12l-1 12H7L6 8Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M9 8V6a3 3 0 0 1 6 0v2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconOrders = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect
      x="6"
      y="4"
      width="12"
      height="16"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path d="M9 3.5h6v2H9z" fill="currentColor" />
    <path
      d="M9 10h6M9 13h6M9 16h3.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const IconProfit = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M12 3 3 8l9 5 9-5-9-5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M3 12l9 5 9-5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M3 16l9 5 9-5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const IconCart = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M3 4h2l1.6 10.2A2 2 0 0 0 8.6 16H17a2 2 0 0 0 2-1.6L20.4 7H6.2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="20" r="1.4" fill="currentColor" />
    <circle cx="17" cy="20" r="1.4" fill="currentColor" />
  </svg>
);

const IconArrowUp = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M12 19V5M6 11l6-6 6 6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconCalendar = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect
      x="3.5"
      y="5"
      width="17"
      height="15"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="M3.5 9.5h17M8 3v3M16 3v3"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const IconChevronDown = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconReset = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M4 12a8 8 0 1 1 2.6 5.9"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
    <path
      d="M4 17v-4h4"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconDownload = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M12 3v12m0 0-4-4m4 4 4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconClock = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M12 7.5V12l3 2"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconRefresh = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M20 11A8 8 0 1 0 18.6 15"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
    <path
      d="M20 5v6h-6"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconCash = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect
      x="2.5"
      y="6"
      width="19"
      height="12"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const IconUpi = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M6 4l7 8-7 8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 4l7 8-7 8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconCard = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect
      x="2.5"
      y="5"
      width="19"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path d="M2.5 9.5h19" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const IconBank = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M3 10 12 4l9 6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 10v8M9 10v8M15 10v8M19.5 10v8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M3 20h18"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const IconShirt = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M8 4 4 7l2 3 2-1v11h8V9l2 1 2-3-4-3-2 2-2-2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const IconPants = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M7 3h10l1 17-4 1-1.5-11L11 21l-4-1L7 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const IconGrid = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect
      x="3.5"
      y="3.5"
      width="6.5"
      height="6.5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <rect
      x="14"
      y="3.5"
      width="6.5"
      height="6.5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <rect
      x="3.5"
      y="14"
      width="6.5"
      height="6.5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <rect
      x="14"
      y="14"
      width="6.5"
      height="6.5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.6"
    />
  </svg>
);

/* --------------------------------- DATA ----------------------------------- */
/* Edit these objects/arrays to change everything shown on the page. */

const DATE_RANGE_LABEL = "01 Jul 2025 - 15 Jul 2025";

const STAT_CARDS = [
  {
    id: "sales",
    label: "Total Sales",
    value: "₹82,004.50",
    growth: "12.4%",
    icon: IconBag,
    accent: "blue",
    spark: [30, 34, 33, 40, 38, 45, 42, 50, 48, 55, 52, 60],
  },
  {
    id: "orders",
    label: "Total Orders",
    value: "356",
    growth: "8.7%",
    icon: IconOrders,
    accent: "deepblue",
    spark: [20, 25, 24, 30, 42, 38, 34, 40, 36, 44, 40, 46],
  },
  {
    id: "profit",
    label: "Total Profit",
    value: "₹19,650.00",
    growth: "15.3%",
    icon: IconProfit,
    accent: "purple",
    spark: [42, 38, 44, 40, 36, 30, 34, 28, 24, 20, 16, 12],
  },
  {
    id: "aov",
    label: "Average Order Value",
    value: "₹230.35",
    growth: "5.6%",
    icon: IconCart,
    accent: "lightpurple",
    spark: [30, 45, 26, 40, 22, 48, 24, 42, 20, 44, 26, 38],
  },
];

/* 15 points = 01 Jul .. 15 Jul, values in thousands of ₹ */
const SALES_TREND = {
  labels: [
    "01 Jul",
    "02 Jul",
    "03 Jul",
    "04 Jul",
    "05 Jul",
    "06 Jul",
    "07 Jul",
    "08 Jul",
    "09 Jul",
    "10 Jul",
    "11 Jul",
    "12 Jul",
    "13 Jul",
    "14 Jul",
    "15 Jul",
  ],
  current: [38, 52, 65, 88, 70, 60, 42, 38, 62, 45, 68, 55, 45, 68, 85],
  previous: [24, 30, 34, 46, 50, 42, 35, 24, 20, 15, 26, 34, 30, 40, 46],
  yMax: 100, // in thousands
  yStep: 20,
};

const CATEGORY_DATA = [
  { label: "Shirts", amount: "₹28,450.00", percent: 34.7, color: "deepblue" },
  { label: "T-Shirts", amount: "₹18,760.00", percent: 22.9, color: "blue" },
  { label: "Pants", amount: "₹15,630.00", percent: 19.1, color: "purple" },
  { label: "Jeans", amount: "₹11,250.00", percent: 13.7, color: "lightpurple" },
  { label: "Others", amount: "₹7,914.50", percent: 9.6, color: "darkblue" },
];
const CATEGORY_TOTAL = "₹82,004.50";

const PAYMENT_SUMMARY = [
  {
    method: "Cash",
    icon: IconCash,
    transactions: 142,
    amount: "₹32,450.00",
    discount: "₹1,250.00",
    net: "₹31,200.00",
  },
  {
    method: "UPI",
    icon: IconUpi,
    transactions: 158,
    amount: "₹28,760.00",
    discount: "₹950.00",
    net: "₹27,810.00",
  },
  {
    method: "Card",
    icon: IconCard,
    transactions: 38,
    amount: "₹12,450.00",
    discount: "₹450.00",
    net: "₹12,000.00",
  },
  {
    method: "Net Banking",
    icon: IconBank,
    transactions: 18,
    amount: "₹8,344.50",
    discount: "₹200.00",
    net: "₹8,144.50",
  },
];
const PAYMENT_TOTAL = {
  transactions: 356,
  amount: "₹82,004.50",
  discount: "₹2,850.00",
  net: "₹79,154.50",
};

const TOP_PRODUCTS = [
  { name: "Formal Shirt", qty: 128, total: "₹12,800.00", icon: IconShirt },
  { name: "Denim Jeans", qty: 96, total: "₹11,810.00", icon: IconPants },
  { name: "T-Shirt", qty: 85, total: "₹8,925.00", icon: IconShirt },
  { name: "Cotton Pant", qty: 74, total: "₹7,770.00", icon: IconPants },
  { name: "Jacket", qty: 62, total: "₹6,200.00", icon: IconShirt },
];

const REPORT_GENERATED_AT = "15 Jul 2025, 10:45 AM";
const AUTO_REFRESH_SECONDS = 165; // 02:45

/* ------------------------------- HELPERS ----------------------------------- */

/** Builds an SVG polyline "d" attribute string from an array of numeric
 *  values, scaled into the given pixel width/height. */
function buildLinePoints(values, width, height, max) {
  const stepX = width / (values.length - 1);
  return values.map((v, i) => {
    const x = i * stepX;
    const y = height - (v / max) * height;
    return [x, y];
  });
}

function pointsToPath(points) {
  return points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
}

function buildAreaPath(points, height) {
  const line = pointsToPath(points);
  const [firstX] = points[0];
  const [lastX] = points[points.length - 1];
  return `${line} L${lastX.toFixed(2)},${height} L${firstX.toFixed(2)},${height} Z`;
}

function buildSparkPath(values, width, height) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);
  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y];
  });
  return pointsToPath(points);
}

/* --------------------------------- PAGE ------------------------------------ */

export default function ReportDashboard() {
  const [secondsLeft, setSecondsLeft] = useState(AUTO_REFRESH_SECONDS);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s <= 0 ? AUTO_REFRESH_SECONDS : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const countdownLabel = useMemo(() => {
    const m = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(secondsLeft % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  }, [secondsLeft]);

  /* ---- line chart geometry ---- */
  const CHART_W = 640;
  const CHART_H = 220;
  const currentPoints = buildLinePoints(
    SALES_TREND.current,
    CHART_W,
    CHART_H,
    SALES_TREND.yMax,
  );
  const previousPoints = buildLinePoints(
    SALES_TREND.previous,
    CHART_W,
    CHART_H,
    SALES_TREND.yMax,
  );
  const currentLinePath = pointsToPath(currentPoints);
  const previousLinePath = pointsToPath(previousPoints);
  const currentAreaPath = buildAreaPath(currentPoints, CHART_H);
  const gridRows = [];
  for (let v = 0; v <= SALES_TREND.yMax; v += SALES_TREND.yStep)
    gridRows.push(v);

  /* ---- donut chart geometry ---- */
  const DONUT_SIZE = 176;
  const DONUT_R = 66;
  const DONUT_STROKE = 26;
  const circumference = 2 * Math.PI * DONUT_R;
  let cumulative = 0;
  const donutSegments = CATEGORY_DATA.map((c) => {
    const dash = (c.percent / 100) * circumference;
    const seg = {
      ...c,
      dashArray: `${dash} ${circumference - dash}`,
      dashOffset: -((cumulative / 100) * circumference),
    };
    cumulative += c.percent;
    return seg;
  });

  return (
    // rpx-dashboard-container is what makes the layout respond to the space
    // actually left over next to your sidebar (container queries), instead
    // of the full browser window. Keep this outer wrapper when you drop the
    // component into your existing page's main content column.
    <div className="rpx-dashboard-container">
      <div className="rpx-dashboard">
        {/* ============================= HEADER (shared) ============================= */}
        <header className="rpx-header rpx-panel">
          <div className="rpx-header-left">
            <span className="rpx-field-label">Date Range</span>
            <button type="button" className="rpx-date-select">
              <IconCalendar className="rpx-icon-16" />
              <span>{DATE_RANGE_LABEL}</span>
              <IconChevronDown className="rpx-icon-16 rpx-date-select-chevron" />
            </button>
          </div>
          <div className="rpx-header-right">
            <button type="button" className="rpx-btn rpx-btn-ghost">
              <IconReset className="rpx-icon-16" />
              <span>Reset</span>
            </button>
            <button type="button" className="rpx-btn rpx-btn-primary">
              <IconDownload className="rpx-icon-16" />
              <span>Export Report</span>
            </button>
          </div>
        </header>

        {/* ============================== STAT CARDS ================================ */}
        <section className="rpx-stats-grid">
          {STAT_CARDS.map((card) => {
            const Icon = card.icon;
            const sparkPath = buildSparkPath(card.spark, 220, 40);
            return (
              <div className="rpx-panel rpx-stat-card" key={card.id}>
                <div className="rpx-stat-card-top">
                  <span className={`rpx-stat-icon rpx-accent-${card.accent}`}>
                    <Icon className="rpx-icon-20" />
                  </span>
                  <div className="rpx-stat-info">
                    <span className="rpx-stat-label">{card.label}</span>
                    <span className="rpx-stat-value">{card.value}</span>
                  </div>
                </div>
                <div className="rpx-stat-growth">
                  <IconArrowUp className="rpx-icon-12 rpx-growth-icon" />
                  <span className="rpx-growth-value">{card.growth}</span>
                  <span className="rpx-growth-caption">vs previous period</span>
                </div>
                <svg
                  className="rpx-sparkline"
                  viewBox="0 0 220 40"
                  preserveAspectRatio="none"
                >
                  <path
                    d={sparkPath}
                    className={`rpx-sparkline-path rpx-accent-stroke-${card.accent}`}
                    fill="none"
                  />
                </svg>
              </div>
            );
          })}
        </section>

        {/* ============================ TREND + CATEGORY ============================= */}
        <section className="rpx-row-2col">
          {/* -------- Sales Trend -------- */}
          <div className="rpx-panel rpx-trend-panel">
            <div className="rpx-panel-header">
              <h2 className="rpx-panel-title">Sales Trend</h2>
              <div className="rpx-legend">
                <span className="rpx-legend-item">
                  <span className="rpx-legend-swatch rpx-legend-swatch-solid" />{" "}
                  Current Period
                </span>
                <span className="rpx-legend-item">
                  <span className="rpx-legend-swatch rpx-legend-swatch-dashed" />{" "}
                  Previous Period
                </span>
              </div>
            </div>

            <div className="rpx-trend-chart-wrap">
              <div className="rpx-trend-y-axis">
                {[...gridRows].reverse().map((v) => (
                  <span key={v}>{v === 0 ? "0" : `${v}K`}</span>
                ))}
              </div>
              <div className="rpx-trend-chart">
                <svg
                  className="rpx-trend-svg"
                  viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="rpxTrendFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--rpx-deepblue)"
                        stopOpacity="0.28"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--rpx-deepblue)"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  {gridRows.map((v) => {
                    const y = CHART_H - (v / SALES_TREND.yMax) * CHART_H;
                    return (
                      <line
                        key={v}
                        x1="0"
                        x2={CHART_W}
                        y1={y}
                        y2={y}
                        className="rpx-trend-gridline"
                      />
                    );
                  })}

                  <path
                    d={currentAreaPath}
                    fill="url(#rpxTrendFill)"
                    stroke="none"
                  />
                  <path
                    d={previousLinePath}
                    className="rpx-trend-line-previous"
                    fill="none"
                  />
                  <path
                    d={currentLinePath}
                    className="rpx-trend-line-current"
                    fill="none"
                  />

                  {currentPoints.map(([x, y], i) => (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="3.4"
                      className="rpx-trend-dot"
                    />
                  ))}
                </svg>
              </div>
            </div>

            <div className="rpx-trend-x-axis">
              {SALES_TREND.labels
                .filter((_, i) => i % 2 === 0)
                .map((label) => (
                  <span key={label}>{label}</span>
                ))}
            </div>
          </div>

          {/* -------- Sales by Category -------- */}
          <div className="rpx-panel rpx-category-panel">
            <div className="rpx-panel-header">
              <h2 className="rpx-panel-title">Sales by Category</h2>
              <button type="button" className="rpx-mini-select">
                <span>All Categories</span>
                <IconChevronDown className="rpx-icon-14" />
              </button>
            </div>

            <div className="rpx-category-body">
              <div className="rpx-donut-wrap">
                <svg
                  viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
                  className="rpx-donut-svg"
                >
                  <g
                    transform={`rotate(-90 ${DONUT_SIZE / 2} ${DONUT_SIZE / 2})`}
                  >
                    {donutSegments.map((seg) => (
                      <circle
                        key={seg.label}
                        cx={DONUT_SIZE / 2}
                        cy={DONUT_SIZE / 2}
                        r={DONUT_R}
                        fill="none"
                        strokeWidth={DONUT_STROKE}
                        strokeDasharray={seg.dashArray}
                        strokeDashoffset={seg.dashOffset}
                        className={`rpx-donut-seg rpx-accent-stroke-${seg.color}`}
                        strokeLinecap="butt"
                      />
                    ))}
                  </g>
                </svg>
                <div className="rpx-donut-center">
                  <span className="rpx-donut-center-value">
                    {CATEGORY_TOTAL}
                  </span>
                  <span className="rpx-donut-center-label">Total Sales</span>
                </div>
              </div>

              <ul className="rpx-category-legend">
                {CATEGORY_DATA.map((c) => (
                  <li key={c.label} className="rpx-category-legend-row">
                    <span className={`rpx-legend-dot rpx-accent-${c.color}`} />
                    <span className="rpx-category-legend-name">{c.label}</span>
                    <span className="rpx-category-legend-amount">
                      {c.amount}
                    </span>
                    <span className="rpx-category-legend-percent">
                      ({c.percent}%)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ========================= SUMMARY + TOP PRODUCTS ========================== */}
        <section className="rpx-row-2col rpx-row-2col-tables">
          {/* -------- Sales Summary -------- */}
          <div className="rpx-panel rpx-summary-panel">
            <div className="rpx-panel-header">
              <h2 className="rpx-panel-title">Sales Summary</h2>
            </div>
            <div className="rpx-table-scroll">
              <table className="rpx-table">
                <thead>
                  <tr>
                    <th>Payment Method</th>
                    <th>Total Transactions</th>
                    <th>Total Amount</th>
                    <th>Discount Given</th>
                    <th>Net Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYMENT_SUMMARY.map((row) => {
                    const Icon = row.icon;
                    return (
                      <tr key={row.method}>
                        <td>
                          <span className="rpx-table-method">
                            <span className="rpx-table-method-icon">
                              <Icon className="rpx-icon-16" />
                            </span>
                            {row.method}
                          </span>
                        </td>
                        <td>{row.transactions}</td>
                        <td>{row.amount}</td>
                        <td>{row.discount}</td>
                        <td>{row.net}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="rpx-table-total-row">
                    <td>Total</td>
                    <td>{PAYMENT_TOTAL.transactions}</td>
                    <td>{PAYMENT_TOTAL.amount}</td>
                    <td>{PAYMENT_TOTAL.discount}</td>
                    <td>{PAYMENT_TOTAL.net}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* -------- Top Selling Products -------- */}
          <div className="rpx-panel rpx-products-panel">
            <div className="rpx-panel-header">
              <h2 className="rpx-panel-title">Top Selling Products</h2>
              <a href="#" className="rpx-link">
                View All
              </a>
            </div>
            <div className="rpx-table-scroll">
              <table className="rpx-table rpx-table-products">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity Sold</th>
                    <th>Total Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_PRODUCTS.map((p) => {
                    const Icon = p.icon;
                    return (
                      <tr key={p.name}>
                        <td>
                          <span className="rpx-table-product">
                            <span className="rpx-product-thumb">
                              <Icon className="rpx-icon-18" />
                            </span>
                            {p.name}
                          </span>
                        </td>
                        <td>{p.qty}</td>
                        <td>{p.total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button type="button" className="rpx-btn rpx-btn-outline-block">
              <IconGrid className="rpx-icon-16" />
              <span>View All Products</span>
            </button>
          </div>
        </section>

        {/* ================================ FOOTER =================================== */}
        <footer className="rpx-footer">
          <span className="rpx-footer-item">
            <IconClock className="rpx-icon-14" />
            Report generated on {REPORT_GENERATED_AT}
          </span>
          <span className="rpx-footer-item">
            <IconRefresh className="rpx-icon-14" />
            Auto refresh in {countdownLabel}
          </span>
        </footer>
      </div>
    </div>
  );
}
