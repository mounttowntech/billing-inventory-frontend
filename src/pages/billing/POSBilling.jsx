import "./POSBilling.css";
import img1 from "../../assets/shirt.jpg";
import img2 from "../../assets/jeans.jpg";
import img3 from "../../assets/t-shirt.jpg";
import img4 from "../../assets/saree.jpg";
import img5 from "../../assets/kid.jpg";
import img6 from "../../assets/jack.jpg";
import img7 from "../../assets/kurta.jpg";
import img8 from "../../assets/cargo.jpg";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../features/product/productSlice";
import { fetchCategories } from "../../features/category/categorySlice";
import noImage from "../../assets/no-image.png";
import { load } from "@cashfreepayments/cashfree-js";
import {
  createPayment,
  verifyPayment,
} from "../../features/payment/paymentSlice";

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
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [searchTerm, setSearchTerm] = useState("");
  const [receivedAmount, setReceivedAmount] = useState("500");
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("Walk-in");
  const { categories } = useSelector((state) => state.category);

  const subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const gstRate = 0.05;
  const gstAmount = subTotal * gstRate;
  const discount = 0;
  const grandTotal = subTotal + gstAmount - discount;
  const received = parseFloat(receivedAmount) || 0;
  const returnAmount = received - grandTotal;

  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const addToCart = (product) => {
    const price =
      product.variants?.[0]?.sellingPrice || product.variants?.[0]?.mrp || 0;

    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          _id: product._id,
          name: product.productName,
          price,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (!existing) return prev;

      if (existing.quantity === 1) {
        return prev.filter((item) => item._id !== product._id);
      }

      return prev.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item,
      );
    });
  };

  const handlePayment = async () => {
    try {
      if (cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      const cashfree = await load({
        mode: "sandbox",
      });

      const result = await dispatch(
        createPayment({
          type: "sale",

          amount: grandTotal,

          customer: selectedCustomer?._id,

          customerName: selectedCustomer?.customerName || "Walk-in",

          customerEmail: selectedCustomer?.email || "customer@gmail.com",

          customerPhone: selectedCustomer?.phone || "9999999999",

          remarks: "POS Billing",
        }),
      ).unwrap();

      const paymentSessionId = result.data.paymentSessionId;

      const orderId = result.data.cashfreeOrderId;

      const checkout = await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_modal",
      });

      console.log(checkout);

      const verify = await dispatch(verifyPayment(orderId)).unwrap();

      if (verify.data.paymentStatus === "completed") {
        alert("Payment Successful");
      } else {
        alert("Payment Failed");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <div className="pos-page">
      <section className="products-panel">
        <div className="products-card">
          <div className="search-bar">
            {/* <Icon name="search" className="search-icon" /> */}
            <input
              type="text"
              className="search-input"
              placeholder="Search product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-list">
            {categories?.map((category) => (
              <button
                key={category._id}
                className={`category-pill ${
                  activeCategory === category.categoryName
                    ? "category-pill--active"
                    : ""
                }`}
                onClick={() => setActiveCategory(category.categoryName)}
              >
                {category.categoryName}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {products
              ?.filter((product) => {
                const search = searchTerm.toLowerCase();

                const matchesSearch =
                  product.productName?.toLowerCase().includes(search) ||
                  product.productCode?.toLowerCase().includes(search) ||
                  product.variants?.some(
                    (variant) =>
                      variant.skuCode?.toLowerCase().includes(search) ||
                      variant.barcode?.toLowerCase().includes(search),
                  );

                const matchesCategory =
                  activeCategory === "All Items" ||
                  product.category?.categoryName?.trim().toLowerCase() ===
                    activeCategory.trim().toLowerCase();

                return matchesSearch && matchesCategory;
              })
              .map((product) => (
                <div key={product._id} className="product-card">
                  <div className="qty-overlay">
                    <button
                      className="qty-btn"
                      onClick={() => removeFromCart(product)}
                    >
                      -
                    </button>

                    <button
                      className="qty-btn"
                      onClick={() => addToCart(product)}
                    >
                      +
                    </button>
                  </div>

                  <div className="product-image">
                    {product.image ? (
                      <img
                        src={`${IMAGE_BASE_URL}/${product.image}`}
                        alt={product.productName}
                      />
                    ) : (
                      <img src={noImage} alt="No Image" />
                    )}
                  </div>

                  <p className="product-name">{product.productName}</p>

                  <p className="product-price">
                    ₹
                    {product.variants?.[0]?.sellingPrice ??
                      product.variants?.[0]?.mrp ??
                      0}
                  </p>
                </div>
              ))}
          </div>
        </div>

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

      <aside className="bill-panel">
        <div className="bill-card">
          <div className="bill-header">
            <h2 className="bill-title">Current Bill</h2>
          </div>

          <div className="bill-row bill-row--customer">
            <span className="bill-label">Customer</span>
            <span className="customer-badge">Walk-in</span>
          </div>
          <hr className="bill-divider" />

          {cart.length === 0 ? (
            <p className="empty-cart">No Products Added</p>
          ) : (
            cart.map((item) => (
              <div className="bill-row" key={item._id}>
                <span className="bill-label">
                  {item.name} × {item.quantity}
                </span>

                <span className="bill-value">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))
          )}
          <div className="bill-row">
            <span className="bill-label">GST (5%)</span>
            <span className="bill-value">₹{gstAmount.toFixed(2)}</span>
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

          <button className="pay-btn" type="button" onClick={handlePayment}>
            <Icon name="printer" />
            <span>Pay &amp; Print Bill</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
