import { useEffect, useState, useRef } from "react";
import { Location } from "../types/astronomy";
import LocationPopover from "./LocationPopover";
import StarRating from "./StarRating";
import { Observer, Horizon } from "astronomy-engine";
import * as SunCalc from "suncalc";

// Add custom times for astronomical twilight (-18°)
SunCalc.addTime(-18, "astronomicalDawn", "astronomicalDusk");

interface ExtendedTimes extends SunCalc.GetTimesResult {
  astronomicalDawn: Date;
  astronomicalDusk: Date;
}
import { getMoonPhaseEmoji } from "../utils/moonCalculations";
import { calculateGalacticCenterPosition } from "../utils/galacticCenter";
import { calculateMoonData } from "../utils/moonCalculations";
import { calculateTwilightTimes } from "../utils/twilightCalculations";
import { formatTimeInLocationTimezone, calculateVisibilityRating } from "../utils/visibilityRating";
import {
  calculateOptimalViewingWindow,
  formatOptimalViewingTime,
  formatOptimalViewingDuration,
  OptimalViewingWindow,
} from "../utils/optimalViewing";

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
  className = "w-8 h-8",
}: {
  name: string;
  title?: string;
  className?: string;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={() => setShowTooltip(true)}
      onTouchEnd={() => setTimeout(() => setShowTooltip(false), 2000)}
    >
      <svg className={className}>
        <use href={`/src/icons.svg#${name}`} />
      </svg>
      {showTooltip && title && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xl text-white bg-gray-900 rounded shadow-lg whitespace-nowrap z-50">
          {title}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
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
  const locationButtonRef = useRef<HTMLButtonElement>(null);

  // Update location display name when location changes
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
      } catch (e) {
        setLocationDisplayName(
          `${location.lat.toFixed(1)}, ${location.lng.toFixed(1)}`
        );
      }
    } else {
      setLocationDisplayName(
        `${location.lat.toFixed(1)}, ${location.lng.toFixed(1)}`
      );
    }
  }, [location]);

  useEffect(() => {
    const calculateTonight = async () => {
      setIsLoading(true);

      try {
        const now = new Date();
        const observer = new Observer(location.lat, location.lng, 0);

        // Calculate sun times using SunCalc
        const sunTimes = SunCalc.getTimes(now, location.lat, location.lng) as ExtendedTimes;
        const tomorrowSunTimes = SunCalc.getTimes(
          new Date(now.getTime() + 24 * 60 * 60 * 1000),
          location.lat,
          location.lng
        ) as ExtendedTimes;

        // Calculate moon times
        const moonTimes = SunCalc.getMoonTimes(now, location.lat, location.lng);
        const moonIllumination = SunCalc.getMoonIllumination(now);

        // Calculate Galactic Center times
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
        const moonData = calculateMoonData(now, location);
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
            sunTimes.sunrise > now
              ? sunTimes.sunrise
              : tomorrowSunTimes.sunrise,
          sunSet: sunTimes.sunset > now ? sunTimes.sunset : undefined,
          astronomicalTwilightEnd:
            sunTimes.astronomicalDusk > now
              ? sunTimes.astronomicalDusk
              : undefined,
          astronomicalTwilightStart: tomorrowSunTimes.astronomicalDawn,
          moonRise:
            moonTimes.rise && moonTimes.rise > now ? moonTimes.rise : undefined,
          moonSet:
            moonTimes.set && moonTimes.set > now ? moonTimes.set : undefined,
          gcRise: undefined,
          gcTransit: transitTime,
          gcSet: undefined,
          maxGcAltitude: maxAltitude,
          moonPhase: moonIllumination.phase,
          moonIllumination: moonIllumination.fraction * 100,
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
      <div className="glass-morphism p-6 mb-8">
        <h2 className="text-6xl font-semibold mb-4 text-center">Tonight</h2>
        <p className="text-blue-200">Calculating astronomical events...</p>
      </div>
    );
  }

  if (!events) return null;

  return (
    <div className="glass-morphism p-6 mb-8">
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-6xl font-semibold mb-2 text-center">
          Tonight{" "}
          {events && <StarRating rating={events.visibility} size="lg" />}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-32 text-xl">
        {/* Sun Events */}
        <div className="space-y-2">
          <h3 className="font-semibold text-3xl mb-2 text-center">Sun</h3>
          {(events.sunSet || events.astronomicalTwilightEnd) && (
            <div className="flex justify-center items-center gap-2">
              {events.sunSet && (
                <>
                  <Icon
                    name="set"
                    title="Sunset (Civil Dawn)"
                    className="w-8 h-8 text-blue-300"
                  />
                  <span className="font-mono">{formatTime(events.sunSet)}</span>
                </>
              )}
              {events.astronomicalTwilightEnd && (
                <>
                  <Icon
                    name="set2"
                    title="Astronomical Twilight End"
                    className="w-8 h-8 text-blue-400"
                  />
                  <span className="font-mono">
                    {formatTime(events.astronomicalTwilightEnd)}
                  </span>
                </>
              )}
            </div>
          )}
          {(events.astronomicalTwilightStart || events.sunRise) && (
            <div className="flex justify-center items-center gap-2">
              {events.astronomicalTwilightStart && (
                <>
                  <Icon
                    name="rise2"
                    title="Astronomical Twilight Start"
                    className="w-8 h-8 text-orange-400"
                  />
                  <span className="font-mono">
                    {formatTime(events.astronomicalTwilightStart)}
                  </span>
                </>
              )}
              {events.sunRise && (
                <>
                  <Icon
                    name="rise"
                    title="Sunrise (Civil Twilight)"
                    className="w-8 h-8 text-yellow-200"
                  />
                  <span className="font-mono">
                    {formatTime(events.sunRise)}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Moon Events */}
        <div className="space-y-2">
          <h3 className="font-semibold text-3xl mb-2 text-center">
            Moon {getMoonPhaseEmoji(events.moonPhase)}{" "}
            <span className="opacity-60 text-xl">
              {events.moonIllumination.toFixed(0)}%
            </span>
          </h3>
          {events.moonRise && (
            <div className="flex justify-center items-center gap-4">
              <Icon
                name="rise"
                title="Moonrise"
                className="w-8 h-8 text-gray-300"
              />
              <span className="font-mono">{formatTime(events.moonRise)}</span>
            </div>
          )}
          {events.moonSet && (
            <div className="flex justify-center items-center gap-4">
              <Icon
                name="set"
                title="Moonset"
                className="w-8 h-8 text-gray-300"
              />
              <span className="font-mono">{formatTime(events.moonSet)}</span>
            </div>
          )}
        </div>

        {/* Galactic Center Events */}
        <div className="space-y-2">
          <h3 className="font-semibold text-3xl mb-2 text-center">
            Galactic Center
          </h3>
          {events.gcRise && (
            <div className="flex justify-center items-center gap-4">
              <Icon
                name="rise"
                title="Galactic Center Rise"
                className="w-8 h-8 text-gray-300"
              />
              <span className="font-mono">{formatTime(events.gcRise)}</span>
            </div>
          )}
          <div className="flex justify-center items-center gap-4">
            <Icon
              name="rise2"
              title="Galactic Core Rise (Optimal)"
              className="w-8 h-8 text-gray-300"
            />
            <span className="font-mono">
              {formatOptimalViewingTime(events.optimalWindow, location)} for{" "}
              {formatOptimalViewingDuration(events.optimalWindow)}
            </span>
          </div>
          {events.gcTransit && (
            <div className="flex justify-center items-center gap-4">
              <Icon
                name="transit"
                title="Maximum Altitude"
                className="w-8 h-8 text-gray-300"
              />
              <span className="font-mono">
                {events.maxGcAltitude.toFixed(0)}° at{" "}
                {formatTime(events.gcTransit)}
              </span>
            </div>
          )}
          {events.gcSet && (
            <div className="flex justify-center items-center gap-4">
              <Icon
                name="set"
                title="Galactic Center Set"
                className="w-8 h-8 text-gray-300"
              />
              <span className="font-mono">{formatTime(events.gcSet)}</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          ref={locationButtonRef}
          onClick={() => setShowLocationPopover(true)}
          className="text-blue-200 hover:text-blue-100 underline decoration-dotted transition-colors text-xl"
        >
          Near {locationDisplayName}
        </button>
      </div>

      {showLocationPopover && (
        <LocationPopover
          location={location}
          onLocationChange={(newLocation) => {
            onLocationChange(newLocation);
            setShowLocationPopover(false);
          }}
          onClose={() => setShowLocationPopover(false)}
          triggerRef={locationButtonRef}
        />
      )}
    </div>
  );
}
