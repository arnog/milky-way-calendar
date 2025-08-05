import { coordToNormalized } from "../utils/lightPollutionMap";
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

export default function AdditionalMarkers({
  markers,
  panX,
  getMarkerPositionForPan,
}: AdditionalMarkersProps) {
  if (markers.length === 0) {
    return null;
  }

  return (
    <div className={styles.markerOverlay}>
      {markers.map((marker) => {
        const { x: normalizedX, y: normalizedY } = coordToNormalized(
          marker.lat,
          marker.lng,
        );

        // Generate positions for all three maps using the same coordinate system as maps
        const positions = [
          {
            pos: getMarkerPositionForPan(normalizedX, normalizedY, panX),
            key: "primary",
          },
          {
            pos: getMarkerPositionForPan(normalizedX, normalizedY, panX - 1),
            key: "left",
          },
          {
            pos: getMarkerPositionForPan(normalizedX, normalizedY, panX + 1),
            key: "right",
          },
        ];

        const markerElements: React.ReactElement[] = [];

        positions.forEach(({ pos, key }) => {
          // Only show markers that are within reasonable bounds
          if (pos.x >= -10 && pos.x <= 110 && pos.y >= 0 && pos.y <= 100) {
            markerElements.push(
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
              </div>,
            );
          }
        });

        return markerElements;
      })}
    </div>
  );
}
