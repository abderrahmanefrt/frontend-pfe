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
    <div className="container-fluid p-0">
      <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
        <div className="card-header border-0 py-3" style={{ 
          backgroundColor: 'white',
          borderRadius: '12px 12px 0 0'
        }}>
          <h4 className="card-title mb-0 d-flex align-items-center" style={{ color: 'var(--text)' }}>
            <i className="bi bi-person-badge me-2" style={{ color: 'var(--primary)' }}></i>
            Medical Profile
          </h4>
        </div>
        
        <div className="card-body" style={{ backgroundColor: 'white' }}>
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
                  borderColor: 'var(--secondary) !important'
                }}
              />
            </div>

            <h3 className="mb-3" style={{ color: 'var(--text)' }}>
              Dr. {doctor.firstname} {doctor.lastname}
            </h3>

            <div className="profile-details mt-4 text-start mx-auto" style={{ maxWidth: '600px' }}>
              <div className="mb-4">
                <h5 style={{ 
                  color: 'var(--primary)', 
                  borderBottom: '2px solid var(--secondary)', 
                  paddingBottom: '0.5rem' 
                }}>
                  Professional Information
                </h5>
                <p style={{ color: 'var(--text)' }}><strong>Specialty:</strong> {doctor.specialite}</p>
                {doctor.yearsOfExperience !== undefined && (
                  <p style={{ color: 'var(--text)' }}><strong>Experience:</strong> {doctor.yearsOfExperience} year(s)</p>
                )}
                <p style={{ color: 'var(--text)' }}><strong>Consultation Fee:</strong> {formatFee(doctor.consultationFee)}</p>
                {doctor.licenseNumber && (
                  <p style={{ color: 'var(--text)' }}><strong>License #:</strong> {doctor.licenseNumber}</p>
                )}
              </div>

              <div className="mb-4">
                <h5 style={{ 
                  color: 'var(--primary)', 
                  borderBottom: '2px solid var(--secondary)', 
                  paddingBottom: '0.5rem' 
                }}>
                  Contact Information
                </h5>
                <p style={{ color: 'var(--text)' }}><strong>Email:</strong> {doctor.email}</p>
                <p style={{ color: 'var(--text)' }}><strong>Phone:</strong> {doctor.phone}</p>
                {doctor.address && (
                  <p style={{ color: 'var(--text)' }}><strong>Address:</strong> {doctor.address}</p>
                )}
              </div>

              {doctor.dateOfBirth && (
                <div className="mb-4">
                  <h5 style={{ 
                    color: 'var(--primary)', 
                    borderBottom: '2px solid var(--secondary)', 
                    paddingBottom: '0.5rem' 
                  }}>
                    Personal Information
                  </h5>
                  <p style={{ color: 'var(--text)' }}><strong>Date of Birth:</strong> {new Date(doctor.dateOfBirth).toLocaleDateString()}</p>
                </div>
              )}

              <div className="mb-4">
                <h5 style={{ 
                  color: 'var(--primary)', 
                  borderBottom: '2px solid var(--secondary)', 
                  paddingBottom: '0.5rem' 
                }}>
                  About
                </h5>
                <p style={{ color: 'var(--text)' }}>
                  {doctor.biography || "No biography available."}
                </p>
              </div>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <Link 
                  to="/doctor/profile/edit" 
                  className="btn border-0"
                  style={{ 
                    backgroundColor: 'var(--primary)',
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
                    color: 'var(--primary)',
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
    </div>
  );
};

export default DoctorProfile;