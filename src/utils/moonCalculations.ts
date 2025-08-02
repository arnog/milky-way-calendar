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
    const moonPhaseAngle = moonIllum.phase_angle;
    const moonPhase = (moonPhaseAngle + 180) / 360; // Convert to 0-1 range where 0.5 is full moon
    const moonIllumination = moonIllum.phase_fraction; // Fraction of moon's visible disk that is illuminated
    
    // Calculate moon rise/set times
    // Direction: +1 = Rise, -1 = Set
    const moonRise = Astronomy.SearchRiseSet(
      Astronomy.Body.Moon,
      observer,
      +1,
      date,
      1
    );
    
    const moonSet = Astronomy.SearchRiseSet(
      Astronomy.Body.Moon,
      observer,
      -1,
      date,
      1
    );

    // If moon set precedes rise, get the next set time
    if (moonRise && moonSet && moonSet.date < moonRise.date) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextSet = Astronomy.SearchRiseSet(
        Astronomy.Body.Moon,
        observer,
        -1,
        nextDay,
        1
      );
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