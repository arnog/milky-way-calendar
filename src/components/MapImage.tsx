import { RefObject } from "react";
import styles from "./WorldMap.module.css";

interface MapImageProps {
  src: string;
  alt: string;
  zoom: number;
  panX: number;
  panY: number;
  panOffset: number; // -1 for left, 0 for primary, 1 for right
  isDragging: boolean;
  isPanning: boolean;
  isImageLoading: boolean;
  containerRef: RefObject<HTMLDivElement>;
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchMove: (event: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export default function MapImage({
  src,
  alt,
  zoom,
  panX,
  panY,
  panOffset,
  isDragging,
  isPanning,
  isImageLoading,
  containerRef,
  onMouseDown,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: MapImageProps) {
  const getCursorClass = () => {
    if (isDragging) return styles.mapImageGrabbing;
    if (isPanning) return styles.mapImageGrabbing;
    if (zoom > 1) return styles.mapImageGrab;
    return styles.mapImageCrosshair;
  };

  const getLoadingClass = () => {
    return isImageLoading ? styles.mapImageLoading : styles.mapImageLoaded;
  };

  const getTransform = () => {
    const adjustedPanX = (panX + panOffset) * 100;
    const panYPx = (panY * (containerRef.current?.clientHeight || 1)) / zoom;
    return `scale(${zoom}) translate(${adjustedPanX}%, ${panYPx}px)`;
  };

  const getTransition = () => {
    return isPanning || isDragging ? "none" : "transform 0.1s ease-out";
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`${styles.mapImage} ${getCursorClass()} ${getLoadingClass()}`}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onLoad={() => {}} // Loading state managed by cache service
      style={{
        transform: getTransform(),
        transformOrigin: "center",
        transition: getTransition(),
      }}
      draggable={false}
    />
  );
}
