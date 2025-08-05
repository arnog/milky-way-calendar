import * as Astronomy from "astronomy-engine";
import { Location, MoonData } from "../types/astronomy";

export function calculateMoonData(date: Date, location: Location): MoonData {
  try {
    const observer = new Astronomy.Observer(location.lat, location.lng, 0);
    
    // Calculate moon position
    const moonEquator = Astronomy.Equator(Astronomy.Body.Moon, date, observer, false, true);
    const moonHorizon = Astronomy.Horizon(date, observer, moonEquator.ra, moonEquator.dec, "normal");
    
    // Calculate moon illumination
    const moonIllum = Astronomy.Illumination(Astronomy.Body.Moon, date);
    
    // Calculate lunar phase (0-1) where 0.5 = full moon
    // Distinguish between waxing (0-0.5) and waning (0.5-1.0) phases
    // by comparing illumination to previous day
    const prevDate = new Date(date.getTime() - 24 * 60 * 60 * 1000);
    const prevIllum = Astronomy.Illumination(Astronomy.Body.Moon, prevDate);
    const isWaxing = moonIllum.phase_fraction > prevIllum.phase_fraction;
    
    let moonPhase;
    if (moonIllum.phase_fraction < 0.01) {
      moonPhase = 0; // New moon
    } else if (moonIllum.phase_fraction > 0.99) {
      moonPhase = 0.5; // Full moon
    } else if (isWaxing) {
      // Waxing: 0 to 0.5
      moonPhase = moonIllum.phase_fraction * 0.5;
    } else {
      // Waning: 0.5 to 1.0
      moonPhase = 0.5 + (1 - moonIllum.phase_fraction) * 0.5;
    }
    
    const moonIllumination = moonIllum.phase_fraction; // Fraction of moon's visible disk that is illuminated
    
    // Calculate moon rise/set times
    let moonRise = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, +1, date, 1);
    let moonSet = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, date, 1);

    // If no moonrise today but we have a moonset, check both yesterday and today for moonrise
    if (!moonRise && moonSet) {
      // First check yesterday for moonrise (moon might have risen yesterday)
      const yesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000);
      const yesterdayRise = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, +1, yesterday, 1);
      if (yesterdayRise && yesterdayRise.date > yesterday) {
        moonRise = yesterdayRise;
      }
      
      // If still no moonrise found, check later today for moonrise after the moonset
      if (!moonRise) {
        // Search for moonrise starting from after the moonset time
        const afterMoonset = new Date(moonSet.date.getTime() + 1000); // 1 second after moonset
        const todayRise = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, +1, afterMoonset, 1);
        if (todayRise && todayRise.date.getDate() === date.getDate()) {
          moonRise = todayRise;
        }
      }
    }

    // If no moonset today but we have a moonrise, check tomorrow for moonset
    if (moonRise && !moonSet) {
      const tomorrow = new Date(date.getTime() + 24 * 60 * 60 * 1000);
      const tomorrowSet = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, tomorrow, 1);
      if (tomorrowSet) {
        moonSet = tomorrowSet;
      }
    }

    // If moon set precedes rise, search for the next set time
    if (moonRise && moonSet && moonSet.date < moonRise.date) {
      const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
      const nextSet = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, nextDay, 1);
      if (nextSet) {
        moonSet.date = nextSet.date;
      }
    }

    return {
      phase: moonPhase,
      illumination: moonIllumination,
      altitude: moonHorizon.altitude,
      azimuth: moonHorizon.azimuth,
      rise: moonRise ? moonRise.date : null,
      set: moonSet ? moonSet.date : null,
    };
  } catch (error) {
    console.error("Error calculating moon data with astronomy-engine:", error);
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