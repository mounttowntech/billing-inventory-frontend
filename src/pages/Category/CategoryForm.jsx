import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categoryValidation } from "../../validations/categoryValidation";
import { SaveButton, CancelButton } from "../../components/Common/Button";

const CategoryForm = ({ category, editId, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categoryValidation),
    defaultValues: {
      categoryName: "",
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        categoryName: category.categoryName || "",
      });
    } else {
      reset({
        categoryName: "",
      });
    }
  }, [category, reset]);

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const submitHandler = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{editId ? "Update Category" : "Add Category"}</h2>

        <input
          type="text"
          placeholder="Enter Category"
          {...register("categoryName")}
          className="form-control"
        />

        <p className="error-text">{errors.categoryName?.message}</p>

        <div className="modal-buttons">
          <SaveButton onClick={handleSubmit(submitHandler)}>
            {editId ? "Update" : "Add"}
          </SaveButton>
          <CancelButton onClick={handleCancel}>Cancel</CancelButton>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
