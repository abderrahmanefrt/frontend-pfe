import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface DoctorDetails {
  id: string;
  firstname: string;
  lastname: string;
  specialite: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  licenseNumber?: string;
  address?: string;
  biography?: string;
  yearsOfExperience?: number;
  consultationFee?: number;
  photo?: string;
  photoUrl?: string;
}

const DoctorProfile: React.FC<{ doctor: DoctorDetails }> = ({ doctor }) => {
  const navigate = useNavigate();

  const getImageSource = (): string => {
    if (doctor.photo) {
      return `${import.meta.env.VITE_API_URL}/${doctor.photo.replace(/\\/g, '/')}`;
    }
    return "/default-avatar.png";
  };
  

  const formatFee = (fee?: number): string => {
    if (fee === undefined || fee === null) return "Not specified";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(fee);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Profile</h2>
      <div className="card p-4 shadow-sm">
        <div className="text-center">
          <div className="position-relative d-inline-block">
            <img
              src={getImageSource()}
              alt={`Dr. ${doctor.firstname} ${doctor.lastname}`}
              className="rounded-circle mb-3 img-thumbnail"
              width="150"
              height="150"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/default-avatar.png";
                target.onerror = null;
              }}
              style={{ objectFit: 'cover' }}
            />
          </div>

          <h3 className="mb-3">Dr. {doctor.firstname} {doctor.lastname}</h3>

          <div className="profile-details mt-4 text-start mx-auto" style={{ maxWidth: '600px' }}>
            <div className="mb-3">
              <h5 className="text-primary">Professional Information</h5>
              <p><strong>Specialty:</strong> {doctor.specialite}</p>
              {doctor.yearsOfExperience !== undefined && (
                <p><strong>Experience:</strong> {doctor.yearsOfExperience} year(s)</p>
              )}
              <p><strong>Consultation Fee:</strong> {formatFee(doctor.consultationFee)}</p>
              {doctor.licenseNumber && (
                <p><strong>License #:</strong> {doctor.licenseNumber}</p>
              )}
            </div>

            <div className="mb-3">
              <h5 className="text-primary">Contact Information</h5>
              <p><strong>Email:</strong> {doctor.email}</p>
              <p><strong>Phone:</strong> {doctor.phone}</p>
              {doctor.address && (
                <p><strong>Address:</strong> {doctor.address}</p>
              )}
            </div>

            {doctor.dateOfBirth && (
              <div className="mb-3">
                <h5 className="text-primary">Personal Information</h5>
                <p><strong>Date of Birth:</strong> {new Date(doctor.dateOfBirth).toLocaleDateString()}</p>
              </div>
            )}

            <div className="mb-3">
              <h5 className="text-primary">About</h5>
              <p className="text-muted">
                {doctor.biography || "No biography available."}
              </p>
            </div>

            <div className="d-flex justify-content-center gap-3 mt-3">
              <Link to="/doctor/profile/edit" className="btn btn-primary">
                Edit Profile
              </Link>
              <button
                className="btn btn-outline-warning"
                onClick={() => navigate("/doctor/ChangePassword")}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;