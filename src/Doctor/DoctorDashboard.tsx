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
        const response = await fetch("https://pfe-project-2nrq.onrender.com/api/medecin/me", {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch doctor profile");
        }

        const data = await response.json();
        login({ ...user, ...data }); // Mise à jour du profil utilisateur
      } catch (err) {
        console.error("Error fetching doctor profile:", err);
        setError("Échec du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [user?.accessToken]);

  if (loading) return <div className="text-center mt-5">Chargement du tableau de bord...</div>;
  if (error) return <div className="alert alert-danger mt-3 text-center">{error}</div>;
  if (!user) return <div>Redirection vers la connexion...</div>;

  return (
    <div className="container mt-5">
      <RefreshToken />

      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="mb-1">Bienvenue Dr. {user.firstname} {user.lastname}</h2>
          <p className="mb-0"><strong>Spécialité :</strong> {user.specialite}</p>
          <p className="mb-0"><strong>Email :</strong> {user.email}</p>
        </div>
        <button
          className="btn btn-outline-danger"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Déconnexion
        </button>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-3">Votre Planning</h4>
              <DoctorSchedule />
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-3">Demandes de Rendez-vous</h4>
              <AppointmentRequests />
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4 shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-3">Profil du Médecin</h4>
          <DoctorProfile doctor={user} />
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
