import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Location } from "../types/astronomy";
import WorldMap from "./WorldMap";
import { useLocationManager } from "../hooks/useLocationManager";

interface LocationInputProps {
  location: Location | null;
  onLocationChange: (location: Location) => void;
}

export default function LocationInput({
  location,
  onLocationChange,
}: LocationInputProps) {
  const {
    inputValue,
    setInputValue,
    matchedLocationName,
    isLoading,
    dragLocation,
    handleInputChange,
    handleMapClick,
    handleDragStart,
    handleDragEnd,
    getCurrentLocation,
    formatLocationDisplay,
  } = useLocationManager({ initialLocation: location, onLocationChange });

  const [isFocused, setIsFocused] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
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
                    // The handleInputChange already handles all parsing and updating
                    if (matchedLocationName) {
                      setInputValue(matchedLocationName);
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
                  {formatLocationDisplay()}
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
