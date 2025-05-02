import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, User } from "../context/AuthContext";

const SignUpDoctor: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const newUser: User = {
      id: Date.now(),
      name: `${firstName} ${lastName}`,
      email,
      phone,
    };
    // For doctors, the backend should mark the account as pending approval.
    signup(newUser, password, { role: "doctor", specialty, licenseNumber });
    alert("Doctor sign-up successful! Your account is pending approval.");
    navigate("/doctor/dashboard");
  };

  return (
    <div className="container mt-4">
      <h1>Doctor Sign Up</h1>
      <form onSubmit={handleSubmit}>
        {/* Form fields similar to patient sign-up, plus specialty and license number */}
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">First Name</label>
          <input type="text" id="firstName" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <input type="text" id="lastName" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" id="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone Number</label>
          <input
            type="tel"
            id="phone"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 05558810"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" id="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input type="password" id="confirmPassword" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="specialty" className="form-label">Specialty</label>
          <input type="text" id="specialty" className="form-control" placeholder="e.g., Cardiology" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="licenseNumber" className="form-label">License Number</label>
          <input type="text" id="licenseNumber" className="form-control" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpDoctor;
