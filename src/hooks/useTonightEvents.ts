import { useState, useEffect } from "react";
import { AstronomicalEvents } from "../types/astronomy";
import { useLocation } from "./useLocation";
import { calculateAstronomicalEvents } from "../utils/calculateAstronomicalEvents";
import { DarkSiteResult } from "../utils/lightPollutionMap";
import { useDarkSiteWorker } from "./useDarkSiteWorker";
import {
  findNearestSpecialLocation,
  calculateDistance,
} from "../utils/locationParser";
import { getSpecialLocationDescription } from "../utils/locationParser";
import { storageService } from "../services/storageService";
import { APP_CONFIG } from "../config/appConfig";

export interface LocationDisplayData {
  displayName: string;
  description: string | null;
  bortleRating: number | null;
  nearestDarkSite: DarkSiteResult | null;
  nearestKnownLocation: { name: string; distance: number } | null;
}

export interface UseTonightEventsResult {
  events: AstronomicalEvents | null;
  locationData: LocationDisplayData | null;
  error: string | null;
}

/**
 * Custom hook to calculate tonight's astronomical events and location data
 * Extracts the data calculation logic from TonightCard component
 */
export function useTonightEvents(currentDate?: Date): UseTonightEventsResult {
  const { location } = useLocation();
  const { getBortleRatingForLocation, findNearestDarkSky } =
    useDarkSiteWorker();
  const [events, setEvents] = useState<AstronomicalEvents | null>(null);
  const [locationData, setLocationData] = useState<LocationDisplayData | null>(
    () => {
      // Initialize with basic location data immediately if we have a location
      if (!location) return null;

      const savedLocationData = storageService.getLocation("home");
      const displayName =
        savedLocationData?.matchedName ??
        `${location.lat.toFixed(1)}, ${location.lng.toFixed(1)}`;

      return {
        displayName,
        description: null,
        bortleRating: null,
        nearestDarkSite: null,
        nearestKnownLocation: null,
      };
    },
  );
  const [error, setError] = useState<string | null>(null);

  // Calculate location display data
  useEffect(() => {
    if (!location) {
      setLocationData(null);
      return;
    }

    // Immediately set basic location data to avoid "Loading location..." text
    const savedLocationData = storageService.getLocation("home");
    const immediateDisplayName =
      savedLocationData?.matchedName ??
      `${location.lat.toFixed(1)}, ${location.lng.toFixed(1)}`;

    setLocationData({
      displayName: immediateDisplayName,
      description: null,
      bortleRating: null,
      nearestDarkSite: null,
      nearestKnownLocation: null,
    });

    const calculateLocationData = async () => {
      try {
        const savedLocationData = storageService.getLocation("home");

        // Set display name
        let displayName: string;
        if (savedLocationData?.matchedName) {
          displayName = savedLocationData.matchedName;
        } else {
          displayName = `${location.lat.toFixed(1)}, ${location.lng.toFixed(
            1,
          )}`;
        }

        // Get special location description
        const matchedName = savedLocationData?.matchedName;
        const description = getSpecialLocationDescription(
          location,
          matchedName,
        );

        // Find nearest known location for coordinates display
        const nearestSpecial = findNearestSpecialLocation(location);
        const hasMatchedName = !!savedLocationData?.matchedName;

        let nearestKnownLocation: { name: string; distance: number } | null =
          null;
        if (nearestSpecial && !hasMatchedName) {
          const distance = calculateDistance(location, nearestSpecial.location);
          nearestKnownLocation = {
            name: nearestSpecial.matchedName ?? "Nearby location",
            distance: distance,
          };
        }

        // Fetch Bortle rating for the location
        let bortleRating: number | null = null;
        let nearestDarkSite: DarkSiteResult | null = null;

        try {
          bortleRating = await getBortleRatingForLocation({
            lat: location.lat,
            lng: location.lng,
          });

          // If Bortle rating is 4 or higher (poor), find nearest dark site
          if (
            bortleRating !== null &&
            bortleRating >= APP_CONFIG.BORTLE.RECOMMEND_DARK_SITE_THRESHOLD
          ) {
            nearestDarkSite = await findNearestDarkSky(
              { lat: location.lat, lng: location.lng },
              {
                maxDistance: APP_CONFIG.SEARCH.DEFAULT_RADIUS_KM,
              },
            );
          }
        } catch (error) {
          console.error("Error fetching Bortle rating or dark site:", error);
        }

        setLocationData({
          displayName,
          description,
          bortleRating,
          nearestDarkSite,
          nearestKnownLocation,
        });
      } catch (error) {
        console.error("Error calculating location data:", error);
        setError("Failed to load location data");
      }
    };

    calculateLocationData();
  }, [location, getBortleRatingForLocation, findNearestDarkSky]);

  // Calculate tonight's events
  useEffect(() => {
    if (!location) {
      setEvents(null);
      return;
    }

    const calculateTonight = async () => {
      setError(null);

      try {
        const now = currentDate || new Date();

        // Calculate all astronomical events (this is synchronous and fast)
        const events = calculateAstronomicalEvents(now, location);

        // Calculate tomorrow's events for sunrise if needed
        let tomorrowSunrise: Date | undefined;
        if (!events.sunRise || events.sunRise <= now) {
          const tomorrowEvents = calculateAstronomicalEvents(
            new Date(now.getTime() + APP_CONFIG.ASTRONOMY.MS_PER_DAY),
            location,
          );
          tomorrowSunrise = tomorrowEvents.sunRise;
        }

        // For "Tonight" viewing, show events from today onwards
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0); // Start of today

        // Filter events to only show future or today's events
        const tonightEvents: AstronomicalEvents = {
          sunRise:
            events.sunRise && events.sunRise > now
              ? events.sunRise
              : tomorrowSunrise,
          sunSet:
            events.sunSet && events.sunSet > now ? events.sunSet : undefined,
          nightStart:
            events.nightStart && events.nightStart > now
              ? events.nightStart
              : undefined,
          nightEnd: events.nightEnd,
          moonRise:
            events.moonRise && events.moonRise > now
              ? events.moonRise
              : undefined,
          moonSet:
            events.moonSet && events.moonSet > now ? events.moonSet : undefined,
          gcRise:
            events.gcRise && events.gcRise >= todayStart
              ? events.gcRise
              : undefined,
          gcTransit: events.gcTransit,
          gcSet: events.gcSet && events.gcSet > now ? events.gcSet : undefined,
          maxGcAltitude: events.maxGcAltitude,
          moonPhase: events.moonPhase,
          moonIllumination: events.moonIllumination,
          visibility: events.visibility,
          visibilityReason: events.visibilityReason,
          optimalWindow: events.optimalWindow,
        };

        setEvents(tonightEvents);
      } catch (error) {
        console.error("useTonightEvents: Error during calculation:", error);
        setError("Failed to calculate tonight's events");
      }
    };

    calculateTonight();
  }, [location, currentDate]);

  return {
    events,
    locationData,
    error,
  };
}
