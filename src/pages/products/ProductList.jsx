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
import SearchBox from "../../components/Common/SearchBox";
import {
  AddButton,
  EditButton,
  DeleteButton,
  CancelButton,
  PreviousButton,
  NextButton,
  SaveButton,
} from "../../components/Common/Button";

import Modal from "../../components/common/Modal";
import ProductForm from "./ProductForm";
import noImage from "../../assets/no-image.png";

const ProductList = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState("add"); // add | edit
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.product);
  // console.log("Products in ProductList are the :", products);
  const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 3;
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentProducts = products.slice(indexOfFirst, indexOfLast);

  const totalPages =
    products.length > 0 ? Math.ceil(products.length / rowsPerPage) : 1;
  const filteredProducts = currentProducts.filter((product) =>
    product.productName.toLowerCase().includes(search.toLowerCase()),
  );
  // console.log("currentProducts :", currentProducts);
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleEdit = (product) => {
    // console.log("Editing product:", product);
    setMode("edit");
    setSelectedProduct(product);
    setOpenModal(true);
    // setIsEdit(true);
    // setShowAddProduct(true);
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
  // console.log("Products in ProductList are the :", products);

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <h2>Product Lists</h2>

          <button
            className="btn-primary"
            onClick={() => {
              setMode("add");
              setSelectedUser(null);
              setOpenModal(true);
            }}
          >
            + Add
          </button>
        </div>

        <div className="table-card">
          <div className="table-toolbar">
            <div className="entries">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>

              <span>Entries</span>
            </div>

            <input
              className="user-search-box"
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Code</th>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Season</th>
                  <th>Style</th>
                  <th>Gender</th>
                  <th>Description</th>
                  <th>View Type</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product, index) => (
                  <>
                    <tr key={product?._id ?? index}>
                      <td>{indexOfFirst + index + 1}</td>
                      <td>{product.productCode}</td>
                      <td>
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}/${product.image}`}
                          alt={product.productName}
                          className="product-list-image"
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `${noImage}`;
                          }}
                        />
                      </td>
                      <td>{product.productName}</td>
                      <td>{product.category?.categoryName}</td>
                      <td>{product.season?.seasonName}</td>
                      <td>{product.style?.styleName}</td>
                      <td>{product.gender}</td>
                      <td>{product.description}</td>

                      <td>
                        <button
                          className="Viewvariants"
                          onClick={() =>
                            setExpandedProduct(
                              expandedProduct === product._id
                                ? null
                                : product._id,
                            )
                          }
                        >
                          View ({product.variants.length})
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
                        <td colSpan={12}>
                          <table className="variant-table">
                            <thead>
                              <tr className="variant-table-wrapper">
                                <th>brand</th>
                                <th>fabric</th>
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
                                  <td>{product.brand?.brandName}</td>
                                  <td>{product.fabric?.fabricName}</td>
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

          <div className="user-pagination">
            <p>
              Showing {filteredProducts.length === 0 ? 0 : indexOfFirst + 1}
              to {Math.min(indexOfLast, filteredProducts.length)}
              of {filteredProducts.length} entries
            </p>

            <div className="page-buttons">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                &laquo;
              </button>

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                &lsaquo;
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active-page" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                &rsaquo;
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                &raquo;
              </button>
            </div>
          </div>
        </div>

        <Modal
          open={openModal}
          title={mode === "add" ? "Add Product" : "Edit Product"}
          size="md"
          onClose={() => setOpenModal(false)}
        >
          <ProductForm
            mode={mode}
            product={selectedProduct}
            onClose={() => setOpenModal(false)}
            onSuccess={() => {
              setOpenModal(false);
              dispatch(getProducts());
            }}
          />
        </Modal>
      </div>
    </>
  );
};

export default ProductList;
