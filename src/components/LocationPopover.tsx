import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Location } from "../types/astronomy";
import { useLocation } from "../hooks/useLocation";
import WorldMap from "./WorldMap";
import { useLocationManager } from "../hooks/useLocationManager";
import { Icon } from "./Icon";
import { APP_CONFIG } from "../config/appConfig";
import { useFocusTrap } from "../hooks/useFocusTrap";
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
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const {
    inputValue,
    suggestion,
    dragLocation,
    handleInputChange,
    handleMapClick,
    handleDragStart,
    handleDragEnd,
    acceptSuggestion,
    confirmCurrentInput,
    handleGeolocationSuccess,
  } = useLocationManager({ initialLocation: location, onLocationChange });

  const [popoverPosition, setPopoverPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Implement focus trapping for accessibility
  useFocusTrap(popoverRef, {
    isActive: true,
    initialFocusRef: inputRef,
    returnFocusRef: triggerRef,
    onEscape: onClose,
  });

  // Position popover relative to trigger and update on scroll
  useEffect(() => {
    const updatePosition = () => {
      if (triggerRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const desiredWidth = viewportWidth < APP_CONFIG.LAYOUT.MOBILE_BREAKPOINT 
          ? Math.min(viewportWidth - APP_CONFIG.LAYOUT.SMALL_SCREEN_PADDING, APP_CONFIG.LAYOUT.SMALL_SCREEN_MAX_WIDTH)
          : Math.min(Math.max(viewportWidth * APP_CONFIG.LAYOUT.LARGE_SCREEN_MIN_WIDTH_FACTOR, APP_CONFIG.LAYOUT.LARGE_SCREEN_MIN_WIDTH), APP_CONFIG.LAYOUT.LARGE_SCREEN_MAX_WIDTH);

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

    const handleResize = () => {
      onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [onClose, triggerRef]);

  // Watch for location changes from context (e.g., successful retry) and propagate to parent
  useEffect(() => {
    if (location) {
      onLocationChange(location, true); // Close popover when location is successfully obtained
    }
  }, [location, onLocationChange]);

  // Enhanced geolocation with retry logic and user feedback
  const attemptGeolocation = useCallback((attempt: number = 1, lastErrorCode?: number) => {
    const maxAttempts = 3;
    
    // Adaptive timeout based on previous error
    let timeout = 10000; // Default 10s
    if (attempt > 1) {
      if (lastErrorCode === 3) { // Previous timeout
        timeout = 20000; // Extend to 20s for timeout retries
      } else if (lastErrorCode === 2) { // Previous position unavailable
        timeout = 15000; // 15s for dormant location services
      } else {
        timeout = 15000; // Default retry timeout
      }
    }
    
    setGeoLoading(true);
    setRetryCount(attempt);
    
    if (attempt === 1) {
      setGeoMessage("Trying to find your location...");
    } else {
      setGeoMessage(`Retrying... (attempt ${attempt} of ${maxAttempts})`);
    }

    if (!navigator.geolocation) {
      setGeoLoading(false);
      setGeoMessage("Location services not available in your browser.");
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: attempt > 1, // Use high accuracy for retries
      timeout: timeout,
      maximumAge: 60000 // 1 minute cache
    };

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        console.info('LocationPopover geolocation success:', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          attempt: attempt
        });
        
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        // Success! Clear states and update location via geolocation handler
        setGeoLoading(false);
        setGeoMessage(null);
        setRetryCount(0);
        handleGeolocationSuccess(newLocation); // This uses strict 5km threshold and closes popover
      },
      (error: GeolocationPositionError) => {
        console.warn('LocationPopover geolocation error:', {
          code: error.code,
          message: error.message,
          attempt: attempt
        });
        
        // Handle permission denied immediately - no retries
        if (error.code === 1) {
          setGeoLoading(false);
          setRetryCount(0);
          setGeoMessage("Location access was denied. Please allow location access in your browser settings and try again, or select your location on the map below.");
          return;
        }
        
        // For technical issues (code 2 & 3), retry with different strategies
        if (attempt < maxAttempts) {
          // Show different retry messages based on error type
          if (error.code === 2) {
            setGeoMessage(`Location services seem to be dormant. Retrying with different positioning methods... (attempt ${attempt + 1} of ${maxAttempts})`);
          } else if (error.code === 3) {
            setGeoMessage(`Location request timed out. Trying again with extended timeout... (attempt ${attempt + 1} of ${maxAttempts})`);
          } else {
            setGeoMessage(`Retrying... (attempt ${attempt + 1} of ${maxAttempts})`);
          }
          
          setTimeout(() => {
            attemptGeolocation(attempt + 1, error.code);
          }, 1500);
        } else {
          // Final failure - show specific message based on error type
          setGeoLoading(false);
          setRetryCount(0);
          
          const finalErrorMessages = {
            2: "Unable to determine your location. This is likely because location services are dormant or network positioning is unavailable. Try opening Apple Maps (or Google Maps) first to 'wake up' location services, then return here and try again. Alternatively, select your location on the map below.",
            3: "Location requests keep timing out. This might indicate poor network connectivity or system location services being slow to respond. Please select your location on the map below or type it in the input field above."
          };
          
          setGeoMessage(finalErrorMessages[error.code as keyof typeof finalErrorMessages] || 
                       "Could not find your location after multiple attempts. Please select it on the map below or type it in the input field above.");
        }
      },
      options
    );
  }, [handleGeolocationSuccess]);

  const handleFindMeClick = useCallback(() => {
    attemptGeolocation(1);
  }, [attemptGeolocation]);

  return createPortal(
    <div
      ref={popoverRef}
      className={styles.popover}
      role="dialog"
      aria-modal="true"
      aria-label="Select location"
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
        <button 
          onClick={onClose} 
          className={styles.closeButton}
          aria-label="Close location picker"
          title="Close location picker"
        >
          <svg
            className={styles.closeIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
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

      {geoLoading ? (
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
                onClick={handleFindMeClick}
                disabled={geoLoading}
                className={styles.clearButton}
                title={geoLoading ? "Finding your location..." : "Use current location"}
              >
                <Icon
                  name="current-location"
                  title={geoLoading ? "Finding your location..." : "Use current location"}
                  className={`${styles.clearIcon} ${geoLoading ? styles.loading : ''}`}
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

            {geoMessage && (
              <div className={styles.geoMessageWrapper}>
                <div className={`${styles.geoMessage} ${geoLoading ? styles.loading : styles.error}`}>
                  {geoLoading && (
                    <div className={styles.spinner}></div>
                  )}
                  {geoMessage}
                  {geoLoading && retryCount > 1 && (
                    <div className={styles.retryInfo}>
                      We're trying different positioning methods and longer timeouts to help wake up location services...
                    </div>
                  )}
                </div>
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
