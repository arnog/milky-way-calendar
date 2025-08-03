/**
 * Configuration constants for the Astronomical Clock component
 * Centralizes all magic numbers, colors, and sizing parameters for maintainability
 */

import { type EventStyleConfig, EventType } from '../types/astronomicalClock';

/**
 * Clock layout and sizing configuration
 */
export const CLOCK_CONFIG = {
  /** Default clock size in pixels */
  DEFAULT_SIZE: 600,
  
  /** Base radius as a fraction of clock size (0.28 = 28% of total size) */
  BASE_RADIUS_RATIO: 0.24,
  
  /** Step size between arc layers as a fraction of clock size */
  RADIUS_STEP_RATIO: 0.12,
  
  /** Label positioning radius offset as a fraction of clock size */
  LABEL_RADIUS_OFFSET_RATIO: 0.0,
  
  /** Hour text positioning offset as a fraction of clock size */
  HOUR_TEXT_OFFSET_RATIO: 0.12,
  
  /** Auto-refresh interval in milliseconds (2 minutes) */
  AUTO_REFRESH_INTERVAL: 2 * 60 * 1000,
  
  /** Moon phase display offset from center */
  MOON_PHASE_CENTER_OFFSET: {
    x: -20,
    y: 20,
    width: 40,
    height: 50
  }
} as const;

/**
 * Arc styling configuration
 */
export const ARC_CONFIG = {
  /** Default stroke width for arcs */
  DEFAULT_STROKE_WIDTH: 50,
  
  /** Emphasized stroke width for optimal viewing window */
  EMPHASIZED_STROKE_WIDTH: 60,
  
  /** Arc colors using CSS variables */
  COLORS: {
    SUN_TWILIGHT: 'var(--sun-twilight)',
    SUN_NIGHT: 'var(--sun-night)', 
    SUN_DAWN: 'var(--sun-dawn)',
    MOON_ARC: 'var(--moon-arc)',
    GC_VISIBLE: 'var(--gc-visible)',
    GC_OPTIMAL: 'var(--gc-optimal)',
    CURRENT_TIME: 'var(--accent)'
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
    DEFAULT: 1.0
  }
} as const;

/**
 * Hour marker configuration
 */
export const HOUR_MARKER_CONFIG = {
  /** Main hour positions (12, 3, 6, 9 o'clock) */
  MAIN_HOURS: {
    angles: [270, 0, 90, 180] as const,
    labels: ['21', '00', '03', '06'] as const
  },
  
  /** Line styling */
  LINE_STYLE: {
    stroke: 'var(--highlight)',
    strokeWidth: 2,
    opacity: 0.6
  },
  
  /** Text styling */
  TEXT_STYLE: {
    fontSize: 18,
    fontWeight: 600,
    fill: 'var(--highlight)',
    opacity: 0.8
  }
} as const;

/**
 * Event label configuration
 */
export const EVENT_LABEL_CONFIG = {
  /** Collision detection threshold in degrees (increased to prevent overlaps) */
  COLLISION_THRESHOLD: 45,
  
  /** Radius step size for collision layers as fraction of clock size */
  COLLISION_RADIUS_STEP: 0.03,
  
  /** Event label dimensions */
  DIMENSIONS: {
    width: 50,
    height: 50,
    iconSize: 16,
    fontSize: 10
  },
  
  /** Touch-friendly dimensions for mobile */
  TOUCH_DIMENSIONS: {
    width: 60,  // Larger touch target
    height: 60, // Larger touch target
    iconSize: 20,
    fontSize: 12
  },
  
  /** Visibility time boundaries */
  VISIBILITY: {
    /** Events before this hour (same day) get reduced opacity */
    DAY_START_HOUR: 18, // 6pm
    
    /** Events after this hour (next day) get reduced opacity */
    DAY_END_HOUR: 6 // 6am
  }
} as const;

/**
 * Current time indicator configuration
 */
export const TIME_INDICATOR_CONFIG = {
  /** Clock hand styling */
  HAND: {
    stroke: 'var(--accent)',
    strokeWidth: 3,
    opacity: 0.9
  },
  
  /** Center dot styling */
  CENTER_DOT: {
    fill: 'var(--accent)',
    radius: 4
  },
  
  /** Glow effect */
  GLOW: {
    filter: 'drop-shadow(0 0 4px rgba(110, 198, 255, 0.6))'
  }
} as const;

/**
 * Responsive breakpoints and adjustments
 */
export const RESPONSIVE_CONFIG = {
  /** Mobile breakpoint */
  MOBILE_BREAKPOINT: 768,
  
  /** Small mobile breakpoint */
  SMALL_MOBILE_BREAKPOINT: 480,
  
  /** Size adjustments for different screen sizes */
  MOBILE_ADJUSTMENTS: {
    hourTextFontSize: 14,
    eventTimeFontSize: 10,
    eventLabelFontSize: 10
  },
  
  SMALL_MOBILE_ADJUSTMENTS: {
    hourTextFontSize: 12,
    eventTimeFontSize: 9,
    eventLabelFontSize: 9
  }
} as const;

/**
 * Animation and transition configuration
 */
export const ANIMATION_CONFIG = {
  /** Default transition duration */
  DEFAULT_DURATION: '0.3s',
  
  /** Transition easing */
  DEFAULT_EASING: 'ease',
  
  /** Hover effects */
  HOVER: {
    opacity: 1,
    strokeWidthIncrease: 2,
    scaleTransform: 1.2
  },
  
  /** Reduced motion settings */
  REDUCED_MOTION: {
    transitionDuration: '0s'
  }
} as const;

