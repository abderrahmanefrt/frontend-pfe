import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, rememberMe);
    } catch (err) {
      setPassword("");
      if (passwordRef.current) passwordRef.current.focus();
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#f5f7f9' }}>
      <div className="card shadow-lg p-4 border-0" style={{ 
        maxWidth: "400px", 
        width: "100%",
        borderRadius: "12px",
        backgroundColor: 'white'
      }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h3 className="fw-bold mb-3" style={{ color: '#4682B4' }}>Welcome Back</h3>
            <p className="mb-0" style={{ color: '#6c757d' }}>Please enter your credentials to login</p>
          </div>
          
          <form key={formKey} onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold" style={{ color: '#121517' }}>
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="form-control py-2 border-2"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ borderColor: '#9dbeda' }}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold" style={{ color: '#121517' }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                ref={passwordRef}
                className="form-control py-2 border-2"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ borderColor: '#9dbeda' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn w-100 py-2 fw-semibold rounded-3 border-0"
              style={{ 
                backgroundColor: '#4682B4',
                color: 'white'
              }}
            >
              Login
            </button>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{ 
                    borderColor: '#9dbeda',
                    width: '1.1em',
                    height: '1.1em'
                  }}
                />
                <label className="form-check-label small" htmlFor="rememberMe" style={{ color: '#6c757d' }}>
                  Remember me
                </label>
              </div>
              
            </div>
          </form>

          <div className="mt-4 pt-3 text-center border-top" style={{ borderColor: '#e9ecef' }}>
            <p className="small mb-0" style={{ color: '#6c757d' }}>
              Don't have an account?{" "}
              <a 
                href="/signup" 
                className="text-decoration-none fw-semibold" 
                style={{ color: '#4682B4' }}
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;