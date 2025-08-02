import * as Astronomy from "astronomy-engine";
import { Location } from "../types/astronomy";

// Galactic Core coordinates (J2000)
const GALACTIC_CENTER_RA = 17.759; // hours (17h 45m 36s)
const GALACTIC_CENTER_DEC = -29.007; // degrees (-29° 0' 25")

export type ObservationInputs = {
  latitude: number;
  longitude: number;
  date: Date;
  nightStart: Date | null;
  nightEnd: Date | null;
  moonRise: Date | null;
  moonSet: Date | null;
  moonIllumination: number; // 0.0 - 1.0
  gcRise: Date | null;
  gcSet: Date | null;
  gcAltitude: (time: Date) => number; // degrees
  moonAltitude: (time: Date) => number; // degrees
  gcMoonAngle: (time: Date) => number; // degrees
};

export type VisibilitySample = {
  time: Date;
  score: number;
  altitudeGC: number;
  moonAlt: number;
  moonAngle: number;
};

export function computeGCObservationScore(
  inputs: ObservationInputs
): {
  bestTime: Date | null;
  rating: number; // 0-4
  curve: VisibilitySample[];
  reason: string;
} {
  const {
    latitude,
    nightStart,
    nightEnd,
    moonIllumination,
    gcRise,
    gcSet,
    gcAltitude,
    moonAltitude,
    gcMoonAngle
  } = inputs;

  const curve: VisibilitySample[] = [];

  // GC never visible for lat > 61°N or < -61°S
  if (Math.abs(latitude) > 61) {
    return { 
      bestTime: null, 
      rating: 0, 
      curve,
      reason: "Galactic Center never visible at this latitude"
    };
  }

  // No astronomical night
  if (!nightStart || !nightEnd) {
    return { 
      bestTime: null, 
      rating: 0, 
      curve,
      reason: "No astronomical darkness (sun never reaches -18°)"
    };
  }

  // No GC rise/set data
  if (!gcRise || !gcSet) {
    return { 
      bestTime: null, 
      rating: 0, 
      curve,
      reason: "Galactic Center does not rise above 15°"
    };
  }

  // Intersection of night and GC visibility
  const windowStart = new Date(Math.max(nightStart.getTime(), gcRise.getTime()));
  const windowEnd = new Date(Math.min(nightEnd.getTime(), gcSet.getTime()));

  // Check window length
  const windowLengthMin = (windowEnd.getTime() - windowStart.getTime()) / 60000;
  if (windowLengthMin < 30) {
    return { 
      bestTime: null, 
      rating: 0, 
      curve,
      reason: "Observation window too short (< 30 minutes)"
    };
  }

  // Integration parameters
  const edgeSpan = 30; // minutes
  const smallStep = 2; // minutes
  const largeStep = 8; // minutes

  type Segment = { start: Date; end: Date; step: number };
  const segments: Segment[] = [];

  const pushSegment = (start: Date, end: Date, step: number) => {
    if (end > start) segments.push({ start, end, step });
  };

  const addMinutes = (d: Date, m: number) => new Date(d.getTime() + m * 60000);

  pushSegment(windowStart, addMinutes(windowStart, edgeSpan), smallStep);
  pushSegment(
    addMinutes(windowStart, edgeSpan),
    addMinutes(windowEnd, -edgeSpan),
    largeStep
  );
  pushSegment(addMinutes(windowEnd, -edgeSpan), windowEnd, smallStep);

  let accumulatedScore = 0;
  let totalMinutes = 0;
  let bestTime: Date | null = null;
  let bestScore = -Infinity;

  for (const seg of segments) {
    for (let t = seg.start; t <= seg.end; t = addMinutes(t, seg.step)) {
      const altitudeGC = gcAltitude(t);
      if (altitudeGC < 15) continue; // Altitude cutoff

      const moonAlt = moonAltitude(t);
      const angle = gcMoonAngle(t);
      let score: number;

      if (moonAlt <= 0) {
        score = 1.0; // perfect: moon not visible
      } else {
        if (moonIllumination > 0.6) {
          score = (1 - moonIllumination) * 0.2;
        } else {
          const angleFactor = Math.min(angle / 90, 1.0);
          score = (1 - moonIllumination) * angleFactor;
        }
      }

      // Record the sample for curve plotting
      curve.push({
        time: new Date(t),
        score,
        altitudeGC,
        moonAlt,
        moonAngle: angle
      });

      accumulatedScore += score * seg.step;
      totalMinutes += seg.step;

      if (score > bestScore) {
        bestScore = score;
        bestTime = t;
      }
    }
  }

  if (totalMinutes === 0) {
    return { 
      bestTime: null, 
      rating: 0, 
      curve,
      reason: "No observation time when Galactic Center is above 15°"
    };
  }

  const avgScore = accumulatedScore / totalMinutes;

  // Window length multiplier - gentle penalty for shorter windows
  // 1+ hour with perfect conditions should still rate highly
  const maxWindow = 120; // 2 hours for full multiplier  
  const minWindow = 30; // 30 minutes minimum
  // Scale from 0.7 to 1.0 (instead of 0.5 to 1.0) to be less punitive
  const lengthMultiplier = Math.max(0.7, Math.min((windowLengthMin - minWindow) / (maxWindow - minWindow) * 0.3 + 0.7, 1));
  const finalScore = avgScore * lengthMultiplier;

  // Map to rating and determine reason
  let rating: number;
  let reason: string;
  
  if (windowLengthMin < 30) {
    rating = 0;
    reason = "Observation window too short (< 30 minutes)";
  } else if (finalScore < 0.25) {
    rating = 1;
    // Determine primary cause of poor visibility
    if (moonIllumination > 0.6 && avgScore < 0.5) {
      reason = `Severe moon interference (${Math.round(moonIllumination * 100)}% illuminated)`;
    } else if (windowLengthMin < 60) {
      reason = `Very short observation window (${Math.round(windowLengthMin)} minutes)`;
    } else {
      reason = "Poor viewing conditions";
    }
  } else if (finalScore < 0.5) {
    rating = 2;
    if (moonIllumination > 0.5 && avgScore < 0.5) {
      reason = `Significant moon interference (${Math.round(moonIllumination * 100)}% illuminated)`;
    } else if (windowLengthMin < 90) {
      reason = `Limited observation window (${(windowLengthMin / 60).toFixed(1)} hours)`;
    } else {
      reason = "Fair viewing conditions";
    }
  } else if (finalScore < 0.75) {
    rating = 3;
    if (moonIllumination > 0.3) {
      reason = `Good conditions with some moon (${Math.round(moonIllumination * 100)}% illuminated)`;
    } else if (windowLengthMin >= 120) {
      reason = `Good conditions with ${(windowLengthMin / 60).toFixed(1)} hour window`;
    } else {
      reason = "Good viewing conditions";
    }
  } else {
    rating = 4;
    if (moonIllumination < 0.1 && windowLengthMin >= 120) {
      reason = `Excellent dark sky conditions (${(windowLengthMin / 60).toFixed(1)} hours)`;
    } else if (avgScore > 0.9) {
      reason = "Perfect viewing conditions - moon below horizon";
    } else {
      reason = `Excellent conditions (${(windowLengthMin / 60).toFixed(1)} hour window)`;
    }
  }

  return { bestTime, rating, curve, reason };
}

