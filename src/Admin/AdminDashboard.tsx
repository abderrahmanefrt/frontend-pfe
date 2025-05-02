import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalAppointments: number;
  pendingDoctorRequests: number;
  pendingReviews: number;        // new stat for moderation
  averageModerationTime: number; // in hours, dummy value
  totalRejectedReviews: number;  // dummy value
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Simulate fetching dashboard statistics from an API
  useEffect(() => {
    const dummyStats: DashboardStats = {
      totalUsers: 150,
      totalDoctors: 20,
      totalAppointments: 300,
      pendingDoctorRequests: 5,
      pendingReviews: 3,          // comments awaiting moderation
      averageModerationTime: 2.5, // hours
      totalRejectedReviews: 7
    };

    setTimeout(() => {
      setStats(dummyStats);
    }, 1000);
  }, []);

  if (!stats) {
    return <div>Loading admin dashboard...</div>;
  }

  return (
    <div className="container mt-4">
      <h1>Admin Dashboard</h1>
      <div className="row">
        {/* Total Users */}
        <div className="col-md-2">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        {/* Total Doctors */}
        <div className="col-md-2">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Doctors</h5>
              <p className="card-text">{stats.totalDoctors}</p>
            </div>
          </div>
        </div>
        {/* Total Appointments */}
        <div className="col-md-2">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">Appointments</h5>
              <p className="card-text">{stats.totalAppointments}</p>
            </div>
          </div>
        </div>
        {/* Pending Doctor Requests */}
        <div className="col-md-2">
          <div className="card text-white bg-danger mb-3">
            <div className="card-body">
              <h5 className="card-title">Pending Dr Requests</h5>
              <p className="card-text">{stats.pendingDoctorRequests}</p>
            </div>
          </div>
        </div>
        {/* Pending Reviews */}
        <div className="col-md-2">
          <div className="card text-white bg-secondary mb-3">
            <div className="card-body">
              <h5 className="card-title">Pending Reviews</h5>
              <p className="card-text">{stats.pendingReviews}</p>
            </div>
          </div>
        </div>
        {/* Rejected Reviews */}
        <div className="col-md-2">
          <div className="card text-white bg-dark mb-3">
            <div className="card-body">
              <h5 className="card-title">Rejected Reviews</h5>
              <p className="card-text">{stats.totalRejectedReviews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links for Further Management */}
      <div className="mt-4">
        <h2>Manage</h2>
        <div className="d-flex flex-wrap gap-3">
          <Link to="/admin/users" className="btn btn-outline-primary">
            Manage Users
          </Link>
          <Link to="/admin/doctors" className="btn btn-outline-success">
            Manage Doctors
          </Link>
          <Link to="/admin/appointments" className="btn btn-outline-warning">
            Manage Appointments
          </Link>
          <Link to="/admin/reviews" className="btn btn-outline-secondary">
            Manage Reviews
          </Link>
          <Link to="/admin/reports" className="btn btn-outline-danger">
            View Reports
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;