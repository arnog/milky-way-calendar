import { GalacticCenterData, MoonData, TwilightData } from "../types/astronomy";

export interface OptimalViewingWindow {
  startTime: Date | null;
  endTime: Date | null;
  duration: number; // in hours
  description: string;
}

function emptyWindow(description: string): OptimalViewingWindow {
  return {
    startTime: null,
    endTime: null,
    duration: 0,
    description,
  };
}

export function calculateOptimalViewingWindow(
  gcData: GalacticCenterData,
  moonData: MoonData,
  twilightData: TwilightData
): OptimalViewingWindow {
  // Conditions for optimal viewing:
  // 1. GC is ≥10° above horizon
  // 2. Astronomical night (sun ≥18° below horizon)
  // 3. Moon is either not risen or has ≤30% illumination (per requirements)

  const gcStart = gcData.riseTime; // When GC reaches 10°
  const gcEnd = gcData.setTime; // When GC drops below 10°

  // Dark time window (timestamps)
  const darkStartTs = twilightData.night;
  const darkEndTs = twilightData.dayEnd;

  if (!gcStart) return emptyWindow("GC not visible (below 10°)");

  if (!darkStartTs || !darkEndTs) {
    // Use GC time as fallback if twilight calculation fails
    const duration = gcEnd
      ? (gcEnd.getTime() - gcStart.getTime()) / (1000 * 60 * 60)
      : 8; // Assume 8h if no end time
    return {
      startTime: gcStart,
      endTime: gcEnd || new Date(gcStart.getTime() + 8 * 60 * 60 * 1000), // 8 hours from start
      duration,
      description: "Using full GC visibility window (no twilight data)",
    };
  }

  // Calculate all times as timestamps for consistent day boundary handling
  const gcStartTs = gcStart.getTime();
  const gcEndTs = gcEnd ? gcEnd.getTime() : gcStartTs + 8 * 60 * 60 * 1000; // 8h default

  let adjDarkStartTs = darkStartTs;
  let adjDarkEndTs = darkEndTs;

  // Handle day boundary: if darkEnd is before darkStart, it's next day
  if (adjDarkEndTs < adjDarkStartTs) {
    adjDarkEndTs += 24 * 60 * 60 * 1000; // Add 24 hours
  }
  // If GC rises after the current dark window ends, move the dark window to the following night
  if (gcStartTs > adjDarkEndTs) {
    adjDarkStartTs += 24 * 60 * 60 * 1000; // shift both by +24 h
    adjDarkEndTs += 24 * 60 * 60 * 1000;
  }

  // The viewing window starts when BOTH conditions are met:
  // 1. GC is above 10° (gcStart)
  // 2. It's astronomically dark (darkStart)
  const viewingStartTs = Math.max(gcStartTs, adjDarkStartTs);

  // The viewing window ends at the earliest of:
  // 1. When GC drops below 10° (gcEnd)
  // 2. Astronomical dawn (darkEnd)
  const viewingEndTs = Math.min(gcEndTs, adjDarkEndTs);

  // Check if we have a valid viewing window
  if (viewingStartTs >= viewingEndTs) {
    return emptyWindow("No overlap between GC visibility and dark time");
  }

  let description = "";

  // Check moon interference during viewing window
  let moonPenalty = 0;

  if (moonData.illumination > 0.05) { // Even 5% moon can cause some interference
    if (moonData.rise && moonData.set) {
      // Handle day boundary crossing for moon set time
      let moonSetTime = moonData.set.getTime();
      if (moonSetTime < moonData.rise.getTime()) {
        moonSetTime += 24 * 60 * 60 * 1000; // Add 24 hours if set is before rise
      }
      
      const moonUpDuringViewing =
        moonData.rise.getTime() <= viewingEndTs &&
        moonSetTime >= viewingStartTs;
      
      if (moonUpDuringViewing) {
        // Calculate what fraction of viewing time the moon is up
        const moonVisibleStart = Math.max(moonData.rise.getTime(), viewingStartTs);
        const moonVisibleEnd = Math.min(moonSetTime, viewingEndTs);
        const moonVisibleDuration = Math.max(0, moonVisibleEnd - moonVisibleStart);
        const totalViewingDuration = viewingEndTs - viewingStartTs;
        const moonFraction = moonVisibleDuration / totalViewingDuration;
        
        moonPenalty = moonData.illumination * moonFraction;
      }
    } else {
      // Fallback: assume moon is up if altitude > 0
      if (moonData.altitude > 0) {
        moonPenalty = moonData.illumination;
      }
    }
  }

  // viewingStartTs and viewingEndTs are always valid here
  const durationMs = viewingEndTs - viewingStartTs;
  const durationHours = durationMs / (1000 * 60 * 60);

  if (moonPenalty > 0.05) {
    description = `Moon interference (${Math.round(
      moonPenalty * 100
    )}% illuminated)`;
  } else {
    description = "Optimal conditions";
  }

  return {
    startTime: new Date(viewingStartTs),
    endTime: new Date(viewingEndTs),
    duration: durationHours,
    description,
  };
}

export function formatOptimalViewingTime(window: OptimalViewingWindow, location?: import('../types/astronomy').Location): string {
  if (!window.startTime) {
    return "";
  }

  if (location) {
    // Use location timezone formatting - inline implementation to avoid circular imports
    try {
      // Approximate timezone based on longitude (15 degrees per hour)
      const timezoneOffset = Math.round(location.lng / 15)
      
      // Create a new date with the estimated timezone offset
      const localTime = new Date(window.startTime.getTime() + (timezoneOffset * 60 * 60 * 1000))
      
      // Format as HH:MM in 24-hour format using UTC methods (since we already adjusted the time)
      const hours = localTime.getUTCHours().toString().padStart(2, '0')
      const minutes = localTime.getUTCMinutes().toString().padStart(2, '0')
      
      return `${hours}:${minutes}`
    } catch (error) {
      console.error('Error formatting optimal viewing time in location timezone:', error)
      // Fall through to browser timezone
    }
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
  if (window.duration <= 0) {
    return "";
  }

  // TODO: Fix this filtering logic - should show nighttime portion of viewing window
  // For now, bypass filtering to debug the intersection calculation
  // if (window.startTime) {
  //   const hour = window.startTime.getHours()
  //   if (hour >= 6 && hour <= 18) {
  //     return ''
  //   }
  // }

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
