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
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../features/product/productSlice";
import { fetchCategories } from "../../features/category/categorySlice";
import noImage from "../../assets/no-image.png";
import { load } from "@cashfreepayments/cashfree-js";
import {
  createPayment,
  verifyPayment,
} from "../../features/payment/paymentSlice";

import Modal from "../../components/common/Modal";
import toast from "../../utils/toaster";
import { getCustomers, createCustomer } from "../../features/customer/customerSlice";



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
  const navigate = useNavigate();
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [searchTerm, setSearchTerm] = useState("");
  // const [receivedAmount, setReceivedAmount] = useState("500");
  const [cart, setCart] = useState([]);
  // const [selectedCustomer, setSelectedCustomer] = useState("Walk-in");
  const { categories } = useSelector((state) => state.category);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
const [cashModalOpen, setCashModalOpen] = useState(false);
const [onlineModalOpen, setOnlineModalOpen] = useState(false);

const [receivedAmount, setReceivedAmount] = useState("");

const [customers, setCustomers] = useState([]);


const [selectedCustomer, setSelectedCustomer] =
  useState(null);

const [customerModalOpen, setCustomerModalOpen] =
  useState(false);

const [addCustomerModalOpen, setAddCustomerModalOpen] =
  useState(false);

const [customerSearch, setCustomerSearch] =
  useState("");

const [customerForm, setCustomerForm] = useState({
  customerName: "",
  phone: "",
  email: "",
  address: "",
});

const [variantModalOpen, setVariantModalOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);

  // const subTotal = cart.reduce(
  //   (sum, item) => sum + item.price * item.quantity,
  //   0,
  // );
  const subTotal = cart.reduce(
  (total, item) =>
    total + Number(item.price) * Number(item.quantity),
  0
);

