import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
  const [isNearbyMatch, setIsNearbyMatch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [, setIsDragging] = useState(false);
  const [dragLocation, setDragLocation] = useState<Location | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Function to update popover position
  const updatePopoverPosition = () => {
    if (cardRef.current && inputRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();

      setPopoverPosition({
        top: cardRect.bottom + window.scrollY + 8,
        left: cardRect.left + window.scrollX,
        width: cardRect.width,
      });
    }
  };

  // Update position on scroll and resize, dismiss map on these events
  useEffect(() => {
    if (!isFocused) return;

    // Set up event listeners
    const handleScroll = () => {
      // Dismiss the map on scroll
      setIsFocused(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    };
    const handleResize = () => {
      // Dismiss the map on resize
      setIsFocused(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isFocused]);

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("milkyway-location");
    if (savedLocation && !location) {
      try {
        const parsed = JSON.parse(savedLocation);

        // Check if we should look for nearby special locations if no matched name is saved
        if (!parsed.matchedName) {
          const nearbyLocation = findNearestSpecialLocation(parsed.location);
          if (nearbyLocation) {
            onLocationChange(nearbyLocation.location);
            setInputValue(nearbyLocation.matchedName || `${nearbyLocation.location.lat.toFixed(1)}, ${nearbyLocation.location.lng.toFixed(1)}`);
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
            `${parsed.location.lat.toFixed(1)}, ${parsed.location.lng.toFixed(
              1
            )}`
          );
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
            saveLocation(nearbyLocation.location, nearbyLocation.matchedName || null);
          } else {
            onLocationChange(newLocation);
            setInputValue(
              `${newLocation.lat.toFixed(1)}, ${newLocation.lng.toFixed(1)}`
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
          setInputValue(
            `${defaultLocation.lat.toFixed(1)}, ${defaultLocation.lng.toFixed(
              1
            )}`
          );
          setMatchedLocationName("LA");
          setIsNearbyMatch(false);
          saveLocation(defaultLocation, "LA");
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
  };

  const handleMapClick = (
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
  };

  const updateLocationState = (newLocation: Location) => {
    // Check if near a special location
    const nearbyLocation = findNearestSpecialLocation(newLocation);
    if (nearbyLocation) {
      setInputValue(
        `${nearbyLocation.location.lat.toFixed(
          1
        )}, ${nearbyLocation.location.lng.toFixed(1)}`
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
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragLocation(null);
  };

  return (
    <div ref={cardRef} className="glass-morphism p-6 mb-8">
      <h2 className="text-6xl font-semibold mb-4 text-center">Your Location</h2>

      {isLoading ? (
        <p className="text-blue-200">Detecting your location...</p>
      ) : (
        <>
          <div className="relative mt-4">
            <label
              htmlFor="location-input"
              className="block text-sm font-medium mb-2"
            ></label>
            <div className="relative">
              <input
                ref={inputRef}
                id="location-input"
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => {
                  setIsFocused(true);
                  // Use setTimeout to ensure the state update happens first
                  setTimeout(() => updatePopoverPosition(), 0);
                }}
                onBlur={(e) => {
                  // Don't hide if the related target is within the map popover
                  const relatedTarget = e.relatedTarget as Element;
                  if (
                    relatedTarget &&
                    relatedTarget.closest("[data-map-popover]")
                  ) {
                    return;
                  }
                  // Delay hiding to allow map clicks
                  setTimeout(() => setIsFocused(false), 200);
                }}
                autoComplete="off"
                spellCheck={false}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Tab") {
                    e.preventDefault();
                    const parsed = parseLocationInput(inputValue);
                    if (parsed) {
                      let finalLocation = parsed;

                      // If no matched name from parsing, check for nearby special locations
                      if (!parsed.matchedName) {
                        const nearbyLocation = findNearestSpecialLocation(
                          parsed.location
                        );
                        if (nearbyLocation) {
                          finalLocation = nearbyLocation;
                        }
                      }

                      onLocationChange(finalLocation.location);
                      setMatchedLocationName(finalLocation.matchedName || null);
                      setIsNearbyMatch(
                        !parsed.matchedName && !!finalLocation.matchedName
                      );
                      saveLocation(
                        finalLocation.location,
                        finalLocation.matchedName || null
                      );

                      // If there's a matched location name, replace input with the name
                      if (finalLocation.matchedName) {
                        setInputValue(finalLocation.matchedName);
                      }
                    }
                  }
                }}
                className="text-5xl w-full pl-3 pr-16 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors text-center"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
                placeholder='Try "37.7, -122.4" or "Death Valley"'
              />
              <button
                onClick={getCurrentLocation}
                disabled={isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-white hover:text-blue-300 transition-colors disabled:opacity-50"
                title="Get current location"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Always reserve space for Near label to prevent card resizing */}
            <div className="mt-2 min-h-[28px] flex items-start">
              {matchedLocationName && (
                <p className="text-xl text-blue-200">
                  {isNearbyMatch
                    ? `Near ${matchedLocationName}`
                    : matchedLocationName}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Map popover - rendered as portal to document body */}
      {isFocused &&
        createPortal(
          <div
            className="fixed"
            data-map-popover
            style={{
              zIndex: 999999,
              top: popoverPosition.top,
              left: popoverPosition.left,
              width: popoverPosition.width,
            }}
            onMouseDown={(e) => {
              // Prevent the input from losing focus when interacting with the map
              e.preventDefault();
            }}
          >
            <div
              className="rounded-lg border border-white/30 shadow-2xl"
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <WorldMap
                location={dragLocation || location}
                onLocationChange={handleMapClick}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
