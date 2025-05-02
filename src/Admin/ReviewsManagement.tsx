import React, { useEffect, useState } from "react";
import { Feedback } from "../types/Feedback";
import StarRating from "../components/StarRating";
import { Link } from "react-router-dom";

const ReviewsManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate fetching all reviews (only pending for moderation)
  useEffect(() => {
    const dummyReviews: Feedback[] = [
      { id: 1, patientName: "Alice", date: "2025-04-01", rating: 5, comment: "Excellent care!", status: "pending" },
      { id: 2, patientName: "Eve",   date: "2025-04-15", rating: 3, comment: "Average experience.", status: "pending" },
      { id: 3, patientName: "Mallory", date: "2025-04-20", rating: 4, comment: "Good but room for improvement.", status: "approved" }
    ];
    setTimeout(() => {
      setReviews(dummyReviews);
      setLoading(false);
    }, 500);
  }, []);

  const handleApprove = (id: number) => {
    setReviews(prev => 
      prev.map(r => (r.id === id ? { ...r, status: "approved" } : r))
    );
    alert(`Review ${id} approved.`);
  };

  const handleReject = (id: number) => {
    setReviews(prev => 
      prev.map(r => (r.id === id ? { ...r, status: "rejected" } : r))
    );
    alert(`Review ${id} rejected.`);
  };

  if (loading) return <div>Loading reviews for moderation...</div>;

  const pending = reviews.filter(r => r.status === "pending");

  return (
    <div className="container mt-4">
      <h2>Manage Patient Reviews</h2>
      {pending.length === 0 ? (
        <p>There are no reviews pending approval.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.map(review => (
              <tr key={review.id}>
                <td>{review.id}</td>
                <td>{review.patientName}</td>
                <td>{review.date}</td>
                <td><StarRating value={review.rating} readOnly /></td>
                <td>{review.comment}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => handleApprove(review.id)}>
                    Approve
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleReject(review.id)}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to="/admin" className="btn btn-secondary mt-3">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default ReviewsManagement;