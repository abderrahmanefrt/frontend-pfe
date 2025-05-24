import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditPatientProfile from "../Patient/EditPatientProfile";

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

// Simulate a function to fetch a user by ID
const fetchUserById = (id: number): Promise<User> => {
  const dummyUsers: User[] = [
    { 
      id: 1, 
      firstname: "Alice", 
      lastname: "Johnson", 
      email: "alice@example.com", 
      phone: "555-1234",
      dateOfBirth: "1990-01-01"
    },
    { 
      id: 2, 
      firstname: "Bob", 
      lastname: "Smith", 
      email: "bob@example.com", 
      phone: "555-5678",
      dateOfBirth: "1991-02-02"
    },
    { 
      id: 3, 
      firstname: "Charlie", 
      lastname: "Brown", 
      email: "charlie@example.com", 
      phone: "555-9012",
      dateOfBirth: "1992-03-03"
    },
  ];
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = dummyUsers.find((u) => u.id === id);
      resolve(user!);
    }, 500);
  });
};

const AdminEditPatientProfileWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<User | null>(null);
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
      initialUser={userData}
      onUpdate={handleUpdate}
      onCancel={handleCancel}
    />
  );
};

export default AdminEditPatientProfileWrapper;
