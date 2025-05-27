import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import AppointmentHistory from "./AppointmentHistory";
import Spinner from "react-bootstrap/Spinner";
import { format } from "date-fns";

const refreshAccessToken = async () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  const user = JSON.parse(storedUser);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: user.refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      user.accessToken = data.accessToken;
      localStorage.setItem("user", JSON.stringify(user));
      return data.accessToken;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!storedUser) throw new Error("Token not found");

  const user = JSON.parse(storedUser);

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${user.accessToken}`);

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      headers.set("Authorization", `Bearer ${newAccessToken}`);
      return fetch(url, { ...options, headers });
    }
  }

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return response;
};

const PatientProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Added navigation hook
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Infos médicales locales
  const [medicalInfo, setMedicalInfo] = useState({
    medicalHistory: "",
    allergies: "",
    medications: "",
    primaryCarePhysician: "",
    chifaCardNumber: "",
    emergencyContact: {
      name: "",
      relationship: "",
      contactNumber: ""
    }
  });
  const [editMedical, setEditMedical] = useState(false);

  // Charger les infos médicales du localStorage
  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`patient_medical_info_${user.id}`);
      if (saved) setMedicalInfo(JSON.parse(saved));
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api/users/me`);
        const data = await response.json();
        setProfile(data);
        console.log('profile', data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  // Avatar initials
  const initials = (profile?.firstname?.[0] || "P") + (profile?.lastname?.[0] || "");

  // Sauvegarder dans le localStorage
  const saveMedicalInfo = () => {
    if (user?.id) {
      localStorage.setItem(`patient_medical_info_${user.id}`, JSON.stringify(medicalInfo));
      setEditMedical(false);
    }
  };

  return (
    <div className="container py-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4 gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-circle d-flex justify-content-center align-items-center shadow"
            style={{
              width: 80,
              height: 80,
              fontSize: '2.2rem',
              background: 'var(--primary)',
              color: 'white',
              fontWeight: 700,
              border: '4px solid var(--secondary)',
              boxShadow: '0 2px 12px rgba(70,130,180,0.10)'
            }}
          >
            {initials}
          </div>
          <div>
            <h1 className="mb-1" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '2rem' }}>
              {profile?.firstname} {profile?.lastname || "Guest"}
            </h1>
            <div className="text-muted" style={{ fontSize: '1rem' }}>{profile?.email}</div>
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn"
          style={{
            backgroundColor: 'var(--secondary)',
            color: 'var(--text)',
            border: '1px solid var(--primary)',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: '500',
            boxShadow: '0 2px 8px rgba(100,162,212,0.08)'
          }}
        >
          <i className="fas fa-arrow-left me-2"></i> Back to Dashboard
        </button>
      </div>

      <div className="row g-4">
        {/* Left Column: Profile Information */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
            <div className="card-header border-0" style={{ 
              backgroundColor: 'var(--primary)',
              color: 'white',
              borderRadius: '16px 16px 0 0',
              fontWeight: 600,
              fontSize: '1.1rem',
              letterSpacing: '0.5px'
            }}>
              Personal Information
            </div>
            <div className="card-body" style={{ backgroundColor: 'white' }}>
              <p style={{ color: 'var(--text)' }}>
                <strong>Name:</strong> {profile?.firstname} {profile?.lastname || "Guest"}
              </p>
              <p style={{ color: 'var(--text)' }}>
                <strong>Date of Birth:</strong> {profile?.dateOfBirth ? format(new Date(profile.dateOfBirth), "dd/MM/yyyy") : "N/A"}
              </p>
              <p style={{ color: 'var(--text)' }}>
                <strong>Gender:</strong> {profile?.gender || "N/A"}
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
            <div className="card-header border-0" style={{ 
              backgroundColor: 'var(--accent)',
              color: 'white',
              borderRadius: '16px 16px 0 0',
              fontWeight: 600,
              fontSize: '1.1rem',
              letterSpacing: '0.5px'
            }}>
              Contact Details
            </div>
            <div className="card-body" style={{ backgroundColor: 'white' }}>
              <p style={{ color: 'var(--text)' }}>
                <strong>Phone:</strong> {profile?.phone || "Not available"}
              </p>
              <p style={{ color: 'var(--text)' }}>
                <strong>Email:</strong> {profile?.email}
              </p>
              <p style={{ color: 'var(--text)' }}>
                <strong>Address:</strong> {profile?.address || "Not provided"}
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
            <div className="card-header border-0" style={{ 
              backgroundColor: 'var(--secondary)',
              color: 'white',
              borderRadius: '16px 16px 0 0',
              fontWeight: 600,
              fontSize: '1.1rem',
              letterSpacing: '0.5px'
            }}>
              Medical & Insurance
            </div>
            <div className="card-body" style={{ backgroundColor: 'white' }}>
              {editMedical ? (
                <>
                  <div className="mb-2">
                    <label className="form-label fw-bold">Medical History</label>
                    <input className="form-control" value={medicalInfo.medicalHistory} onChange={e => setMedicalInfo({ ...medicalInfo, medicalHistory: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-bold">Allergies</label>
                    <input className="form-control" value={medicalInfo.allergies} onChange={e => setMedicalInfo({ ...medicalInfo, allergies: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-bold">Medications</label>
                    <input className="form-control" value={medicalInfo.medications} onChange={e => setMedicalInfo({ ...medicalInfo, medications: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-bold">Primary Care Physician</label>
                    <input className="form-control" value={medicalInfo.primaryCarePhysician} onChange={e => setMedicalInfo({ ...medicalInfo, primaryCarePhysician: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-bold">Chifa Card Number</label>
                    <input className="form-control" value={medicalInfo.chifaCardNumber} onChange={e => setMedicalInfo({ ...medicalInfo, chifaCardNumber: e.target.value })} />
                  </div>
                  <button className="btn btn-primary mt-2 me-2" onClick={saveMedicalInfo}>Save</button>
                  <button className="btn btn-secondary mt-2" onClick={() => setEditMedical(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <p style={{ color: 'var(--text)' }}><strong>Medical History:</strong> {medicalInfo.medicalHistory || "No details"}</p>
                  <p style={{ color: 'var(--text)' }}><strong>Allergies:</strong> {medicalInfo.allergies || "None"}</p>
                  <p style={{ color: 'var(--text)' }}><strong>Medications:</strong> {medicalInfo.medications || "None"}</p>
                  <p style={{ color: 'var(--text)' }}><strong>Primary Care Physician:</strong> {medicalInfo.primaryCarePhysician || "Not assigned"}</p>
                  <p style={{ color: 'var(--text)' }}><strong>Chifa Card Number:</strong> {medicalInfo.chifaCardNumber || "Not provided"}</p>
                  <button className="btn btn-outline-primary btn-sm mt-2" onClick={() => setEditMedical(true)}>Edit</button>
                </>
              )}
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
            <div className="card-header border-0" style={{ 
              backgroundColor: '#dc3545',
              color: 'white',
              borderRadius: '16px 16px 0 0',
              fontWeight: 600,
              fontSize: '1.1rem',
              letterSpacing: '0.5px'
            }}>
              Emergency Contact
            </div>
            <div className="card-body" style={{ backgroundColor: 'white' }}>
              {editMedical ? (
                <>
                  <div className="mb-2">
                    <label className="form-label fw-bold">Name</label>
                    <input className="form-control" value={medicalInfo.emergencyContact.name} onChange={e => setMedicalInfo({ ...medicalInfo, emergencyContact: { ...medicalInfo.emergencyContact, name: e.target.value } })} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-bold">Relationship</label>
                    <input className="form-control" value={medicalInfo.emergencyContact.relationship} onChange={e => setMedicalInfo({ ...medicalInfo, emergencyContact: { ...medicalInfo.emergencyContact, relationship: e.target.value } })} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-bold">Contact Number</label>
                    <input className="form-control" value={medicalInfo.emergencyContact.contactNumber} onChange={e => setMedicalInfo({ ...medicalInfo, emergencyContact: { ...medicalInfo.emergencyContact, contactNumber: e.target.value } })} />
                  </div>
                </>
              ) : (
                <>
                  <p style={{ color: 'var(--text)' }}><strong>Name:</strong> {medicalInfo.emergencyContact.name || "Not available"}</p>
                  <p style={{ color: 'var(--text)' }}><strong>Relationship:</strong> {medicalInfo.emergencyContact.relationship || "N/A"}</p>
                  <p style={{ color: 'var(--text)' }}><strong>Contact Number:</strong> {medicalInfo.emergencyContact.contactNumber || "N/A"}</p>
                </>
              )}
            </div>
          </div>

          <div className="d-grid gap-2 mt-3">
            <Link 
              to="/patient/edit-profile" 
              className="btn border-0"
              style={{ 
                backgroundColor: 'var(--primary)',
                color: 'white',
                fontWeight: 600,
                borderRadius: '8px',
                fontSize: '1.1rem',
                boxShadow: '0 2px 8px rgba(70,130,180,0.08)',
                letterSpacing: '0.5px',
                transition: 'all 0.2s',
                padding: '0.75rem 1.5rem'
              }}
            >
              <i className="fas fa-edit me-2"></i> Edit Profile
            </Link>
          </div>
        </div>

        {/* Right Column: Appointment History */}
        <div className="col-md-8">
          <div
            className="card border-0 shadow-sm position-sticky"
            style={{ 
              top: "1rem", 
              zIndex: 10,
              borderRadius: '16px',
              minHeight: 320
            }}
          >
            <div className="card-header border-0" style={{ 
              backgroundColor: 'var(--accent)',
              color: 'white',
              borderRadius: '16px 16px 0 0',
              fontWeight: 600,
              fontSize: '1.1rem',
              letterSpacing: '0.5px'
            }}>
              Appointment History
            </div>
            <div className="card-body" style={{ backgroundColor: 'white' }}>
              <AppointmentHistory showBackButton={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="card border-0 shadow-sm mt-4" style={{ borderRadius: '16px' }}>
        <div className="card-header border-0" style={{ 
          backgroundColor: 'var(--text)',
          color: 'white',
          borderRadius: '16px 16px 0 0',
          fontWeight: 600,
          fontSize: '1.1rem',
          letterSpacing: '0.5px'
        }}>
          Settings
        </div>
        <div className="card-body" style={{ backgroundColor: 'white' }}>
          {/* Ajoute ici les paramètres du patient si besoin */}
          <div className="text-muted">Settings and preferences coming soon.</div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;