// Helper functions to calculate altitude and angles
export function createGCAltitudeFunction(
  location: Location
): (time: Date) => number {
  const observer = new Astronomy.Observer(location.lat, location.lng, 0);
  
  return (time: Date) => {
    const horizontal = Astronomy.Horizon(
      time,
      observer,
      GALACTIC_CENTER_RA,
      GALACTIC_CENTER_DEC
    );
    return horizontal.altitude;
  };
}

export function createMoonAltitudeFunction(
  location: Location
): (time: Date) => number {
  const observer = new Astronomy.Observer(location.lat, location.lng, 0);
  
  return (time: Date) => {
    try {
      const moonEquator = Astronomy.Equator(Astronomy.Body.Moon, time, observer, false, true);
      const moonHorizon = Astronomy.Horizon(time, observer, moonEquator.ra, moonEquator.dec, "normal");
      return moonHorizon.altitude;
    } catch (error) {
      console.error("Error calculating moon altitude:", error);
      return 0;
    }
  };
}

export function createGCMoonAngleFunction(
  location: Location
): (time: Date) => number {
  const observer = new Astronomy.Observer(location.lat, location.lng, 0);
  
  return (time: Date) => {
    try {
      // Get moon equatorial coordinates
      const moonEquator = Astronomy.Equator(Astronomy.Body.Moon, time, observer, false, true);
      
      // Calculate angular separation using spherical trigonometry
      // Convert RA from hours to degrees
      const gcRaDeg = GALACTIC_CENTER_RA * 15;
      const moonRaDeg = moonEquator.ra * 15;
      
      // Convert to radians
      const gcRaRad = gcRaDeg * Math.PI / 180;
      const gcDecRad = GALACTIC_CENTER_DEC * Math.PI / 180;
      const moonRaRad = moonRaDeg * Math.PI / 180;
      const moonDecRad = moonEquator.dec * Math.PI / 180;
      
      // Calculate angular separation using the spherical law of cosines
      const cosAngle = Math.sin(gcDecRad) * Math.sin(moonDecRad) +
                      Math.cos(gcDecRad) * Math.cos(moonDecRad) * 
                      Math.cos(gcRaRad - moonRaRad);
      
      // Convert back to degrees
      const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle))) * 180 / Math.PI;
      
      return angle;
    } catch (error) {
      console.error("Error calculating GC-Moon angle:", error);
      return 0;
    }
  };
}