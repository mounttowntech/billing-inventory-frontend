import AddProductModal from "./AddProductModal";
import { useState } from "react";
import "./ProductList.css";
import { fetchCategories } from "../../features/Category/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getProducts,
  deleteProduct,
} from "../../features/product/productSlice";
import {
  AddButton,
  EditButton,
  DeleteButton,
  CancelButton,
  PreviousButton,
  NextButton,
  SaveButton,
} from "../../components/Common/Button";
const ProductList = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [category, setCategory] = useState("");
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentProducts = products.slice(indexOfFirst, indexOfLast);

  const totalPages =
    products.length > 0 ? Math.ceil(products.length / itemsPerPage) : 1;

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEdit(true);
    setShowAddProduct(true);
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [products, totalPages, currentPage]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (confirmDelete) {
      dispatch(deleteProduct(id));
    }
  };
  console.log("Categories in AddProductModal are the :", category);

  return (
    <>
      <div className="dash-actions">
        <AddButton onClick={() => setShowAddProduct(true)}>
          + Add Product
        </AddButton>
      </div>

      <AddProductModal
        isOpen={showAddProduct}
        onClose={() => {
          setShowAddProduct(false);
          setSelectedProduct(null);
          setIsEdit(false);
        }}
        onProductAdded={(product) => {
          console.log(product);
        }}
        fetchProducts={() => dispatch(getProducts())}
        product={selectedProduct}
        isEdit={isEdit}
      />
      <div className="product-table-wrapper">
        <table className="product-table">
          <tbody>
            {currentProducts.map((product) => (
              <>
                <tr key={product._id}>
                  <td>{product.productCode}</td>
                  <td>{product.productName}</td>
                  <td>{product.category?.categoryName}</td>
                  <td>{product.brand?.brandName}</td>
                  <td>{product.fabric?.fabricName}</td>
                  <td>{product.season?.seasonName}</td>
                  <td>{product.style?.styleName}</td>
                  <td>{product.gender}</td>
                  <td>{product.description}</td>

                  <td>
                    <button
                      className="Viewvariants"
                      onClick={() =>
                        setExpandedProduct(
                          expandedProduct === product._id ? null : product._id,
                        )
                      }
                    >
                      View Variants ({product.variants.length})
                    </button>
                  </td>

                  <td className="action-buttons">
                    <EditButton onClick={() => handleEdit(product)}>
                      Edit
                    </EditButton>
                    <DeleteButton
                      onClick={() => handleDelete(product._id)}
                      className="secondary-heading2"
                    >
                      Delete
                    </DeleteButton>
                  </td>
                </tr>

                {expandedProduct === product._id && (
                  <tr>
                    <td colSpan={11}>
                      <table className="variant-table">
                        <thead>
                          <tr>
                            <th>Color</th>
                            <th>Size</th>
                            <th>MRP</th>
                            <th>Selling Price</th>
                            <th>Stock</th>
                            <th>SKU</th>
                            <th>Barcode</th>
                          </tr>
                        </thead>

                        <tbody>
                          {product.variants.map((variant, index) => (
                            <tr key={index}>
                              <td>{variant.color}</td>
                              <td>{variant.size}</td>
                              <td>₹{variant.mrp}</td>
                              <td>₹{variant.sellingPrice}</td>
                              <td>{variant.currentStock}</td>
                              <td>{variant.skuCode}</td>
                              <td>{variant.barcode}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <PreviousButton
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </PreviousButton>

        <span>
          Page {currentPage} of {totalPages || 1}
        </span>

        <NextButton
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </NextButton>
      </div>
    </>
  );
};

export default ProductList;
