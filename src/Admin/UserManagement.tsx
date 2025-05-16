import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Patient {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  status: string;
  address: string | null;
}

const PatientsList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { user } = useAuth();

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      const data = await res.json();
      setPatients(data);
    } catch (error) {
      console.error('Failed to fetch patients');
    }
  };

  const fetchPatientById = async (id: number) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      const data = await res.json();
      setSelectedPatient(data);
    } catch (error) {
      console.error('Failed to fetch patient details');
    }
  };

  const handleBlock = async (id: number) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}/block`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      fetchPatients();
      setSelectedPatient(null);
    } catch (err) {
      alert('Failed to block patient');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      fetchPatients();
      setSelectedPatient(null);
    } catch (err) {
      alert('Failed to delete patient');
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [user]);

  return (
    <div className="container mt-4">
      <h3>Patients List</h3>
      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.firstname} {patient.lastname}</td>
              <td>{patient.email}</td>
              <td>{patient.status}</td>
              <td>
                <button className="btn btn-info btn-sm me-2" onClick={() => fetchPatientById(patient.id)}>
                  View
                </button>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleBlock(patient.id)}>
                  Block
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(patient.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPatient && (
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">
              {selectedPatient.firstname} {selectedPatient.lastname}
            </h5>
            <p><strong>Email:</strong> {selectedPatient.email}</p>
            <p><strong>Phone:</strong> {selectedPatient.phone}</p>
            <p><strong>Gender:</strong> {selectedPatient.gender}</p>
            <p><strong>Date of Birth:</strong> {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {selectedPatient.status}</p>
            <p><strong>Address:</strong> {selectedPatient.address || 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsList;
