import "./ProductForm.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";

import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import {SaveButton, CancelButton} from "../../components/common/Button";

import { productValidation } from "../../validations/productValidation";
import { createProduct, updateProduct } from "../../features/product/productSlice";

import {fetchCategories} from "../../features/category/categorySlice";
import {fetchBrands} from "../../features/brand/brandSlice";
import {getFabrics} from "../../features/fabric/fabricSlice";
import {getSeasons} from "../../features/season/seasonSlice";
import {getStyles} from "../../features/style/styleSlice";

import toaster from "../../utils/toaster";

import { useEffect, useState } from "react";

const GENDER_OPTIONS = [{ label: "Men", _id: "Men" }, { label: "Women", _id: "Women" }, { label: "Unisex", _id: "Unisex" }, { label: "Kids", _id: "Kids" }];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

const emptyVariant = () => ({
  id: Date.now() + Math.random(),
  color: "",
  size: "",
  price: "",
  mrp: "",
  sellingPrice: "",
  currentStock: "",
  discountType: "percentage",
  discountPercentage: "",
  discountAmount: "",
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

export default function ProductForm({ mode = "add", product = null, onClose, onSuccess }) {

    const dispatch = useDispatch();

  const { roles } = useSelector(state => state.role);
  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [fabric, setFabric] = useState([]);
  const [season, setSeason] = useState([]);
  const [style, setStyle] = useState([]);
  const [mastersLoaded, setMastersLoaded] = useState(false);
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
    console.log('users_roles:',roles);

    const {

        register,
        handleSubmit,
        reset,
        formState: { errors }

    } = useForm({

        resolver: yupResolver(productValidation(mode)),

    });

  useEffect(() => {
    const loadMasters = async () => {
      try {
        const [
          categories,
          brands,
          fabrics,
          seasons,
          styles,
        ] = await Promise.all([
          dispatch(fetchCategories()).unwrap(),
          dispatch(fetchBrands()).unwrap(),
          dispatch(getFabrics()).unwrap(),
          dispatch(getSeasons()).unwrap(),
          dispatch(getStyles()).unwrap(),
        ]);

        setCategory(
          categories.map((c) => ({
            _id: c._id,
            label: c.categoryName,
          }))
        );

        setBrand(
          brands.map((b) => ({
            _id: b._id,
            label: b.brandName,
          }))
        );

        setFabric(
          fabrics.map((f) => ({
            _id: f._id,
            label: f.fabricName,
          }))
        );

        setSeason(
          seasons.map((s) => ({
            _id: s._id,
            label: s.seasonName,
          }))
        );

        setStyle(
          styles.map((s) => ({
            _id: s._id,
            label: s.styleName,
          }))
        );

        setMastersLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    loadMasters();
  }, []);

  useEffect(() => {
    if (!mastersLoaded) return;
    // console.log("Mode is:", mode);
    // console.log("Product is:", product);
  if (mode === "edit" && product) {

    const productData = {
      productCode: product.productCode || "",
      productName: product.productName || "",
      category: product.category?._id || "",
      brand: product.brand?._id || "",
      fabric: product.fabric?._id || "",
      season: product.season?._id || "",
      style: product.style?._id || "",
      gender: product.gender || "",
      description: product.description || "",
      variants:
        product.variants?.map((v) => ({
          id: v._id || Date.now() + Math.random(),
          color: v.color || "",
          size: v.size || "",
          price: v.price || 0,
          mrp: v.mrp || 0,
          sellingPrice: v.sellingPrice || 0,
          currentStock: v.currentStock || 0,
          discountType: v.discountType || "percentage",
          discountPercentage: v.discountValue || 0,
          discountAmount: v.discountValue || 0,
          skuCode: v.skuCode || "",
          barcode: v.barcode || "",
        })) || [emptyVariant()],
    };
//     console.log("Resetting form with product data:", productData);
//     console.log("Category State:", category);
// console.log("Product Category:", product.category?._id);
    reset(productData);
    setForm(productData); // <-- Don't forget this
  }
}, [mastersLoaded, mode, product]);

    
const onSubmit = async (data) => {
  // console.log("Form submitted with data:", data);
  // console.log("Form state:", form);
    setSubmitting(true);

    try {
      const payload = {
        ...data,
        variants: form.variants.map((v) => ({
          ...v,
          price: Number(v.price),
          mrp: Number(v.mrp),
          sellingPrice: Number(v.sellingPrice),
          currentStock: Number(v.currentStock),
          discountType: v.discountType,
          discountPercentage: v.discountPercentage ? Number(v.discountPercentage) : 0,
          discountAmount: v.discountAmount ? Number(v.discountAmount) : 0,
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

      // Image comes from your form state
  if (form.image) {
    formData.append("image", form.image);
  }
      console.log("FormData prepared for API:", formData);
      let response;
      if (mode === "edit" && product) {
        response = await dispatch(
          updateProduct({
            id: product._id,
            data: formData,
          }),
        );
      } else {
        response = await dispatch(createProduct(formData));
      }

      console.log('api_response:',response);
      
      // onProductAdded?.(response.data); // or response if your API returns the product directly

      // setForm(emptyForm());
      // onClose();
      // fetchProducts();
      // console.log("callback.",createProduct.fulfilled.match(response),updateProduct.fulfilled.match(response));
      if(createProduct.fulfilled.match(response) || updateProduct.fulfilled.match(response)) {
        console.log("Product operation successful, calling onSuccess callback.");
        toaster.success(`Product ${mode === "edit" ? "updated" : "created"} successfully!`);
        onSuccess();
      }else if(createProduct.rejected.match(response) || updateProduct.rejected.match(response)){
        console.log("Product operation failed.", response.payload);
        toaster.error(
  response?.payload ||
  `Failed to ${mode === "edit" ? "update" : "create"} product.`
);
      }
    } catch (error) {
      console.log("Failed to create product:", error);
    } finally {
      setSubmitting(false);
    }
  };

const handleClose = () => {
    setForm(emptyForm());
    onClose();
  };

  const addVariantRow = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, emptyVariant()],
    }));
  };

   const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const updateVariant = (index, field, value) => {
    setForm((prev) => {
      const variants = [...prev.variants];
      variants[index] = { ...variants[index], [field]: value };
      return { ...prev, variants };
    });
  };

    const removeVariantRow = (index) => {
      setForm((prev) => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      }));
    };

  console.log("find_errors:", errors);
  console.log("categorydata:", categories);
  return (

    <form onSubmit={handleSubmit(onSubmit)} className="user-form">

      <div className="form-grid">

        <Input
          label="Product Code"
          name="productCode"
          placeholder="e.g. GRM-1001"
          register={register}
          error={errors.productCode?.message}
          onChange={(e) => updateField("productCode", e.target.value)}
        />

        <Input
          label="Product Name"
          name="productName"
          placeholder="e.g. Classic Cotton Shirt"
          register={register}
          error={errors.productName?.message}
          onChange={(e) => updateField("productName", e.target.value)}
        />

      </div>

      <div className="form-grid">

        <Select
          label="Category"
          name="category"
          register={register}
          error={errors.category?.message}
          options={category}
          placeholder="Select Category"
        />

        <Select
          label="Brand"
          name="brand"
          register={register}
          error={errors.brand?.message}
          options={brand}
          placeholder="Select Brand"
        />

      </div>
      <div className="form-grid">

        <Select
          label="Fabric"
          name="fabric"
          register={register}
          error={errors.fabric?.message}
          options={fabric}
          placeholder="Select Fabric"
        />

        <Select
          label="Season"
          name="season"
          register={register}
          error={errors.season?.message}
          options={season}
          placeholder="Select Season"
        />
      </div>

      <div className="form-grid">

        <Select
          label="Style"
          name="style"
          placeholder="Select Style"
          register={register}
          error={errors.style?.message}
          options={style}
          placeholder="Select Style"
        />

        <Select
          label="Gender"
          name="gender"
          register={register}
          error={errors.gender?.message}
          options={GENDER_OPTIONS.map((g) => ({
            label: g.label,
            _id: g._id,
          }))}
                    placeholder="Select Gender"
        />

      </div>

      <div className="form-grid">
        <label>Product Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => updateField("image", e.target.files[0])}
        />
      </div>

      <div className="form-grid">
        <textarea
          rows={3}
          placeholder="Short description of the product..."
          {...register("description")}
        />
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
            + Variant
          </button>
        </div>

        {form.variants.map((variant, index) => (
          <div className="variant-row" key={variant.id || index}>
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
                  // {...register(`variants[${index}].color`)}
                />
              </div>

              <div className="form-group">
                <label>Size</label>
                {/* <select
                  value={variant.size}
                  onChange={(e) =>
                    updateVariant(index, "size", e.target.value)
                  }
                  // {...register(`variants[${index}].size`)}
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
                  // {...register(`variants[${index}].sellingPrice`)}
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
                  // {...register(`variants[${index}].mrp`)}
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
                  // {...register(`variants[${index}].sellingPrice`)}
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
                  // {...register(`variants[${index}].currentStock`)}
                />
              </div>

              {/* show fild for discount percentage and discount amount, and calculate selling price based on mrp and discount percentage or discount amount. If both are provided, use discount amount to calculate selling price.
               */}

               <div className="form-group">
                <label>Discount Type</label>
                <select
                  value={variant.discountType}
                  onChange={(e) =>
                    updateVariant(index, "discountType", e.target.value)
                  }
                >
                  <option value="percentage">Percentage</option>
                  <option value="amount">Amount</option>
                </select>
              </div>

              {variant.discountType === "percentage" && (
                <div className="form-group">
                  <label>Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={variant.discountPercentage}
                    onChange={(e) =>
                      updateVariant(index, "discountPercentage", e.target.value)
                    }
                  />
                </div>
              )}

              {variant.discountType === "amount" && (
                <div className="form-group">
                  <label>Discount Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={variant.discountAmount}
                    onChange={(e) =>
                      updateVariant(index, "discountAmount", e.target.value)
                    }
                  />
                </div>
              )}

              <div className="form-group">
                <label>SKU Code</label>
                <input
                  type="text"
                  placeholder="Auto-generated if empty"
                  value={variant.skuCode}
                  onChange={(e) =>
                    updateVariant(index, "skuCode", e.target.value)
                  }
                  // {...register(`variants[${index}].skuCode`)}
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
                  // {...register(`variants[${index}].barcode`)}
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

      <div className="form-footer">
        <SaveButton>
          {mode === "add" ? "Add Product" : "Update Product"}
        </SaveButton>
        <CancelButton onClick={handleClose}>Cancel</CancelButton>
      </div>

    </form>

  );

}