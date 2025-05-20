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
  biography: string;
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
        const cleanedData = {
          ...data,
          firstname: data.firstname.replace(/^"+|"+$/g, ''),
          lastname: data.lastname.replace(/^"+|"+$/g, ''),
          email: data.email.replace(/^"+|"+$/g, ''),
          phone: data.phone.replace(/^"+|"+$/g, ''),
          specialite: data.specialite.replace(/^"+|"+$/g, ''),
          address: data.address.replace(/^"+|"+$/g, ''),
          licenseNumber: data.licenseNumber.replace(/^"+|"+$/g, ''),
          biography: (data.biography ?? '').replace(/^"+|"+$/g, '')

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
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" style={{ color: '#4682B4' }} />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-5 border-0 shadow-sm" style={{ 
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        borderLeft: '4px solid #dc3545',
        color: '#dc3545'
      }}>
        {error}
      </Alert>
    );
  }

  if (!doctor) {
    return (
      <Alert variant="warning" className="my-5 border-0 shadow-sm" style={{ 
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        borderLeft: '4px solid #ffc107',
        color: '#856404'
      }}>
        Doctor not found
      </Alert>
    );
  }

  return (
    <div className="container my-5">
      <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
        <Card.Body style={{ backgroundColor: 'white' }}>
          <div className="d-flex flex-column flex-md-row align-items-center mb-4">
            <div className="me-md-4 mb-3 mb-md-0">
              {doctor.photo ? (
                <Image 
                  src={`${import.meta.env.VITE_API_URL}/${doctor.photo.replace(/\\/g, '/')}`}
                  roundedCircle
                  width={150}
                  height={150}
                  className="object-fit-cover border"
                  style={{ borderColor: '#9dbeda' }}
                  alt={`${doctor.firstname} ${doctor.lastname}`}
                />
              ) : (
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center" 
                  style={{ 
                    width: '150px', 
                    height: '150px',
                    backgroundColor: '#4682B4'
                  }}
                >
                  <span className="text-white fs-1">
                    {doctor.firstname.charAt(0)}{doctor.lastname.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="text-center text-md-start">
              <h1 className="mb-2" style={{ color: '#121517' }}>
                Dr. {doctor.firstname} {doctor.lastname}
              </h1>
              <h4 className="mb-3" style={{ color: '#4682B4' }}>{doctor.specialite}</h4>
              <p className="mb-1" style={{ color: '#6c757d' }}>
                License: {doctor.licenseNumber}
              </p>
              {doctor.averageRating && (
                <div className="mt-2">
                  <StarRating rating={doctor.averageRating} />
                </div>
              )}
            </div>
          </div>

          <hr style={{ borderColor: '#e9ecef' }} />

          <div className="row mt-4">
            <div className="col-md-6">
              <h3 className="mb-3" style={{ color: '#4682B4' }}>Contact Information</h3>
              <ListGroup variant="flush">
                <ListGroup.Item style={{ 
                  backgroundColor: 'transparent',
                  borderColor: '#e9ecef'
                }}>
                  <i className="bi bi-envelope me-2" style={{ color: '#4682B4' }}></i>
                  <span style={{ color: '#121517' }}>{doctor.email}</span>
                </ListGroup.Item>
                <ListGroup.Item style={{ 
                  backgroundColor: 'transparent',
                  borderColor: '#e9ecef'
                }}>
                  
                  <i className="bi bi-telephone me-2" style={{ color: '#4682B4' }}></i>
                  <span style={{ color: '#121517' }}>{doctor.phone}</span>
                </ListGroup.Item>
                <ListGroup.Item style={{ 
                  backgroundColor: 'transparent',
                  borderColor: '#e9ecef'
                }}>
                  <i className="bi bi-geo-alt me-2" style={{ color: '#4682B4' }}></i>
                  <span style={{ color: '#121517' }}>{doctor.address}</span>
                </ListGroup.Item>
                <ListGroup.Item style={{ 
                  backgroundColor: 'transparent',
                  borderColor: '#e9ecef'
                }}>
                  <i className="bi bi-calendar me-2" style={{ color: '#4682B4' }}></i>
                  <span style={{ color: '#121517' }}>
                    Born on {new Date(doctor.dateOfBirth).toLocaleDateString()}
                  </span>
                </ListGroup.Item>
              </ListGroup>
            </div>

            <div className="col-md-6 mt-4 mt-md-0">
              <h3 className="mb-3" style={{ color: '#4682B4' }}>Location</h3>
              <div className="ratio ratio-16x9 border" style={{ 
                borderRadius: '8px',
                borderColor: '#9dbeda'
              }}>
                <iframe
                  title="Doctor's location"
                  src={`https://maps.google.com/maps?q=${doctor.latitude},${doctor.longitude}&z=15&output=embed`}
                  allowFullScreen
                  style={{ borderRadius: '8px' }}
                ></iframe>
              </div>
            </div>
            <div className="mt-4">
  <h3 className="mb-3" style={{ color: '#4682B4' }}>Biography</h3>
  <p style={{ color: '#121517', whiteSpace: 'pre-line' }}>
    {doctor.biography?.trim() || 'No biography available.'}
  </p>
</div>

          </div>
          <hr style={{ borderColor: '#e9ecef' }} />




          <div className="d-flex justify-content-end mt-4">
            <Button 
              className="border-0"
              style={{ 
                backgroundColor: '#4682B4',
                color: 'white',
                padding: '10px 24px'
              }}
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