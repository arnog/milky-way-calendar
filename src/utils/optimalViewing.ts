import {
  Location,
  GalacticCenterData,
  MoonData,
  TwilightData,
} from "../types/astronomy";

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
  date: Date,
  _location: Location,
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

  // Dark time window
  const darkStart = twilightData.night; // Astronomical twilight ends
  const darkEnd = twilightData.dayEnd; // Astronomical twilight begins (next day)

  // Debug for Sep 21 (week 39 starts Sep 21)
  const debugDate = date.toISOString().split("T")[0];
  const DEBUG_DATES = ["2025-09-17", "2025-09-24"];
  if (DEBUG_DATES.includes(debugDate)) {
    // Debug specific dates
    console.log(`Optimal viewing debug for ${debugDate}:`);
    console.log(`  Date: ${date.toISOString()}`);
    console.log(
      `  GC: ${gcStart?.toLocaleString() || "null"} - ${
        gcEnd?.toLocaleString() || "null"
      }`
    );
    console.log(
      `  Dark: ${darkStart?.toLocaleString() || "null"} - ${
        darkEnd?.toLocaleString() || "null"
      }`
    );
  }

  if (!gcStart) {
    return emptyWindow("GC not visible (below 10°)");
  }

  if (!darkStart || !darkEnd) {
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
  const darkStartTs = darkStart.getTime();
  let darkEndTs = darkEnd.getTime();

  // Handle day boundary: if darkEnd is before darkStart, it's next day
  if (darkEndTs < darkStartTs) {
    darkEndTs += 24 * 60 * 60 * 1000; // Add 24 hours
  }

  // The viewing window starts when BOTH conditions are met:
  // 1. GC is above 10° (gcStart)
  // 2. It's astronomically dark (darkStart)
  const viewingStartTs = Math.max(gcStartTs, darkStartTs);

  // The viewing window ends at the earliest of:
  // 1. When GC drops below 10° (gcEnd)
  // 2. Astronomical dawn (darkEnd)
  const viewingEndTs = Math.min(gcEndTs, darkEndTs);

  // Debug for Sep 21
  if (DEBUG_DATES.includes(debugDate)) {
    console.log(`  Timestamps:`);
    console.log(
      `    GC start: ${gcStartTs} (${new Date(gcStartTs).toLocaleString()})`
    );
    console.log(
      `    GC end: ${gcEndTs} (${new Date(gcEndTs).toLocaleString()})`
    );
    console.log(
      `    Dark start: ${darkStartTs} (${new Date(
        darkStartTs
      ).toLocaleString()})`
    );
    console.log(
      `    Dark end: ${darkEndTs} (${new Date(darkEndTs).toLocaleString()})`
    );
    console.log(
      `    Viewing start: ${viewingStartTs} (${new Date(
        viewingStartTs
      ).toLocaleString()})`
    );
    console.log(
      `    Viewing end: ${viewingEndTs} (${new Date(
        viewingEndTs
      ).toLocaleString()})`
    );
  }

  // Check if we have a valid viewing window
  if (viewingStartTs >= viewingEndTs) {
    return emptyWindow("No overlap between GC visibility and dark time");
  }

  const viewingStart = new Date(viewingStartTs);
  const viewingEnd = new Date(viewingEndTs);
  let description = "";

  // Check moon interference (now as a penalty scaling with illumination)
  let moonPenalty = 0;

  if (moonData.illumination > 0.3) {
    if (moonData.rise && moonData.set) {
      if (viewingStart && viewingEnd) {
        let moonSetTime = moonData.set.getTime();
        if (moonSetTime < moonData.rise.getTime()) {
          moonSetTime += 24 * 60 * 60 * 1000;
        }
        const moonUpDuringViewing =
          moonData.rise.getTime() <= viewingEnd.getTime() &&
          moonSetTime >= viewingStart.getTime();
        if (moonUpDuringViewing) {
          moonPenalty = moonData.illumination; // range [0, 1]
        }
      }
    } else {
      const moonAltitudeAtStart =
        moonData.altitudeAt?.(viewingStart) ?? moonData.altitude;
      const moonAltitudeAtEnd =
        moonData.altitudeAt?.(viewingEnd) ?? moonData.altitude;
      if (moonAltitudeAtStart > 0 || moonAltitudeAtEnd > 0) {
        moonPenalty = moonData.illumination;
      }
    }
  }

  if (!viewingStart || !viewingEnd) {
    return emptyWindow("No overlap between GC visibility and dark time");
  }

  const durationMs = viewingEnd.getTime() - viewingStart.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);

  if (moonPenalty > 0.05) {
    description = `Moon interference (${Math.round(
      moonPenalty * 100
    )}% illuminated)`;
  } else {
    description = "Optimal conditions";
  }

  const result = {
    startTime: viewingStart,
    endTime: viewingEnd,
    duration: durationHours,
    description,
  };

  // Debug for Sep 21
  if (DEBUG_DATES.includes(debugDate)) {
    console.log(
      `  Result: ${result.startTime?.toLocaleTimeString() || "null"} - ${
        result.endTime?.toLocaleTimeString() || "null"
      }, duration: ${result.duration}h`
    );
  }

  return result;
}

export function formatOptimalViewingTime(window: OptimalViewingWindow): string {
  if (!window.startTime) {
    return "";
  }

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
