import React from "react";
import { useNavigate } from "react-router-dom";
import EditPatientProfile from "./EditPatientProfile";
import { useAuth } from "../context/AuthContext";
import { User } from "./EditPatientProfile"; // Make sure the User interface is exported if needed

const EditPatientProfileWrapper: React.FC = () => {
  const { user, updateUser } = useAuth(); // Assume user is an object with id, name, email, phone
  const navigate = useNavigate();

  // Callback when the profile is updated
  const handleUpdate = (updatedUser: User) => {
    updateUser(updatedUser);
    // Navigate back to the patient profile or user management view depending on the context.
    // For patient, we might return to the profile page:
    navigate("/patient/profile");
  };

  // Callback when the editing is cancelled
  const handleCancel = () => {
    navigate("/patient/profile");
  };

  if (!user) {
    return <div>Loading user information...</div>;
  }

  return (
    <EditPatientProfile
      initialUser={user}
      onUpdate={handleUpdate}
      onCancel={handleCancel}
    />
  );
};

export default EditPatientProfileWrapper;
