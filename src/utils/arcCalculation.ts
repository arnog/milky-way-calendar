import { type CalculatedArc } from '../types/astronomicalClock';
import { getColorFromCSSVariable } from '../config/clockConfig';

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
 * Create gradient arc by splitting into multiple segments
 */
function createGradientArc(
  startAngle: number,
  endAngle: number,
  radius: number,
  startColor: string,
  endColor: string,
  segments: number = 10,
  centerX: number = 200,
  centerY: number = 200,
  className: string = ''
): CalculatedArc[] {
  const arcs: CalculatedArc[] = [];
  const angleSpan = endAngle >= startAngle 
    ? endAngle - startAngle 
    : (360 - startAngle) + endAngle;
  const segmentAngle = angleSpan / segments;
  
  // Use centralized color mapping from clockConfig
  
  // Interpolate between two colors
  const interpolateColor = (start: string, end: string, factor: number): string => {
    const startColor = getColorFromCSSVariable(start);
    const endColor = getColorFromCSSVariable(end);
    
    // Convert hex to RGB
    const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };
    
    const rgbToHex = (r: number, g: number, b: number): string => {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };
    
    const startRgb = hexToRgb(startColor);
    const endRgb = hexToRgb(endColor);
    
    const r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * factor);
    const g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * factor);
    const b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * factor);
    
    return rgbToHex(r, g, b);
  };
  
  for (let i = 0; i < segments; i++) {
    const segmentStart = (startAngle + i * segmentAngle) % 360;
    const segmentEnd = (startAngle + (i + 1) * segmentAngle) % 360;
    const factor = i / (segments - 1);
    const color = interpolateColor(startColor, endColor, factor);
    
    arcs.push({
      path: createArcPath(segmentStart, segmentEnd, radius, centerX, centerY),
      color: color,
      className: className,
      opacity: 1
    });
  }
  
  return arcs;
}

/**
 * Create opacity fade arc by splitting into multiple segments with varying opacity
 */
function createOpacityFadeArc(
  startAngle: number,
  endAngle: number,
  radius: number,
  color: string,
  startOpacity: number,
  endOpacity: number,
  segments: number = 15,
  centerX: number = 200,
  centerY: number = 200,
  className: string = ''
): CalculatedArc[] {
  const arcs: CalculatedArc[] = [];
  const angleSpan = endAngle >= startAngle 
    ? endAngle - startAngle 
    : (360 - startAngle) + endAngle;
  const segmentAngle = angleSpan / segments;
  
  for (let i = 0; i < segments; i++) {
    const segmentStart = (startAngle + i * segmentAngle) % 360;
    const segmentEnd = (startAngle + (i + 1) * segmentAngle) % 360;
    
    // Use the midpoint of the segment for opacity calculation
    const factor = (i + 0.5) / segments;
    const opacity = startOpacity + (endOpacity - startOpacity) * factor;
    
    arcs.push({
      path: createArcPath(segmentStart, segmentEnd, radius, centerX, centerY),
      color: color,
      className: className,
      opacity: Math.max(0, Math.min(1, opacity))
    });
  }
  
  return arcs;
}

/**
 * Create color gradient arc by splitting into multiple segments with color interpolation
 */
