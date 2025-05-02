import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Doctor {
  id: number;
  name: string;
  email: string;
  specialty: string;
  status: "pending" | "approved" | "rejected";
}

const DoctorManagement: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Simulate fetching doctor profiles from an API
  useEffect(() => {
    const dummyDoctors: Doctor[] = [
      { id: 1, name: "Dr. Alice Smith", email: "alice@example.com", specialty: "Cardiology", status: "pending" },
      { id: 2, name: "Dr. Bob Johnson", email: "bob@example.com", specialty: "Dermatology", status: "approved" },
      { id: 3, name: "Dr. Carol Lee", email: "carol@example.com", specialty: "Pediatrics", status: "pending" },
    ];

    // Simulate an API call delay
    setTimeout(() => {
      setDoctors(dummyDoctors);
      setLoading(false);
    }, 1000);
  }, []);

  // Approve a doctor profile by setting its status to "approved"
  const handleApprove = (id: number) => {
    setDoctors(prevDoctors =>
      prevDoctors.map(doctor =>
        doctor.id === id ? { ...doctor, status: "approved" } : doctor
      )
    );
    alert(`Doctor with id ${id} approved.`);
  };

  // Reject a doctor profile by setting its status to "rejected"
  const handleReject = (id: number) => {
    setDoctors(prevDoctors =>
      prevDoctors.map(doctor =>
        doctor.id === id ? { ...doctor, status: "rejected" } : doctor
      )
    );
    alert(`Doctor with id ${id} rejected.`);
  };
   
  
  // Placeholder function for updating doctor details.
  // In a real app, you might navigate to an update form or open a modal.
  const handleUpdate = (id: number) => {
    alert(`Update details for doctor with id ${id}.`);
    // navigate to admin doctor-edit page
    navigate(`/admin/edit-doctor/${id}`);
  };
  
  if (loading) return <p>Loading doctor profiles...</p>;

  return (
    <div className="container mt-4">
      <h2>Doctor Management</h2>
      <table className="table">
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Specialty</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {doctors.map(doc => (
            <tr key={doc.id}>
              <td>{doc.id}</td>
              <td>{doc.name}</td>
              <td>{doc.email}</td>
              <td>{doc.specialty}</td>
              <td>{doc.status}</td>
              <td>
                {doc.status === "pending" && (
                  <>  
                    <button className="btn btn-success btn-sm me-2" onClick={() => handleApprove(doc.id)}>Approve</button>
                    <button className="btn btn-danger btn-sm me-2" onClick={() => handleReject(doc.id)}>Reject</button>
                  </>
                )}
                <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(doc.id)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorManagement;
