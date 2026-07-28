import { useEffect, useState } from "react";
import seasonValidation from "../../validations/seasonValidation";
import { CancelButton } from "../../components/Common/Button";

const SeasonForm = ({ season, editId, onSubmit, onCancel }) => {
  const [seasonName, setSeasonName] = useState("");
  const [seasonCode, setSeasonCode] = useState("");
  const [errors, setErrors] = useState({});

  // Populate form when editing, reset when adding
  useEffect(() => {
    if (season) {
      setSeasonName(season.seasonName || "");
      setSeasonCode(season.seasonCode || "");
    } else {
      setSeasonName("");
      setSeasonCode("");
    }
    setErrors({});
  }, [season]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = seasonValidation({
      seasonName,
      seasonCode,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSubmit({ seasonName, seasonCode });
    setSeasonName("");
    setSeasonCode("");
  };

  const handleCancel = () => {
    setSeasonName("");
    setSeasonCode("");
    setErrors({});
    onCancel();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{editId ? "Update Season" : "Add Season"}</h2>

        <form onSubmit={handleSubmit} className="season-form">
          <input
            type="text"
            placeholder="Season Name"
            value={seasonName}
            onChange={(e) => setSeasonName(e.target.value)}
          />
          {errors.seasonName && (
            <p style={{ color: "red", marginTop: "5px" }}>
              {errors.seasonName}
            </p>
          )}
          <input
            type="text"
            placeholder="Season Code"
            value={seasonCode}
            onChange={(e) => setSeasonCode(e.target.value)}
          />
          {errors.seasonCode && (
            <p style={{ color: "red", marginTop: "5px" }}>
              {errors.seasonCode}
            </p>
          )}
          <div className="modal-buttons">
            <button type="submit" className="btn btn-primary">
              {editId ? "Update" : "Create"}
            </button>

            <CancelButton onClick={handleCancel}>Cancel</CancelButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeasonForm;
