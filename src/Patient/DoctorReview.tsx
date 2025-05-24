import React from "react";
import FeedbackForm from "../components/FeedbackForm";
import { useAuth } from "../context/AuthContext";

const DoctorReview = ({ medecinId }: { medecinId: number }) => {
  const { getAccessToken } = useAuth();

  const handleFeedbackSubmit = async (rating: number, comment: string) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        alert("You must be logged in to leave a review.");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/avis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          medecinId,
          note: rating,
          commentaire: comment,
          status: "pending"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      alert("Your review has been submitted and is pending approval.");
    } catch (error: any) {
      alert(error.message || "An error occurred");
    }
  };

  return (
    <div className="card border-0 shadow-sm p-4" style={{
      backgroundColor: 'var(--background)',
      borderRadius: '12px'
    }}>
      <h3 style={{ 
        color: 'var(--text)',
        marginBottom: '1.5rem',
        fontWeight: '600'
      }}>
        Leave a Review
      </h3>
      <FeedbackForm onSubmit={handleFeedbackSubmit} />
    </div>
  );
};

export default DoctorReview;