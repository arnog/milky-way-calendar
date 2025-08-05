import { useCallback, useRef } from "react";
import type {
  Coordinate,
  DarkSiteResult,
  MultipleDarkSitesResult,
} from "../utils/lightPollutionMap";
import type { SpecialLocation } from "../utils/locations";

export interface DarkSiteWorkerError {
  message: string;
  type: "load-error" | "search-error" | "unknown-error";
}

export interface UseDarkSiteWorkerReturn {
  findNearestDarkSky: (
    startCoord: Coordinate,
    options?: {
      maxDistance?: number;
      knownSites?: ReadonlyArray<SpecialLocation>;
      onProgress?: (progress: number) => void;
    },
  ) => Promise<DarkSiteResult | null>;

  findMultipleDarkSites: (
    startCoord: Coordinate,
    options?: {
      maxDistance?: number;
      knownSites?: ReadonlyArray<SpecialLocation>;
      onProgress?: (progress: number) => void;
    },
  ) => Promise<MultipleDarkSitesResult | null>;

  getBortleRatingForLocation: (coord: Coordinate) => Promise<number | null>;

  clearImageCache: () => Promise<boolean>;

  isWorkerSupported: boolean;
}

/**
 * Custom hook for using the Dark Site Search Web Worker
 *
 * This hook provides a clean interface for offloading heavy light pollution
 * map processing to a Web Worker, preventing UI freezing during searches.
 */
export function useDarkSiteWorker(): UseDarkSiteWorkerReturn {
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  const pendingRequestsRef = useRef<
    Map<
      number,
      {
        resolve: (value: unknown) => void;
        reject: (error: Error) => void;
        onProgress?: (progress: number) => void;
      }
    >
  >(new Map());

  // Check if Web Workers are supported
  const isWorkerSupported = typeof Worker !== "undefined";

  const getWorker = useCallback(() => {
    if (!isWorkerSupported) {
      throw new Error("Web Workers are not supported in this environment");
    }

    if (!workerRef.current) {
      try {
        workerRef.current = new Worker("/darkSiteWorker.js");

        workerRef.current.onmessage = (event) => {
          const { type, id, result, error, progress } = event.data;

          const pendingRequest = pendingRequestsRef.current.get(id);
          if (!pendingRequest) return;

          switch (type) {
            case "success":
              pendingRequest.resolve(result);
              pendingRequestsRef.current.delete(id);
              break;

            case "error":
              pendingRequest.reject(new Error(error));
              pendingRequestsRef.current.delete(id);
              break;

            case "progress":
              if (pendingRequest.onProgress) {
                pendingRequest.onProgress(progress);
              }
              break;
          }
        };

        workerRef.current.onerror = (error) => {
          console.error("Web Worker error:", error);
          // Reject all pending requests
          for (const [id, request] of pendingRequestsRef.current.entries()) {
            request.reject(new Error("Web Worker encountered an error"));
            pendingRequestsRef.current.delete(id);
          }
        };
      } catch (error) {
        console.error("Failed to create Web Worker:", error);
        throw error;
      }
    }

    return workerRef.current;
  }, [isWorkerSupported]);

  const sendWorkerMessage = useCallback(
    <T>(
      type: string,
      data: unknown,
      onProgress?: (progress: number) => void,
    ): Promise<T> => {
      return new Promise((resolve, reject) => {
        try {
          const worker = getWorker();
          const id = ++requestIdRef.current;

          pendingRequestsRef.current.set(id, {
            resolve: resolve as (value: unknown) => void,
            reject,
            onProgress,
          });

          worker.postMessage({
            type,
            data,
            id,
          });
        } catch (error) {
          reject(error);
        }
      });
    },
    [getWorker],
  );

  const findNearestDarkSky = useCallback(
    async (
      startCoord: Coordinate,
      options: {
        maxDistance?: number;
        knownSites?: ReadonlyArray<SpecialLocation>;
        onProgress?: (progress: number) => void;
      } = {},
    ): Promise<DarkSiteResult | null> => {
      if (!isWorkerSupported) {
        // Fallback to main thread execution
        const { findNearestDarkSky: fallbackFunction } = await import(
          "../utils/lightPollutionMap"
        );
        return fallbackFunction(
          startCoord,
          options.maxDistance,
          options.onProgress,
          options.knownSites,
        );
      }

      return sendWorkerMessage<DarkSiteResult | null>(
        "findNearestDarkSky",
        {
          startCoord,
          maxDistance: options.maxDistance,
          knownSites: options.knownSites,
        },
        options.onProgress,
      );
    },
    [isWorkerSupported, sendWorkerMessage],
  );

  const findMultipleDarkSites = useCallback(
    async (
      startCoord: Coordinate,
      options: {
        maxDistance?: number;
        knownSites?: ReadonlyArray<SpecialLocation>;
        onProgress?: (progress: number) => void;
      } = {},
    ): Promise<MultipleDarkSitesResult | null> => {
      if (!isWorkerSupported) {
        // Fallback to main thread execution
        const { findMultipleDarkSites: fallbackFunction } = await import(
          "../utils/lightPollutionMap"
        );
        return fallbackFunction(
          startCoord,
          options.maxDistance,
          options.onProgress,
          options.knownSites,
        );
      }

      return sendWorkerMessage<MultipleDarkSitesResult | null>(
        "findMultipleDarkSites",
        {
          startCoord,
          maxDistance: options.maxDistance,
          knownSites: options.knownSites,
        },
        options.onProgress,
      );
    },
    [isWorkerSupported, sendWorkerMessage],
  );

  const getBortleRatingForLocation = useCallback(
    async (coord: Coordinate): Promise<number | null> => {
      if (!isWorkerSupported) {
        // Fallback to main thread execution
        const { getBortleRatingForLocation: fallbackFunction } = await import(
          "../utils/lightPollutionMap"
        );
        return fallbackFunction(coord);
      }

      return sendWorkerMessage<number | null>("getBortleRatingForLocation", {
        coord,
      });
    },
    [isWorkerSupported, sendWorkerMessage],
  );

  const clearImageCache = useCallback(async (): Promise<boolean> => {
    if (!isWorkerSupported) {
      // For main thread execution, there's no cache to clear
      return true;
    }

    return sendWorkerMessage<boolean>("clearImageCache", {});
  }, [isWorkerSupported, sendWorkerMessage]);

  return {
    findNearestDarkSky,
    findMultipleDarkSites,
    getBortleRatingForLocation,
    clearImageCache,
    isWorkerSupported,
  };
}
