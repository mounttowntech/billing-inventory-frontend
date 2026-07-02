import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../features/Category/categorySlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categoryValidation } from "../../validations/categoryValidation";

const CategoryOptions = ({ value, onChange }) => {
  const dispatch = useDispatch();

  const { categories = [], loading } = useSelector((state) => state.category);

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

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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
      });
    } else {
      dispatch(createCategory(data)).then(() => {
        dispatch(fetchCategories());
        reset();
      });
    }
  };

  const handleEdit = (category) => {
    setEditId(category._id);
    setValue("categoryName", category.categoryName);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this category?")) {
      dispatch(deleteCategory(id)).then(() => {
        dispatch(fetchCategories());
      });
    }
  };

  return (
    <div>
      <h2>Category Management</h2>

      <div>
        <input
          type="text"
          placeholder="Enter Category"
          {...register("categoryName")}
        />

        <p style={{ color: "red" }}>{errors.categoryName?.message}</p>

        <button type="button" onClick={handleSubmit(onSubmit)}>
          {editId ? "Update" : "Add"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              reset();
              setEditId(null);
            }}
          >
            Cancel
          </button>
        )}
      </div>

      <br />

      {loading && <p>Loading...</p>}

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>#</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category, index) => (
            <tr key={category._id}>
              <td>{index + 1}</td>

              <td>{category.categoryName}</td>

              <td>
                <button type="button" onClick={() => handleEdit(category)}>
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(category._id)}
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
    </div>
  );
};

export default CategoryOptions;
