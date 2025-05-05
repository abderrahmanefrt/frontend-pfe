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
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Document</th>
              <th>Photo</th>
              <th>Status</th>
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
                <td>{doc.latitude}</td>
                <td>{doc.longitude}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorsList;
