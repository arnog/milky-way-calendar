// Simple SVG Icon component for stars (no tooltip needed)
const Icon = ({
  name,
  className = "w-6 h-6",
}: {
  name: string;
  className?: string;
}) => (
  <svg className={className}>
    <use href={`/src/icons.svg#${name}`} />
  </svg>
);

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
    return <span className={className}>—</span>;
  }

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const stars = [];
  for (let i = 0; i < 4; i++) {
    stars.push(
      <svg
        key={i}
        className={`${sizeClasses[size]} inline-block`}
        style={{ fill: 'white', color: 'white' }}
      >
        <use href={`/src/icons.svg#${i < rating ? "star-black" : "star-white"}`} />
      </svg>
    );
  }

  return <span className={`inline-flex ${className}`}>{stars}</span>;
}