const totalItemDiscount = cart.reduce(
  (total, item) =>
    total + Number(item.discountAmount || 0),
  0
);
  const gstRate = 0.05;
  const gstAmount = subTotal * gstRate;
  const discount = totalItemDiscount;
  const grandTotal = subTotal + gstAmount - discount;
  const received = parseFloat(receivedAmount) || 0;
  const returnAmount = received - grandTotal;

  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);

  const QUICK_ACTIONS = [
  { id: "hold", label: "Hold Bills", icon: "pause", variant: "blue" },
  { id: "recent", label: "Recent Bills", icon: "history", variant: "green", onClick: () => navigate("/payments") },
  { id: "discount", label: "Discount", icon: "percent", variant: "orange" },
  { id: "clear", label: "Clear Cart", icon: "trash", variant: "red", onClick: () => setCart([]) },
];

  useEffect(() => {
    dispatch(getProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
  fetchCustomers();
}, []);

const fetchCustomers = async () => {
  try {
    const response = await dispatch(getCustomers()).unwrap();
console.log("Fetched customers:", response);
    if (response?.success && response?.data) {
      setCustomers(response.data);
    }
  } catch (error) {
    console.error("Failed to fetch customers", error);
  }
};

  // const addToCart = (product) => {
  //   console.log("Adding to cart:", product);
  //   const price =
  //     product.variants?.[0]?.sellingPrice || product.variants?.[0]?.mrp || 0;

  //   setCart((prev) => {
  //     const existing = prev.find((item) => item._id === product._id);

  //     if (existing) {
  //       return prev.map((item) =>
  //         item._id === product._id
  //           ? {
  //               ...item,
  //               quantity: item.quantity + 1,
  //             }
  //           : item,
  //       );
  //     }

  //     return [
  //       ...prev,
  //       {
  //         _id: product._id,
  //         name: product.productName,
  //         price,
  //         quantity: 1,
          
  //       },
  //     ];
  //   });
  // };

const getCartKey = (product, variant = null) => {
  console.log("Generating cart key for:", product, variant);
  return variant
    ? `${product._id}_${variant.variantCode}`
    : `${product._id}_normal`;
};


const addToCart = (product, variant = null) => {
  console.log("Adding to cart:", product, variant);
  setCart((prev) => {
    const cartKey = getCartKey(product, variant);
console.log("cartKey", cartKey);
    const existing = prev.find(
      (item) => item.cartKey === cartKey
    );
 console.log("Adding existing", existing);
    // ==========================================
    // EXISTING PRODUCT / VARIANT
    // ==========================================

    if (existing) {
      return prev.map((item) =>
        item.cartKey === cartKey
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );
    }

    // ==========================================
    // NEW PRODUCT / VARIANT
    // ==========================================

    const price = variant
      ? Number(
          variant.sellingPrice ??
          variant.mrp ??
          0
        )
      : Number(product.sellingPrice ?? product.price ?? 0);

    return [
      ...prev,
      {
        cartKey,

        product: product._id,

        // IMPORTANT
        variant: variant?.variantCode || null,

        productName: product.productName,

        color: variant?.color || null,
        size: variant?.size || null,

        price,

        quantity: 1,

        amount: price,
      },
    ];
  });
};


const removeFromCart = (itemToRemove) => {
  console.log("Removing from cart:", itemToRemove);
  setCart((prev) => {
    const existing = prev.find(
      (item) => item.cartKey === itemToRemove.cartKey
    );

    if (!existing) {
      return prev;
    }

    // Remove entire cart item
    if (existing.quantity <= 1) {
      return prev.filter(
        (item) => item.cartKey !== itemToRemove.cartKey
      );
    }

    // Reduce only this variant
    return prev.map((item) =>
      item.cartKey === itemToRemove.cartKey
        ? {
            ...item,
            quantity: item.quantity - 1,
          }
        : item
    );
  });
};

  // const removeFromCart = (product) => {
  //   setCart((prev) => {
  //     const existing = prev.find((item) => item._id === product._id);

  //     if (!existing) return prev;

  //     if (existing.quantity === 1) {
  //       return prev.filter((item) => item._id !== product._id);
  //     }

  //     return prev.map((item) =>
  //       item._id === product._id
  //         ? {
  //             ...item,
  //             quantity: item.quantity - 1,
  //           }
  //         : item,
  //     );
  //   });
  // };

  // const handlePayment = async () => {
  //   try {
  //     if (cart.length === 0) {
  //       alert("Cart is empty");
  //       return;
  //     }

  //     const cashfree = await load({
  //       mode: "sandbox",
  //     });

  //     const result = await dispatch(
  //       createPayment({
  //         type: "sale",

  //         amount: grandTotal,

  //         customer: selectedCustomer?._id,

  //         customerName: selectedCustomer?.customerName || "Walk-in",

  //         customerEmail: selectedCustomer?.email || "customer@gmail.com",

  //         customerPhone: selectedCustomer?.phone || "9999999999",

  //         remarks: "POS Billing",
  //       }),
  //     ).unwrap();

  //     const paymentSessionId = result.data.paymentSessionId;

  //     const orderId = result.data.cashfreeOrderId;

  //     const checkout = await cashfree.checkout({
  //       paymentSessionId,
  //       redirectTarget: "_modal",
  //     });

  //     console.log(checkout);

  //     const verify = await dispatch(verifyPayment(orderId)).unwrap();

  //     if (verify.data.paymentStatus === "completed") {
  //       alert("Payment Successful");
  //     } else {
  //       alert("Payment Failed");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     alert(error.message);
  //   }
  // };

  const handlePayment = () => {
  if (cart.length === 0) {
    alert("Please add at least one product");
    return;
  }

  setPaymentModalOpen(true);
};

const handleCashPayment = async () => {
  console.log("cart_details:", cart);
  const received = Number(receivedAmount);

  if (!received || received <= 0) {
    alert("Please enter received amount");
    return;
  }

  if (received < grandTotal) {
    alert(
      `Insufficient amount. ₹${(
        grandTotal - received
      ).toFixed(2)} is still due.`
    );

    return;
  }

  const returnAmount = received - grandTotal;

  const paymentData = {
    type: "sale",
    customer: selectedCustomer?._id || null,
    customerName: selectedCustomer?.customerName || "Walk-in",
    customerEmail: selectedCustomer?.email || "customer@gmail.com",
    customerPhone: selectedCustomer?.phone || "9999999999",
    items: cart.map((item) => ({
      variant: item.variant || null,
      product: item.product,
      quantity: item.quantity,
      price: item.price,
      amount: item.price * item.quantity,
    })),

    subTotal,
    gstAmount,
    discount,
    amount: grandTotal,

    paymentMethod: "cash",

    receivedAmount: received,

    paidAmount: grandTotal,

    dueAmount: 0,

    returnAmount,
  };

  try {
    // Replace this with your axios API call

    console.log("Cash Payment:", paymentData);
    const result = await dispatch(createPayment(paymentData)).unwrap();
    console.log("Cash Payment Result:", result);
    if (result.data.paymentStatus === "completed") {
      toast.success("Cash Payment Successful\nReturn Amount: ₹" + returnAmount.toFixed(2));
      setCashModalOpen(false);

    setReceivedAmount("");
    setCart([]);
    setSelectedCustomer(null);
    }
  

    

    // print invoice here
    // handlePrintInvoice();

    // clear cart
    // setCart([]);

  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || error || "Cash payment failed");

    // alert(
    //   error.response?.data?.message ||
    //     "Cash payment failed"
    // );
  }
};

