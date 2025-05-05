import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("https://pfe-project-2nrq.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.message || "Login failed.");
        return;
      }
  
      const userData = {
        id: data.id,
        role: data.role,  // Assurez-vous que role est présent dans data
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        accessToken: data.accessToken,
        specialite: data.specialite, // La spécialité pour les médecins
        phone: data.phone, // Le téléphone si nécessaire
      };
  
      login(userData);
  
      // Log du rôle pour vérifier
      console.log("Utilisateur connecté avec le rôle :", data.role);
  
      // Redirection selon le rôle
      if (data.role === "admin") {
        navigate("/admin");
      } else if (data.role === "medecin") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/dashboard");
      }
  
    } catch (err) {
      console.error(err);
      alert("Server or network error.");
    }
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
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

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        <div className="mt-3 text-center">
          <small>Don't have an account? <a href="/signup">Sign up</a></small>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
