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

  // Fetch current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/medecin/profile`, {
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
      navigate("/doctor/dashboard"); // Rediriger vers la page de profil
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading profile data...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Edit Your Profile</h2>
      
      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
               
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
               
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
               
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
               
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label">Specialty</label>
            <input
              type="text"
              className="form-control"
              name="specialite"
              value={formData.specialite}
              onChange={handleChange}
               
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label">License Number</label>
            <input
              type="text"
              className="form-control"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
               
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-12">
            <label className="form-label">Biography</label>
            <textarea
              className="form-control"
              name="biography"
              value={formData.biography || ""}
              onChange={handleChange}
              rows={5}
            />
          </div>
          
          <div className="col-12 d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/doctor/dashboard")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DoctorProfileEdit;