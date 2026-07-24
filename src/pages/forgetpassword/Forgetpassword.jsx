import React, { useState } from "react";
import "./ForgetPassword.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    alert("Password reset link sent to " + email);
  };

  return (
    <div className="fp-page-wrapper">
      <div className="fp-overlay"></div>

      <div className="fp-card-container">
        <div className="fp-left-content">
          <h1>Forgot Password?</h1>

          <p>
            Enter your registered email address and we'll send you a password
            reset link.
          </p>
        </div>

        <div className="fp-form-box">
          <div className="fp-logo-area">
            <h2>Reset Password</h2>
            <p>Recover your account securely</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="fp-input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit" className="fp-submit-btn">
              Send Reset Link
            </button>
          </form>

          <div className="fp-footer">
            Remember your password?
            <a href="/login"> Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
