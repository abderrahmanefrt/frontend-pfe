import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditPatientProfile from "../Patient/EditPatientProfile";
import { User } from "../context/AuthContext";

// Simulate a function to fetch a user by ID
const fetchUserById = (id: number): Promise<User | undefined> => {
  const dummyUsers: User[] = [
    { 
      id: "1",
      firstname: "Alice", 
      lastname: "Johnson", 
      email: "alice@example.com", 
      phone: "555-1234",
      dateOfBirth: "1990-01-01",
      role: "user",
      accessToken: "dummy_access_token_1",
      refreshToken: "dummy_refresh_token_1",
    },
    { 
      id: "2",
      firstname: "Bob", 
      lastname: "Smith", 
      email: "bob@example.com", 
      phone: "555-5678",
      dateOfBirth: "1991-02-02",
      role: "user",
      accessToken: "dummy_access_token_2",
      refreshToken: "dummy_refresh_token_2",
    },
    { 
      id: "3",
      firstname: "Charlie", 
      lastname: "Brown", 
      email: "charlie@example.com", 
      phone: "555-9012",
      dateOfBirth: "1992-03-03",
      role: "user",
      accessToken: "dummy_access_token_3",
      refreshToken: "dummy_refresh_token_3",
    },
  ];
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = dummyUsers.find((u) => u.id === String(id));
      resolve(user);
    }, 500);
  });
};

const AdminEditPatientProfileWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<User | undefined | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchUserById(Number(id)).then((user) => {
        setUserData(user);
      });
    }
  }, [id]);

  const handleUpdate = (updatedUser: User) => {
    // In a real app, update the backend here
    console.log("Updated user:", updatedUser);
    navigate("/admin/users");
  };

  const handleCancel = () => {
    navigate("/admin/users");
  };

  if (!userData) {
    return <div>Loading user information...</div>;
  }

  return (
    <EditPatientProfile
      initialUser={{
        id: userData.id,
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        phone: userData.phone || "",
        dateOfBirth: userData.dateOfBirth || "",
      }}
      onUpdate={handleUpdate}
      onCancel={handleCancel}
    />
  );
};

export default AdminEditPatientProfileWrapper;
