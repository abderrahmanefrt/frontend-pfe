import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, User } from "../context/AuthContext";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === "" || email.trim() === "" || password.trim() === "")
      return;
    console.log("Logging in with:", { username, email });

    // Create a dummy user object using the provided username and email
    const dummyUser: User = {
      id: 1, // In a real application, the backend provides the ID
      name: username,
      email: email,
      phone: "555-555-5555", // You could also allow the user to enter this separately
    };

    // In a real app, you would authenticate the email and password via an API call
    login(dummyUser);
    navigate("/admin"); //  /doctor/dashboard   /admin   /dashboard        grid
  };

  return (
    <div className="container mt-4">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        {/* Username Field */}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {/* Email Field */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {/* Password Field */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Log In
        </button>
      </form>
      <div className="mt-3">
        <p>
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary">
            Sign Up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
