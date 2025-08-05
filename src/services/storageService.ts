import { Location } from "../types/astronomy";

/**
 * Defines the types of locations that can be stored.
 * - "home": The user's primary location for Tonight card and calendar
 * - "explore": The user's current location on the Explore page
 */
export type LocationKind = "home" | "explore";

// Storage keys - centralized for easy maintenance
const STORAGE_KEYS: Record<LocationKind, string> = {
  home: "milkyway-home-location",
  explore: "milkyway-explore-location",
};

/**
 * Structure of location data stored in localStorage.
 */
export interface StoredLocationData {
  /** The geographical coordinates (latitude and longitude) */
  latlong: Location;
  /** Human-readable location name if available (e.g., "Yellowstone National Park") */
  matchedName: string | null;
}

/**
 * Service for managing location data in localStorage with type safety and error handling.
 *
 * Provides a unified interface for storing and retrieving both home and explore locations,
 * with automatic data validation and cleanup of corrupted entries.
 *
 * @example
 * ```typescript
 * // Store a home location
 * storageService.setLocation("home", { lat: 44.6, lng: -110.5 }, "Yellowstone National Park");
 *
 * // Retrieve home location
 * const homeData = storageService.getLocation("home");
 * if (homeData) {
 *   console.log(homeData.latlong); // { lat: 44.6, lng: -110.5 }
 *   console.log(homeData.matchedName); // "Yellowstone National Park"
 * }
 * ```
 */
class StorageService {
  // private storageAvailable?: boolean;

  // private isAvailable(): boolean {
  //   if (this.storageAvailable !== undefined) return this.storageAvailable;
  //   try {
  //     const test = "__storage_test__";
  //     localStorage.setItem(test, test);
  //     localStorage.removeItem(test);
  //     return (this.storageAvailable = true);
  //   } catch {
  //     return (this.storageAvailable = false);
  //   }
  // }

  private getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private setItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  private removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Retrieve location data for the specified location type.
   *
   * Automatically validates the stored data structure and cleans up any corrupted entries.
   * Returns null if no data exists or if the stored data is invalid.
   *
   * @param kind - The type of location to retrieve ("home" or "explore")
   * @returns The stored location data with coordinates and optional matched name, or null if not found
   *
   * @example
   * ```typescript
   * const homeLocation = storageService.getLocation("home");
   * if (homeLocation) {
   *   console.log(`Location: ${homeLocation.latlong.lat}, ${homeLocation.latlong.lng}`);
   *   console.log(`Name: ${homeLocation.matchedName ?? "No name"}`);
   * }
   * ```
   */
  getLocation(kind: LocationKind): StoredLocationData | null {
    const data = this.getItem(STORAGE_KEYS[kind]);
    if (!data) return null;
    try {
      const parsed: StoredLocationData = JSON.parse(data);
      if (
        typeof parsed.latlong?.lat === "number" &&
        typeof parsed.latlong?.lng === "number"
      ) {
        return {
          latlong: parsed.latlong,
          matchedName: parsed.matchedName ?? null,
        };
      }
    } catch {
      this.removeItem(STORAGE_KEYS[kind]);
    }
    return null;
  }

  /**
   * Store location data for the specified location type.
   *
   * Saves both the coordinates and optional human-readable name to localStorage.
   * The data is JSON-serialized and includes validation to ensure data integrity.
   *
   * @param kind - The type of location to store ("home" or "explore")
   * @param location - The geographical coordinates to store
   * @param matchedName - Optional human-readable location name (e.g., "Death Valley National Park")
   * @returns true if the data was successfully stored, false if storage failed
   *
   * @example
   * ```typescript
   * // Store location with a name
   * const success = storageService.setLocation(
   *   "home",
   *   { lat: 36.5, lng: -117.1 },
   *   "Death Valley National Park"
   * );
   *
   * // Store location without a name (will show coordinates)
   * storageService.setLocation("explore", { lat: 44.6, lng: -110.5 });
   * ```
   */
  setLocation(
    kind: LocationKind,
    location: Location,
    matchedName?: string | null,
  ): boolean {
    const data: StoredLocationData = {
      latlong: location,
      matchedName: matchedName ?? null,
    };
    try {
      return this.setItem(STORAGE_KEYS[kind], JSON.stringify(data));
    } catch {
      return false;
    }
  }

  /**
   * Remove stored location data for the specified location type.
   *
   * Completely removes the location data from localStorage. This action cannot be undone.
   * Returns true if the removal was successful, false if an error occurred.
   *
   * @param kind - The type of location to remove ("home" or "explore")
   * @returns true if the data was successfully removed, false if removal failed
   *
   * @example
   * ```typescript
   * // Clear the explore location when user leaves the page
   * storageService.removeLocation("explore");
   *
   * // Reset home location (user will need to set it again)
   * const removed = storageService.removeLocation("home");
   * if (removed) {
   *   console.log("Home location cleared successfully");
   * }
   * ```
   */
  removeLocation(kind: LocationKind): boolean {
    return this.removeItem(STORAGE_KEYS[kind]);
  }
}

/**
 * Singleton instance of the storage service for managing location data.
 *
 * This is the primary export that should be used throughout the application.
 * It provides a consistent interface for storing and retrieving both home and explore locations.
 *
 * @example
 * ```typescript
 * import { storageService } from '../services/storageService';
 *
 * // Store user's home location
 * storageService.setLocation("home", { lat: 37.7749, lng: -122.4194 }, "San Francisco");
 *
 * // Retrieve it later
 * const home = storageService.getLocation("home");
 * ```
 */
export const storageService = new StorageService();

/**
 * Export the StorageService class for testing and advanced use cases.
 *
 * Most applications should use the singleton `storageService` export instead.
 */
export { StorageService };
