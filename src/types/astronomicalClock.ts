/**
 * Type definitions for the Astronomical Clock component
 * Centralizes all clock-related interfaces and types for better maintainability
 */

import { OptimalViewingWindow } from '../utils/optimalViewing';
import { Location } from './astronomy';

/**
 * Complete set of astronomical events for a given date and location
 * Used to provide all necessary data for clock visualization
 */
export interface AstronomicalEvents {
  /** Sunrise time */
  sunRise?: Date;
  /** Sunset time */
  sunSet?: Date;
  /** End of astronomical twilight (start of night) */
  astronomicalTwilightEnd?: Date;
  /** Start of astronomical twilight (end of night) */
  astronomicalTwilightStart?: Date;
  /** Moonrise time */
  moonRise?: Date;
  /** Moonset time */
  moonSet?: Date;
  /** Moon illumination percentage (0-100) */
  moonIllumination: number;
  /** Moon phase value (0-1) */
  moonPhase: number;
  /** Galactic Center rise time (when it reaches ≥10° altitude) */
  gcRise?: Date;
  /** Galactic Center set time (when it drops to ≤10° altitude) */
  gcSet?: Date;
  /** Galactic Center transit time (highest point in sky) */
  gcTransit?: Date;
  /** Maximum Galactic Center altitude in degrees */
  maxGcAltitude: number;
  /** Optimal viewing window with quality metrics */
  optimalWindow: OptimalViewingWindow;
}

/**
 * Individual event displayed on the clock face
 * Represents a single astronomical event with positioning and styling information
 */
export interface ClockEvent {
  /** Unique identifier for the event */
  id: string;
  /** Display title for the event */
  title: string;
  /** Event time */
  time: Date;
  /** Angular position on clock face (0-360 degrees, 0 = 12 o'clock) */
  angle: number;
  /** Icon name to display */
  icon: string;
  /** Tooltip content explaining the event */
  tooltip: string;
  /** CSS class for event-specific styling (sun, moon, gc, etc.) */
  eventClass?: string;
  /** Whether this event is temporally distant (>12 hours away) */
  isDistant: boolean;
  /** Adjusted radius for label positioning (to handle collisions) */
  adjustedRadius?: number;
  /** Additional icons for consolidated events */
  icons?: string[];
  /** Additional titles for consolidated events */
  titles?: string[];
}

/**
 * Parameters for generating SVG arc paths
 * Used by arc calculation utilities to create consistent arc rendering
 */
export interface ArcParams {
  /** Start angle in degrees (0 = 12 o'clock) */
  startAngle: number;
  /** End angle in degrees */
  endAngle: number;
  /** Arc radius from center */
  radius: number;
  /** Center X coordinate */
  centerX: number;
  /** Center Y coordinate */
  centerY: number;
  /** Arc color */
  color: string;
  /** CSS class name for styling */
  className: string;
  /** Arc opacity (0-1) */
  opacity?: number;
  /** Stroke width override */
  strokeWidth?: number;
}

/**
 * Generated SVG arc with path and styling information
 * Result of arc calculation ready for rendering
 */
export interface CalculatedArc {
  /** SVG path string */
  path: string;
  /** Arc color */
  color: string;
  /** CSS class name */
  className: string;
  /** Arc opacity (0-1) */
  opacity?: number;
  /** Stroke width */
  strokeWidth?: number;
}

/**
 * Configuration for hour markers on clock face
 * Defines positioning and styling for clock hour indicators
 */
export interface HourMarkerConfig {
  /** Angles for hour markers (degrees) */
  angles: readonly number[];
  /** Hour labels to display */
  hours: readonly string[];
  /** Radius for hour text positioning */
  textRadius: number;
  /** Inner radius for hour line */
  lineInnerRadius: number;
  /** Outer radius for hour line */
  lineOuterRadius: number;
}

/**
 * Clock positioning and sizing configuration
 * Centralizes layout calculations for consistent spacing
 */
export interface ClockDimensions {
  /** Total clock size (width/height) */
  size: number;
  /** Center X coordinate */
  centerX: number;
  /** Center Y coordinate */
  centerY: number;
  /** Base radius for arc calculations */
  baseRadius: number;
  /** Step size between arc layers */
  radiusStep: number;
  /** Sun arc radius */
  sunRadius: number;
  /** Moon arc radius */
  moonRadius: number;
  /** Galactic Center arc radius */
  gcRadius: number;
  /** Label positioning radius */
  labelRadius: number;
}

/**
 * Props for the main AstronomicalClock component
 */
export interface AstronomicalClockProps {
  /** Astronomical events to display */
  events: AstronomicalEvents;
  /** Geographic location for calculations */
  location: Location;
  /** Current date/time (defaults to now) */
  currentDate?: Date;
  /** Clock diameter in pixels */
  size?: number;
}

/**
 * Event types for categorizing astronomical events
 * Used for styling and tooltip generation
 */
export type EventType = 
  | 'sunset'
  | 'sunrise'
  | 'twilightEnd'
  | 'twilightStart'
  | 'moonrise'
  | 'moonset'
  | 'gcRise'
  | 'gcSet'
  | 'gcTransit'
  | 'optimalViewing';

/**
 * Event styling configuration
 * Maps event types to their visual representation
 */
export interface EventStyleConfig {
  /** Event type */
  type: EventType;
  /** Icon name */
  icon: string;
  /** CSS class for styling */
  className: string;
  /** Event color */
  color: string;
  /** Tooltip template */
  tooltipTemplate: string;
}

/**
 * Time range for event visibility calculations
 * Defines when events should be displayed with full vs reduced opacity
 */
export interface VisibilityTimeRange {
  /** Start of relevant time period (e.g., 6pm same day) */
  startTime: Date;
  /** End of relevant time period (e.g., 6am next day) */
  endTime: Date;
}

/**
 * Label positioning result
 * Contains calculated position for event labels around clock perimeter
 */
export interface LabelPosition {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
  /** Angle in degrees */
  angle: number;
  /** Distance from center */
  radius: number;
}