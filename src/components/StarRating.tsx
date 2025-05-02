import React, { useState, useEffect } from "react";

interface StarRatingProps {
  /** Controlled value of stars to display */
  value?: number;
  /** Callback when a new rating is selected */
  onRate?: (rating: number) => void;
  /** If true, disables hover and click interactions */
  readOnly?: boolean;
  /** Optional className for styling */
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ value = 0, onRate, readOnly = false, className = "" }) => {
  // Local state only for hover effect; rating controlled by prop `value`
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleClick = (star: number) => {
    if (readOnly) return;
    onRate?.(star);
  };

  const handleMouseEnter = (star: number) => {
    if (readOnly) return;
    setHoverRating(star);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const renderStar = (star: number) => {
    const isFilled = hoverRating ? star <= hoverRating : star <= value;
    return (
      <span
        key={star}
        onMouseEnter={() => handleMouseEnter(star)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(star)}
        style={{ cursor: readOnly ? "default" : "pointer", fontSize: "24px", marginRight: "4px" }}
      >
        <span className={className} style={{ color: isFilled ? undefined : undefined }}>
          {isFilled ? "★" : "☆"}
        </span>
      </span>
    );
  };

  return <div>{[1, 2, 3, 4, 5].map(renderStar)}</div>;
};

export default StarRating;
