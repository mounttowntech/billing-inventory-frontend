import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { colorValidation } from "../../validations/colorValidation";
import { SaveButton, CancelButton } from "../../components/Common/Button";

const ColorForm = ({ color, editId, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(colorValidation),
    defaultValues: {
      colorCode: "",
      colorName: "",
      hexCode: "",
      status: true,
    },
  });

  // Populate form when editing, reset when adding
  useEffect(() => {
    if (color) {
      reset({
        colorCode: color.colorCode || "",
        colorName: color.colorName || "",
        hexCode: color.hexCode || "",
        status: color.status ? "true" : "false",
      });
    } else {
      reset({
        colorCode: "",
        colorName: "",
        hexCode: "",
        status: true,
      });
    }
  }, [color, reset]);

  const handleCancel = () => {
    reset({ status: true });
    onCancel();
  };

  const submitHandler = (data) => {
    data.status = data.status === "true" || data.status === true;
    onSubmit(data);
    reset({ status: true });
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <form
        className="color-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit(submitHandler)}
      >
        <h2>{editId ? "Edit Color" : "Add Color"}</h2>

        <div className="form-group">
          <label>Color Code</label>
          <input placeholder="Enter Color Code" {...register("colorCode")} />
          <p>{errors.colorCode?.message}</p>
        </div>

        <div className="form-group">
          <label>Color Name</label>
          <input placeholder="Enter Color Name" {...register("colorName")} />
          <p>{errors.colorName?.message}</p>
        </div>

        <div className="form-group">
          <label>Hex Code</label>
          <input type="text" placeholder="#FF0000" {...register("hexCode")} />
          <p>{errors.hexCode?.message}</p>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select {...register("status")}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className="form-buttons">
          <SaveButton type="submit">{editId ? "Update" : "Save"}</SaveButton>
          <CancelButton type="button" onClick={handleCancel}>
            Cancel
          </CancelButton>
        </div>
      </form>
    </div>
  );
};

export default ColorForm;