const handleOnlinePayment = async () => {
  try {
    const paymentData = {
      type: "sale",
      customer: selectedCustomer?._id || null,
      customerName: selectedCustomer?.customerName || "Walk-in",
      customerEmail: selectedCustomer?.email || "customer@gmail.com",
      customerPhone: selectedCustomer?.phone || "9999999999",
      items: cart.map((item) => ({
        variant: item.variant || null,
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        amount: item.price * item.quantity,
      })),

      subTotal,
      gstAmount,
      discount,
      amount: grandTotal,

      paymentMethod: "cashfree",

      receivedAmount: grandTotal,
    };

    console.log(
      "Creating Cashfree payment:",
      paymentData
    );

    const result = await dispatch(createPayment(paymentData)).unwrap();
    console.log("Cashfree Payment Result:", result);

    const paymentSessionId = result.data.paymentSessionId;

    const orderId = result.data.cashfreeOrderId;

    const cashfree = await load({
      mode: "sandbox",
    });

    const checkout = await cashfree.checkout({
      paymentSessionId,
      redirectTarget: "_modal",
    });

    console.log("Cashfree Checkout Result:", checkout);

    const verify = await dispatch(verifyPayment(orderId)).unwrap();
    console.log("Cashfree Payment Verification Result:", verify);

    if (verify.data.paymentStatus === "completed") {
      toast.success("Online Payment Successful");
      setOnlineModalOpen(false);
      setCart([]);
      setSelectedCustomer(null);
    } else {
      toast.error("Online Payment Failed");
    }

  } catch (error) {
    console.log(error);

    toast.error(
      error.response?.data?.message || error ||  "Unable to start online payment"
    );
  }
};

const handleCreateCustomer = async (e) => {
  e.preventDefault();

  try {

    if (!customerForm.customerName.trim()) {
      alert("Customer name is required");
      return;
    }

    if (!customerForm.phone.trim()) {
      alert("Customer phone is required");
      return;
    }

    if (
      customerForm.phone.length !== 10
    ) {
      alert(
        "Please enter a valid 10 digit phone number"
      );

      return;
    }

    const response = await dispatch(
      createCustomer(customerForm)
    ).unwrap();

    console.log("Create customer response:", response);

    if (response?.success && response?.data) {

      const newCustomer =
        response.data;

      // IMPORTANT
      // Automatically select new customer
      setSelectedCustomer(newCustomer);

      // Close add customer modal
      setAddCustomerModalOpen(false);

      // Clear form
      setCustomerForm({
        customerName: "",
        phone: "",
        email: "",
        address: "",
      });

      // Refresh customer list
      fetchCustomers();

      toast.success(response?.message || "Customer created successfully"
      );
    }

  } catch (error) {

    console.error(
      "Create customer error:",
      error.response?.data || error
    );

    toast.error(
      error.response?.data?.message ||
      "Failed to create customer"
    );
  }
};

const handleProductClick = (product) => {
  // No variants
  if (!product.variants || product.variants.length === 0) {
    addToCart(product);
    return;
  }

  // Product has variants
  setSelectedProduct(product);
  setVariantModalOpen(true);
};

// const handleVariantSelect = (variant) => {
//   if (!selectedProduct) return;

//   const cartItem = {
//     ...selectedProduct,

//     // Important
//     variant: variant,

//     variantId: variant._id,

//     price:
//       Number(variant.sellingPrice) ||
//       Number(variant.mrp) ||
//       0,

//     skuCode: variant.skuCode,
//     barcode: variant.barcode,

//     size: variant.size,
//     color: variant.color,

//     stockQuantity: variant.currentStock,
//   };

//   addToCart(cartItem);

//   setVariantModalOpen(false);
//   setSelectedProduct(null);
// };

const handleVariantSelect = (variant) => {
  console.log("Selected variant:", variant);
  if (!selectedProduct) return;

  const cartItem = {
    ...selectedProduct,

    // Store only ID
    variant: variant?.variantCode,

    variantId: variant?.variantCode,

    price:
      Number(variant.sellingPrice) ||
      Number(variant.mrp) ||
      0,

    skuCode: variant.skuCode,
    barcode: variant.barcode,

    size: variant.size,
    color: variant.color,

    stockQuantity: variant.currentStock,
  };

  addToCart(cartItem);

  setVariantModalOpen(false);
  setSelectedProduct(null);
};


