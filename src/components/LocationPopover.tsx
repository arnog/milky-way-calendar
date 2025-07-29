import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Location } from "../types/astronomy";
import WorldMap from "./WorldMap";
import {
  parseLocationInput,
  findNearestSpecialLocation,
} from "../utils/locationParser";

interface LocationPopoverProps {
  location: Location | null;
  onLocationChange: (location: Location) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

export default function LocationPopover({
  location,
  onLocationChange,
  onClose,
  triggerRef,
}: LocationPopoverProps) {
  const [inputValue, setInputValue] = useState("");
  const [matchedLocationName, setMatchedLocationName] = useState<string | null>(
    null
  );
  const [isNearbyMatch, setIsNearbyMatch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsDragging] = useState(false);
  const [dragLocation, setDragLocation] = useState<Location | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Position popover relative to trigger
  useEffect(() => {
    if (triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const desiredWidth = Math.min(Math.max(viewportWidth * 0.5, 500), 800);

      // Center the popover horizontally on the page
      const left = (viewportWidth - desiredWidth) / 2;

      setPopoverPosition({
        top: triggerRect.bottom + window.scrollY + 8,
        left: left,
        width: desiredWidth,
      });
    }
  }, [triggerRef]);

  // Initialize input value from localStorage or location
  useEffect(() => {
    const savedLocation = localStorage.getItem("milkyway-location");
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        if (parsed.matchedName) {
          setInputValue(parsed.matchedName);
          setMatchedLocationName(parsed.matchedName);
          setIsNearbyMatch(false);
        } else if (parsed.location) {
          setInputValue(
            `${parsed.location.lat.toFixed(1)}, ${parsed.location.lng.toFixed(
              1
            )}`
          );
          setMatchedLocationName(null);
          setIsNearbyMatch(false);
        }
      } catch (e) {
        // Invalid saved data, use current location
        if (location) {
          setInputValue(
            `${location.lat.toFixed(1)}, ${location.lng.toFixed(1)}`
          );
        }
      }
    } else if (location) {
      setInputValue(`${location.lat.toFixed(1)}, ${location.lng.toFixed(1)}`);
    }
  }, [location]);

  // Close on outside click, scroll, or resize
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    const handleResize = () => {
      onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [onClose, triggerRef]);

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

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

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
              `${nearbyLocation.location.lat.toFixed(
                1
              )}, ${nearbyLocation.location.lng.toFixed(1)}`
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

  return createPortal(
    <div
      ref={popoverRef}
      className="fixed z-50 p-6 rounded-lg shadow-2xl border border-white/30"
      style={{
        top: popoverPosition.top,
        left: popoverPosition.left,
        width: popoverPosition.width,
        maxWidth: "90vw",
        backgroundColor: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold"></h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {isLoading ? (
        <p className="text-blue-200 text-3xl">Detecting your location...</p>
      ) : (
        <>
          <div className="mb-4">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                className="text-lg w-full px-3 py-2 pr-12 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors bg-white/10 border border-white/20"
                placeholder="Enter coordinates or location name"
                autoComplete="off"
                spellCheck={false}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Tab") {
                    e.preventDefault();
                    const parsed = parseLocationInput(inputValue);
                    if (parsed) {
                      let finalLocation = parsed;
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
                      if (finalLocation.matchedName) {
                        setInputValue(finalLocation.matchedName);
                      }
                    }
                  }
                }}
              />
              <button
                onClick={getCurrentLocation}
                disabled={isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white disabled:text-gray-600 transition-colors"
                title="Use current location"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>

            {matchedLocationName && (
              <p className="text-sm text-blue-300 mt-1">
                {isNearbyMatch ? "Near " : ""}
                {matchedLocationName}
              </p>
            )}
          </div>

          <div className="mb-4">
            <WorldMap
              location={dragLocation || location}
              onLocationChange={handleMapClick}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          </div>
        </>
      )}
    </div>,
    document.body
  );
}
