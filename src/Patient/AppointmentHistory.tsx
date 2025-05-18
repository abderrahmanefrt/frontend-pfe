import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner, Alert, Modal, Card, Button } from "react-bootstrap";

interface Appointment {
  id: string;
  date: string;
  time: string;
  appointmentNumber: number;
  status: "pending" | "completed" | "cancelled";
  Medecin?: {
    firstname: string;
    lastname: string;
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
      month: "short",
      day: "numeric",
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
        <Spinner animation="border" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <Button 
  onClick={() => navigate('/dashboard')}  // Changé ici
  className="mb-4"
  style={{
    backgroundColor: 'var(--secondary)',
    color: 'var(--text)',
    border: '1px solid var(--primary)',
    padding: '0.5rem 1.5rem',
    borderRadius: '0.375rem',
    fontWeight: '500'
  }}
>
  <i className="fas fa-arrow-left me-2"></i> Back to Dashboard
</Button>
        <Alert variant="danger" className="border-0 shadow-sm" style={{ 
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          borderLeft: '4px solid var(--accent)',
          color: 'var(--text)',
          borderRadius: '8px'
        }}>
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ color: 'var(--text)' }}>Appointment History</h1>
        <Button 
  onClick={() => navigate('/dashboard')}  // Changé ici
  style={{
    backgroundColor: 'var(--secondary)',
    color: 'var(--text)',
    border: '1px solid var(--primary)',
    padding: '0.5rem 1.5rem',
    borderRadius: '0.375rem',
    fontWeight: '500'
  }}
>
  <i className="fas fa-arrow-left me-2"></i> Back to Dashboard
