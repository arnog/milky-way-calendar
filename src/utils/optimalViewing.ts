import { GalacticCenterData, MoonData, TwilightData, Location } from "../types/astronomy";
import { formatTimeInLocationTimezone } from './timezoneUtils';
import { 
  calculateIntegratedOptimalWindow,
  QualityPeriod
} from './integratedOptimalViewing';

// Re-export for convenience
export type { QualityPeriod };

export interface OptimalViewingWindow {
  startTime: Date | null;
  endTime: Date | null;
  duration: number; // in hours
  description: string;
  // Enhanced fields for quality-based windows
  averageScore?: number; // 0.0 - 1.0
  bestTime?: Date | null;
  qualityPeriods?: QualityPeriod[];
  isIntegrated?: boolean; // Flag to indicate if this uses integrated analysis
}

function emptyWindow(description: string): OptimalViewingWindow {
  return {
    startTime: null,
    endTime: null,
    duration: 0,
    description,
  };
}

// Old calculateOptimalViewingWindow function removed - now handled inline in getOptimalViewingWindow

export function formatOptimalViewingTime(window: OptimalViewingWindow, location?: Location): string {
  if (!window.startTime) {
    return "";
  }

  if (location) {
    // Use proper timezone formatting
    return formatTimeInLocationTimezone(window.startTime, location);
  }

  // Fallback to browser timezone
  const hour = window.startTime.getHours();
  const minute = window.startTime.getMinutes();

  // Format as HH:MM in 24-hour format
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

export function formatOptimalViewingDuration(
  window: OptimalViewingWindow
): string {
  if (window.duration <= 0 || !window.startTime) {
    return "";
  }

  const hours = Math.floor(window.duration);
  const minutes = Math.round((window.duration % 1) * 60);

  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
}

/**
 * Calculate optimal viewing window using time-integrated quality analysis
 * This provides more accurate windows by analyzing hour-by-hour viewing conditions
 */
export function calculateIntegratedViewingWindow(
  gcData: GalacticCenterData,
  moonData: MoonData,
  twilightData: TwilightData,
  location: Location,
  date: Date,
  qualityThreshold: number = 0.3 // Minimum score for decent viewing
): OptimalViewingWindow {
  
  // First check basic requirements
  if (!gcData.riseTime || !twilightData.night || !twilightData.dayEnd) {
    return emptyWindow("No viewing opportunity available");
  }

  // Get integrated analysis
  const integratedResult = calculateIntegratedOptimalWindow(
    location,
    date,
    twilightData.night ? new Date(twilightData.night) : null,
    twilightData.dayEnd ? new Date(twilightData.dayEnd) : null,
    moonData.rise,
    moonData.set,
    moonData.illumination,
    gcData.riseTime,
    gcData.setTime,
    qualityThreshold
  );

  if (!integratedResult.startTime || integratedResult.duration === 0) {
    // No quality periods found - create basic intersection window but mark as poor
    const gcStart = gcData.riseTime;
    const gcEnd = gcData.setTime;
    const darkStart = twilightData.night ? new Date(twilightData.night) : null;
    const darkEnd = twilightData.dayEnd ? new Date(twilightData.dayEnd) : null;
    
    if (!gcStart || !darkStart || !darkEnd) {
      return emptyWindow("No viewing opportunity available");
    }
    
    // Simple intersection calculation
    const windowStart = new Date(Math.max(gcStart.getTime(), darkStart.getTime()));
    const windowEnd = new Date(Math.min(gcEnd?.getTime() || gcStart.getTime() + 8*60*60*1000, darkEnd.getTime()));
    
    if (windowStart >= windowEnd) {
      return emptyWindow("No overlap between GC visibility and dark time");
    }
    
    const duration = (windowEnd.getTime() - windowStart.getTime()) / (1000 * 60 * 60);
    
    return {
      startTime: windowStart,
      endTime: windowEnd,
      duration,
      averageScore: 0.1, // Very low score
      bestTime: integratedResult.bestTime,
      qualityPeriods: [],
      isIntegrated: true,
      description: "Poor viewing conditions (no quality periods found)"
    };
  }

  // Convert integrated result to OptimalViewingWindow format
  return {
    startTime: integratedResult.startTime,
    endTime: integratedResult.endTime,
    duration: integratedResult.duration,
    description: integratedResult.description,
    averageScore: integratedResult.averageScore,
    bestTime: integratedResult.bestTime,
    qualityPeriods: integratedResult.qualityPeriods,
    isIntegrated: true
  };
}

/**
 * Get the optimal viewing window using time-integrated quality analysis
 * Always uses the integrated approach for accurate, quality-based results
 */
export function getOptimalViewingWindow(
  gcData: GalacticCenterData,
  moonData: MoonData,
  twilightData: TwilightData,
  location: Location,
  date: Date,
  qualityThreshold: number = 0.3
): OptimalViewingWindow {
  return calculateIntegratedViewingWindow(gcData, moonData, twilightData, location, date, qualityThreshold);
}
