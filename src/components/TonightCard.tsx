import { useEffect, useState, useRef } from "react";
import { Location } from "../types/astronomy";
import LocationPopover from "./LocationPopover";
import StarRating from "./StarRating";
import {
  Observer,
  Horizon,
  SearchRiseSet,
  Body,
  SearchAltitude,
} from "astronomy-engine";
import { getMoonPhaseEmoji } from "../utils/moonCalculations";
import { calculateGalacticCenterPosition } from "../utils/galacticCenter";
import { calculateMoonData } from "../utils/moonCalculations";
import { calculateTwilightTimes } from "../utils/twilightCalculations";
import {
  formatTimeInLocationTimezone,
  calculateVisibilityRating,
} from "../utils/visibilityRating";
import { getSpecialLocationDescription } from "../utils/locationParser";
import {
  calculateOptimalViewingWindow,
  formatOptimalViewingTime,
  formatOptimalViewingDuration,
  OptimalViewingWindow,
} from "../utils/optimalViewing";
import styles from "./TonightCard.module.css";

interface TonightCardProps {
  location: Location;
  onLocationChange: (location: Location) => void;
}

interface TonightEvents {
  sunRise?: Date;
  sunSet?: Date;
  astronomicalTwilightEnd?: Date;
  astronomicalTwilightStart?: Date;
  moonRise?: Date;
  moonSet?: Date;
  gcRise?: Date;
  gcTransit?: Date;
  gcSet?: Date;
  maxGcAltitude: number;
  moonPhase: number;
  moonIllumination: number;
  visibility: number;
  optimalWindow: OptimalViewingWindow;
}

