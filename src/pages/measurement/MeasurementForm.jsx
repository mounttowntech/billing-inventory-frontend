import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { measurementValidation } from "../../validations/MeasurementValidation";
import { SaveButton, CancelButton } from "../../components/Common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";

const MeasurementForm = ({
  measurement,
  editId,
  customers,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(measurementValidation),
    defaultValues: {
      customer: "",
      chest: "",
      waist: "",
      shoulder: "",
      sleeve: "",
      neck: "",
      hip: "",
      inseam: "",
      length: "",
      notes: "",
    },
  });

  // Populate form when editing, reset when adding
  useEffect(() => {
    if (measurement) {
      reset({
        customer: measurement.customer?._id || "",
        chest: measurement.chest || "",
        waist: measurement.waist || "",
        shoulder: measurement.shoulder || "",
        sleeve: measurement.sleeve || "",
        neck: measurement.neck || "",
        hip: measurement.hip || "",
        inseam: measurement.inseam || "",
        length: measurement.length || "",
        notes: measurement.notes || "",
      });
    } else {
      reset({
        customer: "",
        chest: "",
        waist: "",
        shoulder: "",
        sleeve: "",
        neck: "",
        hip: "",
        inseam: "",
        length: "",
        notes: "",
      });
    }
  }, [measurement, reset]);

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const submitHandler = async (data) => {
    const measurementData = {
      customer: data.customer,
      chest: Number(data.chest),
      waist: Number(data.waist),
      shoulder: Number(data.shoulder),
      sleeve: Number(data.sleeve),
      neck: Number(data.neck),
      hip: Number(data.hip),
      inseam: Number(data.inseam),
      length: Number(data.length),
      notes: data.notes,
    };

    await onSubmit(measurementData);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="form-grid">
        <Select
          label="Customer"
          name="customer"
          register={register}
          error={errors.customer?.message}
          options={[
            ...customers.map((customer) => ({
              _id: customer._id,
              label: `${customer.customerName} (${customer.phone})`,
            })),
          ]}
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
          label="Shoulder"
          name="shoulder"
          type="number"
          placeholder="Shoulder"
          register={register}
          error={errors.shoulder?.message}
        />
      </div>
      <div className="form-grid">
        <Input
          label="Sleeve"
          name="sleeve"
          type="number"
          placeholder="Sleeve"
          register={register}
          error={errors.sleeve?.message}
        />

        <Input
          label="Neck"
          name="neck"
          type="number"
          placeholder="Neck"
          register={register}
          error={errors.neck?.message}
        />
      </div>
      <div className="form-grid">
        <Input
          label="Hip"
          name="hip"
          type="number"
          placeholder="Hip"
          register={register}
          error={errors.hip?.message}
        />

        <Input
          label="Inseam"
          name="inseam"
          type="number"
          placeholder="Inseam"
          register={register}
          error={errors.inseam?.message}
        />
      </div>
      <div className="form-grid">
        <Input
          label="Length"
          name="length"
          type="number"
          placeholder="Length"
          register={register}
          error={errors.length?.message}
        />

        <Input
          label="Notes"
          name="notes"
          type="text"
          placeholder="Enter Notes"
          register={register}
          error={errors.notes?.message}
        />
      </div>
      <div className="form-buttons">
        <SaveButton type="submit">
          {editId ? "Update Measurement" : "Save Measurement"}
        </SaveButton>

        <CancelButton className="cancel-btn" type="button" onClick={onCancel}>
          Cancel
        </CancelButton>
      </div>
    </form>
  );
};

export default MeasurementForm;
