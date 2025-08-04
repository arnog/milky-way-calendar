import { useState, useEffect, useRef } from 'react';
import styles from './ClockTooltip.module.css';

interface ClockTooltipProps {
  content: string;
  children: React.ReactNode;
}

export default function ClockTooltip({ content, children }: ClockTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  // Clear timeout helper
  const clearTooltipTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Hide tooltip with cleanup
  const hideTooltip = () => {
    setShowTooltip(false);
    setIsTouch(false);
    clearTooltipTimeout();
  };

  // Show tooltip for touch devices with auto-dismiss
  const showTooltipWithTimeout = () => {
    setShowTooltip(true);
    setIsTouch(true);
    clearTooltipTimeout();
    
    // Auto-dismiss after 3 seconds on touch devices
    timeoutRef.current = setTimeout(() => {
      hideTooltip();
    }, 3000);
  };

  // Handle outside clicks/touches to dismiss tooltip
  useEffect(() => {
    if (!showTooltip || !isTouch) return;

    const handleOutsideInteraction = (event: TouchEvent | MouseEvent) => {
      // Check if the interaction is outside both the tooltip and the wrapper
      if (
        tooltipRef.current &&
        wrapperRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        hideTooltip();
      }
    };

    // Add listeners for both touch and mouse events
    document.addEventListener('touchstart', handleOutsideInteraction, { passive: true });
    document.addEventListener('mousedown', handleOutsideInteraction);

    return () => {
      document.removeEventListener('touchstart', handleOutsideInteraction);
      document.removeEventListener('mousedown', handleOutsideInteraction);
    };
  }, [showTooltip, isTouch]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearTooltipTimeout();
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isTouch) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouch) {
      setShowTooltip(false);
    }
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    // Prevent mouse events from firing on touch devices
    event.preventDefault();
    
    if (showTooltip && isTouch) {
      // If tooltip is already shown, hide it (toggle behavior)
      hideTooltip();
    } else {
      // Show tooltip with auto-dismiss
      showTooltipWithTimeout();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={styles.tooltipWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      {children}
      {showTooltip && (
        <div 
          ref={tooltipRef}
          className={`${styles.tooltip} ${isTouch ? styles.touchTooltip : ''}`}
        >
          {content}
          <div className={styles.tooltipArrow}></div>
          {isTouch && (
            <div className={styles.dismissHint}>
              Tap outside to dismiss
            </div>
          )}
        </div>
      )}
    </div>
  );
}