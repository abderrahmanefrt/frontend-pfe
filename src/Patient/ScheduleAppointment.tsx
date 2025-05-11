import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./ScheduleAppointment.css";
import { useAuth } from "../context/AuthContext";

interface AvailableSlot {
  date: string; // Format: YYYY-MM-DD
  startTime: string;
  endTime: string;
}

interface ScheduleAppointmentProps {
  doctorId: number;
  onTimeSelect?: (selectedDate: Date, time: string) => void;
  onClose?: () => void;
}

const ScheduleAppointment: React.FC<ScheduleAppointmentProps> = ({ 
  doctorId, 
  onTimeSelect,
  onClose 
}) => {
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { getAccessToken } = useAuth();

  // Fetch doctor's availability
  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      setError("");
      try {
        const token = await getAccessToken();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/disponibilites/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch availability");
        }

        const data = await response.json();
        setAvailableSlots(data.a_venir || []);
      } catch (err) {
        setError("Failed to load availability. Please try again.");
        console.error("Error fetching availability:", err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchAvailability();
    }
  }, [doctorId, getAccessToken]);

  // Generate available times for selected date
  useEffect(() => {
    if (selectedDate && availableSlots.length > 0) {
      const dateString = selectedDate.toISOString().split("T")[0];
      const slot = availableSlots.find((s) => s.date === dateString);
      
      if (slot) {
        const times = generateTimeSlots(slot.startTime, slot.endTime, 30);
        setAvailableTimes(times);
      } else {
        setAvailableTimes([]);
      }
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDate, availableSlots]);

  const generateTimeSlots = (start: string, end: string, interval: number): string[] => {
    const slots: string[] = [];
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (
      currentHour < endHour || 
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
      slots.push(timeString);
      
      currentMinute += interval;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }
    
    return slots;
  };

  const handleTimeClick = (time: string) => {
    if (selectedDate && onTimeSelect) {
      onTimeSelect(selectedDate, time);
    }
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateString = date.toISOString().split("T")[0];
      if (availableSlots.some((slot) => slot.date === dateString)) {
        return "available-day";
      }
    }
    return null;
  };

  return (
    <div className="container mt-4">
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <Calendar
        selectRange={false}
        onChange={(value) => {
          if (!value) return;
          if (Array.isArray(value)) {
            setSelectedDate(value[0]);
          } else {
            setSelectedDate(value);
          }
        }}
        value={selectedDate}
        tileClassName={tileClassName}
        minDate={new Date()}
      />

      {selectedDate && (
        <div className="mt-4">
          <h4>Available Times for {selectedDate.toDateString()}</h4>
          {availableTimes.length > 0 ? (
            <div className="d-flex flex-wrap gap-2">
              {availableTimes.map((time, index) => (
                <button
                  key={index}
                  className="btn btn-outline-primary"
                  onClick={() => handleTimeClick(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <p>No available times on this day.</p>
          )}
        </div>
      )}

      {onClose && (
        <button 
          className="btn btn-secondary mt-3"
          onClick={onClose}
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default ScheduleAppointment;