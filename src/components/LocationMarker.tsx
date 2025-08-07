import { memo, useMemo } from "react";
import { Location } from "../types/astronomy";
import { coordToNormalized } from "../utils/lightPollutionMap";
import { MARKER_BOUNDS } from "../config/mapConfig";
import styles from "./WorldMap.module.css";

interface MarkerPosition {
  x: number;
  y: number;
}

interface LocationMarkerProps {
  location: Location | null;
  panX: number;
  getMarkerPositionForPan: (
    normalizedX: number,
    normalizedY: number,
    customPanX: number,
  ) => MarkerPosition;
}

function LocationMarkerComponent({
  location,
  panX,
  getMarkerPositionForPan,
}: LocationMarkerProps) {
  // Memoize normalized coordinates
  const normalized = useMemo(() => {
    if (!location) return null;
    return coordToNormalized(location.lat, location.lng);
  }, [location]);

  // Memoize marker positions for all three copies
  const markerPositions = useMemo(() => {
    if (!normalized) return null;

    return {
      primary: getMarkerPositionForPan(normalized.x, normalized.y, panX),
      left: getMarkerPositionForPan(normalized.x, normalized.y, panX - 1),
      right: getMarkerPositionForPan(normalized.x, normalized.y, panX + 1),
    };
  }, [normalized, panX, getMarkerPositionForPan]);

  if (!location || !normalized || !markerPositions) {
    return null;
  }

  // Helper function to render a marker at a specific position
  const renderMarker = (position: MarkerPosition, key: string) => {
    if (
      position.x < MARKER_BOUNDS.MIN_X ||
      position.x > MARKER_BOUNDS.MAX_X ||
      position.y < MARKER_BOUNDS.MIN_Y ||
      position.y > MARKER_BOUNDS.MAX_Y
    ) {
      return null;
    }

    return (
      <div
        key={key}
        className={styles.marker}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          opacity: 1,
        }}
      />
    );
  };

  // Only show crosshairs if primary marker is visible vertically
  const showCrosshairs =
    markerPositions.primary.y >= MARKER_BOUNDS.MIN_Y &&
    markerPositions.primary.y <= MARKER_BOUNDS.MAX_Y;

  return (
    <div className={styles.markerOverlay}>
      {/* Crosshair lines */}
      {showCrosshairs && (
        <>
          <div
            className={styles.crosshairHorizontal}
            style={{
              top: `${markerPositions.primary.y}%`,
              opacity: 0.5,
            }}
          />
          <div
            className={styles.crosshairVertical}
            style={{
              left: `${markerPositions.primary.x}%`,
              opacity: 0.5,
            }}
          />
        </>
      )}

      {/* Primary marker */}
      {renderMarker(markerPositions.primary, "primary")}

      {/* Wrapped copies - only if primary marker is visible vertically */}
      {showCrosshairs && (
        <>
          {/* Left wrap marker */}
          {renderMarker(markerPositions.left, "left")}

          {/* Right wrap marker */}
          {renderMarker(markerPositions.right, "right")}
        </>
      )}
    </div>
  );
}

// Memoized export to prevent unnecessary re-renders
export default memo(LocationMarkerComponent);
