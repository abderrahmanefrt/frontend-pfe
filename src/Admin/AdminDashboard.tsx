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
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: 'var(--background)' }}>
        <div className="spinner-border" style={{ color: 'var(--primary)' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="ms-3" style={{ color: 'var(--text)' }}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ backgroundColor: 'var(--background)' }}>
        <p className="text-danger">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn mt-3"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: '500'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ backgroundColor: 'var(--background)' }}>
        <p style={{ color: 'var(--text)' }}>No data available</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn mt-3"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: '500'
          }}
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
    <div className="container-fluid p-4" style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <header className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h3" style={{ color: 'var(--text)' }}>Admin Dashboard</h1>
          <div className="d-flex align-items-center">
            <span className="me-3" style={{ color: 'var(--secondary)' }}>
              Logged in as: <strong style={{ color: 'var(--text)' }}>{user?.firstname} {user?.lastname}</strong>
            </span>
            <button 
              onClick={logout} 
              className="btn"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1.5rem',
                borderRadius: '0.375rem',
                fontWeight: '500'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Boutons vers la gestion des médecins */}
      <div className="d-flex justify-content-end gap-2 mb-3 flex-wrap">
        <button
          className="btn"
          onClick={() => navigate('/admin/doctors')}
          style={{
            backgroundColor: 'rgba(var(--primary-rgb), 0.1)',
            color: 'var(--primary)',
            border: '1px solid var(--primary)',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: '500'
          }}
        >
          Manage Pending Doctors
        </button>
        
        <button
          className="btn"
          onClick={() => navigate('/admin/doctors-list')}
          style={{
            backgroundColor: 'rgba(var(--primary-rgb), 0.1)',
            color: 'var(--primary)',
            border: '1px solid var(--primary)',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: '500'
          }}
        >
          View Accepted Doctors
        </button>
        
        

        <button 
          className="btn"
          onClick={() => navigate('/admin/users')}
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: '500'
          }}
        >
          View Patients
        </button>
        
        <button 
          className="btn"
          onClick={() => navigate('/admin/appointments')}
          style={{
            backgroundColor: 'rgba(var(--primary-rgb), 0.1)',
            color: 'var(--primary)',
            border: '1px solid var(--primary)',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: '500'
          }}
        >
          View Appointments
        </button>
      </div>

      {/* Cartes de statistiques */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {/* Users Card */}
        <div className="col">
          <div className="card border-0 shadow-sm h-100" style={{ 
            backgroundColor: 'var(--background)',
            borderRadius: '12px',
            borderLeft: '4px solid var(--primary)'
          }}>
            <div className="card-body">
              <h5 className="card-title" style={{ color: 'var(--text)' }}>Users</h5>
              <p className="card-text display-4" style={{ color: 'var(--primary)' }}>{totalUsers}</p>
              <p className="text-muted">Total registered</p>
            </div>
          </div>
        </div>

        {/* Doctors Card */}
        <div className="col">
          <div className="card border-0 shadow-sm h-100" style={{ 
            backgroundColor: 'var(--background)',
            borderRadius: '12px',
            borderLeft: '4px solid #28a745'
          }}>
            <div className="card-body">
              <h5 className="card-title" style={{ color: 'var(--text)' }}>Doctors</h5>
              <p className="card-text display-4" style={{ color: '#28a745' }}>{totalDoctors}</p>
              <p className="text-muted">Total approved</p>
            </div>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="col">
          <div className="card border-0 shadow-sm h-100" style={{ 
            backgroundColor: 'var(--background)',
            borderRadius: '12px',
            borderLeft: '4px solid #ffc107'
          }}>
            <div className="card-body">
              <h5 className="card-title" style={{ color: 'var(--text)' }}>Appointments</h5>
              <p className="card-text display-4" style={{ color: '#ffc107' }}>{totalAppointments}</p>
              <p className="text-muted">Total bookings</p>
            </div>
          </div>
        </div>

        {/* Pending Doctor Requests Card */}
        <div className="col">
          <div className="card border-0 shadow-sm h-100" style={{ 
            backgroundColor: 'var(--background)',
            borderRadius: '12px',
            borderLeft: '4px solid #ffc107'
          }}>
            <div className="card-body">
              <h5 className="card-title" style={{ color: 'var(--text)' }}>Pending Doctor Requests</h5>
              <p className="card-text display-4" style={{ color: '#ffc107' }}>{pendingDoctorRequests}</p>
              <p className="text-muted">Require action</p>
            </div>
          </div>
        </div>

        {/* Reviews to Moderate Card */}
        <div className="col">
          <div className="card border-0 shadow-sm h-100" style={{ 
            backgroundColor: 'var(--background)',
            borderRadius: '12px',
            borderLeft: '4px solid var(--accent)'
          }}>
            <div className="card-body">
              <h5 className="card-title" style={{ color: 'var(--text)' }}>Reviews to Moderate</h5>
              <p className="card-text display-4" style={{ color: 'var(--accent)' }}>{pendingReviews}</p>
              <p className="text-muted">Awaiting approval</p>
            </div>
          </div>
        </div>

        {/* Rejected Reviews Card */}
        <div className="col">
          <div className="card border-0 shadow-sm h-100" style={{ 
            backgroundColor: 'var(--background)',
            borderRadius: '12px',
            borderLeft: '4px solid var(--accent)'
          }}>
            <div className="card-body">
              <h5 className="card-title" style={{ color: 'var(--text)' }}>Rejected Reviews</h5>
              <p className="card-text display-4" style={{ color: 'var(--accent)' }}>{totalRejectedReviews}</p>
              <p className="text-muted">Total rejected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;