console.log("Selected_cart:", cart);

const handleAddProduct = (product) => {
  if (product.variants?.length > 1) {
    setSelectedProduct(product);
    setVariantModalOpen(true);
    return;
  }

  addToCart(product, null);
};

console.log("Selected_cart:", cart);

const handleAddVariant = (product, variant) => {
  console.log("Adding variant to cart:", product, variant);
  const cartKey = `${product._id}_${variant.variantCode}`;

  setCart((prev) => {
    const existing = prev.find(
      (item) => item.cartKey === cartKey
    );

    if (existing) {
      return prev.map((item) =>
        item.cartKey === cartKey
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );
    }

    return [
      ...prev,
      {
        cartKey,
        product: product._id,
        productName: product.productName,

        variant: variant.variantCode,

        color: variant.color,
        size: variant.size,

        price: variant.sellingPrice,
        quantity: 1,
        discountType: variant.discountType || "percentage",
        discountValue: variant?.discountValue || 0,
        discountAmount: variant.discountType === "percentage" ? (variant.sellingPrice * variant?.discountValue || 0) / 100 : variant?.discountValue || 0,
      },
    ];
  });
};

  return (
    <div className="pos-page">
      <section className="products-panel">
        <div className="products-card">

          {/* SEARCH */}
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>


          {/* CATEGORY */}
          <div className="category-list">

            {categories?.map((category) => (
              <button
                key={category._id}
                type="button"
                className={`category-pill ${activeCategory === category.categoryName
                    ? "category-pill--active"
                    : ""
                  }`}
                onClick={() =>
                  setActiveCategory(category.categoryName)
                }
              >
                {category.categoryName}
              </button>
            ))}

          </div>

          {/* PRODUCTS */}
          <div className="product-grid">

            {products
              ?.filter((product) => {

                const search = searchTerm
                  .toLowerCase()
                  .trim();

                const matchesSearch =
                  !search ||
                  product.productName
                    ?.toLowerCase()
                    .includes(search) ||

                  product.productCode
                    ?.toLowerCase()
                    .includes(search) ||

                  product.variants?.some(
                    (variant) =>
                      variant.skuCode
                        ?.toLowerCase()
                        .includes(search) ||

                      variant.barcode
                        ?.toLowerCase()
                        .includes(search)
                  );

                const matchesCategory =
                  activeCategory === "All Items" ||
                  product.category?.categoryName
                    ?.trim()
                    .toLowerCase() ===
                  activeCategory
                    .trim()
                    .toLowerCase();

                return matchesSearch && matchesCategory;
              })

              .map((product) => {

                const hasVariants =
                  product.variants &&
                  product.variants.length > 0;

                const firstVariant =
                  product.variants?.[0];

                const displayPrice =
                  firstVariant?.sellingPrice ??
                  firstVariant?.mrp ??
                  product.sellingPrice ??
                  product.mrp ??
                  0;

                let offerText = "";

                // ========================================
                // PRODUCT LEVEL DISCOUNT
                // ========================================
                if (
                  (product.discountType === "percentage" ||
                    product.discountType === "amount") &&
                  Number(product.discountValue) > 0
                ) {
                  if (product.discountType === "percentage") {
                    offerText = `${Number(product.discountValue)}% OFF`;
                  } else {
                    offerText = `₹${Number(product.discountValue).toFixed(0)} OFF`;
                  }
                }

                // ========================================
                // VARIANT LEVEL DISCOUNT
                // ========================================
                else {
                  const discountedVariant = product.variants?.find(
                    (variant) =>
                      (variant.discountType === "percentage" ||
                        variant.discountType === "amount") &&
                      Number(variant.discountValue) > 0
                  );

                  if (discountedVariant) {
                    if (discountedVariant.discountType === "percentage") {
                      offerText = `${Number(
                        discountedVariant.discountValue
                      )}% OFF`;
                    } else {
                      offerText = `₹${Number(
                        discountedVariant.discountValue
                      ).toFixed(0)} OFF`;
                    }
                  }
                }

                return (
                  <div
                    key={product._id}
                    className={`product-card ${hasVariants
                        ? "product-card--has-variants"
                        : ""
                      }`}
                    onClick={() =>
                      handleProductClick(product)
                    }
                  >

                    {/* QUANTITY BUTTONS */}
                    <div className="qty-overlay">

                      {/* <button
                        type="button"
                        className="qty-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(product, variant?.variantCode || null);
                        }}
                      >
                        -
                      </button>

                      <button
                        type="button"
                        className="qty-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddProduct(product, variant || null);
                        }}
                      >
                        +
                      </button> */}

                    </div>

                    {/* IMAGE */}
                    <div className="product-image">

                      {product.image ? (
                        <img
                          src={`${IMAGE_BASE_URL}/${product.image}`}
                          alt={product.productName}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = noImage;
                          }}
                        />
                      ) : (
                        <img
                          src={noImage}
                          alt="No Image"
                        />
                      )}

                      {/* OFFER BADGE */}
                      {offerText && (
                        <span className="product-offer-badge">
                          {offerText}
                        </span>
                      )}

                    </div>

                    {/* PRODUCT NAME */}
                    <p className="product-name">
                      {product.productName}
                    </p>

                    {/* PRICE */}
                    {/* <p className="product-price">
                      ₹{Number(displayPrice).toFixed(2)}
                    </p> */}

                    {/* VARIANT LABEL */}
                    {/* {hasVariants && (
                      <span className="variant-label">
                        {product.variants.length} Variants
                      </span>
                    )} */}

                    {/* {hasVariants ? (
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddProduct(product, variant || null);
                        }}
                      >
                        +
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(product, variant?.variantCode || null);
                          }}
                        >
                          -
                        </button>

                        <button
                          type="button"
                          className="qty-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddProduct(product, variant || null);
                          }}
                        >
                          +
                        </button>
                      </>
                    )} */}

                  </div>
                );
              })}

          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="quick-actions-card">

          <h3 className="quick-actions-title">
            Quick Actions
          </h3>

          <div className="quick-actions-grid">

            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                className="quick-action-btn"
                type="button"
                onClick={action.onClick}
              >
                <span
                  className={`quick-action-icon quick-action-icon--${action.variant}`}
                >
                  <Icon name={action.icon} />
                </span>

                <span className="quick-action-label">
                  {action.label}
                </span>
              </button>
            ))}

          </div>
        </div>
      </section>

      

      <aside className="bill-panel">
        <div className="bill-card">

          {/* HEADER */}
          <div className="bill-header">
            <h2 className="bill-title">Current Bill</h2>
          </div>

          {/* CUSTOMER */}
          <div className="bill-row bill-row--customer">
            <span className="bill-label">
              Customer
            </span>

            <button
              type="button"
              className="customer-select-btn"
              onClick={() => setCustomerModalOpen(true)}
            >
              {selectedCustomer
                ? selectedCustomer.customerName
                : "Walk-in Customer"}

              <span>⌄</span>
            </button>
          </div>

          <hr className="bill-divider" />

          {/* CART */}
         {/* CART */}
          {cart.length === 0 ? (
            <p className="empty-cart">
              No Products Added
            </p>
          ) : (
            <div className="bill-items">

              {cart.map((item) => {
                const itemSubtotal =
                  Number(item.price || 0) *
                  Number(item.quantity || 0);

                const itemDiscount =
                  Number(item.discountAmount || 0);

                const itemTotal =
                  itemSubtotal - itemDiscount;

                return (
                  <div
                    className="bill-row bill-row--product"
                    key={item.cartKey}
                  >
                    <div className="bill-item-info">

                      {/* PRODUCT NAME + TOTAL */}
                      <div className="bill-item-top">
                        <span className="bill-label bill-product-name">
                          {item.productName}
                        </span>

                        <span className="bill-value bill-product-price">
                          ₹{itemTotal.toFixed(2)}
                        </span>
                      </div>

                      {/* VARIANT */}
                      {item.variant && (
                        <div className="bill-variant">

                          {item.color && (
                            <span>
                              Color: {item.color}
                            </span>
                          )}

                          {item.color && item.size && (
                            <span className="bill-variant-separator">
                              •
                            </span>
                          )}

                          {item.size && (
                            <span>
                              Size: {item.size}
                            </span>
                          )}

                        </div>
                      )}

                      {/* QUANTITY */}
                      <div className="bill-item-actions">

                        <button
                          type="button"
                          className="bill-qty-btn"
                          onClick={() => removeFromCart(item)}
                        >
                          −
                        </button>

                        <span className="bill-qty-value">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          className="bill-qty-btn"
                          onClick={() => {
                            const product = products.find(
                              (p) => p._id === item.product
                            );

                            const variant = product?.variants?.find(
                              (v) =>
                                v.variantCode === item.variant
                            );

                            if (product) {
                              addToCart(product, variant);
                            }
                          }}
                        >
                          +
                        </button>

                      </div>

                      {/* DISCOUNT */}
                      {itemDiscount > 0 && (
                        <div className="bill-item-discount">

                          <span>
                            <strong>Discount</strong>
                            {item.discountType === "percentage" &&
                              ` (${item.discountValue}%)`}
                          </span>

                          <span>
                            -₹{itemDiscount.toFixed(2)}
                          </span>

                        </div>
                      )}

                    </div>
                  </div>
                );
              })}

            </div>
          )}

          {/* GST */}
          <div className="bill-row">
            <span className="bill-label">
              GST (5%)
            </span>

            <span className="bill-value">
              ₹{gstAmount.toFixed(2)}
            </span>
          </div>

          {/* DISCOUNT */}
          <div className="bill-row">
            <span className="bill-label">
              Total Discount
            </span>

            <span className="bill-value bill-value--discount">
              -₹{totalItemDiscount.toFixed(2)}
            </span>
          </div>

          <hr className="bill-divider" />

          {/* GRAND TOTAL */}
          <div className="bill-row bill-row--total">

            <span className="bill-label bill-label--total">
              Grand Total
            </span>

            <span className="bill-value bill-value--total">
              ₹{grandTotal.toFixed(2)}
            </span>

          </div>

          {/* PAYMENT */}
          <button
            className="pay-btn"
            type="button"
            onClick={handlePayment}
          >
            <Icon name="printer" />

            <span>
              Pay &amp; Print Bill
            </span>
          </button>

        </div>
      </aside>

      <Modal
        open={paymentModalOpen}
        title="Payment"
        onClose={() => setPaymentModalOpen(false)}
        size="lg"
      >
        <div className="payment-modal">

          {/* CUSTOMER */}
          <div className="payment-customer">
            <span>Customer</span>
            <strong>{selectedCustomer?.customerName || "Walk-in Customer"}</strong>
          </div>

          {/* PRODUCTS */}
          <div className="payment-products">
            <h4>Bill Details</h4>

            {cart.map((item) => {
              const price = Number(item.price || 0);
              const quantity = Number(item.quantity || 0);

              let discountAmount = 0;

              if (item.discountType === "percentage") {
                discountAmount =
                  price * (Number(item.discountValue || 0) / 100);
              } else if (item.discountType === "amount") {
                discountAmount = Number(item.discountAmount || 0);
              }

              // Discounted price for ONE quantity
              const discountedUnitPrice =
                Math.max(0, price - discountAmount);

              // Final amount for ALL quantities
              const totalAmount =
                (price * quantity) - discountAmount;

              return (
                <div
                  className="payment-product-row"
                  key={item.cartKey || item._id}
                >
                  <div>
                    <strong>
                      {item.productName || item.name}
                    </strong>

                    {item.variant && (
                      <span>
                        ({item.color} - {item.size})
                      </span>
                    )}

                    <span>
                      {quantity} × ₹{item?.price.toFixed(2)}
                    </span>
                    {discountAmount > 0 && (
                      <small className="text-muted">
                        (Discount: -₹{discountAmount.toFixed(2)})
                      </small>
                    )}
                  </div>

                  <strong>
                    ₹{totalAmount.toFixed(2)}
                  </strong>
                </div>
              );
            })}
          </div>

          {/* SUMMARY */}
          <div className="payment-summary">

            <div>
              <span>Subtotal</span>
              <strong>
                ₹{subTotal.toFixed(2)}
              </strong>
            </div>

            <div>
              <span>GST</span>
              <strong>
                ₹{gstAmount.toFixed(2)}
              </strong>
            </div>

            <div>
              <span>Total Discount</span>
              <strong>
                -₹{totalItemDiscount.toFixed(2)}
              </strong>
            </div>

            <div className="payment-grand-total">
              <span>Grand Total</span>
              <strong>
                ₹{grandTotal.toFixed(2)}
              </strong>
            </div>

          </div>

          {/* PAYMENT OPTIONS */}
          <div className="payment-options">

            <button
              type="button"
              className="cash-payment-btn"
              onClick={() => {
                setPaymentModalOpen(false);
                setCashModalOpen(true);
              }}
            >
              💵
              <span>
                <strong>Cash</strong>
                <small>Pay with cash</small>
              </span>
            </button>

            <button
              type="button"
              className="online-payment-btn"
              onClick={() => {
                setPaymentModalOpen(false);
                setOnlineModalOpen(true);
              }}
            >
              💳
              <span>
                <strong>Online Payment</strong>
                <small>UPI / Card / Net Banking</small>
              </span>
            </button>

          </div>

        </div>
      </Modal>

      <Modal
        open={cashModalOpen}
        title="Cash Payment"
        onClose={() => setCashModalOpen(false)}
        size="md"
      >
        <div className="cash-payment-modal">

          <div className="cash-total">
            <span>Bill Amount</span>

            <strong>
              ₹{grandTotal.toFixed(2)}
            </strong>
          </div>

          <div className="cash-input-group">

            <label>
              Amount Received
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={receivedAmount}
              onChange={(e) =>
                setReceivedAmount(e.target.value)
              }
              placeholder="Enter received amount"
            />

          </div>

          {Number(receivedAmount) >= grandTotal ? (
            <div className="cash-change">
              <span>Return Amount</span>

              <strong>
                ₹
                {(
                  Number(receivedAmount) - grandTotal
                ).toFixed(2)}
              </strong>
            </div>
          ) : (
            <div className="cash-due">
              <span>Due Amount</span>

              <strong>
                ₹
                {(
                  grandTotal - Number(receivedAmount || 0)
                ).toFixed(2)}
              </strong>
            </div>
          )}

          <button
            type="button"
            className="complete-cash-btn"
            onClick={handleCashPayment}
          >
            Complete Cash Payment
          </button>

        </div>
      </Modal>

      <Modal
  open={onlineModalOpen}
  title="Online Payment"
  onClose={() => setOnlineModalOpen(false)}
  size="lg"
