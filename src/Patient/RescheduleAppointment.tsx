import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { format, isAfter } from "date-fns";
import { parseISO } from 'date-fns/parseISO';
import { Doctor, Availability } from "../types/doctor";

const RescheduleAppointment = () => {
  const { id } = useParams<{ id: string }>();
  const { getAccessToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    time: "",
    availabilityId: ""
  });
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [currentAppointment, setCurrentAppointment] = useState<any>(null);
  const [loading, setLoading] = useState({
    appointment: true,
    availabilities: true
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = getAccessToken();
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to load appointment");
        }

        const data = await response.json();
        const appointment = data.appointment || data;

        setCurrentAppointment(appointment);
        setFormData({
          time: format(parseISO(appointment.time), "HH:mm"),
          availabilityId: appointment.availabilityId || ""
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, appointment: false }));
      }
    };

    fetchAppointment();
  }, [id]);

  useEffect(() => {
    if (!currentAppointment?.doctorId) return;

    const fetchAvailabilities = async () => {
      try {
        const token = getAccessToken();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/availabilities/${currentAppointment.doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load availabilities");
        }

        const data = await response.json();
        const availabilities = data.upcoming || data.availabilities || [];

        const validAvailabilities = availabilities.filter((avail: any) => {
          const parsedDate = new Date(avail.date);
          return !isNaN(parsedDate.getTime()) && isAfter(parsedDate, new Date());
        });

        setAvailabilities(validAvailabilities);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, availabilities: false }));
      }
    };

    fetchAvailabilities();
  }, [currentAppointment?.doctorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.availabilityId || !formData.time) {
      setError("Please select a time slot and time");
      return;
    }

    if (currentAppointment?.status === "accepted") {
      setError("This appointment has already been accepted and cannot be modified");
      return;
    }

    try {
      const token = getAccessToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            availabilityId: formData.availabilityId,
            time: formData.time,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      setSuccess("Appointment rescheduled successfully!");
      setTimeout(() => {
        navigate("/dashboard/appointmentHistory");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  if (loading.appointment || loading.availabilities) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <Spinner animation="border" role="status" style={{ color: "var(--primary)" }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="card shadow-sm" style={{ borderColor: "var(--secondary)" }}>
        <div className="card-header" style={{ backgroundColor: "var(--primary)", color: "white" }}>
          <h2 className="mb-0">Reschedule Appointment</h2>
        </div>
        
        <div className="card-body p-4" style={{ backgroundColor: "var(--background)" }}>
          {error && (
            <Alert variant="danger" className="alert-dismissible fade show">
              {error}
              <button type="button" className="btn-close" onClick={() => setError("")}></button>
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" className="alert-dismissible fade show">
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess("")}></button>
            </Alert>
          )}

          {currentAppointment?.status === "accepted" ? (
            <div className="text-center py-4">
              <div className="mb-3">
                <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: "3rem" }}></i>
              </div>
              <Alert variant="warning" className="d-inline-block">
                This appointment has been accepted and can no longer be modified.
              </Alert>
              <div className="mt-4">
                <Button 
                  variant="outline-primary" 
                  onClick={() => navigate(-1)}
                  style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                >
                  Back
                </Button>
              </div>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <div className="row mb-4">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Time Slot</Form.Label>
                    <Form.Select
                      value={formData.availabilityId}
                      onChange={(e) =>
                        setFormData({ ...formData, availabilityId: e.target.value })
                      }
                      required
                      className="form-select-lg"
                      style={{ borderColor: "var(--secondary)" }}
                    >
                      <option value="">Select a time slot</option>
                      {availabilities.map((avail) => {
                        const parsedDate = new Date(avail.date);
                        const isValidDate = !isNaN(parsedDate.getTime());

                        return (
                          <option key={avail.id} value={avail.id}>
                            {isValidDate
                              ? `${format(parsedDate, "MM/dd/yyyy")} - ${avail.startTime} to ${avail.endTime}`
                              : "Invalid date"}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>
                </div>
                
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Exact Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      required
                      className="form-control-lg"
                      style={{ borderColor: "var(--secondary)" }}
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="d-flex gap-3 justify-content-end mt-4">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate(-1)}
                  className="px-4 py-2"
                  style={{ borderColor: "var(--secondary)", color: "var(--text)" }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  className="px-4 py-2"
                  style={{ backgroundColor: "var(--primary)", borderColor: "var(--primary)" }}
                >
                  <i className="bi bi-calendar-check me-2"></i>
                  Save Changes
                </Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RescheduleAppointment;