import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DoctorSchedule from "./DoctorSchedule";
import AppointmentRequests from "./AppointmentRequests";
import DoctorProfile from "./DoctorProfile";
import RefreshToken from "../components/RefreshToken";
import { useNavigate } from "react-router-dom";

const DoctorDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchDoctorProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/medecin/me`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch doctor profile");
        }

        const data = await response.json();
        login({ ...user, ...data });
      } catch (err) {
        console.error("Error fetching doctor profile:", err);
        setError("Échec du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [user?.accessToken]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#f5f7f9' }}>
      <div className="spinner-border" style={{ color: '#4682B4' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="ms-3" style={{ color: '#121517' }}>Chargement du tableau de bord...</span>
    </div>
  );

  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger alert-dismissible fade show border-0 shadow-sm" 
           style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', borderLeft: '4px solid #dc3545' }} 
           role="alert">
        <strong style={{ color: '#dc3545' }}>Erreur !</strong> <span style={{ color: '#121517' }}>{error}</span>
        <button type="button" className="btn-close" onClick={() => setError(null)}></button>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f5f7f9' }}>
      <RefreshToken />
      
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-4 py-3 rounded-3 shadow-sm"
           style={{ backgroundColor: 'white' }}>
        <div>
          <h2 className="mb-1 fw-bold" style={{ color: '#4682B4' }}>Tableau de Bord Médical</h2>
          <div className="d-flex flex-wrap gap-3 mt-2">
            <span className="badge fs-6 border-0" style={{ backgroundColor: 'rgba(70, 130, 180, 0.1)', color: '#121517' }}>
              <i className="bi bi-person-fill me-2" style={{ color: '#4682B4' }}></i>
              Dr. {user.firstname} {user.lastname}
            </span>
            <span className="badge fs-6 border-0" style={{ backgroundColor: 'rgba(70, 130, 180, 0.1)', color: '#121517' }}>
              <i className="bi bi-bandaid-fill me-2" style={{ color: '#4682B4' }}></i>
              {user.specialite}
            </span>
            <span className="badge fs-6 border-0" style={{ backgroundColor: 'rgba(70, 130, 180, 0.1)', color: '#121517' }}>
              <i className="bi bi-envelope-fill me-2" style={{ color: '#4682B4' }}></i>
              {user.email}
            </span>
          </div>
        </div>
        <button
          className="btn d-flex align-items-center border-0"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          style={{ 
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            color: '#dc3545'
          }}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Déconnexion
        </button>
      </div>

      {/* Main Content */}
      <div className="row g-4">
        {/* Schedule Card */}
        <div className="col-lg-6">
          <div className="card border-0 h-100 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-header border-0 py-3" style={{ backgroundColor: 'white' }}>
              <h4 className="card-title mb-0 d-flex align-items-center" style={{ color: '#121517' }}>
                <i className="bi bi-calendar-check me-2" style={{ color: '#4682B4' }}></i>
                Votre Planning
              </h4>
            </div>
            <div className="card-body" style={{ backgroundColor: 'white' }}>
              <DoctorSchedule />
            </div>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="col-lg-6">
          <div className="card border-0 h-100 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-header border-0 py-3" style={{ backgroundColor: 'white' }}>
              <h4 className="card-title mb-0 d-flex align-items-center" style={{ color: '#121517' }}>
                <i className="bi bi-clipboard2-pulse me-2" style={{ color: '#4682B4' }}></i>
                Demandes de Rendez-vous
              </h4>
            </div>
            <div className="card-body" style={{ backgroundColor: 'white' }}>
              <AppointmentRequests />
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="col-12">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-header border-0 py-3" style={{ backgroundColor: 'white' }}>
              <h4 className="card-title mb-0 d-flex align-items-center" style={{ color: '#121517' }}>
                <i className="bi bi-person-badge me-2" style={{ color: '#4682B4' }}></i>
                Profil Médical
              </h4>
            </div>
            <div className="card-body" style={{ backgroundColor: 'white' }}>
              <DoctorProfile doctor={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;