>
  <div className="online-payment-modal">

    <div className="online-payment-amount">
      <span>Amount to Pay</span>

      <strong>
        ₹{grandTotal.toFixed(2)}
      </strong>
    </div>

    <div className="online-payment-info">

      <h4>Online Payment</h4>

      <p>
        Continue to Cashfree to complete
        your payment.
      </p>

    </div>

    <button
      type="button"
      className="cashfree-btn"
      onClick={handleOnlinePayment}
    >
      Continue to Cashfree
    </button>

  </div>
</Modal>

<Modal
  open={customerModalOpen}
  title="Select Customer"
  onClose={() => setCustomerModalOpen(false)}
  size="md"
>
  <div className="customer-selector">

    {/* WALK-IN */}
    <button
      type="button"
      className="walk-in-btn"
      onClick={() => {
        setSelectedCustomer(null);
        setCustomerModalOpen(false);
      }}
    >
      <div>
        <strong>Walk-in Customer</strong>

        <span>
          No customer details
        </span>
      </div>

      {!selectedCustomer && (
        <span className="selected-check">
          ✓
        </span>
      )}
    </button>

    {/* SEARCH */}
    <input
      type="text"
      className="customer-search"
      placeholder="Search customer name or phone..."
      value={customerSearch}
      onChange={(e) =>
        setCustomerSearch(e.target.value)
      }
    />

    {/* CUSTOMER LIST */}
    <div className="customer-list">

      {customers
        .filter((customer) => {

          const search =
            customerSearch
              .toLowerCase()
              .trim();

          if (!search) return true;

          return (
            customer.customerName
              ?.toLowerCase()
              .includes(search) ||

            customer.phone
              ?.toString()
              .includes(search)
          );
        })
        .map((customer) => (

          <button
            key={customer._id}
            type="button"
            className="customer-item"
            onClick={() => {

              setSelectedCustomer(customer);

              setCustomerModalOpen(false);

              setCustomerSearch("");
            }}
          >

            <div className="customer-item-info">

              <strong>
                {customer.customerName}
              </strong>

              <span>
                {customer.phone}
              </span>

              {customer.email && (
                <small>
                  {customer.email}
                </small>
              )}

            </div>

            {selectedCustomer?._id === customer._id && (
              <span className="selected-check">
                ✓
              </span>
            )}

          </button>

        ))}

      {customers.filter((customer) => {

        const search =
          customerSearch
            .toLowerCase()
            .trim();

        if (!search) return true;

        return (
          customer.customerName
            ?.toLowerCase()
            .includes(search) ||
          customer.phone
            ?.toString()
            .includes(search)
        );

      }).length === 0 && (

        <div className="no-customers">
          No customers found
        </div>

      )}

    </div>

    {/* ADD CUSTOMER */}
    <button
      type="button"
      className="add-customer-btn"
      onClick={() => {

        setCustomerModalOpen(false);

        setAddCustomerModalOpen(true);

      }}
    >
      + Add New Customer
    </button>

  </div>
