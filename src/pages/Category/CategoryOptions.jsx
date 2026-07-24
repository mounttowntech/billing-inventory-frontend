import { useEffect, useState } from "react";
import "./CategoryOptions.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../features/Category/categorySlice";
import {
  AddButton,
  EditButton,
  DeleteButton,
} from "../../components/Common/Button";
import SearchBox from "../../components/Common/SearchBox";
import CategoryForm from "./CategoryForm";

const CategoryOptions = ({ value, onChange }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const { categories = [] } = useSelector((state) => state.category);
  const currentCategories = categories.slice(indexOfFirst, indexOfLast);
  const totalPages =
    categories.length > 0 ? Math.ceil(categories.length / itemsPerPage) : 1;
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const [search, setSearch] = useState("");

  const filteredCategories = currentCategories.filter((category) =>
    category.categoryName.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (
      currentPage > Math.ceil(categories.length / itemsPerPage) &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
    }
  }, [categories, currentPage]);

  const handleFormSubmit = (data) => {
    if (editId) {
      dispatch(
        updateCategory({
          id: editId,
          category: data,
        }),
      ).then(() => {
        dispatch(fetchCategories());
        setEditId(null);
        setEditingCategory(null);
        setShowModal(false);
      });
    } else {
      dispatch(createCategory(data)).then(() => {
        dispatch(fetchCategories());
        setShowModal(false);
      });
    }
  };

  const handleEdit = (category) => {
    setEditId(category._id);
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditId(null);
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditingCategory(null);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this category?")) {
      dispatch(deleteCategory(id)).then(() => {
        dispatch(fetchCategories());
      });
    }
  };

  return (
    <div className="category-container">
      <h2>Category Management</h2>

      {showModal && (
        <CategoryForm
          category={editingCategory}
          editId={editId}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}
      <br />
      <div className="category-actions">
        <SearchBox
          placeholder="Search Category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton onClick={handleAdd}>Add Category</AddButton>
      </div>
      <table border="1" cellPadding="8" width="100%" className="category-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredCategories.map((category, index) => (
            <tr key={category._id}>
              <td>{indexOfFirst + index + 1}</td>
              <td>{category.categoryName}</td>

              <td className="action-buttons">
                <EditButton onClick={() => handleEdit(category)} />
                <DeleteButton onClick={() => handleDelete(category._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoryOptions;
