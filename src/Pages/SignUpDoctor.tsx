import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpDoctor: React.FC = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const formData = new FormData();
    formData.append("firstname", firstName);
    formData.append("lastname", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("specialite", specialty);
    formData.append("licenseNumber", licenseNumber);
    formData.append("address", address);
    formData.append("dateOfBirth", dateOfBirth);
    if (photo) formData.append("photo", photo);
    if (document) formData.append("document", document);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/medecin/register`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Doctor registered successfully! Awaiting approval.");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network or server error.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Doctor Sign Up</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Specialty</label>
          <input type="text" className="form-control" value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="e.g., Cardiology" required />
        </div>
        <div className="mb-3">
          <label className="form-label">License Number</label>
          <input type="text" className="form-control" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input type="date" className="form-control" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Photo</label>
          <input type="file" className="form-control" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Document (PDF)</label>
          <input type="file" className="form-control" accept="application/pdf" onChange={(e) => setDocument(e.target.files?.[0] || null)} required />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpDoctor;
