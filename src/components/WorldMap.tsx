import { useEffect, useRef, useState } from "react";
import { Location } from "../types/astronomy";

interface WorldMapProps {
  location: Location | null;
  onLocationChange: (location: Location) => void;
}

export default function WorldMap({
  location,
  onLocationChange,
}: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");

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

  const handleMapClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;

    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert to lat/lng based on the viewBox (2754 x 1398)
    const lng = (x / rect.width) * 360 - 180;
    const lat = 90 - (y / rect.height) * 180;

    onLocationChange({ lat, lng });
  };

  return (
    <div ref={containerRef} className="mb-4">
      <svg
        viewBox="0 0 2754 1398"
        className="w-full h-48 cursor-crosshair border border-white/20 rounded"
        onClick={handleMapClick}
        style={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
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
