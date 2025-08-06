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
 * Find the event closest to the fulcrum time from a list of candidate times
 * @param fulcrum - The reference time (6pm)
 * @param candidates - Array of possible event times
 * @returns The event closest to the fulcrum, or null if no candidates
 */
function findClosestEvent(fulcrum: Date, candidates: (Date | null | undefined)[]): Date | null {
  const validCandidates = candidates.filter((d): d is Date => d != null);
  if (validCandidates.length === 0) return null;
  
  let closest = validCandidates[0];
  let minDiff = Math.abs(closest.getTime() - fulcrum.getTime());
  
  for (const candidate of validCandidates) {
    const diff = Math.abs(candidate.getTime() - fulcrum.getTime());
    if (diff < minDiff) {
      minDiff = diff;
      closest = candidate;
    }
  }
  
  return closest;
}

/**
 * Calculate astronomical events for "tonight" using 6pm as the fulcrum point
 * 
 * For each type of event, we find the occurrence closest to 6pm today.
 * This gives us the most relevant events for tonight's observation session.
 * 
 * @param currentTime - The current date/time
 * @param location - The observer's location
 * @returns All astronomical events for tonight
 */
export function calculateTonightEvents(
  currentTime: Date,
  location: Location,
): AstronomicalEvents {
  const observer = new Observer(location.lat, location.lng, 0);
  
  // Define the fulcrum point: 6pm today
  const fulcrum = new Date(currentTime);
  fulcrum.setHours(18, 0, 0, 0); // 6pm today
  
  // If it's already past midnight but before 6am, use yesterday's 6pm as fulcrum
  if (currentTime.getHours() < 6) {
    fulcrum.setDate(fulcrum.getDate() - 1);
  }
  
  // Search window: 24 hours before to 24 hours after the fulcrum
  const searchStart = new Date(fulcrum.getTime() - 24 * 60 * 60 * 1000);
  const searchEnd = new Date(fulcrum.getTime() + 24 * 60 * 60 * 1000);
  
  // Find sunset closest to 6pm (usually just after)
  const sunsetCandidates: (Date | null)[] = [];
  // Check yesterday's sunset
  const yesterdaySunset = SearchRiseSet(Body.Sun, observer, -1, searchStart, 1);
  if (yesterdaySunset) sunsetCandidates.push(yesterdaySunset.date);
  // Check today's sunset
  const todaySunset = SearchRiseSet(Body.Sun, observer, -1, fulcrum, 1);
  if (todaySunset) sunsetCandidates.push(todaySunset.date);
  // Check tomorrow's sunset (in case we're in polar regions)
  const tomorrowSunset = SearchRiseSet(Body.Sun, observer, -1, searchEnd, 1);
  if (tomorrowSunset && todaySunset?.date && tomorrowSunset.date > todaySunset.date) {
    sunsetCandidates.push(tomorrowSunset.date);
  }
  const sunset = findClosestEvent(fulcrum, sunsetCandidates);
  
  // Find sunrise - should be the morning after the sunset
  let sunrise: Date | null = null;
  if (sunset) {
    const sunriseSearch = SearchRiseSet(Body.Sun, observer, +1, sunset, 2);
    sunrise = sunriseSearch?.date || null;
  }
  
  // Find astronomical night start (dusk) - closest to 6pm, likely after sunset
  const nightStartCandidates: (Date | null)[] = [];
  if (sunset) {
    // Search for dusk around sunset
    const dusk = SearchAltitude(
      Body.Sun,
      observer,
      -1,
      new Date(sunset.getTime() - 2 * 60 * 60 * 1000), // Start 2h before sunset
      1,
      APP_CONFIG.ASTRONOMY.ASTRONOMICAL_TWILIGHT_ANGLE,
    );
    if (dusk) nightStartCandidates.push(dusk.date);
  }
  const nightStart = findClosestEvent(fulcrum, nightStartCandidates);
  
  // Find astronomical night end (dawn) - should be before sunrise
  let nightEnd: Date | null = null;
  if (sunrise) {
    // Search backward from sunrise
    const dawn = SearchAltitude(
      Body.Sun,
      observer,
      +1,
      new Date(sunrise.getTime() - 4 * 60 * 60 * 1000), // Start 4h before sunrise
      1,
      APP_CONFIG.ASTRONOMY.ASTRONOMICAL_TWILIGHT_ANGLE,
    );
    if (dawn && dawn.date < sunrise) {
      nightEnd = dawn.date;
    }
  }
  
  // Find moon events closest to 6pm
  const moonRiseCandidates: (Date | null)[] = [];
  const moonSetCandidates: (Date | null)[] = [];
  
  // Check for moon rises around the fulcrum
  for (let offset = -24; offset <= 24; offset += 12) {
    const searchTime = new Date(fulcrum.getTime() + offset * 60 * 60 * 1000);
    const moonRise = SearchRiseSet(Body.Moon, observer, +1, searchTime, 1);
    if (moonRise) moonRiseCandidates.push(moonRise.date);
    const moonSet = SearchRiseSet(Body.Moon, observer, -1, searchTime, 1);
    if (moonSet) moonSetCandidates.push(moonSet.date);
  }
  
  const moonRise = findClosestEvent(fulcrum, moonRiseCandidates);
  const moonSet = findClosestEvent(fulcrum, moonSetCandidates);
  
  // Calculate moon data at the fulcrum time
  const moonData = calculateMoonData(fulcrum, location);
  
  // Calculate Galactic Center data around the fulcrum
  const gcData = calculateGalacticCenterData(fulcrum, location);
  
  // For GC events, we want the ones that bracket our observation period
  let gcRise = gcData.riseTime;
  const gcSet = gcData.setTime;
  let gcTransit = gcData.transitTime;
  
  // If GC rise is too far from fulcrum, try to find a closer one
  if (gcRise && Math.abs(gcRise.getTime() - fulcrum.getTime()) > 12 * 60 * 60 * 1000) {
    // Try yesterday's GC data
    const yesterdayGC = calculateGalacticCenterData(
      new Date(fulcrum.getTime() - 24 * 60 * 60 * 1000),
      location
    );
    if (yesterdayGC.riseTime) {
      const candidates = [gcRise, yesterdayGC.riseTime];
      gcRise = findClosestEvent(fulcrum, candidates);
    }
  }
  
  // Ensure transit is between rise and set if we have both
  if (gcRise && gcSet && gcTransit) {
    if (gcTransit < gcRise || gcTransit > gcSet) {
      // Transit is outside rise/set window, recalculate
      const gcDataCorrected = calculateGalacticCenterData(gcRise, location);
      gcTransit = gcDataCorrected.transitTime;
    }
  }
  
  // Calculate twilight data for rating
  const twilightData = calculateTwilightTimes(fulcrum, location);
  
  // Calculate optimal viewing window
  const optimalWindow = getOptimalViewingWindow(
    gcData,
    moonData,
    twilightData,
    location,
    fulcrum,
    0.3,
  );
  
  // Calculate visibility rating
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
    fulcrum,
  );
  
  // Return all events
  return {
    sunRise: sunrise || undefined,
    sunSet: sunset || undefined,
    nightStart: nightStart || undefined,
    nightEnd: nightEnd || undefined,
    moonRise: moonRise || undefined,
    moonSet: moonSet || undefined,
    moonIllumination: moonData.illumination * 100,
    moonPhase: moonData.phase,
    gcRise: gcRise || undefined,
    gcTransit: gcTransit || undefined,
    gcSet: gcSet || undefined,
    maxGcAltitude: gcData.altitude,
    optimalWindow,
    visibility: visibilityResult.rating,
    visibilityReason: visibilityResult.reason,
  };
}