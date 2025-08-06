import { useState, useRef, useCallback, useEffect } from "react";
import { Location } from "../types/astronomy";
import { useLocation } from "../hooks/useLocation";
import WorldMap from "./WorldMap";
import { useLocationManager } from "../hooks/useLocationManager";
import { Icon } from "./Icon";
import Tooltip from "./Tooltip";
import styles from "./LocationPopover.module.css";


interface LocationPopoverProps {
  onLocationChange: (location: Location, shouldClose?: boolean) => void;
  onClose: () => void;
  id: string; // ID for the popover element
}

export default function LocationPopover({
  onLocationChange,
  onClose,
  id,
}: LocationPopoverProps) {
  const { location } = useLocation();
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);
  const geoMessageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
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

  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (geoMessageTimeoutRef.current) {
        clearTimeout(geoMessageTimeoutRef.current);
      }
    };
  }, []);

  // Position popover when it opens
  useEffect(() => {
    if (!popoverRef.current) return;

    const popover = popoverRef.current;

    // Listen for the beforetoggle event to position popover relative to trigger
    const handleBeforeToggle = (event: Event) => {
      const toggleEvent = event as PopoverToggleEvent;
      if (toggleEvent.newState === "open") {
        // Use a small delay to ensure the popover is fully rendered
        setTimeout(() => {
          const triggerElement = document.querySelector(
            `[popovertarget="${id}"]`,
          ) as HTMLElement;

          if (triggerElement && popover) {
            const triggerRect = triggerElement.getBoundingClientRect();
            const popoverRect = popover.getBoundingClientRect();

            // Calculate position below the trigger, centered
            const viewportWidth = window.innerWidth;
            const left = Math.max(
              8,
              Math.min(
                triggerRect.left + (triggerRect.width - popoverRect.width) / 2,
                viewportWidth - popoverRect.width - 8,
              ),
            );
            const top = triggerRect.bottom + 8;

            // Apply the position with !important to override any other styles
            popover.style.setProperty("position", "fixed", "important");
            popover.style.setProperty("left", `${left}px`, "important");
            popover.style.setProperty("top", `${top}px`, "important");
            popover.style.setProperty("right", "auto", "important");
            popover.style.setProperty("bottom", "auto", "important");
          }
        }, 10);
      }
    };

    popover.addEventListener("beforetoggle", handleBeforeToggle);

    return () => {
      popover.removeEventListener("beforetoggle", handleBeforeToggle);
    };
  }, [id]);

  // Handle popover close events
  const handleToggle = useCallback(
    (event: Event) => {
      const popoverEvent = event as ToggleEvent;
      if (popoverEvent.newState === "closed") {
        onClose();
      }
    },
    [onClose],
  );

  // Watch for location changes from context (e.g., successful retry) and propagate to parent
  // Only close if location changes from null to a value (successful geolocation)
  const previousLocationRef = useRef(location);
  useEffect(() => {
    // Only trigger if we went from no location to having a location
    if (!previousLocationRef.current && location) {
      onLocationChange(location, true); // Close popover when location is successfully obtained
      // Close the popover using the native API
      if (popoverRef.current) {
        popoverRef.current.hidePopover();
      }
    }

    previousLocationRef.current = location;
  }, [location, onLocationChange]);

  // Enhanced geolocation with retry logic and user feedback
  //
  // GEOLOCATION STRATEGY:
  // The browser's Geolocation API automatically chooses between multiple positioning methods:
  // - GPS (Global Positioning System) - Most accurate (~5-20m) but slow, requires clear sky view
  // - WiFi positioning - Moderate accuracy (~20-50m), works indoors, requires WiFi database
  // - Cell tower triangulation - Less accurate (~100-1000m), works anywhere with cell signal
  // - IP-based geolocation - Least accurate (city-level), instant but unreliable
  //
  // Our retry strategy optimizes for different scenarios:
  //
  // ATTEMPT 1 (Speed-optimized):
  // - enableHighAccuracy: false - Prioritizes network/WiFi positioning for quick response
  // - timeout: 10 seconds - Shorter timeout for fast feedback
  // - Goal: Get a "good enough" position quickly (~50-500m accuracy)
  // - Best for: Users who just want to see nearby dark sites
  //
  // ATTEMPTS 2-3 (Accuracy-optimized):
  // - enableHighAccuracy: true - Activates GPS for precise positioning
  // - timeout: 15-20 seconds - Gives GPS time to acquire satellite fix
  // - Goal: Get the most accurate position possible (~5-20m accuracy)
  // - Best for: Users who need precise location for dark site calculations
  //
  // ERROR CODES:
  // - Code 1 (PERMISSION_DENIED): User denied location access - no retries
  // - Code 2 (POSITION_UNAVAILABLE): Hardware/OS can't determine position - retry with GPS
  // - Code 3 (TIMEOUT): Request took too long - retry with longer timeout
  //
  // WHY THE "OPEN MAPS APP" SUGGESTION WORKS:
  // On mobile devices, the Maps app often keeps GPS "warm" with cached satellite data,
  // making subsequent location requests faster and more reliable. This is especially
  // true on iOS where Safari may have limited GPS access compared to native apps.
  const attemptGeolocation = useCallback(
    (attempt: number = 1, lastErrorCode?: number) => {
      const maxAttempts = 3;

      // Adaptive timeout based on previous error
      let timeout = 10000; // Default 10s
      if (attempt > 1) {
        if (lastErrorCode === 3) {
          // Previous timeout
          timeout = 20000; // Extend to 20s for timeout retries
        } else if (lastErrorCode === 2) {
          // Previous position unavailable
          timeout = 15000; // 15s for dormant location services
        } else {
          timeout = 15000; // Default retry timeout
        }
      }

      setGeoLoading(true);

      // Clear any existing timeout
      if (geoMessageTimeoutRef.current) {
        clearTimeout(geoMessageTimeoutRef.current);
        geoMessageTimeoutRef.current = null;
      }

      // Simple progress messages based on attempt number
      const messages = [
        "Finding your location...",
        "Still working on it...",
        "Taking a bit longer than expected...",
      ];
      const message = messages[Math.min(attempt - 1, messages.length - 1)];

      if (attempt === 1) {
        // Delay first attempt, in case a result comes back quickly
        geoMessageTimeoutRef.current = setTimeout(() => {
          setGeoMessage(message);
          geoMessageTimeoutRef.current = null;
        }, 200);
      } else {
        setGeoMessage(message);
      }

      if (!navigator.geolocation) {
        // Clear timeout if set
        if (geoMessageTimeoutRef.current) {
          clearTimeout(geoMessageTimeoutRef.current);
          geoMessageTimeoutRef.current = null;
        }
        setGeoLoading(false);
        setGeoMessage("Location Services are not available.");
        return;
      }

      // Configure geolocation options based on attempt number (see detailed strategy above)
      const options: PositionOptions = {
        enableHighAccuracy: attempt > 1, // false = fast network, true = accurate GPS
        timeout: timeout, // 10s first attempt, 15-20s for retries
        maximumAge: 60000, // Accept cached position up to 1 minute old
      };

      // Extract error handling logic inline to avoid circular dependency
      const handleGeolocationError = (
        error: GeolocationPositionError,
        currentAttempt: number,
        maxAttempts: number,
      ) => {
        // Handle permission denied immediately - no retries
        if (error.code === 1) {
          setGeoLoading(false);
          setGeoMessage(
            "Location access was not allowed. Select your location on the map or type it in the search box above.",
          );
          return;
        }

        // For technical issues (code 2 & 3), retry
        if (currentAttempt < maxAttempts) {
          // Don't update message here - let attemptGeolocation set the appropriate progress message
          // The message will be set based on the attempt number when attemptGeolocation runs

          setTimeout(() => {
            attemptGeolocation(currentAttempt + 1, error.code);
          }, 1500);
        } else {
          // Final failure - show specific message based on error type
          setGeoLoading(false);

          // Simple, actionable final message
          setGeoMessage(
            "Location Services could not determine your location. Select it on the map or type it in the search box above.",
          );
        }
      };

      // Use real geolocation API
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Success! Clear states and update location via geolocation handler
          // Clear any pending message timeout
          if (geoMessageTimeoutRef.current) {
            clearTimeout(geoMessageTimeoutRef.current);
            geoMessageTimeoutRef.current = null;
          }
          setGeoLoading(false);
          setGeoMessage(null);
          handleGeolocationSuccess(newLocation); // This uses strict 5km threshold and closes popover
        },
        (error: GeolocationPositionError) => {
          handleGeolocationError(error, attempt, maxAttempts);
        },
        options,
      );
    },
    [handleGeolocationSuccess],
  );

  const handleFindMeClick = useCallback(() => {
    attemptGeolocation(1);
  }, [attemptGeolocation]);

  // Clear error message when user takes manual action
  const handleInputChangeWithClear = useCallback((value: string) => {
    // Clear any error message when user types
    if (geoMessage && !geoLoading) {
      setGeoMessage(null);
    }
    handleInputChange(value);
  }, [geoMessage, geoLoading, handleInputChange]);

  const handleMapClickWithClear = useCallback((location: Location) => {
    // Clear any error message when user clicks map
    if (geoMessage && !geoLoading) {
      setGeoMessage(null);
    }
    handleMapClick(location);
  }, [geoMessage, geoLoading, handleMapClick]);

  return (
    <div
      ref={popoverRef}
      id={id}
      popover="auto"
      className={styles.popover}
      aria-label="Select location"
      onToggle={handleToggle}
    >
      <div className={styles.header}>
        <h3></h3>
        <button
          onClick={() => popoverRef.current?.hidePopover()}
          className={styles.closeButton}
          aria-label="Close location picker"
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

      <div className={styles.inputSection}>
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChangeWithClear(e.target.value)}
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
          <Tooltip
            content={
              geoLoading
                ? "Finding your location..."
                : "Show your current location"
            }
            disabled={geoLoading}
            placement="top"
          >
            <button
              onClick={handleFindMeClick}
              disabled={geoLoading}
              className={styles.clearButton}
            >
              {geoLoading ? (
                <div
                  className={`${styles.spinner} ${styles.buttonSpinner}`}
                ></div>
              ) : (
                <Icon name="current-location" className={styles.clearIcon} />
              )}
            </button>
          </Tooltip>
        </div>

        {suggestion && (
          <div className={styles.suggestionWrapper}>
            <button
              onClick={acceptSuggestion}
              className={styles.suggestionButton}
            >
              <Icon name="location" size="sm" className="color-accent" />
              {suggestion}
              <span className={styles.suggestionHint}>
                (Press Tab or click to select)
              </span>
            </button>
          </div>
        )}

        {geoMessage && (
          <div className={styles.geoMessageWrapper}>
            <div
              className={`${styles.geoMessage} ${geoLoading ? styles.loading : styles.error}`}
            >
              {geoMessage}
            </div>
          </div>
        )}
      </div>

      <div className={styles.mapSection}>
        <WorldMap
          location={dragLocation || location}
          onLocationChange={handleMapClickWithClear}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      </div>
    </div>
  );
}
