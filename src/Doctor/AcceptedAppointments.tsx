import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Appointment {
  id: string;
  User: {
    firstname: string;
    lastname: string;
    email: string;
  };
  date: string;
  time: string;
  status: string;
}

const AcceptedAppointments: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccepted = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/appointments/medecin/accepted`,
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to load appointments.");
        const data: Appointment[] = await response.json();

        const now = new Date();
        const upcomingAppointments = data.filter((appt) => {
          const fullDateTime = new Date(`${appt.date}T${appt.time}`);
          return fullDateTime >= now;
        });

        setAppointments(upcomingAppointments);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (user?.accessToken) {
      fetchAccepted();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to cancel this appointment and notify the patient?");
    if (!confirmed) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments/medecin/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete appointment.");
      }

      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Accepted Appointments</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No upcoming accepted appointments</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Patient</th>
              <th>Email</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.User.firstname} {appt.User.lastname}</td>
                <td>{appt.User.email}</td>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(appt.id)}
                  >
                    Cancel & Notify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AcceptedAppointments;
