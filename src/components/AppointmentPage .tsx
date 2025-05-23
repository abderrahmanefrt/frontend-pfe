import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DoctorAvailabilityPage = () => {
  const { medecinId } = useParams<{ medecinId: string }>();
  const navigate = useNavigate();
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [error, setError] = useState("");
  const { getAccessToken, user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const token = getAccessToken();
      if (!token || !user) {
        navigate("/login");
      }
    }
  }, [medecinId, navigate, getAccessToken, user, loading]);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        if (loading || !user) return;

        const token = getAccessToken();
        if (!token) {
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/disponibilites/${medecinId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch availabilities");

        const data = await response.json();
        setAvailabilities(data.a_venir || []);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      }
    };

    if (medecinId && user && !loading) {
      fetchAvailabilities();
    }
  }, [medecinId, navigate, getAccessToken, user, loading]);

  return (
    <div className="container py-4" style={{ maxWidth: '1200px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ color: 'var(--text)' }}>Doctor Availability</h1>
        <button
          onClick={() => navigate(-1)}
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
          <i className="fas fa-arrow-left me-2"></i> Back
        </button>
      </div>

      {error && (
        <div className="alert alert-danger border-0 shadow-sm mb-4" style={{ 
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          borderLeft: '4px solid var(--accent)',
          color: 'var(--text)',
          borderRadius: '8px'
        }}>
          {error}
        </div>
      )}

      {availabilities.length === 0 ? (
        <p className="text-center" style={{ color: 'var(--text)' }}>No availabilities found.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {availabilities.map((avail) => (
            <div
              key={avail.id}
              className="col"
              onClick={() =>
                navigate(`/book-appointment/${medecinId}/${avail.id}`, {
                  state: {
                    date: avail.date,
                    startTime: avail.startTime,
                    endTime: avail.endTime,
                  },
                })
              }
              style={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              <div className="card h-100 border-0 shadow-sm" style={{ 
                backgroundColor: 'var(--background)',
                borderRadius: '12px'
              }}>
                <div className="card-body">
                  <h5 className="card-title" style={{ color: 'var(--text)' }}>
                    <i className="far fa-calendar-alt me-2"></i>
                    {new Date(avail.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h5>
                  <p className="card-text" style={{ color: 'var(--text)' }}>
                    <i className="far fa-clock me-2"></i>
                    {avail.startTime} - {avail.endTime}
                  </p>
                  <p className="card-text" style={{ color: 'var(--text)' }}>
                    <i className="fas fa-users me-2"></i>
                    Max Patients: {avail.maxPatient || "Not specified"}
                  </p>
                  <p className="text-muted mt-2">
                    <i className="fas fa-mouse-pointer me-2"></i>
                    Click to book
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAvailabilityPage;