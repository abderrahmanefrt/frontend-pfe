import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

interface StarRatingProps {
  value?: number;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  value = 0,
  onRate,
  readOnly = false,
  className = "",
}) => {
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

  const renderStar = (index: number) => {
    const rating = hoverRating || value;
    let icon;

    if (rating >= index) {
      icon = solidStar; // full star
    } else if (rating >= index - 0.5) {
      icon = faStarHalfAlt; // half star
    } else {
      icon = regularStar; // empty star
    }

    return (
      <span
        key={index}
        onClick={() => handleClick(index)}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: readOnly ? "default" : "pointer", marginRight: "4px" }}
      >
        <FontAwesomeIcon
          icon={icon}
          className={className}
          style={{ fontSize: "24px", color: "#f5c518" }} // couleur dorée
        />
      </span>
    );
  };

  return <div>{[1, 2, 3, 4, 5].map(renderStar)}</div>;
};

export default StarRating;
