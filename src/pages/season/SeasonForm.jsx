import { useEffect, useState } from "react";
import seasonValidation from "../../validations/seasonValidation";
import { CancelButton, EditButton } from "../../components/Common/Button";
import Input from "../../components/common/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const SeasonForm = ({ season, editId, onSubmit, onCancel }) => {
  const [seasonName, setSeasonName] = useState("");
  const [seasonCode, setSeasonCode] = useState("");
  const [errors, setErrors] = useState({});

  const { register } = useForm();

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
    <form onSubmit={handleSubmit} className="season-form">
      <div className="form-grid">
        <Input
          label="Season Name"
          name="seasonName"
          value={seasonName}
          register={register}
          onChange={(e) => setSeasonName(e.target.value)}
          error={errors.seasonName?.message}
        />

        <Input
          label="Season Code"
          name="seasonCode"
          value={seasonCode}
          register={register}
          onChange={(e) => setSeasonCode(e.target.value)}
          error={errors.seasonCode?.message}
        />
      </div>

      <div className="modal-buttons">
        <EditButton type="submit" className="btn btn-primary">
          {editId ? "Update" : "Create"}
        </EditButton>

        <CancelButton onClick={handleCancel}>Cancel</CancelButton>
      </div>
    </form>
  );
};

export default SeasonForm;
