import { useState, useEffect, ReactNode } from "react";
import { Location } from "../types/astronomy";
import { findNearestSpecialLocation } from "../utils/locationParser";
import { storageService } from "../services/storageService";
import { LocationContext } from "./LocationContext.context";
import type { LocationContextType } from "./LocationContext.types";
import { applyDefaultLocation } from "../config/appConfig";

interface LocationProviderProps {
  children: ReactNode;
  initialLocation?: Location | null;
  skipGeolocation?: boolean;
}

export function LocationProvider({
  children,
  initialLocation = null,
  skipGeolocation = false,
}: LocationProviderProps) {
  // Check localStorage synchronously on initialization to avoid loading flash
  const getInitialLocation = () => {
    if (initialLocation) return initialLocation;
    if (skipGeolocation) return null;

    return storageService.getLocation("home")?.latlong ?? null;
  };

  const [location, setLocationState] = useState<Location | null>(
    getInitialLocation()
  );
  // Only show loading if we don't have any location (initial or saved)
  const [isLoading, setIsLoading] = useState(
    !skipGeolocation && !initialLocation && !location
  );
  const [geolocationFailed, setGeolocationFailed] = useState(false);

  // Define updateLocation before useEffect
  const updateLocation = (
    newLocation: Location,
    matchedName?: string | null
  ) => {
    setLocationState(newLocation);

    // If matchedName wasn't provided, try to find one
    let finalMatchedName = matchedName;
    if (finalMatchedName === undefined) {
      const nearbyLocation = findNearestSpecialLocation(newLocation);
      finalMatchedName = nearbyLocation ? nearbyLocation.matchedName : null;
    }

    // Update storage
    storageService.setLocation("home", newLocation, finalMatchedName);
  };

  // Initialize location from geolocation if needed
  useEffect(() => {
    // If we have any location already (initial, saved, or skip), we're done
    if (initialLocation || skipGeolocation || location) {
      setIsLoading(false);
      return;
    }

    // Check for simulated error
    const urlParams = new URLSearchParams(window.location.search);
    const simulatedError = urlParams.get("locerr");

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
          maximumAge: 300000, // Accept cached location up to 5 minutes old
        };

        // Handle simulated errors
        if (simulatedError && ["1", "2", "3"].includes(simulatedError)) {
          const errorCode = parseInt(simulatedError);
          const errorMessages = {
            1: "Location permission denied by user", // PERMISSION_DENIED
            2: "Location information unavailable (GPS/network issue)", // POSITION_UNAVAILABLE
            3: "Location request timed out", // TIMEOUT
          };

          console.warn("Simulating geolocation error:", {
            code: errorCode,
            message: `Simulated error: ${
              errorMessages[errorCode as keyof typeof errorMessages]
            }`,
            description:
              errorMessages[errorCode as keyof typeof errorMessages] ||
              "Unknown error",
          });

          // Simulate async behavior
          setTimeout(() => {
            setGeolocationFailed(true);
            setIsLoading(false);
          }, 100);
          return;
        }

        geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            console.info("Geolocation success:", {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
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
              1: "Location permission denied by user", // PERMISSION_DENIED
              2: "Location information unavailable (GPS/network issue)", // POSITION_UNAVAILABLE
              3: "Location request timed out", // TIMEOUT
            };

            console.warn("Geolocation error:", {
              code: error.code,
              message: error.message,
              description:
                errorMessages[error.code as keyof typeof errorMessages] ||
                "Unknown error",
            });

            setGeolocationFailed(true);
            setIsLoading(false);
          },
          options
        );
      };

      // First check permission status if available
      if ("permissions" in navigator) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then((permissionStatus) => {
            if (permissionStatus.state === "granted") {
              // Permission already granted, get location
              getCurrentPosition();
            } else if (permissionStatus.state === "prompt") {
              // Permission needs to be requested
              getCurrentPosition();
            } else {
              // Permission denied
              console.info(
                "Geolocation permission denied, using default location"
              );
              setGeolocationFailed(true);
              setIsLoading(false);
            }
          })
          .catch(() => {
            // Fallback if permissions API fails
            getCurrentPosition();
          });
      } else {
        // No permissions API, try geolocation directly
        getCurrentPosition();
      }
    };

    requestLocation();
  }, [initialLocation, skipGeolocation]); // eslint-disable-line react-hooks/exhaustive-deps
  // Note: We intentionally don't include location in deps to avoid re-running after setting it

  const retryGeolocation = () => {
    if (!navigator.geolocation) {
      setGeolocationFailed(true);
      return;
    }

    setIsLoading(true);
    setGeolocationFailed(false);

    // Check for simulated error
    const urlParams = new URLSearchParams(window.location.search);
    const simulatedError = urlParams.get("locerr");

    // Handle simulated errors
    if (simulatedError && ["1", "2", "3"].includes(simulatedError)) {
      const errorCode = parseInt(simulatedError);
      const errorMessages = {
        1: "Location permission denied by user",
        2: "Location information unavailable (GPS/network issue)",
        3: "Location request timed out",
      };

      console.warn("Simulating geolocation error (retry):", {
        code: errorCode,
        message: `Simulated error: ${
          errorMessages[errorCode as keyof typeof errorMessages]
        }`,
        description:
          errorMessages[errorCode as keyof typeof errorMessages] ||
          "Unknown error",
      });

      // Simulate async behavior
      setTimeout(() => {
        setGeolocationFailed(true);
        setIsLoading(false);
      }, 100);
      return;
    }

    const geolocation = navigator.geolocation;

    const options: PositionOptions = {
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 300000,
    };

    geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        console.info("Geolocation retry success:", {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
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
          1: "Location permission denied by user",
          2: "Location information unavailable (GPS/network issue)",
          3: "Location request timed out",
        };

        console.warn("Geolocation retry failed:", {
          code: error.code,
          message: error.message,
          description:
            errorMessages[error.code as keyof typeof errorMessages] ||
            "Unknown error",
        });

        setGeolocationFailed(true);
        setIsLoading(false);
      },
      options
    );
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
