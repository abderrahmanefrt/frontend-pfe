import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScheduleAppointment from "./ScheduleAppointment";

interface AppointmentDetails {
  id: number;
  date: string;
  time: string;
  doctorName?: string;
  // Add other fields if needed
}

// Dummy function to simulate fetching appointment details by id.
// In a real application, replace this with an API call.
  const fetchAppointmentById = (id: number): Promise<AppointmentDetails> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        date: "2024-12-01",
        time: "10:00 AM",
        doctorName: "Dr. Smith",
      });
    }, 500);
  });
};

const ScheduleAppointmentWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(
    null
  );

  // Fetch the appointment details when the component mounts or the id changes.
    useEffect(() => {
        console.log("Route parameter id:", id);
    if (id) {
      fetchAppointmentById(Number(id)).then((data) => {
        setAppointment(data);
      });
    }
  }, [id]);

  // This callback will be passed to ScheduleAppointment.
  // When a time is selected, it handles the new time selection (e.g. by updating the appointment) and then navigates back.
  const handleTimeSelect = (selectedDate: Date, time: string) => {
    alert(
      `Rescheduled appointment ${
        appointment?.id
      } to ${selectedDate.toDateString()} at ${time}`
    );
    // In a real application, you would update the appointment via an API call here.
    navigate("/dashboard"); // Adjust this route as needed.
  };

  if (!appointment) {
    return <div>Loading appointment details...</div>;
  }

  return (
    <div className="container mt-4">
      <h1>Reschedule Appointment</h1>
      <p>
        Rescheduling appointment ID {appointment.id} (currently scheduled on{" "}
        {appointment.date} at {appointment.time})
      </p>
      {/* Render the reusable scheduling UI */}
      <ScheduleAppointment onTimeSelect={handleTimeSelect} />
      <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate("/dashboard")} // Navigate back to the appointment history page.
      >
        Cancel
      </button>
    </div>
  );
};

export default ScheduleAppointmentWrapper;
