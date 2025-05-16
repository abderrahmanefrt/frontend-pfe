import React, { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalAppointments: number;
  pendingDoctorRequests: number;
  pendingReviews: number;
  totalRejectedReviews: number;
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || user.role !== 'admin') {
        alert("Access restricted to administrators");
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.accessToken}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          logout();
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load dashboard statistics');
        if (error instanceof Error && error.message.includes('401')) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, logout, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="ms-3 text-muted">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <p className="text-danger">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary mt-3"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <p className="text-muted">No data available</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary mt-3"
        >
          Refresh
        </button>
      </div>
    );
  }

  const {
    totalUsers,
    totalDoctors,
    totalAppointments,
    pendingDoctorRequests,
    pendingReviews,
    totalRejectedReviews,
  } = stats;

  return (
    <div className="container-fluid p-4">
      <header className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h3">Admin Dashboard</h1>
          <div className="d-flex align-items-center">
            <span className="me-3 text-muted">
              Logged in as: <strong>{user?.firstname} {user?.lastname}</strong>
            </span>
            <button onClick={logout} className="btn btn-danger">Logout</button>
          </div>
        </div>
      </header>

      {/* Boutons vers la gestion des médecins */}
      <div className="d-flex justify-content-end gap-2 mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/admin/doctors')}
        >
          Manage Pending Doctors
        </button>
        

        <button
          className="btn btn-outline-primary"
          onClick={() => navigate('/admin/doctors-list')}
        >
          View Accepted Doctors
        </button>
        <button
        
  className="btn btn-outline-danger"
  onClick={() => navigate('"/admin/avis/:doctorId')} // exemple avec ID 1
>
  Manage Comments
</button>


        <button className="btn btn-success" onClick={() => navigate('/admin/users')}>
          View patients
        </button>
        <button className="btn btn-outline-primary me-2" onClick={() => navigate('/admin/appointments')}>
  View Appointments
</button>

      </div>

      {/* Cartes de statistiques */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Users</h5>
              <p className="card-text display-4 text-primary">{totalUsers}</p>
              <p className="text-muted">Total registered</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Doctors</h5>
              <p className="card-text display-4 text-success">{totalDoctors}</p>
              <p className="text-muted">Total approved</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Appointments</h5>
              <p className="card-text display-4 text-warning">{totalAppointments}</p>
              <p className="text-muted">Total bookings</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card shadow-sm border-start border-4 border-warning">
            <div className="card-body">
              <h5 className="card-title">Pending Doctor Requests</h5>
              <p className="card-text display-4 text-warning">{pendingDoctorRequests}</p>
              <p className="text-muted">Require action</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Reviews to Moderate</h5>
              <p className="card-text display-4 text-danger">{pendingReviews}</p>
              <p className="text-muted">Awaiting approval</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Rejected Reviews</h5>
              <p className="card-text display-4 text-danger">{totalRejectedReviews}</p>
              <p className="text-muted">Total rejected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
