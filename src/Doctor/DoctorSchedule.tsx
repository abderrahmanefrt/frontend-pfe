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
        `${import.meta.env.VITE_API_URL}/api/medecin/disponibilites`,
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
        maxPatient: slot.maxPatient,
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
        `${import.meta.env.VITE_API_URL}/api/medecin/disponibilites`,
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
        `${import.meta.env.VITE_API_URL}/api/medecin/disponibilites/${slotId}`,
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

      await fetchSlots();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete slot");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" style={{ color: '#4682B4' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4" style={{ color: '#4682B4' }}>Your Schedule</h2>

      {/* Error Display */}
      {error && (
        <div className="alert border-0 shadow-sm mb-4" style={{ 
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          borderLeft: '4px solid #dc3545'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <span style={{ color: '#dc3545' }}>{error}</span>
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
            />
          </div>
        </div>
      )}

      {/* Add New Slot Form */}
      <div className="card mb-4 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
        <div className="card-header border-0" style={{ 
          backgroundColor: '#4682B4',
          color: 'white',
          borderRadius: '12px 12px 0 0'
        }}>
          <h5 className="mb-0">Add New Time Slot</h5>
        </div>
        <div className="card-body" style={{ backgroundColor: 'white' }}>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label" style={{ color: '#121517' }}>Date</label>
              <input
                type="date"
                className="form-control border-2"
                name="date"
                value={newSlot.date}
                onChange={handleInputChange}
                required
                style={{ borderColor: '#9dbeda' }}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label" style={{ color: '#121517' }}>Start Time</label>
              <input
                type="time"
                className="form-control border-2"
                name="startTime"
                value={newSlot.startTime}
                onChange={handleInputChange}
                required
                style={{ borderColor: '#9dbeda' }}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label" style={{ color: '#121517' }}>End Time</label>
              <input
                type="time"
                className="form-control border-2"
                name="endTime"
                value={newSlot.endTime}
                onChange={handleInputChange}
                required
                style={{ borderColor: '#9dbeda' }}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label" style={{ color: '#121517' }}>Max Patients</label>
              <input
                type="number"
                min="1"
                className="form-control border-2"
                name="maxPatients"
                value={newSlot.maxPatients}
                onChange={handleInputChange}
                style={{ borderColor: '#9dbeda' }}
              />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn w-100 border-0"
                onClick={handleAddSlot}
                style={{ 
                  backgroundColor: '#4682B4',
                  color: 'white',
                  height: '38px'
                }}
              >
                Add Slot
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Time Slots Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
        <div className="card-header border-0" style={{ 
          backgroundColor: 'white',
          borderRadius: '12px 12px 0 0'
        }}>
          <h5 className="mb-0" style={{ color: '#121517' }}>Your Availability</h5>
        </div>
        <div className="card-body p-0" style={{ backgroundColor: 'white', borderRadius: '0 0 12px 12px' }}>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ backgroundColor: '#f5f7f9' }}>
                <tr>
                  <th style={{ color: '#4682B4' }}>Date</th>
                  <th style={{ color: '#4682B4' }}>Start Time</th>
                  <th style={{ color: '#4682B4' }}>End Time</th>
                  <th style={{ color: '#4682B4' }}>Max Patients</th>
                  <th style={{ color: '#4682B4' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.length > 0 ? (
                  slots.map((slot) => (
                    <tr key={slot.id}>
                      <td style={{ color: '#121517' }}>{slot.date}</td>
                      <td style={{ color: '#121517' }}>{slot.startTime}</td>
                      <td style={{ color: '#121517' }}>{slot.endTime}</td>
                      <td style={{ color: '#121517' }}>{slot.maxPatient}</td>
                      <td>
                        <button
                          className="btn btn-sm border-0"
                          onClick={() => handleDeleteSlot(slot.id)}
                          style={{ 
                            backgroundColor: 'rgba(220, 53, 69, 0.1)',
                            color: '#dc3545'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4" style={{ color: '#6c757d' }}>
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