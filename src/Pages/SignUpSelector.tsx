import React from "react";
import { useNavigate, Link } from "react-router-dom";

const SignUpSelector: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectRole = (role: string) => {
    // Navigate to the corresponding sign-up page, e.g. /signup/patient or /signup/doctor
    navigate(`/signup/${role}`);
  };

  return (
    <div className="container mt-4">
      <h1>Sign Up</h1>
      <p>Please select your role to create an account:</p>
      <div className="d-flex flex-column gap-3">
        <button className="btn btn-primary" onClick={() => handleSelectRole("patient")}>
          I am a Patient
        </button>
        <button className="btn btn-primary" onClick={() => handleSelectRole("doctor")}>
          I am a Doctor
        </button>
      </div>
      <div className="mt-3">
        <p>
          Already have an account?{" "}
          <Link to="/login" className="text-primary">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpSelector;
