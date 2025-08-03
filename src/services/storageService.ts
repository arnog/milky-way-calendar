import { Location } from '../types/astronomy';

// Storage keys - centralized for easy maintenance
const STORAGE_KEYS = {
  LOCATION: 'milkyway-location',
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
      const test = '__storage_test__';
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

  // Location-specific operations
  getLocationData(): StoredLocationData | null {
    const data = this.getItem(STORAGE_KEYS.LOCATION);
    if (!data) {
      return null;
    }

    try {
      const parsed = JSON.parse(data);
      // Validate the structure
      if (parsed.location?.lat !== undefined && parsed.location?.lng !== undefined) {
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
      this.removeLocationData();
    }

    return null;
  }

  setLocationData(location: Location, matchedName?: string | null): boolean {
    const data: StoredLocationData = {
      location,
      matchedName: matchedName || null,
    };

    try {
      const serialized = JSON.stringify(data);
      return this.setItem(STORAGE_KEYS.LOCATION, serialized);
    } catch {
      return false;
    }
  }

  removeLocationData(): boolean {
    return this.removeItem(STORAGE_KEYS.LOCATION);
  }

  // Utility method to get just the location without metadata
  getLocation(): Location | null {
    const data = this.getLocationData();
    return data?.location || null;
  }

  // Utility method to get just the matched name
  getMatchedName(): string | null {
    const data = this.getLocationData();
    return data?.matchedName || null;
  }
}

// Create and export singleton instance
export const storageService = new StorageService();

// Also export the class for testing purposes
export { StorageService };