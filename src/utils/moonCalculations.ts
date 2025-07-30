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
  // Phase is 0-1, where 0.5 is full moon
  // Using Unicode moon phase symbols to properly represent the 8 moon phases
  if (phase < 0.0625 || phase >= 0.9375) return "🌑"; // New Moon
  if (phase < 0.1875) return "🌒"; // Waxing Crescent
  if (phase < 0.3125) return "🌓"; // First Quarter
  if (phase < 0.4375) return "🌔"; // Waxing Gibbous
  if (phase < 0.5625) return "🌕"; // Full Moon
  if (phase < 0.6875) return "🌖"; // Waning Gibbous
  if (phase < 0.8125) return "🌗"; // Last Quarter
  return "🌘"; // Waning Crescent
}

export function getMoonInterference(moonData: MoonData): number {
  // Calculate moon interference factor (0 = no interference, 1 = maximum interference)
  const illuminationFactor = moonData.illumination;

  // If moon is below horizon, no interference regardless of illumination
  if (moonData.altitude <= 0) {
    return 0;
  }

  // Altitude factor: moon interference increases non-linearly with altitude
  // Moon at 45° has nearly full interference, moon at horizon has minimal
  const altitudeFactor = Math.min(
    1,
    Math.pow(Math.max(0, moonData.altitude) / 45, 0.7)
  );

  // Combine illumination and altitude - high moon with high illumination = maximum interference
  return illuminationFactor * altitudeFactor;
}
