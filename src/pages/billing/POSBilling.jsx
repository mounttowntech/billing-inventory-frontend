import React, { useState } from "react";
import "./POSBilling.css";
import img1 from "../../assets/shirt.jpg";
import img2 from "../../assets/jeans.jpg";
import img3 from "../../assets/t-shirt.jpg";
import img4 from "../../assets/saree.jpg";
import img5 from "../../assets/kid.jpg";
import img6 from "../../assets/jack.jpg";
import img7 from "../../assets/kurta.jpg";
import img8 from "../../assets/cargo.jpg";

const CATEGORIES = [
  "All Items",
  "Shirts",
  "Jeans",
  "T-Shirts",
  "Sarees",
  "Kids Wear",
];

const PRODUCTS = [
  { id: 1, name: "Shirts", price: 55, image: img1 },
  { id: 2, name: "Jeans", price: 110, image: img2 },
  { id: 3, name: "T-Shirts", price: 165, image: img3 },
  { id: 4, name: "Sarees", price: 220, image: img4 },
  {
    id: 5,
    name: "Kids Wear",
    price: 275,
    image: img5,
  },
  { id: 6, name: "Jacket", price: 150, image: img6 },
  {
    id: 7,
    name: "Kurta-pajama",
    price: 250,
    image: img7,
  },
  {
    id: 8,
    name: "Cargo pants",
    price: 350,
    image: img8,
  },
];

const QUICK_ACTIONS = [
  { id: "hold", label: "Hold Bills", icon: "pause", variant: "blue" },
  { id: "recent", label: "Recent Bills", icon: "history", variant: "green" },
  { id: "discount", label: "Discount", icon: "percent", variant: "orange" },
  { id: "clear", label: "Clear Cart", icon: "trash", variant: "red" },
];

const Icon = ({ name, className = "" }) => {
  const paths = {
    pause: (
      <>
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
      </>
    ),
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <polyline points="3 4 3 9 8 9" />
        <polyline points="12 7 12 12 16 14" />
      </>
    ),
    percent: (
      <>
        <line x1="19" y1="5" x2="5" y2="19" />
        <circle cx="6.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </>
    ),
    trash: (
      <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </>
    ),
    printer: (
      <>
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </>
    ),
    dots: (
      <>
        <circle cx="12" cy="5" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="12" cy="19" r="1.5" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
  };

  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
};

export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [searchTerm, setSearchTerm] = useState("");
  const [receivedAmount, setReceivedAmount] = useState("500");

  // ---- Bill calculations (replace with real cart state as needed) ----
  const billItems = [{ label: "Product*2", amount: 450 }];
  const subTotal = billItems.reduce((sum, item) => sum + item.amount, 0);
  const gstRate = 0.05;
  const gstAmount = subTotal * gstRate;
  const discount = 20;
  const grandTotal = subTotal + gstAmount - discount;
  const received = parseFloat(receivedAmount) || 0;
  const returnAmount = received - grandTotal;

  return (
    <div className="pos-page">
      {/* ================= LEFT: PRODUCTS PANEL ================= */}
      <section className="products-panel">
        <div className="products-card">
          {/* Search bar */}
          <div className="search-bar">
            <Icon name="search" className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category filters */}
          <div className="category-list">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`category-pill ${
                  activeCategory === category ? "category-pill--active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="product-grid">
            {PRODUCTS.map((product) => (
              <button key={product.id} className="product-card">
                <div className="product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    // image placeholder: add a real photo for this product
                    <span
                      className="product-image-placeholder"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p className="product-name">{product.name}</p>
                <p className="product-price">₹{product.price}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="quick-actions-card">
          <h3 className="quick-actions-title">Quick Actions</h3>
          <div className="quick-actions-grid">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                className="quick-action-btn"
                type="button"
              >
                <span
                  className={`quick-action-icon quick-action-icon--${action.variant}`}
                >
                  <Icon name={action.icon} />
                </span>
                <span className="quick-action-label">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= RIGHT: CURRENT BILL PANEL ================= */}
      <aside className="bill-panel">
        <div className="bill-card">
          <div className="bill-header">
            <h2 className="bill-title">Current Bill</h2>
            <button className="bill-menu-btn" aria-label="More options">
              <Icon name="dots" />
            </button>
          </div>

          <div className="bill-row bill-row--customer">
            <span className="bill-label">Customer</span>
            <span className="customer-badge">Walk-in</span>
          </div>
          <hr className="bill-divider" />

          <div className="bill-row">
            <span className="bill-label">{billItems[0].label}</span>
            <span className="bill-value">₹{billItems[0].amount}</span>
          </div>
          <div className="bill-row">
            <span className="bill-label">GST (5%)</span>
            <span className="bill-value">₹{gstAmount.toFixed(1)}</span>
          </div>
          <div className="bill-row">
            <span className="bill-label">Customer</span>
            <span className="bill-value bill-value--discount">
              -₹{discount}
            </span>
          </div>
          <hr className="bill-divider" />

          <div className="bill-row bill-row--total">
            <span className="bill-label bill-label--total">Grand Total</span>
            <span className="bill-value bill-value--total">
              ₹{grandTotal.toFixed(2)}
            </span>
          </div>

          <div className="received-amount">
            <label className="bill-label" htmlFor="received-amount-input">
              Received Amount
            </label>
            <input
              id="received-amount-input"
              type="number"
              className="received-input"
              value={receivedAmount}
              onChange={(e) => setReceivedAmount(e.target.value)}
            />
          </div>

          <div className="return-amount">
            <span className="return-label">Return Amount</span>
            <span className="return-value">₹{returnAmount.toFixed(2)}</span>
          </div>

          <button className="pay-btn" type="button">
            <Icon name="printer" />
            <span>Pay &amp; Print Bill</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
