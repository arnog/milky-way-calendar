import { useState, useEffect, useRef, useCallback } from "react";
import { Location } from "../types/astronomy";
import {
  parseLocationInput,
  findNearestSpecialLocation,
} from "../utils/locationParser";

interface UseLocationManagerProps {
  initialLocation: Location | null;
  onLocationChange: (location: Location, shouldClose?: boolean) => void;
}

interface UseLocationManagerReturn {
  inputValue: string;
  setInputValue: (value: string) => void;
  suggestion: string | null;
  isNearbyMatch: boolean;
  isLoading: boolean;
  dragLocation: Location | null;
  setDragLocation: (location: Location | null) => void;
  handleInputChange: (value: string) => void;
  handleMapClick: (newLocation: Location, isCurrentlyDragging?: boolean) => void;
  handleDragStart: () => void;
  handleDragEnd: () => void;
  getCurrentLocation: () => void;
  acceptSuggestion: () => void;
  confirmCurrentInput: () => void;
}

export function useLocationManager({
  initialLocation,
  onLocationChange,
}: UseLocationManagerProps): UseLocationManagerReturn {
  const [inputValue, setInputValue] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [suggestedLocation, setSuggestedLocation] = useState<Location | null>(null);
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

        // Always use the exact saved coordinates, even if there's no matched name
        // The matched name is used for description purposes only

        onLocationChange(parsed.location);
        if (parsed.matchedName) {
          setInputValue(parsed.matchedName);
          setSuggestion(null);
          setIsNearbyMatch(false);
        } else {
          setInputValue(
            `${parsed.location.lat.toFixed(1)}, ${parsed.location.lng.toFixed(1)}`
          );
          setSuggestion(null);
        }
      } catch {
        // Invalid saved data, get current location
        getCurrentLocation();
      }
    } else if (!initialLocation) {
      getCurrentLocation();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update input value when location changes externally
  useEffect(() => {
    if (initialLocation) {
      const savedLocation = localStorage.getItem("milkyway-location");
      if (savedLocation) {
        try {
          const parsed = JSON.parse(savedLocation);
          if (parsed.matchedName) {
            setInputValue(parsed.matchedName);
            setSuggestion(null); // Clear suggestions since we have a confirmed location
            setIsNearbyMatch(false);
          } else {
            setInputValue(
              `${initialLocation.lat.toFixed(1)}, ${initialLocation.lng.toFixed(1)}`
            );
            setSuggestion(null);
            setIsNearbyMatch(false);
          }
        } catch {
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

          // Always use the exact user location, but find nearby location for description
          const nearbyLocation = findNearestSpecialLocation(newLocation);
          onLocationChange(newLocation, true);
          
          // Show nearby location name if found, otherwise show coordinates
          if (nearbyLocation?.matchedName) {
            setInputValue(nearbyLocation.matchedName);
          } else {
            setInputValue(
              `${newLocation.lat.toFixed(1)}, ${newLocation.lng.toFixed(1)}`
            );
          }
          setSuggestion(null);
          setIsNearbyMatch(false);
          // Save with nearby location name for description purposes, but keep exact coordinates
          saveLocation(newLocation, nearbyLocation?.matchedName || null);
          setIsLoading(false);
        },
        () => {
          // Default to LA if geolocation fails
          const defaultLocation = { lat: 34.0549, lng: -118.2426 };
          onLocationChange(defaultLocation, true);
          setInputValue(
            `${defaultLocation.lat.toFixed(1)}, ${defaultLocation.lng.toFixed(1)}`
          );
          setSuggestion(null);
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

    // If input is cleared, clear suggestions
    if (value.trim() === "") {
      setSuggestion(null);
      setSuggestedLocation(null);
      setIsNearbyMatch(false);
      return;
    }

    // Set new timer for 300ms (slightly longer for better UX)
    debounceTimer.current = setTimeout(() => {
      const parsed = parseLocationInput(value);
      if (parsed) {
        // If no matched name from parsing, check for nearby special locations
        if (!parsed.matchedName) {
          const nearbyLocation = findNearestSpecialLocation(parsed.location);
          if (nearbyLocation) {
            setSuggestion(nearbyLocation.matchedName || null);
            setSuggestedLocation(nearbyLocation.location);
            setIsNearbyMatch(true);
            return;
          }
        }

        // Store suggestion but don't change location yet
        setSuggestion(parsed.matchedName || null);
        setSuggestedLocation(parsed.location);
        setIsNearbyMatch(false);
      } else {
        // No valid parse, clear suggestions
        setSuggestion(null);
        setSuggestedLocation(null);
        setIsNearbyMatch(false);
      }
    }, 300);
  }, []);

  const updateLocationState = useCallback((newLocation: Location) => {
    // Always use the exact location, but find nearby location for description
    const nearbyLocation = findNearestSpecialLocation(newLocation);
    
    // Show nearby location name if found, otherwise show coordinates
    if (nearbyLocation?.matchedName) {
      setInputValue(nearbyLocation.matchedName);
    } else {
      setInputValue(
        `${newLocation.lat.toFixed(1)}, ${newLocation.lng.toFixed(1)}`
      );
    }
    setSuggestion(null);
    setIsNearbyMatch(false);
    // Save with nearby location name for description purposes, but keep exact coordinates
    saveLocation(newLocation, nearbyLocation?.matchedName || null);
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
      onLocationChange(newLocation, true); // Close popover on map click
    }
  }, [updateLocationState, onLocationChange]);

  const handleDragStart = useCallback(() => {
    // No need to track dragging state in the hook
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragLocation(null);
  }, []);

  const acceptSuggestion = useCallback(() => {
    if (suggestion && suggestedLocation) {
      // Clear any pending debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      
      // Update input with suggestion
      setInputValue(suggestion);
      
      // Update location
      onLocationChange(suggestedLocation, true);
      saveLocation(suggestedLocation, suggestion);
      
      // Clear suggestions
      setSuggestion(null);
      setSuggestedLocation(null);
    }
  }, [suggestion, suggestedLocation, onLocationChange, saveLocation]);

  const confirmCurrentInput = useCallback(() => {
    // Parse the current input and confirm the location selection
    const parsed = parseLocationInput(inputValue);
    if (parsed) {
      // Clear any pending debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // For coordinates without a matched name, preserve the exact coordinates
      if (!parsed.matchedName) {
        const nearbyLocation = findNearestSpecialLocation(parsed.location);
        onLocationChange(parsed.location, true);
        
        // Show nearby location name if found, otherwise show coordinates
        if (nearbyLocation?.matchedName) {
          setInputValue(nearbyLocation.matchedName);
        } else {
          setInputValue(`${parsed.location.lat.toFixed(1)}, ${parsed.location.lng.toFixed(1)}`);
        }
        setSuggestion(null);
        setIsNearbyMatch(false);
        // Save with nearby location name for description purposes, but keep exact coordinates
        saveLocation(parsed.location, nearbyLocation?.matchedName || null);
        return;
      }

      // For named locations, use the matched location
      onLocationChange(parsed.location, true);
      setInputValue(parsed.matchedName);
      setSuggestion(null);
      setIsNearbyMatch(false);
      saveLocation(parsed.location, parsed.matchedName);
    }
  }, [inputValue, onLocationChange, saveLocation]);

  return {
    inputValue,
    setInputValue,
    suggestion,
    isNearbyMatch,
    isLoading,
    dragLocation,
    setDragLocation,
    handleInputChange,
    handleMapClick,
    handleDragStart,
    handleDragEnd,
    getCurrentLocation,
    acceptSuggestion,
    confirmCurrentInput,
  };
}