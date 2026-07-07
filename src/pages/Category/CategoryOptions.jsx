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
  SaveButton,
  CancelButton,
} from "../../components/Common/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categoryValidation } from "../../validations/categoryValidation";

const CategoryOptions = ({ value, onChange }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const { categories = [], loading } = useSelector((state) => state.category);
  const currentCategories = categories.slice(indexOfFirst, indexOfLast);
  const totalPages =
    categories.length > 0 ? Math.ceil(categories.length / itemsPerPage) : 1;
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categoryValidation),
    defaultValues: {
      categoryName: "",
    },
  });
  const [editId, setEditId] = useState(null);

  const handleEdit = (category) => {
    setEditId(category._id);

    reset({
      categoryName: category.categoryName,
    });
    setValue("categoryName", category.categoryName);
    setShowModal(true);
  };

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

  const onSubmit = (data) => {
    if (editId) {
      dispatch(
        updateCategory({
          id: editId,
          category: data,
        }),
      ).then(() => {
        dispatch(fetchCategories());
        reset();
        setEditId(null);
        setShowModal(false);
      });
    } else {
      dispatch(createCategory(data)).then(() => {
        dispatch(fetchCategories());
        reset();
        setShowModal(false);
      });
    }
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
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editId ? "Update Category" : "Add Category"}</h2>

            <input
              type="text"
              placeholder="Enter Category"
              {...register("categoryName")}
              className="category-input"
            />

            <p className="error-text">{errors.categoryName?.message}</p>

            <div className="modal-buttons">
              <SaveButton onClick={handleSubmit((data) => onSubmit(data))}>
                {editId ? "Update" : "Add"}
              </SaveButton>
              <CancelButton
                onClick={() => {
                  reset();
                  setEditId(null);
                  setShowModal(false);
                }}
              >
                Cancel
              </CancelButton>
            </div>
          </div>
        </div>
      )}

      <br />
      <AddButton
        onClick={() => {
          setShowModal(true);
        }}
      >
        Add Category
      </AddButton>
      {loading && <p>Loading...</p>}

      <table border="1" cellPadding="8" width="100%" className="category-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentCategories.map((category, index) => (
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