function createColorGradientArc(
  startAngle: number,
  endAngle: number,
  radius: number,
  startColor: string,
  endColor: string,
  segments: number = 15,
  centerX: number = 200,
  centerY: number = 200,
  className: string = ''
): CalculatedArc[] {
  const arcs: CalculatedArc[] = [];
  const angleSpan = endAngle >= startAngle 
    ? endAngle - startAngle 
    : (360 - startAngle) + endAngle;
  const segmentAngle = angleSpan / segments;
  
  // Use centralized color mapping from clockConfig
  
  // Interpolate between two colors
  const interpolateColor = (start: string, end: string, factor: number): string => {
    const startColorHex = getColorFromCSSVariable(start);
    const endColorHex = getColorFromCSSVariable(end);
    
    // Convert hex to RGB
    const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };
    
    const rgbToHex = (r: number, g: number, b: number): string => {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };
    
    const startRgb = hexToRgb(startColorHex);
    const endRgb = hexToRgb(endColorHex);
    
    const r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * factor);
    const g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * factor);
    const b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * factor);
    
    return rgbToHex(r, g, b);
  };
  
  for (let i = 0; i < segments; i++) {
    const segmentStart = (startAngle + i * segmentAngle) % 360;
    const segmentEnd = (startAngle + (i + 1) * segmentAngle) % 360;
    
    // Use the midpoint of the segment for color calculation
    const factor = (i + 0.5) / segments;
    const color = interpolateColor(startColor, endColor, factor);
    
    arcs.push({
      path: createArcPath(segmentStart, segmentEnd, radius, centerX, centerY),
      color: color,
      className: className,
      opacity: 1
    });
  }
  
  return arcs;
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
): CalculatedArc[] {
  const arcs: CalculatedArc[] = [];
  
  // Sunset to astronomical twilight end (gradient from orange to dark blue)
  if (twilightEndAngle !== sunsetAngle) {
    arcs.push(...createGradientArc(
      sunsetAngle,
      twilightEndAngle,
      radius,
      'var(--sun-twilight)',
      'var(--sun-night)',
      30,
      centerX,
      centerY,
      'sun-twilight'
    ));
  }
  
  // Astronomical night (dark blue)
  if (twilightStartAngle !== twilightEndAngle) {
    arcs.push({
      path: createArcPath(twilightEndAngle, twilightStartAngle, radius, centerX, centerY),
      color: getColorFromCSSVariable('var(--sun-night)'),
      className: 'sun-night'
    });
  }
  
  // Astronomical twilight start to sunrise (gradient from dark blue to yellow)
  if (sunriseAngle !== twilightStartAngle) {
    arcs.push(...createGradientArc(
      twilightStartAngle,
      sunriseAngle,
      radius,
      'var(--sun-night)',
      'var(--sun-dawn)',
      30,
      centerX,
      centerY,
      'sun-dawn'
    ));
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
): CalculatedArc | null {
  if (moonriseAngle === moonsetAngle) {
    return null; // No moon visibility
  }
  
  // Make opacity proportional to illumination
  // Full moon (100%) = fully opaque (1.0)
  // New moon (0%) = minimum visible opacity (0.3 for better visibility)
  const opacity = Math.max(0.3, illumination);
  
  return {
    path: createArcPath(moonriseAngle, moonsetAngle, radius, centerX, centerY),
    color: getColorFromCSSVariable('var(--moon-arc)'),
    opacity: opacity,
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
): CalculatedArc[] {
  const arcs: CalculatedArc[] = [];
  
  // Calculate angles for timing offsets
  // 1 hour = 15 degrees, 20 minutes = 5 degrees (360 degrees / 24 hours / 3)
  const oneHourDegrees = 15;
  const twentyMinDegrees = 5;
  
  const fadeInEndAngle = (gcRiseAngle + oneHourDegrees) % 360;
  const fadeOutStartAngle = (gcSetAngle - oneHourDegrees + 360) % 360;
  
  const optimalExtendedStartAngle = (optimalStartAngle - twentyMinDegrees + 360) % 360;
  const optimalExtendedEndAngle = (optimalEndAngle + twentyMinDegrees) % 360;
  
  // GC rise with opacity fade in (0 to 1 opacity over 1 hour)
  arcs.push(...createOpacityFadeArc(
    gcRiseAngle,
    fadeInEndAngle,
    radius,
    getColorFromCSSVariable('var(--gc-visible)'),
    0, // Start transparent
    1, // End fully opaque
    15,
    centerX,
    centerY,
    'gc-visible'
  ));
  
  // Full opacity section (1 hour after rise to 20min before optimal start)
  if (optimalExtendedStartAngle !== fadeInEndAngle) {
    arcs.push({
      path: createArcPath(fadeInEndAngle, optimalExtendedStartAngle, radius, centerX, centerY),
      color: getColorFromCSSVariable('var(--gc-visible)'),
      opacity: 1,
      className: 'gc-visible'
    });
  }
  
  // Optimal viewing window with gradient transitions (extends 20min before/after)
  if (optimalExtendedEndAngle !== optimalExtendedStartAngle) {
    // Gradient fade in: GC color to optimal color (20min before optimal start)
    const fadeInGradient = createColorGradientArc(
      optimalExtendedStartAngle,
      optimalStartAngle,
      radius,
      'var(--gc-visible)', // Start with cyan
      'var(--gc-optimal)', // End with light blue
      10,
      centerX,
      centerY,
      'gc-optimal'
    );
    // Set stroke width for optimal window
    fadeInGradient.forEach(arc => arc.strokeWidth = 60);
    arcs.push(...fadeInGradient);
    
    // Core optimal window (solid optimal color, thicker)
    arcs.push({
      path: createArcPath(optimalStartAngle, optimalEndAngle, radius, centerX, centerY),
      color: getColorFromCSSVariable('var(--gc-optimal)'),
      opacity: Math.max(0.8, qualityScore), // Quality-based opacity
      strokeWidth: 60, // Thicker for emphasis
      className: 'gc-optimal'
    });
    
    // Gradient fade out: optimal color to GC color (20min after optimal end)
    const fadeOutGradient = createColorGradientArc(
      optimalEndAngle,
      optimalExtendedEndAngle,
      radius,
      'var(--gc-optimal)', // Start with light blue
      'var(--gc-visible)', // End with cyan
      10,
      centerX,
      centerY,
      'gc-optimal'
    );
    // Set stroke width for optimal window
    fadeOutGradient.forEach(arc => arc.strokeWidth = 60);
    arcs.push(...fadeOutGradient);
  }
  
  // Full opacity section (20min after optimal end to 1 hour before set)
  if (fadeOutStartAngle !== optimalExtendedEndAngle) {
    arcs.push({
      path: createArcPath(optimalExtendedEndAngle, fadeOutStartAngle, radius, centerX, centerY),
      color: getColorFromCSSVariable('var(--gc-visible)'),
      opacity: 1,
      className: 'gc-visible'
    });
  }
  
  // GC set with opacity fade out (1 to 0 opacity over 1 hour)
  arcs.push(...createOpacityFadeArc(
    fadeOutStartAngle,
    gcSetAngle,
    radius,
    getColorFromCSSVariable('var(--gc-visible)'),
    1, // Start fully opaque
    0, // End transparent
    15,
    centerX,
    centerY,
    'gc-visible'
  ));
  
  return arcs;
}