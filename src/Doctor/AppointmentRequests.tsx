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
      const response = await fetch("https://pfe-project-2nrq.onrender.com/api/appointments/medecin", {
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
      const response = await fetch(`https://pfe-project-2nrq.onrender.com/api/appointments/${id}/status`, {
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
  
      await fetchAppointments(); // Refresh list
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Status update failed");
    }
  };
  

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Appointment Requests</h2>

      {error && (
        <div className="alert alert-danger">
          {error}
          <button className="btn-close float-end" onClick={() => setError(null)} />
        </div>
      )}

      {loading ? (
        <p>Loading appointment requests...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted">No appointment requests</td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.User?.firstname ?? "N/A"} {req.User?.lastname ?? ""}</td>
                  <td>{req.date}</td>
                  <td>{req.time || "Not specified"}</td>
                  <td>{req.status}</td>
                  <td>
                    {req.status === "pending" ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => updateStatus(req.id, "accepter")}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => updateStatus(req.id, "refuser")}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span>No actions</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentRequests;
