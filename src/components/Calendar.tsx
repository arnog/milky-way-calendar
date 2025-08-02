import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Location, WeekData } from "../types/astronomy";
import { getVisibilityDescription } from "../utils/visibilityRating";
import StarRating from "./StarRating";
import { calculateGalacticCenterPosition } from "../utils/galacticCenter";
import { calculateMoonData } from "../utils/moonCalculations";
import { calculateTwilightTimes } from "../utils/twilightCalculations";
import { calculateVisibilityRating, getVisibilityRatingNumber } from "../utils/visibilityRating";
import {
  getOptimalViewingWindow,
  formatOptimalViewingTime,
  formatOptimalViewingDuration,
} from "../utils/optimalViewing";
import { generateEventStructuredData } from "../utils/structuredData";
import FormattedTime from "./FormattedTime";
import styles from "./Calendar.module.css";

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
          const optimalWindow = getOptimalViewingWindow(
            gcData,
            moonData,
            twilightData,
            location,
            midWeek,
            0.3   // Decent viewing threshold
          );

          let gcDataForRating = gcData;
          if (optimalWindow.startTime) {
            gcDataForRating = calculateGalacticCenterPosition(
              optimalWindow.startTime,
              location
            );
          }

          const visibilityResult = calculateVisibilityRating(
            gcDataForRating,
            moonData,
            twilightData,
            optimalWindow,
            location,
            midWeek
          );
          const visibility = getVisibilityRatingNumber(visibilityResult);
          const visibilityReason = typeof visibilityResult === 'object' ? visibilityResult.reason : undefined;

          weeks.push({
            weekNumber: currentWeekNumber + weekOffset,
            startDate,
            visibility,
            moonPhase: moonData.phase,
            moonIllumination: moonData.illumination,
            gcTime: formatOptimalViewingTime(optimalWindow, location),
            gcDuration: formatOptimalViewingDuration(optimalWindow),
            gcAltitude: gcData.altitude,
            twilightEnd: twilightData.night
              ? new Date(twilightData.night)
              : null,
            twilightStart: twilightData.dayEnd
              ? new Date(twilightData.dayEnd)
              : null,
            optimalConditions: optimalWindow.description,
            optimalWindow: optimalWindow,
            visibilityReason: visibilityReason,
          });
        } catch (error) {
          console.error(
            `Error calculating week starting ${startDate.toDateString()}:`,
            error
          );
        }
      }

      return weeks;
    },
    [location]
  );

  // Initial load
  useEffect(() => {
    const loadInitial = async () => {
      setIsLoading(true);
      const initialWeeks = await loadWeeks(1, 12);
      setWeekData(initialWeeks);
      setWeeksLoaded(12);
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
        loadWeeks(weeksLoaded + 1, 12).then((newWeeks) => {
          setWeekData((prev) => [...prev, ...newWeeks]);
          setWeeksLoaded((prev) => prev + 12);
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
    const opacity = visibility * 0.15;
    return {
      background: `linear-gradient(to right, 
        rgba(42, 56, 144, ${opacity}), 
        rgba(56, 88, 176, ${opacity * 0.4}), 
        rgba(42, 56, 144, ${opacity * 0.3}))`,
      backgroundSize: "200% 100%",
      animation: visibility >= 3 ? "shimmer 6s ease-in-out infinite" : "none",
    };
  };

  // Filter out weeks with no visibility
  const visibleWeeks = useMemo(
    () => weekData.filter((week) => week.visibility > 0),
    [weekData]
  );

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>
          {currentYear} Milky Way Visibility Calendar
        </h2>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingContent}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>
              Calculating astronomical data...
            </p>
            <p className={styles.loadingSubtext}>This may take a moment</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if there are no visible weeks
  if (visibleWeeks.length === 0 && !isLoadingMore) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Milky Way Visibility Weekly Calendar</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <tbody>
            {visibleWeeks.map((week) => {
              const structuredData = generateEventStructuredData(
                week,
                location
              );

              return (
                <tr
                  key={`${week.startDate.getFullYear()}-${week.weekNumber}`}
                  className={styles.tableRow}
                  style={getRowBackground(week.visibility)}
                  title={getVisibilityDescription(week.visibility)}
                >
                  {structuredData && (
                    <script
                      type="application/ld+json"
                      dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData, null, 2),
                      }}
                    />
                  )}
                  <td className={styles.dateCell}>
                    {week.startDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year:
                        week.startDate.getFullYear() !== currentYear
                          ? "numeric"
                          : undefined,
                    })}
                  </td>
                  <td className={styles.visibilityCell}>
                    <StarRating rating={week.visibility} size="md" reason={week.visibilityReason} />
                  </td>
                  <td className={styles.timeCell}>
                    <FormattedTime 
                      timeString={formatOptimalViewingTime(week.optimalWindow, location)}
                      className=""
                    />
                    <span className="small-caps"> for </span>
                    {formatOptimalViewingDuration(week.optimalWindow)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {weekData.length > 0 && (
        <div ref={loadMoreRef} className={styles.loadMoreSection}>
          {isLoadingMore && (
            <div className={styles.loadingMoreContainer}>
              <div className={styles.smallSpinner}></div>
              Loading more weeks...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