/**
 * Event type styling configuration
 * Maps event types to their visual representation
 */
export const EVENT_STYLES: Record<EventType, EventStyleConfig> = {
  sunset: {
    type: 'sunset',
    icon: 'sunset',
    className: 'sunsetEvent',
    color: ARC_CONFIG.COLORS.SUN_TWILIGHT,
    tooltipTemplate: 'Civil twilight begins - sun dips below horizon, but sky remains bright for photography'
  },
  
  sunrise: {
    type: 'sunrise',
    icon: 'sunrise',
    className: 'sunriseEvent', 
    color: ARC_CONFIG.COLORS.SUN_DAWN,
    tooltipTemplate: 'Civil dawn ends - sun rises above horizon, photography session typically concludes'
  },
  
  twilightEnd: {
    type: 'twilightEnd',
    icon: 'night-rise',
    className: 'nightEvent',
    color: ARC_CONFIG.COLORS.SUN_NIGHT,
    tooltipTemplate: 'True darkness begins - sun reaches -18° below horizon, ideal for deep sky photography'
  },
  
  twilightStart: {
    type: 'twilightStart',
    icon: 'night-set',
    className: 'nightEvent',
    color: ARC_CONFIG.COLORS.SUN_NIGHT,
    tooltipTemplate: 'Darkness ends - sun reaches -18° below horizon, sky begins to brighten'
  },
  
  moonrise: {
    type: 'moonrise',
    icon: 'moonrise',
    className: 'moonEvent',
    color: ARC_CONFIG.COLORS.MOON_ARC,
    tooltipTemplate: 'Moon rises above horizon ({illumination}% illuminated) - may interfere with faint object photography'
  },
  
  moonset: {
    type: 'moonset',
    icon: 'moonset', 
    className: 'moonEvent',
    color: ARC_CONFIG.COLORS.MOON_ARC,
    tooltipTemplate: 'Moon sets below horizon - darker skies resume for improved contrast and faint object visibility'
  },
  
  gcRise: {
    type: 'gcRise',
    icon: 'galaxy-rise',
    className: 'gcEvent',
    color: ARC_CONFIG.COLORS.GC_VISIBLE,
    tooltipTemplate: 'Galactic Core reaches 10° above horizon - minimum altitude for quality Milky Way photography begins'
  },
  
  gcSet: {
    type: 'gcSet',
    icon: 'galaxy-set',
    className: 'gcEvent', 
    color: ARC_CONFIG.COLORS.GC_VISIBLE,
    tooltipTemplate: 'Galactic Core drops below 10° altitude - quality photography becomes challenging due to low elevation'
  },
  
  gcTransit: {
    type: 'gcTransit',
    icon: 'apex',
    className: 'gcEvent',
    color: ARC_CONFIG.COLORS.GC_VISIBLE,
    tooltipTemplate: 'Galactic Core reaches maximum altitude of {altitude}° - best time for overhead shots'
  },
  
  optimalViewing: {
    type: 'optimalViewing',
    icon: 'telescope',
    className: 'optimalEvent',
    color: ARC_CONFIG.COLORS.GC_OPTIMAL,
    tooltipTemplate: 'Best viewing conditions begin - {quality}% quality considering altitude, darkness, and moon interference'
  }
} as const;

/**
 * Performance optimization settings
 */
export const PERFORMANCE_CONFIG = {
  /** Memoization dependencies refresh threshold */
  MEMO_REFRESH_THRESHOLD: 1000, // 1 second
  
  /** SVG optimization settings */
  SVG_OPTIMIZATION: {
    /** Use CSS transforms instead of recalculating positions */
    USE_TRANSFORMS: true,
    
    /** Batch DOM updates */
    BATCH_UPDATES: true,
    
    /** Reduce re-renders by splitting layers */
    SPLIT_LAYERS: true
  }
} as const;

/**
 * Accessibility configuration
 */
export const ACCESSIBILITY_CONFIG = {
  /** ARIA live region update frequency */
  ARIA_UPDATE_FREQUENCY: 60000, // 1 minute
  
  /** Screen reader descriptions */
  DESCRIPTIONS: {
    CLOCK_MAIN: 'Astronomical clock showing {eventCount} events throughout the night. Current time: {currentTime}. Use tab to navigate through individual events.',
    EVENT_LIST: 'Tonight\'s astronomical events in chronological order: {eventSummary}',
    TIME_UPDATE: 'Current time: {currentTime}'
  },
  
  /** Focus and interaction settings */
  INTERACTION: {
    /** Minimum touch target size */
    MIN_TOUCH_TARGET: 44, // pixels
    
    /** Focus outline offset */
    FOCUS_OUTLINE_OFFSET: 2, // pixels
    
    /** Keyboard navigation support */
    KEYBOARD_SUPPORT: true
  }
} as const;

/**
 * Helper function to calculate derived values from base configuration
 */
export function calculateClockDimensions(size: number = CLOCK_CONFIG.DEFAULT_SIZE) {
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
    hourTextRadius: baseRadius - size * CLOCK_CONFIG.HOUR_TEXT_OFFSET_RATIO
  };
}

/**
 * Helper function to get hour marker configuration
 */
export function getHourMarkerConfig(dimensions: ReturnType<typeof calculateClockDimensions>) {
  return {
    angles: HOUR_MARKER_CONFIG.MAIN_HOURS.angles,
    hours: HOUR_MARKER_CONFIG.MAIN_HOURS.labels,
    textRadius: dimensions.hourTextRadius,
    lineInnerRadius: dimensions.sunRadius - dimensions.radiusStep,
    lineOuterRadius: dimensions.gcRadius + dimensions.radiusStep,
  };
}