import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Alert, Card, Button, ListGroup, Badge } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserMd } from "react-icons/fa";

interface Doctor {
  id: number;
  firstname: string;
  lastname: string;
  specialite: string;
  address: string;
  phone: string;
  email: string;
  licenseNumber: string;
  dateOfBirth: string;
  photo?: string;
  availabilities: Availability[];
}

interface Availability {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

const DoctorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAccessToken } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token = await getAccessToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const apiUrl = `https://pfe-project-2nrq.onrender.com/api/users/doctor/${id}`;
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          navigate('/login');
          return;
        }

        if (response.status === 404) {
          throw new Error(`Doctor with ID ${id} not found`);
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to load doctor profile");
        }

        const data = await response.json();
        setDoctor(data);
      } catch (error: any) {
        setError(error.message || "Error fetching doctor profile");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorProfile();
  }, [id, getAccessToken, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">
          {error}
          <div className="mt-3">
            <Button variant="primary" onClick={() => navigate('/doctors')}>
              Back to Doctors List
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (!doctor) {
    return null;
  }

  return (
    <div className="container mt-4">
      <Card className="shadow-lg mb-4">
        <Card.Body>
          <div className="d-flex flex-column flex-md-row align-items-center mb-4">
            <div className="me-md-4 mb-3 mb-md-0">
              {doctor.photo ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}/${doctor.photo.replace(/\\/g, '/')}`}
                  alt={`${doctor.firstname} ${doctor.lastname}`}
                  className="rounded-circle border border-primary shadow-sm"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                  style={{ width: "150px", height: "150px" }}
                >
                  <FaUserMd size={60} color="white" />
                </div>
              )}
            </div>
            <div className="text-center text-md-start">
              <h1 className="mb-2 text-dark">
                Dr. {doctor.firstname} {doctor.lastname}
              </h1>
              <h4 className="text-dark mb-2">{doctor.specialite}</h4>
              <Badge bg="info" className="mb-3">License: {doctor.licenseNumber}</Badge>
            </div>
          </div>

          <hr />

          <div className="row mt-4">
            <div className="col-md-6">
              <h4 className="text-dark">Contact Information</h4>
              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item>
                  <FaEnvelope className="me-2" />
                  <span className="text-muted">{doctor.email}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaPhone className="me-2" />
                  <span className="text-muted">{doctor.phone}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaMapMarkerAlt className="me-2" />
                  <span className="text-muted">{doctor.address}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Date of Birth:</strong> 
                  <span className="text-muted">
                    {new Date(doctor.dateOfBirth).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </span>
                </ListGroup.Item>
              </ListGroup>
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate('/doctorSearch')}>
              Back to Doctors List
            </Button>
            <Button variant="primary">
              Book an Appointment
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DoctorProfilePage;
