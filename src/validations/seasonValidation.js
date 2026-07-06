const seasonValidation = ({ seasonName, seasonCode }) => {
  const errors = {};

  // Season Name
  if (!seasonName.trim()) {
    errors.seasonName = "Season Name is required";
  } else if (seasonName.trim().length < 3) {
    errors.seasonName = "Season Name must be at least 3 characters";
  } else if (!/^[A-Za-z\s]+$/.test(seasonName)) {
    errors.seasonName = "Season Name should contain only letters";
  }

  // Season Code
  if (!seasonCode.trim()) {
    errors.seasonCode = "Season Code is required";
  } else if (!/^[A-Za-z0-9]+$/.test(seasonCode)) {
    errors.seasonCode = "Season Code should contain only letters and numbers";
  }

  return errors;
};

export default seasonValidation;
