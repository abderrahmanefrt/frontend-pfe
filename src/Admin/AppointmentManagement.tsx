import React, { useEffect, useState } from "react";

interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: "pending" | "approved" | "cancelled" | "completed";
}

const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate fetching appointments data from an API
  useEffect(() => {
    const dummyAppointments: Appointment[] = [
      {
        id: 1,
        patientName: "Alice Johnson",
        doctorName: "Dr. Smith",
        date: "2025-01-10",
        time: "09:00",
        status: "pending",
      },
      {
        id: 2,
        patientName: "Bob Smith",
        doctorName: "Dr. Johnson",
        date: "2025-01-11",
        time: "10:30",
        status: "approved",
      },
      {
        id: 3,
        patientName: "Charlie Brown",
        doctorName: "Dr. Brown",
        date: "2025-01-12",
        time: "14:00",
        status: "completed",
      },
    ];

    // Simulate API call delay
    setTimeout(() => {
      setAppointments(dummyAppointments);
      setLoading(false);
    }, 1000);
  }, []);

  // Function to update the status of an appointment
  const updateStatus = (id: number, newStatus: Appointment["status"]) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );
    alert(`Appointment ${id} updated to ${newStatus}`);
  };

  return (
    <div className="container mt-4">
      <h2>Appointment Management</h2>
      {loading ? (
        <p>Loading appointments...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{appointment.patientName}</td>
                <td>{appointment.doctorName}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.status}</td>
                <td>
                  {appointment.status === "pending" && (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => updateStatus(appointment.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          updateStatus(appointment.id, "cancelled")
                        }
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {appointment.status === "approved" && (
                    <>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() =>
                          updateStatus(appointment.id, "completed")
                        }
                      >
                        Complete
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          updateStatus(appointment.id, "cancelled")
                        }
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {appointment.status === "cancelled" && (
                    <span>No actions available</span>
                  )}
                  {appointment.status === "completed" && <span>Completed</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentManagement;
