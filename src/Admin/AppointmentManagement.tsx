import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Appointment {
  id: number;
  date: string;
  time: string;
  User: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  };
  Medecin: {
    id: number;
    firstname: string;
    lastname: string;
  };
}

const AdminAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments`, {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        });

        const data = await res.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments', error);
      }
    };

    fetchAppointments();
  }, [user]);

  return (
    <div className="container mt-4">
      <h3>All Upcoming Appointments</h3>
      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Patient</th>
            <th>Doctor</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td>{new Date(appt.date).toLocaleDateString()}</td>
              <td>{appt.time}</td>
              <td>{appt.User.firstname} {appt.User.lastname} ({appt.User.email})</td>
              <td>{appt.Medecin.firstname} {appt.Medecin.lastname}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAppointments;
