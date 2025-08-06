import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Location } from "../types/astronomy";
import { useLocation } from "../hooks/useLocation";
import { useTonightEvents } from "../hooks/useTonightEvents";
import { locationToSlug } from "../utils/urlHelpers";
import LocationPopover from "./LocationPopover";
import StarRating from "./StarRating";
import { Icon } from "./Icon";
import AstronomicalClock from "./AstronomicalClock";
import Tooltip from "./Tooltip";
// import DarkSiteSuggestion from "./DarkSiteSuggestion";
import styles from "./TonightCard.module.css";

interface TonightCardProps {
  currentDate?: Date;
}

export default function TonightCard({ currentDate }: TonightCardProps) {
  const {
    location,
    updateLocation,
    isLoading: locationLoading,
    geolocationFailed,
  } = useLocation();
  const navigate = useNavigate();
  const { events, locationData, error } = useTonightEvents(currentDate);
  const [showLocationPopover, setShowLocationPopover] = useState(false);
  const locationButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-open LocationPopover when geolocation fails
  useEffect(() => {
    if (geolocationFailed && !showLocationPopover) {
      setShowLocationPopover(true);
      // Auto-open the popover using native API
      const popover = document.getElementById(
        "tonight-location-popover-failed",
      );
      if (popover) {
        popover.showPopover?.();
      }
    }
  }, [geolocationFailed, showLocationPopover]);

  // Handle location changes with navigation
  const handleLocationChange = (
    newLocation: Location,
    shouldClose?: boolean,
  ) => {
    updateLocation(newLocation);
    const slug = locationToSlug(newLocation);
    navigate(`/location/${slug}`, { replace: true });

    // Close popover if requested
    if (shouldClose) {
      setShowLocationPopover(false);
    }
  };

  // Show loading if location is still being determined
  if (locationLoading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Tonight</h2>
        <div className={styles.locationRequired}>
          <p className={styles.locationMessage}>
            Allow location access to display Milky Way rise and set times for
            your area
          </p>
          <div className={styles.loadingActions}>
            <div className={styles.spinner}></div>
            <p className={styles.permissionHint}>
              Waiting for location permission...
            </p>
          </div>
          <button
            ref={locationButtonRef}
            className={styles.manualLocationButton}
            popovertarget="tonight-location-popover"
          >
            <Icon name="location" />
            Choose Manually
          </button>
          <LocationPopover
            id="tonight-location-popover"
            onClose={() => setShowLocationPopover(false)}
            onLocationChange={handleLocationChange}
          />
        </div>
      </div>
    );
  }

  // Show location picker if geolocation failed or no location available
  if (geolocationFailed || !location) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Tonight</h2>
        <div className={styles.locationRequired}>
          <p className={styles.locationMessage}>
            Please select your location to see tonight's Milky Way visibility.
          </p>
          <LocationPopover
            id="tonight-location-popover-failed"
            onClose={() => setShowLocationPopover(false)}
            onLocationChange={handleLocationChange}
          />
        </div>
      </div>
    );
  }

  // Show error if something went wrong
  if (error) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Tonight</h2>
        <p className="global-error-text">{error}</p>
      </div>
    );
  }

  if (!events) return null;

  return (
    <div className={styles.container}>
      <div className={styles.centerColumn}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>Tonight</h2>
        </div>
      </div>
      <div className={styles.locationSection}>
        <Tooltip content="Change location">
          <button
            ref={locationButtonRef}
            popovertarget="tonight-location-popover-main"
            className={styles.locationLink}
          >
            <Icon
              name="location"
              size="md"
              className="color-accent"
              baselineOffset={4}
            />{" "}
            {locationData?.displayName ?? "Loading location..."}
            {locationData?.bortleRating !== null && (
              <Link to="/faq#bortle-scale" className={styles.bortleRating}>
                Bortle {locationData?.bortleRating?.toFixed(1)}
              </Link>
            )}
          </button>
        </Tooltip>

        <div>
          {events && events.visibility > 0 && (
            <StarRating
              rating={events.visibility}
              size="lg"
              reason={events.visibilityReason}
            />
          )}
        </div>

        {/* Nearest Known Location for coordinate inputs */}
        {locationData?.nearestKnownLocation && (
          <div className={styles.nearestLocationSuggestion}>
            <p className={styles.nearestLocationText}>
              Near <strong>{locationData.nearestKnownLocation.name}</strong> (
              {locationData.nearestKnownLocation.distance.toFixed(0)}km away)
            </p>
            <Link to="/explore" className={styles.exploreLink}>
              Explore more locations →
            </Link>
          </div>
        )}

        {/* Dark Site Suggestion for poor Bortle ratings 
          EXPERIMENTAL
        {locationData?.bortleRating !== null &&
          locationData?.bortleRating !== undefined &&
          locationData.bortleRating >= 4 &&
          locationData?.nearestDarkSite && (
            <DarkSiteSuggestion
              nearestDarkSite={locationData.nearestDarkSite}
            />
          )}
            */}
      </div>
      <AstronomicalClock events={events} currentDate={currentDate} size={600} />
      <div className={styles.footerSection}>
        {locationData?.description && (
          <div
            className={styles.locationDescription}
            dangerouslySetInnerHTML={{ __html: locationData.description }}
          />
        )}
      </div>
      <LocationPopover
        id="tonight-location-popover-main"
        onClose={() => setShowLocationPopover(false)}
        onLocationChange={handleLocationChange}
      />
    </div>
  );
}
