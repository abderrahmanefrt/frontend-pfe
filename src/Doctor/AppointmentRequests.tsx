import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

interface AppointmentRequest {
  id: string;
  User: {
    firstname: string;
    lastname: string;
  };
  date: string;
  time: string | null;
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

      const data: AppointmentRequest[] = await response.json();

      // Ajout d'un log de debug si nécessaire :
      console.log("Appointments reçus :", data);

      // Correction du filtre
      const now = new Date();
      const filtered = data.filter((req) => {
        try {
          const time = req.time?.padStart(5, "0") || "00:00";
          const dateTime = new Date(`${req.date}T${time}`);
          return !isNaN(dateTime.getTime()) && dateTime >= now;
        } catch {
          return false;
        }
      });

      setRequests(filtered);
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
        throw new Error("Failed to update appointment status.");
      }

      await fetchAppointments();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Status update failed");
    }
  };

  return (
    <div className="container-fluid p-0">
      {error && (
        <div className="alert border-0 shadow-sm mb-4" style={{
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          borderLeft: '4px solid #dc3545'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <span style={{ color: '#dc3545' }}>{error}</span>
            <button className="btn-close" onClick={() => setError(null)} />
          </div>
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border" style={{ color: 'var(--primary)' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table mb-0">
            <thead style={{ backgroundColor: 'var(--secondary)' }}>
              <tr>
                <th style={{ color: 'var(--primary)' }}>Patient</th>
                <th style={{ color: 'var(--primary)' }}>Date</th>
                <th style={{ color: 'var(--primary)' }}>Time</th>
                <th style={{ color: 'var(--primary)' }}>Status</th>
                <th style={{ color: 'var(--primary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4" style={{ color: 'var(--text)' }}>
                    No appointment requests
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id}>
                    <td style={{ color: 'var(--text)' }}>
                      {req.User?.firstname ?? "N/A"} {req.User?.lastname ?? ""}
                    </td>
                    <td style={{ color: 'var(--text)' }}>{req.date}</td>
                    <td style={{ color: 'var(--text)' }}>{req.time || "Not specified"}</td>
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
                        <span style={{ color: 'var(--text)' }}>No actions</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentRequests;
