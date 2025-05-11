import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BookAppointmentPage = () => {
  const { medecinId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { date, startTime, endTime } = location.state || {};
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessToken } = useAuth();

  const consultationDuration = 30;

  useEffect(() => {
    const fetchBookedTimes = async () => {
      try {
        const accessToken = getAccessToken();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/appointments/booked?medecinId=${medecinId}&date=${date}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setBookedTimes(data.bookedTimes || []);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching booked times");
      }
    };
    fetchBookedTimes();
  }, [medecinId, date, getAccessToken]);

  const generateTimeSlots = (start: string, end: string) => {
    const result = [];
    let current = new Date(`${date}T${start}`);
    const endDate = new Date(`${date}T${end}`);
    while (current < endDate) {
      result.push(current.toTimeString().slice(0, 5));
      current.setMinutes(current.getMinutes() + consultationDuration);
    }
    return result;
  };

  const handleBook = async () => {
    if (!selectedTime) {
      setError("Please select a time slot.");
      return;
    }
  
    setError("");
    setSuccess("");
    setIsLoading(true);
  
    try {
      const accessToken = getAccessToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            medecinId,
            date,
            requestedTime: selectedTime,
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }
        setError(data?.message || "Error while booking appointment.");
        return;
      }
  
      setSuccess("Appointment booked successfully!");
  
      // ✅ Met à jour la liste localement pour désactiver le bouton
      setBookedTimes((prev) => [...prev, selectedTime]);
  
      setTimeout(() => (window.location.href = "/dashboard/appointmentHistory"), 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const timeSlots = generateTimeSlots(startTime, endTime);

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-5 px-3">
      <div className="card shadow-lg border-0 w-100" style={{ maxWidth: "700px" }}>
        <div className="card-header bg-primary text-white text-center">
          <h2 className="mb-0">Book Your Appointment</h2>
          <p className="mb-1">
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <small>Available between {startTime} - {endTime}</small>
        </div>

        <div className="card-body">
          <h5 className="mb-3">Select a Time Slot</h5>
          <div className="row g-2 mb-4">
            {timeSlots.map((time) => {
              const isBooked = bookedTimes.includes(time);
              const isSelected = selectedTime === time;

              return (
                <div className="col-6 col-md-4" key={time}>
                  <button
                    className={`btn w-100 
                      ${isBooked
                        ? "btn-danger text-white"
                        : isSelected
                          ? "btn-outline-primary fw-bold"
                          : "btn-outline-secondary"
                      }`}
                    onClick={() => !isBooked && setSelectedTime(time)}
                    disabled={isBooked}
                  >
                    {time}
                  </button>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success d-flex align-items-center" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
            </div>
          )}

          <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 mt-4">
            <button onClick={() => navigate(-1)} className="btn btn-outline-secondary w-100">
              Back
            </button>
            <button
              onClick={handleBook}
              disabled={isLoading || !selectedTime}
              className="btn btn-primary w-100"
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                "Confirm Appointment"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
