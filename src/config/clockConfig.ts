/**
 * Configuration constants for the Astronomical Clock component
 * Centralizes all magic numbers, colors, and sizing parameters for maintainability
 */

import { type EventStyleConfig, EventType } from "../types/astronomicalClock";

/**
 * Clock layout and sizing configuration
 */
export const CLOCK_CONFIG = {
  /** Default clock size in pixels */
  DEFAULT_SIZE: 600,

  /** Base radius as a fraction of clock size (0.28 = 28% of total size) */
  BASE_RADIUS_RATIO: 0.3,

  /** Step size between arc layers as a fraction of clock size */
  RADIUS_STEP_RATIO: 0.1,

  /** Label positioning radius offset as a fraction of clock size */
  LABEL_RADIUS_OFFSET_RATIO: 0,

  /** Hour text positioning offset as a fraction of clock size */
  HOUR_TEXT_OFFSET_RATIO: -0.19,

  /** Auto-refresh interval in milliseconds (2 minutes) */
  AUTO_REFRESH_INTERVAL: 2 * 60 * 1000,

  /** Moon phase display offset from center */
  MOON_PHASE_CENTER_OFFSET: {
    x: -20,
    y: 20,
    width: 40,
    height: 50,
  },
} as const;

/**
 * Arc styling configuration
 */
export const ARC_CONFIG = {
  /** Default stroke width for arcs */
  DEFAULT_STROKE_WIDTH: 50,

  /** Emphasized stroke width for optimal viewing window */
  EMPHASIZED_STROKE_WIDTH: 20,

  /** Arc colors using CSS variables */
  COLORS: {
    SUN_TWILIGHT: "var(--sun-twilight)",
    SUN_NIGHT: "var(--sun-night)",
    SUN_DAWN: "var(--sun-dawn)",
    MOON_ARC: "var(--moon-arc)",
    GC_VISIBLE: "var(--gc-visible)",
    GC_OPTIMAL: "var(--gc-optimal)",
    CURRENT_TIME: "var(--accent)",
  },

  /** Opacity settings */
  OPACITY: {
    /** Minimum moon arc opacity for visibility */
    MIN_MOON_OPACITY: 0.2,

    /** Minimum optimal window opacity */
    MIN_OPTIMAL_OPACITY: 0.4,

    /** Distant event opacity reduction */
    DISTANT_EVENT: 0.4,

    /** Default arc opacity */
    DEFAULT: 1.0,
  },
} as const;

/**
 * Hour marker configuration
 */
export const HOUR_MARKER_CONFIG = {
  /** Main hour positions (12, 3, 6, 9 o'clock) */
  MAIN_HOURS: {
    angles: [270, 300, 330, 0, 30, 60, 90, 120, 150, 180, 210, 240] as const,
    labels: [
      "21",
      "22",
      "23",
      "00",
      "01",
      "02",
      "03",
      "04",
      "05",
      "18/06",
      "19",
      "20",
    ] as const,
  },

  /** Line styling */
  LINE_STYLE: {
    stroke: "var(--neutral-600)",
    strokeWidth: 2,
    opacity: 0.6,
  },

  /** Text styling */
  TEXT_STYLE: {
    fontSize: 18,
    fontWeight: 600,
    fill: "var(--neutral-600)",
    opacity: 0.8,
  },
} as const;

/**
 * Event label configuration
 */
export const EVENT_LABEL_CONFIG = {
  /** Event label dimensions */
  DIMENSIONS: {
    width: 50,
    height: 50,
    iconSize: 16,
    fontSize: 10,
  },

  /** Touch-friendly dimensions for mobile */
  TOUCH_DIMENSIONS: {
    width: 60, // Larger touch target
    height: 60, // Larger touch target
    iconSize: 20,
    fontSize: 12,
  },

  /** Visibility time boundaries */
  VISIBILITY: {
    /** Events before this hour (same day) get reduced opacity */
    DAY_START_HOUR: 18, // 6pm

    /** Events after this hour (next day) get reduced opacity */
    DAY_END_HOUR: 6, // 6am
  },
} as const;

/**
 * Event type styling configuration
 * Maps event types to their visual representation
 */
