import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner, Alert, Button, Badge, Modal } from "react-bootstrap";

interface Appointment {
  id: string;
  date: string;
  time: string;
  appointmentNumber: number;
  status: "pending" | "completed" | "cancelled";
  Medecin?: {
    firstname: string;
    lastname: string;
    speciality?: string;
  };
}

const AppointmentHistory = () => {
  const { getAccessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const fetchAppointments = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        logout();
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!appointmentToCancel) return;

    try {
      const token = getAccessToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments/${appointmentToCancel}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }

      setAppointments(appointments.filter(appt => appt.id !== appointmentToCancel));
      setShowCancelModal(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error while canceling appointment"
      );
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        {error}
      </Alert>
    );
  }

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-primary">Appointment History</h2>

      {appointments.length === 0 ? (
        <Alert variant="info">No appointments found</Alert>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Doctor</th>
                <th>Speciality</th>
                <th>Appt. Number</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{formatDate(appointment.date)}</td>
                  <td>{formatTime(appointment.time)}</td>
                  <td>
                    {appointment.Medecin ? (
                      <>Dr. {appointment.Medecin.firstname} {appointment.Medecin.lastname}</>
                    ) : (
                      <span className="text-muted">Unknown</span>
                    )}
                  </td>
                  <td>{appointment.Medecin?.speciality || "General Practitioner"}</td>
                  <td>{appointment.appointmentNumber}</td>
                  <td>
                    <Badge
                      bg={
                        appointment.status === "pending"
                          ? "warning"
                          : appointment.status === "completed"
                          ? "success"
                          : "danger"
                      }
                      text={
                        appointment.status === "pending" ? "dark" : "white"
                      }
                    >
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </Badge>
                  </td>
                  <td>
                    {appointment.status === "pending" ? (
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            navigate(`/reschedule/${appointment.id}`, {
                              state: {
                                currentDate: appointment.date,
                                currentTime: appointment.time,
                              },
                            })
                          }
                        >
                          Reschedule
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setAppointmentToCancel(appointment.id);
                            setShowCancelModal(true);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancel confirmation modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this appointment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Back
          </Button>
          <Button variant="danger" onClick={handleCancel}>
            Confirm Cancellation
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AppointmentHistory;