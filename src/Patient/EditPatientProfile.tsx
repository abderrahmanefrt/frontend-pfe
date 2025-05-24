import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// Assuming the User interface is defined elsewhere and imported, or define it here if not
// import { User } from "./types"; // Example import path

interface EditPatientProfileProps {
  // Rename initialData to initialUser and update the type to User
  initialUser: {
    id: number; // Assuming User includes id
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    dateOfBirth: string; // Assuming dateOfBirth is a string (e.g., "YYYY-MM-DD")
    // Add other User properties if needed by the form
  };
  onUpdate: (updatedUserData: any) => void;
  onCancel: () => void;
}

const EditPatientProfile: React.FC<EditPatientProfileProps> = ({
  initialUser,
  onUpdate,
  onCancel
}) => {
  // Initialize state with initialUser
  const [formData, setFormData] = useState(initialUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getAccessToken, logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
  
      if (response.status === 401) {
        // Token is invalid, force logout
        logout();
        navigate("/login");
        return; // Important: Return to prevent further execution
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
  
      const data = await response.json();
      onUpdate(data.user); // Update user context
      
      // Only navigate if the update was successful
      navigate("/patient/profile", { replace: true }); // Use replace to prevent back button issues
  
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      // Only redirect to login if it's specifically a session expired error
      if (errorMessage.includes("Session expired")) {
        logout();
        navigate("/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="container py-4" style={{ backgroundColor: '#f5f7f9', maxWidth: '800px' }}>
      <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
        <div className="card-header border-0" style={{ 
          backgroundColor: '#4682B4',
          color: 'white',
          borderRadius: '12px 12px 0 0',
          padding: '1.25rem'
        }}>
          <h2 style={{ margin: 0 }}>Edit Profile</h2>
        </div>
        
        <div className="card-body" style={{ padding: '2rem' }}>
          {error && (
            <div className="alert alert-danger" style={{
              backgroundColor: 'rgba(220, 53, 69, 0.1)',
              borderLeft: '4px solid #dc3545',
              color: '#dc3545',
              padding: '1rem',
              marginBottom: '1.5rem',
              borderRadius: '6px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row mb-4">
              <div className="col-md-6 mb-3">
                <label htmlFor="firstname" style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: '#121517',
                  fontWeight: '500'
                }}>
                  First Name
                </label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #e9ecef',
                    backgroundColor: 'white',
                    color: '#121517'
                  }}
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="lastname" style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: '#121517',
                  fontWeight: '500'
                }}>
                  Last Name
                </label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #e9ecef',
                    backgroundColor: 'white',
                    color: '#121517'
                  }}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                color: '#121517',
                fontWeight: '500'
              }}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  backgroundColor: 'white',
                  color: '#121517'
                }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                color: '#121517',
                fontWeight: '500'
              }}>
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  backgroundColor: 'white',
                  color: '#121517'
                }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="dateOfBirth" style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                color: '#121517',
                fontWeight: '500'
              }}>
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  backgroundColor: 'white',
                  color: '#121517'
                }}
              />
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'rgba(108, 117, 125, 0.1)',
                  color: '#6c757d',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#4682B4',
                  color: 'white',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPatientProfile;