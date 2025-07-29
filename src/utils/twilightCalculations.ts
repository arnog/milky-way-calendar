import * as SunCalc from "suncalc";
import { Location, TwilightData } from "../types/astronomy";

// Add custom times for astronomical twilight (-18°)
SunCalc.addTime(-18, "astronomicalDawn", "astronomicalDusk");

interface ExtendedTimes extends SunCalc.GetTimesResult {
  astronomicalDawn: Date; // sun -18° in morning
  astronomicalDusk: Date; // sun -18° in evening
}

export function calculateTwilightTimes(
  date: Date,
  location: Location
): TwilightData {
  try {
    // SunCalc expects a local Date; use **midnight** so evening events belong to this calendar day.
    const baseLocal = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0 // 00:00 local
    );

    const times = SunCalc.getTimes(
      baseLocal,
      location.lat,
      location.lng
    ) as ExtendedTimes;

    const nextLocal = new Date(baseLocal);
    nextLocal.setDate(nextLocal.getDate() + 1);

    const nextTimes = SunCalc.getTimes(
      nextLocal,
      location.lat,
      location.lng
    ) as ExtendedTimes;

    // --- Find astronomical dusk by searching after civil dusk (Sun –6°) ---
    // Choose the evening civil dusk (sun –6°).
    // If SunCalc returns the pre‑dawn event (dusk < sunset), use tomorrow’s dusk.
    let civilDusk = times.dusk;
    if (civilDusk.getTime() < times.sunset.getTime()) {
      civilDusk = nextTimes.dusk; // evening civil dusk
    }

    // Start 5 min after civil dusk, step every 5 min until Sun altitude ≤ –18°
    const searchStart = new Date(civilDusk.getTime() + 5 * 60 * 1000);
    const searchEnd = new Date(searchStart.getTime() + 8 * 60 * 60 * 1000); // search up to +8 h

    let nightStart: Date | null = null;
    for (
      let t = searchStart;
      t <= searchEnd;
      t = new Date(t.getTime() + 5 * 60 * 1000)
    ) {
      const sunAltRad = SunCalc.getPosition(
        t,
        location.lat,
        location.lng
      ).altitude;
      const sunAltDeg = (sunAltRad * 180) / Math.PI;
      if (sunAltDeg <= -18) {
        nightStart = t;
        break;
      }
    }

    // If Sun never reaches –18° (e.g. high‑latitude summer), use civil dusk
    if (!nightStart) nightStart = civilDusk;

    const astronomicalDawn = nextTimes.astronomicalDawn;

    return {
      dawn: times.dawn.getTime(),
      dusk: times.dusk.getTime(),
      night: nightStart.getTime(),
      dayEnd: astronomicalDawn.getTime(),
    };
  } catch (error) {
    console.error("Error calculating twilight times:", error);
    const fallback = new Date(date);
    return {
      dawn: new Date(fallback.setHours(6, 0, 0, 0)).getTime(),
      dusk: new Date(fallback.setHours(18, 0, 0, 0)).getTime(),
      night: new Date(fallback.setHours(20, 0, 0, 0)).getTime(),
      dayEnd: new Date(fallback.setHours(4, 0, 0, 0)).getTime(),
    };
  }
}

export function isDarkTime(ts: number, tw: TwilightData): boolean {
  return tw.night < tw.dayEnd
    ? ts >= tw.night && ts <= tw.dayEnd
    : ts >= tw.night || ts <= tw.dayEnd;
}

export function calculateDarkDuration(tw: TwilightData): number {
  const ms =
    tw.dayEnd > tw.night
      ? tw.dayEnd - tw.night
      : 86_400_000 - (tw.night - tw.dayEnd); // 24 h in ms
  return ms / 3.6e6; // hours
}
