import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { unitValidation } from "../../validations/UnitValidation";
import { SaveButton, CancelButton } from "../../components/Common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";

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
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="form-grid">
        <Input
          label="Unit Name"
          name="name"
          placeholder="Enter Unit Name"
          register={register}
          error={errors.name?.message}
        />

        <Input
          label="Short Name"
          name="shortName"
          placeholder="Eg. Kg, Pc, Box"
          register={register}
          error={errors.shortName?.message}
        />
      </div>

      <div className="unit-form-group">
        <Select
          label="Allow Decimal"
          name="allowDecimal"
          register={register}
          error={errors.allowDecimal?.message}
          optionValue="value"
          optionLabel="label"
          options={[
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
          ]}
        />
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
  );
};

export default UnitForm;
