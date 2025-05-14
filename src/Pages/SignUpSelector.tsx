import React from "react";
import { useNavigate, Link } from "react-router-dom";

const SignUpSelector: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectRole = (role: string) => {
    navigate(`/signup/${role}`);
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 p-md-5" style={{ width: "100%", maxWidth: "500px" }}>
        <div className="card-body text-center">
          <div className="mb-4">
            <h1 className="text-primary fw-bold mb-3">Join Us</h1>
            <p className="text-muted">Select your role to create an account</p>
          </div>
          
          <div className="d-grid gap-3 mb-4">
            <button 
              className="btn btn-primary btn-lg py-3 fw-bold" 
              onClick={() => handleSelectRole("patient")}
            >
              <i className="bi bi-person-plus me-2"></i>
              I am a Patient
            </button>
            <button 
              className="btn btn-outline-primary btn-lg py-3 fw-bold" 
              onClick={() => handleSelectRole("doctor")}
            >
              <i className="bi bi-heart-pulse me-2"></i>
              I am a Doctor
            </button>
          </div>
          
          <div className="mt-4 pt-3 border-top">
            <p className="text-muted">
              Already have an account?{" "}
              <Link to="/login" className="text-primary fw-bold text-decoration-none">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpSelector;