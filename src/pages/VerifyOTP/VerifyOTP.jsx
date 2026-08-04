import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP } from "../../features/auth/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import "./VerifyOTP.css";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const { loading, error, otpVerified } = useSelector((state) => state.auth);

  useEffect(() => {
    if (otpVerified) {
      alert("OTP Verified Successfully");

      navigate("/change-password", {
        state: {
          email,
          otp,
        },
      });
    }
  }, [otpVerified, navigate, email, otp]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      alert("Please enter OTP");
      return;
    }

    dispatch(
      verifyOTP({
        email,
        otp,
      }),
    );
  };

  return (
    <div className="fp-page-wrapper">
      <div className="fp-overlay"></div>

      <div className="fp-card-container">
        <div className="fp-left-content">
          <h1>Verify OTP</h1>

          <p>Enter the OTP sent to your registered email address.</p>
        </div>

        <div className="fp-form-box">
          <div className="fp-logo-area">
            <h2>OTP Verification</h2>
            <p>Verify your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="fp-input-group">
              <label>Email</label>

              <input type="email" value={email} readOnly />
            </div>

            <div className="fp-input-group">
              <label>OTP</label>

              <input
                type="text"
                placeholder="Enter 6 digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>

            {error && (
              <p
                style={{
                  color: "red",
                  marginTop: "10px",
                }}
              >
                {error}
              </p>
            )}

            <button type="submit" className="fp-submit-btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="fp-footer">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              style={{
                border: "none",
                background: "none",
                color: "#2563eb",
                cursor: "pointer",
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
