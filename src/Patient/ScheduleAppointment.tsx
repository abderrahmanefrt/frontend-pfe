import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./ScheduleAppointment.css"; // Custom CSS for highlighting available days

interface AvailableSlot {
  date: string; // Format: YYYY-MM-DD
  times: string[];
}
interface ScheduleAppointmentProps {
    onTimeSelect?: (selectedDate: Date, time: string) => void;
  }
// Dummy data simulating available appointment slots
const dummyAvailableSlots: AvailableSlot[] = [
  { date: "2024-12-05", times: ["10:00", "11:30", "14:00"] },
  { date: "2024-12-07", times: ["09:00", "13:00"] },
  { date: "2024-12-10", times: ["08:00", "10:00", "12:00", "15:00"] },
];

const ScheduleAppointment: React.FC<ScheduleAppointmentProps> = ({ onTimeSelect })=> {
    
  // **State Variables:**
  // availableSlots holds the dummy (or fetched) available appointment data.
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);

  // selectedDate stores the date chosen by the user from the calendar.
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // availableTimes will contain the list of time slots available on the selected date.
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // **Fetch Available Slots:**
  // The useEffect hook below simulates an API call to fetch available slots.
  useEffect(() => {
    setTimeout(() => {
      setAvailableSlots(dummyAvailableSlots);
    }, 500);
  }, []);

  // **Update Available Times:**
  // Whenever the selectedDate changes or the availableSlots data is updated,
  // this effect converts the selected date to the "YYYY-MM-DD" format,
  // looks for matching available slots, and updates availableTimes accordingly.
  useEffect(() => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split("T")[0];
      const slot = availableSlots.find((s) => s.date === dateString);
      setAvailableTimes(slot ? slot.times : []);
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDate, availableSlots]);

  // **Handle Time Slot Click:**
  // This function simulates booking an appointment by alerting the chosen time and date.
  // In a real application, you would call an API to perform the booking.
  const handleTimeClick = (time: string) => {
    if (selectedDate && onTimeSelect) {
        onTimeSelect(selectedDate, time);
      } else {
        // Fallback behavior if no callback is provided
        alert(`Appointment booked on ${selectedDate?.toDateString()} at ${time}`);
      }
    };

  // **Customizing Calendar Tiles:**
  // The tileClassName function is used by the react-calendar component to add a custom CSS class
  // ("available-day") to any day that has available appointment slots.
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateString = date.toISOString().split("T")[0];
      if (availableSlots.some((slot) => slot.date === dateString)) {
        return "available-day"; // This class is defined in ScheduleAppointment.css
      }
    }
    return null;
  };

  // **Render the Component:**
  return (
    <div className="container mt-4">
      <h1>Schedule Appointment</h1>
      {/* Calendar Component: */}
      <Calendar
        selectRange={false} // Force single date selection
        onChange={(value, event) => {
          // Cast the value to Date | Date[] | null
          const v = value as Date | Date[] | null;
          if (!v) return;
          if (Array.isArray(v)) {
            setSelectedDate(v[0]);
          } else {
            setSelectedDate(v);
          }
        }}
        // Sets the selected date when a day is clicked
        value={selectedDate}
        tileClassName={tileClassName} // Applies custom classes to calendar tiles
      />

      {/* Display Available Times for Selected Date: */}
      {selectedDate && (
        <div className="mt-4">
          <h3>Available Times for {selectedDate.toDateString()}</h3>
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
    </div>
  );
};

export default ScheduleAppointment;
