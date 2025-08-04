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
import { getMoonPhaseIcon, getMoonPhaseName } from "../utils/moonPhase";
import styles from "./TonightCard.module.css";

interface TonightCardProps {
  currentDate?: Date;
}

export default function TonightCard({ currentDate }: TonightCardProps) {
  const { location, updateLocation, isLoading: locationLoading, geolocationFailed } = useLocation();
  const navigate = useNavigate();
  const { events, locationData, isLoading, error } = useTonightEvents(currentDate);
  const [showLocationPopover, setShowLocationPopover] = useState(false);
  const locationButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-open LocationPopover when geolocation fails
  useEffect(() => {
    if (geolocationFailed && !showLocationPopover) {
      setShowLocationPopover(true);
    }
  }, [geolocationFailed, showLocationPopover]);

  // Handle location changes with navigation
  const handleLocationChange = (newLocation: Location) => {
    updateLocation(newLocation);
    const slug = locationToSlug(newLocation);
    navigate(`/location/${slug}`, { replace: true });
  };

  // Show loading if location is still being determined
  if (locationLoading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Tonight</h2>
        <div className={styles.locationRequired}>
          <p className={styles.locationMessage}>
            Determining your location...
          </p>
          <div className={styles.loadingActions}>
            <div className={styles.spinner}></div>
            <button
              ref={locationButtonRef}
              className={styles.manualLocationButton}
              onClick={() => setShowLocationPopover(true)}
            >
              <Icon name="location" />
              Choose Manually
            </button>
          </div>
          {showLocationPopover && (
            <LocationPopover
              onClose={() => setShowLocationPopover(false)}
              onLocationChange={handleLocationChange}
              triggerRef={locationButtonRef}
            />
          )}
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
          {/* Hidden button just for popover positioning */}
          <button
            ref={locationButtonRef}
            style={{ visibility: 'hidden', position: 'absolute' }}
          >
            Choose Location
          </button>
          {showLocationPopover && (
            <LocationPopover
              onClose={() => setShowLocationPopover(false)}
              onLocationChange={handleLocationChange}
              triggerRef={locationButtonRef}
            />
          )}
        </div>
      </div>
    );
  }

  // Show loading if loading astronomical data
  if (isLoading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Tonight</h2>
        <p className="global-loading-text">
          Calculating astronomical events...
        </p>
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
        <button
          ref={locationButtonRef}
          onClick={() => setShowLocationPopover(true)}
          className={styles.locationLink}
        >
          <Icon
            name="location"
            title="Change location"
            className="global-icon-small color-accent"
            baselineOffset={4}
          />{" "}
          {locationData?.displayName || "Loading location..."}
        </button>
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

        {/* Dark Site Suggestion for poor Bortle ratings */}
        {locationData?.bortleRating !== null &&
          locationData?.bortleRating !== undefined &&
          locationData.bortleRating >= 4 &&
          locationData?.nearestDarkSite && (
            <div className={styles.darkSiteSuggestion}>
              <p className={styles.suggestionText}>
                Consider visiting a darker location for better Milky Way
                visibility:
              </p>
              <div className={styles.suggestionSite}>
                <strong>
                  {locationData.nearestDarkSite.nearestKnownSite?.name ||
                    `Dark site ${locationData.nearestDarkSite.distance.toFixed(
                      0
                    )}km away`}
                </strong>
                {locationData.nearestDarkSite.nearestKnownSite && (
                  <span className={styles.siteDistance}>
                    {locationData.nearestDarkSite.distance.toFixed(0)}km away
                  </span>
                )}
                <span className={styles.siteBortle}>
                  Bortle {locationData.nearestDarkSite.bortleScale.toFixed(1)}
                </span>
              </div>
              <Link to="/explore" className={styles.exploreLink}>
                Explore more dark sites →
              </Link>
            </div>
          )}
      </div>

      {/* Astronomical Clock Visualization */}
      <AstronomicalClock
        events={events}
        currentDate={currentDate}
        size={600}
      />

      <div className={styles.eventGrid}>
        {/* Sun Events */}
        <div className={styles.eventSection}>
          <h3 className={styles.sectionTitle}>Sun</h3>
          {(events.sunSet || events.nightStart) && (
            <div className={styles.eventRow}>
              {events.sunSet && (
                <>
                  <Icon
                    name="sunset"
                    title="Sunset (Civil Twilight)"
                    className={`global-icon-medium color-orange-400`}
                  />
                  <FormattedTime date={events.sunSet} />
                </>
              )}
              {events.nightStart && (
                <>
                  <Icon
                    name="night-rise"
                    title="Astronomical Night Start"
                    className={`global-icon-medium`}
                  />
                  <FormattedTime
                    date={events.nightStart}
                  />
                </>
              )}
            </div>
          )}
          {(events.nightEnd || events.sunRise) && (
            <div className={styles.eventRow}>
              {events.nightEnd && (
                <>
                  <Icon
                    name="night-set"
                    title="Astronomical Night End"
                    className={`global-icon-medium`}
                  />
                  <FormattedTime
                    date={events.nightEnd}
                  />
                </>
              )}
              {events.sunRise && (
                <>
                  <Icon
                    name="sunrise"
                    title="Sunrise (Civil Dawn)"
                    className={`global-icon-medium color-yellow-200`}
                  />
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
            <Icon
              name={getMoonPhaseIcon(events.moonPhase, location.lat)}
              title={getMoonPhaseName(events.moonPhase)}
              className={`global-icon-small color-gray-300`}
              baselineOffset={2}
            />{" "}
            <span className={styles.moonIllumination}>
              {events.moonIllumination.toFixed(0)}%
            </span>
          </h3>
          {events.moonRise && (
            <div className={styles.eventRowWide}>
              <Icon
                name="moonrise"
                title="Moonrise"
                className={`global-icon-medium color-gray-300`}
                baselineOffset={-2}
              />
              <FormattedTime date={events.moonRise} />
            </div>
          )}
          {events.moonSet && (
            <div className={styles.eventRowWide}>
              <Icon
                name="moonset"
                title="Moonset"
                className={`global-icon-medium color-gray-300`}
                baselineOffset={-2}
              />
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
                <Icon
                  name="galaxy-rise"
                  title="Galactic Core Rise (≥10°)"
                  className={`global-icon-medium color-gray-300`}
                />
                <FormattedTime date={events.gcRise} />
              </div>
            )}
            {events.optimalWindow.startTime && (
              <div className={styles.eventRowWide}>
                <Icon
                  name="telescope"
                  title="Optimal Viewing Window"
                  className={`global-icon-medium color-gray-300`}
                />
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
                <Icon
                  name="apex"
                  title="Galactic Core Transit"
                  className={`global-icon-medium color-gray-300`}
                />
                <span className="data-time">
                  <FormattedTime
                    date={events.gcTransit}
                  />
                  <span className="small-caps"> at </span>
                  {events.maxGcAltitude.toFixed(0)}°
                </span>
              </div>
            )}
            {events.gcSet && (
              <div className={styles.eventRowWide}>
                <Icon
                  name="galaxy-set"
                  title="Galactic Core Set (≤10°)"
                  className={`global-icon-medium color-gray-300`}
                />
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

      {showLocationPopover && (
        <LocationPopover
          triggerRef={locationButtonRef}
          onClose={() => setShowLocationPopover(false)}
          onLocationChange={handleLocationChange}
        />
      )}
    </div>
  );
}
