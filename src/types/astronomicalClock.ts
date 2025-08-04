/**
 * Type definitions for the Astronomical Clock component
 * Centralizes all clock-related interfaces and types for better maintainability
 */

import { AstronomicalEvents } from "../types/astronomy";

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
 * Props for the main AstronomicalClock component
 */
export interface AstronomicalClockProps {
  /** Astronomical events to display */
  events: AstronomicalEvents;
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
  | "sunset"
  | "sunrise"
  | "twilightEnd"
  | "twilightStart"
  | "moonrise"
  | "moonset"
  | "gcRise"
  | "gcSet"
  | "gcTransit"
  | "optimalViewing";

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
