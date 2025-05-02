import React, { useState } from "react";
import DoctorCard from "../components/DoctorCard";
import ScheduleAppointment from "./ScheduleAppointment";
import MapModal from "../components/MapModal"; // new map modal component

interface Availability {
  month: number;
  day: number;
  hour: string;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  location: string;
  coords?: { lat: number; lng: number };
  rating: number;
  availability: Availability[];
  doctorInfo: { label: string; value: string }[];
}

// Dummy doctor data with optional coords for map filtering
const dummyDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Alice Smith",
    specialty: "Cardiology",
    location: "New York",
    coords: { lat: 40.7128, lng: -74.006 },
    rating: 4,
    availability: [
      { month: 12, day: 5, hour: "10:00" },
      { month: 12, day: 5, hour: "14:00" },
      { month: 12, day: 7, hour: "09:00" },
    ],
    doctorInfo: [
      { label: "Specialty", value: "Cardiology" },
      { label: "Location", value: "New York" },
    ],
  },
  {
    id: 2,
    name: "Dr. Bob Johnson",
    specialty: "Dermatology",
    location: "Los Angeles",
    coords: { lat: 34.0522, lng: -118.2437 },
    rating: 5,
    availability: [
      { month: 12, day: 10, hour: "11:00" },
      { month: 12, day: 15, hour: "15:00" },
    ],
    doctorInfo: [
      { label: "Specialty", value: "Dermatology" },
      { label: "Location", value: "Los Angeles" },
    ],
  },
  {
    id: 3,
    name: "Dr. Carol Brown",
    specialty: "Pediatrics",
    location: "Chicago",
    coords: { lat: 41.8781, lng: -87.6298 },
    rating: 3,
    availability: [
      { month: 12, day: 5, hour: "08:00" },
      { month: 12, day: 7, hour: "10:00" },
      { month: 12, day: 7, hour: "12:00" },
    ],
    doctorInfo: [
      { label: "Specialty", value: "Pediatrics" },
      { label: "Location", value: "Chicago" },
    ],
  },
];

// Haversine formula to compute distance (km) between two lat/lng points
function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const R = 6371; // Earth's radius in km
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

const DoctorSearchWithCalendar: React.FC = () => {
  const [specialty, setSpecialty] = useState("");
  const [displayLocation, setDisplayLocation] = useState("");
  const [locationCoords, setLocationCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [filterMonth, setFilterMonth] = useState<number | null>(null);
  const [filterDay, setFilterDay] = useState<number | null>(null);
  const [filterHour, setFilterHour] = useState("");
  const [results, setResults] = useState<Doctor[]>(dummyDoctors);
  const [showMapModal, setShowMapModal] = useState(false);

  const doSearch = (
    spec: string,
    loc: string,
    rating: number,
    m: number | null,
    d: number | null,
    h: string,
    coords: { lat: number; lng: number } | null
  ) => {
    // If map coords provided, filter by proximity (within 10 km)
    if (coords) {
      const nearby = dummyDoctors
        .filter((doc) => doc.coords)
        .map((doc) => ({
          ...doc,
          dist: doc.coords! ? distanceKm(coords, doc.coords!) : Infinity,
        }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 5) // top 5 nearest
        .map(({ dist, ...doc }) => doc);
      setResults(nearby);
      return;
    }

    // Fallback: text-based and availability filtering
    const filtered = dummyDoctors.filter((doc) => {
      const matchSpec = spec
        ? doc.specialty.toLowerCase().includes(spec.toLowerCase())
        : true;
      const matchRating = doc.rating >= rating;
      const matchLocation = loc
        ? doc.location.toLowerCase().includes(loc.toLowerCase())
        : true;
      const matchAvail =
        m && d && h
          ? doc.availability.some(
              (s) => s.month === m && s.day === d && s.hour === h
            )
          : true;
      return matchSpec && matchRating && matchLocation && matchAvail;
    });
    setResults(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(
      specialty,
      displayLocation,
      minRating,
      filterMonth,
      filterDay,
      filterHour,
      locationCoords
    );
  };

  const handleTimeSelect = (date: Date, time: string) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    setFilterMonth(month);
    setFilterDay(day);
    setFilterHour(time);
    doSearch(
      specialty,
      displayLocation,
      minRating,
      month,
      day,
      time,
      locationCoords
    );
  };

  const openMap = () => setShowMapModal(true);
  const handleMapConfirm = (
    coords: { lat: number; lng: number },
    place: string
  ) => {
    setLocationCoords(coords);
    setDisplayLocation(place);
    setShowMapModal(false);
    // immediately search using new coords
    doSearch(
      specialty,
      place,
      minRating,
      filterMonth,
      filterDay,
      filterHour,
      coords
    );
  };

  return (
    <div className="container mt-4">
      <h1>Find a Doctor</h1>
      <form onSubmit={handleSearch} className="mb-4">
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
                🗺️
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
            <button className="btn btn-primary w-100">Search</button>
          </div>
        </div>
      </form>

      <div className="mb-4">
        <h2>Select Date & Time</h2>
        <ScheduleAppointment onTimeSelect={handleTimeSelect} />
      </div>

      {showMapModal && (
        <MapModal
          onConfirm={handleMapConfirm}
          onClose={() => setShowMapModal(false)}
        />
      )}

      <h2>Results</h2>
      <div className="row">
        {results.length > 0 ? (
          results.map((d) => (
            <div key={d.id} className="col-md-4 mb-4">
              <DoctorCard
                doctorId={d.id}
                doctorInfo={d.doctorInfo}
                doctorName={d.name}
                rating={d.rating}
              />
            </div>
          ))
        ) : (
          <p>No doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorSearchWithCalendar;
