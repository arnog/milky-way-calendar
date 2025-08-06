import styles from './Spinner.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface SpinnerProps {
  /** Size of the spinner */
  size?: SpinnerSize;
  /** Additional CSS class name */
  className?: string;
}

export default function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClass = {
    sm: styles.small,
    md: styles.medium,
    lg: styles.large,
    xl: styles.xlarge,
  }[size];

  return (
    <div 
      className={`${styles.spinner} ${sizeClass} ${className || ''}`}
      role="status"
      aria-label="Loading"
    />
  );
}