import { Location, AstronomicalEvents } from "../types/astronomy";
import {
  Observer,
  SearchRiseSet,
  Body,
  SearchAltitude,
} from "astronomy-engine";
import { calculateGalacticCenterData } from "./galacticCenter";
import { calculateMoonData } from "./moonCalculations";
import { calculateTwilightTimes } from "./twilightCalculations";
import { calculateVisibilityRating } from "./visibilityRating";
import { getOptimalViewingWindow } from "./integratedOptimalViewing";
import { APP_CONFIG } from "../config/appConfig";

/**
 * Calculate all astronomical events for a given date and location
 * This is the single source of truth for astronomical event calculations
 *
 * @param date - The date to calculate events for
 * @param location - The observer's location
 * @returns All astronomical events including visibility rating
 */
export function calculateAstronomicalEvents(
  date: Date,
  location: Location,
): AstronomicalEvents {
  const observer = new Observer(location.lat, location.lng, 0);

  // Calculate sun times
  const sunset = SearchRiseSet(Body.Sun, observer, -1, date, 1);
  const sunrise = SearchRiseSet(Body.Sun, observer, +1, date, 1);

  // Calculate astronomical twilight times
  const astronomicalDusk = SearchAltitude(
    Body.Sun,
    observer,
    -1,
    date,
    1,
    APP_CONFIG.ASTRONOMY.ASTRONOMICAL_TWILIGHT_ANGLE,
  );

  // For astronomical dawn, search from the current date
  // The +1 direction means we're looking for the sun rising (altitude increasing)
  // We should search from after dusk to find the next dawn
  const searchStartForDawn = astronomicalDusk?.date || date;
  const astronomicalDawn = SearchAltitude(
    Body.Sun,
    observer,
    +1,
    searchStartForDawn,
    2, // Search up to 2 days to handle edge cases
    APP_CONFIG.ASTRONOMY.ASTRONOMICAL_TWILIGHT_ANGLE,
  );

  // Calculate moon data
  const moonData = calculateMoonData(date, location);

  // Calculate Galactic Center data
  const gcData = calculateGalacticCenterData(date, location);

  // Calculate twilight data
  const twilightData = calculateTwilightTimes(date, location);

  // Calculate optimal viewing window
  const optimalWindow = getOptimalViewingWindow(
    gcData,
    moonData,
    twilightData,
    location,
    date,
    0.3, // Decent viewing threshold
  );

  // Calculate visibility rating
  // If there's an optimal window, calculate GC data at that time for more accurate rating
  let gcDataForRating = gcData;
  if (optimalWindow.startTime) {
    gcDataForRating = calculateGalacticCenterData(
      optimalWindow.startTime,
      location,
    );
  }

  const visibilityResult = calculateVisibilityRating(
    gcDataForRating,
    moonData,
    twilightData,
    location,
    date,
  );

  // Return all events with visibility rating
  return {
    sunRise: sunrise?.date,
    sunSet: sunset?.date,
    nightStart: astronomicalDusk?.date,
    nightEnd: astronomicalDawn?.date,
    moonRise: moonData.rise || undefined,
    moonSet: moonData.set || undefined,
    moonIllumination: moonData.illumination * 100, // Convert to percentage
    moonPhase: moonData.phase,
    gcRise: gcData.riseTime || undefined,
    gcTransit: gcData.transitTime || undefined,
    gcSet: gcData.setTime || undefined,
    maxGcAltitude: gcData.altitude,
    optimalWindow,
    visibility: visibilityResult.rating,
    visibilityReason: visibilityResult.reason,
  };
}
