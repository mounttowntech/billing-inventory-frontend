import React, { useState, useEffect, useMemo } from "react";
import "./Report.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  getSummary,
  getAnalytics,
  getSalesTrend,
  getSalesByCategory,
  getSalesSummary,
  getTopProducts,
  getManagerDashboard,
  exportReportPdf,
} from "../../features/report/reportSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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

const PAYMENT_TOTAL = {
  transactions: 356,
  amount: "₹82,004.50",
  discount: "₹2,850.00",
  net: "₹79,154.50",
};

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
    .filter(
      ([x, y]) => Number.isFinite(Number(x)) && Number.isFinite(Number(y)),
    )
    .map(([x, y], i) => {
      const safeX = Number(x);
      const safeY = Number(y);

      return `${i === 0 ? "M" : "L"}${safeX.toFixed(2)},${safeY.toFixed(2)}`;
    })
    .join(" ");
}

function buildAreaPath(points, height) {
  if (!points || points.length === 0) {
    return "";
  }

  const line = pointsToPath(points);
  const [firstX] = points[0];
  const [lastX] = points[points.length - 1];

  return `${line} L${lastX},${height} L${firstX},${height} Z`;
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

export default function ReportDashboard() {
  const [secondsLeft, setSecondsLeft] = useState(AUTO_REFRESH_SECONDS);
  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getToday = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getLast30Days = () => {
    const date = new Date();
    date.setDate(date.getDate() - 29);

    return date.toISOString().split("T")[0];
  };

  const handleExportPDF = async () => {
    try {
      if (!fromDate || !toDate) {
        alert("Please select From Date and To Date");
        return;
      }

      if (fromDate > toDate) {
        alert("From Date cannot be greater than To Date");
        return;
      }

      const blob = await dispatch(
        exportReportPdf({
          fromDate,
          toDate,
        }),
      ).unwrap();

      if (!blob || blob.size === 0) {
        throw new Error("PDF file is empty");
      }

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = downloadUrl;

      link.download = `Sales_Report_${fromDate}_to_${toDate}.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);

      console.log("PDF exported successfully");
    } catch (error) {
      console.error("PDF export failed:", error);

      alert(error || "Failed to download PDF");
    }
  };

  const {
    summary,
    analytics,
    salesTrend,
    salesByCategory,
    salesSummary,
    topProducts,
    report,
    managerDashboard,
    loading,
    error,
  } = useSelector((state) => state.report);
  // Fetch Report
  useEffect(() => {
    dispatch(getManagerDashboard());
  }, [dispatch]);

  // Report Data
  const salesOverview = salesTrend || {};
  const topSellingProducts = topProducts?.products || [];
  const recentTransactions = salesSummary?.rows || [];

  const dashboard = managerDashboard?.dashboard || {};
  const topCustomers = analytics?.topCustomers || [];
  const lowStockAlerts = analytics?.lowStockAlerts || [];

  const CATEGORY_TOTAL = salesByCategory?.total || 0;

  const currentTrend = salesTrend?.current || [];
  const previousTrend = salesTrend?.previous || [];

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();

    // =========================
    // 1. OVERVIEW
    // =========================

    const overviewData = [
      ["REPORT", "Reports Dashboard"],
      ["Generated At", REPORT_GENERATED_AT],
      ["Date Range", DATE_RANGE_LABEL],
      [],

      ["STATISTICS", "VALUE"],
      ["Today's Sales", dashboard?.todaySales || 0],
      ["Today's Orders", dashboard?.todayOrders || 0],
      ["Today's Customers", dashboard?.todayCustomers || 0],
      ["Low Stock Items", dashboard?.lowStockProducts || 0],
      ["Pending Invoices", dashboard?.pendingInvoices || 0],
      ["Total Paid", dashboard?.totalPaid || 0],
      ["Total Due", dashboard?.totalDue || 0],
    ];

    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);

    XLSX.utils.book_append_sheet(workbook, overviewSheet, "Overview");

    // =========================
    // 2. SALES TREND
    // =========================

    const salesTrendData = [["Date", "Current Period", "Previous Period"]];

    SALES_TREND.labels.forEach((label, index) => {
      salesTrendData.push([
        label,
        SALES_TREND.current[index] || 0,
        SALES_TREND.previous[index] || 0,
      ]);
    });

    const salesTrendSheet = XLSX.utils.aoa_to_sheet(salesTrendData);

    XLSX.utils.book_append_sheet(workbook, salesTrendSheet, "Sales Trend");

    // =========================
    // 3. SALES BY CATEGORY
    // =========================

    // Get category data from the same data
    // that is displayed on your report page.
    const categoryBreakdown =
      salesByCategory?.breakdown || salesByCategory?.categories || [];

    const categoryData = [
      ["SALES BY CATEGORY"],
      [],
      ["Category", "Percentage", "Total Sales"],
    ];

    categoryBreakdown.forEach((item) => {
      categoryData.push([
        item.category || item.label || "",
        Number(item.percentage || 0),
        Number(item.total || item.totalSales || 0),
      ]);
    });

    // Add total row
    if (categoryBreakdown.length > 0) {
      const totalPercentage = categoryBreakdown.reduce(
        (sum, item) => sum + Number(item.percentage || 0),
        0,
      );

      const totalSales = categoryBreakdown.reduce(
        (sum, item) => sum + Number(item.total || item.totalSales || 0),
        0,
      );

      categoryData.push([]);

      categoryData.push(["Total", totalPercentage, totalSales]);
    }

    const categorySheet = XLSX.utils.aoa_to_sheet(categoryData);

    // Category sheet column widths
    categorySheet["!cols"] = [{ wch: 30 }, { wch: 18 }, { wch: 20 }];

    XLSX.utils.book_append_sheet(workbook, categorySheet, "Sales by Category");

    // =========================
    // 4. SALES SUMMARY
    // =========================

    const salesSummaryData = [
      ["Type", "Reference No", "Date", "Party", "Net Amount"],
    ];

    recentTransactions?.forEach((item) => {
      salesSummaryData.push([
        item.type || "",
        item.referenceNo || "",
        item.date ? new Date(item.date).toLocaleDateString("en-IN") : "",
        item.party || "",
        Number(item.netAmount || 0),
      ]);
    });

    // Summary totals
    salesSummaryData.push([]);

    salesSummaryData.push(["Total Records", salesSummary?.totalRecords || 0]);

    salesSummaryData.push([
      "Total Credit",
      salesSummary?.summary?.totalCredit || 0,
    ]);

    salesSummaryData.push([
      "Total Debit",
      salesSummary?.summary?.totalDebit || 0,
    ]);

    salesSummaryData.push([
      "Net Amount",
      salesSummary?.summary?.netAmount || 0,
    ]);

    const salesSummarySheet = XLSX.utils.aoa_to_sheet(salesSummaryData);

    XLSX.utils.book_append_sheet(workbook, salesSummarySheet, "Sales Summary");

    const productsData = [["Product", "Quantity Sold", "Total Sales"]];

    topSellingProducts?.forEach((product) => {
      productsData.push([
        product.productName || "",
        Number(product.quantitySold || 0),
        Number(product.totalSales || 0),
      ]);
    });

    const productsSheet = XLSX.utils.aoa_to_sheet(productsData);

    XLSX.utils.book_append_sheet(workbook, productsSheet, "Top Products");

    Object.values(workbook.Sheets).forEach((sheet) => {
      if (!sheet["!cols"]) {
        sheet["!cols"] = [
          { wch: 25 },
          { wch: 20 },
          { wch: 20 },
          { wch: 25 },
          { wch: 20 },
        ];
      }
    });

    XLSX.writeFile(
      workbook,
      `Report_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  //SALES_TREND
  const SALES_TREND = {
    labels: currentTrend.map((x) => x._id),
    current: currentTrend.map((x) => x.totalSales),
    previous: previousTrend.map((x) => x.totalSales),
    yMax:
      Math.max(
        ...currentTrend.map((x) => x.totalSales),
        ...previousTrend.map((x) => x.totalSales),
        100,
      ) || 100,
    yStep: 5000,
  };

  // Countdown
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s <= 0 ? AUTO_REFRESH_SECONDS : s - 1));
    }, 1000);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    dispatch(getSummary());
    dispatch(getAnalytics());
    dispatch(getSalesTrend());
    dispatch(getSalesByCategory());
    dispatch(getSalesSummary());
    dispatch(getTopProducts());
    dispatch(getManagerDashboard());
  }, [dispatch]);

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

  const gridRows = Array.from(
    { length: 6 },
    (_, i) => (SALES_TREND.yMax / 5) * i,
  );

  /* ---- donut chart geometry ---- */
  const DONUT_SIZE = 176;
  const DONUT_R = 66;
  const DONUT_STROKE = 26;

  const circumference = 2 * Math.PI * DONUT_R;

  let cumulative = 0;

  const donutSegments =
    salesByCategory?.categories?.map((c) => {
      const percentage = Number(c.percentage) || 0;

      const dash = (percentage / 100) * circumference;

      const seg = {
        ...c,
        label: c.category || "",
        color: c.color || "primary",

        dashArray: `${dash} ${circumference - dash}`,

        dashOffset: -((Number(cumulative) || 0) / 100) * circumference,
      };

      cumulative += percentage;

      return seg;
    }) || [];

  // console.log("managerDashboard are the :", managerDashboard);
  return (
    <div className="tdb-dashboard-container">
      <div className="tdb-dashboard">
        <header className="tdb-header tdb-panel">
          <div className="tdb-header-left">
            {/* <h2>Reports</h2> */}
            <div className="tdb-date-range">
              <span className="tdb-field-label">Date Range</span>

              <div className="tdb-date-select">
                <IconCalendar className="tdb-icon-16" />

                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="tdb-date-input"
                />

                <span className="tdb-date-separator">to</span>

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="tdb-date-input"
                />

                <IconChevronDown className="tdb-icon-16 tdb-date-select-chevron" />
              </div>
            </div>
          </div>
          <div className="tdb-header-right">
            <button type="button" className="tdb-btn tdb-btn-ghost">
              <IconReset className="tdb-icon-16" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              className="tdb-btn tdb-btn-primary"
              onClick={handleExportPDF}
            >
              <IconDownload className="tdb-icon-16" />
              <span>Export PDF</span>
            </button>

            <button
              type="button"
              className="tdb-btn tdb-btn-primary"
              onClick={handleExportExcel}
            >
              <IconDownload className="tdb-icon-16" />
              <span>Export Excel</span>
            </button>
          </div>
        </header>

        {/* ============================== STAT CARDS ================================ */}
        <section className="tdb-stats-grid">
          <div className="tdb-panel tdb-stat-card">
            <div className="tdb-stat-card-top">
              <span className="tdb-stat-icon tdb-accent-primary">
                <IconBag className="tdb-icon-20" />
              </span>
              <div className="tdb-stat-info">
                <span className="tdb-stat-label">Today's Sales</span>
                <span className="tdb-stat-value">
                  ₹{dashboard?.todaySales?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="tdb-panel tdb-stat-card">
            <div className="tdb-stat-card-top">
              <span className="tdb-stat-icon tdb-accent-secondary">
                <IconOrders className="tdb-icon-20" />
              </span>
              <div className="tdb-stat-info">
                <span className="tdb-stat-label">Today's Orders</span>
                <span className="tdb-stat-value">
                  {dashboard?.todayOrders || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="tdb-panel tdb-stat-card">
            <div className="tdb-stat-card-top">
              <span className="tdb-stat-icon tdb-accent-dark">
                <IconProfit className="tdb-icon-20" />
              </span>
              <div className="tdb-stat-info">
                <span className="tdb-stat-label">Today's Customers</span>
                <span className="tdb-stat-value">
                  {dashboard?.todayCustomers || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="tdb-panel tdb-stat-card">
            <div className="tdb-stat-card-top">
              <span className="tdb-stat-icon tdb-accent-soft">
                <IconCart className="tdb-icon-20" />
              </span>
              <div className="tdb-stat-info">
                <span className="tdb-stat-label">Low Stock Items</span>
                <span className="tdb-stat-value">
                  {dashboard?.lowStockProducts || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="tdb-panel tdb-stat-card">
            <div className="tdb-stat-card-top">
              <span className="tdb-stat-icon tdb-accent-primary">
                <IconOrders className="tdb-icon-20" />
              </span>
              <div className="tdb-stat-info">
                <span className="tdb-stat-label">Pending Invoices</span>
                <span className="tdb-stat-value">
                  {dashboard?.pendingInvoices || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="tdb-panel tdb-stat-card">
            <div className="tdb-stat-card-top">
              <span className="tdb-stat-icon tdb-accent-secondary">
                <IconCash className="tdb-icon-20" />
              </span>
              <div className="tdb-stat-info">
                <span className="tdb-stat-label">Total Paid</span>
                <span className="tdb-stat-value">
                  ₹{dashboard?.totalPaid?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="tdb-panel tdb-stat-card">
            <div className="tdb-stat-card-top">
              <span className="tdb-stat-icon tdb-accent-dark">
                <IconProfit className="tdb-icon-20" />
              </span>
              <div className="tdb-stat-info">
                <span className="tdb-stat-label">Total Due</span>
                <span className="tdb-stat-value">
                  ₹{dashboard?.totalDue?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ TREND + CATEGORY ============================= */}
        <section className="tdb-row-2col">
          {/* -------- Sales Trend -------- */}
          <div className="tdb-panel tdb-trend-panel">
            <div className="tdb-panel-header">
              <h2 className="tdb-panel-title">Sales Trend</h2>
              <div className="tdb-legend">
                <span className="tdb-legend-item">
                  <span className="tdb-legend-swatch tdb-legend-swatch-solid" />{" "}
                  Current Period
                </span>
                <span className="tdb-legend-item">
                  <span className="tdb-legend-swatch tdb-legend-swatch-dashed" />{" "}
                  Previous Period
                </span>
              </div>
            </div>

            <div className="tdb-trend-chart-wrap">
              <div className="tdb-trend-y-axis">
                {[...gridRows].reverse().map((v) => (
                  <span key={v}>₹{Math.round(v).toLocaleString("en-IN")}</span>
                ))}
              </div>
              <div className="tdb-trend-chart">
                <svg
                  className="tdb-trend-svg"
                  viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="tdbTrendFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#4f46e5"
                        stopOpacity="0.28"
                      />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
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
                        className="tdb-trend-gridline"
                      />
                    );
                  })}

                  <path
                    d={currentAreaPath}
                    fill="url(#tdbTrendFill)"
                    stroke="none"
                  />
                  <path
                    d={previousLinePath}
                    className="tdb-trend-line-previous"
                    fill="none"
                  />
                  <path
                    d={currentLinePath}
                    className="tdb-trend-line-current"
                    fill="none"
                  />

                  {currentPoints.map(([x, y], i) => (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="3.4"
                      className="tdb-trend-dot"
                    />
                  ))}
                </svg>
              </div>
            </div>

            <div className="tdb-trend-x-axis">
              {SALES_TREND.labels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>

          {/* -------- Sales by Category -------- */}
          <div className="tdb-panel tdb-category-panel">
            <div className="tdb-panel-header">
              <h2 className="tdb-panel-title">Sales by Category</h2>
              <button type="button" className="tdb-mini-select">
                <span>All Categories</span>
                <IconChevronDown className="tdb-icon-14" />
              </button>
            </div>

            <div className="tdb-category-body">
              <div className="tdb-donut-wrap">
                <svg
                  viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
                  className="tdb-donut-svg"
                >
                  <g
                    transform={`rotate(-90 ${DONUT_SIZE / 2} ${DONUT_SIZE / 2})`}
                  >
                    {donutSegments.map((seg, index) => (
                      <circle
                        key={`${seg.label}-${index}`}
                        cx={DONUT_SIZE / 2}
                        cy={DONUT_SIZE / 2}
                        r={DONUT_R}
                        fill="none"
                        strokeWidth={DONUT_STROKE}
                        strokeDasharray={seg.dashArray}
                        strokeDashoffset={seg.dashOffset}
                        className={`tdb-donut-seg tdb-accent-stroke-${seg.color}`}
                        strokeLinecap="butt"
                      />
                    ))}
                  </g>
                </svg>
                <div className="tdb-donut-center">
                  <span className="tdb-donut-center-value">
                    ₹
                    {Number(summary?.totalSales?.value || 0).toLocaleString(
                      "en-IN",
                      {
                        notation: "compact",
                        maximumFractionDigits: 2,
                      },
                    )}
                  </span>

                  <span className="tdb-donut-center-label">Total Sales</span>
                </div>
              </div>

              <ul className="tdb-category-legend">
                {salesByCategory?.breakdown?.map((item) => (
                  <li key={item.category} className="tdb-category-item">
                    <span>{item.category}</span>
                    <span>{item.percentage}%</span>
                    <span>₹{item.total?.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ========================= SUMMARY + TOP PRODUCTS ========================== */}
        <section className="tdb-row-2col tdb-row-2col-tables">
          {/* -------- Sales Summary -------- */}
          <div className="tdb-panel tdb-summary-panel">
            <div className="tdb-panel-header">
              <h2 className="tdb-panel-title">Sales Summary</h2>
            </div>
            <div className="tdb-table-scroll">
              <table className="tdb-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Reference No</th>
                    <th>Date</th>
                    <th>Party</th>
                    <th>Net Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions?.length > 0 ? (
                    recentTransactions.map((item, index) => (
                      <tr key={index}>
                        <td>{item.type}</td>

                        <td>{item.referenceNo}</td>

                        <td>
                          {new Date(item.date).toLocaleDateString("en-IN")}
                        </td>

                        <td>{item.party}</td>

                        <td>
                          ₹{Number(item.netAmount || 0).toLocaleString("en-IN")}
                        </td>

                        <td>
                          <span
                            className={`status-badge ${
                              item.type === "Sale"
                                ? "status-sale"
                                : item.type === "Purchase"
                                  ? "status-purchase"
                                  : item.type === "Expense"
                                    ? "status-expense"
                                    : "status-default"
                            }`}
                          ></span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No Transactions Found
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="tdb-table-total-row">
                    <td>Total</td>
                    <td>{salesSummary?.totalRecords || 0}</td>
                    <td>
                      ₹
                      {salesSummary?.summary?.totalCredit?.toLocaleString() ||
                        0}
                    </td>
                    <td>
                      ₹
                      {salesSummary?.summary?.totalDebit?.toLocaleString() || 0}
                    </td>
                    <td>
                      ₹{salesSummary?.summary?.netAmount?.toLocaleString() || 0}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* -------- Top Selling Products -------- */}
          <div className="tdb-panel tdb-products-panel">
            <div className="tdb-panel-header">
              <h2 className="tdb-panel-title">Top Selling Products</h2>
              {/* <a href="#" className="tdb-link">
                View All
              </a> */}
            </div>
            <div className="tdb-table-scroll">
              <table className="tdb-table tdb-table-products">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity Sold</th>
                    <th>Total Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellingProducts.map((p) => {
                    const Icon = IconShirt;
                    return (
                      <tr key={p.productName}>
                        <td>
                          <span className="tdb-table-product">
                            {/* <span className="tdb-product-thumb"> */}
                            {/* <Icon className="tdb-icon-18" /> */}
                            {/* </span> */}
                            {p.productName}
                          </span>
                        </td>
                        <td>{p.quantitySold}</td>
                        <td>₹{p.totalSales?.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className="tdb-btn tdb-btn-outline-block"
              onClick={() => navigate("/products")}
            >
              <IconGrid className="tdb-icon-16" />
              <span>View All Products</span>
            </button>
          </div>
        </section>

        {/* ================================ FOOTER =================================== */}
        <footer className="tdb-footer">
          <span className="tdb-footer-item">
            <IconClock className="tdb-icon-14" />
            Report generated on {REPORT_GENERATED_AT}
          </span>
          <span className="tdb-footer-item">
            <IconRefresh className="tdb-icon-14" />
            Auto refresh in {countdownLabel}
          </span>
        </footer>
      </div>
    </div>
  );
}
