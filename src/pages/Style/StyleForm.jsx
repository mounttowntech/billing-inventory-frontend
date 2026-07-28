import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { styleValidation } from "../../validations/styleValidation";
import { CancelButton, SaveButton } from "../../components/Common/Button";
import Input from "../../components/common/Input";

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
    <form onSubmit={handleSubmit} className="season-form">
      <div className="form-grid">
        <Input
          label="Style Name"
          name="styleName"
          register={register}
          error={errors.styleName?.message}
        />
        <Input
          label="Style Code"
          name="styleCode"
          register={register}
          error={errors.styleCode?.message}
        />
      </div>
      <div className="modal-actions">
        <SaveButton onClick={handleSubmit(submitHandler)}>
          {editId ? "Update" : "Create"}
        </SaveButton>
        <CancelButton className="btn btn-cancel" onClick={handleCancel}>
          Cancel
        </CancelButton>
      </div>
    </form>
  );
};

export default StyleForm;
