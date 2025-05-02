import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Simulate fetching patient accounts from an API
  useEffect(() => {
    const dummyUsers: User[] = [
      {
        id: 1,
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "555-1234",
      },
      { id: 2, name: "Bob Smith", email: "bob@example.com", phone: "555-5678" },
      {
        id: 3,
        name: "Charlie Brown",
        email: "charlie@example.com",
        phone: "555-9012",
      },
    ];

    // Simulate API delay
    setTimeout(() => {
      setUsers(dummyUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Handler for editing a user
  const handleEdit = (id: number) => {
    alert(`Edit user with id: ${id}`);
    navigate(`/admin/edit-user/${id}`);
    // In a real application, you might redirect to an edit form or open a modal.
  };

  // Handler for deleting a user
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      alert(`User with id ${id} deleted`);
      // In a real app, you would also call an API to delete the user from the backend.
    }
  };

  return (
    <div className="container mt-4">
      <h2>User Management</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(user.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
