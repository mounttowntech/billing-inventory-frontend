import AddProductModal from "./AddProductModal";
import { useState } from "react";
import "./ProductList.css";
import { fetchCategories } from "../../features/Category/categorySlice";

const ProductList = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [category, setCategory] = useState("");
  return (
    <>
      <div className="dash-actions">
        <button className="secondary" onClick={() => setShowAddProduct(true)}>
          + Add Product
        </button>
        <button>+ New Sale</button>
      </div>

      <AddProductModal
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onProductAdded={(product) => {
          console.log("Product added:", product);
          // TODO: refresh product list / show a success toast
        }}
      />
    </>
  );
};

export default ProductList;
