import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Login functionality
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Login failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP to email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!forgotEmail) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("OTP has been sent to your email!");
        setCurrentStep(2); // Move to OTP verification step
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("OTP verified successfully!");
        setResetToken(data.resetToken);
        setCurrentStep(3); // Move to password reset step
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successfully! You can now login with your new password.");
        setTimeout(() => {
          setShowForgotPassword(false);
          resetForgotPasswordFlow();
        }, 3000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset the forgot password flow
  const resetForgotPasswordFlow = () => {
    setCurrentStep(1);
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setResetToken("");
    setMessage("");
    setError("");
  };

  const closeModal = () => {
    setShowForgotPassword(false);
    resetForgotPasswordFlow();
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-5">
                {/* Header with Icon */}
                <div className="text-center mb-4">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: '60px', height: '60px'}}>
                    <i className="fas fa-lock text-white fs-4"></i>
                  </div>
                  <h2 className="card-title fw-bold text-dark">Welcome Back</h2>
                  <p className="text-muted">Sign in to continue</p>
                </div>

                {/* Error and Success Messages */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="alert alert-success" role="alert">
                    {message}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  {/* Email Field with Icon */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      <i className="fas fa-envelope me-2 text-primary"></i>Email Address
                    </label>
                    <input 
                      type="email" 
                      className="form-control form-control-lg border-2"
                      id="email"
                      placeholder="Enter your email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      disabled={loading}
                    />
                  </div>

                  {/* Password Field with Icon */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      <i className="fas fa-key me-2 text-primary"></i>Password
                    </label>
                    <input 
                      type="password" 
                      className="form-control form-control-lg border-2"
                      id="password"
                      placeholder="Enter your password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      disabled={loading}
                    />
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        id="rememberMe" 
                        disabled={loading}
                      />
                      <label className="form-check-label text-muted" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-link text-decoration-none text-primary p-0"
                      onClick={() => setShowForgotPassword(true)}
                      disabled={loading}
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg w-100 py-3 fw-semibold shadow"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Signup Link */}
                <div className="text-center mt-4">
                  <p className="mb-0 text-muted">
                    Don't have an account?{" "}
                    <Link 
                      to="/signup" 
                      className="text-decoration-none fw-semibold text-primary"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentStep === 1 && "Reset Password - Step 1"}
                  {currentStep === 2 && "Enter OTP - Step 2"}
                  {currentStep === 3 && "Set New Password - Step 3"}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeModal}
                  disabled={loading}
                ></button>
              </div>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="alert alert-success" role="alert">
                    {message}
                  </div>
                )}

                {/* Step 1: Enter Email */}
                {currentStep === 1 && (
                  <>
                    <p>Enter your email address to receive an OTP:</p>
                    <form onSubmit={handleSendOTP}>
                      <div className="mb-3">
                        <label htmlFor="forgotEmail" className="form-label">Email Address</label>
                        <input 
                          type="email" 
                          className="form-control"
                          id="forgotEmail"
                          placeholder="Enter your email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          type="button" 
                          className="btn btn-secondary flex-fill"
                          onClick={closeModal}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary flex-fill"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Sending...
                            </>
                          ) : (
                            "Send OTP"
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* Step 2: Enter OTP */}
                {currentStep === 2 && (
                  <>
                    <p>Enter the 6-digit OTP sent to your email:</p>
                    <form onSubmit={handleVerifyOTP}>
                      <div className="mb-3">
                        <label htmlFor="otp" className="form-label">OTP Code</label>
                        <input 
                          type="text" 
                          className="form-control text-center"
                          id="otp"
                          placeholder="000000"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                          required
                          style={{fontSize: '24px', letterSpacing: '8px'}}
                          disabled={loading}
                        />
                        <div className="form-text">
                          OTP expires in 10 minutes
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          type="button" 
                          className="btn btn-secondary flex-fill"
                          onClick={() => setCurrentStep(1)}
                          disabled={loading}
                        >
                          Back
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary flex-fill"
                          disabled={loading || otp.length !== 6}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Verifying...
                            </>
                          ) : (
                            "Verify OTP"
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* Step 3: Set New Password */}
                {currentStep === 3 && (
                  <>
                    <p>Enter your new password:</p>
                    <form onSubmit={handleResetPassword}>
                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input 
                          type="password" 
                          className="form-control"
                          id="newPassword"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={6}
                          disabled={loading}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input 
                          type="password" 
                          className="form-control"
                          id="confirmPassword"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                          disabled={loading}
                        />
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          type="button" 
                          className="btn btn-secondary flex-fill"
                          onClick={() => setCurrentStep(2)}
                          disabled={loading}
                        >
                          Back
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary flex-fill"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Resetting...
                            </>
                          ) : (
                            "Reset Password"
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};