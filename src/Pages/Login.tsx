import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <div className="text-center mb-4">
            <h3 className="fw-bold text-primary">Welcome Back</h3>
            <p className="text-muted">Please enter your credentials to login</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Email address</label>
              <input
                type="email"
                id="email"
                className="form-control py-2"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">Password</label>
              <input
                type="password"
                id="password"
                className="form-control py-2"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2 fw-semibold rounded-3"
            >
              Login
            </button>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="rememberMe" />
                <label className="form-check-label small" htmlFor="rememberMe">Remember me</label>
              </div>
              <a href="/forgot-password" className="small text-decoration-none">Forgot password?</a>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="small text-muted">
              Don't have an account?{" "}
              <a href="/signup" className="text-decoration-none fw-semibold">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;