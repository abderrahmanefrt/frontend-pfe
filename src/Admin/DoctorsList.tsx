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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Accepted Doctors</h3>
        <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
          Back to Dashboard
        </button>
      </div>

      {loading && <p>Loading doctors...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Specialty</th>
              <th>License #</th>
              <th>Address</th>
              <th>Doc</th>
              <th>Photo</th>
              <th>Status</th>
              <th>Profile</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doc => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{stripQuotes(doc.firstname)} {stripQuotes(doc.lastname)}</td>
                <td>{stripQuotes(doc.email)}</td>
                <td>{stripQuotes(doc.phone)}</td>
                <td>{stripQuotes(doc.specialite)}</td>
                <td>{stripQuotes(doc.licenseNumber)}</td>
                <td>{doc.address}</td>
                <td>
                  <a 
                    href={`https://pfe-project-2nrq.onrender.com/${doc.document.replace(/\\/g, '/')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </a>
                </td>
                <td>
                  <img 
                    src={`https://pfe-project-2nrq.onrender.com/${doc.photo.replace(/\\/g, '/')}`} 
                    alt="Doctor Photo" 
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                  />
                </td>
                <td>{doc.status}</td>
                <td>
                  <button className="btn btn-info btn-sm" onClick={() => openDoctorProfile(doc.id)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedDoctor && (
        <div className="modal show d-block bg-dark bg-opacity-75" onClick={closeModal}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {stripQuotes(selectedDoctor.firstname)} {stripQuotes(selectedDoctor.lastname)}
                </h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Email:</strong> {stripQuotes(selectedDoctor.email)}</p>
                <p><strong>Phone:</strong> {stripQuotes(selectedDoctor.phone)}</p>
                <p><strong>Specialty:</strong> {stripQuotes(selectedDoctor.specialite)}</p>
                <p><strong>License Number:</strong> {stripQuotes(selectedDoctor.licenseNumber)}</p>
                <p><strong>Address:</strong> {selectedDoctor.address}</p>

                {selectedDoctor.document && (
                  <p><strong>Document:</strong> <a
                    href={`https://pfe-project-2nrq.onrender.com/${selectedDoctor.document.replace(/\\/g, '/')}`}
                    target="_blank" rel="noreferrer"
                  >
                    View PDF
                  </a></p>
                )}

                {selectedDoctor.photo && (
                  <p><strong>Photo:</strong><br />
                    <img
                      src={`https://pfe-project-2nrq.onrender.com/${selectedDoctor.photo.replace(/\\/g, '/')}`}
                      alt="Doctor"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  </p>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsList;
