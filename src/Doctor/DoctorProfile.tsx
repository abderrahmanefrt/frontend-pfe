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
    <div className="container mt-4" style={{ backgroundColor: '#f5f7f9', padding: '2rem' }}>
      <h2 className="mb-4" style={{ color: '#121517' }}>My Profile</h2>
      <div className="card p-4 border-0 shadow-sm" style={{ borderRadius: '12px', backgroundColor: 'white' }}>
        <div className="text-center">
          <div className="position-relative d-inline-block">
            <img
              src={getImageSource()}
              alt={`Dr. ${doctor.firstname} ${doctor.lastname}`}
              className="rounded-circle mb-3 border"
              width="150"
              height="150"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/default-avatar.png";
                target.onerror = null;
              }}
              style={{ 
                objectFit: 'cover',
                borderColor: '#9dbeda !important'
              }}
            />
          </div>

          <h3 className="mb-3" style={{ color: '#121517' }}>
            Dr. {doctor.firstname} {doctor.lastname}
          </h3>

          <div className="profile-details mt-4 text-start mx-auto" style={{ maxWidth: '600px' }}>
            <div className="mb-4">
              <h5 style={{ color: '#4682B4', borderBottom: '2px solid #9dbeda', paddingBottom: '0.5rem' }}>
                Professional Information
              </h5>
              <p style={{ color: '#121517' }}><strong>Specialty:</strong> {doctor.specialite}</p>
              {doctor.yearsOfExperience !== undefined && (
                <p style={{ color: '#121517' }}><strong>Experience:</strong> {doctor.yearsOfExperience} year(s)</p>
              )}
              <p style={{ color: '#121517' }}><strong>Consultation Fee:</strong> {formatFee(doctor.consultationFee)}</p>
              {doctor.licenseNumber && (
                <p style={{ color: '#121517' }}><strong>License #:</strong> {doctor.licenseNumber}</p>
              )}
            </div>

            <div className="mb-4">
              <h5 style={{ color: '#4682B4', borderBottom: '2px solid #9dbeda', paddingBottom: '0.5rem' }}>
                Contact Information
              </h5>
              <p style={{ color: '#121517' }}><strong>Email:</strong> {doctor.email}</p>
              <p style={{ color: '#121517' }}><strong>Phone:</strong> {doctor.phone}</p>
              {doctor.address && (
                <p style={{ color: '#121517' }}><strong>Address:</strong> {doctor.address}</p>
              )}
            </div>

            {doctor.dateOfBirth && (
              <div className="mb-4">
                <h5 style={{ color: '#4682B4', borderBottom: '2px solid #9dbeda', paddingBottom: '0.5rem' }}>
                  Personal Information
                </h5>
                <p style={{ color: '#121517' }}><strong>Date of Birth:</strong> {new Date(doctor.dateOfBirth).toLocaleDateString()}</p>
              </div>
            )}

            <div className="mb-4">
              <h5 style={{ color: '#4682B4', borderBottom: '2px solid #9dbeda', paddingBottom: '0.5rem' }}>
                About
              </h5>
              <p style={{ color: '#6c757d' }}>
                {doctor.biography || "No biography available."}
              </p>
            </div>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <Link 
                to="/doctor/profile/edit" 
                className="btn border-0"
                style={{ 
                  backgroundColor: '#4682B4',
                  color: 'white',
                  padding: '0.5rem 1.5rem'
                }}
              >
                Edit Profile
              </Link>
              <button
                className="btn border-0"
                onClick={() => navigate("/doctor/ChangePassword")}
                style={{ 
                  backgroundColor: 'rgba(70, 130, 180, 0.1)',
                  color: '#4682B4',
                  padding: '0.5rem 1.5rem'
                }}
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