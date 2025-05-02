import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Appointment {
  id: number;
  date: string;
  time: string;
  doctorName: string;
  status: "upcoming" | "past" | "cancelled";
}

const AppointmentHistory: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Simulate fetching appointments from an API on component mount
  useEffect(() => {
    const dummyAppointments: Appointment[] = [
      {
        id: 1,
        date: "2024-12-01",
        time: "10:00 AM",
        doctorName: "Dr. Smith",
        status: "upcoming",
      },
      {
        id: 2,
        date: "2024-11-15",
        time: "2:00 PM",
        doctorName: "Dr. Johnson",
        status: "past",
      },
      {
        id: 3,
        date: "2024-11-20",
        time: "11:00 AM",
        doctorName: "Dr. Davis",
        status: "cancelled",
      },
    ];

    // Simulate an API call delay
    setTimeout(() => {
      setAppointments(dummyAppointments);
    }, 1000);
  }, []);

  // Handler for cancelling an appointment
  const handleCancel = (id: number) => {
    // In a real app, you'd call your API to cancel the appointment.
    alert(`Cancel appointment with id ${id}`);
  };

  // Handler for rescheduling an appointment
  const handleReschedule = (id: number) => {
    // In a real app, you'd navigate to a rescheduling page or open a modal.
    //alert(`Reschedule appointment with id ${id}`);
    navigate(`/scheduleWrapper/${id}`);
  };

  return (
    <div>
      <h4>Your Appointments</h4>
      {appointments.length === 0 ? (
        <p>Loading appointments...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Doctor</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.doctorName}</td>
                <td>{appointment.status}</td>
                <td>
                  {appointment.status === "upcoming" && (
                    <>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleReschedule(appointment.id)}
                      >
                        Reschedule
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancel(appointment.id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {appointment.status === "past" && (
                    <span>No actions available</span>
                  )}
                  {appointment.status === "cancelled" && <span>Cancelled</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentHistory;
