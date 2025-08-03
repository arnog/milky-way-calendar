import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Location } from "../types/astronomy";
import { useLocation } from "../hooks/useLocation";
import { locationToSlug } from "../utils/urlHelpers";
import LocationPopover from "./LocationPopover";
import StarRating from "./StarRating";
import { Icon } from "./Icon";
import {
  Observer,
  SearchRiseSet,
  Body,
  SearchAltitude,
} from "astronomy-engine";
import { calculateGalacticCenterPosition } from "../utils/galacticCenter";
import { calculateMoonData } from "../utils/moonCalculations";
import { calculateTwilightTimes } from "../utils/twilightCalculations";
import {
  calculateVisibilityRating,
  getVisibilityRatingNumber,
} from "../utils/visibilityRating";
import { getSpecialLocationDescription } from "../utils/locationParser";
import {
  getOptimalViewingWindow,
  formatOptimalViewingTime,
  formatOptimalViewingDuration,
} from "../utils/optimalViewing";
import { getBortleRatingForLocation, findNearestDarkSky, DarkSiteResult } from "../utils/lightPollutionMap";
import { findNearestSpecialLocation, calculateDistance } from "../utils/locationParser";
import { storageService } from "../services/storageService";
import FormattedTime from "./FormattedTime";
import AstronomicalClock from "./AstronomicalClock";
import { getMoonPhaseIcon, getMoonPhaseName } from "../utils/moonPhase";
import { type AstronomicalEvents } from "../types/astronomicalClock";
import styles from "./TonightCard.module.css";

interface TonightCardProps {
  currentDate?: Date;
}

interface TonightEvents extends AstronomicalEvents {
  visibility: number;
  visibilityReason?: string;
}


