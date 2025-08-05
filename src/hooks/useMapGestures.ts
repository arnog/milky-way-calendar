import { useState, useCallback, RefObject } from "react";
import { Location } from "../types/astronomy";

export interface GestureState {
  isDragging: boolean;
  isPanning: boolean;
  lastTouchDistance: number | null;
  lastTouchCenter: { x: number; y: number } | null;
}

export interface GestureHandlers {
  handleMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleTouchStart: (event: React.TouchEvent) => void;
  handleTouchMove: (event: React.TouchEvent) => void;
  handleTouchEnd: () => void;
}

export interface GestureConfig {
  zoomSpeed?: number;
  dragThreshold?: number;
}

interface UseMapGesturesProps {
  containerRef: RefObject<HTMLDivElement>;
  zoom: number;
  panX: number;
  panY: number;
  setPan: (panX: number, panY: number) => void;
  onZoom: (delta: number, centerX?: number, centerY?: number) => void;
  onLocationChange: (location: Location, isDragging?: boolean) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  screenToNormalized: (
    screenX: number,
    screenY: number,
  ) => { x: number; y: number };
  normalizedToCoord: (x: number, y: number) => Location;
  config?: GestureConfig;
}

const DEFAULT_CONFIG: Required<GestureConfig> = {
  zoomSpeed: 0.1,
  dragThreshold: 3,
};

export function useMapGestures({
  containerRef,
  zoom,
  panX,
  panY,
  setPan,
  onZoom,
  onLocationChange,
  onDragStart,
  onDragEnd,
  screenToNormalized,
  normalizedToCoord,
  config = {},
}: UseMapGesturesProps) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(
    null,
  );
  const [lastTouchCenter, setLastTouchCenter] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Helper function to get touch distance
  const getTouchDistance = useCallback((touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2),
    );
  }, []);

  // Helper function to get touch center point
  const getTouchCenter = useCallback(
    (touches: React.TouchList): { x: number; y: number } => {
      if (touches.length === 1) {
        return { x: touches[0].clientX, y: touches[0].clientY };
      }
      const touch1 = touches[0];
      const touch2 = touches[1];
      return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };
    },
    [],
  );

  const getLocationFromEvent = useCallback(
    (
      event: React.MouseEvent<HTMLDivElement> | MouseEvent | Touch,
    ): Location => {
      const normalized = screenToNormalized(event.clientX, event.clientY);
      return normalizedToCoord(normalized.x, normalized.y);
    },
    [screenToNormalized, normalizedToCoord],
  );

  // Touch handlers
  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      if (event.touches.length === 2) {
        // Pinch gesture
        const distance = getTouchDistance(event.touches);
        const center = getTouchCenter(event.touches);
        setLastTouchDistance(distance);
        setLastTouchCenter(center);
      } else if (event.touches.length === 1) {
        // Single touch pan
        const touch = event.touches[0];
        setLastTouchCenter({ x: touch.clientX, y: touch.clientY });
        setIsPanning(true);
      }
    },
    [getTouchDistance, getTouchCenter],
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent) => {
      event.preventDefault();

      if (event.touches.length === 2 && lastTouchDistance && lastTouchCenter) {
        // Pinch zoom
        const distance = getTouchDistance(event.touches);
        const center = getTouchCenter(event.touches);

        const deltaDistance = distance - lastTouchDistance;
        const zoomDelta = deltaDistance * finalConfig.zoomSpeed * 0.005;

        onZoom(zoomDelta, center.x, center.y);

        setLastTouchDistance(distance);
        setLastTouchCenter(center);
      } else if (event.touches.length === 1 && isPanning && lastTouchCenter) {
        // Single touch pan
        const touch = event.touches[0];
        const deltaX = touch.clientX - lastTouchCenter.x;
        const deltaY = touch.clientY - lastTouchCenter.y;

        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const newPanX = panX + deltaX / rect.width;
          const newPanY = panY + deltaY / rect.height;
          setPan(newPanX, newPanY);
        }

        setLastTouchCenter({ x: touch.clientX, y: touch.clientY });
      }
    },
    [
      lastTouchDistance,
      lastTouchCenter,
      isPanning,
      panX,
      panY,
      containerRef,
      setPan,
      onZoom,
      getTouchDistance,
      getTouchCenter,
      finalConfig.zoomSpeed,
    ],
  );

  const handleTouchEnd = useCallback(() => {
    setLastTouchDistance(null);
    setLastTouchCenter(null);
    setIsPanning(false);
  }, []);

  // Mouse handlers
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.button !== 0) return; // Only left mouse button

      event.preventDefault(); // Prevent default behavior

      let hasDragged = false;
      let hasPanned = false;
      const startX = event.clientX;
      const startY = event.clientY;
      const initialLocation = getLocationFromEvent(event);

      const handleMouseMove = (e: MouseEvent) => {
        // Check if mouse has moved more than threshold (to differentiate from click)
        const distance = Math.sqrt(
          Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2),
        );

        if (!hasDragged && !hasPanned && distance > finalConfig.dragThreshold) {
          if (e.shiftKey || zoom > 1) {
            // Shift+drag to pan OR zoom > 1 (intuitive panning when zoomed in)
            hasPanned = true;
            setIsPanning(true);
          } else {
            // Regular drag to select location (only when zoom = 1)
            hasDragged = true;
            setIsDragging(true);
            onDragStart?.();
          }
        }

        if (hasPanned) {
          // Pan the map
          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;
          const container = containerRef.current;
          if (container) {
            const rect = container.getBoundingClientRect();
            const newPanX = panX + deltaX / rect.width;
            const newPanY = panY + deltaY / rect.height;
            setPan(newPanX, newPanY);
          }
        } else if (hasDragged) {
          // Select location
          const newLocation = getLocationFromEvent(e);
          onLocationChange(newLocation, true);
        }
      };

      const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        if (hasPanned) {
          setIsPanning(false);
        } else if (hasDragged) {
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
    },
    [
      zoom,
      panX,
      panY,
      containerRef,
      setPan,
      onLocationChange,
      onDragStart,
      onDragEnd,
      getLocationFromEvent,
      finalConfig.dragThreshold,
    ],
  );

  const state: GestureState = {
    isDragging,
    isPanning,
    lastTouchDistance,
    lastTouchCenter,
  };

  const handlers: GestureHandlers = {
    handleMouseDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };

  return {
    ...state,
    ...handlers,
  };
}
