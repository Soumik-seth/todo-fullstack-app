import React from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
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
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-5 text-center">
                
                {/* Welcome Header with Icon */}
                <div className="mb-4">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: '80px', height: '80px'}}>
                    <i className="fas fa-user text-white fs-2"></i>
                  </div>
                  <h1 className="card-title fw-bold text-primary mb-2">
                    Welcome, {user.username}! 🚀
                  </h1>
                  <p className="text-muted fs-5">
                    Ready to organize your tasks?
                  </p>
                </div>

                {/* User Info Card */}
                <div className="card border-0 bg-light mb-4">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <i className="fas fa-envelope text-primary fs-4"></i>
                      </div>
                      <div className="col text-start">
                        <h6 className="card-subtitle mb-1 text-muted">Email Address</h6>
                        <p className="card-text fs-6 fw-semibold">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6">
                    <button 
                      onClick={() => navigate("/addTodo")}
                      className="btn btn-primary btn-lg w-100 py-3 fw-semibold shadow-sm"
                    >
                      <i className="fas fa-tasks me-2"></i>
                      My Todos
                    </button>
                  </div>
                  <div className="col-12 col-md-6">
                    <button 
                      onClick={() => navigate("/about")}
                      className="btn btn-outline-primary btn-lg w-100 py-3 fw-semibold"
                    >
                      <i className="fas fa-info-circle me-2"></i>
                      About
                    </button>
                  </div>
                </div>

                {/* Quick Stats (Optional) */}
                <div className="row g-3 mb-4">
                  <div className="col-4">
                    <div className="card border-0 bg-success bg-opacity-10">
                      <div className="card-body py-3">
                        <i className="fas fa-check-circle text-success fs-4 mb-2"></i>
                        <h5 className="mb-0">12</h5>
                        <small className="text-muted">Completed</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="card border-0 bg-warning bg-opacity-10">
                      <div className="card-body py-3">
                        <i className="fas fa-clock text-warning fs-4 mb-2"></i>
                        <h5 className="mb-0">5</h5>
                        <small className="text-muted">Pending</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="card border-0 bg-info bg-opacity-10">
                      <div className="card-body py-3">
                        <i className="fas fa-list-alt text-info fs-4 mb-2"></i>
                        <h5 className="mb-0">17</h5>
                        <small className="text-muted">Total</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="border-top pt-4">
                  <button 
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-lg w-100 py-2 fw-semibold"
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};