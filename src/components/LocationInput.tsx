import { useState, useEffect, useRef } from "react";
import { Location } from "../types/astronomy";
import WorldMap from "./WorldMap";
import {
  parseLocationInput,
  findNearestSpecialLocation,
} from "../utils/locationParser";

interface LocationInputProps {
  location: Location | null;
  onLocationChange: (location: Location) => void;
}

export default function LocationInput({
  location,
  onLocationChange,
}: LocationInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [matchedLocationName, setMatchedLocationName] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("milkyway-location");
    if (savedLocation && !location) {
      try {
        const parsed = JSON.parse(savedLocation);
        onLocationChange(parsed.location);
        setInputValue(`${parsed.location.lat}, ${parsed.location.lng}`);
        if (parsed.matchedName) {
          setMatchedLocationName(parsed.matchedName);
        }
      } catch (e) {
        // Invalid saved data, get current location
        getCurrentLocation();
      }
    } else if (!location) {
      getCurrentLocation();
    }
  }, []);

  // Note: Input is populated from localStorage or geolocation in the first useEffect
  // No need for automatic refill when user clears the field

  const getCurrentLocation = () => {
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
              `${nearbyLocation.location.lat}, ${nearbyLocation.location.lng}`
            );
            setMatchedLocationName(nearbyLocation.matchedName || null);
            saveLocation(nearbyLocation.location, nearbyLocation.matchedName);
          } else {
            onLocationChange(newLocation);
            setInputValue(
              `${newLocation.lat.toFixed(6)}, ${newLocation.lng.toFixed(6)}`
            );
            setMatchedLocationName(null);
            saveLocation(newLocation, null);
          }
          setIsLoading(false);
        },
        () => {
          // Default to LA if geolocation fails
          const defaultLocation = { lat: 34.0549, lng: -118.2426 };
          onLocationChange(defaultLocation);
          setInputValue(`${defaultLocation.lat}, ${defaultLocation.lng}`);
          setMatchedLocationName("Los Angeles");
          saveLocation(defaultLocation, "Los Angeles");
          setIsLoading(false);
        }
      );
    }
  };

  const saveLocation = (loc: Location, name: string | null) => {
    localStorage.setItem(
      "milkyway-location",
      JSON.stringify({
        location: loc,
        matchedName: name,
      })
    );
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // If input is cleared, clear the matched location name but don't parse
    if (value.trim() === "") {
      setMatchedLocationName(null);
      return;
    }

    // Set new timer for 200ms
    debounceTimer.current = setTimeout(() => {
      const parsed = parseLocationInput(value);
      if (parsed) {
        onLocationChange(parsed.location);
        setMatchedLocationName(parsed.matchedName || null);
        saveLocation(parsed.location, parsed.matchedName || null);
      }
    }, 200);
  };

  const handleMapClick = (newLocation: Location) => {
    // Check if near a special location
    const nearbyLocation = findNearestSpecialLocation(newLocation);
    if (nearbyLocation) {
      onLocationChange(nearbyLocation.location);
      setInputValue(
        `${nearbyLocation.location.lat.toFixed(
          6
        )}, ${nearbyLocation.location.lng.toFixed(6)}`
      );
      setMatchedLocationName(nearbyLocation.matchedName || null);
      saveLocation(nearbyLocation.location, nearbyLocation.matchedName);
    } else {
      onLocationChange(newLocation);
      setInputValue(
        `${newLocation.lat.toFixed(6)}, ${newLocation.lng.toFixed(6)}`
      );
      setMatchedLocationName(null);
      saveLocation(newLocation, null);
    }
  };

  return (
    <div className="glass-morphism p-6 mb-8">
      <h2 className="text-6xl font-semibold mb-4">Your Location</h2>

      {isLoading ? (
        <p className="text-blue-200">Detecting your location...</p>
      ) : (
        <>
          <WorldMap location={location} onLocationChange={handleMapClick} />

          <div className="mt-4">
            <label
              htmlFor="location-input"
              className="block text-sm font-medium mb-2"
            ></label>
            <input
              id="location-input"
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const parsed = parseLocationInput(inputValue);
                  if (parsed) {
                    onLocationChange(parsed.location);
                    setMatchedLocationName(parsed.matchedName || null);
                    saveLocation(parsed.location, parsed.matchedName || null);
                  }
                }
              }}
              className="text-5xl w-full px-3 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
              placeholder="37.7, -122.4 or San Francisco"
            />

            {matchedLocationName && (
              <p className="mt-2 text-xl text-blue-200">
                Near {matchedLocationName}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
