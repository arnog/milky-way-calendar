import { memo, useMemo } from "react";
import { coordToNormalized } from "../utils/lightPollutionMap";
import { MARKER_BOUNDS } from "../config/mapConfig";
import { memoize } from "../utils/performance";
import styles from "./WorldMap.module.css";

export interface WorldMapMarker {
  id: string;
  lat: number;
  lng: number;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  title?: string;
  children?: React.ReactNode;
}

interface MarkerPosition {
  x: number;
  y: number;
}

interface AdditionalMarkersProps {
  markers: WorldMapMarker[];
  panX: number;
  getMarkerPositionForPan: (
    normalizedX: number,
    normalizedY: number,
    customPanX: number,
  ) => MarkerPosition;
}

// Memoized coordinate normalization
const memoizedCoordToNormalized = memoize(
  (lat: number, lng: number) => coordToNormalized(lat, lng),
  (lat, lng) => `${lat},${lng}`
);

function AdditionalMarkersComponent({
  markers,
  panX,
  getMarkerPositionForPan,
}: AdditionalMarkersProps) {
  // Memoize processed markers with positions and visibility culling
  const processedMarkers = useMemo(() => {
    if (markers.length === 0) return [];

    return markers.map((marker) => {
      const normalized = memoizedCoordToNormalized(marker.lat, marker.lng);
      
      // Generate positions for all three maps
      const positions = [
        {
          pos: getMarkerPositionForPan(normalized.x, normalized.y, panX),
          key: "primary",
        },
        {
          pos: getMarkerPositionForPan(normalized.x, normalized.y, panX - 1),
          key: "left",
        },
        {
          pos: getMarkerPositionForPan(normalized.x, normalized.y, panX + 1),
          key: "right",
        },
      ];

      // Filter visible positions (marker culling)
      const visiblePositions = positions.filter(({ pos }) => 
        pos.x >= MARKER_BOUNDS.MIN_X && 
        pos.x <= MARKER_BOUNDS.MAX_X && 
        pos.y >= MARKER_BOUNDS.MIN_Y && 
        pos.y <= MARKER_BOUNDS.MAX_Y
      );

      return {
        marker,
        visiblePositions,
      };
    }).filter(({ visiblePositions }) => visiblePositions.length > 0); // Only keep markers with visible positions
  }, [markers, panX, getMarkerPositionForPan]);

  if (processedMarkers.length === 0) {
    return null;
  }

  return (
    <div className={styles.markerOverlay}>
      {processedMarkers.map(({ marker, visiblePositions }) => (
        visiblePositions.map(({ pos, key }) => (
          <div
            key={`${marker.id}-${key}`}
            className={styles.markerPosition}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              opacity: 1,
            }}
          >
            <div
              className={marker.className}
              onClick={marker.onClick}
              onMouseEnter={marker.onMouseEnter}
              onMouseLeave={marker.onMouseLeave}
              title={marker.title}
            >
              {marker.children}
            </div>
          </div>
        ))
      ))}
    </div>
  );
}

// Memoized export to prevent unnecessary re-renders
export default memo(AdditionalMarkersComponent);
