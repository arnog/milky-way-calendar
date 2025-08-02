import { useRef, useState, useEffect } from "react";
import { Location } from "../types/astronomy";
import { coordToNormalized, normalizedToCoord } from "../utils/lightPollutionMap";
import styles from "./WorldMap.module.css";

interface WorldMapProps {
  location: Location | null;
  onLocationChange: (location: Location, isDragging?: boolean) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export default function WorldMap({
  location,
  onLocationChange,
  onDragStart,
  onDragEnd,
}: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("/world2024B-sm.jpg");
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Determine which image to use based on screen size
  const getMapSrc = () => {
    if (typeof window === "undefined") return "/world2024B-md.jpg";
    const width = window.innerWidth;

    // Use WebP for better compression when supported
    const supportsWebP =
      typeof window !== "undefined" &&
      document
        .createElement("canvas")
        .toDataURL("image/webp")
        .indexOf("data:image/webp") === 0;

    if (width < 768) {
      // Mobile devices - use small resolution
      return supportsWebP ? "/world2024B-sm.webp" : "/world2024B-sm.jpg";
    } else if (width < 1920) {
      // Tablets and regular screens - use medium resolution
      return supportsWebP ? "/world2024B-md.webp" : "/world2024B-md.jpg";
    } else {
      // Large screens - use full resolution PNG for best quality
      return "/world2024B-lg.png";
    }
  };

  // Use the corrected coordinate mapping that matches the light pollution map coverage (-65° to +75°)
  const equirectangularUnproject = (
    x: number,
    y: number
  ): { lat: number; lng: number } => {
    return normalizedToCoord(x, y);
  };

  const getLocationFromEvent = (
    event: React.MouseEvent<HTMLDivElement> | MouseEvent
  ): Location => {
    const container = containerRef.current;
    if (!container) return { lat: 0, lng: 0 };

    const rect = container.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    // Apply equirectangular projection inverse transform
    return equirectangularUnproject(x, y);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return; // Only left mouse button

    event.preventDefault(); // Prevent default behavior

    let hasDragged = false;
    const startX = event.clientX;
    const startY = event.clientY;
    const initialLocation = getLocationFromEvent(event);

    const handleMouseMove = (e: MouseEvent) => {
      // Check if mouse has moved more than 3 pixels (to differentiate from click)
      const distance = Math.sqrt(
        Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2)
      );

      if (!hasDragged && distance > 3) {
        // First move - start dragging
        hasDragged = true;
        setIsDragging(true);
        onDragStart?.();
      }

      if (hasDragged) {
        const newLocation = getLocationFromEvent(e);
        onLocationChange(newLocation, true);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      if (hasDragged) {
        // End of drag - get final location and notify parent
        const finalLocation = getLocationFromEvent(e);
        setIsDragging(false);
        onDragEnd?.();
        // Send final location as non-dragging to commit it
        onLocationChange(finalLocation, false);
      } else {
        // It was just a click, handle it
        onLocationChange(initialLocation, false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Use the corrected coordinate mapping that matches the light pollution map coverage (-65° to +75°)
  const equirectangularProject = (
    lat: number,
    lng: number
  ): { x: number; y: number } => {
    return coordToNormalized(lat, lng);
  };

  const markerPosition = location
    ? equirectangularProject(location.lat, location.lng)
    : null;

  // Update image source based on window size
  useEffect(() => {
    const updateImageSrc = () => {
      const newSrc = getMapSrc();
      if (newSrc !== imageSrc) {
        setImageSrc(newSrc);
        setIsImageLoading(true);
      }
    };

    // Initial load
    updateImageSrc();

    // Update on resize
    const handleResize = () => {
      updateImageSrc();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imageSrc]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
    >
      {/* Loading state */}
      {isImageLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingText}>Loading map...</div>
        </div>
      )}

      <img
        src={imageSrc}
        alt="World map showing light pollution"
        className={`${styles.mapImage} ${
          isDragging ? styles.mapImageGrabbing : styles.mapImageCrosshair
        } ${
          isImageLoading ? styles.mapImageLoading : styles.mapImageLoaded
        }`}
        onMouseDown={handleMouseDown}
        onLoad={() => setIsImageLoading(false)}
        style={{}}
        draggable={false}
      />

      {/* Location marker overlay */}
      {location && markerPosition && (
        <div className={styles.markerOverlay}>
          {/* Crosshair lines */}
          <div
            className={styles.crosshairHorizontal}
            style={{ top: `${markerPosition.y * 100}%` }}
          />
          <div
            className={styles.crosshairVertical}
            style={{ left: `${markerPosition.x * 100}%` }}
          />
          {/* Red dot */}
          <div
            className={styles.marker}
            style={{
              left: `${markerPosition.x * 100}%`,
              top: `${markerPosition.y * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
