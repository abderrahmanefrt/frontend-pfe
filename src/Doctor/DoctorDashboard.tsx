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
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="ms-3">Chargement du tableau de bord...</span>
    </div>
  );

  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Erreur !</strong> {error}
        <button type="button" className="btn-close" onClick={() => setError(null)}></button>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="container-fluid py-4">
      <RefreshToken />
      
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-3 py-3 bg-white rounded-3 shadow-sm">
        <div>
          <h2 className="mb-1 fw-bold text-primary">Tableau de Bord Médical</h2>
          <div className="d-flex flex-wrap gap-3 mt-2">
            <span className="badge bg-light text-dark fs-6">
              <i className="bi bi-person-fill me-2"></i>
              Dr. {user.firstname} {user.lastname}
            </span>
            <span className="badge bg-light text-dark fs-6">
              <i className="bi bi-bandaid-fill me-2"></i>
              {user.specialite}
            </span>
            <span className="badge bg-light text-dark fs-6">
              <i className="bi bi-envelope-fill me-2"></i>
              {user.email}
            </span>
          </div>
        </div>
        <button
          className="btn btn-outline-danger d-flex align-items-center"
          onClick={() => {
            logout();
            navigate("/login");
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
          <div className="card border-0 h-100 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h4 className="card-title mb-0 d-flex align-items-center">
                <i className="bi bi-calendar-check me-2 text-primary"></i>
                Votre Planning
              </h4>
            </div>
            <div className="card-body">
              <DoctorSchedule />
            </div>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="col-lg-6">
          <div className="card border-0 h-100 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h4 className="card-title mb-0 d-flex align-items-center">
                <i className="bi bi-clipboard2-pulse me-2 text-primary"></i>
                Demandes de Rendez-vous
              </h4>
            </div>
            <div className="card-body">
              <AppointmentRequests />
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h4 className="card-title mb-0 d-flex align-items-center">
                <i className="bi bi-person-badge me-2 text-primary"></i>
              </h4>
            </div>
            <div className="card-body">
              <DoctorProfile doctor={user} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DoctorDashboard;