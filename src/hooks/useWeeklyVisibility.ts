import { useState, useEffect } from "react";
import { Location } from "../types/astronomy";
import { calculateGalacticCenterPosition } from "../utils/galacticCenter";
import { calculateMoonData } from "../utils/moonCalculations";
import { calculateTwilightTimes } from "../utils/twilightCalculations";
import { calculateVisibilityRating, getVisibilityRatingNumber } from "../utils/visibilityRating";
import {
  getOptimalViewingWindow,
  OptimalViewingWindow,
} from "../utils/integratedOptimalViewing";
import * as Astronomy from "astronomy-engine";

export interface DayData {
  date: Date;
  visibility: number;
  visibilityReason?: string;
  optimalWindow: OptimalViewingWindow;
  // Expanded view data
  sunRise?: Date;
  sunSet?: Date;
  astronomicalTwilightEnd?: Date;
  astronomicalTwilightStart?: Date;
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
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to calculate weekly visibility data
 * Extracts the data calculation logic from DailyVisibilityTable component
 */
export function useWeeklyVisibility(
  location: Location | null,
  currentDate?: Date,
  numberOfDays: number = 7
): UseWeeklyVisibilityResult {
  const [dailyData, setDailyData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) {
      setDailyData([]);
      setIsLoading(false);
      return;
    }

    const calculateDailyData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const today = currentDate || new Date();
        const data: DayData[] = [];

        // Calculate data for the specified number of days
        for (let i = 0; i < numberOfDays; i++) {
          const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);

          // Calculate astronomical data for this day
          const gcData = calculateGalacticCenterPosition(date, location);
          const moonData = calculateMoonData(date, location);
          const twilightData = calculateTwilightTimes(date, location);

          const optimalWindow = getOptimalViewingWindow(
            gcData,
            moonData,
            twilightData,
            location,
            date,
            0.3   // Decent viewing threshold
          );
          const visibilityResult = calculateVisibilityRating(
            gcData,
            moonData,
            twilightData,
            optimalWindow,
            location,
            date
          );
          const visibility = getVisibilityRatingNumber(visibilityResult);
          const visibilityReason = typeof visibilityResult === 'object' ? visibilityResult.reason : undefined;

          // Calculate sunrise and sunset
          const observer = new Astronomy.Observer(location.lat, location.lng, 0);
          const sunrise = Astronomy.SearchRiseSet(
            Astronomy.Body.Sun,
            observer,
            +1, // Direction: +1 = Rise
            date,
            1
          );
          const sunset = Astronomy.SearchRiseSet(
            Astronomy.Body.Sun,
            observer,
            -1, // Direction: -1 = Set
            date,
            1
          );

          data.push({
            date,
            visibility,
            visibilityReason,
            optimalWindow,
            sunRise: sunrise ? sunrise.date : undefined,
            sunSet: sunset ? sunset.date : undefined,
            astronomicalTwilightEnd: twilightData.night
              ? new Date(twilightData.night)
              : undefined,
            astronomicalTwilightStart: twilightData.dayEnd
              ? new Date(twilightData.dayEnd)
              : undefined,
            moonRise: moonData.rise || undefined,
            moonSet: moonData.set || undefined,
            gcRise: gcData.riseTime || undefined,
            gcTransit: gcData.transitTime || undefined,
            gcSet: gcData.setTime || undefined,
            maxGcAltitude: gcData.altitude,
            moonPhase: moonData.phase,
            moonIllumination: moonData.illumination,
          });
        }

        setDailyData(data);
      } catch (error) {
        console.error("useWeeklyVisibility: Error calculating daily visibility data:", error);
        setError("Failed to calculate weekly visibility data");
      } finally {
        setIsLoading(false);
      }
    };

    calculateDailyData();
  }, [location, currentDate, numberOfDays]);

  return {
    dailyData,
    isLoading: !location || isLoading,
    error
  };
}