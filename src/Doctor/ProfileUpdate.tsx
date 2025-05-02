import React, { useState } from "react";
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

interface ProfileUpdateProps {
  doctor: DoctorDetails;
  onUpdate: (updatedDoctor: DoctorDetails) => void;
  onCancel: () => void;
}

const ProfileUpdate: React.FC<ProfileUpdateProps> = ({ doctor, onUpdate, onCancel }) => {
  const [name, setName] = useState(doctor.name);
  const [specialty, setSpecialty] = useState(doctor.specialty);
  const [biography, setBiography] = useState(doctor.biography);
  const [contactInfo, setContactInfo] = useState(doctor.contactInfo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create updated doctor details object
    const updatedDoctor: DoctorDetails = {
      ...doctor,
      name,
      specialty,
      biography,
      contactInfo,
    };
    // In a real app, you might send this updatedDoctor to the backend here.
    onUpdate(updatedDoctor);
  };

  return (
    <div className="container mt-4">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input 
            type="text" 
            id="name" 
            className="form-control" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="specialty" className="form-label">Specialty</label>
          <input 
            type="text" 
            id="specialty" 
            className="form-control" 
            value={specialty} 
            onChange={(e) => setSpecialty(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="biography" className="form-label">Biography</label>
          <textarea 
            id="biography" 
            className="form-control" 
            value={biography} 
            onChange={(e) => setBiography(e.target.value)} 
            rows={4} 
            required 
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="contactInfo" className="form-label">Contact Information</label>
          <input 
            type="text" 
            id="contactInfo" 
            className="form-control" 
            value={contactInfo} 
            onChange={(e) => setContactInfo(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-success me-2">Save Changes</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
