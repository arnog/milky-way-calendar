import { useState, useEffect } from "react";
import { useLocation } from "./useLocation";
import { calculateAstronomicalEvents } from "../utils/calculateAstronomicalEvents";
import { OptimalViewingWindow } from "../utils/integratedOptimalViewing";
import { APP_CONFIG } from "../config/appConfig";

export interface DayData {
  date: Date;
  visibility: number;
  visibilityReason?: string;
  optimalWindow: OptimalViewingWindow;
  // Expanded view data
  sunRise?: Date;
  sunSet?: Date;
  nightStart?: Date;
  nightEnd?: Date;
  moonRise?: Date;
  moonSet?: Date;
  gcRise?: Date;
  gcTransit?: Date;
  gcSet?: Date;
  maxGcAltitude: number;
  moonPhase: number;
  moonIllumination: number;
}

export interface UseWeeklyVisibilityResult {
  dailyData: DayData[];
  error: string | null;
}

/**
 * Custom hook to calculate weekly visibility data
 * Extracts the data calculation logic from DailyVisibilityTable component
 */
export function useWeeklyVisibility(
  currentDate?: Date,
  numberOfDays: number = 7,
): UseWeeklyVisibilityResult {
  const { location } = useLocation();
  const [dailyData, setDailyData] = useState<DayData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) {
      setDailyData([]);
      return;
    }

    const calculateDailyData = async () => {
      setError(null);

      try {
        const today = currentDate || new Date();
        const data: DayData[] = [];

        // Calculate data for the specified number of days
        for (let i = 0; i < numberOfDays; i++) {
          const date = new Date(
            today.getTime() + i * APP_CONFIG.ASTRONOMY.MS_PER_DAY,
          );

          // Calculate all astronomical events for this day
          const events = calculateAstronomicalEvents(date, location);

          data.push({
            date,
            visibility: events.visibility,
            visibilityReason: events.visibilityReason,
            optimalWindow: events.optimalWindow,
            sunRise: events.sunRise,
            sunSet: events.sunSet,
            nightStart: events.nightStart,
            nightEnd: events.nightEnd,
            moonRise: events.moonRise,
            moonSet: events.moonSet,
            gcRise: events.gcRise,
            gcTransit: events.gcTransit,
            gcSet: events.gcSet,
            maxGcAltitude: events.maxGcAltitude,
            moonPhase: events.moonPhase,
            moonIllumination: events.moonIllumination / 100, // Convert back to 0-1 range
          });
        }

        setDailyData(data);
      } catch (error) {
        console.error(
          "useWeeklyVisibility: Error calculating daily visibility data:",
          error,
        );
        setError("Failed to calculate weekly visibility data");
      }
    };

    calculateDailyData();
  }, [location, currentDate, numberOfDays]);

  return {
    dailyData,
    error,
  };
}
