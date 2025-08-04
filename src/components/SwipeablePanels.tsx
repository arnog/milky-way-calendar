import { useState, useRef, useMemo, ReactNode } from 'react';
import styles from './SwipeablePanels.module.css';

interface Panel {
  id: string;
  title: string;
  content: ReactNode;
}

interface SwipeablePanelsProps {
  panels: Panel[];
  initialPanel?: number;
  className?: string;
  onPanelChange?: (panelIndex: number) => void;
}

export default function SwipeablePanels({
  panels,
  initialPanel = 0,
  className = "",
  onPanelChange
}: SwipeablePanelsProps) {
  const [currentPanel, setCurrentPanel] = useState(initialPanel);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect touch device for optimized interaction
  const isTouchDevice = useMemo(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  const handlePanelChange = (newPanel: number) => {
    setCurrentPanel(newPanel);
    onPanelChange?.(newPanel);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = currentX - startX;
    setTranslateX(diffX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    // Adaptive threshold based on device - lower for touch devices
    const threshold = isTouchDevice ? 30 : 50;
    
    if (Math.abs(translateX) > threshold) {
      if (translateX > 0 && currentPanel > 0) {
        // Swipe right - go to previous panel
        handlePanelChange(currentPanel - 1);
      } else if (translateX < 0 && currentPanel < panels.length - 1) {
        // Swipe left - go to next panel
        handlePanelChange(currentPanel + 1);
      }
    }
    
    setIsDragging(false);
    setTranslateX(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const diffX = currentX - startX;
    setTranslateX(diffX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    // Use same adaptive threshold as touch for consistency
    const threshold = isTouchDevice ? 30 : 50;
    
    if (Math.abs(translateX) > threshold) {
      if (translateX > 0 && currentPanel > 0) {
        handlePanelChange(currentPanel - 1);
      } else if (translateX < 0 && currentPanel < panels.length - 1) {
        handlePanelChange(currentPanel + 1);
      }
    }
    
    setIsDragging(false);
    setTranslateX(0);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Panel Dots Navigation */}
      <div className={styles.panelDots} role="tablist" aria-label="Panel navigation">
        {panels.map((panel, index) => (
          <button
            key={panel.id}
            className={`${styles.dot} ${index === currentPanel ? styles.activeDot : ''}`}
            onClick={() => handlePanelChange(index)}
            role="tab"
            aria-label={`Go to ${panel.title}`}
            aria-selected={index === currentPanel}
            aria-controls={`panel-${index}`}
          />
        ))}
      </div>
      
      {/* Swipeable Panels Container */}
      <div 
        ref={containerRef}
        className={styles.panelsContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `translateX(calc(-${currentPanel * 100}% + ${isDragging ? translateX + 'px' : '0px'}))`,
          transition: isDragging ? 'none' : 'transform 0.3s ease'
        }}
        role="tabpanel"
        aria-label="Swipeable panel content"
      >
        {panels.map((panel, index) => (
          <div 
            key={panel.id} 
            className={styles.panel}
            id={`panel-${index}`}
            role="tabpanel"
            aria-labelledby={`tab-${index}`}
            aria-hidden={index !== currentPanel}
          >
            {panel.content}
          </div>
        ))}
      </div>
    </div>
  );
}