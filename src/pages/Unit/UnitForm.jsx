import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { unitValidation } from "../../validations/UnitValidation";
import { SaveButton, CancelButton } from "../../components/Common/Button";

const UnitForm = ({ unit, editId, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(unitValidation),
    defaultValues: {
      name: "",
      shortName: "",
      allowDecimal: false,
      description: "",
    },
  });

  // Populate form when editing, reset when adding
  useEffect(() => {
    if (unit) {
      reset({
        name: unit.name || "",
        shortName: unit.shortName || "",
        allowDecimal: unit.allowDecimal,
        description: unit.description || "",
      });
    } else {
      reset({
        name: "",
        shortName: "",
        allowDecimal: false,
        description: "",
      });
    }
  }, [unit, reset]);

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
      <div className="unit-modal">
        <div className="unit-modal-header">
          <h3>{editId ? "Edit Unit" : "Add Unit"}</h3>

          <button className="close-btn" onClick={handleCancel}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="unit-form-group">
            <label>Unit Name</label>

            <input
              type="text"
              placeholder="Enter Unit Name"
              {...register("name")}
            />

            <p>{errors.name?.message}</p>
          </div>

          <div className="unit-form-group">
            <label>Short Name</label>

            <input
              type="text"
              placeholder="Eg. Kg, Pc, Box"
              {...register("shortName")}
            />

            <p>{errors.shortName?.message}</p>
          </div>

          <div className="unit-form-group">
            <label>Allow Decimal</label>

            <select {...register("allowDecimal")}>
              <option value={false}>No</option>
              <option value={true}>Yes</option>
            </select>

            <p>{errors.allowDecimal?.message}</p>
          </div>

          <div className="unit-form-group">
            <label>Description</label>

            <textarea
              rows="4"
              placeholder="Enter Description"
              {...register("description")}
            />

            <p>{errors.description?.message}</p>
          </div>

          <div className="unit-form-buttons">
            <SaveButton type="submit">
              {editId ? "Update Unit" : "Save Unit"}
            </SaveButton>

            <CancelButton onClick={handleCancel}>Cancel</CancelButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnitForm;