// SVG Icon component with custom tooltip
const Icon = ({
  name,
  title,
  className = "",
}: {
  name: string;
  title?: string;
  className?: string;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="global-icon-wrapper"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={() => setShowTooltip(true)}
      onTouchEnd={() => setTimeout(() => setShowTooltip(false), 2000)}
    >
      <svg className={className}>
        <use href={`/icons.svg#${name}`} />
      </svg>
      {showTooltip && title && (
        <div className="global-tooltip">
          {title}
          <div className="global-tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
};

export default function TonightCard({
  location,
  onLocationChange,
}: TonightCardProps) {
  const [events, setEvents] = useState<TonightEvents | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationPopover, setShowLocationPopover] = useState(false);
  const [locationDisplayName, setLocationDisplayName] = useState<string>("");
  const [locationDescription, setLocationDescription] = useState<string | null>(
    null
  );
  const locationButtonRef = useRef<HTMLButtonElement>(null);

  // Update location display name and description when location changes
  useEffect(() => {
    const savedLocation = localStorage.getItem("milkyway-location");
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        if (parsed.matchedName) {
          setLocationDisplayName(parsed.matchedName);
        } else {
          setLocationDisplayName(
            `${location.lat.toFixed(1)}, ${location.lng.toFixed(1)}`
          );
        }
      } catch {
        setLocationDisplayName(
          `${location.lat.toFixed(1)}, ${location.lng.toFixed(1)}`
        );
      }
    } else {
      setLocationDisplayName(
        `${location.lat.toFixed(1)}, ${location.lng.toFixed(1)}`
      );
    }

    // Get special location description if available
    const description = getSpecialLocationDescription(location);
    setLocationDescription(description);
  }, [location]);

  useEffect(() => {
    const calculateTonight = async () => {
      setIsLoading(true);

      try {
        const now = new Date();
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

        // Calculate Galactic Core times
        const gcRa = 17.759; // hours
        const gcDec = -29.008; // degrees

        // Find GC rise/set times
        // Note: SearchRiseSet doesn't work with custom star coordinates, so we'll skip this

        // Calculate GC transit and max altitude
        let maxAltitude = 0;
        let transitTime: Date | undefined;

        // Sample GC altitude throughout the night
        for (let h = 0; h < 24; h += 0.5) {
          const checkTime = new Date(now.getTime() + h * 60 * 60 * 1000);
          const horizon = Horizon(checkTime, observer, gcRa, gcDec, "normal");
          if (horizon.altitude > maxAltitude) {
            maxAltitude = horizon.altitude;
            transitTime = checkTime;
          }
        }

        // Calculate optimal viewing window using the same logic as Calendar
        const gcData = calculateGalacticCenterPosition(now, location);
        const twilightData = calculateTwilightTimes(now, location);
        const optimalWindow = calculateOptimalViewingWindow(
          gcData,
          moonData,
          twilightData
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

        const visibility = calculateVisibilityRating(
          gcDataForRating,
          moonData,
          twilightData,
          optimalWindow,
          location
        );

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
          gcRise: undefined,
          gcTransit: transitTime,
          gcSet: undefined,
          maxGcAltitude: maxAltitude,
          moonPhase: moonData.phase,
          moonIllumination: moonData.illumination * 100,
          visibility,
          optimalWindow,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("TonightCard: Error during calculation:", error);
        setIsLoading(false);
      }
    };

    calculateTonight();
  }, [location]);

  const formatTime = (date: Date | undefined) => {
    return formatTimeInLocationTimezone(date, location);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Tonight</h2>
        <p className="global-loading-text">Calculating astronomical events...</p>
      </div>
    );
  }

  if (!events) return null;

  return (
    <div className={styles.container}>
      <div className={styles.centerColumn}>
        <h2 className={styles.title}>
          Tonight{" "}
          <div>
            {events && <StarRating rating={events.visibility} size="lg" />}
          </div>
        </h2>
      </div>

      <div className={styles.eventGrid}>
        {/* Sun Events */}
        <div className={styles.eventSection}>
          <h3 className={styles.sectionTitle}>Sun</h3>
          {(events.sunSet || events.astronomicalTwilightEnd) && (
            <div className={styles.eventRow}>
              {events.sunSet && (
                <>
                  <Icon
                    name="set"
                    title="Sunset (Civil Dawn)"
                    className={`global-icon-medium global-icon-blue-300`}
                  />
                  <span className="global-mono-time">{formatTime(events.sunSet)}</span>
                </>
              )}
              {events.astronomicalTwilightEnd && (
                <>
                  <Icon
                    name="set2"
                    title="Astronomical Twilight End"
                    className={`global-icon-medium global-icon-blue-400`}
                  />
                  <span className="global-mono-time">
                    {formatTime(events.astronomicalTwilightEnd)}
                  </span>
                </>
              )}
            </div>
          )}
          {(events.astronomicalTwilightStart || events.sunRise) && (
            <div className={styles.eventRow}>
              {events.astronomicalTwilightStart && (
                <>
                  <Icon
                    name="rise2"
                    title="Astronomical Twilight Start"
                    className={`global-icon-medium global-icon-orange-400`}
                  />
                  <span className="global-mono-time">
                    {formatTime(events.astronomicalTwilightStart)}
                  </span>
                </>
              )}
              {events.sunRise && (
                <>
                  <Icon
                    name="rise"
                    title="Sunrise (Civil Twilight)"
                    className={`global-icon-medium global-icon-yellow-200`}
                  />
                  <span className="global-mono-time">
                    {formatTime(events.sunRise)}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Moon Events */}
        <div className={styles.eventSection}>
          <h3 className={styles.sectionTitle}>
            Moon{" "}
            <span style={{ fontFamily: "Times" }}>
              {getMoonPhaseEmoji(events.moonPhase)}
            </span>{" "}
            <span className={styles.moonIllumination}>
              {events.moonIllumination.toFixed(0)}%
            </span>
          </h3>
          {events.moonRise && (
            <div className={styles.eventRowWide}>
              <Icon
                name="rise"
                title="Moonrise"
                className={`global-icon-medium global-icon-gray-300`}
              />
              <span className="global-mono-time">{formatTime(events.moonRise)}</span>
            </div>
          )}
          {events.moonSet && (
            <div className={styles.eventRowWide}>
              <Icon
                name="set"
                title="Moonset"
                className={`global-icon-medium global-icon-gray-300`}
              />
              <span className="global-mono-time">{formatTime(events.moonSet)}</span>
            </div>
          )}
        </div>

        {/* Galactic Core Events - only show if there's an optimal viewing window */}
        {(events.optimalWindow.startTime ||
          events.gcTransit ||
          events.maxGcAltitude > 0) && (
          <div className={styles.eventSection}>
            <h3 className={styles.sectionTitle}>
              Galactic Core
            </h3>
            {events.gcRise && (
              <div className={styles.eventRowWide}>
                <Icon
                  name="rise"
                  title="Galactic Core Rise"
                  className={`global-icon-medium global-icon-gray-300`}
                />
                <span className="global-mono-time">{formatTime(events.gcRise)}</span>
              </div>
            )}
            {events.optimalWindow.startTime && (
              <div className={styles.eventRowWide}>
                <Icon
                  name="rise2"
                  title="Galactic Core Rise (Optimal)"
                  className={`global-icon-medium global-icon-gray-300`}
                />
                <span className="global-mono-time">
                  {formatOptimalViewingTime(events.optimalWindow, location)} for{" "}
                  {formatOptimalViewingDuration(events.optimalWindow)}
                </span>
              </div>
            )}
            {events.gcTransit && events.maxGcAltitude > 0 && (
              <div className={styles.eventRowWide}>
                <Icon
                  name="transit"
                  title="Maximum Altitude"
                  className={`global-icon-medium global-icon-gray-300`}
                />
                <span className="global-mono-time">
                  {events.maxGcAltitude.toFixed(0)}° at{" "}
                  {formatTime(events.gcTransit)}
                </span>
              </div>
            )}
            {events.gcSet && (
              <div className={styles.eventRowWide}>
                <Icon
                  name="set"
                  title="Galactic Core Set"
                  className={`global-icon-medium global-icon-gray-300`}
                />
                <span className="global-mono-time">{formatTime(events.gcSet)}</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.footerSection}>
        <div className={styles.footerCenter}>
          <button
            ref={locationButtonRef}
            onClick={() => setShowLocationPopover(true)}
            className={styles.locationLink}
          >
            📍 {locationDisplayName}
          </button>
        </div>
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
          onLocationChange={onLocationChange}
        />
      )}
    </div>
  );
}