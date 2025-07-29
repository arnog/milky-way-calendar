import { useState, useEffect, useRef, useCallback } from "react";
import { Location, WeekData } from "../types/astronomy";
import { getVisibilityDescription } from "../utils/visibilityRating";
import StarRating from "./StarRating";
import { calculateGalacticCenterPosition } from "../utils/galacticCenter";
import { calculateMoonData } from "../utils/moonCalculations";
import { calculateTwilightTimes } from "../utils/twilightCalculations";
import { calculateVisibilityRating } from "../utils/visibilityRating";
import {
  calculateOptimalViewingWindow,
  formatOptimalViewingTime,
  formatOptimalViewingDuration,
} from "../utils/optimalViewing";

interface CalendarProps {
  location: Location;
}

export default function Calendar({ location }: CalendarProps) {
  const [weekData, setWeekData] = useState<WeekData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [weeksLoaded, setWeeksLoaded] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();

  const loadWeeks = useCallback(
    async (startWeek: number, numWeeks: number) => {
      const weeks: WeekData[] = [];
      const today = new Date();
      const currentWeekNumber =
        Math.floor(
          (today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) /
            (7 * 24 * 60 * 60 * 1000)
        ) + 1;

      for (let i = 0; i < numWeeks; i++) {
        const weekOffset = startWeek + i - 1;
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay() + weekOffset * 7);

        const midWeek = new Date(startDate);
        midWeek.setDate(startDate.getDate() + 3);

        try {
          const gcData = calculateGalacticCenterPosition(midWeek, location);
          const moonData = calculateMoonData(midWeek, location);
          const twilightData = calculateTwilightTimes(midWeek, location);
          const optimalWindow = calculateOptimalViewingWindow(
            gcData,
            moonData,
            twilightData
          );

          let gcDataForRating = gcData;
          if (optimalWindow.startTime) {
            gcDataForRating = calculateGalacticCenterPosition(
              optimalWindow.startTime,
              location
            );
          }

          const visibility = calculateVisibilityRating(
            gcDataForRating,
            moonData,
            twilightData,
            optimalWindow,
            location
          );

          // Add all weeks (including those with visibility = 0)
          {
            // Get GC times for display
            const gcRiseSet = calculateGalacticCenterRiseSet(midWeek, location);

            weeks.push({
              weekNumber: currentWeekNumber + weekOffset,
              startDate,
              visibility,
              moonPhase: moonData.phase,
              moonIllumination: moonData.illumination,
              gcTime: gcRiseSet.riseTime,
              gcDuration: gcRiseSet.transitTime,
              gcAltitude: gcData.altitude,
              twilightEnd: twilightData.night
                ? new Date(twilightData.night)
                : null,
              twilightStart: twilightData.dayEnd
                ? new Date(twilightData.dayEnd)
                : null,
              optimalConditions: optimalWindow.description,
              optimalWindow: optimalWindow,
            });
          }
        } catch (error) {
          console.error(
            `Error calculating week starting ${startDate.toDateString()}:`,
            error
          );
        }
      }

      return weeks;
    },
    [location, currentYear]
  );

  // Calculate GC rise/transit times for display
  const calculateGalacticCenterRiseSet = (date: Date, loc: Location) => {
    const gcRa = 17.759; // hours
    const gcDec = -29.008; // degrees

    try {
      // Check if GC is circumpolar or never rises
      const latRad = (loc.lat * Math.PI) / 180;
      const decRad = (gcDec * Math.PI) / 180;

      // Hour angle at horizon
      const cosH = -Math.tan(latRad) * Math.tan(decRad);

      if (cosH > 1) {
        // Never rises
        return {
          riseTime: "Never rises",
          transitTime: "N/A",
        };
      } else if (cosH < -1) {
        // Circumpolar (always visible)
        const transitTime = new Date(date);
        const lstTransit = gcRa;
        const utTransit = (lstTransit - loc.lng / 15 + 24) % 24;
        transitTime.setUTCHours(Math.floor(utTransit));
        transitTime.setUTCMinutes((utTransit % 1) * 60);

        return {
          riseTime: "Circumpolar",
          transitTime: transitTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
        };
      }

      const H = (Math.acos(cosH) * 180) / Math.PI / 15; // hours

      // Calculate rise time
      const riseTime = new Date(date);
      const lstRise = gcRa - H;
      const utRise = (lstRise - loc.lng / 15 + 24) % 24;
      riseTime.setUTCHours(Math.floor(utRise));
      riseTime.setUTCMinutes((utRise % 1) * 60);

      // Calculate transit time
      const transitTime = new Date(date);
      const lstTransit = gcRa;
      const utTransit = (lstTransit - loc.lng / 15 + 24) % 24;
      transitTime.setUTCHours(Math.floor(utTransit));
      transitTime.setUTCMinutes((utTransit % 1) * 60);

      return {
        riseTime: riseTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        transitTime: transitTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };
    } catch (error) {
      console.error("Error calculating GC times:", error);
      return {
        riseTime: "Error",
        transitTime: "Error",
      };
    }
  };

  // Initial load
  useEffect(() => {
    const loadInitial = async () => {
      setIsLoading(true);
      const initialWeeks = await loadWeeks(1, 52);
      setWeekData(initialWeeks);
      setWeeksLoaded(52);
      setIsLoading(false);
    };
    loadInitial();
  }, [location, loadWeeks]);

  // Infinite scroll setup
  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoadingMore && weeksLoaded < 260) {
        setIsLoadingMore(true);
        loadWeeks(weeksLoaded + 1, 52).then((newWeeks) => {
          setWeekData((prev) => [...prev, ...newWeeks]);
          setWeeksLoaded((prev) => prev + 52);
          setIsLoadingMore(false);
        });
      }
    };

    observerRef.current = new IntersectionObserver(handleObserver);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [weeksLoaded, isLoadingMore, loadWeeks]);

  // Dynamic background based on visibility
  const getRowBackground = (visibility: number) => {
    const opacity = visibility * 0.1;
    return {
      background: `linear-gradient(to right, 
        rgba(42, 56, 144, ${opacity}), 
        rgba(56, 88, 176, ${opacity * 0.8}), 
        rgba(42, 56, 144, ${opacity * 0.6}))`,
      backgroundSize: "200% 100%",
      animation: visibility >= 3 ? "shimmer 8s ease-in-out infinite" : "none",
    };
  };

  if (isLoading) {
    return (
      <div className="glass-morphism p-6">
        <h2 className="text-2xl font-semibold mb-6">
          {currentYear} Milky Way Visibility Calendar
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 mx-auto mb-4"
              style={{
                border: "2px solid transparent",
                borderBottom: "2px solid #a8b5ff",
              }}
            ></div>
            <p className="text-gray-300">Calculating astronomical data...</p>
            <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-morphism p-6">
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-center text-3xl py-3 px-2">Date</th>
              <th className="text-center text-3xl py-3 px-2">Visibility</th>
              <th className="text-center text-3xl py-3 px-2">
                Galactic Core Rise
              </th>
              <th className="text-center text-3xl py-3 px-2">Duration</th>
            </tr>
          </thead>
          <tbody>
            {weekData
              .filter((week) => week.visibility > 0)
              .map((week, index) => (
                <tr
                  key={`${week.startDate.getFullYear()}-${week.weekNumber}`}
                  className="border-b border-white/10 hover:bg-white/5 transition-all duration-300"
                  style={getRowBackground(week.visibility)}
                  title={getVisibilityDescription(week.visibility)}
                >
                  <td className="py-3 px-2 text-2xl text-center">
                    {week.startDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year:
                        week.startDate.getFullYear() !== currentYear
                          ? "numeric"
                          : undefined,
                    })}
                  </td>
                  <td className="py-3 px-2 text-3xl text-center">
                    <StarRating rating={week.visibility} size="lg" />
                  </td>
                  <td className="py-3 px-2 text-3xl text-center font-mono">
                    {formatOptimalViewingTime(week.optimalWindow, location)}
                  </td>
                  <td className="py-3 px-2 text-3xl text-center font-mono">
                    {formatOptimalViewingDuration(week.optimalWindow)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {weekData.length > 0 && (
        <div ref={loadMoreRef} className="mt-4 text-center">
          {isLoadingMore && (
            <div className="inline-flex items-center gap-2 text-gray-400">
              <div
                className="animate-spin rounded-full h-4 w-4"
                style={{
                  border: "2px solid transparent",
                  borderBottom: "2px solid #a8b5ff",
                }}
              ></div>
              Loading more weeks...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
