import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { sizesValidation } from "../../validations/SizesValidation";
import { SaveButton, CancelButton } from "../../components/Common/Button";

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
      status: true,
    },
  });

  // Populate form when editing, reset when adding
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
        status: true,
      });
    }
  }, [size, reset]);

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
        className="size-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit(submitHandler)}
      >
        <h2>{editId ? "Edit Size" : "Add Size"}</h2>

        <input placeholder="Size Code" {...register("sizeCode")} />
        <p>{errors.sizeCode?.message}</p>

        <input placeholder="Size Name" {...register("sizeName")} />
        <p>{errors.sizeName?.message}</p>

        <input
          type="number"
          placeholder="Display Order"
          {...register("displayOrder")}
        />
        <p>{errors.displayOrder?.message}</p>

        <input type="number" placeholder="Chest" {...register("chest")} />
        <p>{errors.chest?.message}</p>

        <input type="number" placeholder="Waist" {...register("waist")} />
        <p>{errors.waist?.message}</p>

        <input type="number" placeholder="Hip" {...register("hip")} />
        <p>{errors.hip?.message}</p>

        <select {...register("status")}>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <div className="form-buttons">
          <SaveButton type="submit" />
          <CancelButton type="button" onClick={handleCancel} />
        </div>
      </form>
    </div>
  );
};

export default SizeForm;
