import { useEffect, useState } from "react";
import fabricValidation from "../../validations/fabricValidation";
import { CancelButton } from "../../components/Common/Button";

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
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{editId ? "Update Fabric" : "Add Fabric"}</h2>

        <form className="fabric-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Fabric Name"
            value={fabricName}
            onChange={(e) => setFabricName(e.target.value)}
          />
          {errors.fabricName && (
            <p style={{ color: "red", marginTop: "5px" }}>
              {errors.fabricName}
            </p>
          )}
          <input
            type="text"
            placeholder="Fabric Code"
            value={fabricCode}
            onChange={(e) => setFabricCode(e.target.value)}
          />
          {errors.fabricCode && (
            <p style={{ color: "red", marginTop: "5px" }}>
              {errors.fabricCode}
            </p>
          )}
          <div className="modal-buttons">
            <button type="submit">{editId ? "Update" : "Create"}</button>

            <CancelButton onClick={handleCancel}>Cancel</CancelButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FabricForm;
