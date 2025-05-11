import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup, Spinner, Alert, Badge, Button } from 'react-bootstrap';
import StarRating from '../components/StarRating';
import { Image } from 'react-bootstrap';


interface DoctorProfileData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  specialite: string;
  dateOfBirth: string;
  licenseNumber: string;
  photo: string;
  address: string;
  latitude: number;
  longitude: number;
  averageRating: number;
  Avis: Array<{
    id: number;
    comment: string;
    rating: number;
    User: {
      firstname: string;
      lastname: string;
    };
  }>;
  Availabilities: Array<{
    id: number;
    date: string;
    startTime: string;
    endTime: string;
  }>;
}



const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<DoctorProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/doctor/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Doctor not found');
        }
        
        const data = await response.json();
        // Nettoyer les guillemets supplémentaires dans les chaînes
        const cleanedData = {
          ...data,
          firstname: data.firstname.replace(/^"+|"+$/g, ''),
          lastname: data.lastname.replace(/^"+|"+$/g, ''),
          email: data.email.replace(/^"+|"+$/g, ''),
          phone: data.phone.replace(/^"+|"+$/g, ''),
          specialite: data.specialite.replace(/^"+|"+$/g, ''),
          address: data.address.replace(/^"+|"+$/g, ''),
          licenseNumber: data.licenseNumber.replace(/^"+|"+$/g, '')
        };
        setDoctor(cleanedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load doctor profile');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto my-5" />;
  }

  if (error) {
    return <Alert variant="danger" className="my-5">{error}</Alert>;
  }

  if (!doctor) {
    return <Alert variant="warning" className="my-5">Doctor not found</Alert>;
  }

  return (
    <div className="container my-5">
      <Card className="shadow">
        <Card.Body>
          <div className="d-flex flex-column flex-md-row align-items-center mb-4">
            <div className="me-md-4 mb-3 mb-md-0">
              {doctor.photo ? (
                <Image 
                  src={`${import.meta.env.VITE_API_URL}/${doctor.photo.replace(/\\/g, '/')}`}
                  roundedCircle
                  width={150}
                  height={150}
                  className="object-fit-cover"
                  alt={`${doctor.firstname} ${doctor.lastname}`}
                />
              ) : (
                <div 
                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" 
                  style={{ width: '150px', height: '150px' }}
                >
                  <span className="text-white fs-1">
                    {doctor.firstname.charAt(0)}{doctor.lastname.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="text-center text-md-start">
              <h1 className="mb-2">Dr. {doctor.firstname} {doctor.lastname}</h1>
              <h4 className="text-muted mb-3">{doctor.specialite}</h4>
              <p className="text-muted mb-1">License: {doctor.licenseNumber}</p>
            </div>
          </div>

          <hr />

          <div className="row mt-4">
            <div className="col-md-6">
              <h3 className="mb-3">Contact Information</h3>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <i className="bi bi-envelope me-2"></i>
                  {doctor.email}
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-telephone me-2"></i>
                  {doctor.phone}
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-geo-alt me-2"></i>
                  {doctor.address}
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-calendar me-2"></i>
                  Born on {new Date(doctor.dateOfBirth).toLocaleDateString()}
                </ListGroup.Item>
              </ListGroup>
            </div>

            <div className="col-md-6 mt-4 mt-md-0">
              <h3 className="mb-3">Location</h3>
              <div className="ratio ratio-16x9">
                <iframe
                  title="Doctor's location"
                  src={`https://maps.google.com/maps?q=${doctor.latitude},${doctor.longitude}&z=15&output=embed`}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <Button 
              variant="primary"
              onClick={() => {
                // Navigation vers la prise de rendez-vous
              }}
            >
              Book Appointment
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DoctorProfile;

