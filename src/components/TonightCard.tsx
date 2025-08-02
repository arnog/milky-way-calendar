import { useEffect, useState, useRef } from "react";
import { Location } from "../types/astronomy";
import LocationPopover from "./LocationPopover";
import StarRating from "./StarRating";
import { Icon } from "./Icon";
import {
  Observer,
  Horizon,
  SearchRiseSet,
  Body,
  SearchAltitude,
} from "astronomy-engine";
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
import FormattedTime from "./FormattedTime";
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

// Helper function to get moon phase icon name
const getMoonPhaseIcon = (phase: number, latitude: number): string => {
  // Phase is 0-1, where 0.5 is full moon
  // In southern hemisphere, phases appear flipped horizontally
  const isNorthernHemisphere = latitude >= 0;

  // New Moon and Full Moon appear the same in both hemispheres
  if (phase < 0.0625 || phase >= 0.9375) return "moon-new"; // New Moon
  if (phase >= 0.4375 && phase < 0.5625) return "moon-full"; // Full Moon

  // For crescent and quarter phases, flip the icons in southern hemisphere
  if (isNorthernHemisphere) {
    // Northern hemisphere - standard orientation
    if (phase < 0.1875) return "moon-waxing-crescent"; // Waxing Crescent
    if (phase < 0.3125) return "moon-first-quarter"; // First Quarter
    if (phase < 0.4375) return "moon-waxing-gibbous"; // Waxing Gibbous
    if (phase < 0.6875) return "moon-waning-gibbous"; // Waning Gibbous
    if (phase < 0.8125) return "moon-third-quarter"; // Third Quarter
    return "moon-waning-crescent"; // Waning Crescent
  } else {
    // Southern hemisphere - flip waxing/waning phases
    if (phase < 0.1875) return "moon-waning-crescent"; // Waxing Crescent (appears as waning crescent)
    if (phase < 0.3125) return "moon-third-quarter"; // First Quarter (appears as third quarter)
    if (phase < 0.4375) return "moon-waning-gibbous"; // Waxing Gibbous (appears as waning gibbous)
    if (phase < 0.6875) return "moon-waxing-gibbous"; // Waning Gibbous (appears as waxing gibbous)
    if (phase < 0.8125) return "moon-first-quarter"; // Third Quarter (appears as first quarter)
    return "moon-waxing-crescent"; // Waning Crescent (appears as waxing crescent)
  }
};

// Helper function to get moon phase name
const getMoonPhaseName = (phase: number): string => {
  // Phase is 0-1, where 0.5 is full moon
  if (phase < 0.0625 || phase >= 0.9375) return "New Moon";
  if (phase < 0.1875) return "Waxing Crescent";
  if (phase < 0.3125) return "First Quarter";
  if (phase < 0.4375) return "Waxing Gibbous";
  if (phase < 0.5625) return "Full Moon";
  if (phase < 0.6875) return "Waning Gibbous";
  if (phase < 0.8125) return "Third Quarter";
  return "Waning Crescent";
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

        // Calculate Galactic Core times using the existing utility
        const gcData = calculateGalacticCenterPosition(now, location);
        
        // Use the calculated GC data which already includes rise/set times
        const gcRise = gcData.riseTime;
        const gcSet = gcData.setTime;
        const gcTransit = gcData.transitTime;
        const maxAltitude = gcData.altitude;

        // Calculate optimal viewing window using the same logic as Calendar
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
          gcTransit: gcTransit,
          gcSet: gcSet && gcSet > now ? gcSet : undefined,
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

  if (!events) return null;

  return (
    <div className={styles.container}>
      <div className={styles.centerColumn}>
        <h2 className={styles.title}>
          Tonight
          <div>
            {events && events.visibility > 0 && (
              <StarRating rating={events.visibility} size="lg" />
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
                  title="Optimal Viewing Window"
                  className={`global-icon-medium color-gray-300`}
                />
                <span className="data-time">
                  <FormattedTime 
                    timeString={formatOptimalViewingTime(events.optimalWindow, location)}
                    className=""
                  />
                  <span className="small-caps"> for </span>
                  {formatOptimalViewingDuration(events.optimalWindow)}
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
          onLocationChange={onLocationChange}
        />
      )}
    </div>
  );
}