</Modal>

<Modal
  open={addCustomerModalOpen}
  title="Add New Customer"
  onClose={() => setAddCustomerModalOpen(false)}
  size="md"
>
  <form onSubmit={handleCreateCustomer}>

    <div className="form-group">

      <label>
        Customer Name *
      </label>

      <input
        type="text"
        value={customerForm.customerName}
        onChange={(e) =>
          setCustomerForm({
            ...customerForm,
            customerName: e.target.value,
          })
        }
        placeholder="Enter customer name"
        required
      />

    </div>

    <div className="form-group">

      <label>
        Phone *
      </label>

      <input
        type="tel"
        value={customerForm.phone}
        onChange={(e) =>
          setCustomerForm({
            ...customerForm,
            phone: e.target.value,
          })
        }
        placeholder="Enter phone number"
        maxLength={10}
        required
      />

    </div>

    <div className="form-group">

      <label>
        Email
      </label>

      <input
        type="email"
        value={customerForm.email}
        onChange={(e) =>
          setCustomerForm({
            ...customerForm,
            email: e.target.value,
          })
        }
        placeholder="Enter email"
      />

    </div>

    <div className="form-group">

      <label>
        Address
      </label>

      <textarea
        value={customerForm.address}
        onChange={(e) =>
          setCustomerForm({
            ...customerForm,
            address: e.target.value,
          })
        }
        placeholder="Enter address"
        rows={3}
      />

    </div>

    <div className="customer-form-actions">

      <button
        type="button"
        className="cancel-btn"
        onClick={() =>
          setAddCustomerModalOpen(false)
        }
      >
        Cancel
      </button>

      <button
        type="submit"
        className="save-customer-btn"
      >
        Save Customer
      </button>

    </div>

  </form>
