import * as Astronomy from "astronomy-engine";
import { Location, GalacticCenterData } from "../types/astronomy";

// Galactic Center coordinates (J2000)
const GALACTIC_CENTER_RA = 17.759; // hours (17h 45m 36s)
const GALACTIC_CENTER_DEC = -29.007; // degrees (-29° 0' 25")

export function calculateGalacticCenterPosition(
  date: Date,
  location: Location
): GalacticCenterData {
  try {
    // Create observer
    const observer = new Astronomy.Observer(location.lat, location.lng, 0);

    // Calculate horizontal coordinates at the given time
    const horizontal = Astronomy.Horizon(
      date,
      observer,
      GALACTIC_CENTER_RA,
      GALACTIC_CENTER_DEC
    );

    // Calculate rise, set, and transit times for the Galactic Center
    let riseTime: Date | null = null;
    let setTime: Date | null = null;
    let transitTime: Date | null = null;

    // Get the start of the day for calculations
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    // Use more efficient calculation based on local sidereal time
    // GC transits when Local Sidereal Time = RA of GC
    const localSiderealTime =
      Astronomy.SiderealTime(date) + location.lng / 15.0; // Convert longitude to hours

    // Calculate hour angle at current time
    let hourAngle = localSiderealTime - GALACTIC_CENTER_RA;

    // Normalize hour angle to [-12, +12] range
    hourAngle = ((((hourAngle + 12) % 24) + 24) % 24) - 12;

    // Transit occurs when hour angle = 0
    const hoursToTransit = -hourAngle;
    transitTime = new Date(date.getTime() + hoursToTransit * 60 * 60 * 1000); // Use precise millisecond calculation

    // We'll use the current horizontal position for altitude/azimuth in the return value

    // Use astronomy-engine to find optimal GC viewing times
    // We want GC above 10° altitude during dark hours (after astronomical twilight)
    const targetAltitude = 10;

    try {
      // Search a full 24-hour period starting from midnight to capture all rise/set events
      const startTime = new Date(date);
      startTime.setHours(0, 0, 0, 0); // Start at midnight
      const endTime = new Date(startTime);
      endTime.setDate(endTime.getDate() + 1); // End at midnight next day

      // Find ALL altitude crossings through the day
      let crossings: Array<{
        time: Date;
        crossing: "rise" | "set";
        altitude: number;
      }> = [];
      let previousAltitude: number | null = null;

      // Search every 10 minutes through the full day
      for (
        let time = startTime.getTime();
        time < endTime.getTime();
        time += 10 * 60 * 1000
      ) {
        const currentTime = new Date(time);
        const currentHorizontal = Astronomy.Horizon(
          currentTime,
          observer,
          GALACTIC_CENTER_RA,
          GALACTIC_CENTER_DEC
        );

        if (previousAltitude !== null) {
          // Check for crossing 10° altitude
          if (
            previousAltitude < targetAltitude &&
            currentHorizontal.altitude >= targetAltitude
          ) {
            // Rising crossing
            const delta = currentHorizontal.altitude - previousAltitude;
            const fraction = (targetAltitude - previousAltitude) / delta;
            const interpolatedTime = new Date(
              time - 10 * 60 * 1000 + fraction * 10 * 60 * 1000
            );
            crossings.push({
              time: interpolatedTime,
              crossing: "rise",
              altitude: targetAltitude,
            });
          } else if (
            previousAltitude >= targetAltitude &&
            currentHorizontal.altitude < targetAltitude
          ) {
            // Setting crossing
            const delta = currentHorizontal.altitude - previousAltitude;
            const fraction = (targetAltitude - previousAltitude) / delta;
            const interpolatedTime = new Date(
              time - 10 * 60 * 1000 + fraction * 10 * 60 * 1000
            );
            crossings.push({
              time: interpolatedTime,
              crossing: "set",
              altitude: targetAltitude,
            });
          }
        }

        previousAltitude = currentHorizontal.altitude;
      }

      // Process crossings to find the main rise and set times
      // Look for the first rise and its corresponding set
      let firstRise = crossings.find((c) => c.crossing === "rise");
      let correspondingSet = crossings.find((c, index) => {
        const riseIndex = crossings.indexOf(firstRise!);
        return c.crossing === "set" && index > riseIndex;
      });

      if (firstRise) {
        riseTime = firstRise.time;
      }

      if (correspondingSet) {
        setTime = correspondingSet.time;
      } else if (firstRise) {
        // If we have a rise but no set, GC might stay above 10° for the rest of the day
        // Check if GC is still above 10° at the end of our search period
        const endHorizontal = Astronomy.Horizon(
          endTime,
          observer,
          GALACTIC_CENTER_RA,
          GALACTIC_CENTER_DEC
        );
        if (endHorizontal.altitude >= targetAltitude) {
          // Extend search to next day to find set time
          previousAltitude = Astronomy.Horizon(
            endTime,
            observer,
            GALACTIC_CENTER_RA,
            GALACTIC_CENTER_DEC
          ).altitude;
          const nextDayEnd = new Date(endTime.getTime() + 36 * 60 * 60 * 1000);
          for (
            let time = endTime.getTime();
            time < nextDayEnd.getTime();
            time += 10 * 60 * 1000
          ) {
            const currentTime = new Date(time);
            const currentHorizontal = Astronomy.Horizon(
              currentTime,
              observer,
              GALACTIC_CENTER_RA,
              GALACTIC_CENTER_DEC
            );

            if (
              previousAltitude! >= targetAltitude &&
              currentHorizontal.altitude < targetAltitude
            ) {
              setTime = currentTime;
              break;
            }

            previousAltitude = currentHorizontal.altitude;
          }
        }
      }
    } catch (error) {
      console.error("Error finding GC rise/set times:", error);
      // Fallback to null times
    }

    // Determine visibility based on whether GC can reach 10°
    const isVisible = riseTime !== null;

    return {
      altitude: horizontal.altitude,
      azimuth: horizontal.azimuth,
      isVisible,
      riseTime, // Use 10° rise time as primary rise time
      setTime, // Set time when GC descends through 10°
      transitTime,
    };
  } catch (error) {
    console.error("Error calculating Galactic Center position:", error);
    return {
      altitude: 0,
      azimuth: 0,
      isVisible: false,
      riseTime: null,
      setTime: null,
      transitTime: null,
    };
  }
}

export function formatGalacticCenterTime(gcData: GalacticCenterData): string {
  if (!gcData.riseTime && !gcData.transitTime) {
    return "Not visible";
  }

  const time = gcData.riseTime || gcData.transitTime;
  if (!time) return "Not visible";

  return time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function calculateGalacticCenterDuration(
  gcData: GalacticCenterData,
  twilightEnd: Date | null,
  twilightStart: Date | null
): string {
  if (!gcData.riseTime || !twilightEnd || !twilightStart) {
    return "No dark time";
  }

  // Calculate overlap between GC visibility and dark time
  const gcStart = gcData.riseTime;
  const gcEnd =
    gcData.setTime || new Date(gcStart.getTime() + 6 * 60 * 60 * 1000); // Assume 6h if no set time

  const darkStart = Math.max(gcStart.getTime(), twilightEnd.getTime());
  const darkEnd = Math.min(gcEnd.getTime(), twilightStart.getTime());

  if (darkStart >= darkEnd) {
    return "No overlap";
  }

  const durationMs = darkEnd - darkStart;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
}
