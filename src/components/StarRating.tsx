import Tooltip from "./Tooltip";
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
  if (rating === 0) {
    const content = (
      <div className={`${styles.container} ${className}`}>
        <span className={styles.dash}>—</span>
      </div>
    );
    
    return reason ? (
      <Tooltip content={reason ?? "No visibility"}>
        {content}
      </Tooltip>
    ) : content;
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

  const content = (
    <div className={`${styles.container} ${className}`}>
      {stars}
    </div>
  );

  return reason ? (
    <Tooltip content={reason}>
      {content}
    </Tooltip>
  ) : content;
}