import React from "react";
import { useNavigate } from "react-router-dom";
import EditPatientProfile from "./EditPatientProfile";
import { useAuth } from "../context/AuthContext";
import { User } from "../context/AuthContext";

const EditPatientProfileWrapper: React.FC = () => {
  const { user, updateUser, getAccessToken } = useAuth();
  const navigate = useNavigate();

  const handleUpdate = async (updatedUserData: Partial<User>) => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error("No access token available");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedUserData)
      });

      if (response.status === 401) {
        // Attempt token refresh
        const newToken = await refreshToken();
        if (!newToken) {
          throw new Error("Session expired. Please log in again.");
        }
        // Retry with new token
        return handleUpdate(updatedUserData);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await response.json();
      updateUser(data.user);
      navigate("/patient/profile");
    } catch (error) {
      console.error("Update error:", error);
      if (error instanceof Error && error.message.includes("Session expired")) {
        navigate("/login");
      }
    }
  };

  const refreshToken = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return null;

      const user = JSON.parse(storedUser);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: user.refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        user.accessToken = data.accessToken;
        localStorage.setItem("user", JSON.stringify(user));
        return data.accessToken;
      }
      return null;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  };

  const handleCancel = () => {
    navigate("/patient/profile");
  };

  if (!user) {
    return <div>Loading user information...</div>;
  }

  return (
    <EditPatientProfile
      initialData={{
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
      }}
      onUpdate={handleUpdate}
      onCancel={handleCancel}
    />
  );
};

export default EditPatientProfileWrapper;