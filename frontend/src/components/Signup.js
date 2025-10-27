import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful, please login!");
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ 
        backgroundColor: "#f8f9fa", // Light gray background
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" // Gradient background
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <h2 className="card-title fw-bold text-primary">Create Account</h2>
                  <p className="text-muted">Join us today and get started</p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit}>
                  {/* Username Field */}
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label fw-semibold">
                      Username
                    </label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg"
                      id="username"
                      placeholder="Enter your username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      required 
                    />
                  </div>

                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      className="form-control form-control-lg"
                      id="email"
                      placeholder="Enter your email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      Password
                    </label>
                    <input 
                      type="password" 
                      className="form-control form-control-lg"
                      id="password"
                      placeholder="Create a password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg w-100 py-2 fw-semibold"
                  >
                    Create Account
                  </button>
                </form>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <Link 
                      to="/" 
                      className="text-decoration-none fw-semibold text-primary"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};