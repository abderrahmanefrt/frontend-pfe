import React from "react";
import { useAuth } from "../context/AuthContext";
import AppointmentHistory from "./AppointmentHistory";
import { Link } from "react-router-dom";

const PatientProfile: React.FC = () => {
  const { user } = useAuth();

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
                <strong>Name:</strong> {user?.name || "Guest"}
              </p>
              <p>
                <strong>Date of Birth:</strong> January 1, 1980
              </p>
              <p>
                <strong>Gender:</strong> Male
              </p>
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-header bg-info text-white">
              Contact Details
            </div>
            <div className="card-body">
              <p>
                <strong>Phone:</strong> (555) 555-5555
              </p>
              <p>
                <strong>Email:</strong> guest@example.com
              </p>
              <p>
                <strong>Address:</strong> 123 Main St, City, State, ZIP
              </p>
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-header bg-secondary text-white">
              Medical & Insurance
            </div>
            <div className="card-body">
              <p>
                <strong>Medical History:</strong> Chronic conditions, previous
                surgeries
              </p>
              <p>
                <strong>Allergies:</strong> Penicillin, nuts
              </p>
              <p>
                <strong>Medications:</strong> Current prescriptions
              </p>
              <p>
                <strong>Primary Care Physician:</strong> Dr. Jane Smith
              </p>
              <p>
                <strong>Chifa Card Number:</strong> 21332222
              </p>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-danger text-white">
              Emergency Contact
            </div>
            <div className="card-body">
              <p>
                <strong>Name:</strong> Jane Doe
              </p>
              <p>
                <strong>Relationship:</strong> Parent
              </p>
              <p>
                <strong>Contact Number:</strong> (555) 987-6543
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
