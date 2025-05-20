import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Appointment {
  id: string;
  User: {
    firstname: string;
    lastname: string;
    email: string;
  };
  date: string; // format: YYYY-MM-DD
  time: string; // format: HH:mm (ex: 14:30)
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

        // Filtrer : garder uniquement les rendez-vous dont la date + heure est dans le futur
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

  return (
    <div className="container">
      <h2 className="mb-4">Accepted Appointments</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No upcoming accepted appointments</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Email</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.User.firstname} {appt.User.lastname}</td>
                <td>{appt.User.email}</td>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AcceptedAppointments;
