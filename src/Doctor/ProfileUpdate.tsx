import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface DoctorProfileData {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string; // Make optional based on previous error
  specialite?: string; // Make optional based on previous error
  dateOfBirth?: string;
  licenseNumber?: string;
  biography?: string;
}

// Define props for the DoctorProfileEdit component
interface DoctorProfileEditProps {
  doctor?: DoctorProfileData; // Make the doctor prop optional
  onUpdate?: (updatedDoctor: DoctorProfileData) => void; // Add onUpdate prop
  onCancel?: () => void; // Add onCancel prop
}

// Update component signature to accept props
const DoctorProfileEdit: React.FC<DoctorProfileEditProps> = ({ doctor, onUpdate, onCancel }) => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  // Use prop data if available, otherwise initial empty state
  const [formData, setFormData] = useState<DoctorProfileData>(
    doctor || {
      id: "",
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      specialite: "",
      dateOfBirth: "",
      licenseNumber: "",
      biography: ""
    }
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch profile if doctor prop is NOT provided
    if (!doctor && user?.accessToken) {
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
      fetchProfile();
    } else {
      // If doctor prop is provided, we are not loading, and if no doctor data, set loading to false
      setLoading(!doctor);
    }
  }, [user?.accessToken, doctor]); // Add doctor to dependency array

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
      // Determine the API endpoint based on whether a doctor prop was provided
      const apiUrl = doctor 
        ? `${import.meta.env.VITE_API_URL}/api/admin/medecins/${formData.id}` // Admin update endpoint (assuming this format)
        : `${import.meta.env.VITE_API_URL}/api/medecin/profile`; // Doctor self-update endpoint
      
      const method = doctor ? "PUT" : "PUT"; // Both seem to be PUT requests

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          // Use user's token for authentication, both for doctor and admin
          Authorization: `Bearer ${user?.accessToken}`, 
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedProfile = await response.json();

      // If doctor prop was provided, call onUpdate. Otherwise, update AuthContext and navigate.
      if (doctor) {
        onUpdate?.(updatedProfile); // Assuming updatedProfile has the correct structure
      } else {
        // Update AuthContext only for the logged-in doctor's own profile edit
        updateUser({ ...user, ...updatedProfile.medecin });
        navigate("/doctor/dashboard");
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  // Handle cancel button click
  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Default cancel behavior for doctor's own profile
      navigate("/doctor/dashboard");
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
          <h2 className="mb-4" style={{ color: '#4682B4' }}>{doctor ? "Edit Doctor Profile (Admin)" : "Edit Your Profile"}</h2>
          
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
                  value={formData.phone || ""}
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
                  value={formData.specialite || ""}
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
                  value={formData.licenseNumber || ""}
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
                  value={formData.dateOfBirth || ""}
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
                  onClick={handleCancelClick} // Use the new cancel handler
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