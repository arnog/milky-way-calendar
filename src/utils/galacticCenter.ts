import * as Astronomy from "astronomy-engine";
import { Location, GalacticCenterData } from "../types/astronomy";
import { APP_CONFIG } from "../config/appConfig";

// Galactic Core coordinates (J2000)
const GALACTIC_CENTER_RA = 17.759; // hours (17h 45m 36s)
const GALACTIC_CENTER_DEC = -29.007; // degrees (-29° 0' 25")

export function calculateGalacticCenterData(
  date: Date,
  location: Location,
): GalacticCenterData {
  try {
    // Create observer
    const observer = new Astronomy.Observer(location.lat, location.lng, 0);

    // Calculate horizontal coordinates at the given time
    const horizontal = Astronomy.Horizon(
      date,
      observer,
      GALACTIC_CENTER_RA,
      GALACTIC_CENTER_DEC,
    );

    // Calculate rise, set, and transit times for the Galactic Core
    let riseTime: Date | null = null;
    let setTime: Date | null = null;
    let transitTime: Date | null = null;

    // We'll calculate transit time after we have rise and set times

    // We'll use the current horizontal position for altitude/azimuth in the return value

    // Adaptive altitude threshold:
    //   • Jan - Jul  -> 20°
    //   • Aug - Sep -> 15°
    //   • Oct - Dec -> 10°
    const month = date.getMonth(); // 0 = January
    const targetAltitude =
      month < 7 ? 20 : month < 9 ? 15 : APP_CONFIG.ASTRONOMY.MIN_GC_ALTITUDE;

    try {
      // Search from 6 h before the given date to 36 h after,
      // capturing cases where the GC is already up at midnight.
      const startTime = new Date(date.getTime() - 6 * 60 * 60 * 1000); // -6 h
      const endTime = new Date(date.getTime() + 36 * 60 * 60 * 1000); // +36 h

      // Find ALL altitude crossings through the day
      const crossings: Array<{
        time: Date;
        crossing: "rise" | "set";
        altitude: number;
      }> = [];

      // Altitude at the first sample
      let previousAltitude = Astronomy.Horizon(
        startTime,
        observer,
        GALACTIC_CENTER_RA,
        GALACTIC_CENTER_DEC,
      ).altitude;

      // If GC is already above the target altitude at start, treat startTime as rise.
      if (previousAltitude >= targetAltitude && !riseTime) {
        riseTime = startTime;
      }

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
          GALACTIC_CENTER_DEC,
        );

        // Check for crossing 10° altitude
        if (
          previousAltitude < targetAltitude &&
          currentHorizontal.altitude >= targetAltitude
        ) {
          // Rising crossing
          const delta = currentHorizontal.altitude - previousAltitude;
          const fraction = (targetAltitude - previousAltitude) / delta;
          const interpolatedTime = new Date(
            time - 10 * 60 * 1000 + fraction * 10 * 60 * 1000,
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
            time - 10 * 60 * 1000 + fraction * 10 * 60 * 1000,
          );
          crossings.push({
            time: interpolatedTime,
            crossing: "set",
            altitude: targetAltitude,
          });
        }

        previousAltitude = currentHorizontal.altitude;
      }

      // Process crossings to find the main rise and set times
      // Look for the first rise and its corresponding set
      const firstRise = crossings.find((c) => c.crossing === "rise");
      const correspondingSet = crossings.find((c, index) => {
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
          GALACTIC_CENTER_DEC,
        );
        if (endHorizontal.altitude >= targetAltitude) {
          // Extend search to next day to find set time
          previousAltitude = Astronomy.Horizon(
            endTime,
            observer,
            GALACTIC_CENTER_RA,
            GALACTIC_CENTER_DEC,
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
              GALACTIC_CENTER_DEC,
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

    // Calculate transit time - should occur between rise and set when available
    // But always calculate it for informational purposes

    // Calculate initial transit based on sidereal time
    const localSiderealTime =
      Astronomy.SiderealTime(date) + location.lng / 15.0;
    let hourAngle = localSiderealTime - GALACTIC_CENTER_RA;
    hourAngle = ((((hourAngle + 12) % 24) + 24) % 24) - 12;
    const hoursToTransit = -hourAngle;
    let candidateTransit = new Date(
      date.getTime() + hoursToTransit * 60 * 60 * 1000,
    );

    if (riseTime && setTime) {
      // Ensure transit is between rise and set

      // If this transit is before rise, add sidereal days until it's after rise
      while (candidateTransit < riseTime) {
        candidateTransit = new Date(
          candidateTransit.getTime() + 23.9344696 * 60 * 60 * 1000,
        ); // Sidereal day
      }

      // If the transit is between rise and set, use it
      if (candidateTransit >= riseTime && candidateTransit <= setTime) {
        transitTime = candidateTransit;
      } else if (candidateTransit > setTime) {
        // Transit happens after set, try the previous transit
        candidateTransit = new Date(
          candidateTransit.getTime() - 23.9344696 * 60 * 60 * 1000,
        );
        if (candidateTransit >= riseTime && candidateTransit <= setTime) {
          transitTime = candidateTransit;
        }
      }
    } else if (riseTime && !setTime) {
      // GC rises but doesn't set in our search window
      // Ensure transit is after rise
      while (candidateTransit < riseTime) {
        candidateTransit = new Date(
          candidateTransit.getTime() + 23.9344696 * 60 * 60 * 1000,
        );
      }
      transitTime = candidateTransit;
    } else {
      // No rise time - GC may never be visible or always visible
      // Still provide transit time for reference
      transitTime = candidateTransit;
    }

    return {
      altitude: horizontal.altitude,
      azimuth: horizontal.azimuth,
      riseTime, // Use 10° rise time as primary rise time
      setTime, // Set time when GC descends through 10°
      transitTime,
    };
  } catch (error) {
    console.error("Error calculating Galactic Core position:", error);
    return {
      altitude: 0,
      azimuth: 0,
      riseTime: null,
      setTime: null,
      transitTime: null,
    };
  }
}
