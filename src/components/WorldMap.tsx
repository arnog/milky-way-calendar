import { useRef, useState, useEffect, useCallback } from "react";
import { Location } from "../types/astronomy";
import { coordToNormalized, normalizedToCoord } from "../utils/lightPollutionMap";
import { mapImageCache } from "../services/mapImageCache";
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
  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState(true);
  const previousObjectUrlRef = useRef<string | null>(null);
  
  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  
  // Touch gesture state
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [lastTouchCenter, setLastTouchCenter] = useState<{ x: number; y: number } | null>(null);

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

  // Zoom constraints
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 8;
  const ZOOM_SPEED = 0.1;
  
  // Pan constraint helper functions
  const constrainPan = useCallback((newPanX: number, newPanY: number, currentZoom: number) => {
    // For horizontal (X): Wrap the pan value to keep within -1 to 1 range
    // This ensures we always stay within the 3-map strip
    let constrainedPanX = newPanX;
    while (constrainedPanX > 1) constrainedPanX -= 2;
    while (constrainedPanX < -1) constrainedPanX += 2;
    
    // For vertical (Y): Constrain to prevent showing areas beyond map bounds
    if (currentZoom <= 1) {
      // At zoom level 1 or less, always center the map vertically (no gaps)
      return { x: constrainedPanX, y: 0 };
    } else {
      // When zoomed in, calculate maximum allowed pan distance
      // This prevents showing empty space beyond the map bounds
      const maxPanY = (currentZoom - 1) / 2;
      const minPanY = -(currentZoom - 1) / 2;
      const constrainedPanY = Math.max(minPanY, Math.min(maxPanY, newPanY));
      return { x: constrainedPanX, y: constrainedPanY };
    }
  }, []);
  
  // Helper function to get touch distance
  const getTouchDistance = (touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };
  
  // Helper function to get touch center point
  const getTouchCenter = (touches: React.TouchList): { x: number; y: number } => {
    if (touches.length === 1) {
      return { x: touches[0].clientX, y: touches[0].clientY };
    }
    const touch1 = touches[0];
    const touch2 = touches[1];
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  };
  
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
  

  const getLocationFromEvent = (
    event: React.MouseEvent<HTMLDivElement> | MouseEvent | Touch
  ): Location => {
    const normalized = screenToNormalized(event.clientX, event.clientY);
    return normalizedToCoord(normalized.x, normalized.y);
  };

  // Zoom functions
  const handleZoom = useCallback((delta: number, centerX?: number, centerY?: number) => {
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const zoomCenterX = centerX !== undefined ? (centerX - rect.left) / rect.width - 0.5 : 0;
    const zoomCenterY = centerY !== undefined ? (centerY - rect.top) / rect.height - 0.5 : 0;
    
    setZoom(prevZoom => {
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prevZoom + delta));
      
      if (newZoom !== prevZoom) {
        if (newZoom <= 1) {
          // When zooming to 1.0 or below, always center the map completely
          // This prevents boundary gaps that can occur from pan calculations
          setPanX(0);
          setPanY(0);
        } else if (centerX !== undefined && centerY !== undefined) {
          // Normal zoom with center point - adjust pan to zoom toward the center point
          const zoomFactor = newZoom / prevZoom;
          const newPanX = (panX + zoomCenterX * (prevZoom - newZoom)) / zoomFactor;
          const newPanY = (panY + zoomCenterY * (prevZoom - newZoom)) / zoomFactor;
          
          // Apply constraints
          const constrained = constrainPan(newPanX, newPanY, newZoom);
          setPanX(constrained.x);
          setPanY(constrained.y);
        } else {
          // Zoom without center point - just apply constraints to current pan values
          const constrained = constrainPan(panX, panY, newZoom);
          setPanX(constrained.x);
          setPanY(constrained.y);
        }
      }
      
      return newZoom;
    });
  }, [constrainPan, panX, panY]);
  
  
  // Touch handlers
  const handleTouchStart = (event: React.TouchEvent) => {
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
  };
  
  const handleTouchMove = (event: React.TouchEvent) => {
    event.preventDefault();
    
    if (event.touches.length === 2 && lastTouchDistance && lastTouchCenter) {
      // Pinch zoom
      const distance = getTouchDistance(event.touches);
      const center = getTouchCenter(event.touches);
      
      const deltaDistance = distance - lastTouchDistance;
      const zoomDelta = deltaDistance * ZOOM_SPEED * 0.005;
      
      handleZoom(zoomDelta, center.x, center.y);
      
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
        
        // Apply constraints
        const constrained = constrainPan(newPanX, newPanY, zoom);
        setPanX(constrained.x);
        setPanY(constrained.y);
      }
      
      setLastTouchCenter({ x: touch.clientX, y: touch.clientY });
    }
  };
  
  const handleTouchEnd = () => {
    setLastTouchDistance(null);
    setLastTouchCenter(null);
    setIsPanning(false);
  };
  
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return; // Only left mouse button

    event.preventDefault(); // Prevent default behavior

    let hasDragged = false;
    let hasPanned = false;
    const startX = event.clientX;
    const startY = event.clientY;
    const initialLocation = getLocationFromEvent(event);

    const handleMouseMove = (e: MouseEvent) => {
      // Check if mouse has moved more than 3 pixels (to differentiate from click)
      const distance = Math.sqrt(
        Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2)
      );

      if (!hasDragged && !hasPanned && distance > 3) {
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
          
          // Apply constraints
          const constrained = constrainPan(newPanX, newPanY, zoom);
          setPanX(constrained.x);
          setPanY(constrained.y);
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
  };

  
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
            disabled={zoom >= MAX_ZOOM}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            className={styles.zoomButton}
            onClick={() => handleZoom(-ZOOM_SPEED)}
            disabled={zoom <= MIN_ZOOM}
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
