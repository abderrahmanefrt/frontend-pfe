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
  biography?: string;
  availabilities: Availability[];
}

interface Availability {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

interface Avis {
  id: number;
  note: number;
  commentaire: string;
  User: {
    firstname: string;
  };
}

// Helper component to wrap icons and potentially fix TS2786 error
const IconWrapper: React.FC<{ icon: any, size?: number, color?: string, className?: string }> = ({ icon: Icon, size, color, className }) => {
  return <Icon size={size} color={color} className={className} />;
};

const DoctorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAccessToken } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [avisList, setAvisList] = useState<Avis[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
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

        const apiUrl = `${import.meta.env.VITE_API_URL}/api/users/doctor/${id}`;
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
      }
    };

    const fetchAvis = async () => {
      try {
        const token = await getAccessToken();
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/avis/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error("Erreur lors du chargement des avis");
        const data = await response.json();
        setAvisList(data.filter((avis: any) => avis.status === "approved"));
      } catch (error: any) {
        console.error(error.message);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
    fetchAvis();
  }, [id, getAccessToken, navigate]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

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
                  {/* Use IconWrapper for FaUserMd */}
                  <IconWrapper icon={FaUserMd} size={60} color="white" />
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
          {doctor.biography && (
  <div className="mt-3">
    <h5 className="text-dark">Biography</h5>
    <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>{doctor.biography}</p>
  </div>
)}


          <hr />

          {/* Contact Info d'abord */}
          <div className="row mt-4">
            <div className="col-md-6">
              <h4 className="text-dark">Contact Information</h4>
              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item>
                  {/* Use IconWrapper for FaEnvelope */}
                  <IconWrapper icon={FaEnvelope} className="me-2" />
                  <span className="text-muted">{doctor.email}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  {/* Use IconWrapper for FaPhone */}
                  <IconWrapper icon={FaPhone} className="me-2" />
                  <span className="text-muted">{doctor.phone}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  {/* Use IconWrapper for FaMapMarkerAlt */}
                  <IconWrapper icon={FaMapMarkerAlt} className="me-2" />
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

            {/* Avis à droite */}
            <div className="col-md-6 mt-4 mt-md-0">
              <h4 className="text-dark mb-3">Patient Reviews</h4>
              {avisList.length === 0 ? (
                <p className="text-muted">No reviews yet.</p>
              ) : (
                <>
                  <ListGroup>
                    {avisList.slice(0, visibleCount).map((avis) => (
                      <ListGroup.Item key={avis.id}>
                        <strong>{avis.User?.firstname || "Anonymous"}</strong> rated{" "}
                        <Badge bg="warning" text="dark">
                          {avis.note}/5
                        </Badge>
                        <p className="mb-1">{avis.commentaire}</p>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  {visibleCount < avisList.length && (
                    <div className="mt-2 text-center">
                      <Button variant="outline-primary" onClick={handleShowMore}>
                        Voir plus d'avis
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={() => navigate('/doctorSearch')}>
              Back to Doctors List
            </Button>
            <Button 
  variant="primary"
  onClick={() => navigate(`/appointments/${doctor.id}`)}
>
  Book an Appointment
</Button>

            <Button
              variant="success"
              onClick={() => navigate(`/doctor/${doctor.id}/review`)}
            >
              Leave a Review
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DoctorProfilePage;