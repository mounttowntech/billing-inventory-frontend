import { useState } from "react";
import "./AddProductModal.css";
import {
  createProduct,
  updateProduct,
} from "../../features/product/productSlice";
import { useDispatch, useSelector } from "react-redux";
import CategoryOptions from "../Category/CategoryOptions";
import { fetchCategories } from "../../features/Category/categorySlice";
import { fetchBrands } from "../../features/Brand/brandSlice";
import { getFabrics } from "../../features/Fabric/fabricSlice";
import { getSeasons } from "../../features/season/seasonSlice";
import { getStyles } from "../../features/style/styleSlice";
import { useEffect } from "react";
import { productValidation } from "../../validations/productValidation";
import { brandValidation } from "../../validations/brandValidation";
import { categoryValidation } from "../../validations/categoryValidation";
import { styleValidation } from "../../validations/styleValidation";
import fabricValidation from "../../validations/fabricValidation";
import {
  AddButton,
  EditButton,
  DeleteButton,
  CancelButton,
  PreviousButton,
  NextButton,
  SaveButton,
} from "../../components/Common/Button";

import Input from "../../components/Common/Input";
import Select from "../../components/Common/Select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const GENDER_OPTIONS = ["Men", "Women", "Unisex", "Kids"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

const emptyVariant = () => ({
  color: "",
  size: "",
  price: "",
  mrp: "",
  sellingPrice: "",
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
  image: null,
  variants: [emptyVariant()],
});

