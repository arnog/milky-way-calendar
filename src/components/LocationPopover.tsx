import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Location } from "../types/astronomy";
import WorldMap from "./WorldMap";
import { useLocationManager } from "../hooks/useLocationManager";

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

  const [popoverPosition, setPopoverPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
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
                    // The handleInputChange already handles all parsing and updating
                    if (matchedLocationName) {
                      setInputValue(matchedLocationName);
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
                {formatLocationDisplay()}
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
