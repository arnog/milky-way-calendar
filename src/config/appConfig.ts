/**
 * Application-wide configuration constants
 *
 * This file centralizes all "magic numbers" and configuration values
 * used throughout the application for better maintainability and readability.
 */

export const APP_CONFIG = {
  /**
   * Search and Location Configuration
   */
  SEARCH: {
    /** Default search radius for finding dark sky sites (in kilometers) */
    DEFAULT_RADIUS_KM: 500,

    /** Progress update interval for search operations (in pixels processed) */
    PROGRESS_UPDATE_INTERVAL: 500,
  },

  /**
   * Default Location Settings
   */
  DEFAULT_LOCATION: {
    /** Default fallback location coordinates (Death Valley National Park) */
    COORDINATES: { lat: 36.5323, lng: -117.0794 },

    /** Default fallback location name */
    NAME: "Death Valley",
  },

  /**
   * UI Layout and Responsive Design
   */
  LAYOUT: {
    /** Mobile breakpoint for responsive design (in pixels) */
    MOBILE_BREAKPOINT: 480,

    /** Small screen padding (in pixels) */
    SMALL_SCREEN_PADDING: 32,

    /** Maximum width for small screens (in pixels) */
    SMALL_SCREEN_MAX_WIDTH: 350,

    /** Minimum width factor for larger screens (viewport percentage) */
    LARGE_SCREEN_MIN_WIDTH_FACTOR: 0.5,

    /** Minimum width for larger screens (in pixels) */
    LARGE_SCREEN_MIN_WIDTH: 500,

    /** Maximum width for larger screens (in pixels) */
    LARGE_SCREEN_MAX_WIDTH: 800,
  },

  /**
   * Astronomical Constants
   */
  ASTRONOMY: {
    /** Minimum Galactic Core altitude for quality photography (in degrees) */
    MIN_GC_ALTITUDE: 10,

    /** Sun altitude for astronomical twilight (in degrees) */
    ASTRONOMICAL_TWILIGHT_ANGLE: -18,

    /** Minutes per hour */
    MINUTES_PER_HOUR: 60,

    /** Milliseconds in a day (24 * 60 * 60 * 1000) */
    MS_PER_DAY: 24 * 60 * 60 * 1000,
  },

  /**
   * Quality Thresholds
   */
  QUALITY: {
    /** Minimum score for decent viewing conditions (0.0 - 1.0) */
    MIN_DECENT_VIEWING_SCORE: 0.3,

    /** Minimum score for quality viewing conditions (0.0 - 1.0) */
    MIN_QUALITY_VIEWING_SCORE: 0.5,

    /** Score threshold for bright moon interference (0.0 - 1.0) */
    BRIGHT_MOON_THRESHOLD: 0.6,

    /** Moon illumination threshold for interference (0.0 - 1.0) */
    MOON_INTERFERENCE_THRESHOLD: 0.5,

    /**
     * Length multiplier minimum value - prevents short viewing windows from being
     * penalized too harshly. Even a 30-minute window gets 70% of the base score
     * instead of 0%, making ratings more realistic for real-world conditions.
     */
    LENGTH_MULTIPLIER_MIN: 0.7,

    /**
     * Length multiplier scale factor - determines how much bonus longer windows get.
     * A 2-hour window gets the full bonus (0.7 + 0.3 = 1.0), while shorter windows
     * get proportionally less. This makes the system favor longer observation periods
     * while still being fair to shorter ones.
     */
    LENGTH_MULTIPLIER_SCALE: 0.3,

    /** Minimum observation window in minutes */
    MIN_OBSERVATION_WINDOW_MINUTES: 60,
  },

  /**
   * Dark Sky Classification
   */
  BORTLE: {
    /** Bortle scale threshold for recommending dark sky sites */
    RECOMMEND_DARK_SITE_THRESHOLD: 4,

    /** Maximum Bortle rating for excellent dark sky (Bortle 1-3) */
    EXCELLENT_DARK_SKY_MAX: 3.0,
  },

  /**
   * Error Messages and Labels
   */
  MESSAGES: {
    /** Error message when no dark sites are found */
    NO_DARK_SITES_FOUND:
      "No dark sky sites found within {radius}km of your location.",

    /** Generic search error message */
    SEARCH_ERROR: "Failed to find dark sites. Please try again.",
  },
} as const;

/**
 * Utility function to format error messages with dynamic values
 */
export function formatMessage(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
}

/**
 * Utility function to apply default location settings
 * Encapsulates the common pattern of setting default location, updating location, and setting loading state
 */
export function applyDefaultLocation(
  updateLocation: (
    location: { lat: number; lng: number },
    name?: string,
  ) => void,
  setIsLoading: (loading: boolean) => void,
): void {
  updateLocation(
    APP_CONFIG.DEFAULT_LOCATION.COORDINATES,
    APP_CONFIG.DEFAULT_LOCATION.NAME,
  );
  setIsLoading(false);
}
