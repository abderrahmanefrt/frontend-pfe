import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

interface TimeSlot {
  id: number;
  date: string;       // Format: "YYYY-MM-DD"
  startTime: string;  // Format: "HH:MM"
  endTime: string;    // Format: "HH:MM"
  maxPatient: number;
}

const DoctorSchedule: React.FC = () => {
  const { user } = useAuth();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSlot, setNewSlot] = useState({
    date: "",
    startTime: "",
    endTime: "",
    maxPatients: 1
  });

  // Fetch existing slots with error handling
  const fetchSlots = async () => {
    try {
      const response = await fetch(
        "https://pfe-project-2nrq.onrender.com/api/medecin/disponibilites",
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to fetch slots: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Utilise les créneaux à venir uniquement
      const formattedSlots = data.a_venir.map((slot: any) => ({
        id: slot.id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        maxPatient: slot.maxPatient, // Assure-toi que ce champ correspond à celui de ta DB
      }));
  
      setSlots(formattedSlots);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (user?.accessToken) {
      fetchSlots();
    }
  }, [user?.accessToken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSlot(prev => ({
      ...prev,
      [name]: name === "maxPatients" ? Math.max(1, parseInt(value) || 1) : value
    }));
  };

  const handleAddSlot = async () => {
    // Validate inputs
    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) {
      setError("All fields are required");
      return;
    }

    if (newSlot.startTime >= newSlot.endTime) {
      setError("End time must be after start time");
      return;
    }

    try {
      const response = await fetch(
        "https://pfe-project-2nrq.onrender.com/api/medecin/disponibilites",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.accessToken}`,
          },
          body: JSON.stringify({
            date: newSlot.date,
            startTime: newSlot.startTime,
            endTime: newSlot.endTime,
            maxPatient: newSlot.maxPatients
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add slot");
      }

      // Refresh the slots after successful addition
      await fetchSlots();
      setNewSlot({
        date: "",
        startTime: "",
        endTime: "",
        maxPatients: 1
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add slot");
    }
  };

  const handleDeleteSlot = async (slotId: number) => {
    if (!window.confirm("Are you sure you want to delete this time slot?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://pfe-project-2nrq.onrender.com/api/medecin/disponibilites/${slotId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete slot");
      }

      // Refresh the slots after successful deletion
      await fetchSlots();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete slot");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Schedule</h2>

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          />
        </div>
      )}

      {/* Add New Slot Form */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Add New Time Slot</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Date (YYYY-MM-DD)</label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={newSlot.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                className="form-control"
                name="startTime"
                value={newSlot.startTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">End Time</label>
              <input
                type="time"
                className="form-control"
                name="endTime"
                value={newSlot.endTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Max Patients</label>
              <input
                type="number"
                min="1"
                className="form-control"
                name="maxPatients"
                value={newSlot.maxPatients}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-primary w-100"
                onClick={handleAddSlot}
              >
                Add Slot
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Time Slots Table */}
      <div className="card">
        <div className="card-header bg-light">
          <h5 className="mb-0">Your Availability</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Max Patients</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.length > 0 ? (
                  slots.map((slot) => (
                    <tr key={slot.id}>
                      <td>{slot.date}</td>
                      <td>{slot.startTime}</td>
                      <td>{slot.endTime}</td>
                      <td>{slot.maxPatient}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteSlot(slot.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-muted">
                      No time slots available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;