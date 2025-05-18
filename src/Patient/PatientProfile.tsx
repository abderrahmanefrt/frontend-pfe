import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import AppointmentHistory from "./AppointmentHistory";
import Spinner from "react-bootstrap/Spinner";

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
  const storedUser = localStorage.getItem("user");
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api/users/me`);
        const data = await response.json();
        setProfile(data);
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
        <Spinner animation="border" style={{ color: '#4682B4' }} />
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ backgroundColor: '#f5f7f9' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ color: '#121517' }}>Patient Profile</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn"
          style={{
            backgroundColor: 'var(--secondary)',
            color: 'var(--text)',
            border: '1px solid var(--primary)',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: '500'
          }}
        >
          <i className="fas fa-arrow-left me-2"></i> Back to Dashboard
        </button>
      </div>

      <div className="row">
        {/* Left Column: Profile Information */}
        <div className="col-md-4 overflow-auto" style={{ maxHeight: "80vh" }}>
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
            <div className="card-header border-0" style={{ 
              backgroundColor: '#4682B4',
              color: 'white',
              borderRadius: '12px 12px 0 0'
            }}>
              Personal Information
            </div>
            <div className="card-body" style={{ backgroundColor: 'white' }}>
              <p style={{ color: '#121517' }}>
                <strong>Name:</strong> {profile?.firstname} {profile?.lastname || "Guest"}
              </p>
              <p style={{ color: '#121517' }}>
                <strong>Date of Birth:</strong> {profile?.dateOfBirth || "N/A"}
              </p>
              <p style={{ color: '#121517' }}>
                <strong>Gender:</strong> {profile?.gender || "N/A"}
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
            <div className="card-header border-0" style={{ 
              backgroundColor: '#64a2d4',
              color: 'white',
              borderRadius: '12px 12px 0 0'
            }}>
              Contact Details
            </div>
            <div className="card-body" style={{ backgroundColor: 'white' }}>
              <p style={{ color: '#121517' }}>
                <strong>Phone:</strong> {profile?.phone || "Not available"}
              </p>
              <p style={{ color: '#121517' }}>
                <strong>Email:</strong> {profile?.email}
              </p>
              <p style={{ color: '#121517' }}>
                <strong>Address:</strong> {profile?.address || "Not provided"}
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
            <div className="card-header border-0" style={{ 
              backgroundColor: '#9dbeda',
              color: 'white',
              borderRadius: '12px 12px 0 0'
            }}>
              Medical & Insurance
            </div>
            <div className="card-body" style={{ backgroundColor: 'white' }}>
              <p style={{ color: '#121517' }}>
                <strong>Medical History:</strong> {profile?.medicalHistory || "No details"}
              </p>
              <p style={{ color: '#121517' }}>
                <strong>Allergies:</strong> {profile?.allergies || "None"}
              </p>
              <p style={{ color: '#121517' }}>
                <strong>Medications:</strong> {profile?.medications || "None"}
              </p>
              <p style={{ color: '#121517' }}>
                <strong>Primary Care Physician:</strong> {profile?.primaryCarePhysician || "Not assigned"}
              </p>
              <p style={{ color: '#121517' }}>
                <strong>Chifa Card Number:</strong> {profile?.chifaCardNumber || "Not provided"}
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-header border-0" style={{ 
              backgroundColor: '#dc3545',
              color: 'white',
              borderRadius: '12px 12px 0 0'
            }}>
              Emergency Contact
            </div>
            <div className="card-body" style={{ backgroundColor: 'white' }}>
              <p style={{ color: '#121517' }}>
                <strong>Name:</strong> {profile?.emergencyContact?.name || "Not available"}
              </p>
              <p style={{ color: '#121517' }}>
                <strong>Relationship:</strong> {profile?.emergencyContact?.relationship || "N/A"}
              </p>
              <p style={{ color: '#121517' }}>
                <strong>Contact Number:</strong> {profile?.emergencyContact?.contactNumber || "N/A"}
              </p>
            </div>
          </div>

          <div className="d-grid gap-2 mt-3">
            <Link 
              to="/patient/edit-profile" 
              className="btn border-0"
              style={{ 
                backgroundColor: 'rgba(70, 130, 180, 0.1)',
                color: '#4682B4'
              }}
            >
              Edit Profile
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
              borderRadius: '12px'
            }}
          >
            <div className="card-header border-0" style={{ 
              backgroundColor: '#28a745',
              color: 'white',
              borderRadius: '12px 12px 0 0'
            }}>
              Appointment History
            </div>
            <div className="card-body" style={{ backgroundColor: 'white' }}>
              <AppointmentHistory />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="card border-0 shadow-sm mt-4" style={{ borderRadius: '12px' }}>
        <div className="card-header border-0" style={{ 
          backgroundColor: '#121517',
          color: 'white',
          borderRadius: '12px 12px 0 0'
        }}>
          Settings
        </div>
        <div className="card-body" style={{ backgroundColor: 'white' }}>
          <p style={{ color: '#6c757d' }}>Update your account preferences and settings.</p>
          <Link 
            to="/settings" 
            className="btn border-0"
            style={{ 
              backgroundColor: '#4682B4',
              color: 'white'
            }}
          >
            Account Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;