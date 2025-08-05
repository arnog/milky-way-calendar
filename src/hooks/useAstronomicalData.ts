import { useState, useEffect, useCallback } from "react";
import { useLocation } from "./useLocation";
import { calculateAstronomicalEvents } from "../utils/calculateAstronomicalEvents";
import { formatOptimalViewingDuration } from "../utils/integratedOptimalViewing";
import { APP_CONFIG } from "../config/appConfig";
import {
  AstronomicalDataItem,
  AstronomicalDataTableConfig,
  UseAstronomicalDataResult,
} from "../types/astronomicalDataTable";

/**
 * Unified hook for loading astronomical data in both daily and weekly modes
 */
export function useAstronomicalData(
  currentDate?: Date,
  config: AstronomicalDataTableConfig = { mode: "daily" },
): UseAstronomicalDataResult {
  const { location } = useLocation();
  const [items, setItems] = useState<AstronomicalDataItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemsLoaded, setItemsLoaded] = useState(0);

  // Default config values
  const {
    mode,
    initialItemCount = mode === "daily" ? 7 : 12,
    itemsPerBatch = mode === "daily" ? 7 : 12,
    maxItems = mode === "daily" ? 30 : 260,
    filterZeroVisibility = mode === "weekly",
  } = config;

  /**
   * Load daily astronomical data
   */
  const loadDailyData = useCallback(
    async (
      startOffset: number,
      count: number,
    ): Promise<AstronomicalDataItem[]> => {
      if (!location) return [];

      const today = currentDate || new Date();
      const data: AstronomicalDataItem[] = [];

      for (let i = 0; i < count; i++) {
        const date = new Date(
          today.getTime() + (startOffset + i) * APP_CONFIG.ASTRONOMY.MS_PER_DAY,
        );

        try {
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
            moonIllumination: events.moonIllumination / 100, // Convert to 0-1 range
          });
        } catch (error) {
          console.error(
            `Error calculating daily data for ${date.toDateString()}:`,
            error,
          );
        }
      }

      return data;
    },
    [location, currentDate],
  );

  /**
   * Load weekly astronomical data
   */
  const loadWeeklyData = useCallback(
    async (
      startWeek: number,
      count: number,
    ): Promise<AstronomicalDataItem[]> => {
      if (!location) return [];

      const today = currentDate || new Date();
      const data: AstronomicalDataItem[] = [];

      const currentWeekNumber =
        Math.floor(
          (today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) /
            (7 * APP_CONFIG.ASTRONOMY.MS_PER_DAY),
        ) + 1;

      for (let i = 0; i < count; i++) {
        const weekOffset = startWeek + i - 1;
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay() + weekOffset * 7);

        const midWeek = new Date(startDate);
        midWeek.setDate(startDate.getDate() + 3);

        try {
          const events = calculateAstronomicalEvents(midWeek, location);

          const item: AstronomicalDataItem = {
            date: midWeek,
            startDate,
            weekNumber: currentWeekNumber + weekOffset,
            visibility: events.visibility,
            visibilityReason: events.visibilityReason,
            optimalWindow: events.optimalWindow,
            gcDuration: formatOptimalViewingDuration(events.optimalWindow),
            moonIllumination: events.moonIllumination / 100, // Convert to 0-1 range
          };

          // Apply filtering if enabled
          if (!filterZeroVisibility || item.visibility > 0) {
            data.push(item);
          }
        } catch (error) {
          console.error(
            `Error calculating weekly data for week starting ${startDate.toDateString()}:`,
            error,
          );
        }
      }

      return data;
    },
    [location, currentDate, filterZeroVisibility],
  );

  /**
   * Load data based on mode
   */
  const loadData = useCallback(
    async (
      startIndex: number,
      count: number,
    ): Promise<AstronomicalDataItem[]> => {
      if (mode === "daily") {
        return loadDailyData(startIndex, count);
      } else {
        return loadWeeklyData(startIndex + 1, count); // Weekly mode uses 1-based indexing
      }
    },
    [mode, loadDailyData, loadWeeklyData],
  );

  /**
   * Initial data load
   */
  const loadInitialData = useCallback(async () => {
    if (!location) {
      setItems([]);
      setItemsLoaded(0);
      return;
    }

    setError(null);

    try {
      const initialData = await loadData(0, initialItemCount);
      setItems(initialData);
      setItemsLoaded(initialItemCount);
    } catch (err) {
      console.error("Error loading initial astronomical data:", err);
      setError("Failed to load astronomical data");
    }
  }, [location, loadData, initialItemCount]);

  /**
   * Load more data (for infinite scroll)
   */
  const loadMore = useCallback(async () => {
    if (!location || isLoadingMore || itemsLoaded >= maxItems) return;

    setIsLoadingMore(true);

    try {
      const moreData = await loadData(itemsLoaded, itemsPerBatch);
      setItems((prev) => [...prev, ...moreData]);
      setItemsLoaded((prev) => prev + itemsPerBatch);
    } catch (err) {
      console.error("Error loading more astronomical data:", err);
      setError("Failed to load more data");
    } finally {
      setIsLoadingMore(false);
    }
  }, [location, isLoadingMore, itemsLoaded, maxItems, loadData, itemsPerBatch]);

  /**
   * Refresh all data
   */
  const refresh = useCallback(() => {
    setItems([]);
    setItemsLoaded(0);
    loadInitialData();
  }, [loadInitialData]);

  // Load initial data when dependencies change
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Calculate if more items can be loaded
  const canLoadMore = itemsLoaded < maxItems && !isLoadingMore;

  return {
    items,
    isLoadingMore,
    error,
    itemsLoaded,
    canLoadMore,
    loadMore,
    refresh,
  };
}
