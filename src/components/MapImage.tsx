import { RefObject, memo, useMemo } from "react";
import { ANIMATION_CONFIG } from "../config/mapConfig";
import { Location } from "../types/astronomy";
import { useCursorState } from "../hooks/useCursorState";
import styles from "./WorldMap.module.css";

interface MapImageProps {
  src: string;
  alt: string;
  zoom: number;
  panX: number;
  panY: number;
  panOffset: number; // -1 for left, 0 for primary, 1 for right
  currentLocation?: Location | null;
  isDragging: boolean;
  isPanning: boolean;
  isZooming: boolean;
  isImageLoading: boolean;
  containerRef: RefObject<HTMLDivElement>;
  getMarkerPositionForPan: (
    normalizedX: number,
    normalizedY: number,
    customPanX: number,
  ) => { x: number; y: number };
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchMove: (event: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

function MapImageComponent({
  src,
  alt,
  zoom,
  panX,
  panY,
  panOffset,
  currentLocation,
  isDragging,
  isPanning,
  isZooming,
  isImageLoading,
  containerRef,
  getMarkerPositionForPan,
  onMouseDown,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: MapImageProps) {
  // Use cursor state hook for proximity-based cursor changes
  const { handleMouseMove, getCursorClass } = useCursorState({
    containerRef,
    currentLocation,
    isDragging,
    isPanning,
    panX,
    getMarkerPositionForPan,
  });

  // Memoize cursor class calculation
  const cursorClass = useMemo(() => {
    const cursorName = getCursorClass();
    return styles[cursorName];
  }, [getCursorClass]);

  // Memoize loading class
  const loadingClass = useMemo(() => {
    return isImageLoading ? styles.mapImageLoading : styles.mapImageLoaded;
  }, [isImageLoading]);

  // Memoize transform calculation
  const transform = useMemo(() => {
    const adjustedPanX = (panX + panOffset) * 100;
    const panYPx = (panY * (containerRef.current?.clientHeight || 1)) / zoom;
    return `scale(${zoom}) translate(${adjustedPanX}%, ${panYPx}px)`;
  }, [zoom, panX, panY, panOffset, containerRef]);

  // Memoize transition - disable during panning, dragging, or zooming
  const transition = useMemo(() => {
    return isPanning || isDragging || isZooming
      ? "none"
      : `transform ${ANIMATION_CONFIG.TRANSITION_DURATION} ${ANIMATION_CONFIG.TRANSITION_EASING}`;
  }, [isPanning, isDragging, isZooming]);

  // Memoize style object to prevent unnecessary re-renders
  const imageStyle = useMemo(
    () => ({
      transform,
      transformOrigin: "center",
      transition,
    }),
    [transform, transition],
  );

  return (
    <img
      src={src}
      alt={alt}
      className={`${styles.mapImage} ${cursorClass} ${loadingClass}`}
      onMouseDown={onMouseDown}
      onMouseMove={handleMouseMove}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onLoad={() => {}} // Loading state managed by cache service
      style={imageStyle}
      draggable={false}
    />
  );
}

// Memoized export to prevent unnecessary re-renders
export default memo(MapImageComponent);
