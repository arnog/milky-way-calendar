import styles from "./WorldMap.module.css";

interface ZoomControlsProps {
  zoom: number;
  minZoom: number;
  maxZoom: number;
  zoomSpeed: number;
  onZoom: (delta: number) => void;
  isVisible: boolean;
}

export default function ZoomControls({
  zoom,
  minZoom,
  maxZoom,
  zoomSpeed,
  onZoom,
  isVisible,
}: ZoomControlsProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.zoomControls}>
      <button
        className={styles.zoomButton}
        onClick={() => onZoom(zoomSpeed)}
        disabled={zoom >= maxZoom}
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        className={styles.zoomButton}
        onClick={() => onZoom(-zoomSpeed)}
        disabled={zoom <= minZoom}
        aria-label="Zoom out"
      >
        −
      </button>
    </div>
  );
}