export const EVENT_STYLES: Record<EventType, EventStyleConfig> = {
  sunset: {
    type: "sunset",
    icon: "sunset",
    className: "sunsetEvent",
    color: ARC_CONFIG.COLORS.SUN_TWILIGHT,
    tooltipTemplate:
      "Civil twilight begins - sun dips below horizon, but sky remains bright for photography",
  },

  sunrise: {
    type: "sunrise",
    icon: "sunrise",
    className: "sunriseEvent",
    color: ARC_CONFIG.COLORS.SUN_DAWN,
    tooltipTemplate:
      "Civil dawn ends - sun rises above horizon, photography session typically concludes",
  },

  twilightEnd: {
    type: "twilightEnd",
    icon: "night-rise",
    className: "nightEvent",
    color: ARC_CONFIG.COLORS.SUN_NIGHT,
    tooltipTemplate:
      "True darkness begins - sun reaches -18° below horizon, ideal for deep sky photography",
  },

  twilightStart: {
    type: "twilightStart",
    icon: "night-set",
    className: "nightEvent",
    color: ARC_CONFIG.COLORS.SUN_NIGHT,
    tooltipTemplate:
      "Darkness ends - sun reaches -18° below horizon, sky begins to brighten",
  },

  moonrise: {
    type: "moonrise",
    icon: "moonrise",
    className: "moonEvent",
    color: ARC_CONFIG.COLORS.MOON_ARC,
    tooltipTemplate:
      "Moon rises above horizon ({illumination}% illuminated) - may interfere with faint object photography",
  },

  moonset: {
    type: "moonset",
    icon: "moonset",
    className: "moonEvent",
    color: ARC_CONFIG.COLORS.MOON_ARC,
    tooltipTemplate:
      "Moon sets below horizon - darker skies resume for improved contrast and faint object visibility",
  },

  gcRise: {
    type: "gcRise",
    icon: "galaxy-rise",
    className: "gcEvent",
    color: ARC_CONFIG.COLORS.GC_VISIBLE,
    tooltipTemplate:
      "Galactic Core reaches 10° above horizon - minimum altitude for quality Milky Way photography begins",
  },

  gcSet: {
    type: "gcSet",
    icon: "galaxy-set",
    className: "gcEvent",
    color: ARC_CONFIG.COLORS.GC_VISIBLE,
    tooltipTemplate:
      "Galactic Core drops below 10° altitude - quality photography becomes challenging due to low elevation",
  },

  gcTransit: {
    type: "gcTransit",
    icon: "apex",
    className: "gcEvent",
    color: ARC_CONFIG.COLORS.GC_VISIBLE,
    tooltipTemplate:
      "Galactic Core reaches maximum altitude of {altitude}° - best time for overhead shots",
  },

  optimalViewing: {
    type: "optimalViewing",
    icon: "telescope",
    className: "optimalEvent",
    color: ARC_CONFIG.COLORS.GC_OPTIMAL,
    tooltipTemplate:
      "Best viewing conditions begin - {quality}% quality considering altitude, darkness, and moon interference",
  },
} as const;

/**
 * Helper function to get CSS variable values from the DOM
 * Takes a token name (e.g., 'sun-night') and returns the computed CSS variable value
 *
 * @param token - CSS variable name without '--' prefix (e.g., 'sun-night', 'gc-visible')
 * @returns The computed CSS variable value from the DOM, or a fallback color
 */
export function getColorFromCSSVariable(token: string): string {
  // Handle both formats: 'sun-night' or 'var(--sun-night)'
  let cssVarName: string;

  if (token.startsWith("var(--")) {
    // Extract token from var(--token) format
    cssVarName = token.slice(4, -1); // Remove 'var(--' and ')'
  } else if (token.startsWith("--")) {
    // Remove leading '--' if present
    cssVarName = token.slice(2);
  } else {
    // Plain token name
    cssVarName = token;
  }

  // Try to get the actual CSS variable value from the DOM
  if (typeof document !== "undefined") {
    const computed = getComputedStyle(document.documentElement);
    const value = computed.getPropertyValue(`--${cssVarName}`).trim();

    if (value) {
      return value;
    }
  }

  console.error(
    `CSS variable --${cssVarName} not found, returning fallback color`,
  );

  return "#ffffff"; // White as ultimate fallback
}

/**
 * Helper function to calculate derived values from base configuration
 */
export function calculateClockDimensions(
  size: number = CLOCK_CONFIG.DEFAULT_SIZE,
) {
  const baseRadius = size * CLOCK_CONFIG.BASE_RADIUS_RATIO;
  const radiusStep = size * CLOCK_CONFIG.RADIUS_STEP_RATIO;

  return {
    size,
    centerX: size / 2,
    centerY: size / 2,
    baseRadius,
    radiusStep,
    sunRadius: baseRadius - radiusStep,
    moonRadius: baseRadius,
    gcRadius: baseRadius + radiusStep,
    labelRadius: baseRadius,
    hourTextRadius: baseRadius - size * CLOCK_CONFIG.HOUR_TEXT_OFFSET_RATIO,
  };
}

/**
 * Helper function to get hour marker configuration
 */
export function getHourMarkerConfig(
  dimensions: ReturnType<typeof calculateClockDimensions>,
) {
  return {
    angles: HOUR_MARKER_CONFIG.MAIN_HOURS.angles,
    hours: HOUR_MARKER_CONFIG.MAIN_HOURS.labels,
    textRadius: dimensions.hourTextRadius,
    lineInnerRadius: dimensions.sunRadius - dimensions.radiusStep,
    lineOuterRadius: dimensions.gcRadius + dimensions.radiusStep,
  };
}
