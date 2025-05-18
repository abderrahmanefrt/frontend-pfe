import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface DoctorProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  specialite: string;
  dateOfBirth: string;
  licenseNumber: string;
  biography?: string;
}

const DoctorProfileEdit: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DoctorProfile>({
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    specialite: "",
    dateOfBirth: "",
    licenseNumber: "",
    biography: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/medecin/me`, {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (user?.accessToken) {
      fetchProfile();
    }
  }, [user?.accessToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/medecin/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedProfile = await response.json();
      login({ ...user, ...updatedProfile.medecin });
      navigate("/doctor/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" style={{ color: '#4682B4' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ backgroundColor: '#f5f7f9' }}>
      <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
        <div className="card-body p-4 p-md-5">
          <h2 className="mb-4" style={{ color: '#4682B4' }}>Edit Your Profile</h2>
          
          {error && (
            <div className="alert border-0 mb-4" style={{ 
              backgroundColor: 'rgba(220, 53, 69, 0.1)',
              borderLeft: '4px solid #dc3545',
              color: '#dc3545'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" style={{ color: '#121517' }}>First Name</label>
                <input
                  type="text"
                  className="form-control border-2"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  style={{ borderColor: '#9dbeda' }}
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label" style={{ color: '#121517' }}>Last Name</label>
                <input
                  type="text"
                  className="form-control border-2"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  style={{ borderColor: '#9dbeda' }}
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label" style={{ color: '#121517' }}>Email</label>
                <input
                  type="email"
                  className="form-control border-2"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ borderColor: '#9dbeda' }}
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label" style={{ color: '#121517' }}>Phone</label>
                <input
                  type="tel"
                  className="form-control border-2"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ borderColor: '#9dbeda' }}
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label" style={{ color: '#121517' }}>Specialty</label>
                <input
                  type="text"
                  className="form-control border-2"
                  name="specialite"
                  value={formData.specialite}
                  onChange={handleChange}
                  style={{ borderColor: '#9dbeda' }}
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label" style={{ color: '#121517' }}>License Number</label>
                <input
                  type="text"
                  className="form-control border-2"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  style={{ borderColor: '#9dbeda' }}
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label" style={{ color: '#121517' }}>Date of Birth</label>
                <input
                  type="date"
                  className="form-control border-2"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  style={{ borderColor: '#9dbeda' }}
                />
              </div>
              
              <div className="col-12">
                <label className="form-label" style={{ color: '#121517' }}>Biography</label>
                <textarea
                  className="form-control border-2"
                  name="biography"
                  value={formData.biography || ""}
                  onChange={handleChange}
                  rows={5}
                  style={{ borderColor: '#9dbeda' }}
                />
              </div>
              
              <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn border-0"
                  onClick={() => navigate("/doctor/dashboard")}
                  style={{ 
                    backgroundColor: 'rgba(108, 117, 125, 0.1)',
                    color: '#6c757d'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn border-0"
                  style={{ 
                    backgroundColor: '#4682B4',
                    color: 'white'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileEdit;