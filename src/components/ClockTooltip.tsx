import { useState } from 'react';
import styles from './ClockTooltip.module.css';

interface ClockTooltipProps {
  content: string;
  children: React.ReactNode;
}

export default function ClockTooltip({ content, children }: ClockTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={styles.tooltipWrapper}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={() => setShowTooltip(true)}
      onTouchEnd={() => setTimeout(() => setShowTooltip(false), 3000)} // Longer delay for mobile
    >
      {children}
      {showTooltip && (
        <div className={styles.tooltip}>
          {content}
          <div className={styles.tooltipArrow}></div>
        </div>
      )}
    </div>
  );
}