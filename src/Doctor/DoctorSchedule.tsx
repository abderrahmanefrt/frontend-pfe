import React, { useState, useEffect } from "react";

interface ScheduleSlot {
  id: number;
  date: string;       // e.g., "2024-12-01"
  startTime: string;  // e.g., "09:00"
  endTime: string;    // e.g., "10:00"
  available: boolean;
}

const DoctorSchedule: React.FC = () => {
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching schedule data from an API on component mount
  useEffect(() => {
    const dummySlots: ScheduleSlot[] = [
      { id: 1, date: "2024-12-01", startTime: "09:00", endTime: "10:00", available: true },
      { id: 2, date: "2024-12-01", startTime: "10:30", endTime: "11:30", available: false },
      { id: 3, date: "2024-12-02", startTime: "13:00", endTime: "14:00", available: true },
    ];

    // Simulate API delay
    setTimeout(() => {
      setSlots(dummySlots);
      setLoading(false);
    }, 1000);
  }, []);

  // Toggle the availability of a schedule slot
  const toggleAvailability = (slotId: number) => {
    setSlots(prevSlots =>
      prevSlots.map(slot =>
        slot.id === slotId ? { ...slot, available: !slot.available } : slot
      )
    );
    // In a real application, update the backend API as well.
  };

  return (
    <div className="container mt-4">
      
      {loading ? (
        <p>Loading schedule...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id}>
                <td>{slot.date}</td>
                <td>{slot.startTime}</td>
                <td>{slot.endTime}</td>
                <td>{slot.available ? "Available" : "Unavailable"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => toggleAvailability(slot.id)}
                  >
                    Toggle Availability
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorSchedule;
