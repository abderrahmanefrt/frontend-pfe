import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignUpPatient: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dateOfBirth: "",
    address: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Patient sign-up successful!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      alert("Erreur réseau ou serveur.");
    }
  };

  return (
    <div 
      className="container d-flex flex-column justify-content-center align-items-center min-vh-100 py-5"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div 
        className="card shadow-lg p-4 p-md-5 w-100" 
        style={{ 
          maxWidth: '600px',
          backgroundColor: 'var(--background)',
          borderColor: 'var(--secondary)'
        }}
      >
        <div className="card-body">
          <h1 
            className="text-center mb-4"
            style={{ color: 'var(--primary)' }}
          >
            Patient Sign Up
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label" style={{ color: 'var(--text)' }}>
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="form-control"
                style={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--secondary)',
                  color: 'var(--text)'
                }}
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="lastName" className="form-label" style={{ color: 'var(--text)' }}>
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="form-control"
                style={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--secondary)',
                  color: 'var(--text)'
                }}
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label" style={{ color: 'var(--text)' }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                style={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--secondary)',
                  color: 'var(--text)'
                }}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label" style={{ color: 'var(--text)' }}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="form-control"
                style={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--secondary)',
                  color: 'var(--text)'
                }}
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 0765497104"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label" style={{ color: 'var(--text)' }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                style={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--secondary)',
                  color: 'var(--text)'
                }}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label" style={{ color: 'var(--text)' }}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                style={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--secondary)',
                  color: 'var(--text)'
                }}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="gender" className="form-label" style={{ color: 'var(--text)' }}>
                Gender
              </label>
              <select
                id="gender"
                className="form-control"
                style={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--secondary)',
                  color: 'var(--text)'
                }}
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="dateOfBirth" className="form-label" style={{ color: 'var(--text)' }}>
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                className="form-control"
                style={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--secondary)',
                  color: 'var(--text)'
                }}
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label" style={{ color: 'var(--text)' }}>
                Address
              </label>
              <input
                type="text"
                id="address"
                className="form-control"
                style={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--secondary)',
                  color: 'var(--text)'
                }}
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="d-grid mt-4">
              <button 
                type="submit" 
                className="btn btn-lg py-2 fw-bold"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  borderColor: 'var(--primary)'
                }}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPatient;