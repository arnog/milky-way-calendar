import {
  GalacticCenterData,
  MoonData,
  TwilightData,
  Location,
} from "../types/astronomy";
import { getMoonInterference } from "./moonCalculations";
import { calculateDarkDuration } from "./twilightCalculations";
import { OptimalViewingWindow } from "./optimalViewing";
import { getLocationTimezone } from "./timezoneUtils";
import { 
  computeGCObservationScore, 
  createGCAltitudeFunction, 
  createMoonAltitudeFunction, 
  createGCMoonAngleFunction 
} from "./gcObservationScoring";

// Get the local hour for a given date and location using proper timezone handling
function getLocalHour(date: Date, lat: number, lng: number): number | null {
  try {
    const location = { lat, lng };
    const timezoneInfo = getLocationTimezone(location);

    // Use Intl.DateTimeFormat to get the hour in the proper timezone
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezoneInfo.iana,
      hour: "numeric",
      hour12: false,
    });

    const hourStr = formatter.format(date);
    return parseInt(hourStr, 10);
  } catch (error) {
    console.error("Error calculating local hour:", error);
    return null;
  }
}

// Re-export the formatTimeInLocationTimezone function from timezoneUtils
export { formatTimeInLocationTimezone } from "./timezoneUtils";

// Helper function to get just the rating number (for backward compatibility)
export function getVisibilityRatingNumber(
  result: number | VisibilityRatingResult
): number {
  return typeof result === 'number' ? result : result.rating;
}

export interface VisibilityRatingResult {
  rating: number;
  reason?: string;
}

export function calculateVisibilityRating(
  gcData: GalacticCenterData,
  moonData: MoonData,
  twilightData: TwilightData,
  optimalWindow?: OptimalViewingWindow,
  location?: Location,
  date?: Date
): number | VisibilityRatingResult {
  // Use the new refined algorithm if we have location and date
  if (location && date) {
    // Create the altitude and angle functions
    const gcAltitude = createGCAltitudeFunction(location);
    const moonAltitude = createMoonAltitudeFunction(location);
    const gcMoonAngle = createGCMoonAngleFunction(location);
    
    // Call the new scoring algorithm
    const result = computeGCObservationScore({
      latitude: location.lat,
      longitude: location.lng,
      date,
      nightStart: twilightData.night ? new Date(twilightData.night) : null,
      nightEnd: twilightData.dayEnd ? new Date(twilightData.dayEnd) : null,
      moonRise: moonData.rise,
      moonSet: moonData.set,
      moonIllumination: moonData.illumination,
      gcRise: gcData.riseTime,
      gcSet: gcData.setTime,
      gcAltitude,
      moonAltitude,
      gcMoonAngle
    });
    
    return {
      rating: result.rating,
      reason: result.reason
    };
  }
  
  // Fallback to old algorithm if no location/date provided
  // (This maintains backward compatibility)
  
  // If there's no actual optimal viewing window (no start time or daylight hours),
  // there should be no stars (0 stars = no visibility)
  if (
    optimalWindow &&
    (!optimalWindow.startTime || optimalWindow.duration <= 0)
  ) {
    return 0; // No visibility if no actual viewing opportunity
  }

  // Also check if the start time is during daylight hours (would be hidden from display)
  // Use timezone-aware checking based on the location's coordinates
  if (optimalWindow && optimalWindow.startTime && location) {
    const localHour = getLocalHour(
      optimalWindow.startTime,
      location.lat,
      location.lng
    );

    if (localHour !== null && localHour >= 6 && localHour <= 18) {
      return 0; // No visibility if only visible during local daylight hours
    }
  }

  let score = 0;

  // 1. Galactic Core altitude factor (0-50 points)
  if (gcData.altitude >= 20) {
    // Excellent visibility when GC is high - scale from 30 to 50 points
    score += Math.min(50, (gcData.altitude - 20) * 1.5 + 30);
  } else if (gcData.altitude > 0) {
    // Reduced visibility when GC is low but still above horizon - scale from 0 to 30
    score += gcData.altitude * 1.5;
  }
  // No points if GC is below horizon

  // 2. Moon interference factor (much more severe penalty)
  // Consider moon interference across the entire astronomical dark period, not just optimal viewing window
  // A full moon affects Milky Way visibility throughout the night, regardless of GC positioning
  let moonInterferenceForNight = 0;

  if (
    moonData.illumination > 0.05 &&
    twilightData.night &&
    twilightData.dayEnd
  ) {
    const darkStart = twilightData.night;
    const darkEnd = twilightData.dayEnd;

    // Adjust for day boundary crossing
    let adjustedDarkEnd = darkEnd;
    if (darkEnd < darkStart) {
      adjustedDarkEnd = darkEnd + 24 * 60 * 60 * 1000;
    }

    if (moonData.rise && moonData.set) {
      let moonSetTime = moonData.set.getTime();
      if (moonSetTime < moonData.rise.getTime()) {
        moonSetTime += 24 * 60 * 60 * 1000;
      }

      // Check if moon is up during any part of the astronomical dark period
      const moonUpDuringDarkness =
        moonData.rise.getTime() <= adjustedDarkEnd && moonSetTime >= darkStart;

      if (moonUpDuringDarkness) {
        // Calculate fraction of dark time that moon is visible
        const moonVisibleStart = Math.max(moonData.rise.getTime(), darkStart);
        const moonVisibleEnd = Math.min(moonSetTime, adjustedDarkEnd);
        const moonVisibleDuration = Math.max(
          0,
          moonVisibleEnd - moonVisibleStart
        );
        const totalDarkDuration = adjustedDarkEnd - darkStart;
        const moonFraction = moonVisibleDuration / totalDarkDuration;

        moonInterferenceForNight = moonData.illumination * moonFraction;
      }
    } else {
      // Fallback: use current altitude
      if (moonData.altitude > 0) {
        moonInterferenceForNight = moonData.illumination;
      }
    }
  }

  // Use the stricter of the two interference calculations
  const moonInterference = Math.max(
    getMoonInterference(moonData),
    moonInterferenceForNight
  );

  // Exponential penalty for moon interference - full moon should nearly eliminate visibility
  let moonPenalty = 0;
  if (moonInterference > 0.8) {
    // 80%+ moon illumination during viewing: extreme penalty (60-80 points) - should force rating to 0-1
    moonPenalty = 60 + (moonInterference - 0.8) * 100; // Up to 80 points penalty
  } else if (moonInterference > 0.6) {
    // 60-80% illumination: massive penalty (35-60 points)
    moonPenalty = 35 + (moonInterference - 0.6) * 125; // 35-60 points
  } else if (moonInterference > 0.3) {
    // 30-60% illumination: significant penalty (15-35 points)
    moonPenalty = 15 + (moonInterference - 0.3) * 67; // 15-35 points
  } else if (moonInterference > 0.1) {
    // 10-30% illumination: moderate penalty (5-15 points)
    moonPenalty = 5 + (moonInterference - 0.1) * 50; // 5-15 points
  } else {
    // <10% illumination: minimal penalty (0-5 points)
    moonPenalty = moonInterference * 50; // 0-5 points
  }

  score -= moonPenalty;

  // 3. Dark time duration factor (0-30 points)
  const darkHours = calculateDarkDuration(twilightData);
  if (darkHours >= 8) {
    score += 30; // Very long dark period
  } else if (darkHours >= 6) {
    score += 25; // Long dark period
  } else if (darkHours >= 4) {
    score += 20; // Moderate dark period
  } else if (darkHours >= 2) {
    score += 10; // Short dark period
  }
  // No points for very short or no dark time

  // Convert score to 1-4 star rating
  // Ensure minimum score of 0
  score = Math.max(0, score);

  if (score >= 60) return 4; // Excellent (⭐⭐⭐⭐)
  if (score >= 45) return 3; // Good (⭐⭐⭐)
  if (score >= 25) return 2; // Fair (⭐⭐)
  return 1; // Poor (⭐)
}


export function getVisibilityDescription(stars: number): string {
  switch (stars) {
    case 0:
      return "No visibility - Milky Way not visible during dark hours";
    case 1:
      return "Poor visibility - significant light pollution or unfavorable conditions";
    case 2:
      return "Fair visibility - some details visible with patience";
    case 3:
      return "Good visibility - clear Milky Way structure visible";
    case 4:
      return "Excellent visibility - optimal conditions for observation and photography";
    default:
      return "Unknown visibility";
  }
}
