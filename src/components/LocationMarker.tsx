import { Location } from "../types/astronomy";
import { coordToNormalized } from "../utils/lightPollutionMap";
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

export default function LocationMarker({
  location,
  panX,
  getMarkerPositionForPan,
}: LocationMarkerProps) {
  if (!location) {
    return null;
  }

  const normalized = coordToNormalized(location.lat, location.lng);
  const markerPosition = getMarkerPositionForPan(
    normalized.x,
    normalized.y,
    panX,
  );

  // Helper function to render a marker at a specific position
  const renderMarker = (position: MarkerPosition, key: string) => {
    if (
      position.x < -10 ||
      position.x > 110 ||
      position.y < 0 ||
      position.y > 100
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
  const showCrosshairs = markerPosition.y >= 0 && markerPosition.y <= 100;

  return (
    <div className={styles.markerOverlay}>
      {/* Crosshair lines */}
      {showCrosshairs && (
        <>
          <div
            className={styles.crosshairHorizontal}
            style={{
              top: `${markerPosition.y}%`,
              opacity: 0.5,
            }}
          />
          <div
            className={styles.crosshairVertical}
            style={{
              left: `${markerPosition.x}%`,
              opacity: 0.5,
            }}
          />
        </>
      )}

      {/* Primary marker */}
      {renderMarker(markerPosition, "primary")}

      {/* Wrapped copies - only if primary marker is visible vertically */}
      {showCrosshairs && (
        <>
          {/* Left wrap marker */}
          {renderMarker(
            getMarkerPositionForPan(normalized.x, normalized.y, panX - 1),
            "left",
          )}

          {/* Right wrap marker */}
          {renderMarker(
            getMarkerPositionForPan(normalized.x, normalized.y, panX + 1),
            "right",
          )}
        </>
      )}
    </div>
  );
}
