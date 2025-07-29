import * as SunCalc from "suncalc";
import { Location, MoonData } from "../types/astronomy";

export function calculateMoonData(date: Date, location: Location): MoonData {
  try {
    const moonPosition = SunCalc.getMoonPosition(
      date,
      location.lat,
      location.lng
    );
    const moonIllumination = SunCalc.getMoonIllumination(date);
    const moonTimes = SunCalc.getMoonTimes(date, location.lat, location.lng);

    // SunCalc returns events in the same calendar day. If the set‑time precedes
    // the rise‑time it means the Moon sets after midnight.  Query the next day
    // to obtain the proper set time.
    if (moonTimes.rise && moonTimes.set && moonTimes.set < moonTimes.rise) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextTimes = SunCalc.getMoonTimes(
        nextDay,
        location.lat,
        location.lng
      );
      moonTimes.set =
        nextTimes.set ??
        new Date(moonTimes.set.getTime() + 24 * 60 * 60 * 1000); // fallback
    }
    return {
      phase: moonIllumination.phase,
      illumination: moonIllumination.fraction,
      altitude: moonPosition.altitude * (180 / Math.PI), // Convert to degrees
      azimuth: moonPosition.azimuth * (180 / Math.PI), // Convert to degrees
      rise: moonTimes.rise || null,
      set: moonTimes.set || null,
    };
  } catch (error) {
    console.error("Error calculating moon data:", error);
    return {
      phase: 0,
      illumination: 0,
      altitude: 0,
      azimuth: 0,
      rise: null,
      set: null,
    };
  }
}

export function getMoonPhaseEmoji(phase: number): string {
  // Phase goes from 0 (new moon) to 1 (full moon) and back to 0
  if (phase < 0.125) return "🌑"; // New moon
  if (phase < 0.25) return "🌒"; // Waxing crescent
  if (phase < 0.375) return "🌓"; // First quarter
  if (phase < 0.5) return "🌔"; // Waxing gibbous
  if (phase < 0.625) return "🌕"; // Full moon
  if (phase < 0.75) return "🌖"; // Waning gibbous
  if (phase < 0.875) return "🌗"; // Last quarter
  return "🌘"; // Waning crescent
}

export function getMoonInterference(moonData: MoonData): number {
  // Calculate moon interference factor (0 = no interference, 1 = maximum interference)
  const illuminationFactor = moonData.illumination;
  const altitudeFactor = Math.max(0, moonData.altitude / 90); // Higher moon = more interference

  // Even a 30% illuminated moon can cause significant interference
  return Math.min(1, illuminationFactor * 2 * altitudeFactor);
}
