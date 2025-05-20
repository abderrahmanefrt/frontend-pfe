// DoctorSearchWithCalendar.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";
import ScheduleAppointment from "./ScheduleAppointment";
import MapModal from "../components/MapModal";
import { Spinner, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faArrowLeft, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

interface Availability {
  date: string;
  startTime: string;
  endTime: string;
}

interface Doctor {
  id: number;
  firstname: string;
  lastname: string;
  specialite: string;
  address: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  photo?: string;
  availabilities?: Availability[];
}

const DoctorSearchWithCalendar: React.FC = () => {
  const { getAccessToken } = useAuth();
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState("");
  const [displayLocation, setDisplayLocation] = useState("");
  const [firstname, setFirstname] = useState("");
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [filterTime, setFilterTime] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMapModal, setShowMapModal] = useState(false);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      let baseUrl = "";

      if (locationCoords) {
        baseUrl = `${import.meta.env.VITE_API_URL}/api/medecin/nearMedecin`;
        params.append("latitude", locationCoords.lat.toString());
        params.append("longitude", locationCoords.lng.toString());
        params.append("distance", "15");
      } else if (specialty || firstname || minRating || filterDate) {
        baseUrl = `${import.meta.env.VITE_API_URL}/api/medecin/SearchMedecin`;
        if (specialty) params.append("specialite", specialty);
        if (firstname) params.append("firstname", firstname);
        if (filterDate) params.append("date", filterDate);
        params.append("page", "1");
        params.append("limit", "20");
      } else {
        baseUrl = `${import.meta.env.VITE_API_URL}/api/users/listofdoctors`;
      }

      const finalUrl = `${baseUrl}?${params.toString()}`;
      const token = await getAccessToken();

      const response = await fetch(finalUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "API request failed");
      }

      const data = await response.json();
      console.log("Data reçue depuis l'API:", data);

      const medecins = data.medecins || data || [];

      const doctorsWithAvailabilityAndRating = await Promise.all(
        medecins.map(async (doc: any) => {
          try {
            const availabilityUrl = filterDate
              ? `${import.meta.env.VITE_API_URL}/api/disponibilites/by-date/${doc.id}?date=${filterDate}`
              : null;
      
            const [availData, ratingData] = await Promise.all([
              availabilityUrl
                ? fetch(availabilityUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                  }).then(res => res.json())
                : Promise.resolve([]),
              fetch(`${import.meta.env.VITE_API_URL}/api/avis/rating/${doc.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              }).then(res => res.json()),
            ]);
      
            return {
              ...doc,
              availabilities: availData || [],
              rating: parseFloat(ratingData.averageRating || "0.0"),
            };
          } catch (err) {
            console.warn("Erreur récupération données médecin", doc.id);
            return { ...doc, availabilities: [], rating: 0 };
          }
        })
      );
      
      const filteredByRating = minRating
        ? doctorsWithAvailabilityAndRating.filter((doc) => (doc.rating || 0) >= minRating)
        : doctorsWithAvailabilityAndRating;

      setDoctors(filteredByRating);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des médecins:", error);
      setError(error.message || "Failed to load doctors");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialty, firstname, locationCoords, filterDate, filterTime]);

  const handleTimeSelect = (date: Date, time: string) => {
    const dateStr = date.toISOString().split("T")[0];
    setFilterDate(dateStr);
    setFilterTime(time);
  };

  const clearDateTimeSelection = () => {
    setFilterDate(null);
    setFilterTime(null);
  };

  const openMap = () => setShowMapModal(true);

  const handleMapConfirm = (
    coords: { lat: number; lng: number },
    place: string
  ) => {
    setLocationCoords(coords);
    setDisplayLocation(place);
    setShowMapModal(false);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Find a Doctor</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn"
          style={{
            backgroundColor: 'var(--secondary)',
            color: 'var(--text)',
            border: '1px solid var(--primary)',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: '500'
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Back to Dashboard
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); fetchDoctors(); }} className="mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Specialty</label>
            <input
              type="text"
              className="form-control"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="e.g., Cardiology"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="e.g., Ahmed"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Location</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type a city… or use the map"
                value={displayLocation}
                onChange={(e) => {
                  setDisplayLocation(e.target.value);
                  setLocationCoords(null);
                }}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={openMap}
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </button>
            </div>
          </div>
          <div className="col-md-3">
            <label className="form-label">Minimum Rating</label>
            <select
              className="form-select"
              value={minRating}
              onChange={(e) => setMinRating(+e.target.value)}
            >
              <option value={0}>Any</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} star{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button 
              className="btn w-100" 
              disabled={loading}
              style={{
                backgroundColor: loading ? 'var(--secondary)' : 'var(--primary)',
                color: 'white',
                border: 'none',
                transition: 'background-color 0.2s ease'
              }}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </form>

      <div className="mb-4">
        <div className="d-flex align-items-center mb-2">
          <h2 className="mb-0">Select Date & Time</h2>
          {filterDate && (
            <button 
              onClick={clearDateTimeSelection}
              className="btn btn-sm btn-outline-danger ms-2"
              title="Clear selection"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
        <ScheduleAppointment onTimeSelect={handleTimeSelect} />
      </div>

      {showMapModal && (
        <MapModal
          onConfirm={handleMapConfirm}
          onClose={() => setShowMapModal(false)}
        />
      )}

      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      <h2>Results</h2>
      <div className="row">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div key={doctor.id} className="col-md-4 mb-4">
              <DoctorCard
                doctorId={doctor.id}
                doctorInfo={[
                  { label: "Specialty", value: doctor.specialite },
                  { label: "Address", value: doctor.address },
                ]}
                doctorName={`${doctor.firstname} ${doctor.lastname}`}
                rating={doctor.rating || 0}
                photo={doctor.photo}
              />
            </div>
          ))
        ) : (
          !loading && <p>No doctors found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorSearchWithCalendar;