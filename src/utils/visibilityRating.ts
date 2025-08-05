import {
  GalacticCenterData,
  MoonData,
  TwilightData,
  Location,
} from "../types/astronomy";
import {
  computeGCObservationScore,
  createGCAltitudeFunction,
  createMoonAltitudeFunction,
  createGCMoonAngleFunction,
} from "./gcObservationScoring";

// Re-export the formatTimeInLocationTimezone function from timezoneUtils
export { formatTimeInLocationTimezone } from "./timezoneUtils";

export interface VisibilityRatingResult {
  rating: number;
  reason?: string;
}

export function calculateVisibilityRating(
  gcData: GalacticCenterData,
  moonData: MoonData,
  twilightData: TwilightData,
  location: Location,
  date: Date,
): VisibilityRatingResult {
  // Create the altitude and angle functions
  const gcAltitude = createGCAltitudeFunction(location);
  const moonAltitude = createMoonAltitudeFunction(location);
  const gcMoonAngle = createGCMoonAngleFunction(location);

  // Call the new scoring algorithm
  const result = computeGCObservationScore({
    latitude: location.lat,
    longitude: location.lng,
    date,
    nightStart: new Date(twilightData.nightStart),
    nightEnd: new Date(twilightData.nightEnd),
    moonRise: moonData.rise,
    moonSet: moonData.set,
    moonIllumination: moonData.illumination,
    gcRise: gcData.riseTime,
    gcSet: gcData.setTime,
    gcAltitude,
    moonAltitude,
    gcMoonAngle,
  });

  return {
    rating: result.rating,
    reason: result.reason,
  };
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