export default function TonightCard({
  currentDate,
}: TonightCardProps) {
  const { location, updateLocation } = useLocation();
  const navigate = useNavigate();
  const [events, setEvents] = useState<TonightEvents | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationPopover, setShowLocationPopover] = useState(false);
  const [locationDisplayName, setLocationDisplayName] = useState<string>("");
  const [locationDescription, setLocationDescription] = useState<string | null>(
    null
  );
  const [bortleRating, setBortleRating] = useState<number | null>(null);
  const [nearestDarkSite, setNearestDarkSite] = useState<DarkSiteResult | null>(null);
  const [nearestKnownLocation, setNearestKnownLocation] = useState<{name: string, distance: number} | null>(null);
  const locationButtonRef = useRef<HTMLButtonElement>(null);

  // Handle location changes with navigation
  const handleLocationChange = (newLocation: Location) => {
    updateLocation(newLocation);
    const slug = locationToSlug(newLocation);
    navigate(`/location/${slug}`, { replace: true });
  };

  // Update location display name and description when location changes
  useEffect(() => {
    // Don't update if location is not available
    if (!location) {
      return;
    }
    const savedLocationData = storageService.getLocationData();
    if (savedLocationData?.matchedName) {
      setLocationDisplayName(savedLocationData.matchedName);
    } else {
      setLocationDisplayName(
        `${location.lat.toFixed(1)}, ${location.lng.toFixed(1)}`
      );
    }

    // Get special location description if available
    // Pass the matched name from storage to help find descriptions for nearby locations
    const matchedName = savedLocationData?.matchedName;
    const description = getSpecialLocationDescription(location, matchedName);
    setLocationDescription(description);
    
    // Find nearest known location for coordinates display
    const nearestSpecial = findNearestSpecialLocation(location);
    // Check if this is a coordinate location (no matched name in storage)
    const hasMatchedName = !!savedLocationData?.matchedName;
    
    if (nearestSpecial && !hasMatchedName) {
      const distance = calculateDistance(location, nearestSpecial.location);
      setNearestKnownLocation({
        name: nearestSpecial.matchedName || 'Nearby location',
        distance: distance
      });
    } else {
      setNearestKnownLocation(null);
    }
    
    // Fetch Bortle rating for the location
    getBortleRatingForLocation({ lat: location.lat, lng: location.lng })
      .then(rating => {
        setBortleRating(rating);
        
        // If Bortle rating is 4 or higher (poor), find nearest dark site
        if (rating !== null && rating >= 4) {
          findNearestDarkSky(
            { lat: location.lat, lng: location.lng },
            500 // 500km search radius
          )
            .then(darkSite => setNearestDarkSite(darkSite))
            .catch(error => {
              console.error("Error finding nearest dark site:", error);
              setNearestDarkSite(null);
            });
        } else {
          setNearestDarkSite(null);
        }
      })
      .catch(error => {
        console.error("Error fetching Bortle rating:", error);
        setBortleRating(null);
        setNearestDarkSite(null);
      });
  }, [location]);

  useEffect(() => {
    // Don't calculate if location is not available
    if (!location) {
      return;
    }

    const calculateTonight = async () => {
      setIsLoading(true);

      try {
        const now = currentDate || new Date();
        const observer = new Observer(location.lat, location.lng, 0);

        // Calculate sun times using astronomy-engine
        const sunset = SearchRiseSet(Body.Sun, observer, -1, now, 1);
        const sunrise = SearchRiseSet(Body.Sun, observer, +1, now, 1);
        const tomorrowSunrise = SearchRiseSet(
          Body.Sun,
          observer,
          +1,
          new Date(now.getTime() + 24 * 60 * 60 * 1000),
          1
        );

        // Calculate astronomical twilight times
        const astronomicalDusk = SearchAltitude(
          Body.Sun,
          observer,
          -1,
          now,
          1,
          -18
        );
        const astronomicalDawn = SearchAltitude(
          Body.Sun,
          observer,
          +1,
          new Date(now.getTime() + 24 * 60 * 60 * 1000),
          1,
          -18
        );

        // Use existing calculateMoonData function instead of duplicating calculations
        const moonData = calculateMoonData(now, location);

        // Calculate Galactic Core times using the existing utility
        const gcData = calculateGalacticCenterPosition(now, location);

        // Use the calculated GC data which already includes rise/set times
        const gcRise = gcData.riseTime;
        const gcSet = gcData.setTime;
        const gcTransit = gcData.transitTime;
        const maxAltitude = gcData.altitude;

        // Calculate optimal viewing window using integrated time-based analysis
        const twilightData = calculateTwilightTimes(now, location);
        const optimalWindow = getOptimalViewingWindow(
          gcData,
          moonData,
          twilightData,
          location,
          now,
          0.3 // Decent viewing threshold
        );

        // Calculate visibility rating for tonight using the consistent method
        // Recalculate GC data at the optimal viewing time for accurate visibility rating
        let gcDataForRating = gcData;
        if (optimalWindow.startTime) {
          gcDataForRating = calculateGalacticCenterPosition(
            optimalWindow.startTime,
            location
          );
        }

        const visibilityResult = calculateVisibilityRating(
          gcDataForRating,
          moonData,
          twilightData,
          optimalWindow,
          location,
          now
        );
        const visibility = getVisibilityRatingNumber(visibilityResult);
        const visibilityReason =
          typeof visibilityResult === "object"
            ? visibilityResult.reason
            : undefined;

        // For "Tonight" viewing, show events from today onwards
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0); // Start of today

        setEvents({
          sunRise:
            sunrise && sunrise.date > now
              ? sunrise.date
              : tomorrowSunrise?.date,
          sunSet: sunset && sunset.date > now ? sunset.date : undefined,
          astronomicalTwilightEnd:
            astronomicalDusk && astronomicalDusk.date > now
              ? astronomicalDusk.date
              : undefined,
          astronomicalTwilightStart: astronomicalDawn?.date,
          moonRise:
            moonData.rise && moonData.rise > now ? moonData.rise : undefined,
          moonSet:
            moonData.set && moonData.set > now ? moonData.set : undefined,
          gcRise: gcRise && gcRise >= todayStart ? gcRise : undefined,
          gcTransit: gcTransit || undefined,
          gcSet: gcSet && gcSet > now ? gcSet : undefined,
          maxGcAltitude: maxAltitude,
          moonPhase: moonData.phase,
          moonIllumination: moonData.illumination * 100,
          visibility,
          visibilityReason,
          optimalWindow,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("TonightCard: Error during calculation:", error);
        setIsLoading(false);
      }
    };

    calculateTonight();
  }, [location, currentDate]);

  // Show loading if location is not available yet or if loading data
  if (!location || isLoading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Tonight</h2>
        <p className="global-loading-text">
          {!location ? "Loading location..." : "Calculating astronomical events..."}
        </p>
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
          {locationDisplayName}
        </button>
        {bortleRating !== null && (
          <Link to="/faq#bortle-scale" className={styles.bortleRating}>
            Bortle {bortleRating.toFixed(1)}
          </Link>
        )}
        
        {/* Nearest Known Location for coordinate inputs */}
        {nearestKnownLocation && (
          <div className={styles.nearestLocationSuggestion}>
            <p className={styles.nearestLocationText}>
              Near <strong>{nearestKnownLocation.name}</strong> ({nearestKnownLocation.distance.toFixed(0)}km away)
            </p>
            <Link to="/explore" className={styles.exploreLink}>
              Explore more locations →
            </Link>
          </div>
        )}
        
        {/* Dark Site Suggestion for poor Bortle ratings */}
        {bortleRating !== null && bortleRating >= 4 && nearestDarkSite && (
          <div className={styles.darkSiteSuggestion}>
            <p className={styles.suggestionText}>
              Consider visiting a darker location for better Milky Way visibility:
            </p>
            <div className={styles.suggestionSite}>
              <strong>{nearestDarkSite.nearestKnownSite?.name || `Dark site ${nearestDarkSite.distance.toFixed(0)}km away`}</strong>
              {nearestDarkSite.nearestKnownSite && (
                <span className={styles.siteDistance}>
                  {nearestDarkSite.distance.toFixed(0)}km away
                </span>
              )}
              <span className={styles.siteBortle}>
                Bortle {nearestDarkSite.bortleScale.toFixed(1)}
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
        events={{
          sunRise: events.sunRise,
          sunSet: events.sunSet,
          astronomicalTwilightEnd: events.astronomicalTwilightEnd,
          astronomicalTwilightStart: events.astronomicalTwilightStart,
          moonRise: events.moonRise,
          moonSet: events.moonSet,
          moonIllumination: events.moonIllumination,
          moonPhase: events.moonPhase,
          gcRise: events.gcRise,
          gcSet: events.gcSet,
          gcTransit: events.gcTransit,
          maxGcAltitude: events.maxGcAltitude,
          optimalWindow: events.optimalWindow
        }}
        location={location}
        currentDate={currentDate}
        size={600}
      />

      <div className={styles.eventGrid}>
        {/* Sun Events */}
        <div className={styles.eventSection}>
          <h3 className={styles.sectionTitle}>Sun</h3>
          {(events.sunSet || events.astronomicalTwilightEnd) && (
            <div className={styles.eventRow}>
              {events.sunSet && (
                <>
                  <Icon
                    name="sunset"
                    title="Sunset (Civil Twilight)"
                    className={`global-icon-medium color-orange-400`}
                  />
                  <FormattedTime
                    date={events.sunSet}
                    location={location}
                    className="data-time"
                  />
                </>
              )}
              {events.astronomicalTwilightEnd && (
                <>
                  <Icon
                    name="night-rise"
                    title="Astronomical Night Start"
                    className={`global-icon-medium`}
                  />
                  <FormattedTime
                    date={events.astronomicalTwilightEnd}
                    location={location}
                    className="data-time"
                  />
                </>
              )}
            </div>
          )}
          {(events.astronomicalTwilightStart || events.sunRise) && (
            <div className={styles.eventRow}>
              {events.astronomicalTwilightStart && (
                <>
                  <Icon
                    name="night-set"
                    title="Astronomical Night End"
                    className={`global-icon-medium`}
                  />
                  <FormattedTime
                    date={events.astronomicalTwilightStart}
                    location={location}
                    className="data-time"
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
                  <FormattedTime
                    date={events.sunRise}
                    location={location}
                    className="data-time"
                  />
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
              <FormattedTime
                date={events.moonRise}
                location={location}
                className="data-time"
              />
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
              <FormattedTime
                date={events.moonSet}
                location={location}
                className="data-time"
              />
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
                <FormattedTime
                  date={events.gcRise}
                  location={location}
                  className="data-time"
                />
              </div>
            )}
            {events.optimalWindow.startTime && (
              <div className={styles.eventRowWide}>
                <Icon
                  name="telescope"
                  title={
                    events.optimalWindow.isIntegrated
                      ? "Quality-Based Viewing Window"
                      : "Optimal Viewing Window"
                  }
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
                  {events.optimalWindow.isIntegrated &&
                    events.optimalWindow.averageScore && (
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
                    location={location}
                    className="data-time"
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
                <FormattedTime
                  date={events.gcSet}
                  location={location}
                  className="data-time"
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.footerSection}>
        {locationDescription && (
          <div
            className={styles.locationDescription}
            dangerouslySetInnerHTML={{ __html: locationDescription }}
          />
        )}
      </div>

      {showLocationPopover && (
        <LocationPopover
          location={location}
          triggerRef={locationButtonRef}
          onClose={() => setShowLocationPopover(false)}
          onLocationChange={handleLocationChange}
        />
      )}
    </div>
  );
}
