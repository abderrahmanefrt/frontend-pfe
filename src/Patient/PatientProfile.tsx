import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AppointmentHistory from "./AppointmentHistory"; // Assuming this component exists
import Spinner from "react-bootstrap/Spinner";

// Fonction pour rafraîchir le token d'accès
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

// Fonction pour faire une requête authentifiée
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) throw new Error("Token not found");

  const user = JSON.parse(storedUser);

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${user.accessToken}`);

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Si le token est expiré, rafraîchir
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      // Refaire la requête avec le nouveau token
      headers.set("Authorization", `Bearer ${newAccessToken}`);
      return fetch(url, { ...options, headers });
    }
  }

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return response;
};

// Composant principal PatientProfile
const PatientProfile: React.FC = () => {
  const { user } = useAuth();
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

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Patient Profile</h1>
      <div className="row">
        {/* Left Column: Profile Information */}
        <div className="col-md-4 overflow-auto" style={{ maxHeight: "80vh" }}>
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              Personal Information
            </div>
            <div className="card-body">
              <p>
                <strong>Name:</strong> {profile?.firstname} {profile?.lastname || "Guest"}
              </p>
              <p>
                <strong>Date of Birth:</strong> {profile?.dateOfBirth || "N/A"}
              </p>
              <p>
                <strong>Gender:</strong> {profile?.gender || "N/A"}
              </p>
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-header bg-info text-white">
              Contact Details
            </div>
            <div className="card-body">
              <p>
                <strong>Phone:</strong> {profile?.phone || "Not available"}
              </p>
              <p>
                <strong>Email:</strong> {profile?.email}
              </p>
              <p>
                <strong>Address:</strong> {profile?.address || "Not provided"}
              </p>
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-header bg-secondary text-white">
              Medical & Insurance
            </div>
            <div className="card-body">
              <p>
                <strong>Medical History:</strong> {profile?.medicalHistory || "No details"}
              </p>
              <p>
                <strong>Allergies:</strong> {profile?.allergies || "None"}
              </p>
              <p>
                <strong>Medications:</strong> {profile?.medications || "None"}
              </p>
              <p>
                <strong>Primary Care Physician:</strong> {profile?.primaryCarePhysician || "Not assigned"}
              </p>
              <p>
                <strong>Chifa Card Number:</strong> {profile?.chifaCardNumber || "Not provided"}
              </p>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-danger text-white">
              Emergency Contact
            </div>
            <div className="card-body">
              <p>
                <strong>Name:</strong> {profile?.emergencyContact?.name || "Not available"}
              </p>
              <p>
                <strong>Relationship:</strong> {profile?.emergencyContact?.relationship || "N/A"}
              </p>
              <p>
                <strong>Contact Number:</strong> {profile?.emergencyContact?.contactNumber || "N/A"}
              </p>
            </div>
          </div>

          <div className="d-grid gap-2 mt-3">
            <Link to="/edit-profile" className="btn btn-outline-secondary">
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Right Column: Appointment History */}
        <div className="col-md-8">
          <div
            className="card shadow-sm position-sticky"
            style={{ top: "1rem", zIndex: 10 }}
          >
            <div className="card-header bg-success text-white">
              Appointment History
            </div>
            <div className="card-body">
              <AppointmentHistory />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="card shadow-sm mt-4">
        <div className="card-header bg-dark text-white">Settings</div>
        <div className="card-body">
          <p>Update your account preferences and settings.</p>
          <Link to="/settings" className="btn btn-primary">
            Account Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
