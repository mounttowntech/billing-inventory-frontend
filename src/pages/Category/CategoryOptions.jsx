import { useEffect, useState } from "react";
import "./CategoryOptions.css";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/common/Modal";
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
import SearchBox from "../../components/Common/SearchBox";
import CategoryForm from "./CategoryForm";

const CategoryOptions = ({ value, onChange }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 2;
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("add"); // add | edit
  const [selectedCategory, setSelectedCategory] = useState(null);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const { categories = [] } = useSelector((state) => state.category);
  console.log("categories_data:", categories);
  const currentCategories = categories.slice(indexOfFirst, indexOfLast);
  const totalPages =
    categories.length > 0 ? Math.ceil(categories.length / rowsPerPage) : 1;
  // const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
console.log("currentCategories:", currentCategories);
  const filteredCategories = currentCategories.filter((category) =>
    category.categoryName?.toLowerCase().includes(search.toLowerCase()),
  );

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
    console.log("category:", category);
    setSelectedCategory(category);
    setMode("edit");
    setEditId(category._id);

    reset({
      categoryName: category.categoryName,
    });
    setValue("categoryName", category.categoryName);
    setOpenModal(true);
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (
      currentPage > Math.ceil(categories.length / rowsPerPage) &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
    }
  }, [categories, currentPage]);

  // const onSubmit = (data) => {
  //   if (editId) {
  //     dispatch(
  //       updateCategory({
  //         id: editId,
  //         category: data,
  //       }),
  //     ).then(() => {
  //       dispatch(fetchCategories());
  //       reset();
  //       setEditId(null);
  //       setOpenModal(false);
  //     });
  //   } else {
  //     dispatch(createCategory(data)).then(() => {
  //       dispatch(fetchCategories());
  //       reset();
  //       setOpenModal(false);
  //     });
  //   }
  // };

  const handleDelete = (id) => {
    if (window.confirm("Delete this category?")) {
      dispatch(deleteCategory(id)).then(() => {
        dispatch(fetchCategories());
      });
    }
  };

  return (
    <div className="page-container">
      {/* <h2>Category Management</h2> */}
      <div className="page-header">
        <h2>Category Lists</h2>

        {/* <button
          className="btn-primary"
          onClick={() => {
            setMode("add");
            setSelectedUser(null);
            setOpenModal(true);
          }}
        >
          + Add User
        </button> */}
        <AddButton
        onClick={() => {
          setMode("add");
          reset();
          setEditId(null);
          setOpenModal(true);
        }}
      >
        + Add
      </AddButton>
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
            placeholder="Search categories..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <table className="custom-table">
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

        <div className="user-pagination">
          <p>
            Showing {filteredCategories.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredCategories.length)}
            of {filteredCategories.length} entries
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
                    title={mode === "add" ? "Add Category" : "Edit Category"}
                    size="md"
                    onClose={() => setOpenModal(false)}
                  >
                    <CategoryForm
                      mode={mode}
                      category={selectedCategory}
                      onClose={() => setOpenModal(false)}
                      onSuccess={() => {
                        setOpenModal(false);
                        dispatch(fetchCategories());
                      }}
                    />
                  </Modal>

      {/* {showModal && (
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
      )} */}
      
    </div>
  );
};

export default CategoryOptions;
