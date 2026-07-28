import { useEffect, useState } from "react";
import fabricValidation from "../../validations/fabricValidation";
import { CancelButton } from "../../components/Common/Button";
import Input from "../../components/common/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const FabricForm = ({ fabric, editId, onSubmit, onCancel }) => {
  const [fabricName, setFabricName] = useState("");
  const [fabricCode, setFabricCode] = useState("");
  const [errors, setErrors] = useState({});

  // Populate form when editing, reset when adding
  useEffect(() => {
    if (fabric) {
      setFabricName(fabric.fabricName || "");
      setFabricCode(fabric.fabricCode || "");
    } else {
      setFabricName("");
      setFabricCode("");
    }
    setErrors({});
  }, [fabric]);

  const { register } = useForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = fabricValidation({
      fabricName,
      fabricCode,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSubmit({ fabricName, fabricCode });
    setFabricName("");
    setFabricCode("");
  };

  const handleCancel = () => {
    setFabricName("");
    setFabricCode("");
    setErrors({});
    onCancel();
  };

  return (
    <form className="fabric-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <Input
          label="Fabric Name"
          name="fabricName"
          value={fabricName}
          register={register}
          onChange={(e) => setFabricName(e.target.value)}
          error={errors.fabricName?.message}
        />
        <Input
          label="Fabric Code"
          name="fabricCode"
          value={fabricCode}
          register={register}
          onChange={(e) => setFabricCode(e.target.value)}
          error={errors.fabricCode?.message}
        />
      </div>

      <div className="modal-buttons">
        <button type="submit">{editId ? "Update" : "Create"}</button>

        <CancelButton onClick={handleCancel}>Cancel</CancelButton>
      </div>
    </form>
  );
};

export default FabricForm;
