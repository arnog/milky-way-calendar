import { ReactNode } from "react";
import styles from "./SegmentedControl.module.css";

export interface SegmentedControlOption<T> {
  value: T;
  label: string;
  count?: number; // Optional count badge
  icon?: ReactNode; // Optional icon
}

interface SegmentedControlProps<T> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  showCounts?: boolean;
}

export default function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  className = "",
  size = "md",
  showCounts = true,
}: SegmentedControlProps<T>) {
  // Find the active option index
  const activeIndex = options.findIndex((option) => option.value === value);

  // Calculate sliding indicator position and width
  // Account for 1px horizontal padding and gap between segments
  const gapSize = 0.125; // rem - matches CSS gap value
  const paddingPx = 1; // px - uniform 1px padding all around

  // Calculate available width after accounting for 1px padding on both sides
  const availableWidth = `calc(100% - ${paddingPx * 2}px)`;
  const segmentWidth = `calc((${availableWidth} - ${gapSize * (options.length - 1)}rem) / ${options.length})`;
  const segmentLeft =
    activeIndex === 0
      ? `${paddingPx}px`
      : `calc(${paddingPx}px + ${activeIndex} * (${segmentWidth} + ${gapSize}rem))`;

  const indicatorStyle =
    activeIndex >= 0
      ? {
          left: segmentLeft,
          width: segmentWidth,
        }
      : { display: "none" };

  return (
    <div className={`${styles.segmentedControl} ${styles[size]} ${className}`}>
      {/* Sliding indicator */}
      <div className={styles.slidingIndicator} style={indicatorStyle} />

      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`${styles.segment} ${
            value === option.value ? styles.active : ""
          }`}
          type="button"
        >
          {option.icon && <span className={styles.icon}>{option.icon}</span>}
          {option.label && <span className={styles.label}>{option.label}</span>}
          {showCounts && option.count !== undefined && (
            <span className={styles.count}>{option.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
