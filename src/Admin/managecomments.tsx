import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Spinner, Alert } from "react-bootstrap";

interface Avis {
  id: number;
  note: number;
  commentaire: string;
  status: "pending" | "approved" | "rejected";
  User: {
    firstname: string;
    lastname?: string;
  };
  Medecin?: {
    firstname: string;
    lastname: string;
  };
}

const ManageComments: React.FC = () => {
  const [reviews, setReviews] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("accessToken") || JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || '{}').accessToken;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/avis/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: "approved" | "rejected") => {
    try {
      const token = localStorage.getItem("accessToken") || JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || '{}').accessToken;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/avis/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setReviews(prev => prev.filter(review => review.id !== id));
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4" style={{ color: 'var(--primary)' }}>Patient Reviews Management</h3>
      {reviews.length === 0 ? (
        <Alert variant="info">No reviews pending validation.</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead style={{ background: 'var(--secondary)', color: 'var(--text)' }}>
            <tr>
              <th>Patient</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Doctor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id}>
                <td>{review.User?.firstname} {review.User?.lastname || ""}</td>
                <td>{review.note}/5</td>
                <td>{review.commentaire}</td>
                <td>{review.Medecin ? `${review.Medecin.firstname} ${review.Medecin.lastname}` : "N/A"}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleStatusChange(review.id, "approved")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleStatusChange(review.id, "rejected")}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Button variant="secondary" onClick={() => navigate(-1)} className="mt-3">Back</Button>
    </div>
  );
};

export default ManageComments;
