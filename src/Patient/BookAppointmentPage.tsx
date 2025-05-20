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
        console.log("Fetching booked times for medecinId:", medecinId, "date:", date);
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
          const formattedTimes = (data.bookedTimes || []).map((t: string) => t.slice(0, 5));
          setBookedTimes(formattedTimes);
        } else {
          console.error("Backend error:", data.message);
        }
      } catch (err) {
        console.error("Error fetching booked times:", err);
      }
    };
    if (medecinId && date) {
      fetchBookedTimes();
    }
    console.log("Date:", date);
console.log("Booked times:", bookedTimes);
console.log("Time slots:", timeSlots);

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
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3"
         style={{ backgroundColor: 'var(--background)' }}>
      <div
        className="card shadow-lg w-100"
        style={{
          maxWidth: "700px",
          borderColor: 'var(--secondary)'
        }}
      >
        <div
          className="card-header text-white text-center py-3"
          style={{
            backgroundColor: 'var(--primary)',
            borderBottom: `2px solid var(--accent)`
          }}
        >
          <h2 className="mb-1">Book Your Appointment</h2>
          <p className="mb-1 fs-5">
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <small className="opacity-75">Available between {startTime} - {endTime}</small>
        </div>

        <div className="card-body p-4" style={{ backgroundColor: 'var(--background)' }}>
          <h5 className="mb-3 text-center" style={{ color: 'var(--text)' }}>
            <i className="bi bi-clock-history me-2"></i>
            Select a Time Slot
          </h5>

          <div className="row g-3 mb-4 justify-content-center">
            {timeSlots.map((time) => {
              const isBooked = bookedTimes.includes(time);
              const isSelected = selectedTime === time;

              return (
                <div className="col-6 col-md-4 col-lg-3" key={time}>
                  <button
                    className={`btn w-100 py-2 ${isBooked
                      ? "btn-danger text-white"
                      : isSelected
                        ? "border-2 fw-bold"
                        : ""
                      }`}
                    onClick={() => !isBooked && setSelectedTime(time)}
                    disabled={isBooked}
                    style={{
                      backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                      color: isSelected ? 'white' : 'var(--text)',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--secondary)',
                      transition: 'all 0.2s ease',
                      borderRadius: '8px'
                    }}
                  >
                    {time}
                    {isBooked && <i className="bi bi-lock-fill ms-2"></i>}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mx-auto" style={{ maxWidth: '500px' }}>
            {error && (
              <div
                className="alert d-flex align-items-center mb-4"
                role="alert"
                style={{
                  backgroundColor: 'rgba(220, 53, 69, 0.1)',
                  borderLeft: '4px solid var(--danger)',
                  color: 'var(--text)'
                }}
              >
                <i className="bi bi-exclamation-triangle-fill me-2" style={{ color: 'var(--danger)' }}></i>
                <div>{error}</div>
              </div>
            )}

            {success && (
              <div
                className="alert d-flex align-items-center mb-4"
                role="alert"
                style={{
                  backgroundColor: 'rgba(25, 135, 84, 0.1)',
                  borderLeft: '4px solid var(--success)',
                  color: 'var(--text)'
                }}
              >
                <i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--success)' }}></i>
                <div>{success}</div>
              </div>
            )}

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4">
              <button
                onClick={() => navigate(-1)}
                className="btn flex-grow-1 py-2"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text)',
                  border: '1px solid var(--secondary)',
                  borderRadius: '8px'
                }}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back
              </button>
              <button
                onClick={handleBook}
                disabled={isLoading || !selectedTime}
                className="btn flex-grow-1 py-2"
                style={{
                  backgroundColor: 'var(--primary)',
                  borderColor: 'var(--primary)',
                  color: 'white',
                  borderRadius: '8px',
                  opacity: isLoading || !selectedTime ? 0.7 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-calendar-check me-2"></i>
                    Confirm Appointment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;