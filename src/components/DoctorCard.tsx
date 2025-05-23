import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ListGroup, { ListGroupItem } from "./ListGroup";
import StarRating from "./StarRating";

interface DoctorCardProps {
  doctorInfo: ListGroupItem[];
  doctorId: number;
  doctorName: string;
  photo?: string;
  rating?: number;
  onScheduleClick?: (doctorId: number) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  doctorInfo,
  doctorId,
  doctorName,
  photo,
  rating = 0,
  onScheduleClick
}) => {
  const [imageState, setImageState] = useState({
    url: "",
    loaded: false,
    error: false
  });

  useEffect(() => {
    const loadImage = async () => {
      try {
        const cleanPath = (path: string | undefined): string => {
          if (!path) return "";
          return String(path)
            .trim()
            .replace(/^["'\\\s]+|["'\\\s]+$/g, '')
            .replace(/\\/g, '/')
            .replace(/([^:]\/)\/+/g, '$1');
        };

        const cleanedPath = cleanPath(photo);
        const baseUrl = import.meta.env.VITE_API_URL || 'https://pfe-project-2nrq.onrender.com';
        const defaultImage = '/doctor-placeholder.jpg';

        let finalUrl;
        if (!cleanedPath) {
          finalUrl = defaultImage;
        } else if (cleanedPath.startsWith('http') || cleanedPath.startsWith('/')) {
          finalUrl = cleanedPath;
        } else {
          finalUrl = `${baseUrl}/${cleanedPath}`.replace(/([^:]\/)\/+/g, '$1');
        }

        const img = new Image();
        img.src = finalUrl;

        await new Promise((resolve, reject) => {
          img.onload = () => resolve(true);
          img.onerror = () => reject(new Error('Image load failed'));
        });

        setImageState({
          url: finalUrl,
          loaded: true,
          error: false
        });
      } catch (error) {
        console.error(`Image loading error for doctor ${doctorId}:`, error);
        setImageState({
          url: '/doctor-placeholder.jpg',
          loaded: true,
          error: true
        });
      }
    };

    loadImage();
  }, [photo, doctorId]);

  const handleScheduleClick = () => {
    onScheduleClick?.(doctorId);
  };

  return (
    <div className="card h-100 shadow rounded-lg border-0 doctor-card">
      <div className="position-relative">
        {!imageState.loaded ? (
          <div className="d-flex justify-content-center align-items-center bg-light rounded-top" style={{ height: "200px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="doctor-image-container">
            <img
              src={imageState.url}
              className="card-img-top rounded-top"
              alt={`Dr. ${doctorName}`}
              style={{
                height: "220px",
                objectFit: "cover",
                display: imageState.loaded ? 'block' : 'none'
              }}
              loading="eager"
            />
            <div className="doctor-rating-badge">
              <div className="bg-white shadow-sm rounded-pill px-3 py-1 d-flex align-items-center">
                <StarRating value={rating} readOnly />
                <span className="ms-1 fw-bold">{rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0 fw-bold" style={{ color: 'var(--text)' }}>{doctorName}</h5>
          <span className="badge rounded-pill px-2" style={{ 
            backgroundColor: 'var(--secondary)', 
            color: 'var(--text)',
            border: `1px solid var(--primary)`
          }}>
            <i className="fas fa-user-md me-1"></i>Available
          </span>
        </div>
        
        <div className="mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--secondary)' }}>
          <div className="d-flex align-items-center small" style={{ color: 'var(--text)' }}>
            <i className="fas fa-star-half-alt me-1" style={{ color: 'var(--accent)' }}></i>
            <span>{rating.toFixed(1)} out of 5</span>
            <span className="mx-2">•</span>
            <span>Professional Care</span>
          </div>
        </div>

        <div className="mb-3 flex-grow-1">
          <ListGroup
            items={doctorInfo}
            heading="Doctor Information"
            onSelectItem={(item) => console.log(item)}
          />
        </div>

        <div className="d-grid gap-2">
          <div className="row g-2">
            <div className="col-6">
              <Link 
                to={`/users/doctor/${doctorId}`} 
                className="btn w-100" 
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white'
                }}
              >
                <i className="fas fa-user-md me-2"></i>View Profile
              </Link>
            </div>
            <div className="col-6">
              <Link
                to={`/appointments/${doctorId}`} 
                onClick={handleScheduleClick}
                className="btn w-100" 
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'white'
                }}
              >
                <i className="fas fa-calendar-check me-2"></i>Schedule
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
        .doctor-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          background-color: var(--background);
          color: var(--text);
          border: 1px solid var(--secondary) !important;
        }
        
        .doctor-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
          border-color: var(--primary) !important;
        }
        
        .doctor-image-container {
          position: relative;
        }
        
        .doctor-rating-badge {
          position: absolute;
          bottom: -15px;
          right: 20px;
          z-index: 2;
        }

        .card-img-top {
          border-bottom: 1px solid var(--secondary) !important;
        }

        .btn-primary:hover {
          background-color: var(--primary);
          opacity: 0.9;
        }

        .btn-success:hover {
          background-color: var(--accent);
          opacity: 0.9;
        }
        `}
      </style>
    </div>
  );
};

export default React.memo(DoctorCard, (prevProps, nextProps) => {
  return (
    prevProps.doctorId === nextProps.doctorId &&
    prevProps.photo === nextProps.photo &&
    prevProps.doctorName === nextProps.doctorName &&
    prevProps.rating === nextProps.rating &&
    JSON.stringify(prevProps.doctorInfo) === JSON.stringify(nextProps.doctorInfo)
  );
});