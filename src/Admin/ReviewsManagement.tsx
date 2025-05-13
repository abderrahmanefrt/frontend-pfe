import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Spinner, Alert } from "react-bootstrap";

interface Avis {
  id: number;
  note: number;
  commentaire: string;
  User: {
    firstname: string;
  };
}

const ManageDoctorReviews: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [reviews, setReviews] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // ou via AuthContext
      const res = await fetch(`https://pfe-project-2nrq.onrender.com/api/avis/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
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

  const deleteReview = async (reviewId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`https://pfe-project-2nrq.onrender.com/api/admin/avis/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete review");

      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err: any) {
      alert("Error deleting review: " + err.message);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [doctorId]);

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h3>Manage Reviews for Doctor #{doctorId}</h3>
      {reviews.length === 0 ? (
        <p>No reviews found for this doctor.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Note</th>
              <th>Comment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id}>
                <td>{review.User?.firstname || "Anonymous"}</td>
                <td>{review.note}/5</td>
                <td>{review.commentaire}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteReview(review.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
    </div>
  );
};

export default ManageDoctorReviews;
