import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { measurementValidation } from "../../validations/MeasurementValidation";
import { SaveButton } from "../../components/Common/Button";

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
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editId ? "Edit Measurement" : "Add Measurement"}</h3>

          <button className="close-btn" onClick={handleCancel}>
            ×
          </button>
        </div>

        <form className="purchase-form" onSubmit={handleSubmit(submitHandler)}>
          <div className="form-group">
            <label>Customer</label>

            <select {...register("customer")}>
              <option value="">Select Customer</option>

              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.customerName} ({customer.phone})
                </option>
              ))}
            </select>

            <span>{errors.customer?.message}</span>
          </div>

          <div className="form-group">
            <label>Chest</label>

            <input type="number" placeholder="Chest" {...register("chest")} />

            <span>{errors.chest}</span>
          </div>

          <div className="form-group">
            <label>Waist</label>

            <input type="number" placeholder="Waist" {...register("waist")} />

            <span>{errors.waist?.message}</span>
          </div>

          <div className="form-group">
            <label>Shoulder</label>

            <input
              type="number"
              placeholder="Shoulder"
              {...register("shoulder")}
            />

            <span>{errors.shoulder?.message}</span>
          </div>

          <div className="form-group">
            <label>Sleeve</label>

            <input type="number" placeholder="Sleeve" {...register("sleeve")} />

            <span>{errors.sleeve?.message}</span>
          </div>

          <div className="form-group">
            <label>Neck</label>

            <input type="number" placeholder="Neck" {...register("neck")} />

            <span>{errors.neck?.message}</span>
          </div>

          <div className="form-group">
            <label>Hip</label>

            <input type="number" placeholder="Hip" {...register("hip")} />

            <span>{errors.hip?.message}</span>
          </div>

          <div className="form-group">
            <label>Inseam</label>

            <input type="number" placeholder="Inseam" {...register("inseam")} />

            <span>{errors.inseam?.message}</span>
          </div>

          <div className="form-group">
            <label>Length</label>

            <input type="number" placeholder="Length" {...register("length")} />

            <span>{errors.length?.message}</span>
          </div>

          <div className="form-group measurement-note">
            <label>Notes</label>

            <textarea
              rows="4"
              placeholder="Enter Notes"
              {...register("notes")}
            />

            <span>{errors.notes?.message}</span>
          </div>

          <SaveButton className="save-btn" type="submit">
            {editId ? "Update Measurement" : "Save Measurement"}
          </SaveButton>
        </form>
      </div>
    </div>
  );
};

export default MeasurementForm;
