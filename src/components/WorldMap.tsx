import { useRef, useState, useEffect, useCallback } from "react";
import { Location } from "../types/astronomy";
import { coordToNormalized, normalizedToCoord } from "../utils/lightPollutionMap";
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
  const [imageSrc, setImageSrc] = useState<string>("/world2024B-sm.jpg");
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  
  // Touch gesture state
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [lastTouchCenter, setLastTouchCenter] = useState<{ x: number; y: number } | null>(null);

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

  // Zoom constraints
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 8;
  const ZOOM_SPEED = 0.1;
  
  // Pan constraint helper functions
  const constrainPan = useCallback((newPanX: number, newPanY: number, currentZoom: number) => {
    // For horizontal (X): Allow wrapping by not constraining
    const constrainedPanX = newPanX;
    
    // For vertical (Y): Constrain to prevent showing areas beyond map bounds
    // When zoomed in, we need to prevent panning too far up or down
    const maxPanY = currentZoom > 1 ? (currentZoom - 1) / 2 : 0;
    const minPanY = currentZoom > 1 ? -(currentZoom - 1) / 2 : 0;
    const constrainedPanY = Math.max(minPanY, Math.min(maxPanY, newPanY));
    
    return { x: constrainedPanX, y: constrainedPanY };
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
      
      // Adjust pan to zoom toward the center point
      if (centerX !== undefined && centerY !== undefined && newZoom !== prevZoom) {
        const zoomFactor = newZoom / prevZoom;
        const newPanX = (panX + zoomCenterX * (prevZoom - newZoom)) / zoomFactor;
        const newPanY = (panY + zoomCenterY * (prevZoom - newZoom)) / zoomFactor;
        
        // Apply constraints
        const constrained = constrainPan(newPanX, newPanY, newZoom);
        setPanX(constrained.x);
        setPanY(constrained.y);
      }
      
      return newZoom;
    });
  }, [constrainPan]);
  
  
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
        if (e.shiftKey) {
          // Shift+drag to pan
          hasPanned = true;
          setIsPanning(true);
        } else {
          // Regular drag to select location
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

  
  // Convert normalized coordinates to screen coordinates (accounting for zoom/pan)
  // This matches the CSS transform order: scale() then translate()
  const normalizedToScreen = (normalizedX: number, normalizedY: number): { x: number; y: number } => {
    // First apply zoom (scale) around center (0.5, 0.5)
    const scaledX = (normalizedX - 0.5) * zoom + 0.5;
    const scaledY = (normalizedY - 0.5) * zoom + 0.5;
    
    // Then apply pan (translate)
    let x = scaledX + panX;
    const y = scaledY + panY;
    
    // Handle horizontal wrapping: normalize x to 0-1 range
    x = ((x % 1) + 1) % 1;
    
    return { x: x * 100, y: y * 100 }; // Convert to percentages for CSS positioning
  };

  const markerPosition = location
    ? (() => {
        const normalized = coordToNormalized(location.lat, location.lng);
        return normalizedToScreen(normalized.x, normalized.y);
      })()
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
          <div className={styles.zoomLevel}>{zoom.toFixed(1)}×</div>
          <button
            className={styles.zoomButton}
            onClick={() => handleZoom(-ZOOM_SPEED)}
            disabled={zoom <= MIN_ZOOM}
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            className={styles.resetButton}
            onClick={() => {
              setZoom(1);
              const constrained = constrainPan(0, 0, 1);
              setPanX(constrained.x);
              setPanY(constrained.y);
            }}
            disabled={zoom === 1 && panX === 0 && panY === 0}
            aria-label="Reset zoom and pan"
          >
            ⌂
          </button>
        </div>
      )}

      {/* Primary map image */}
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
        onLoad={() => setIsImageLoading(false)}
        style={{
          transform: `scale(${zoom}) translate(${(panX * (containerRef.current?.clientWidth || 1)) / zoom}px, ${(panY * (containerRef.current?.clientHeight || 1)) / zoom}px)`,
          transformOrigin: 'center',
          transition: isPanning || isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
        draggable={false}
      />
      
      {/* Wrapped copies for horizontal continuity */}
      <>
        {/* Left wrapped copy */}
        <img
          src={imageSrc}
          alt="World map showing light pollution (wrapped left)"
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
            transform: `scale(${zoom}) translate(${(panX * (containerRef.current?.clientWidth || 1)) / zoom - 100}%, ${(panY * (containerRef.current?.clientHeight || 1)) / zoom}px)`,
            transformOrigin: 'center',
            transition: isPanning || isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
          draggable={false}
        />
        
        {/* Right wrapped copy */}
        <img
          src={imageSrc}
          alt="World map showing light pollution (wrapped right)"
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
            transform: `scale(${zoom}) translate(${(panX * (containerRef.current?.clientWidth || 1)) / zoom + 100}%, ${(panY * (containerRef.current?.clientHeight || 1)) / zoom}px)`,
            transformOrigin: 'center',
            transition: isPanning || isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
          draggable={false}
        />
      </>

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
          
          {/* Wrapped copies */}
          {markerPosition.y >= 0 && markerPosition.y <= 100 && (
            <>
              {/* Wrapped copy on the right */}
              {markerPosition.x + 100 >= 0 && markerPosition.x + 100 <= 100 && (
                <div
                  className={styles.marker}
                  style={{
                    left: `${markerPosition.x + 100}%`,
                    top: `${markerPosition.y}%`,
                    opacity: 1
                  }}
                />
              )}
              
              {/* Wrapped copy on the left */}
              {markerPosition.x - 100 >= 0 && markerPosition.x - 100 <= 100 && (
                <div
                  className={styles.marker}
                  style={{
                    left: `${markerPosition.x - 100}%`,
                    top: `${markerPosition.y}%`,
                    opacity: 1
                  }}
                />
              )}
            </>
          )}
        </div>
      )}
      
      {/* Additional markers overlay */}
      {markers.length > 0 && (
        <div className={styles.markerOverlay}>
          {markers.map((marker) => {
            const { x: normalizedX, y: normalizedY } = coordToNormalized(marker.lat, marker.lng);
            const screenPos = normalizedToScreen(normalizedX, normalizedY);
            
            // For horizontal wrapping, we might need to show the marker at multiple positions
            const markerElements = [];
            
            // Primary marker position
            markerElements.push(
              <div
                key={`${marker.id}-primary`}
                className={styles.markerPosition}
                style={{
                  left: `${screenPos.x}%`,
                  top: `${screenPos.y}%`,
                  opacity: screenPos.y >= 0 && screenPos.y <= 100 ? 1 : 0
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
            
            // We might need wrapped copies
            // Check if we need a wrapped copy on the left (position + 100%)
            const wrappedRightX = screenPos.x + 100;
            if (wrappedRightX >= 0 && wrappedRightX <= 100) {
              markerElements.push(
                <div
                  key={`${marker.id}-wrapped-right`}
                  className={styles.markerPosition}
                  style={{
                    left: `${wrappedRightX}%`,
                    top: `${screenPos.y}%`,
                    opacity: screenPos.y >= 0 && screenPos.y <= 100 ? 1 : 0
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
            
            // Check if we need a wrapped copy on the right (position - 100%)
            const wrappedLeftX = screenPos.x - 100;
            if (wrappedLeftX >= 0 && wrappedLeftX <= 100) {
              markerElements.push(
                <div
                  key={`${marker.id}-wrapped-left`}
                  className={styles.markerPosition}
                  style={{
                    left: `${wrappedLeftX}%`,
                    top: `${screenPos.y}%`,
                    opacity: screenPos.y >= 0 && screenPos.y <= 100 ? 1 : 0
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
            
            return markerElements;
          })}
        </div>
      )}
      
      {/* Instructions */}
      {!isImageLoading && (
        <div className={styles.instructions}>
          Shift+drag to pan • Scroll to zoom • Wraps horizontally
        </div>
      )}
    </div>
  );
}
