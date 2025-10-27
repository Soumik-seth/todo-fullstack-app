import React from "react";
import profileImage from '../img/mypic.jpg';

export const About = (props) => {
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
              <div className="card-body p-5">

                {/* Header Section */}
                <div className="text-center mb-4">
                  <h1 className="fw-bold text-primary">About Me</h1>
                  <p className="text-muted">Get to know more about me</p>
                </div>

                {/* Profile Section */}
                <div className="row align-items-center mb-4">
                  <div className="col-md-4 text-center">
                    {/* Profile Picture - CORRECTED */}
                    <div className="mb-3">
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="rounded-circle shadow"
                        style={{
                          width: '150px',
                          height: '150px',
                          objectFit: 'cover',
                          border: '4px solid #007bff'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150/007bff/ffffff?text=Photo';
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-md-8">
                    <h2 className="fw-bold text-dark">Hello, I'm {props.name} 👋</h2>
                    <p className="text-muted mb-3">Full Stack Developer</p>

                    {/* Social Links */}
                    <div className="d-flex gap-3 mb-3">
                      <a
                        href="https://www.linkedin.com/in/soumik-seth-41827728b/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm"
                      >
                        <i className="fab fa-linkedin me-2"></i>
                        LinkedIn
                      </a>

                      <a
                        href="https://www.instagram.com/soumik.seth.739?igsh=dnoxbnZpc294ODVn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-danger btn-sm"
                      >
                        <i className="fab fa-instagram me-2"></i>
                        Instagram
                      </a>

                      <a
                        href="https://github.com/soumikseth"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-dark btn-sm"
                      >
                        <i className="fab fa-github me-2"></i>
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>

                {/* About Details */}
                <div className="row">
                  <div className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h4 className="card-title fw-semibold text-primary mb-3">
                          <i className="fas fa-user me-2"></i>
                          About Me
                        </h4>
                        <p className="card-text">
                          Passionate Full Stack Developer with expertise in modern web technologies.
                          I love creating efficient, scalable, and user-friendly applications.
                          Currently focused on React, Node.js, and MongoDB development.
                        </p>

                        <div className="row mt-4">
                          <div className="col-md-6">
                            <h6 className="fw-semibold mb-2">
                              <i className="fas fa-code me-2 text-primary"></i>
                              Skills
                            </h6>
                            <ul className="list-unstyled">
                              <li><i className="fas fa-check text-success me-2"></i>React.js</li>
                              <li><i className="fas fa-check text-success me-2"></i>Node.js</li>
                              <li><i className="fas fa-check text-success me-2"></i>MongoDB</li>
                              <li><i className="fas fa-check text-success me-2"></i>JavaScript</li>
                            </ul>
                          </div>

                          <div className="col-md-6">
                            <h6 className="fw-semibold mb-2">
                              <i className="fas fa-graduation-cap me-2 text-primary"></i>
                              Education
                            </h6>
                            <ul className="list-unstyled">
                              <li><i className="fas fa-university me-2 text-info"></i>Bachelor of Computer Science</li>
                              <li><i className="fas fa-calendar me-2 text-info"></i>2023-2027</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="card border-0 bg-primary text-white">
                      <div className="card-body">
                        <h5 className="card-title mb-3">
                          <i className="fas fa-envelope me-2"></i>
                          Get In Touch
                        </h5>
                        <div className="row">
                          <div className="col-md-6">
                            <p className="mb-1">
                              <i className="fas fa-envelope me-2"></i>
                              soumikseth4@gmail.com
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p className="mb-1">
                              <i className="fas fa-phone me-2"></i>
                              +91 6297664139
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};