const AddProductModal = ({
  isOpen,
  onClose,
  onProductAdded,
  fetchProducts,
  product,
  isEdit,
}) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState("");
  const { categories = [], loading } = useSelector((state) => state.category);
  const { brands = [], loading: brandsLoading } = useSelector(
    (state) => state.brand,
  );
  const { fabrics = [], loading: fabricsLoading } = useSelector(
    (state) => state.fabric,
  );
  const { seasons = [], loading: seasonsLoading } = useSelector(
    (state) => state.season,
  );
  const { styles = [], loading: stylesLoading } = useSelector(
    (state) => state.style,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productValidation),
  });

  useEffect(() => {
    dispatch(fetchCategories())
      .unwrap()
      .then((fetchedCategories) => {
        console.log("Fetched categories are the :", fetchedCategories);
        if (fetchedCategories.length > 0) {
          setCategory(fetchedCategories[0]._id);
        }
      });
    dispatch(fetchBrands())
      .unwrap()
      .then((fetchBrands) => {
        console.log("Fetched brands are the :", fetchBrands);
        if (fetchBrands.length > 0) {
          setCategory(fetchBrands[0]._id);
        }
      });
    dispatch(getFabrics())
      .unwrap()
      .then((getFabrics) => {
        console.log("Fetched fabrics are the :", getFabrics);
        if (getFabrics.length > 0) {
          setCategory(getFabrics[0]._id);
        }
      });
    dispatch(getSeasons())
      .unwrap()
      .then((getSeasons) => {
        console.log("Fetched seasons are the :", getSeasons);
        if (getSeasons.length > 0) {
          setCategory(getSeasons[0]._id);
        }
      });
    dispatch(getStyles())
      .unwrap()
      .then((getStyles) => {
        console.log("Fetched styles are the :", getStyles);
        if (getStyles.length > 0) {
          setCategory(getStyles[0]._id);
        }
      });
  }, [dispatch]);

  useEffect(() => {
    if (product && isEdit) {
      setForm({
        productCode: product.productCode || "",
        productName: product.productName || "",
        category: product.category?._id || "",
        brand: product.brand?._id || "",
        fabric: product.fabric?._id || "",
        season: product.season?._id || "",
        style: product.style?._id || "",
        gender: product.gender || "",
        description: product.description || "",
        variants: product.variants?.map((v,index) => ({
          variantCode: v.variantCode || `VAR-${index + 1}`,
          color: v.color || "",
          size: v.size || "",
          price: v.price || "",
          mrp: v.mrp || "",
          sellingPrice: v.sellingPrice || "",
          currentStock: v.currentStock || "",
          skuCode: v.skuCode || "",
          barcode: v.barcode || "",
        })) || [emptyVariant()],
      });
    }
  }, [product, isEdit]);

  /* ---------- field handlers ---------- */
  if (!isOpen) return null;

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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

  /* ---------- submit ---------- */

  const onSubmit = async (e) => {
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        variants: form.variants.map((v) => ({
          ...v,
          price: Number(v.price),
          mrp: Number(v.mrp),
          sellingPrice: Number(v.sellingPrice),
          currentStock: Number(v.currentStock),
        })),
      };

      console.log("Payload before sending to API:", payload);
      const formData = new FormData();

      Object.keys(payload).forEach((key) => {
        if (key === "variants") {
          formData.append("variants", JSON.stringify(payload.variants));
        } else if (key === "image") {
          if (payload.image) {
            formData.append("image", payload.image);
          }
        } else {
          formData.append(key, payload[key]);
        }
      });
      let response;
      if (isEdit) {
        response = await dispatch(
          updateProduct({
            id: product._id,
            data: formData,
          }),
        ).unwrap();
      } else {
        response = await dispatch(createProduct(formData)).unwrap();
      }

      console.log(response);

      onProductAdded?.(response.data); // or response if your API returns the product directly

      setForm(emptyForm());
      onClose();
      fetchProducts();
    } catch (error) {
      console.error("Failed to create product:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm(emptyForm());
    onClose();
  };

  console.log("Brands in AddProductModal are the :", brands);
  console.log("product_form_error :", errors);

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

        <form onSubmit={handleSubmit(onSubmit)} className="modal-body">
          {/* ===== Basic Info ===== */}
          <div className="form-section">
            <h4 className="form-section-title">Basic Information</h4>
            <div className="form-grid">
              <div className="form-group">
                {/* <label>Product Code *</label> */}
                <Input
                  label="Product Code"
                  name="productCode"
                  type="text"
                  placeholder="e.g. GRM-1001"
                  register={register}
                  error={errors.productCode?.message}
                  value={form.productCode}
                  onChange={(e) => updateField("productCode", e.target.value)}
                />

                {/* <input
                  type="text"
                  placeholder="e.g. GRM-1001"
                  value={form.productCode}
                  onChange={(e) => updateField("productCode", e.target.value)}
                /> */}
              </div>

              <div className="form-group">
                {/* <label>Product Name *</label> */}
                <Input
                  label="Product Name"
                  name="productName"
                  type="text"
                  placeholder="e.g. Classic Cotton Shirt"
                  register={register}
                  error={errors.productName?.message}
                  value={form.productName}
                  onChange={(e) => updateField("productName", e.target.value)}
                />
                {/* <input
                  type="text"
                  placeholder="e.g. Classic Cotton Shirt"
                  value={form.productName}
                  onChange={(e) => updateField("productName", e.target.value)}
                /> */}
              </div>

              <div className="form-group">
                {/* <label>Category *</label> */}
                <Select
                  label="Category"
                  name="category"
                  register={register}
                  error={errors.category?.message}
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  options={categories}
                  optionValue="_id"
                  optionLabel="categoryName"
                  placeholder="Select Category"
                />

                {/* <select
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}{" "}
                </select> */}
              </div>

              <div className="form-group">
                {/* <label>Brand *</label> */}
                <Select
                  label="Brand"
                  name="brand"
                  register={register}
                  error={errors.brand?.message}
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                  options={brands}
                  optionValue="_id"
                  optionLabel="brandName"
                  placeholder="Select Brand"
                />
                {/* <select
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                >
                  <option value="">Select brand</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.brandName}
                    </option>
                  ))}{" "}
                </select> */}
              </div>

              <div className="form-group">
                {/* <label>Fabric</label> */}
                <Select
                  label="Fabric"
                  name="fabric"
                  register={register}
                  error={errors.fabric?.message}
                  value={form.fabric}
                  onChange={(e) => updateField("fabric", e.target.value)}
                  options={fabrics}
                  optionValue="_id"
                  optionLabel="fabricName"
                  placeholder="Select Fabric"
                />
                {/* <select
                  value={form.fabric}
                  onChange={(e) => updateField("fabric", e.target.value)}
                >
                  <option value="">Select fabric</option>
                  {fabrics.map((fabric) => (
                    <option key={fabric._id} value={fabric._id}>
                      {fabric.fabricName}
                    </option>
                  ))}{" "}
                </select> */}
              </div>

              <div className="form-group">
                {/* <label>Season</label> */}
                <Select
                  label="Season"
                  name="season"
                  register={register}
                  error={errors.season?.message}
                  value={form.season}
                  onChange={(e) => updateField("season", e.target.value)}
                  options={seasons}
                  optionValue="_id"
                  optionLabel="seasonName"
                  placeholder="Select Season"
                />
                {/* <select
                  value={form.season}
                  onChange={(e) => updateField("season", e.target.value)}
                >
                  <option value="">Select season</option>
                  {seasons.map((season) => (
                    <option key={season._id} value={season._id}>
                      {season.seasonName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                {/* <label>Style</label> */}
                <Select
                  label="Style"
                  name="style"
                  placeholder="Select Style"
                  register={register}
                  error={errors.style?.message}
                  value={form.style}
                  onChange={(e) => updateField("style", e.target.value)}
                  options={styles}
                  optionValue="_id"
                  optionLabel="styleName"
                  placeholder="Select Style"
                />
                {/* <select
                  value={form.style}
                  onChange={(e) => updateField("style", e.target.value)}
                >
                  <option value="">Select style</option>
                  {styles.map((style) => (
                    <option key={style._id} value={style._id}>
                      {style.styleName}
                    </option>
                  ))}
                </select> */}
              </div>

              <div className="form-group">
                {/* <label>Gender *</label> */}
                <Select
                  label="Gender"
                  name="gender"
                  register={register}
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  options={GENDER_OPTIONS.map((g) => ({
                    label: g,
                    value: g,
                  }))}
                />
                {/* <select
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                >
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select> */}
              </div>
            </div>

            <div className="form-group">
              <label>Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => updateField("image", e.target.files[0])}
              />
            </div>

            <div className="form-group full-width">
              {/* <label>Description</label> */}
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
                    {/* <select
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
                    </select> */}
                    {/* size is input field now, not select */}
                    <input
                      type="text"
                      placeholder="e.g. Small, Medium, Large"
                      value={variant.size}
                      onChange={(e) =>
                        updateVariant(index, "size", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={variant.sellingPrice}
                      onChange={(e) =>
                        updateVariant(index, "sellingPrice", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>MRP (₹)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={variant.mrp}
                      onChange={(e) =>
                        updateVariant(index, "mrp", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Selling Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={variant.sellingPrice}
                      onChange={(e) =>
                        updateVariant(index, "sellingPrice", e.target.value)
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
              </div>
            ))}
          </div>

          {/* ===== Footer actions ===== */}
          <div className="modal-footer">
            <CancelButton onClick={handleClose}>Cancel</CancelButton>
            <SaveButton type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Product"}
            </SaveButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
