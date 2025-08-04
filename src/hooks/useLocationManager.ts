import { useState, useEffect, useRef, useCallback } from "react";
import { Location } from "../types/astronomy";
import {
  parseLocationInput,
  findNearestSpecialLocation,
} from "../utils/locationParser";
import { storageService } from "../services/storageService";
import { useLocation } from "./useLocation";

interface UseLocationManagerProps {
  initialLocation: Location | null;
  onLocationChange: (location: Location, shouldClose?: boolean) => void;
}

interface UseLocationManagerReturn {
  inputValue: string;
  setInputValue: (value: string) => void;
  suggestion: string | null;
  isNearbyMatch: boolean;
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
  const { retryGeolocation } = useLocation();
  const [inputValue, setInputValue] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [suggestedLocation, setSuggestedLocation] = useState<Location | null>(null);
  const [isNearbyMatch, setIsNearbyMatch] = useState<boolean>(false);
  const [dragLocation, setDragLocation] = useState<Location | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved location from storage on mount
  useEffect(() => {
    const savedLocationData = storageService.getLocationData();
    if (savedLocationData && !initialLocation) {
      // Always use the exact saved coordinates, even if there's no matched name
      // The matched name is used for description purposes only
      onLocationChange(savedLocationData.location);
      if (savedLocationData.matchedName) {
        setInputValue(savedLocationData.matchedName);
        setSuggestion(null);
        setIsNearbyMatch(false);
      } else {
        setInputValue(
          `${savedLocationData.location.lat.toFixed(1)}, ${savedLocationData.location.lng.toFixed(1)}`
        );
        setSuggestion(null);
      }
    } else if (!initialLocation) {
      getCurrentLocation();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update input value when location changes externally
  useEffect(() => {
    if (initialLocation) {
      const savedLocationData = storageService.getLocationData();
      if (savedLocationData?.matchedName) {
        setInputValue(savedLocationData.matchedName);
        setSuggestion(null); // Clear suggestions since we have a confirmed location
        setIsNearbyMatch(false);
      } else {
        setInputValue(
          `${initialLocation.lat.toFixed(1)}, ${initialLocation.lng.toFixed(1)}`
        );
        setSuggestion(null);
        setIsNearbyMatch(false);
      }
    }
  }, [initialLocation]);

  const saveLocation = useCallback((loc: Location, name: string | null) => {
    storageService.setLocationData(loc, name);
  }, []);

  const getCurrentLocation = useCallback(() => {
    // Use the context's retry function which has proper error handling
    // and doesn't fallback to Death Valley
    retryGeolocation();
  }, [retryGeolocation]);

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