import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpDoctor: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    licenseNumber: "",
    address: "",
    dateOfBirth: ""
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("firstname", formData.firstName);
    formDataToSend.append("lastname", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("specialite", formData.specialty);
    formDataToSend.append("licenseNumber", formData.licenseNumber);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("dateOfBirth", formData.dateOfBirth);
    if (photo) formDataToSend.append("photo", photo);
    if (document) formDataToSend.append("document", document);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/medecin/register`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        // Save doctor info to sessionStorage for OTP verification page
        const doctorDataToStore = {
          userId: data.medecin.id,
          email: data.medecin.email,
          role: data.medecin.role
        };
        console.log('Saving to sessionStorage (Doctor):', doctorDataToStore);
        sessionStorage.setItem('verificationInfo', JSON.stringify(doctorDataToStore));

        // Redirect to OTP verification page
        navigate('/verify-otp', { replace: true }); // Navigate without state
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network or server error.");
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
          maxWidth: '700px',
          backgroundColor: 'var(--background)',
          borderColor: 'var(--secondary)'
        }}
      >
        <div className="card-body">
          <h2 
            className="mb-4 text-center"
            style={{ color: 'var(--primary)' }}
          >
            Doctor Sign Up
          </h2>
          
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ color: 'var(--text)' }}>First Name</label>
                <input 
                  type="text" 
                  name="firstName"
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
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ color: 'var(--text)' }}>Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
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
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ color: 'var(--text)' }}>Email</label>
                <input 
                  type="email" 
                  name="email"
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
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ color: 'var(--text)' }}>Phone</label>
                <input 
                  type="tel" 
                  name="phone"
                  className="form-control" 
                  style={{ 
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--secondary)',
                    color: 'var(--text)'
                  }}
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ color: 'var(--text)' }}>Password</label>
                <input 
                  type="password" 
                  name="password"
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
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ color: 'var(--text)' }}>Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword"
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
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ color: 'var(--text)' }}>Specialty</label>
                <input 
                  type="text" 
                  name="specialty"
                  className="form-control" 
                  style={{ 
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--secondary)',
                    color: 'var(--text)'
                  }}
                  value={formData.specialty} 
                  onChange={handleChange} 
                  placeholder="e.g., Cardiology" 
                  required 
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ color: 'var(--text)' }}>License Number</label>
                <input 
                  type="text" 
                  name="licenseNumber"
                  className="form-control" 
                  style={{ 
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--secondary)',
                    color: 'var(--text)'
                  }}
                  value={formData.licenseNumber} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ color: 'var(--text)' }}>Address</label>
              <input 
                type="text" 
                name="address"
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

            <div className="mb-3">
              <label className="form-label" style={{ color: 'var(--text)' }}>Date of Birth</label>
              <input 
                type="date" 
                name="dateOfBirth"
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

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ color: 'var(--text)' }}>Photo</label>
                <input 
                  type="file" 
                  className="form-control" 
                  style={{ 
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--secondary)',
                    color: 'var(--text)'
                  }}
                  accept="image/*" 
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)} 
                  required 
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ color: 'var(--text)' }}>Document (PDF)</label>
                <input 
                  type="file" 
                  className="form-control" 
                  style={{ 
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--secondary)',
                    color: 'var(--text)'
                  }}
                  accept="application/pdf" 
                  onChange={(e) => setDocument(e.target.files?.[0] || null)} 
                  required 
                />
              </div>
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

export default SignUpDoctor;