import React from "react";
import { useNavigate } from "react-router-dom";
import EditPatientProfile from "./EditPatientProfile";
import { useAuth } from "../context/AuthContext";
import { User } from "../context/AuthContext"; // assure-toi que User est exporté

const EditPatientProfileWrapper: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleUpdate = (updatedUserData: Partial<User>) => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      ...updatedUserData,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    };

    updateUser(updatedUser);
    navigate("/patient/profile");
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
        image: user.image || "",
        biography: user.biography || "",
      }}
      onUpdate={handleUpdate}
      onCancel={handleCancel}
    />
  );
};

export default EditPatientProfileWrapper;
