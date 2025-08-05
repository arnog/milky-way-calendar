import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Location } from "../types/astronomy";
import { useLocation } from "../hooks/useLocation";
import { useTonightEvents } from "../hooks/useTonightEvents";
import { locationToSlug } from "../utils/urlHelpers";
import LocationPopover from "./LocationPopover";
import StarRating from "./StarRating";
import { Icon } from "./Icon";
import {
  formatOptimalViewingTime,
  formatOptimalViewingDuration,
} from "../utils/integratedOptimalViewing";
import FormattedTime from "./FormattedTime";
import AstronomicalClock from "./AstronomicalClock";
import Tooltip from "./Tooltip";
import { getMoonPhaseIcon, getMoonPhaseName } from "../utils/moonPhase";
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
      const popover = document.getElementById('tonight-location-popover-failed');
      if (popover) {
        popover.showPopover?.();
      }
    }
  }, [geolocationFailed, showLocationPopover]);

  // Handle location changes with navigation
  const handleLocationChange = (
    newLocation: Location,
    shouldClose?: boolean
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
        <h2 className={styles.title}>
          Tonight
          <div>
            {events && events.visibility > 0 && (
              <StarRating
                rating={events.visibility}
                size="lg"
                reason={events.visibilityReason}
              />
            )}
          </div>
        </h2>
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
              className="global-icon-small color-accent"
              baselineOffset={4}
            />{" "}
            {locationData?.displayName ?? "Loading location..."}
          </button>
        </Tooltip>
        {locationData?.bortleRating !== null && (
          <Link to="/faq#bortle-scale" className={styles.bortleRating}>
            Bortle {locationData?.bortleRating?.toFixed(1)}
          </Link>
        )}

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

      {/* Astronomical Clock Visualization- For now, we're going to keep it EXPERIMENTAL and hide it.*/}
      <AstronomicalClock events={events} currentDate={currentDate} size={600} />

      <div className={styles.eventGrid}>
        {/* Sun Events */}
        <div className={styles.eventSection}>
          <h3 className={styles.sectionTitle}>Sun</h3>
          {(events.sunSet || events.nightStart) && (
            <div className={styles.eventRow}>
              {events.sunSet && (
                <>
                  <Tooltip content="Sunset (Civil Twilight)">
                    <Icon
                      name="sunset"
                      className={`global-icon-medium color-orange-400`}
                    />
                  </Tooltip>
                  <FormattedTime date={events.sunSet} />
                </>
              )}
              {events.nightStart && (
                <>
                  <Tooltip content="Astronomical Night Start">
                    <Icon
                      name="night-rise"
                      className={`global-icon-medium`}
                    />
                  </Tooltip>
                  <FormattedTime date={events.nightStart} />
                </>
              )}
            </div>
          )}
          {(events.nightEnd || events.sunRise) && (
            <div className={styles.eventRow}>
              {events.nightEnd && (
                <>
                  <Tooltip content="Astronomical Night End">
                    <Icon
                      name="night-set"
                      className={`global-icon-medium`}
                    />
                  </Tooltip>
                  <FormattedTime date={events.nightEnd} />
                </>
              )}
              {events.sunRise && (
                <>
                  <Tooltip content="Sunrise (Civil Dawn)">
                    <Icon
                      name="sunrise"
                      className={`global-icon-medium color-yellow-200`}
                    />
                  </Tooltip>
                  <FormattedTime date={events.sunRise} />
                </>
              )}
            </div>
          )}
        </div>

        {/* Moon Events */}
        <div className={styles.eventSection}>
          <h3 className={styles.sectionTitle}>
            Moon{" "}
            <Tooltip content={getMoonPhaseName(events.moonPhase)}>
              <Icon
                name={getMoonPhaseIcon(events.moonPhase, location.lat)}
                className={`global-icon-small color-gray-300`}
                baselineOffset={2}
              />
            </Tooltip>{" "}
            <span className={styles.moonIllumination}>
              {events.moonIllumination.toFixed(0)}%
            </span>
          </h3>
          {events.moonRise && (
            <div className={styles.eventRowWide}>
              <Tooltip content="Moonrise">
                <Icon
                  name="moonrise"
                  className={`global-icon-medium color-gray-300`}
                  baselineOffset={-2}
                />
              </Tooltip>
              <FormattedTime date={events.moonRise} />
            </div>
          )}
          {events.moonSet && (
            <div className={styles.eventRowWide}>
              <Tooltip content="Moonset">
                <Icon
                  name="moonset"
                  className={`global-icon-medium color-gray-300`}
                  baselineOffset={-2}
                />
              </Tooltip>
              <FormattedTime date={events.moonSet} />
            </div>
          )}
        </div>

        {/* Galactic Core Events - only show if there's an optimal viewing window */}
        {(events.optimalWindow.startTime ||
          events.gcRise ||
          events.gcTransit ||
          events.gcSet ||
          events.maxGcAltitude > 0) && (
          <div className={styles.eventSection}>
            <h3 className={styles.sectionTitle}>Galactic Core</h3>
            {events.gcRise && (
              <div className={styles.eventRowWide}>
                <Tooltip content="Galactic Core Rise (≥10°)">
                  <Icon
                    name="galaxy-rise"
                    className={`global-icon-medium color-gray-300`}
                  />
                </Tooltip>
                <FormattedTime date={events.gcRise} />
              </div>
            )}
            {events.optimalWindow.startTime && (
              <div className={styles.eventRowWide}>
                <Tooltip content="Optimal Viewing Window">
                  <Icon
                    name="telescope"
                    className={`global-icon-medium color-gray-300`}
                  />
                </Tooltip>
                <span className="data-time">
                  <FormattedTime
                    timeString={formatOptimalViewingTime(
                      events.optimalWindow,
                      location
                    )}
                    className=""
                  />
                  <span className="small-caps"> for </span>
                  {formatOptimalViewingDuration(events.optimalWindow)}
                  {events.optimalWindow.averageScore && (
                    <span className="small-caps">
                      {" "}
                      ({Math.round(events.optimalWindow.averageScore * 100)}%
                      quality)
                    </span>
                  )}
                </span>
              </div>
            )}
            {events.gcTransit && events.maxGcAltitude > 0 && (
              <div className={styles.eventRowWide}>
                <Tooltip content="Galactic Core Transit">
                  <Icon
                    name="apex"
                    className={`global-icon-medium color-gray-300`}
                  />
                </Tooltip>
                <span className="data-time">
                  <FormattedTime date={events.gcTransit} />
                  <span className="small-caps"> at </span>
                  {events.maxGcAltitude.toFixed(0)}°
                </span>
              </div>
            )}
            {events.gcSet && (
              <div className={styles.eventRowWide}>
                <Tooltip content="Galactic Core Set (≤10°)">
                  <Icon
                    name="galaxy-set"
                    className={`global-icon-medium color-gray-300`}
                  />
                </Tooltip>
                <FormattedTime date={events.gcSet} />
              </div>
            )}
          </div>
        )}
      </div>
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
