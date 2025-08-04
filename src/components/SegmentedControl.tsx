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
  return (
    <div className={`${styles.segmentedControl} ${styles[size]} ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`${styles.segment} ${
            value === option.value ? styles.active : ""
          }`}
          type="button"
        >
          {option.icon && (
            <span className={styles.icon}>{option.icon}</span>
          )}
          <span className={styles.label}>{option.label}</span>
          {showCounts && option.count !== undefined && (
            <span className={styles.count}>{option.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}