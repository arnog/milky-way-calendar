/**
 * Generate SVG path for a circular arc
 * @param startAngle Start angle in degrees (0 = top, clockwise)
 * @param endAngle End angle in degrees
 * @param radius Arc radius
 * @param centerX Center X coordinate
 * @param centerY Center Y coordinate
 * @returns SVG path string
 */
export function createArcPath(
  startAngle: number,
  endAngle: number,
  radius: number,
  centerX: number = 200,
  centerY: number = 200
): string {
  // Handle the case where arc spans more than 180 degrees
  const angleSpan = endAngle >= startAngle 
    ? endAngle - startAngle 
    : (360 - startAngle) + endAngle;
  
  if (angleSpan >= 360) {
    // Full circle
    return createFullCirclePath(radius, centerX, centerY);
  }
  
  // Convert angles to radians
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  
  // Calculate start and end points
  const startX = centerX + radius * Math.sin(startRad);
  const startY = centerY - radius * Math.cos(startRad);
  const endX = centerX + radius * Math.sin(endRad);
  const endY = centerY - radius * Math.cos(endRad);
  
  // Large arc flag (1 if arc spans more than 180 degrees)
  const largeArcFlag = angleSpan > 180 ? 1 : 0;
  
  // Sweep flag (1 for clockwise)
  const sweepFlag = 1;
  
  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;
}

/**
 * Create a full circle path (for when arc spans 360 degrees)
 */
function createFullCirclePath(
  radius: number,
  centerX: number = 200,
  centerY: number = 200
): string {
  // Create a circle using two semicircular arcs
  const topX = centerX;
  const topY = centerY - radius;
  const bottomX = centerX;
  const bottomY = centerY + radius;
  
  return `M ${topX} ${topY} A ${radius} ${radius} 0 0 1 ${bottomX} ${bottomY} A ${radius} ${radius} 0 0 1 ${topX} ${topY}`;
}

/**
 * Create multiple arc segments with different colors (for gradients)
 */
export function createSegmentedArc(
  startAngle: number,
  endAngle: number,
  radius: number,
  segments: Array<{ color: string; portion: number }>,
  centerX: number = 200,
  centerY: number = 200
): Array<{ path: string; color: string }> {
  const totalAngle = endAngle >= startAngle 
    ? endAngle - startAngle 
    : (360 - startAngle) + endAngle;
  
  const result = [];
  let currentAngle = startAngle;
  
  for (const segment of segments) {
    const segmentAngle = totalAngle * segment.portion;
    const segmentEndAngle = (currentAngle + segmentAngle) % 360;
    
    const path = createArcPath(
      currentAngle,
      segmentEndAngle,
      radius,
      centerX,
      centerY
    );
    
    result.push({
      path,
      color: segment.color
    });
    
    currentAngle = segmentEndAngle;
  }
  
  return result;
}

/**
 * Calculate arc parameters for astronomical events
 */
export interface ArcParams {
  path: string;
  color: string;
  opacity?: number;
  strokeWidth?: number;
  className?: string;
}

/**
 * Create sun arc with twilight transitions
 */
export function createSunArc(
  sunsetAngle: number,
  twilightEndAngle: number,
  twilightStartAngle: number,
  sunriseAngle: number,
  radius: number,
  centerX: number = 200,
  centerY: number = 200
): ArcParams[] {
  const arcs: ArcParams[] = [];
  
  // Sunset to astronomical twilight end (orange - twilight)
  if (twilightEndAngle !== sunsetAngle) {
    arcs.push({
      path: createArcPath(sunsetAngle, twilightEndAngle, radius, centerX, centerY),
      color: '#FFA500', // Orange
      className: 'sun-twilight'
    });
  }
  
  // Astronomical night (dark blue/black)
  if (twilightStartAngle !== twilightEndAngle) {
    arcs.push({
      path: createArcPath(twilightEndAngle, twilightStartAngle, radius, centerX, centerY),
      color: '#0B0E16', // Night blue
      className: 'sun-night'
    });
  }
  
  // Astronomical twilight start to sunrise (yellow - dawn)
  if (sunriseAngle !== twilightStartAngle) {
    arcs.push({
      path: createArcPath(twilightStartAngle, sunriseAngle, radius, centerX, centerY),
      color: '#FFD700', // Yellow
      className: 'sun-dawn'
    });
  }
  
  return arcs;
}

/**
 * Create moon arc with illumination-based opacity
 */
export function createMoonArc(
  moonriseAngle: number,
  moonsetAngle: number,
  illumination: number,
  radius: number,
  centerX: number = 200,
  centerY: number = 200
): ArcParams | null {
  if (moonriseAngle === moonsetAngle) {
    return null; // No moon visibility
  }
  
  return {
    path: createArcPath(moonriseAngle, moonsetAngle, radius, centerX, centerY),
    color: '#C0C0C0', // Silver
    opacity: Math.max(0.2, illumination), // Minimum 20% opacity for visibility
    className: 'moon-arc'
  };
}

/**
 * Create Galactic Center arc with optimal viewing highlight
 */
export function createGalacticCenterArc(
  gcRiseAngle: number,
  optimalStartAngle: number,
  optimalEndAngle: number,
  gcSetAngle: number,
  qualityScore: number,
  radius: number,
  centerX: number = 200,
  centerY: number = 200
): ArcParams[] {
  const arcs: ArcParams[] = [];
  
  // GC rise to optimal window start (light blue)
  if (optimalStartAngle !== gcRiseAngle) {
    arcs.push({
      path: createArcPath(gcRiseAngle, optimalStartAngle, radius, centerX, centerY),
      color: '#87CEEB', // Light blue
      className: 'gc-visible'
    });
  }
  
  // Optimal viewing window (cyan with quality-based opacity)
  if (optimalEndAngle !== optimalStartAngle) {
    arcs.push({
      path: createArcPath(optimalStartAngle, optimalEndAngle, radius, centerX, centerY),
      color: '#6EC6FF', // Cyan (accent color)
      opacity: Math.max(0.4, qualityScore), // Quality-based opacity
      strokeWidth: 12, // Thicker for emphasis
      className: 'gc-optimal'
    });
  }
  
  // Optimal window end to GC set (light blue)
  if (gcSetAngle !== optimalEndAngle) {
    arcs.push({
      path: createArcPath(optimalEndAngle, gcSetAngle, radius, centerX, centerY),
      color: '#87CEEB', // Light blue
      className: 'gc-visible'
    });
  }
  
  return arcs;
}