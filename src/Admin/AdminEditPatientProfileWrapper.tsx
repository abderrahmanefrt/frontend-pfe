import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditPatientProfile from "../Patient/EditPatientProfile";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

// Simulate a function to fetch a user by ID
const fetchUserById = (id: number): Promise<User> => {
  const dummyUsers: User[] = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", phone: "555-1234" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", phone: "555-5678" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", phone: "555-9012" },
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
