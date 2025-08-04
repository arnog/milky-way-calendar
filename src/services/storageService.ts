import { Location } from "../types/astronomy";

// Storage keys - centralized for easy maintenance
const STORAGE_KEYS = {
  HOME_LOCATION: "milkyway-home-location",
  EXPLORE_LOCATION: "milkyway-explore-location",
} as const;

// Type definitions for stored data
export interface StoredLocationData {
  location: Location;
  matchedName: string | null;
}

// Generic storage operations with error handling
class StorageService {
  private isAvailable(): boolean {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private getItem(key: string): string | null {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private setItem(key: string, value: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  private removeItem(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  // Home location operations (Tonight card, calendar, etc.)
  getHomeLocationData(): StoredLocationData | null {
    const data = this.getItem(STORAGE_KEYS.HOME_LOCATION);
    if (!data) {
      return null;
    }

    try {
      const parsed = JSON.parse(data);
      // Validate the structure
      if (
        parsed.location?.lat !== undefined &&
        parsed.location?.lng !== undefined
      ) {
        return {
          location: {
            lat: parsed.location.lat,
            lng: parsed.location.lng,
          },
          matchedName: parsed.matchedName || null,
        };
      }
    } catch {
      // Invalid data, clean it up
      this.removeHomeLocationData();
    }

    return null;
  }

  setHomeLocationData(
    location: Location,
    matchedName?: string | null
  ): boolean {
    const data: StoredLocationData = {
      location,
      matchedName: matchedName || null,
    };

    try {
      const serialized = JSON.stringify(data);
      return this.setItem(STORAGE_KEYS.HOME_LOCATION, serialized);
    } catch {
      return false;
    }
  }

  removeHomeLocationData(): boolean {
    return this.removeItem(STORAGE_KEYS.HOME_LOCATION);
  }

  // Explore location operations (Explore page only)
  getExploreLocationData(): StoredLocationData | null {
    const data = this.getItem(STORAGE_KEYS.EXPLORE_LOCATION);
    if (!data) {
      return null;
    }

    try {
      const parsed = JSON.parse(data);
      // Validate the structure
      if (
        parsed.location?.lat !== undefined &&
        parsed.location?.lng !== undefined
      ) {
        return {
          location: {
            lat: parsed.location.lat,
            lng: parsed.location.lng,
          },
          matchedName: parsed.matchedName || null,
        };
      }
    } catch {
      // Invalid data, clean it up
      this.removeExploreLocationData();
    }

    return null;
  }

  setExploreLocationData(
    location: Location,
    matchedName?: string | null
  ): boolean {
    const data: StoredLocationData = {
      location,
      matchedName: matchedName || null,
    };

    try {
      const serialized = JSON.stringify(data);
      return this.setItem(STORAGE_KEYS.EXPLORE_LOCATION, serialized);
    } catch {
      return false;
    }
  }

  removeExploreLocationData(): boolean {
    return this.removeItem(STORAGE_KEYS.EXPLORE_LOCATION);
  }


  // Utility methods for home location
  getHomeLocation(): Location | null {
    const data = this.getHomeLocationData();
    return data?.location || null;
  }

  getHomeMatchedName(): string | null {
    const data = this.getHomeLocationData();
    return data?.matchedName || null;
  }

  // Legacy utility methods (for compatibility)
  getLocation(): Location | null {
    return this.getHomeLocation();
  }

  getMatchedName(): string | null {
    return this.getHomeMatchedName();
  }

  // Utility methods for explore location
  getExploreLocation(): Location | null {
    const data = this.getExploreLocationData();
    return data?.location || null;
  }

  getExploreMatchedName(): string | null {
    const data = this.getExploreLocationData();
    return data?.matchedName || null;
  }
}

// Create and export singleton instance
export const storageService = new StorageService();

// Also export the class for testing purposes
export { StorageService };
