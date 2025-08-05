import { useRef, useState, useEffect, useCallback } from "react";
import { Location } from "../types/astronomy";
import { coordToNormalized, normalizedToCoord } from "../utils/lightPollutionMap";
import { mapImageCache } from "../services/mapImageCache";
import { useMapState } from "../hooks/useMapState";
import { useMapGestures } from "../hooks/useMapGestures";
import styles from "./WorldMap.module.css";

interface WorldMapMarker {
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
  const previousObjectUrlRef = useRef<string | null>(null);
  
  // Map state management
  const {
    zoom,
    panX,
    panY,
    setZoom,
    setPan,
    constrainPan,
    config: mapConfig,
  } = useMapState({
    minZoom: 1,
    maxZoom: 8,
  });

  // Load cached image with automatic format selection
  const loadCachedImage = async () => {
    try {
      setIsImageLoading(true);
      const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
      
      const { objectUrl } = await mapImageCache.loadImageAsBlob(
        'color',
        undefined, // Let cache service auto-select size
        screenWidth
      );
      
      // Clean up previous object URL to prevent memory leaks
      if (previousObjectUrlRef.current && previousObjectUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(previousObjectUrlRef.current);
      }
      
      setImageSrc(objectUrl);
      previousObjectUrlRef.current = objectUrl;
    } catch (error) {
      console.error('Failed to load cached map image:', error);
      // Fallback to direct image loading
      setImageSrc('/world2024B-md.jpg');
      previousObjectUrlRef.current = null;
    } finally {
      setIsImageLoading(false);
    }
  };

  // Zoom constants
  const ZOOM_SPEED = 0.1;
  
  // Convert screen coordinates to normalized coordinates (accounting for zoom/pan)
  const screenToNormalized = (screenX: number, screenY: number): { x: number; y: number } => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    
    const rect = container.getBoundingClientRect();
    const relativeX = (screenX - rect.left) / rect.width;
    const relativeY = (screenY - rect.top) / rect.height;
    
    // Account for zoom and pan
    let x = (relativeX - 0.5) / zoom - panX / zoom + 0.5;
    let y = (relativeY - 0.5) / zoom - panY / zoom + 0.5;
    
    // Handle horizontal wrapping: normalize x to 0-1 range
    x = ((x % 1) + 1) % 1;
    
    // Constrain y to valid range (no wrapping vertically)
    y = Math.max(0, Math.min(1, y));
    
