import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ChangePassword: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/medecin/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password.");
      }

      setMessage("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--text)' }}>Change Password</h2>
        <button
          onClick={() => navigate(-1)}
          className="btn"
          style={{
            backgroundColor: 'var(--secondary)',
            color: 'var(--text)',
            border: '1px solid var(--primary)',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: '500'
          }}
        >
          <i className="fas fa-arrow-left me-2"></i> Back
        </button>
      </div>

      {message && (
        <div className="alert alert-success border-0 shadow-sm mb-4" style={{ 
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          borderLeft: '4px solid #28a745',
          color: 'var(--text)',
          borderRadius: '8px'
        }}>
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger border-0 shadow-sm mb-4" style={{ 
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          borderLeft: '4px solid var(--accent)',
          color: 'var(--text)',
          borderRadius: '8px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label" style={{ color: 'var(--text)' }}>Current Password</label>
          <input
            type="password"
            className="form-control"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            style={{ 
              backgroundColor: 'white',
              borderColor: 'var(--secondary)',
              color: 'var(--text)'
            }}
          />
        </div>

        <div className="mb-4">
          <label className="form-label" style={{ color: 'var(--text)' }}>New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ 
              backgroundColor: 'white',
              borderColor: 'var(--secondary)',
              color: 'var(--text)'
            }}
          />
        </div>

        <div className="mb-4">
          <label className="form-label" style={{ color: 'var(--text)' }}>Confirm New Password</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ 
              backgroundColor: 'white',
              borderColor: 'var(--secondary)',
              color: 'var(--text)'
            }}
          />
        </div>

        <button 
          type="submit" 
          className="btn w-100"
          style={{ 
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: '500',
            marginTop: '1rem'
          }}
        >
          Update Password
        </button>
      </form>
      <hr className="my-5" />

<div className="border p-4 rounded" style={{ borderColor: '#dc3545', backgroundColor: 'rgba(220, 53, 69, 0.05)' }}>
  <h4 className="mb-3" style={{ color: '#dc3545' }}>Danger Zone</h4>
  <p className="mb-4" style={{ color: 'var(--text)' }}>
    Deleting your account is irreversible. All your data will be permanently removed.
  </p>
  <button
    onClick={async () => {
      const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
      if (!confirmed) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/medecin/deletemyaccount`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to delete account.");
        }

        // Optional: clear local storage / logout logic
        navigate("/login"); // or use a logout method
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      }
    }}
    className="btn"
    style={{
      backgroundColor: '#dc3545',
      color: 'white',
      padding: '0.5rem 1.5rem',
      borderRadius: '0.375rem',
      fontWeight: '500',
      border: 'none'
    }}
  >
    <i className="fas fa-trash-alt me-2"></i> Delete My Account
  </button>
</div>

    </div>
  );
};

export default ChangePassword;