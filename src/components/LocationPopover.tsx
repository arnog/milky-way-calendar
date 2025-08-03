import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Location } from "../types/astronomy";
import { useLocation } from "../hooks/useLocation";
import WorldMap from "./WorldMap";
import { useLocationManager } from "../hooks/useLocationManager";
import { Icon } from "./Icon";
import styles from "./LocationPopover.module.css";

interface LocationPopoverProps {
  onLocationChange: (location: Location, shouldClose?: boolean) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

export default function LocationPopover({
  onLocationChange,
  onClose,
  triggerRef,
}: LocationPopoverProps) {
  const { location } = useLocation();
  const {
    inputValue,
    suggestion,
    isLoading,
    dragLocation,
    handleInputChange,
    handleMapClick,
    handleDragStart,
    handleDragEnd,
    getCurrentLocation,
    acceptSuggestion,
    confirmCurrentInput,
  } = useLocationManager({ initialLocation: location, onLocationChange });

  const [popoverPosition, setPopoverPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Position popover relative to trigger and update on scroll
  useEffect(() => {
    const updatePosition = () => {
      if (triggerRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const desiredWidth = viewportWidth < 480 
          ? Math.min(viewportWidth - 32, 350) // Small screens: viewport width minus 32px padding, max 350px
          : Math.min(Math.max(viewportWidth * 0.5, 500), 800);

        // Center the popover horizontally on the page
        const left = (viewportWidth - desiredWidth) / 2;

        // Position popover directly below the trigger button (viewport coordinates)
        // Since we're using position: fixed, we use viewport coordinates, not document coordinates
        const top = triggerRect.bottom + 8;

        setPopoverPosition({
          top: top,
          left: left,
          width: desiredWidth,
        });
      }
    };

    // Update position immediately when popover opens
    updatePosition();

    // Update position when user scrolls to keep it relative to the trigger
    const handleScroll = () => {
      updatePosition();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [triggerRef]);

  // Close on outside click, resize, or escape key (but NOT on scroll)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleResize = () => {
      onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [onClose, triggerRef]);

  return createPortal(
    <div
      ref={popoverRef}
      className={styles.popover}
      style={{
        top: popoverPosition.top,
        left: popoverPosition.left,
        width: popoverPosition.width,
        maxWidth: "90vw",
        backgroundColor: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
      }}
    >
      <div className={styles.header}>
        <h3></h3>
        <button onClick={onClose} className={styles.closeButton}>
          <svg
            className={styles.closeIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {isLoading ? (
        <p className={styles.detectingText}>Detecting your location...</p>
      ) : (
        <>
          <div className={styles.inputSection}>
            <div className={styles.inputWrapper}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                className={styles.input}
                placeholder="Enter coordinates or location name"
                autoComplete="off"
                spellCheck={false}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (suggestion) {
                      acceptSuggestion(); // Accept suggestion and close
                    } else {
                      confirmCurrentInput(); // Try to parse and confirm current input
                    }
                  } else if (e.key === "Tab") {
                    e.preventDefault();
                    if (suggestion) {
                      acceptSuggestion(); // Accept suggestion (but don't close on Tab)
                    }
                  }
                }}
              />
              <button
                onClick={getCurrentLocation}
                disabled={isLoading}
                className={styles.clearButton}
                title="Use current location"
              >
                <Icon
                  name="current-location"
                  title="Use current location"
                  className={styles.clearIcon}
                />
              </button>
            </div>

            {suggestion && (
              <div className={styles.suggestionWrapper}>
                <button
                  onClick={acceptSuggestion}
                  className={styles.suggestionButton}
                >
                  <Icon
                    name="location"
                    className="global-icon-small color-accent"
                  />{" "}
                  {suggestion}
                  <span className={styles.suggestionCoords}>
                    (Press Tab or click to select)
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className={styles.mapSection}>
            <WorldMap
              location={dragLocation || location}
              onLocationChange={handleMapClick}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          </div>
        </>
      )}
    </div>,
    document.body
  );
}