    return { x, y };
  };
  


  // Zoom handler
  const handleZoom = useCallback((delta: number, centerX?: number, centerY?: number) => {
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const zoomCenterX = centerX !== undefined ? (centerX - rect.left) / rect.width - 0.5 : 0;
    const zoomCenterY = centerY !== undefined ? (centerY - rect.top) / rect.height - 0.5 : 0;
    
    setZoom(prevZoom => {
      const newZoom = Math.max(mapConfig.minZoom, Math.min(mapConfig.maxZoom, prevZoom + delta));
      
      if (newZoom !== prevZoom && centerX !== undefined && centerY !== undefined && newZoom > 1) {
        // Normal zoom with center point - adjust pan to zoom toward the center point
        const zoomFactor = newZoom / prevZoom;
        const newPanX = (panX + zoomCenterX * (prevZoom - newZoom)) / zoomFactor;
        const newPanY = (panY + zoomCenterY * (prevZoom - newZoom)) / zoomFactor;
        
        // Apply constraints using the hook's method
        const constrained = constrainPan(newPanX, newPanY, newZoom);
        setPan(constrained.x, constrained.y);
      }
      
      return newZoom;
    });
  }, [constrainPan, panX, panY, setPan, mapConfig.minZoom, mapConfig.maxZoom]);

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
      zoomSpeed: ZOOM_SPEED,
      dragThreshold: 3,
    },
  });

  
  // Helper function to position markers using the same coordinate system as map transforms
  const getMarkerPositionForPan = (normalizedX: number, normalizedY: number, customPanX: number): { x: number; y: number } => {
    // The map images use: transform: scale(${zoom}) translate(${customPanX * 100}%, ${(panY * containerHeight) / zoom}px)
    // We need to apply the same transformations to marker positions
    
    // Start with the base normalized coordinates (0-1 range)
    // Convert to percentage coordinates 
    let x = normalizedX * 100; // Convert to 0-100 range
    let y = normalizedY * 100;
    
    // Step 1: Apply translation (same as maps)
    x += customPanX * 100; // Same as map's translate(${customPanX * 100}%, ...)
    // For Y: match map's pixel-based Y translation, converted to percentage
    y += (panY / zoom) * 100; // Same as map's ${(panY * containerHeight) / zoom}px converted to %
    
    // Step 2: Apply zoom scaling around center (50%, 50%) - same as maps
    // CSS transform order: scale() then translate() means we scale the final position
    x = (x - 50) * zoom + 50;
    y = (y - 50) * zoom + 50;
    
    return { x, y };
  };

  const markerPosition = location
    ? (() => {
        const normalized = coordToNormalized(location.lat, location.lng);
        return getMarkerPositionForPan(normalized.x, normalized.y, panX);
      })()
    : null;

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
      }, 300); // Debounce resize events
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
      
      // Clean up object URL on unmount
      if (previousObjectUrlRef.current && previousObjectUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(previousObjectUrlRef.current);
      }
    };
  }, []); // Remove imageSrc dependency since we're using cached URLs

  // Add native wheel event listener to prevent page scrolling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleNativeWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      
      const delta = -event.deltaY * ZOOM_SPEED * 0.01;
      handleZoom(delta, event.clientX, event.clientY);
    };

    container.addEventListener('wheel', handleNativeWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleNativeWheel);
    };
  }, [handleZoom]);


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

      {/* Zoom controls */}
      {!isImageLoading && (
        <div className={styles.zoomControls}>
          <button
            className={styles.zoomButton}
            onClick={() => handleZoom(ZOOM_SPEED)}
            disabled={zoom >= mapConfig.maxZoom}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            className={styles.zoomButton}
            onClick={() => handleZoom(-ZOOM_SPEED)}
            disabled={zoom <= mapConfig.minZoom}
            aria-label="Zoom out"
          >
            −
          </button>
        </div>
      )}

      {/* Primary map */}
      <img
        src={imageSrc}
        alt="World map showing light pollution"
        className={`${styles.mapImage} ${
          isDragging ? styles.mapImageGrabbing : 
          isPanning ? styles.mapImageGrabbing :
          zoom > 1 ? styles.mapImageGrab :
          styles.mapImageCrosshair
        } ${
          isImageLoading ? styles.mapImageLoading : styles.mapImageLoaded
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onLoad={() => {}} // Loading state managed by cache service
        style={{
          transform: `scale(${zoom}) translate(${(panX * 100)}%, ${(panY * (containerRef.current?.clientHeight || 1)) / zoom}px)`,
          transformOrigin: 'center',
          transition: isPanning || isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
        draggable={false}
      />
      
      {/* Left wrapped copy - always rendered for seamless wrapping */}
      <img
        src={imageSrc}
        alt="World map showing light pollution (left wrap)"
        className={`${styles.mapImage} ${
          isDragging ? styles.mapImageGrabbing : 
          isPanning ? styles.mapImageGrabbing :
          zoom > 1 ? styles.mapImageGrab :
          styles.mapImageCrosshair
        } ${
          isImageLoading ? styles.mapImageLoading : styles.mapImageLoaded
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `scale(${zoom}) translate(${((panX - 1) * 100)}%, ${(panY * (containerRef.current?.clientHeight || 1)) / zoom}px)`,
          transformOrigin: 'center',
          transition: isPanning || isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
        draggable={false}
      />
      
      {/* Right wrapped copy - always rendered for seamless wrapping */}
      <img
        src={imageSrc}
        alt="World map showing light pollution (right wrap)"
        className={`${styles.mapImage} ${
          isDragging ? styles.mapImageGrabbing : 
          isPanning ? styles.mapImageGrabbing :
          zoom > 1 ? styles.mapImageGrab :
          styles.mapImageCrosshair
        } ${
          isImageLoading ? styles.mapImageLoading : styles.mapImageLoaded
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `scale(${zoom}) translate(${((panX + 1) * 100)}%, ${(panY * (containerRef.current?.clientHeight || 1)) / zoom}px)`,
          transformOrigin: 'center',
          transition: isPanning || isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
        draggable={false}
      />


      {/* Location marker overlay */}
      {location && markerPosition && (
        <div className={styles.markerOverlay}>
          {/* Crosshair lines - only show if marker is visible vertically */}
          {markerPosition.y >= 0 && markerPosition.y <= 100 && (
            <>
              <div
                className={styles.crosshairHorizontal}
                style={{ 
                  top: `${markerPosition.y}%`,
                  opacity: 0.5
                }}
              />
              <div
                className={styles.crosshairVertical}
                style={{ 
                  left: `${markerPosition.x}%`,
                  opacity: 0.5
                }}
              />
            </>
          )}
          
          {/* Red dot - primary position */}
          <div
            className={styles.marker}
            style={{
              left: `${markerPosition.x}%`,
              top: `${markerPosition.y}%`,
              opacity: markerPosition.y >= 0 && markerPosition.y <= 100 ? 1 : 0
            }}
          />
          
          {/* Wrapped copies - calculate positions using same pan offsets as map copies */}
          {markerPosition.y >= 0 && markerPosition.y <= 100 && location && (
            <>
              {/* Left map copy: use panX - 1 to match map's (panX - 1) * 100% translation */}
              {(() => {
                const normalized = coordToNormalized(location.lat, location.lng);
                const leftPos = getMarkerPositionForPan(normalized.x, normalized.y, panX - 1);
                return leftPos.x >= -10 && leftPos.x <= 110 && (
                  <div
                    className={styles.marker}
                    style={{
                      left: `${leftPos.x}%`,
                      top: `${leftPos.y}%`,
                      opacity: 1
                    }}
                  />
                );
              })()}
              
              {/* Right map copy: use panX + 1 to match map's (panX + 1) * 100% translation */}
              {(() => {
                const normalized = coordToNormalized(location.lat, location.lng);
                const rightPos = getMarkerPositionForPan(normalized.x, normalized.y, panX + 1);
                return rightPos.x >= -10 && rightPos.x <= 110 && (
                  <div
                    className={styles.marker}
                    style={{
                      left: `${rightPos.x}%`,
                      top: `${rightPos.y}%`,
                      opacity: 1
                    }}
                  />
                );
              })()}
            </>
          )}
        </div>
      )}
      
      {/* Additional markers overlay */}
      {markers.length > 0 && (
        <div className={styles.markerOverlay}>
          {markers.map((marker) => {
            const { x: normalizedX, y: normalizedY } = coordToNormalized(marker.lat, marker.lng);
            
            // Generate positions for all three maps using the same coordinate system as maps
            const positions = [
              { pos: getMarkerPositionForPan(normalizedX, normalizedY, panX), key: 'primary' },
              { pos: getMarkerPositionForPan(normalizedX, normalizedY, panX - 1), key: 'left' },
              { pos: getMarkerPositionForPan(normalizedX, normalizedY, panX + 1), key: 'right' }
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
                      opacity: 1
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
                  </div>
                );
              }
            });
            
            return markerElements;
          })}
        </div>
      )}
      
    </div>
  );
}
