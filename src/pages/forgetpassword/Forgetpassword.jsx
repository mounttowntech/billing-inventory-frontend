import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "./ForgetPassword.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, forgotPasswordSuccess } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (forgotPasswordSuccess) {
      alert("OTP sent successfully to your registered email.");
      navigate("/verify-otp", {
        state: { email },
      });
    }
  }, [forgotPasswordSuccess, navigate, email]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    dispatch(forgotPassword({ email }));
  };

  return (
    <div className="fp-page-wrapper">
      <div className="fp-overlay"></div>

      <div className="fp-card-container">
        <div className="fp-left-content">
          <h1>Forgot Password?</h1>

          <p>
            Enter your registered email address and we'll send an OTP to reset
            your password.
          </p>
        </div>

        <div className="fp-form-box">
          <div className="fp-logo-area">
            <h2>Forgot Password</h2>
            <p>Recover your account securely</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="fp-input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <p
                style={{
                  color: "red",
                  marginTop: "10px",
                  fontSize: "14px",
                }}
              >
                {error}
              </p>
            )}

            <button type="submit" className="fp-submit-btn" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          <div className="fp-footer">
            <a href="/login">Back to Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
