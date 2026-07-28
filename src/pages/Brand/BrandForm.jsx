import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { brandValidation } from "../../validations/brandValidation";
import { EditButton, CancelButton } from "../../components/Common/Button";
import Input from "../../components/common/Input";

const BrandForm = ({ brand, editId, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(brandValidation),
    defaultValues: {
      brandCode: "",
      brandName: "",
      description: "",
      logo: "",
    },
  });

  // Populate form when editing, reset when adding
  useEffect(() => {
    if (brand) {
      reset({
        brandCode: brand.brandCode || "",
        brandName: brand.brandName || "",
        description: brand.description || "",
        logo: brand.logo || "",
      });
    } else {
      reset({
        brandCode: "",
        brandName: "",
        description: "",
        logo: "",
      });
    }
  }, [brand, reset]);

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const submitHandler = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <form className="brand-form" onSubmit={handleSubmit(submitHandler)}>
      <div className="form-grid">
        <Input
          label="Brand Code"
          name="brandCode"
          placeholder="Brand Code"
          register={register}
          error={errors.brandCode?.message}
        />
        <Input
          label="Brand Name"
          name="brandName"
          placeholder="Brand Name"
          register={register}
          error={errors.brandName?.message}
        />
      </div>

      <Input
        label="Logo URL"
        name="logo"
        placeholder="Logo URL"
        register={register}
        error={errors.logo?.message}
      />

      <div className="unit-form-group">
        <label>Description</label>
        <textarea
          label="Description"
          placeholder="Description"
          rows={3}
          {...register("description")}
        />
        <p className="error">{errors.description?.message}</p>
      </div>

      <div className="form-buttons">
        <EditButton type="submit">
          {editId ? "Update Brand" : "Add Brand"}
        </EditButton>

        <CancelButton type="button" onClick={handleCancel}>
          Cancel
        </CancelButton>
      </div>
    </form>
  );
};

export default BrandForm;
