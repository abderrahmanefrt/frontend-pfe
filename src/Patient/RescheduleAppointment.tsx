import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert, Button, Spinner } from "react-bootstrap";
import { format, isAfter } from "date-fns";
import { FaClock, FaCheckCircle } from "react-icons/fa";

interface Availability {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface Appointment {
  id: string;
  doctorId: string;
  time: string;
  availabilityId: string;
  status: string;
  medecinId: string;
}

const RescheduleAppointment = () => {
  const { id } = useParams<{ id: string }>();
  const { getAccessToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    time: "",
    availabilityId: ""
  });
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState({
    appointment: true,
    availabilities: true
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  console.log('RescheduleAppointment rendering...');
  console.log('Loading state:', loading);
  console.log('Current Appointment:', currentAppointment);
  console.log('Availabilities:', availabilities);

  useEffect(() => {
    console.log('useEffect for fetching appointment running...');
    const fetchAppointment = async () => {
      try {
        console.log('Fetching appointment with ID:', id);
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

        console.log('Appointment data received:', appointment);

        setCurrentAppointment(appointment);
        setFormData({
          time: appointment.time ? appointment.time.substring(0, 5) : "",
          availabilityId: appointment.availabilityId || ""
        });
      } catch (err: any) {
        console.error('Error fetching appointment:', err);
        setError(err.message);
      } finally {
        console.log('Finished fetching appointment. Setting loading.appointment to false.');
        setLoading(prev => ({ ...prev, appointment: false }));
      }
    };

    fetchAppointment();
  }, [id, getAccessToken]);

  useEffect(() => {
    console.log('useEffect for fetching availabilities running...');
    if (!currentAppointment?.medecinId) {
        console.log('currentAppointment or medecinId is missing. Skipping availability fetch.');
        setLoading(prev => ({ ...prev, availabilities: false })); // Ensure availabilities loading is set to false if fetch is skipped
        return;
    }

    console.log('Fetching availabilities for doctorId:', currentAppointment.medecinId);

    const fetchAvailabilities = async () => {
      try {
        const token = getAccessToken();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/disponibilites/${currentAppointment.medecinId}`,
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
        const availabilities = data.a_venir || [];

        console.log('Availabilities data received:', availabilities);

        const validAvailabilities = availabilities.filter((avail: Availability) => {
          const parsedDate = new Date(avail.date);
          return !isNaN(parsedDate.getTime()) && isAfter(parsedDate, new Date());
        });

        console.log('Valid Availabilities:', validAvailabilities);

        setAvailabilities(validAvailabilities);
      } catch (err: any) {
        console.error('Error fetching availabilities:', err);
        setError(err.message);
      } finally {
        console.log('Finished fetching availabilities. Setting loading.availabilities to false.');
        setLoading(prev => ({ ...prev, availabilities: false }));
      }
    };

    fetchAvailabilities();
  }, [currentAppointment, getAccessToken]);

  const handleSlotSelect = (availabilityId: string, slotTime: string) => {
    setFormData({ ...formData, availabilityId, time: slotTime });
    setError("");
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, time: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    console.log('Submit button clicked. FormData:', formData);

    if (!formData.availabilityId || !formData.time) {
      setError("Please select a slot and time");
      console.log('Validation failed: slot or time missing.');
      return;
    }

    if (currentAppointment?.status === "accepted") {
      setError("This appointment has already been accepted and cannot be modified");
      console.log('Validation failed: appointment already accepted.');
      return;
    }

    try {
      console.log('Attempting to update appointment with ID:', id, 'with data:', formData);
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

      console.log('Update appointment response:', response.status, data);

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      setSuccess("Appointment rescheduled successfully!");
      console.log('Appointment updated successfully.');
      setTimeout(() => {
        navigate("/dashboard/appointmentHistory");
      }, 1000);
    } catch (err: any) {
      console.error('Error updating appointment:', err);
      setError(err.message || "An error occurred");
    }
  };

  console.log('Rendering based on loading state:', loading);

  if (loading.appointment || loading.availabilities) {
    console.log('Displaying spinner...');
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <Spinner animation="border" role="status" style={{ color: "var(--primary)" }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  console.log('Loading complete. Rendering form or accepted message.');

  return (
    <div className="container my-5">
      <div className="card shadow-lg border-0" style={{ borderRadius: 24, background: "#fafdff" }}>
        <div className="card-header text-center" style={{ background: "linear-gradient(90deg, #4682B4 60%, #64a2d4 100%)", color: "white", borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
          <h2 className="mb-0 fw-bold">Reschedule Appointment</h2>
        </div>
        <div className="card-body p-4">
          {error && (
            <Alert variant="danger" className="alert-dismissible fade show">
              {error}
              <button type="button" className="btn-close" onClick={() => setError("")}></button>
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="alert-dismissible fade show d-flex align-items-center gap-2">
              {FaCheckCircle({ className: "me-2 text-success" })}
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
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <h5 className="fw-bold mb-3" style={{ color: "var(--primary)" }}>Choose a Time Slot</h5>
                <div className="d-flex flex-wrap gap-3">
                  {availabilities.length === 0 && <span className="text-muted">No slots available.</span>}
                  {availabilities.map((avail) => {
                    const parsedDate = new Date(avail.date);
                    const slotLabel = `${format(parsedDate, "EEEE, MMM d")} | ${avail.startTime} - ${avail.endTime}`;
                    const isSelected = formData.availabilityId === avail.id;
                    return (
                      <button
                        type="button"
                        key={avail.id}
                        className={`btn slot-btn px-4 py-3 d-flex align-items-center gap-2 ${isSelected ? "selected" : ""}`}
                        style={{
                          borderRadius: 16,
                          border: isSelected ? "2px solid var(--primary)" : "1px solid #e0e6ed",
                          background: isSelected ? "#eaf4fb" : "#fff",
                          color: isSelected ? "var(--primary)" : "#222",
                          fontWeight: 500,
                          boxShadow: isSelected ? "0 2px 8px rgba(70,130,180,0.08)" : "none",
                          transition: "all 0.2s"
                        }}
                        onClick={() => handleSlotSelect(avail.id, avail.startTime)}
                      >
                        {FaClock({ className: "me-2" })}
                        {slotLabel}
                        {isSelected && FaCheckCircle({ className: "ms-2 text-success" })}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mb-4">
                <h5 className="fw-bold mb-2" style={{ color: "var(--primary)" }}>Exact Time</h5>
                <input
                  type="time"
                  className="form-control form-control-lg"
                  value={formData.time}
                  onChange={handleTimeChange}
                  required
                  min={availabilities.find(a => a.id === formData.availabilityId)?.startTime || ""}
                  max={availabilities.find(a => a.id === formData.availabilityId)?.endTime || ""}
                  disabled={!formData.availabilityId}
                  style={{ borderColor: "var(--secondary)", maxWidth: 220 }}
                />
                <div className="form-text ms-1">Choose an exact time within the selected slot.</div>
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
                  type="submit" 
                  className="px-4 py-2"
                  style={{ backgroundColor: "var(--primary)", borderColor: "var(--primary)" }}
                >
                  Reschedule
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
      <style>{`
        .slot-btn.selected {
          outline: 2px solid var(--primary) !important;
        }
        .slot-btn:hover {
          background: #f0f8ff;
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default RescheduleAppointment;