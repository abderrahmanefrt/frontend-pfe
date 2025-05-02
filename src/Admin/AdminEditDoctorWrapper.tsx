import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileUpdate from "../Doctor/ProfileUpdate";
import { ListGroupItem } from "../components/ListGroup";

interface DoctorDetails {
  id: number;
  name: string;
  image: string;
  specialty: string;
  biography: string;
  contactInfo: string;
  doctorInfo: ListGroupItem[];
}

// Simulated fetch by ID
const fetchDoctorById = (id: number): Promise<DoctorDetails> => {
  const dummy: DoctorDetails[] = [
    {
      id: 1,
      name: "Dr. Alice Smith",
      image: "../assets/images/DoctorAlice.jpg",
      specialty: "Cardiology",
      biography: "Experienced cardiologist with 10 years of practice.",
      contactInfo: "alice.smith@example.com | (555) 123-4567",
      doctorInfo: [
        { label: "Experience", value: "10 years" },
        { label: "Clinic", value: "Heart Care Center" }
      ]
    },
    {
      id: 2,
      name: "Dr. Bob Johnson",
      image: "../assets/images/DoctorBob.jpg",
      specialty: "Dermatology",
      biography: "Board-certified dermatologist focusing on skin health.",
      contactInfo: "bob.johnson@example.com | (555) 987-6543",
      doctorInfo: [
        { label: "Experience", value: "8 years" },
        { label: "Clinic", value: "Skin Wellness Clinic" }
      ]
    }
    // ... more dummy entries as needed
  ];
  return new Promise(resolve => {
    const found = dummy.find(d => d.id === id) || dummy[0];
    setTimeout(() => resolve(found), 500);
  });
};

const AdminEditDoctorWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<DoctorDetails | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchDoctorById(Number(id)).then(d => setDoctor(d));
    }
  }, [id]);

  const handleUpdate = (updated: DoctorDetails) => {
    console.log("Updated doctor:", updated);
    // In real app, send updated to backend here
    navigate("/admin/doctors");
  };

  const handleCancel = () => {
    navigate("/admin/doctors");
  };

  if (!doctor) return <div>Loading doctor data...</div>;

  return (
    <ProfileUpdate
      doctor={doctor}
      onUpdate={handleUpdate}
      onCancel={handleCancel}
    />
  );
};

export default AdminEditDoctorWrapper;