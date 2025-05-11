import React, { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import ScheduleAppointment from "../Patient/ScheduleAppointment";
import { useAuth } from "../context/AuthContext";

interface CreateAppointmentModalProps {
  doctorId: number;
  doctorName: string;
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;
}

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  doctorId,
  doctorName,
  show,
  onHide,
  onSuccess
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { getAccessToken } = useAuth();

  const handleTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      setError("Please select a date and time");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const token = await getAccessToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          medecinId: doctorId,
          date: selectedDate.toISOString().split("T")[0],
          requestedTime: selectedTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create appointment");
      }

      const data = await response.json();
      console.log("Appointment created:", data);

      if (onSuccess) onSuccess();
      onHide();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Error creating appointment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Schedule Appointment with {doctorName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ScheduleAppointment 
          doctorId={doctorId}
          onTimeSelect={handleTimeSelect}
        />
        
        {selectedDate && selectedTime && (
          <div className="mt-3 p-3 bg-light rounded">
            <h5>Selected Appointment</h5>
            <p>
              <strong>Date:</strong> {selectedDate.toDateString()}<br />
              <strong>Time:</strong> {selectedTime}
            </p>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={!selectedDate || !selectedTime || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="ms-2">Scheduling...</span>
            </>
          ) : (
            "Confirm Appointment"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateAppointmentModal;