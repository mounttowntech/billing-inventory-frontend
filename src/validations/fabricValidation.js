const fabricValidation = ({ fabricName, fabricCode }) => {
  const errors = {};

  // Fabric Name Validation
  if (!fabricName.trim()) {
    errors.fabricName = "Fabric Name is required";
  } else if (fabricName.trim().length < 3) {
    errors.fabricName = "Fabric Name must be at least 3 characters";
  } else if (!/^[A-Za-z\s]+$/.test(fabricName)) {
    errors.fabricName = "Fabric Name should contain only letters";
  }

  // Fabric Code Validation
  if (!fabricCode.trim()) {
    errors.fabricCode = "Fabric Code is required";
  } else if (!/^[A-Za-z0-9]+$/.test(fabricCode)) {
    errors.fabricCode = "Fabric Code should contain only letters and numbers";
  }

  return errors;
};

export default fabricValidation;