</Button>
      </div>

      {appointments.length === 0 ? (
        <Alert variant="info" className="border-0 shadow-sm" style={{ 
          backgroundColor: 'rgba(100, 162, 212, 0.1)',
          borderLeft: '4px solid var(--secondary)',
          color: 'var(--text)',
          borderRadius: '8px'
        }}>
          No appointments found
        </Alert>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="d-none d-md-block">
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr style={{ backgroundColor: 'var(--background)' }}>
                    <th style={{ color: 'var(--primary)', fontWeight: 600, padding: '12px 16px' }}>Date</th>
                    <th style={{ color: 'var(--primary)', fontWeight: 600, padding: '12px 16px' }}>Time</th>
                    <th style={{ color: 'var(--primary)', fontWeight: 600, padding: '12px 16px' }}>Doctor</th>
                    <th style={{ color: 'var(--primary)', fontWeight: 600, padding: '12px 16px' }}>#</th>
                    <th style={{ color: 'var(--primary)', fontWeight: 600, padding: '12px 16px' }}>Status</th>
                    <th style={{ color: 'var(--primary)', fontWeight: 600, padding: '12px 16px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} style={{ borderBottom: '1px solid var(--secondary)' }}>
                      <td style={{ color: 'var(--text)', padding: '12px 16px' }}>{formatDate(appointment.date)}</td>
                      <td style={{ color: 'var(--text)', padding: '12px 16px' }}>{formatTime(appointment.time)}</td>
                      <td style={{ color: 'var(--text)', padding: '12px 16px' }}>
                        {appointment.Medecin ? (
                          <>Dr. {appointment.Medecin.firstname} {appointment.Medecin.lastname}</>
                        ) : (
                          <span style={{ color: 'var(--secondary)' }}>Unknown</span>
                        )}
                      </td>
                      <td style={{ color: 'var(--text)', padding: '12px 16px' }}>{appointment.appointmentNumber}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className="badge" style={{ 
                          backgroundColor: 
                            appointment.status === "pending" ? 'rgba(255, 193, 7, 0.1)' :
                            appointment.status.toLowerCase() === "accepter" ? 'rgba(40, 167, 69, 0.1)' :
                            'rgba(220, 53, 69, 0.1)',
                          color:
                            appointment.status === "pending" ? '#ffc107' :
                            appointment.status.toLowerCase() === "accepter" ? '#28a745' :
                            '#dc3545',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '50px',
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          textTransform: 'capitalize'
                        }}>
                          {appointment.status.toLowerCase() === "accepter" ? "Confirmed" : appointment.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {appointment.status === "pending" ? (
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm border-0"
                              onClick={() =>
                                navigate(`/reschedule/${appointment.id}`, {
                                  state: {
                                    currentDate: appointment.date,
                                    currentTime: appointment.time,
                                  },
                                })
                              }
                              style={{ 
                                backgroundColor: 'rgba(var(--primary-rgb), 0.1)',
                                color: 'var(--primary)',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '6px',
                                fontWeight: 500,
                                fontSize: '0.8rem',
                                transition: 'all 0.2s',
                                border: '1px solid rgba(var(--primary-rgb), 0.2)'
                              }}
                            >
                              Reschedule
                            </button>
                            <button
                              className="btn btn-sm border-0"
                              onClick={() => {
                                setAppointmentToCancel(appointment.id);
                                setShowCancelModal(true);
                              }}
                              style={{ 
                                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                                color: '#dc3545',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '6px',
                                fontWeight: 500,
                                fontSize: '0.8rem',
                                transition: 'all 0.2s',
                                border: '1px solid rgba(220, 53, 69, 0.2)'
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <span style={{ 
                            color: 'var(--secondary)', 
                            fontSize: '0.9rem',
                            fontStyle: 'italic'
                          }}>
                            No actions available
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="d-md-none">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="mb-3 border-0 shadow-sm" style={{ 
                borderRadius: '12px',
                backgroundColor: 'var(--background)'
              }}>
                <Card.Body style={{ padding: '1.25rem' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Date:</span>
                    <span style={{ color: 'var(--text)' }}>{formatDate(appointment.date)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Time:</span>
                    <span style={{ color: 'var(--text)' }}>{formatTime(appointment.time)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Doctor:</span>
                    <span style={{ color: 'var(--text)' }}>
                      {appointment.Medecin ? 
                        `Dr. ${appointment.Medecin.firstname} ${appointment.Medecin.lastname}` : 
                        'Unknown'}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Status:</span>
                    <span className="badge" style={{ 
                      backgroundColor: 
                        appointment.status === "pending" ? 'rgba(255, 193, 7, 0.1)' :
                        appointment.status.toLowerCase() === "accepter" ? 'rgba(40, 167, 69, 0.1)' :
                        'rgba(220, 53, 69, 0.1)',
                      color:
                        appointment.status === "pending" ? '#ffc107' :
                        appointment.status.toLowerCase() === "accepter" ? '#28a745' :
                        '#dc3545',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '50px',
                      fontWeight: 500,
                      fontSize: '0.8rem',
                      textTransform: 'capitalize'
                    }}>
                      {appointment.status.toLowerCase() === "accepter" ? "Confirmed" : appointment.status}
                    </span>
                  </div>
                  
                  {appointment.status === "pending" && (
                    <div className="d-flex gap-2 mt-3">
                      <button
                        className="btn btn-sm border-0 flex-grow-1"
                        onClick={() =>
                          navigate(`/reschedule/${appointment.id}`, {
                            state: {
                              currentDate: appointment.date,
                              currentTime: appointment.time,
                            },
                          })
                        }
                        style={{ 
                          backgroundColor: 'rgba(var(--primary-rgb), 0.1)',
                          color: 'var(--primary)',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          transition: 'all 0.2s',
                          border: '1px solid rgba(var(--primary-rgb), 0.2)'
                        }}
                      >
                        Reschedule
                      </button>
                      <button
                        className="btn btn-sm border-0 flex-grow-1"
                        onClick={() => {
                          setAppointmentToCancel(appointment.id);
                          setShowCancelModal(true);
                        }}
                        style={{ 
                          backgroundColor: 'rgba(220, 53, 69, 0.1)',
                          color: '#dc3545',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          transition: 'all 0.2s',
                          border: '1px solid rgba(220, 53, 69, 0.2)'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Cancel confirmation modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton style={{ 
          borderBottom: 'none',
          backgroundColor: 'var(--background)',
          borderRadius: '12px 12px 0 0'
        }}>
          <Modal.Title style={{ color: 'var(--text)', fontWeight: 600 }}>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: 'var(--text)', padding: '1.5rem' }}>
          Are you sure you want to cancel this appointment? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer style={{ 
          borderTop: 'none',
          backgroundColor: 'var(--background)',
          borderRadius: '0 0 12px 12px'
        }}>
          <button 
            className="btn border-0"
            onClick={() => setShowCancelModal(false)}
            style={{ 
              backgroundColor: 'rgba(108, 117, 125, 0.1)',
              color: 'var(--text)',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: 500,
              transition: 'all 0.2s',
              border: '1px solid rgba(108, 117, 125, 0.2)'
            }}
          >
            Back
          </button>
          <button 
            className="btn border-0"
            onClick={handleCancel}
            style={{ 
              backgroundColor: 'rgba(220, 53, 69, 0.1)',
              color: '#dc3545',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: 500,
              transition: 'all 0.2s',
              border: '1px solid rgba(220, 53, 69, 0.2)'
            }}
          >
            Confirm Cancellation
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AppointmentHistory;