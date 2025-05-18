import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

interface AppointmentRequest {
  id: string;
  User: {
    firstname: string;
    lastname: string;
  };
  date: string;
  time: string;
  status: "pending" | "accepter" | "refuser";
}

const AppointmentRequests: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AppointmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments/medecin`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load appointments.");
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.accessToken) {
      fetchAppointments();
    }
  }, [user?.accessToken]);

  const updateStatus = async (id: string, status: "accepter" | "refuser") => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
        },
        body: JSON.stringify({ status }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response status:", response.status);
        console.error("Response body:", errorText);
        throw new Error("Failed to update appointment status.");
      }
  
      await fetchAppointments();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Status update failed");
    }
  };

  return (
    <div className="container mt-4" style={{ backgroundColor: '#f5f7f9', padding: '2rem' }}>
      <h2 className="mb-4" style={{ color: '#121517' }}>Appointment Requests</h2>

      {error && (
        <div className="alert border-0 shadow-sm mb-4" style={{ 
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          borderLeft: '4px solid #dc3545',
          color: '#dc3545'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button 
              className="btn-close" 
              onClick={() => setError(null)}
              style={{ color: '#dc3545' }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border" style={{ color: '#4682B4' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="table-responsive">
            <table className="table mb-0">
              <thead style={{ backgroundColor: '#f5f7f9' }}>
                <tr>
                  <th style={{ color: '#4682B4' }}>Patient</th>
                  <th style={{ color: '#4682B4' }}>Date</th>
                  <th style={{ color: '#4682B4' }}>Time</th>
                  <th style={{ color: '#4682B4' }}>Status</th>
                  <th style={{ color: '#4682B4' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4" style={{ color: '#6c757d' }}>
                      No appointment requests
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id}>
                      <td style={{ color: '#121517' }}>{req.User?.firstname ?? "N/A"} {req.User?.lastname ?? ""}</td>
                      <td style={{ color: '#121517' }}>{req.date}</td>
                      <td style={{ color: '#121517' }}>{req.time || "Not specified"}</td>
                      <td>
                        <span className={`badge ${
                          req.status === 'accepter' ? 'bg-success' : 
                          req.status === 'refuser' ? 'bg-danger' : 'bg-warning'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        {req.status === "pending" ? (
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm border-0"
                              onClick={() => updateStatus(req.id, "accepter")}
                              style={{ 
                                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                                color: '#28a745'
                              }}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-sm border-0"
                              onClick={() => updateStatus(req.id, "refuser")}
                              style={{ 
                                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                                color: '#dc3545'
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: '#6c757d' }}>No actions</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentRequests;