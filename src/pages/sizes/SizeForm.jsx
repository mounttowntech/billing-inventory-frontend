import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { sizesValidation } from "../../validations/SizesValidation";
import { SaveButton, CancelButton } from "../../components/Common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";

const SizeForm = ({ size, editId, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(sizesValidation),
    defaultValues: {
      sizeCode: "",
      sizeName: "",
      displayOrder: "",
      chest: "",
      waist: "",
      hip: "",
      status: "true",
    },
  });

  useEffect(() => {
    if (size) {
      reset({
        sizeCode: size.sizeCode || "",
        sizeName: size.sizeName || "",
        displayOrder: size.displayOrder ?? "",
        chest: size.chest ?? "",
        waist: size.waist ?? "",
        hip: size.hip ?? "",
        status: size.status ? "true" : "false",
      });
    } else {
      reset({
        sizeCode: "",
        sizeName: "",
        displayOrder: "",
        chest: "",
        waist: "",
        hip: "",
        status: "true",
      });
    }
  }, [size, reset]);

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const submitHandler = (data) => {
    data.status = data.status === "true" || data.status === true;
    onSubmit(data);
    reset();
  };

  return (
    <form className="size-form" onSubmit={handleSubmit(submitHandler)}>
      <div className="form-grid">
        <Input
          label="Size Code"
          name="sizeCode"
          placeholder="Enter Size Code"
          register={register}
          error={errors.sizeCode?.message}
        />

        <Input
          label="Size Name"
          name="sizeName"
          placeholder="Enter Size Name"
          register={register}
          error={errors.sizeName?.message}
        />
      </div>
      <div className="form-grid">
        <Input
          label="Display Order"
          name="displayOrder"
          type="number"
          placeholder="Display Order"
          register={register}
          error={errors.displayOrder?.message}
        />

        <Input
          label="Chest"
          name="chest"
          type="number"
          placeholder="Chest"
          register={register}
          error={errors.chest?.message}
        />
      </div>
      <div className="form-grid">
        <Input
          label="Waist"
          name="waist"
          type="number"
          placeholder="Waist"
          register={register}
          error={errors.waist?.message}
        />
        <Input
          label="Hip"
          name="hip"
          type="number"
          placeholder="Hip"
          register={register}
          error={errors.hip?.message}
        />
      </div>

      <Select
        label="Status"
        name="status"
        register={register}
        error={errors.status?.message}
        options={[
          { _id: "true", label: "Active" },
          { _id: "false", label: "Inactive" },
        ]}
        placeholder="Status"
      />

      <div className="form-buttons">
        <SaveButton type="submit">
          {editId ? "Update Size" : "Add Size"}
        </SaveButton>

        <CancelButton type="button" onClick={handleCancel}>
          Cancel
        </CancelButton>
      </div>
    </form>
  );
};

export default SizeForm;
