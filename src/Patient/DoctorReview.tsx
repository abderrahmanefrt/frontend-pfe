import React from "react";
import FeedbackForm from "../components/FeedbackForm";
import { useAuth } from "../context/AuthContext";

const DoctorReview = ({ medecinId }: { medecinId: number }) => {
  const { getAccessToken } = useAuth();

const handleFeedbackSubmit= async (rating: number, comment: string) => {
  try {
    const token = await getAccessToken();
    if (!token) {
      alert("You must be logged in to leave a review.");
      return;
    }

    const response = await fetch("https://pfe-project-2nrq.onrender.com/api/avis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        medecinId,
        note: rating,
        commentaire: comment,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to submit review");
    }

    alert("Review submitted successfully!");
  } catch (error: any) {
    alert(error.message || "An error occurred");
  }
};


  return (
    <div className="card p-3 shadow">
      <h3>Laisser un avis</h3>
      <FeedbackForm onSubmit={handleFeedbackSubmit} />
    </div>
  );
};

export default DoctorReview;
