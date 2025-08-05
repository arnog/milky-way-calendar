import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { flushSync } from "react-dom";
import { Location } from "../types/astronomy";
import { normalizedToCoord } from "../utils/lightPollutionMap";
import { mapImageCache } from "../services/mapImageCache";
import { useMapState } from "../hooks/useMapState";
import { useMapGestures } from "../hooks/useMapGestures";
import { MAP_CONFIG, ZOOM_CONFIG, IMAGE_CONFIG } from "../config/mapConfig";
import { MapCoordinateSystem, coordinateUtils } from "../utils/mapCoordinates";
import { throttle, performanceMonitor } from "../utils/performance";
import ZoomControls from "./ZoomControls";
import MapImage from "./MapImage";
import LocationMarker from "./LocationMarker";
import AdditionalMarkers, { WorldMapMarker } from "./AdditionalMarkers";
import styles from "./WorldMap.module.css";

interface WorldMapProps {
  location: Location | null;
  onLocationChange: (location: Location, isDragging?: boolean) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  markers?: WorldMapMarker[];
}

export default function WorldMap({
  location,
  onLocationChange,
  onDragStart,
  onDragEnd,
  markers = [],
}: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isZooming, setIsZooming] = useState(false);
  const previousObjectUrlRef = useRef<string | null>(null);
  const zoomTimeoutRef = useRef<number | null>(null);

  // Map state management
  const {
    zoom,
    panX,
    panY,
    setZoom,
    setPan,
    setZoomAndPan,
  } = useMapState({
    minZoom: ZOOM_CONFIG.MIN,
    maxZoom: ZOOM_CONFIG.MAX,
  });

  // Create coordinate system for transformations
  const coordinateSystem = useMemo(() => {
    return new MapCoordinateSystem(zoom, panX, panY, containerRef);
  }, [zoom, panX, panY]);

  // Track loading state to prevent concurrent image loads
  const isLoadingRef = useRef(false);

  // Load cached image with automatic format selection and performance monitoring
  const loadCachedImage = useCallback(async () => {
    // Prevent concurrent image loading
    if (isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    const measurementId = `image-loading-${Date.now()}`;
    performanceMonitor.startMeasurement(measurementId);
    
    try {
      setIsImageLoading(true);
      const screenWidth =
        typeof window !== "undefined" ? window.innerWidth : 1920;

      const { objectUrl } = await mapImageCache.loadImageAsBlob(
        "color",
        undefined, // Let cache service auto-select size
        screenWidth,
      );

      // Clean up previous object URL to prevent memory leaks
      if (
        previousObjectUrlRef.current &&
        previousObjectUrlRef.current.startsWith("blob:")
      ) {
        URL.revokeObjectURL(previousObjectUrlRef.current);
      }

      setImageSrc(objectUrl);
      previousObjectUrlRef.current = objectUrl;
    } catch (error) {
      console.error("Failed to load cached map image:", error);
      // Fallback to direct image loading
      setImageSrc("/world2024B-md.jpg");
      previousObjectUrlRef.current = null;
    } finally {
      setIsImageLoading(false);
      isLoadingRef.current = false;
      performanceMonitor.endMeasurement(measurementId);
    }
  }, []);

  // Convert screen coordinates to normalized coordinates using coordinate system
  const screenToNormalized = useCallback((
    screenX: number,
    screenY: number,
  ): { x: number; y: number } => {
    return coordinateSystem.screenToNormalized(screenX, screenY);
  }, [coordinateSystem]);

  // Zoom handler with performance monitoring
  const handleZoom = useCallback(
    (delta: number, centerX?: number, centerY?: number) => {
      performanceMonitor.startMeasurement('zoom-operation', { delta, hasCenter: !!centerX });
      
      const currentZoom = zoom;
      const newZoom = Math.max(
        ZOOM_CONFIG.MIN,
        Math.min(ZOOM_CONFIG.MAX, currentZoom + delta),
      );

      if (newZoom !== currentZoom) {
        // Set zooming state to disable transitions
        setIsZooming(true);
        
        // Clear any existing zoom timeout
        if (zoomTimeoutRef.current) {
          clearTimeout(zoomTimeoutRef.current);
        }
        
        // Calculate pan adjustments if zooming around a specific point
        if (centerX !== undefined && centerY !== undefined && newZoom > 1) {
          const zoomCenter = coordinateUtils.getZoomCenter(centerX, centerY, containerRef);
          const newPan = coordinateUtils.calculateZoomPan(
            { x: panX, y: panY },
            zoomCenter,
            currentZoom,
            newZoom
          );

          // Use flushSync to ensure synchronous state updates and prevent marker lag
          // This ensures zoom and pan are updated together in the same render cycle
          flushSync(() => {
            setZoomAndPan(newZoom, newPan.x, newPan.y);
          });
        } else {
          // Simple zoom without pan adjustment
          flushSync(() => {
            setZoom(newZoom);
          });
        }
        
        // Re-enable transitions after a short delay
        zoomTimeoutRef.current = setTimeout(() => {
          setIsZooming(false);
        }, 50);
      }

      performanceMonitor.endMeasurement('zoom-operation');
    },
    [zoom, panX, panY, setZoom, setZoomAndPan],
  );

  // Throttled zoom handler for high-frequency events
  const throttledZoom = useMemo(() => 
    throttle(handleZoom, 16), // ~60fps
    [handleZoom]
  );

  // Gesture handlers using the hook
  const {
    isDragging,
    isPanning,
    handleMouseDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useMapGestures({
    containerRef,
    zoom,
    panX,
    panY,
    setPan,
    onZoom: handleZoom,
    onLocationChange,
    onDragStart,
    onDragEnd,
    screenToNormalized,
    normalizedToCoord,
    config: {
      zoomSpeed: ZOOM_CONFIG.SPEED,
      dragThreshold: MAP_CONFIG.gestures.DRAG_THRESHOLD,
    },
  });

  // Memoized coordinate systems for different pan offsets
  const coordinateSystems = useMemo(() => ({
    primary: coordinateSystem,
    left: new MapCoordinateSystem(zoom, panX - 1, panY, containerRef),
    right: new MapCoordinateSystem(zoom, panX + 1, panY, containerRef),
  }), [coordinateSystem, zoom, panX, panY]);

  // Optimized marker position calculator with memoization
  const getMarkerPositionForPan = useCallback((
    normalizedX: number,
    normalizedY: number,
    customPanX: number,
  ): { x: number; y: number } => {
    // Use pre-computed coordinate systems for common offsets
    if (customPanX === panX) {
      return coordinateSystems.primary.getMarkerPosition(normalizedX, normalizedY);
    } else if (customPanX === panX - 1) {
      return coordinateSystems.left.getMarkerPosition(normalizedX, normalizedY);
    } else if (customPanX === panX + 1) {
      return coordinateSystems.right.getMarkerPosition(normalizedX, normalizedY);
    }
    
    // Fallback for custom offsets (rare case)
    const tempCoordSystem = new MapCoordinateSystem(zoom, customPanX, panY, containerRef);
    return tempCoordSystem.getMarkerPosition(normalizedX, normalizedY);
  }, [coordinateSystems, panX, zoom, panY]);

  // Load cached image on mount and resize
  useEffect(() => {
    // Initial load
    loadCachedImage();

    // Update on resize with debouncing
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        loadCachedImage();
      }, IMAGE_CONFIG.RESIZE_DEBOUNCE_MS); // Debounce resize events
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
      
      // Clean up zoom timeout
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }

      // Clean up object URL on unmount
      if (
        previousObjectUrlRef.current &&
        previousObjectUrlRef.current.startsWith("blob:")
      ) {
        URL.revokeObjectURL(previousObjectUrlRef.current);
      }
    };
  }, [loadCachedImage]);

  // Add native wheel event listener to prevent page scrolling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleNativeWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const delta = -event.deltaY * ZOOM_CONFIG.SPEED * ZOOM_CONFIG.WHEEL_SPEED_MULTIPLIER;
      throttledZoom(delta, event.clientX, event.clientY);
    };

    container.addEventListener("wheel", handleNativeWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleNativeWheel);
    };
  }, [throttledZoom]);

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Loading state */}
      {isImageLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingText}>Loading map...</div>
        </div>
      )}

      {/* Zoom controls */}
      <ZoomControls
        zoom={zoom}
        minZoom={ZOOM_CONFIG.MIN}
        maxZoom={ZOOM_CONFIG.MAX}
        zoomSpeed={ZOOM_CONFIG.SPEED}
        onZoom={handleZoom}
        isVisible={!isImageLoading}
      />

      {/* Map images */}
      <MapImage
        src={imageSrc}
        alt="World map showing light pollution"
        zoom={zoom}
        panX={panX}
        panY={panY}
        panOffset={0}
        isDragging={isDragging}
        isPanning={isPanning}
        isZooming={isZooming}
        isImageLoading={isImageLoading}
        containerRef={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      <MapImage
        src={imageSrc}
        alt="World map showing light pollution (left wrap)"
        zoom={zoom}
        panX={panX}
        panY={panY}
        panOffset={-1}
        isDragging={isDragging}
        isPanning={isPanning}
        isZooming={isZooming}
        isImageLoading={isImageLoading}
        containerRef={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      <MapImage
        src={imageSrc}
        alt="World map showing light pollution (right wrap)"
        zoom={zoom}
        panX={panX}
        panY={panY}
        panOffset={1}
        isDragging={isDragging}
        isPanning={isPanning}
        isZooming={isZooming}
        isImageLoading={isImageLoading}
        containerRef={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Location marker */}
      <LocationMarker
        location={location}
        panX={panX}
        getMarkerPositionForPan={getMarkerPositionForPan}
      />

      {/* Additional markers */}
      <AdditionalMarkers
        markers={markers}
        panX={panX}
        getMarkerPositionForPan={getMarkerPositionForPan}
      />
    </div>
  );
}
