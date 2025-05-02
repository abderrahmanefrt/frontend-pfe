import React, { useState } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  medicalHistory: string;
  allergies: string;
  medications: string;
  primaryCarePhysician: string;
  chifaCardNumber: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
}

interface EditPatientProfileProps {
  initialUser: User;
  onUpdate: (updatedUser: User) => void;
  onCancel: () => void;
}

const EditPatientProfile: React.FC<EditPatientProfileProps> = ({
  initialUser,
  onUpdate,
  onCancel,
}) => {
  const [name, setName] = useState(initialUser.name);
  const [email, setEmail] = useState(initialUser.email);
  const [phone, setPhone] = useState(initialUser.phone);
  const [dateOfBirth, setDateOfBirth] = useState(initialUser.dateOfBirth);
  const [gender, setGender] = useState(initialUser.gender);
  const [address, setAddress] = useState(initialUser.address);
  const [medicalHistory, setMedicalHistory] = useState(initialUser.medicalHistory);
  const [allergies, setAllergies] = useState(initialUser.allergies);
  const [medications, setMedications] = useState(initialUser.medications);
  const [primaryCarePhysician, setPrimaryCarePhysician] = useState(initialUser.primaryCarePhysician);
  const [chifaCardNumber, setChifaCardNumber] = useState(initialUser.chifaCardNumber);
  const [emergencyContactName, setEmergencyContactName] = useState(initialUser.emergencyContactName);
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState(initialUser.emergencyContactRelationship);
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(initialUser.emergencyContactPhone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...initialUser,
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      medicalHistory,
      allergies,
      medications,
      primaryCarePhysician,
      chifaCardNumber,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactPhone,
    };
    onUpdate(updatedUser);
  };

  return (
    <div className="container mt-4">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <h4>Personal Information</h4>
        <div className="row">
          <div className="mb-3 col-md-6">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" id="name" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="mb-3 col-md-3">
            <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
            <input type="date" id="dateOfBirth" className="form-control" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required />
          </div>
          <div className="mb-3 col-md-3">
            <label htmlFor="gender" className="form-label">Gender</label>
            <select id="gender" className="form-select" value={gender} onChange={e => setGender(e.target.value)} required>
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Contact Details */}
        <h4>Contact Details</h4>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" id="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input type="tel" id="phone" className="form-control" value={phone} onChange={e => setPhone(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input type="text" id="address" className="form-control" value={address} onChange={e => setAddress(e.target.value)} />
        </div>

        {/* Medical & Insurance */}
        <h4>Medical & Insurance</h4>
        <div className="mb-3">
          <label htmlFor="medicalHistory" className="form-label">Medical History</label>
          <textarea id="medicalHistory" className="form-control" rows={2} value={medicalHistory} onChange={e => setMedicalHistory(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="allergies" className="form-label">Allergies</label>
          <input type="text" id="allergies" className="form-control" value={allergies} onChange={e => setAllergies(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="medications" className="form-label">Medications</label>
          <input type="text" id="medications" className="form-control" value={medications} onChange={e => setMedications(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="primaryCarePhysician" className="form-label">Primary Care Physician</label>
          <input type="text" id="primaryCarePhysician" className="form-control" value={primaryCarePhysician} onChange={e => setPrimaryCarePhysician(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="chifaCardNumber" className="form-label">Chifa Card Number</label>
          <input type="text" id="chifaCardNumber" className="form-control" value={chifaCardNumber} onChange={e => setChifaCardNumber(e.target.value)} />
        </div>

        {/* Emergency Contact */}
        <h4>Emergency Contact</h4>
        <div className="row">
          <div className="mb-3 col-md-4">
            <label htmlFor="emergencyContactName" className="form-label">Name</label>
            <input type="text" id="emergencyContactName" className="form-control" value={emergencyContactName} onChange={e => setEmergencyContactName(e.target.value)} />
          </div>
          <div className="mb-3 col-md-4">
            <label htmlFor="emergencyContactRelationship" className="form-label">Relationship</label>
            <input type="text" id="emergencyContactRelationship" className="form-control" value={emergencyContactRelationship} onChange={e => setEmergencyContactRelationship(e.target.value)} />
          </div>
          <div className="mb-3 col-md-4">
            <label htmlFor="emergencyContactPhone" className="form-label">Contact Number</label>
            <input type="tel" id="emergencyContactPhone" className="form-control" value={emergencyContactPhone} onChange={e => setEmergencyContactPhone(e.target.value)} />
          </div>
        </div>

        <button type="submit" className="btn btn-success me-2">Save Changes</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditPatientProfile;