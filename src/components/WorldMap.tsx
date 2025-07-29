import { useEffect, useRef, useState } from "react";
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
  const [svgContent, setSvgContent] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Load the SVG content
    fetch("/world-map.svg")
      .then((res) => res.text())
      .then((svg) => {
        // Use regex to extract path elements with landxx class
        const pathRegex =
          /<path[^>]*class="[^"]*landxx[^"]*"[^>]*d="([^"]+)"[^>]*>/g;
        let pathsHtml = "";
        let match;

        while ((match = pathRegex.exec(svg)) !== null) {
          const d = match[1];
          if (d) {
            pathsHtml += `<path d="${d}" fill="none" stroke="rgba(255, 255, 255, 1)" stroke-width="5" />`;
          }
        }

        setSvgContent(pathsHtml);
      })
      .catch(() => {
        // Fallback to simple map if loading fails
        setSvgContent(`
          <g stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" fill="none">
            <path d="M50,50 L70,45 L80,50 L85,60 L80,70 L70,65 L60,70 L50,60 Z" />
            <path d="M70,90 L75,85 L80,90 L78,100 L75,110 L70,115 L65,110 L65,95 Z" />
            <path d="M180,45 L190,43 L195,45 L193,50 L185,52 L180,50 Z" />
            <path d="M180,70 L190,65 L195,70 L193,85 L190,95 L185,100 L180,95 L175,85 L178,75 Z" />
            <path d="M200,40 L240,38 L260,45 L255,55 L240,60 L220,55 L210,50 L200,45 Z" />
            <path d="M250,110 L270,108 L275,115 L270,120 L260,118 L255,115 Z" />
          </g>
        `);
      });
  }, []);

  const getLocationFromEvent = (event: React.MouseEvent<SVGSVGElement> | MouseEvent): Location => {
    const svg = containerRef.current?.querySelector('svg') as SVGSVGElement;
    if (!svg) return { lat: 0, lng: 0 };

    // Use SVG's built-in coordinate conversion
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    
    // Transform screen coordinates to SVG coordinates
    const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());
    
    // Convert SVG coordinates to lat/lng
    const viewBoxWidth = 2754;
    const viewBoxHeight = 1398;
    const lng = (svgPoint.x / viewBoxWidth) * 360 - 180;
    const lat = 90 - (svgPoint.y / viewBoxHeight) * 180;

    return { lat, lng };
  };

  const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
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
        const newLocation = getLocationFromEvent(e as any);
        onLocationChange(newLocation, true);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      if (hasDragged) {
        // End of drag - get final location and notify parent
        const finalLocation = getLocationFromEvent(e as any);
        setIsDragging(false);
        onDragEnd?.();
        // Send final location as non-dragging to commit it
        onLocationChange(finalLocation, false);
      } else {
        // It was just a click, handle it
        onLocationChange(initialLocation, false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div ref={containerRef}>
      <svg
        viewBox="0 0 2754 1398"
        className={`w-full border border-white/20 rounded ${isDragging ? 'cursor-grabbing' : 'cursor-crosshair'}`}
        onMouseDown={handleMouseDown}
        style={{ 
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          aspectRatio: "2754 / 1398",
          userSelect: "none"
        }}
      >
        <g dangerouslySetInnerHTML={{ __html: svgContent }} />

        {/* Location marker */}
        {location && (
          <>
            {/* Crosshair lines */}
            <line
              x1={0}
              y1={((90 - location.lat) * 1398) / 180}
              x2={2754}
              y2={((90 - location.lat) * 1398) / 180}
              stroke="#ff0000"
              strokeWidth="20"
              opacity="0.5"
            />
            <line
              x1={((location.lng + 180) * 2754) / 360}
              y1={0}
              x2={((location.lng + 180) * 2754) / 360}
              y2={1398}
              stroke="#ff0000"
              strokeWidth="20"
              opacity="0.5"
            />
            {/* Red dot */}
            <circle
              cx={((location.lng + 180) * 2754) / 360}
              cy={((90 - location.lat) * 1398) / 180}
              r="50"
              fill="#ff0000"
            />
          </>
        )}
      </svg>
    </div>
  );
}
