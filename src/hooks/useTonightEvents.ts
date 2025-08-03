import { useState, useEffect } from "react";
import { Location } from "../types/astronomy";
import { type AstronomicalEvents } from "../types/astronomicalClock";
import {
  Observer,
  SearchRiseSet,
  Body,
  SearchAltitude,
} from "astronomy-engine";
import { calculateGalacticCenterPosition } from "../utils/galacticCenter";
import { calculateMoonData } from "../utils/moonCalculations";
import { calculateTwilightTimes } from "../utils/twilightCalculations";
import {
  calculateVisibilityRating,
  getVisibilityRatingNumber,
} from "../utils/visibilityRating";
import {
  getOptimalViewingWindow,
} from "../utils/integratedOptimalViewing";
import { getBortleRatingForLocation, findNearestDarkSky, DarkSiteResult } from "../utils/lightPollutionMap";
import { findNearestSpecialLocation, calculateDistance } from "../utils/locationParser";
import { getSpecialLocationDescription } from "../utils/locationParser";
import { storageService } from "../services/storageService";

export interface TonightEvents extends AstronomicalEvents {
  visibility: number;
  visibilityReason?: string;
}

export interface LocationDisplayData {
  displayName: string;
  description: string | null;
  bortleRating: number | null;
  nearestDarkSite: DarkSiteResult | null;
  nearestKnownLocation: { name: string; distance: number } | null;
}

export interface UseTonightEventsResult {
  events: TonightEvents | null;
  locationData: LocationDisplayData | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to calculate tonight's astronomical events and location data
 * Extracts the data calculation logic from TonightCard component
 */
export function useTonightEvents(
  location: Location | null,
  currentDate?: Date
): UseTonightEventsResult {
  const [events, setEvents] = useState<TonightEvents | null>(null);
  const [locationData, setLocationData] = useState<LocationDisplayData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate location display data
  useEffect(() => {
    if (!location) {
      setLocationData(null);
      return;
    }

    const calculateLocationData = async () => {
      try {
        const savedLocationData = storageService.getLocationData();
        
        // Set display name
        let displayName: string;
        if (savedLocationData?.matchedName) {
          displayName = savedLocationData.matchedName;
        } else {
          displayName = `${location.lat.toFixed(1)}, ${location.lng.toFixed(1)}`;
        }

        // Get special location description
        const matchedName = savedLocationData?.matchedName;
        const description = getSpecialLocationDescription(location, matchedName);
        
        // Find nearest known location for coordinates display
        const nearestSpecial = findNearestSpecialLocation(location);
        const hasMatchedName = !!savedLocationData?.matchedName;
        
        let nearestKnownLocation: { name: string; distance: number } | null = null;
        if (nearestSpecial && !hasMatchedName) {
          const distance = calculateDistance(location, nearestSpecial.location);
          nearestKnownLocation = {
            name: nearestSpecial.matchedName || 'Nearby location',
            distance: distance
          };
        }
        
        // Fetch Bortle rating for the location
        let bortleRating: number | null = null;
        let nearestDarkSite: DarkSiteResult | null = null;
        
        try {
          bortleRating = await getBortleRatingForLocation({ lat: location.lat, lng: location.lng });
          
          // If Bortle rating is 4 or higher (poor), find nearest dark site
          if (bortleRating !== null && bortleRating >= 4) {
            nearestDarkSite = await findNearestDarkSky(
              { lat: location.lat, lng: location.lng },
              500 // 500km search radius
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
          nearestKnownLocation
        });
      } catch (error) {
        console.error("Error calculating location data:", error);
        setError("Failed to load location data");
      }
    };

    calculateLocationData();
  }, [location]);

  // Calculate tonight's events
  useEffect(() => {
    if (!location) {
      setEvents(null);
      setIsLoading(false);
      return;
    }

    const calculateTonight = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const now = currentDate || new Date();
        const observer = new Observer(location.lat, location.lng, 0);

        // Calculate sun times using astronomy-engine
        const sunset = SearchRiseSet(Body.Sun, observer, -1, now, 1);
        const sunrise = SearchRiseSet(Body.Sun, observer, +1, now, 1);
        const tomorrowSunrise = SearchRiseSet(
          Body.Sun,
          observer,
          +1,
          new Date(now.getTime() + 24 * 60 * 60 * 1000),
          1
        );

        // Calculate astronomical twilight times
        const astronomicalDusk = SearchAltitude(
          Body.Sun,
          observer,
          -1,
          now,
          1,
          -18
        );
        const astronomicalDawn = SearchAltitude(
          Body.Sun,
          observer,
          +1,
          new Date(now.getTime() + 24 * 60 * 60 * 1000),
          1,
          -18
        );

        // Use existing calculateMoonData function instead of duplicating calculations
        const moonData = calculateMoonData(now, location);

        // Calculate Galactic Core times using the existing utility
        const gcData = calculateGalacticCenterPosition(now, location);

        // Use the calculated GC data which already includes rise/set times
        const gcRise = gcData.riseTime;
        const gcSet = gcData.setTime;
        const gcTransit = gcData.transitTime;
        const maxAltitude = gcData.altitude;

        // Calculate optimal viewing window using integrated time-based analysis
        const twilightData = calculateTwilightTimes(now, location);
        const optimalWindow = getOptimalViewingWindow(
          gcData,
          moonData,
          twilightData,
          location,
          now,
          0.3 // Decent viewing threshold
        );

        // Calculate visibility rating for tonight using the consistent method
        // Recalculate GC data at the optimal viewing time for accurate visibility rating
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
          now
        );
        const visibility = getVisibilityRatingNumber(visibilityResult);
        const visibilityReason =
          typeof visibilityResult === "object"
            ? visibilityResult.reason
            : undefined;

        // For "Tonight" viewing, show events from today onwards
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0); // Start of today

        const tonightEvents: TonightEvents = {
          sunRise:
            sunrise && sunrise.date > now
              ? sunrise.date
              : tomorrowSunrise?.date,
          sunSet: sunset && sunset.date > now ? sunset.date : undefined,
          astronomicalTwilightEnd:
            astronomicalDusk && astronomicalDusk.date > now
              ? astronomicalDusk.date
              : undefined,
          astronomicalTwilightStart: astronomicalDawn?.date,
          moonRise:
            moonData.rise && moonData.rise > now ? moonData.rise : undefined,
          moonSet:
            moonData.set && moonData.set > now ? moonData.set : undefined,
          gcRise: gcRise && gcRise >= todayStart ? gcRise : undefined,
          gcTransit: gcTransit || undefined,
          gcSet: gcSet && gcSet > now ? gcSet : undefined,
          maxGcAltitude: maxAltitude,
          moonPhase: moonData.phase,
          moonIllumination: moonData.illumination * 100,
          visibility,
          visibilityReason,
          optimalWindow,
        };

        setEvents(tonightEvents);
      } catch (error) {
        console.error("useTonightEvents: Error during calculation:", error);
        setError("Failed to calculate tonight's events");
      } finally {
        setIsLoading(false);
      }
    };

    calculateTonight();
  }, [location, currentDate]);

  return {
    events,
    locationData,
    isLoading: !location || isLoading,
    error
  };
}