import { useState, useRef, ReactNode } from "react";
import { useSwipe } from "../hooks/useSwipe";
import styles from "./SwipeablePanels.module.css";

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
  onPanelChange,
}: SwipeablePanelsProps) {
  const [currentPanel, setCurrentPanel] = useState(initialPanel);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePanelChange = (newPanel: number) => {
    setCurrentPanel(newPanel);
    onPanelChange?.(newPanel);
  };

  const { handlers, state } = useSwipe({
    currentIndex: currentPanel,
    totalItems: panels.length,
    onSwipe: (_direction, newIndex) => {
      handlePanelChange(newIndex);
    },
  });

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Panel Dots Navigation */}
      <div
        className={styles.panelDots}
        role="tablist"
        aria-label="Panel navigation"
      >
        {panels.map((panel, index) => (
          <button
            key={panel.id}
            className={`${styles.dot} ${index === currentPanel ? styles.activeDot : ""}`}
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
        {...handlers}
        style={{
          transform: `translateX(calc(-${currentPanel * 100}% + ${state.isDragging ? state.translateX + "px" : "0px"}))`,
          transition: state.isDragging ? "none" : "transform 0.3s ease",
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
