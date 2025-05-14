import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Doctor {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  specialite: string;
  licenseNumber: string;
  document: string;
  photo: string;
  status: string;
  address: string;
  latitude: number;
  longitude: number;
}

const DoctorsList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('https://pfe-project-2nrq.onrender.com/api/admin/medecins', {
          headers: {
            'Authorization': `Bearer ${user?.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch doctors');
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError('Failed to load doctors list');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [user]);

  const stripQuotes = (str: string) => str?.replace(/^"(.*)"$/, '$1');

  const openDoctorProfile = async (id: number) => {
    try {
      const response = await fetch(`https://pfe-project-2nrq.onrender.com/api/admin/medecins/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch doctor details");
      const data = await response.json();
      setSelectedDoctor(data);
    } catch (err) {
      alert("Unable to load profile");
    }
  };

  const closeModal = () => setSelectedDoctor(null);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return <span className="badge bg-success">Accepted</span>;
      case 'pending':
        return <span className="badge bg-warning text-dark">Pending</span>;
      case 'rejected':
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <div className="card shadow">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h3 className="m-0 font-weight-bold text-primary">
                <i className="fas fa-user-md me-2"></i>
                Accepted Doctors
              </h3>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/admin')}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Dashboard
              </button>
            </div>
            <div className="card-body">
              {loading && (
                <div className="d-flex justify-content-center my-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {!loading && !error && (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="text-center">#</th>
                        <th scope="col">Doctor Name</th>
                        <th scope="col">Contact Information</th>
                        <th scope="col">Specialty</th>
                        <th scope="col">License #</th>
                        <th scope="col">Address</th>
                        <th scope="col" className="text-center">Status</th>
                        <th scope="col" className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map(doc => (
                        <tr key={doc.id}>
                          <td className="text-center align-middle">{doc.id}</td>
                          <td className="align-middle">
                            <div className="d-flex align-items-center">
                              <img 
                                src={`https://pfe-project-2nrq.onrender.com/${doc.photo.replace(/\\/g, '/')}`} 
                                alt="Doctor" 
                                className="rounded-circle me-2"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                              />
                              <div>
                                <strong>{stripQuotes(doc.firstname)} {stripQuotes(doc.lastname)}</strong>
                              </div>
                            </div>
                          </td>
                          <td className="align-middle">
                            <div><i className="fas fa-envelope me-1 text-muted"></i> {stripQuotes(doc.email)}</div>
                            <div><i className="fas fa-phone me-1 text-muted"></i> {stripQuotes(doc.phone)}</div>
                          </td>
                          <td className="align-middle">{stripQuotes(doc.specialite)}</td>
                          <td className="align-middle">{stripQuotes(doc.licenseNumber)}</td>
                          <td className="align-middle">
                            <small>{doc.address}</small>
                          </td>
                        
                          <td className="text-center align-middle">
                            {getStatusBadge(doc.status)}
                          </td>
                          <td className="text-center align-middle">
                            <div className="btn-group" role="group">
                              <button 
                                className="btn btn-info btn-sm" 
                                onClick={() => openDoctorProfile(doc.id)}
                                data-bs-toggle="tooltip"
                                title="View Profile"
                              >
                                <i className="fas fa-user me-1"></i> View
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => navigate(`/admin/avis/${doc.id}`)}
                                data-bs-toggle="tooltip"
                                title="Manage Comments"
                              >
                                <i className="fas fa-comments me-1"></i> Comments
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {!loading && !error && doctors.length === 0 && (
                <div className="alert alert-info text-center my-4" role="alert">
                  <i className="fas fa-info-circle me-2"></i>
                  No doctors found in the system.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedDoctor && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={closeModal}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title">
                  <i className="fas fa-user-md me-2"></i>
                  Dr. {stripQuotes(selectedDoctor.firstname)} {stripQuotes(selectedDoctor.lastname)}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 text-center mb-3">
                    {selectedDoctor.photo && (
                      <img
                        src={`https://pfe-project-2nrq.onrender.com/${selectedDoctor.photo.replace(/\\/g, '/')}`}
                        alt="Doctor"
                        className="img-fluid rounded-circle mb-3"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                      />
                    )}
                    <div className="mt-2">
                      <span className={`badge ${selectedDoctor.status === 'Accepted' ? 'bg-success' : 'bg-secondary'} fs-6`}>
                        {selectedDoctor.status}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="card mb-3">
                      <div className="card-header bg-light">
                        <strong><i className="fas fa-info-circle me-2"></i>Personal Information</strong>
                      </div>
                      <div className="card-body">
                        <div className="row mb-2">
                          <div className="col-md-4 text-muted">Email:</div>
                          <div className="col-md-8">{stripQuotes(selectedDoctor.email)}</div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-md-4 text-muted">Phone:</div>
                          <div className="col-md-8">{stripQuotes(selectedDoctor.phone)}</div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-md-4 text-muted">Specialty:</div>
                          <div className="col-md-8">{stripQuotes(selectedDoctor.specialite)}</div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-md-4 text-muted">License Number:</div>
                          <div className="col-md-8">{stripQuotes(selectedDoctor.licenseNumber)}</div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-md-4 text-muted">Address:</div>
                          <div className="col-md-8">{selectedDoctor.address}</div>
                        </div>
                      </div>
                    </div>
                    
                    {selectedDoctor.document && (
                      <div className="card">
                        <div className="card-header bg-light">
                          <strong><i className="fas fa-file-alt me-2"></i>Documentation</strong>
                        </div>
                        <div className="card-body">
                          <a
                            href={`https://pfe-project-2nrq.onrender.com/${selectedDoctor.document.replace(/\\/g, '/')}`}
                            target="_blank" 
                            rel="noreferrer"
                            className="btn btn-outline-primary"
                          >
                            <i className="fas fa-file-pdf me-2"></i>
                            View License Document
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate(`/admin/avis/${selectedDoctor.id}`)}
                >
                  <i className="fas fa-comments me-2"></i>
                  Manage Comments
                </button>
                <button className="btn btn-secondary" onClick={closeModal}>
                  <i className="fas fa-times me-2"></i>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsList;