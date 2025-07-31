import * as Astronomy from "astronomy-engine";
import { Location, TwilightData } from "../types/astronomy";

export function calculateTwilightTimes(
  date: Date,
  location: Location
): TwilightData {
  try {
    const observer = new Astronomy.Observer(location.lat, location.lng, 0);
    
    // Create a date at midnight local time for consistency
    const baseLocal = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0, 0, 0, 0
    );

    // Search for sunrise/sunset (0 degrees)
    // Direction: +1 = Rise, -1 = Set
    const sunrise = Astronomy.SearchRiseSet(
      Astronomy.Body.Sun,
      observer,
      +1,
      baseLocal,
      1
    );
    
    const sunset = Astronomy.SearchRiseSet(
      Astronomy.Body.Sun,
      observer,
      -1,
      baseLocal,
      1
    );

    // Search for civil twilight (-6 degrees)
    const civilDawn = Astronomy.SearchAltitude(
      Astronomy.Body.Sun,
      observer,
      +1,
      baseLocal,
      1,
      -6
    );
    
    const civilDusk = Astronomy.SearchAltitude(
      Astronomy.Body.Sun,
      observer,
      -1,
      baseLocal,
      1,
      -6
    );

    // Search for astronomical twilight (-18 degrees)
    // This is when true darkness begins/ends
    const astronomicalDusk = Astronomy.SearchAltitude(
      Astronomy.Body.Sun,
      observer,
      -1,
      baseLocal,
      1,
      -18
    );
    
    // For astronomical dawn, search from the next day
    const nextDay = new Date(baseLocal);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const astronomicalDawn = Astronomy.SearchAltitude(
      Astronomy.Body.Sun,
      observer,
      +1,
      nextDay,
      1,
      -18
    );

    // Handle edge cases for high latitudes
    let nightStart: Date;
    let dayEnd: Date;

    if (!astronomicalDusk) {
      // Sun never goes below -18° (e.g., high latitude summer)
      // Use civil dusk as fallback
      nightStart = civilDusk ? civilDusk.date : sunset ? sunset.date : new Date(baseLocal.setHours(22, 0, 0, 0));
    } else {
      nightStart = astronomicalDusk.date;
    }

    if (!astronomicalDawn) {
      // Sun never goes below -18° before dawn
      // Use civil dawn as fallback
      dayEnd = civilDawn ? civilDawn.date : sunrise ? sunrise.date : new Date(nextDay.setHours(4, 0, 0, 0));
    } else {
      dayEnd = astronomicalDawn.date;
    }

    return {
      dawn: civilDawn ? civilDawn.date.getTime() : baseLocal.getTime() + 6 * 3600000,
      dusk: civilDusk ? civilDusk.date.getTime() : baseLocal.getTime() + 18 * 3600000,
      night: nightStart.getTime(),
      dayEnd: dayEnd.getTime(),
    };
  } catch (error) {
    console.error("Error calculating twilight times with astronomy-engine:", error);
    
    // Fallback values
    const fallback = new Date(date);
    return {
      dawn: new Date(fallback.setHours(6, 0, 0, 0)).getTime(),
      dusk: new Date(fallback.setHours(18, 0, 0, 0)).getTime(),
      night: new Date(fallback.setHours(20, 0, 0, 0)).getTime(),
      dayEnd: new Date(fallback.setHours(4, 0, 0, 0)).getTime(),
    };
  }
}


export function calculateDarkDuration(tw: TwilightData): number {
  const ms =
    tw.dayEnd > tw.night
      ? tw.dayEnd - tw.night
      : 86_400_000 - (tw.night - tw.dayEnd); // 24 h in ms
  return ms / 3.6e6; // hours
}