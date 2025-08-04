import { useState, useEffect, ReactNode } from 'react';
import { Location } from '../types/astronomy';
import { findNearestSpecialLocation } from '../utils/locationParser';
import { storageService } from '../services/storageService';
import { LocationContext } from './LocationContext.context';
import type { LocationContextType } from './LocationContext.types';
import { applyDefaultLocation } from '../config/appConfig';

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
  const [geolocationFailed, setGeolocationFailed] = useState(false);

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
    const requestLocation = () => {
      if (!navigator.geolocation) {
        applyDefaultLocation(updateLocation, setIsLoading);
        return;
      }

      const geolocation = navigator.geolocation;
      
      const getCurrentPosition = () => {
        const options: PositionOptions = {
          enableHighAccuracy: false, // Use network/cell towers for faster response
          timeout: 15000, // 15 second timeout
          maximumAge: 300000 // Accept cached location up to 5 minutes old
        };

        geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            console.info('Geolocation success:', {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy
            });
            
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            updateLocation(newLocation);
            setIsLoading(false);
          },
          (error: GeolocationPositionError) => {
            // Provide detailed error information
            const errorMessages = {
              1: 'Location permission denied by user', // PERMISSION_DENIED
              2: 'Location information unavailable (GPS/network issue)', // POSITION_UNAVAILABLE  
              3: 'Location request timed out' // TIMEOUT
            };
            
            console.warn('Geolocation error:', {
              code: error.code,
              message: error.message,
              description: errorMessages[error.code as keyof typeof errorMessages] || 'Unknown error'
            });
            
            setGeolocationFailed(true);
            setIsLoading(false);
          },
          options
        );
      };

      // First check permission status if available
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
          if (permissionStatus.state === 'granted') {
            // Permission already granted, get location
            getCurrentPosition();
          } else if (permissionStatus.state === 'prompt') {
            // Permission needs to be requested
            getCurrentPosition();
          } else {
            // Permission denied
            console.info('Geolocation permission denied, using default location');
            setGeolocationFailed(true);
            setIsLoading(false);
          }
        }).catch(() => {
          // Fallback if permissions API fails
          getCurrentPosition();
        });
      } else {
        // No permissions API, try geolocation directly
        getCurrentPosition();
      }
    };

    requestLocation();
  }, [initialLocation, skipGeolocaton]);

  const retryGeolocation = () => {
    if (!navigator.geolocation) {
      setGeolocationFailed(true);
      return;
    }

    setIsLoading(true);
    setGeolocationFailed(false);

    const geolocation = navigator.geolocation;
    
    const options: PositionOptions = {
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 300000
    };

    geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        console.info('Geolocation retry success:', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        updateLocation(newLocation);
        setIsLoading(false);
      },
      (error: GeolocationPositionError) => {
        const errorMessages = {
          1: 'Location permission denied by user',
          2: 'Location information unavailable (GPS/network issue)',  
          3: 'Location request timed out'
        };
        
        console.warn('Geolocation retry failed:', {
          code: error.code,
          message: error.message,
          description: errorMessages[error.code as keyof typeof errorMessages] || 'Unknown error'
        });
        
        setGeolocationFailed(true);
        setIsLoading(false);
      },
      options
    );
  };

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
    geolocationFailed,
    retryGeolocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

