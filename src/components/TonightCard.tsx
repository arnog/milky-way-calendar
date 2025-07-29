import { useEffect, useState } from "react";
import { Location } from "../types/astronomy";
import {
  Observer,
  Equator,
  Horizon,
  SearchRiseSet,
  NextMoonPhase,
  MoonPhase,
  Body,
} from "astronomy-engine";
import SunCalc from "suncalc";
import { getMoonPhaseEmoji } from "../utils/moonCalculations";
import { getVisibilityRating } from "../utils/visibilityRating";

interface TonightCardProps {
  location: Location;
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
  bortleScale: number;
  visibility: number;
}

export default function TonightCard({ location }: TonightCardProps) {
  const [events, setEvents] = useState<TonightEvents | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateTonight = async () => {
      setIsLoading(true);

      try {
        const now = new Date();
        const observer = new Observer(location.lat, location.lng, 0);

        // Calculate sun times using SunCalc
        const sunTimes = SunCalc.getTimes(now, location.lat, location.lng);
        const tomorrowSunTimes = SunCalc.getTimes(
          new Date(now.getTime() + 24 * 60 * 60 * 1000),
          location.lat,
          location.lng
        );

        // Calculate moon times
        const moonTimes = SunCalc.getMoonTimes(now, location.lat, location.lng);
        const moonIllumination = SunCalc.getMoonIllumination(now);

        // Calculate Galactic Center times
        const gcRa = 17.759; // hours
        const gcDec = -29.008; // degrees
        const gcEquator: Equator = { ra: gcRa, dec: gcDec };

        // Find GC rise/set times
        // Note: SearchRiseSet doesn't work with custom star coordinates, so we'll skip this
        const gcRiseSearch = null;
        const gcSetSearch = null;

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

        // Estimate Bortle scale based on location
        const bortleScale = estimateBortleScale(location);

        // Calculate visibility rating for tonight
        const visibility = calculateTonightVisibility(
          maxAltitude,
          moonIllumination.fraction,
          sunTimes.astronomicalDusk,
          tomorrowSunTimes.astronomicalDawn
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
          gcRise: gcRiseSearch ? new Date(gcRiseSearch.time.date) : undefined,
          gcTransit: transitTime,
          gcSet: gcSetSearch ? new Date(gcSetSearch.time.date) : undefined,
          maxGcAltitude: maxAltitude,
          moonPhase: moonIllumination.phase,
          moonIllumination: moonIllumination.fraction * 100,
          bortleScale,
          visibility,
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
    if (!date) return "—";
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const estimateBortleScale = (loc: Location): number => {
    // Check if location is in a dark sky park
    const darkSkyParkNames = [
      "Natural Bridges",
      "Death Valley",
      "Joshua Tree",
      "Arches",
      "Canyonlands",
      "Capitol Reef",
      "Bryce Canyon",
      "Grand Canyon",
      "Cherry Springs",
      "Big Bend",
      "Anza-Borrego",
      "Headlands",
      "Kerry",
      "Mayo",
      "NamibRand",
      "Aotea",
    ];

    // This is a simplified estimation - in reality you'd want to use
    // light pollution data or APIs
    const matchedLocation = localStorage.getItem("milkyway-location");
    if (matchedLocation) {
      const parsed = JSON.parse(matchedLocation);
      if (parsed.matchedName) {
        const isDarkSkyPark = darkSkyParkNames.some((name) =>
          parsed.matchedName.toLowerCase().includes(name.toLowerCase())
        );
        if (isDarkSkyPark) return 1;
      }
    }

    // Default estimation based on latitude
    if (Math.abs(loc.lat) > 50) return 3;
    if (Math.abs(loc.lat) > 40) return 4;
    return 5;
  };

  const calculateTonightVisibility = (
    maxAlt: number,
    moonFraction: number,
    duskTime?: Date,
    dawnTime?: Date
  ): number => {
    // Simplified visibility calculation for tonight
    if (maxAlt < 20) return 0;
    if (moonFraction > 0.5) return 1;
    if (moonFraction > 0.3) return 2;
    if (maxAlt > 40) return 4;
    return 3;
  };

  const getStarsDisplay = (rating: number): string => {
    return "★".repeat(rating) + "☆".repeat(4 - rating);
  };

  if (isLoading) {
    return (
      <div className="glass-morphism p-6 mb-8">
        <h2 className="text-6xl font-semibold mb-4">Tonight</h2>
        <p className="text-blue-200">Calculating astronomical events...</p>
      </div>
    );
  }

  if (!events) return null;

  return (
    <div className="glass-morphism p-6 mb-8">
      <h2 className="text-6xl font-semibold mb-4">Tonight</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xl">
        {/* Sun Events */}
        <div className="space-y-2">
          <h3 className="font-semibold text-3xl mb-2">Sun</h3>
          {events.sunSet && (
            <div className="flex justify-between">
              <span className="text-blue-200">Sunset (Civil Dawn)</span>
              <span className="font-mono">{formatTime(events.sunSet)}</span>
            </div>
          )}
          {events.astronomicalTwilightEnd && (
            <div className="flex justify-between">
              <span className="text-gray-300">Astronomical Twilight End</span>
              <span className="font-mono">
                {formatTime(events.astronomicalTwilightEnd)}
              </span>
            </div>
          )}
          {events.astronomicalTwilightStart && (
            <div className="flex justify-between">
              <span className="text-gray-300">Astronomical Twilight Start</span>
              <span className="font-mono">
                {formatTime(events.astronomicalTwilightStart)}
              </span>
            </div>
          )}
          {events.sunRise && (
            <div className="flex justify-between">
              <span className="text-gray-300">Sunrise (Civil Twilight)</span>
              <span className="font-mono">{formatTime(events.sunRise)}</span>
            </div>
          )}
        </div>

        {/* Moon Events */}
        <div className="space-y-2">
          <h3 className="font-semibold text-3xl mb-2">Moon</h3>
          {events.moonRise && (
            <div className="flex justify-between">
              <span className="text-gray-300">Moonrise</span>
              <span className="font-mono">{formatTime(events.moonRise)}</span>
            </div>
          )}
          {events.moonSet && (
            <div className="flex justify-between">
              <span className="text-gray-300">Moonset</span>
              <span className="font-mono">{formatTime(events.moonSet)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-300">Phase</span>
            <span className="text-lg">
              {getMoonPhaseEmoji(events.moonPhase)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Illumination</span>
            <span className="font-mono">
              {events.moonIllumination.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Galactic Center Events */}
        <div className="space-y-2">
          <h3 className="font-semibold text-3xl mb-2">Galactic Center</h3>
          {events.gcRise && (
            <div className="flex justify-between">
              <span className="text-gray-300">Rise</span>
              <span className="font-mono">{formatTime(events.gcRise)}</span>
            </div>
          )}
          {events.gcTransit && (
            <div className="flex justify-between">
              <span className="text-gray-300">Transit</span>
              <span className="font-mono">{formatTime(events.gcTransit)}</span>
            </div>
          )}
          {events.gcSet && (
            <div className="flex justify-between">
              <span className="text-gray-300">Set</span>
              <span className="font-mono">{formatTime(events.gcSet)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-300">Max Altitude</span>
            <span className="font-mono">
              {events.maxGcAltitude.toFixed(0)}°
            </span>
          </div>
        </div>

        {/* Viewing Conditions */}
        <div className="space-y-2">
          <h3 className="font-semibold text-3xl mb-2">Conditions</h3>
          <div className="flex justify-between">
            <span className="text-gray-300">Bortle Scale</span>
            <span className="font-mono">Class {events.bortleScale}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Visibility</span>
            <span className="text-lg">
              {getStarsDisplay(events.visibility)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
