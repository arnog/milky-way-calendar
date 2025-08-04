import { OptimalViewingWindow } from "../utils/integratedOptimalViewing";

export interface Location {
  lat: number;
  lng: number;
}

export interface WeekData {
  weekNumber: number;
  startDate: Date;
  visibility: number; // 1-4 stars
  gcDuration: string; // Duration of optimal viewing
  moonIllumination: number; // 0-1
  optimalWindow: OptimalViewingWindow; // Optimal viewing window data
  visibilityReason?: string; // Explanation for visibility rating
}

export interface GalacticCenterData {
  altitude: number;
  azimuth: number;
  riseTime: Date | null;
  setTime: Date | null;
  transitTime: Date | null;
}

export interface MoonData {
  phase: number; // 0-1 (new to full)
  illumination: number; // 0-1
  altitude: number;
  azimuth: number;
  rise: Date | null;
  set: Date | null;
}

export interface TwilightData {
  dawn: number; // ms since epoch (civil dawn)
  dusk: number; // civil dusk (sun –6°)
  nightStart: number; // astronomical dusk (sun –18°) - when night begins
  nightEnd: number; // astronomical dawn (sun –18°) - when night ends
}

// Complete astronomical events including visibility rating
export interface AstronomicalEvents {
  /** Sunrise time */
  sunRise?: Date;
  /** Sunset time */
  sunSet?: Date;
  /** Start of astronomical night */
  nightStart?: Date;
  /** End of astronomical night */
  nightEnd?: Date;
  /** Moonrise time */
  moonRise?: Date;
  /** Moonset time */
  moonSet?: Date;
  /** Moon illumination percentage (0-100) */
  moonIllumination: number;
  /** Moon phase value (0-1) */
  moonPhase: number;
  /** Galactic Center rise time (when it reaches ≥10° altitude) */
  gcRise?: Date;
  /** Galactic Center set time (when it drops to ≤10° altitude) */
  gcSet?: Date;
  /** Galactic Center transit time (highest point in sky) */
  gcTransit?: Date;
  /** Maximum Galactic Center altitude in degrees */
  maxGcAltitude: number;
  /** Optimal viewing window with quality metrics */
  optimalWindow: OptimalViewingWindow;
  /** Visibility rating (0-4 stars) */
  visibility: number;
  /** Optional reason for the visibility rating */
  visibilityReason?: string;
}
