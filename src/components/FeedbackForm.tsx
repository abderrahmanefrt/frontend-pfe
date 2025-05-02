import React, { useState } from "react";
import StarRating from "./StarRating";

interface FeedbackFormProps {
  onSubmit: (rating: number, comment: string) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      alert("Please provide a star rating.");
      return;
    }
    onSubmit(rating, comment);
    setRating(0);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="rating" className="form-label">Your Rating</label>
        <StarRating value={rating} onRate={setRating} />
      </div>
      <div className="mb-3">
        <label htmlFor="feedbackComment" className="form-label">Your Comments</label>
        <textarea
          id="feedbackComment"
          className="form-control"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your experience..."
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">Submit Review</button>
    </form>
  );
};

export default FeedbackForm;