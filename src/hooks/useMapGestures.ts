import { useState, useCallback, useRef, useEffect, RefObject } from "react";
import { Location } from "../types/astronomy";
import { ZOOM_CONFIG, GESTURE_CONFIG } from "../config/mapConfig";
import { coordToNormalized } from "../utils/lightPollutionMap";

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
  currentLocation?: Location | null;
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
  getMarkerPositionForPan: (
    normalizedX: number,
    normalizedY: number,
    customPanX: number,
  ) => { x: number; y: number };
  config?: GestureConfig;
}

const DEFAULT_CONFIG: Required<GestureConfig> = {
  zoomSpeed: ZOOM_CONFIG.SPEED,
  dragThreshold: GESTURE_CONFIG.DRAG_THRESHOLD,
};

export function useMapGestures({
  containerRef,
  zoom,
  panX,
  panY,
  currentLocation,
  setPan,
  onZoom,
  onLocationChange,
  onDragStart,
  onDragEnd,
  screenToNormalized,
  normalizedToCoord,
  getMarkerPositionForPan,
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

  // Refs to hold latest pan and zoom values
  const panXRef = useRef(panX);
  const panYRef = useRef(panY);
  const zoomRef = useRef(zoom);

  // Keep refs in sync with latest props/state
  useEffect(() => {
    panXRef.current = panX;
  }, [panX]);
  useEffect(() => {
    panYRef.current = panY;
  }, [panY]);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);
  // rAF batching for panning
  const panDeltaRef = useRef({ dx: 0, dy: 0 });
  const panRafIdRef = useRef<number | null>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);

  // rAF batching for pinch zoom
  const pinchDeltaRef = useRef(0);
  const pinchCenterRef = useRef<{ x: number; y: number } | null>(null);
  const pinchRafIdRef = useRef<number | null>(null);

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

  // Check if a screen point is near the current location marker
  const isNearCurrentLocation = useCallback(
    (screenX: number, screenY: number): boolean => {
      if (!currentLocation) return false;

      const container = containerRef.current;
      if (!container) return false;

      const rect = container.getBoundingClientRect();
      const containerX = screenX - rect.left;
      const containerY = screenY - rect.top;

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

      // Define proximity threshold (in pixels)
      const threshold = 30; // 30px radius around the marker

      const distance = Math.sqrt(
        Math.pow(containerX - locationScreenX, 2) +
          Math.pow(containerY - locationScreenY, 2),
      );

      return distance <= threshold;
    },
    [currentLocation, containerRef, panX, getMarkerPositionForPan],
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
        pinchDeltaRef.current = 0;
        pinchCenterRef.current = center;
      } else if (event.touches.length === 1) {
        // Single touch pan
        const touch = event.touches[0];
        setLastTouchCenter({ x: touch.clientX, y: touch.clientY });
        lastPointerRef.current = { x: touch.clientX, y: touch.clientY };
        setIsPanning(true);
      }
    },
    [getTouchDistance, getTouchCenter],
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent) => {
      event.preventDefault();

      if (event.touches.length === 2 && lastTouchDistance && lastTouchCenter) {
        // Pinch zoom (rAF-batched)
        const distance = getTouchDistance(event.touches);
        const center = getTouchCenter(event.touches);

        const deltaDistance = distance - lastTouchDistance;
        const zoomDelta =
          deltaDistance *
          finalConfig.zoomSpeed *
          ZOOM_CONFIG.TOUCH_SPEED_MULTIPLIER;

        // rAF-batch pinch zoom to match wheel behavior
        pinchDeltaRef.current += zoomDelta;
        pinchCenterRef.current = center;
        if (pinchRafIdRef.current == null) {
          pinchRafIdRef.current = requestAnimationFrame(() => {
            pinchRafIdRef.current = null;
            const d = pinchDeltaRef.current;
            const c = pinchCenterRef.current;
            if (d !== 0 && c) {
              onZoom(d, c.x, c.y);
            }
            pinchDeltaRef.current = 0;
            pinchCenterRef.current = null;
          });
        }

        setLastTouchDistance(distance);
        setLastTouchCenter(center);
      } else if (event.touches.length === 1 && isPanning && lastTouchCenter) {
        // Single touch pan (rAF-batched)
        const touch = event.touches[0];
        const prev = lastPointerRef.current ?? {
          x: touch.clientX,
          y: touch.clientY,
        };
        const dx = touch.clientX - prev.x;
        const dy = touch.clientY - prev.y;
        lastPointerRef.current = { x: touch.clientX, y: touch.clientY };

        panDeltaRef.current.dx += dx;
        panDeltaRef.current.dy += dy;

        if (panRafIdRef.current == null) {
          panRafIdRef.current = requestAnimationFrame(() => {
            panRafIdRef.current = null;
            const container = containerRef.current;
            if (container) {
              const rect = container.getBoundingClientRect();
              const { dx, dy } = panDeltaRef.current;
              if (dx !== 0 || dy !== 0) {
                const z = zoomRef.current;
                const basePanX = panXRef.current;
                const basePanY = panYRef.current;
                const newPanX = basePanX + dx / (rect.width * z);
                const newPanY = basePanY + dy / rect.height;
                setPan(newPanX, newPanY);
                panDeltaRef.current = { dx: 0, dy: 0 };
              }
            }
          });
        }

        setLastTouchCenter({ x: touch.clientX, y: touch.clientY });
      }
    },
    [
      lastTouchDistance,
      lastTouchCenter,
      isPanning,
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
    if (panRafIdRef.current != null) cancelAnimationFrame(panRafIdRef.current);
    panRafIdRef.current = null;
    panDeltaRef.current = { dx: 0, dy: 0 };
    lastPointerRef.current = null;
    if (pinchRafIdRef.current != null)
      cancelAnimationFrame(pinchRafIdRef.current);
    pinchRafIdRef.current = null;
    pinchDeltaRef.current = 0;
    pinchCenterRef.current = null;
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
          if (e.shiftKey || !isNearCurrentLocation(startX, startY)) {
            // Shift+drag to pan OR click away from current location marker
            hasPanned = true;
            setIsPanning(true);
            lastPointerRef.current = { x: startX, y: startY };
          } else {
            // Click near current location marker - drag to select new location
            hasDragged = true;
            setIsDragging(true);
            onDragStart?.();
          }
        }

        if (hasPanned) {
          // Pan the map (rAF-batched)
          const prev = lastPointerRef.current ?? { x: e.clientX, y: e.clientY };
          const dx = e.clientX - prev.x;
          const dy = e.clientY - prev.y;
          lastPointerRef.current = { x: e.clientX, y: e.clientY };

          panDeltaRef.current.dx += dx;
          panDeltaRef.current.dy += dy;

          if (panRafIdRef.current == null) {
            panRafIdRef.current = requestAnimationFrame(() => {
              panRafIdRef.current = null;
              const container = containerRef.current;
              if (container) {
                const rect = container.getBoundingClientRect();
                const { dx, dy } = panDeltaRef.current;
                if (dx !== 0 || dy !== 0) {
                  const z = zoomRef.current;
                  const basePanX = panXRef.current;
                  const basePanY = panYRef.current;
                  const newPanX = basePanX + dx / (rect.width * z);
                  const newPanY = basePanY + dy / rect.height;
                  setPan(newPanX, newPanY);
                  panDeltaRef.current = { dx: 0, dy: 0 };
                }
              }
            });
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
          if (panRafIdRef.current != null)
            cancelAnimationFrame(panRafIdRef.current);
          panRafIdRef.current = null;
          panDeltaRef.current = { dx: 0, dy: 0 };
          lastPointerRef.current = null;
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
      containerRef,
      setPan,
      onLocationChange,
      onDragStart,
      onDragEnd,
      getLocationFromEvent,
      isNearCurrentLocation,
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
