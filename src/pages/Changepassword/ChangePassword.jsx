import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../features/auth/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import "./ChangePassword.css";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const { loading, error, passwordChanged } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (passwordChanged) {
      alert("Password changed successfully");
      navigate("/login");
    }
  }, [passwordChanged, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    dispatch(
      changePassword({
        email,
        otp,
        newPassword: formData.newPassword,
      }),
    );
  };

  return (
    <div className="rp-page-wrapper">
      <div className="rp-overlay"></div>

      <div className="rp-card-container">
        <div className="rp-left-content">
          <h1>Change Password</h1>

          <p>
            Enter your new password below to complete the password reset
            process.
          </p>
        </div>

        <div className="rp-form-box">
          <div className="rp-logo-area">
            <h2>New Password</h2>
            <p>Create a secure password</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="rp-input-group">
              <label>Email</label>

              <input type="email" value={email} readOnly />
            </div>

            <div className="rp-input-group">
              <label>OTP</label>

              <input type="text" value={otp} readOnly />
            </div>

            <div className="rp-input-group">
              <label>New Password</label>

              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>

            <div className="rp-input-group">
              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {error && (
              <p
                style={{
                  color: "red",
                  marginBottom: "10px",
                }}
              >
                {error}
              </p>
            )}

            <button type="submit" className="rp-submit-btn" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