</Modal>

      {/* <Modal
        open={variantModalOpen}
        title={
          selectedProduct
            ? `Select Variant - ${selectedProduct.productName}`
            : "Select Variant"
        }
        onClose={() => {
          setVariantModalOpen(false);
          setSelectedProduct(null);
        }}
        size="md"
      >
        <div className="variant-selector">

          {selectedProduct?.variants?.map((variant, index) => {

            const outOfStock =
              Number(variant.currentStock || 0) <= 0;

            return (
              <button
                key={variant._id || index}
                type="button"
                className={`variant-item ${outOfStock
                    ? "variant-item--disabled"
                    : ""
                  }`}
                disabled={outOfStock}
                onClick={() =>
                  handleVariantSelect(variant)
                }
              >

                <div className="variant-item-image">

                  {variant.image ? (
                    <img
                      src={`${IMAGE_BASE_URL}/${variant.image}`}
                      alt={`${variant.color} ${variant.size}`}
                    />
                  ) : (
                    <img
                      src={noImage}
                      alt="No Image"
                    />
                  )}

                </div>

                <div className="variant-item-info">

                  <strong>
                    {variant.color || "Default Color"}
                    {variant.size
                      ? ` / ${variant.size}`
                      : ""}
                  </strong>

                  <span>
                    SKU: {variant.skuCode || "-"}
                  </span>

                  {variant.barcode && (
                    <span>
                      Barcode: {variant.barcode}
                    </span>
                  )}

                  <span>
                    Stock: {variant.currentStock ?? 0}
                  </span>

                </div>

                <div className="variant-item-price">

                  <strong>
                    ₹
                    {Number(
                      variant.sellingPrice ??
                      variant.mrp ??
                      0
                    ).toFixed(2)}
                  </strong>

                  <small>
                    {outOfStock
                      ? "Out of Stock"
                      : "Select"}
                  </small>

                </div>

              </button>
            );
          })}

        </div>
      </Modal> */}

     <Modal
  open={variantModalOpen}
  title={`Select Variant - ${selectedProduct?.productName}`}
  onClose={() => setVariantModalOpen(false)}
  size="sm"
>
  <div className="variant-selector">
    {selectedProduct?.variants
      ?.filter((variant) => variant.isActive !== false)
      .map((variant) => (
        <button
          key={variant.variantCode}
          type="button"
          className="variant-option"
          onClick={() => {
            handleAddVariant(selectedProduct, variant);
            setVariantModalOpen(false);
          }}
        >
          <div className="variant-option-main">
            <strong>
              {variant.color} / {variant.size}
            </strong>

            <span>
              ₹{Number(variant.sellingPrice || 0).toFixed(2)}
            </span>
          </div>

          <small>
            Stock: {variant.currentStock}
          </small>

          <strong>
              Discount: {variant.discountType === "percentage" ? `${variant.discountValue}%` : `₹${variant.discountValue}`}
            </strong>

        </button>
      ))}
  </div>
</Modal>
    </div>
  );
}
