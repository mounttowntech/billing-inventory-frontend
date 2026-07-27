import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      alert(data.message);

      if (data.success) {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-page-wrapper">
      <div className="rp-overlay"></div>

      <div className="rp-card-container">

        <div className="rp-left-content">
          <h1>Create New Password</h1>

          <p>
            Your new password must be different from your previous password.
          </p>
        </div>

        <div className="rp-form-box">

          <div className="rp-logo-area">
            <h2>Reset Password</h2>
            <p>Create your new password</p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="rp-input-group">
              <label>New Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
                required
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
                required
              />
            </div>

            <button
              className="rp-submit-btn"
              type="submit"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};

export default ResetPassword;