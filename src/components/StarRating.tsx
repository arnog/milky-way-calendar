import { useState } from "react";
import styles from "./StarRating.module.css";

interface StarRatingProps {
  rating: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  reason?: string;
}

export default function StarRating({
  rating,
  className = "",
  size = "md",
  reason,
}: StarRatingProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  if (rating === 0) {
    return (
      <div
        className={`${styles.container} ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onTouchStart={() => setShowTooltip(true)}
        onTouchEnd={() => setTimeout(() => setShowTooltip(false), 2000)}
      >
        <span className={styles.dash}>—</span>
        {showTooltip && (reason || "No visibility") && (
          <div className="global-tooltip">
            {reason || "No visibility"}
            <div className="global-tooltip-arrow"></div>
          </div>
        )}
      </div>
    );
  }

  const sizeClass = {
    sm: styles.starSmall,
    md: styles.starMedium,
    lg: styles.starLarge,
  }[size];

  const stars = [];
  for (let i = 0; i < 4; i++) {
    const isFilled = i < rating;
    stars.push(
      <svg
        key={i}
        className={`${styles.star} ${sizeClass} ${
          isFilled ? styles.starFilled : styles.starEmpty
        }`}
      >
        <use
          href={`/icons.svg#${isFilled ? "star-black" : "star-white"}`}
        />
      </svg>
    );
  }

  return (
    <div 
      className={`${styles.container} ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={() => setShowTooltip(true)}
      onTouchEnd={() => setTimeout(() => setShowTooltip(false), 2000)}
    >
      {stars}
      {showTooltip && reason && (
        <div className="global-tooltip">
          {reason}
          <div className="global-tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
}