import styles from "./StarRating.module.css";

interface StarRatingProps {
  rating: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  rating,
  className = "",
  size = "md",
}: StarRatingProps) {
  if (rating === 0) {
    return <span className={`${styles.dash} ${className}`}>—</span>;
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

  return <span className={`${styles.container} ${className}`}>{stars}</span>;
}