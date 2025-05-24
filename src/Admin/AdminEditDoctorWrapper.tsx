import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileUpdate from "../Doctor/ProfileUpdate";

interface DoctorDetails {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  specialite?: string;
  dateOfBirth?: string;
  licenseNumber?: string;
  biography?: string;
}

// Simulated fetch by ID
const fetchDoctorById = (id: string): Promise<DoctorDetails> => {
  const dummy: DoctorDetails[] = [
    {
      id: "1",
      firstname: "Alice",
      lastname: "Smith",
      email: "alice.smith@example.com",
      phone: "(555) 123-4567",
      specialite: "Cardiology",
      dateOfBirth: "1980-01-01",
      licenseNumber: "LIC123",
      biography: "Experienced cardiologist with 10 years of practice.",
    },
    {
      id: "2",
      firstname: "Bob",
      lastname: "Johnson",
      email: "bob.johnson@example.com",
      phone: "(555) 987-6543",
      specialite: "Dermatology",
      dateOfBirth: "1975-05-15",
      licenseNumber: "LIC456",
      biography: "Board-certified dermatologist focusing on skin health.",
    }
  ];
  return new Promise((resolve, reject) => {
    const found = dummy.find(d => d.id === id);
    if (found) {
      setTimeout(() => resolve(found), 500);
    } else {
      reject(new Error(`Doctor with ID ${id} not found`));
    }
  });
};

const AdminEditDoctorWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<DoctorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      fetchDoctorById(id)
        .then(d => setDoctor(d))
        .catch(err => {
          console.error("Error fetching doctor:", err);
          setError(err.message || "Failed to load doctor data.");
        })
        .finally(() => setLoading(false));
    } else {
      setError("No doctor ID provided.");
      setLoading(false);
    }
  }, [id]);

  const handleUpdate = (updated: DoctorDetails) => {
    console.log("Updated doctor (Admin):", updated);
    alert("Doctor updated (simulated)");
    navigate("/admin/doctors");
  };

  const handleCancel = () => {
    navigate("/admin/doctors");
  };

  if (loading) return <div>Loading doctor data...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!doctor) return <div>Doctor not found or no ID provided.</div>;

  return (
    <ProfileUpdate
      doctor={doctor}
      onUpdate={handleUpdate}
      onCancel={handleCancel}
    />
  );
};

export default AdminEditDoctorWrapper;