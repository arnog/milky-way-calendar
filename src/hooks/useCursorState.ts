import { useState, useCallback, RefObject } from "react";
import { Location } from "../types/astronomy";
import { coordToNormalized } from "../utils/lightPollutionMap";

interface UseCursorStateProps {
  containerRef: RefObject<HTMLDivElement>;
  currentLocation?: Location | null;
  isDragging: boolean;
  isPanning: boolean;
  panX: number;
  getMarkerPositionForPan: (
    normalizedX: number,
    normalizedY: number,
    customPanX: number,
  ) => { x: number; y: number };
}

export function useCursorState({
  containerRef,
  currentLocation,
  isDragging,
  isPanning,
  panX,
  getMarkerPositionForPan,
}: UseCursorStateProps) {
  const [isNearLocation, setIsNearLocation] = useState(false);

  // Check if mouse position is near the current location marker
  const checkProximity = useCallback(
    (clientX: number, clientY: number): boolean => {
      if (!currentLocation) return false;

      const container = containerRef.current;
      if (!container) return false;

      const rect = container.getBoundingClientRect();
      const containerX = clientX - rect.left;
      const containerY = clientY - rect.top;

      // Convert lat/lng to normalized coordinates
      const normalized = coordToNormalized(
        currentLocation.lat,
        currentLocation.lng,
      );

      // Get the actual marker position using the same transform as the real marker
      const markerPosition = getMarkerPositionForPan(
        normalized.x,
        normalized.y,
        panX,
      );

      // Convert marker percentage position to pixels
      const locationScreenX = (markerPosition.x / 100) * rect.width;
      const locationScreenY = (markerPosition.y / 100) * rect.height;

      // 30px threshold
      const threshold = 30;
      const distance = Math.sqrt(
        Math.pow(containerX - locationScreenX, 2) +
          Math.pow(containerY - locationScreenY, 2),
      );

      return distance <= threshold;
    },
    [currentLocation, containerRef, panX, getMarkerPositionForPan],
  );

  // Mouse move handler to update cursor state
  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      const nearLocation = checkProximity(event.clientX, event.clientY);
      setIsNearLocation(nearLocation);
    },
    [checkProximity],
  );

  // Determine cursor class based on state
  const getCursorClass = useCallback(() => {
    if (isDragging) return "grabbingCursor";
    if (isPanning) return "grabbingCursor";
    if (isNearLocation) return "crosshairCursor";
    return "grabCursor";
  }, [isDragging, isPanning, isNearLocation]);

  return {
    isNearLocation,
    handleMouseMove,
    getCursorClass,
  };
}
