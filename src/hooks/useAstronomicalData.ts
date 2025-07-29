import { useState, useEffect } from "react";
import { Location, WeekData } from "../types/astronomy";
import { calculateGalacticCenterPosition } from "../utils/galacticCenter";
import { calculateMoonData } from "../utils/moonCalculations";
import { calculateTwilightTimes } from "../utils/twilightCalculations";
import { calculateVisibilityRating } from "../utils/visibilityRating";
import {
  calculateOptimalViewingWindow,
  formatOptimalViewingTime,
  formatOptimalViewingDuration,
} from "../utils/optimalViewing";

export function useAstronomicalData(location: Location | null) {
  const [weekData, setWeekData] = useState<WeekData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!location) {
      setWeekData([]);
      return;
    }

    setIsLoading(true);

    // Calculate data for all 52 weeks of the year
    const calculateWeekData = async () => {
      const weeks: WeekData[] = [];
      const year = new Date().getFullYear(); // Use current year

      for (let weekNumber = 1; weekNumber <= 52; weekNumber++) {
        // Calculate the start date of each week
        const startDate = new Date(year, 0, 1 + (weekNumber - 1) * 7);

        // Use middle of the week for calculations
        const midWeek = new Date(startDate);
        midWeek.setDate(startDate.getDate() + 3);

        try {
          // Calculate astronomical data for this week
          const gcData = calculateGalacticCenterPosition(midWeek, location);
          const moonData = calculateMoonData(midWeek, location);
          const twilightData = calculateTwilightTimes(midWeek, location);

          // Calculate optimal viewing window
          const optimalWindow = calculateOptimalViewingWindow(
            gcData,
            moonData,
            twilightData
          );

          // Recalculate GC data at the optimal viewing time for accurate visibility rating
          let gcDataForRating = gcData;
          if (optimalWindow.startTime) {
            gcDataForRating = calculateGalacticCenterPosition(
              optimalWindow.startTime,
              location
            );
          }

          // Calculate visibility rating based on the actual optimal viewing window
          const visibility = calculateVisibilityRating(
            gcDataForRating,
            moonData,
            twilightData,
            optimalWindow
          );

          // Format times and durations
          const gcTime = formatOptimalViewingTime(optimalWindow);
          const gcDuration = formatOptimalViewingDuration(optimalWindow);

          weeks.push({
            weekNumber,
            startDate,
            visibility,
            moonPhase: moonData.phase,
            moonIllumination: moonData.illumination,
            gcTime,
            gcDuration,
            gcAltitude: gcData.altitude,
            twilightEnd: new Date(twilightData.night),
            twilightStart: new Date(twilightData.dayEnd),
            optimalConditions: optimalWindow.description,
          });
        } catch (error) {
          console.error(
            `Error calculating data for week ${weekNumber}:`,
            error
          );
          // Add fallback data for this week
          weeks.push({
            weekNumber,
            startDate,
            visibility: 1,
            moonPhase: 0,
            moonIllumination: 0,
            gcTime: "Error",
            gcDuration: "Error",
            gcAltitude: 0,
            twilightEnd: null,
            twilightStart: null,
            optimalConditions: "Calculation error",
          });
        }
      }

      setWeekData(weeks);
      setIsLoading(false);
    };

    // Use setTimeout to prevent blocking the UI
    const timeoutId = setTimeout(calculateWeekData, 100);

    return () => clearTimeout(timeoutId);
  }, [location]);

  return { weekData, isLoading };
}
