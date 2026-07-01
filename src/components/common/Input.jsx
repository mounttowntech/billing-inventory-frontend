import { useState } from "react";
import "./Input.css";

const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="form-group">
      {label && <label>{label}</label>}

      <div className="input-wrapper">
        <input
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          className="form-control"
          disabled={disabled}
          {...register(name)}
        />

        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Input;