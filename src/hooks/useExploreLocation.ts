import { useState, useEffect, useCallback } from "react";
import { Location } from "../types/astronomy";
import { storageService } from "../services/storageService";
import { findNearestSpecialLocation } from "../utils/locationParser";

/**
 * Interface for the explore location hook return type
 */
export interface ExploreLocationHookType {
  /** Current explore location, null if not set */
  location: Location | null;
  /** Set location without automatic nearby location detection */
  setLocation: (location: Location) => void;
  /** Update location with automatic nearby location detection and persistence */
  updateLocation: (location: Location, matchedName?: string | null) => void;
  /** Initialize explore location from home location if explore location doesn't exist */
  initializeFromHomeLocation: () => void;
}

/**
 * Hook specifically for managing Explore page location state.
 *
 * This hook provides independent location management for the Explore page,
 * separate from the main app's home/tonight location. Key features:
 *
 * - **Persistent storage**: Uses localStorage with explore-specific keys
 * - **Smart initialization**: Starts with home location on first visit
 * - **Independent state**: Changes don't affect home/calendar locations
 * - **Automatic persistence**: Location changes are saved immediately
 *
 * @returns Object containing location state and management functions
 *
 * @example
 * ```tsx
 * function ExplorePage() {
 *   const {
 *     location,
 *     updateLocation,
 *     initializeFromHomeLocation
 *   } = useExploreLocation();
 *
 *   useEffect(() => {
 *     initializeFromHomeLocation();
 *   }, [initializeFromHomeLocation]);
 *
 *   return (
 *     <LocationPopover
 *       onLocationChange={updateLocation}
 *     />
 *   );
 * }
 * ```
 */
export function useExploreLocation(): ExploreLocationHookType {
  const [location, setLocationState] = useState<Location | null>(() => {
    // Initialize from localStorage on first load
    return storageService.getLocation("explore")?.latlong ?? null;
  });

  // Persist location to localStorage whenever it changes
  useEffect(() => {
    if (location) {
      // Find nearby special location for description
      const nearbyLocation = findNearestSpecialLocation(location);
      storageService.setLocation(
        "explore",
        location,
        nearbyLocation?.matchedName ?? null
      );
    }
  }, [location]);

  /**
   * Set location directly without nearby location detection or immediate persistence.
   * Used for temporary location updates during drag operations.
   */
  const setLocation = useCallback((newLocation: Location) => {
    setLocationState(newLocation);
  }, []);

  /**
   * Update location with full processing including nearby location detection and persistence.
   * This is the primary method for updating explore location when user makes a selection.
   *
   * @param newLocation - The new location coordinates
   * @param matchedName - Optional matched location name, auto-detected if not provided
   */
  const updateLocation = useCallback(
    (newLocation: Location, matchedName?: string | null) => {
      setLocationState(newLocation);

      // If matchedName wasn't provided, try to find one
      let finalMatchedName = matchedName;
      if (finalMatchedName === undefined) {
        const nearbyLocation = findNearestSpecialLocation(newLocation);
        finalMatchedName = nearbyLocation ? nearbyLocation.matchedName : null;
      }

      // Update storage immediately with explicit matched name
      storageService.setLocation("explore", newLocation, finalMatchedName);
    },
    []
  );

  /**
   * Initialize explore location from home location if no explore location exists.
   * This should be called when the Explore page first loads to provide a starting point.
   * The initialization is not persisted until the user actually changes the location.
   */
  const initializeFromHomeLocation = useCallback(() => {
    // Get home location and use it as initial explore location if explore location doesn't exist
    if (!location) {
      const homeLocation = storageService.getLocation("home")?.latlong;
      if (homeLocation) {
        setLocationState(homeLocation);
        // Don't persist this initialization to localStorage -
        // only persist when user actually changes location on explore page
      }
    }
  }, [location]);

  return {
    location,
    setLocation,
    updateLocation,
    initializeFromHomeLocation,
  };
}
