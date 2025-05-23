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
import Calendar from "react-calendar";
import CreateAppointmentModal from "../components/CreateAppointmentModal";

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
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

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
      } else {
        baseUrl = `${import.meta.env.VITE_API_URL}/api/medecin/SearchMedecin`;
        if (specialty) params.append("specialite", specialty);
        if (firstname) params.append("firstname", firstname);
        if (filterDate) {
          const date = new Date(filterDate);
          const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          console.log("Date formatée pour l'API:", formattedDate);
          params.append("date", formattedDate);
        }
        if (minRating > 0) params.append("minRating", minRating.toString());
        params.append("page", "1");
        params.append("limit", "20");
      }

      const finalUrl = `${baseUrl}?${params.toString()}`;
      console.log("URL de la requête:", finalUrl);
      const token = await getAccessToken();

      const response = await fetch(finalUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur API:", errorData);
        throw new Error(errorData.message || "API request failed");
      }

      const data = await response.json();
      console.log("Réponse complète de l'API:", data);

      const medecins = data.medecins || data || [];
      console.log("Médecins trouvés:", medecins.length);

      const doctorsWithAvailabilityAndRating = await Promise.all(
        medecins.map(async (doc: any) => {
          try {
            // Récupérer les disponibilités pour la date sélectionnée
            let availabilityUrl = null;
            if (filterDate) {
              const date = new Date(filterDate);
              const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
              availabilityUrl = `${import.meta.env.VITE_API_URL}/api/disponibilites/${doc.id}`;
            }

            console.log("URL des disponibilités:", availabilityUrl);
      
            const [availData, ratingData] = await Promise.all([
              availabilityUrl
                ? fetch(availabilityUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                  }).then(async (res) => {
                    if (!res.ok) {
                      console.warn(`Erreur lors de la récupération des disponibilités pour le médecin ${doc.id}:`, res.status);
                      return [];
                    }
                    const data = await res.json();
                    // Filtrer les disponibilités pour la date sélectionnée
                    return (data.a_venir || []).filter((avail: Availability) => 
                      avail.date === filterDate
                    );
                  })
                : Promise.resolve([]),
              fetch(`${import.meta.env.VITE_API_URL}/api/avis/rating/${doc.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              }).then(res => res.json()),
            ]);

            console.log("Disponibilités pour le médecin", doc.id, ":", availData);
      
            return {
              ...doc,
              availabilities: availData || [],
              rating: parseFloat(ratingData.averageRating || "0.0"),
            };
          } catch (err) {
            console.warn("Erreur récupération données médecin", doc.id, err);
            return { ...doc, availabilities: [], rating: 0 };
          }
        })
      );
      
      // Filtrer les médecins qui ont des disponibilités pour la date sélectionnée
      const filteredDoctors = filterDate
        ? doctorsWithAvailabilityAndRating.filter(doc => doc.availabilities && doc.availabilities.length > 0)
        : doctorsWithAvailabilityAndRating;

      console.log("Médecins filtrés avec disponibilités:", filteredDoctors.length);

      // Filtrer par note si nécessaire
      const filteredByRating = minRating
        ? filteredDoctors.filter((doc) => (doc.rating || 0) >= minRating)
        : filteredDoctors;

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

  const handleTimeSelect = (date: Date | null, time: string) => {
    if (!date) return;
    console.log("Date sélectionnée:", date);
    console.log("Heure sélectionnée:", time);
    // Format the date as YYYY-MM-DD
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setFilterDate(formattedDate);
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
    <div className="container-fluid px-3 px-md-4 py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
            <h1 className="h2 mb-3 mb-md-0">Find a Doctor</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn"
          style={{
            backgroundColor: 'var(--secondary)',
            color: 'var(--text)',
            border: '1px solid var(--primary)',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.375rem',
                fontWeight: '500',
                whiteSpace: 'nowrap'
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Back to Dashboard
        </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
      <form onSubmit={(e) => { e.preventDefault(); fetchDoctors(); }} className="mb-4">
        <div className="row g-3">
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <label className="form-label">Specialty</label>
            <input
              type="text"
              className="form-control"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="e.g., Cardiology"
            />
          </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="e.g., Ahmed"
            />
          </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
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
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
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
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <button 
              className="btn w-100" 
              disabled={loading}
              style={{
                backgroundColor: loading ? 'var(--secondary)' : 'var(--primary)',
                color: 'white',
                border: 'none',
                    transition: 'background-color 0.2s ease',
                    marginTop: '2rem'
              }}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </form>

      <div className="mb-4">
        <div className="d-flex align-items-center mb-2">
          <h2 className="h3 mb-0">Select Date & Time</h2>
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
        <div className="calendar-container mx-auto" style={{ maxWidth: 990, width: '100%', overflow: 'hidden' }}>
          <Calendar
            onChange={(value) => {
              if (!value) return;
              if (Array.isArray(value)) {
                handleTimeSelect(value[0], "");
              } else {
                handleTimeSelect(value, "");
              }
            }}
            value={filterDate ? new Date(filterDate) : null}
            minDate={new Date()}
            className="w-100"
          />
        </div>
      </div>

      <h2 className="h3 mb-3">Results</h2>
      <div className="row g-3">
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
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div key={doctor.id} className="col-12 col-md-4 col-lg-3">
              <DoctorCard
                doctorId={doctor.id}
                doctorInfo={[
                  { label: "Specialty", value: doctor.specialite },
                  { label: "Address", value: doctor.address },
                ]}
                doctorName={`${doctor.firstname} ${doctor.lastname}`}
                rating={doctor.rating || 0}
                photo={doctor.photo}
                onScheduleClick={() => setSelectedDoctor(doctor)}
              />
            </div>
          ))
        ) : (
          !loading && <p>No doctors found matching your criteria.</p>
        )}
      </div>
      </div>
      </div>

      {showMapModal && (
        <MapModal
          onConfirm={handleMapConfirm}
          onClose={() => setShowMapModal(false)}
        />
      )}

      {selectedDoctor && (
        <CreateAppointmentModal
          doctorId={selectedDoctor.id}
          doctorName={`${selectedDoctor.firstname} ${selectedDoctor.lastname}`}
          show={!!selectedDoctor}
          onHide={() => setSelectedDoctor(null)}
        />
      )}
    </div>
  );
};

export default DoctorSearchWithCalendar;