import { useState } from "react";
import "./AddProductModal.css";
import { createProduct } from "../../features/product/productSlice";
import { useDispatch, useSelector } from "react-redux";
import CategoryOptions from "../Category/CategoryOptions";
import { fetchCategories } from "../../features/Category/categorySlice";
import { useEffect } from "react";

const BRAND_OPTIONS = [
  "Zylo",
  "Urban Thread",
  "Nova Fit",
  "Kasva",
  "Metro Basics",
];
const FABRIC_OPTIONS = [
  "Cotton",
  "Polyester",
  "Denim",
  "Linen",
  "Rayon",
  "Blended",
];
const SEASON_OPTIONS = ["Summer", "Winter", "Monsoon", "All Season"];
const STYLE_OPTIONS = [
  "Casual",
  "Formal",
  "Party Wear",
  "Sports",
  "Traditional",
];

const GENDER_OPTIONS = ["Men", "Women", "Unisex", "Kids"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

const emptyVariant = () => ({
  color: "",
  size: "",
  price: "",
  currentStock: "",
  skuCode: "",
  barcode: "",
});

const emptyForm = () => ({
  productCode: "",
  productName: "",
  category: "",
  brand: "",
  fabric: "",
  season: "",
  style: "",
  gender: "",
  description: "",
  variants: [emptyVariant()],
});

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState("");
  const { categories = [], loading } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories())
      .unwrap()
      .then((fetchedCategories) => {
        console.log("Fetched categories are the :", fetchedCategories);
        if (fetchedCategories.length > 0) {
          setCategory(fetchedCategories[0]._id);
        }
      });
  }, [dispatch]);
  /* ---------- field handlers ---------- */
  if (!isOpen) return null;

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const updateVariant = (index, field, value) => {
    setForm((prev) => {
      const variants = [...prev.variants];
      variants[index] = { ...variants[index], [field]: value };
      return { ...prev, variants };
    });
  };

  const addVariantRow = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, emptyVariant()],
    }));
  };

  const removeVariantRow = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  /* ---------- validation ---------- */

  const validate = () => {
    const newErrors = {};
    if (!form.productCode.trim())
      newErrors.productCode = "Product code is required";
    if (!form.productName.trim())
      newErrors.productName = "Product name is required";
    if (!form.category) newErrors.category = "Select a category";
    if (!form.brand) newErrors.brand = "Select a brand";
    if (!form.gender) newErrors.gender = "Select a gender";

    form.variants.forEach((v, i) => {
      if (
        !v.color.trim() ||
        !v.size ||
        v.price === "" ||
        v.currentStock === ""
      ) {
        newErrors[`variant-${i}`] = "Color, size, price and stock are required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------- submit ---------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      const payload = {
        ...form,
        variants: form.variants.map((v) => ({
          ...v,
          price: Number(v.price),
          currentStock: Number(v.currentStock),
        })),
      };

      const response = await dispatch(createProduct(payload));

      console.log(response);

      onProductAdded?.(response.data); // or response if your API returns the product directly

      setForm(emptyForm());
      onClose();
    } catch (error) {
      console.error("Failed to create product:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm(emptyForm());
    setErrors({});
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Product</h2>
          <button
            className="modal-close"
            onClick={handleClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* ===== Basic Info ===== */}
          <div className="form-section">
            <h4 className="form-section-title">Basic Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Product Code *</label>
                <input
                  type="text"
                  placeholder="e.g. GRM-1001"
                  value={form.productCode}
                  onChange={(e) => updateField("productCode", e.target.value)}
                />
                {errors.productCode && (
                  <span className="error">{errors.productCode}</span>
                )}
              </div>

              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Classic Cotton Shirt"
                  value={form.productName}
                  onChange={(e) => updateField("productName", e.target.value)}
                />
                {errors.productName && (
                  <span className="error">{errors.productName}</span>
                )}
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}{" "}
                </select>
                {errors.category && (
                  <span className="error">{errors.category}</span>
                )}
              </div>

              <div className="form-group">
                <label>Brand *</label>
                <select
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                >
                  <option value="">Select brand</option>
                  {BRAND_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {errors.brand && <span className="error">{errors.brand}</span>}
              </div>

              <div className="form-group">
                <label>Fabric</label>
                <select
                  value={form.fabric}
                  onChange={(e) => updateField("fabric", e.target.value)}
                >
                  <option value="">Select fabric</option>
                  {FABRIC_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Season</label>
                <select
                  value={form.season}
                  onChange={(e) => updateField("season", e.target.value)}
                >
                  <option value="">Select season</option>
                  {SEASON_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Style</label>
                <select
                  value={form.style}
                  onChange={(e) => updateField("style", e.target.value)}
                >
                  <option value="">Select style</option>
                  {STYLE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Gender *</label>
                <select
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                >
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                {errors.gender && (
                  <span className="error">{errors.gender}</span>
                )}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                rows={3}
                placeholder="Short description of the product..."
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>
          </div>

          {/* ===== Variants ===== */}
          <div className="form-section">
            <div className="form-section-header">
              <h4 className="form-section-title">Variants</h4>
              <button
                type="button"
                className="secondary btn-sm"
                onClick={addVariantRow}
              >
                Variant
              </button>
            </div>

            {form.variants.map((variant, index) => (
              <div className="variant-row" key={index}>
                <div className="variant-grid">
                  <div className="form-group">
                    <label>Color</label>
                    <input
                      type="text"
                      placeholder="e.g. Navy Blue"
                      value={variant.color}
                      onChange={(e) =>
                        updateVariant(index, "color", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Size</label>
                    <select
                      value={variant.size}
                      onChange={(e) =>
                        updateVariant(index, "size", e.target.value)
                      }
                    >
                      <option value="">Size</option>
                      {SIZE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={variant.price}
                      onChange={(e) =>
                        updateVariant(index, "price", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock Qty</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={variant.currentStock}
                      onChange={(e) =>
                        updateVariant(index, "currentStock", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>SKU Code</label>
                    <input
                      type="text"
                      placeholder="Auto-generated if empty"
                      value={variant.skuCode}
                      onChange={(e) =>
                        updateVariant(index, "skuCode", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Barcode</label>
                    <input
                      type="text"
                      placeholder="Auto-generated if empty"
                      value={variant.barcode}
                      onChange={(e) =>
                        updateVariant(index, "barcode", e.target.value)
                      }
                    />
                  </div>
                </div>

                {form.variants.length > 1 && (
                  <button
                    type="button"
                    className="remove-variant"
                    onClick={() => removeVariantRow(index)}
                    aria-label="Remove variant"
                  >
                    Remove
                  </button>
                )}

                {errors[`variant-${index}`] && (
                  <span className="error">{errors[`variant-${index}`]}</span>
                )}
              </div>
            ))}
          </div>

          {/* ===== Footer actions ===== */}
          <div className="modal-footer">
            <button type="button" className="secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
