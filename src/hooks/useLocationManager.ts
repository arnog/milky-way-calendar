import { useState, useEffect, useRef, useCallback } from "react";
import { Location } from "../types/astronomy";
import {
  parseLocationInput,
  findNearestSpecialLocation,
} from "../utils/locationParser";

interface UseLocationManagerProps {
  initialLocation: Location | null;
  onLocationChange: (location: Location) => void;
}

interface UseLocationManagerReturn {
  inputValue: string;
  setInputValue: (value: string) => void;
  matchedLocationName: string | null;
  isNearbyMatch: boolean;
  isLoading: boolean;
  dragLocation: Location | null;
  setDragLocation: (location: Location | null) => void;
  handleInputChange: (value: string) => void;
  handleMapClick: (newLocation: Location, isCurrentlyDragging?: boolean) => void;
  handleDragStart: () => void;
  handleDragEnd: () => void;
  getCurrentLocation: () => void;
  formatLocationDisplay: () => string;
}

export function useLocationManager({
  initialLocation,
  onLocationChange,
}: UseLocationManagerProps): UseLocationManagerReturn {
  const [inputValue, setInputValue] = useState("");
  const [matchedLocationName, setMatchedLocationName] = useState<string | null>(null);
  const [isNearbyMatch, setIsNearbyMatch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dragLocation, setDragLocation] = useState<Location | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("milkyway-location");
    if (savedLocation && !initialLocation) {
      try {
        const parsed = JSON.parse(savedLocation);

        // Check if we should look for nearby special locations if no matched name is saved
        if (!parsed.matchedName) {
          const nearbyLocation = findNearestSpecialLocation(parsed.location);
          if (nearbyLocation) {
            onLocationChange(nearbyLocation.location);
            setInputValue(
              nearbyLocation.matchedName ||
              `${nearbyLocation.location.lat.toFixed(1)}, ${nearbyLocation.location.lng.toFixed(1)}`
            );
            setMatchedLocationName(nearbyLocation.matchedName || null);
            setIsNearbyMatch(true);
            // Update localStorage with the matched name
            saveLocation(nearbyLocation.location, nearbyLocation.matchedName || null);
            return;
          }
        }

        onLocationChange(parsed.location);
        if (parsed.matchedName) {
          setInputValue(parsed.matchedName);
          setMatchedLocationName(parsed.matchedName);
          setIsNearbyMatch(false);
        } else {
          setInputValue(
            `${parsed.location.lat.toFixed(1)}, ${parsed.location.lng.toFixed(1)}`
          );
        }
      } catch (e) {
        // Invalid saved data, get current location
        getCurrentLocation();
      }
    } else if (!initialLocation) {
      getCurrentLocation();
    }
  }, []);

  // Update input value when location changes externally
  useEffect(() => {
    if (initialLocation) {
      const savedLocation = localStorage.getItem("milkyway-location");
      if (savedLocation) {
        try {
          const parsed = JSON.parse(savedLocation);
          if (parsed.matchedName) {
            setInputValue(parsed.matchedName);
            setMatchedLocationName(parsed.matchedName);
            setIsNearbyMatch(false);
          } else {
            setInputValue(
              `${initialLocation.lat.toFixed(1)}, ${initialLocation.lng.toFixed(1)}`
            );
            setMatchedLocationName(null);
            setIsNearbyMatch(false);
          }
        } catch (e) {
          setInputValue(
            `${initialLocation.lat.toFixed(1)}, ${initialLocation.lng.toFixed(1)}`
          );
        }
      } else {
        setInputValue(
          `${initialLocation.lat.toFixed(1)}, ${initialLocation.lng.toFixed(1)}`
        );
      }
    }
  }, [initialLocation]);

  const saveLocation = useCallback((loc: Location, name: string | null) => {
    localStorage.setItem(
      "milkyway-location",
      JSON.stringify({
        location: loc,
        matchedName: name,
      })
    );
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Check if near a special location
          const nearbyLocation = findNearestSpecialLocation(newLocation);
          if (nearbyLocation) {
            onLocationChange(nearbyLocation.location);
            setInputValue(
              nearbyLocation.matchedName ||
              `${nearbyLocation.location.lat.toFixed(1)}, ${nearbyLocation.location.lng.toFixed(1)}`
            );
            setMatchedLocationName(nearbyLocation.matchedName || null);
            setIsNearbyMatch(true);
            saveLocation(nearbyLocation.location, nearbyLocation.matchedName || null);
          } else {
            onLocationChange(newLocation);
            setInputValue(
              `${newLocation.lat.toFixed(1)}, ${newLocation.lng.toFixed(1)}`
            );
            setMatchedLocationName(null);
            setIsNearbyMatch(false);
            saveLocation(newLocation, null);
          }
          setIsLoading(false);
        },
        () => {
          // Default to LA if geolocation fails
          const defaultLocation = { lat: 34.0549, lng: -118.2426 };
          onLocationChange(defaultLocation);
          setInputValue(
            `${defaultLocation.lat.toFixed(1)}, ${defaultLocation.lng.toFixed(1)}`
          );
          setMatchedLocationName("LA");
          setIsNearbyMatch(false);
          saveLocation(defaultLocation, "LA");
          setIsLoading(false);
        }
      );
    }
  }, [onLocationChange, saveLocation]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // If input is cleared, clear the matched location name but don't parse
    if (value.trim() === "") {
      setMatchedLocationName(null);
      setIsNearbyMatch(false);
      return;
    }

    // Set new timer for 200ms
    debounceTimer.current = setTimeout(() => {
      const parsed = parseLocationInput(value);
      if (parsed) {
        // If no matched name from parsing, check for nearby special locations
        if (!parsed.matchedName) {
          const nearbyLocation = findNearestSpecialLocation(parsed.location);
          if (nearbyLocation) {
            onLocationChange(nearbyLocation.location);
            setMatchedLocationName(nearbyLocation.matchedName || null);
            setIsNearbyMatch(true);
            saveLocation(
              nearbyLocation.location,
              nearbyLocation.matchedName || null
            );
            return;
          }
        }

        onLocationChange(parsed.location);
        setMatchedLocationName(parsed.matchedName || null);
        setIsNearbyMatch(false);
        saveLocation(parsed.location, parsed.matchedName || null);
      }
    }, 200);
  }, [onLocationChange, saveLocation]);

  const updateLocationState = useCallback((newLocation: Location) => {
    // Check if near a special location
    const nearbyLocation = findNearestSpecialLocation(newLocation);
    if (nearbyLocation) {
      setInputValue(
        `${nearbyLocation.location.lat.toFixed(1)}, ${nearbyLocation.location.lng.toFixed(1)}`
      );
      setMatchedLocationName(nearbyLocation.matchedName || null);
      setIsNearbyMatch(true);
      saveLocation(nearbyLocation.location, nearbyLocation.matchedName || null);
    } else {
      setInputValue(
        `${newLocation.lat.toFixed(1)}, ${newLocation.lng.toFixed(1)}`
      );
      setMatchedLocationName(null);
      setIsNearbyMatch(false);
      saveLocation(newLocation, null);
    }
  }, [saveLocation]);

  const handleMapClick = useCallback((
    newLocation: Location,
    isCurrentlyDragging: boolean = false
  ) => {
    if (isCurrentlyDragging) {
      // During drag, just update the visual state and store location
      setDragLocation(newLocation);
      // Update input value to show coordinates during drag
      setInputValue(
        `${newLocation.lat.toFixed(1)}, ${newLocation.lng.toFixed(1)}`
      );
    } else {
      // Normal click or drag end - update everything
      updateLocationState(newLocation);
      onLocationChange(newLocation);
    }
  }, [updateLocationState, onLocationChange]);

  const handleDragStart = useCallback(() => {
    // No need to track dragging state in the hook
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragLocation(null);
  }, []);

  const formatLocationDisplay = useCallback(() => {
    if (matchedLocationName) {
      return isNearbyMatch ? `Near ${matchedLocationName}` : matchedLocationName;
    }
    return "";
  }, [matchedLocationName, isNearbyMatch]);

  return {
    inputValue,
    setInputValue,
    matchedLocationName,
    isNearbyMatch,
    isLoading,
    dragLocation,
    setDragLocation,
    handleInputChange,
    handleMapClick,
    handleDragStart,
    handleDragEnd,
    getCurrentLocation,
    formatLocationDisplay,
  };
}