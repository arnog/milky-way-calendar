import { useRef, useState, useEffect } from "react";
import { Location } from "../types/astronomy";

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
  const [imageSrc, setImageSrc] = useState<string>('/world2024B-sm.jpg');
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Determine which image to use based on screen size
  const getMapSrc = () => {
    if (typeof window === 'undefined') return '/world2024B-md.jpg';
    const width = window.innerWidth;
    
    // Use WebP for better compression when supported
    const supportsWebP = typeof window !== 'undefined' && 
      document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    if (width < 768) {
      // Mobile devices - use small resolution
      return supportsWebP ? '/world2024B-sm.webp' : '/world2024B-sm.jpg';
    } else if (width < 1920) {
      // Tablets and regular screens - use medium resolution
      return supportsWebP ? '/world2024B-md.webp' : '/world2024B-md.jpg';
    } else {
      // Large screens - use full resolution PNG for best quality
      return '/world2024B-lg.png';
    }
  };

  // Equirectangular projection inverse transform (for the light pollution map)
  const equirectangularUnproject = (x: number, y: number): { lat: number; lng: number } => {
    // The map uses equirectangular projection
    // x: 0 to 1 maps to -180 to 180 longitude
    // y: 0 to 1 maps to 90 to -90 latitude (top to bottom)
    
    const lng = (x - 0.5) * 360;
    const lat = (0.5 - y) * 180;
    
    return { lat, lng };
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

  // Equirectangular projection forward transform for marker positioning
  const equirectangularProject = (lat: number, lng: number): { x: number; y: number } => {
    // Convert lat/lng to x/y coordinates for equirectangular projection
    const x = (lng + 180) / 360;
    const y = (90 - lat) / 180;
    
    return { x, y };
  };

  const markerPosition = location ? equirectangularProject(location.lat, location.lng) : null;

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

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imageSrc]);

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden border border-white/20 rounded bg-gray-900"
      style={{ aspectRatio: '18 / 7' }}
    >
      {/* Loading state */}
      {isImageLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-white/50">Loading map...</div>
        </div>
      )}
      
      <img
        src={imageSrc}
        alt="World map showing light pollution"
        className={`w-full h-full object-contain ${
          isDragging ? "cursor-grabbing" : "cursor-crosshair"
        } ${isImageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onMouseDown={handleMouseDown}
        onLoad={() => setIsImageLoading(false)}
        style={{ userSelect: "none" }}
        draggable={false}
      />
      
      {/* Location marker overlay */}
      {location && markerPosition && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Crosshair lines */}
          <div
            className="absolute w-full h-0.5 bg-red-500 opacity-50"
            style={{ top: `${markerPosition.y * 100}%` }}
          />
          <div
            className="absolute h-full w-0.5 bg-red-500 opacity-50"
            style={{ left: `${markerPosition.x * 100}%` }}
          />
          {/* Red dot */}
          <div
            className="absolute w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
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
