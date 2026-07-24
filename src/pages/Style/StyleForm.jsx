import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { styleValidation } from "../../validations/styleValidation";
import { SaveButton } from "../../components/Common/Button";

const StyleForm = ({ style, editId, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(styleValidation),
    defaultValues: {
      styleName: "",
      styleCode: "",
    },
  });

  // Populate form when editing, reset when adding
  useEffect(() => {
    if (style) {
      reset({
        styleName: style.styleName || "",
        styleCode: style.styleCode || "",
      });
    } else {
      reset({
        styleName: "",
        styleCode: "",
      });
    }
  }, [style, reset]);

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
        <h2>{editId ? "Update Style" : "Add Style"}</h2>

        <label className="field-label">Style Name</label>
        <input
          className="text-input"
          placeholder="Style Name"
          {...register("styleName")}
        />
        <p className="error-text">{errors.styleName?.message}</p>

        <label className="field-label">Style Code</label>
        <input
          className="text-input"
          placeholder="Style Code"
          {...register("styleCode")}
        />
        <p className="error-text">{errors.styleCode?.message}</p>

        <div className="modal-actions">
          <button className="btn btn-cancel" onClick={handleCancel}>
            Cancel
          </button>

          <SaveButton onClick={handleSubmit(submitHandler)}>
            {editId ? "Update" : "Create"}
          </SaveButton>
        </div>
      </div>
    </div>
  );
};

export default StyleForm;
