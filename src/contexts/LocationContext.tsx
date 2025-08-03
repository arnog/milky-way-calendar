import { useState, useEffect, ReactNode } from 'react';
import { Location } from '../types/astronomy';
import { findNearestSpecialLocation } from '../utils/locationParser';
import { storageService } from '../services/storageService';
import { LocationContext } from './LocationContext.context';
import type { LocationContextType } from './LocationContext.types';

interface LocationProviderProps {
  children: ReactNode;
  initialLocation?: Location | null;
  skipGeolocaton?: boolean;
}

export function LocationProvider({ 
  children, 
  initialLocation = null,
  skipGeolocaton = false 
}: LocationProviderProps) {
  const [location, setLocationState] = useState<Location | null>(initialLocation);
  const [isLoading, setIsLoading] = useState(!skipGeolocaton && !initialLocation);

  // Initialize location from localStorage or geolocation
  useEffect(() => {
    if (initialLocation || skipGeolocaton) {
      setIsLoading(false);
      return;
    }

    const savedLocationData = storageService.getLocationData();
    if (savedLocationData?.location) {
      setLocationState(savedLocationData.location);
      setIsLoading(false);
      return;
    }

    // Get current location if no saved location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          updateLocation(newLocation);
          setIsLoading(false);
        },
        () => {
          // Default to LA if geolocation fails
          const defaultLocation = { lat: 34.0549, lng: -118.2426 };
          updateLocation(defaultLocation, "LA");
          setIsLoading(false);
        }
      );
    } else {
      setIsLoading(false);
    }
  }, [initialLocation, skipGeolocaton]);

  const updateLocation = (newLocation: Location, matchedName?: string | null) => {
    setLocationState(newLocation);

    // If matchedName wasn't provided, try to find one
    let finalMatchedName = matchedName;
    if (finalMatchedName === undefined) {
      const nearbyLocation = findNearestSpecialLocation(newLocation);
      finalMatchedName = nearbyLocation ? nearbyLocation.matchedName : null;
    }

    // Update storage
    storageService.setLocationData(newLocation, finalMatchedName);
  };

  const setLocation = (newLocation: Location) => {
    setLocationState(newLocation);
  };

  const value: LocationContextType = {
    location,
    setLocation,
    updateLocation,
    isLoading,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

