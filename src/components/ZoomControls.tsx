import { memo, useCallback } from "react";
import styles from "./WorldMap.module.css";

interface ZoomControlsProps {
  zoom: number;
  minZoom: number;
  maxZoom: number;
  zoomSpeed: number;
  onZoom: (delta: number) => void;
  isVisible: boolean;
}

function ZoomControlsComponent({
  zoom,
  minZoom,
  maxZoom,
  zoomSpeed,
  onZoom,
  isVisible,
}: ZoomControlsProps) {
  // Memoize click handlers to prevent unnecessary re-renders
  const handleZoomIn = useCallback(
    () => onZoom(zoomSpeed),
    [onZoom, zoomSpeed],
  );
  const handleZoomOut = useCallback(
    () => onZoom(-zoomSpeed),
    [onZoom, zoomSpeed],
  );

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.zoomControls}>
      <button
        className={styles.zoomButton}
        onClick={handleZoomIn}
        disabled={zoom >= maxZoom}
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        className={styles.zoomButton}
        onClick={handleZoomOut}
        disabled={zoom <= minZoom}
        aria-label="Zoom out"
      >
        −
      </button>
    </div>
  );
}

// Memoized export to prevent unnecessary re-renders
export default memo(ZoomControlsComponent);
