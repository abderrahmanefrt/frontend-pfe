import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, User } from "../context/AuthContext";

const SignUpPatient: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth(); // assume signup is defined for patients

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
const [dateOfBirth, setDateOfBirth] = useState("");
const [address, setAddress] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      const response = await fetch("https://pfe-project-2nrq.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          email,
          phone,
          password,
          gender,
          dateOfBirth,
          address,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Patient sign-up successful!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      alert("Erreur réseau ou serveur.");
    }
  };
  

  return (
    <div className="container mt-4">
      <h1>Patient Sign Up</h1>
      <form onSubmit={handleSubmit}>
        {/* Form fields for first name, last name, email, password, etc. */}
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">First Name</label>
          <input
            type="text"
            id="firstName"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <input
            type="text"
            id="lastName"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
         <label htmlFor="phone" className="form-label">Phone Number</label>
          <input
            type="tel"
            id="phone"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0765497104"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
  <label htmlFor="gender" className="form-label">Gender</label>
  <select
  id="gender"
  className="form-control"
  value={gender}
  onChange={(e) => setGender(e.target.value)}
  required
>
  <option value="">Select Gender</option>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
</select>

</div>

<div className="mb-3">
  <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
  <input
    type="date"
    id="dateOfBirth"
    className="form-control"
    value={dateOfBirth}
    onChange={(e) => setDateOfBirth(e.target.value)}
    required
  />
</div>

<div className="mb-3">
  <label htmlFor="address" className="form-label">Address</label>
  <input
    type="text"
    id="address"
    className="form-control"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    required
  />
</div>

        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPatient;
