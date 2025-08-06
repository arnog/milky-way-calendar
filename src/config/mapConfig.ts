/**
 * Map Configuration
 * Centralized configuration for WorldMap component and related utilities
 */

// Zoom configuration
export const ZOOM_CONFIG = {
  MIN: 1,
  MAX: 16,
  SPEED: 0.25,
  TOUCH_SPEED_MULTIPLIER: 0.005,
  WHEEL_SPEED_MULTIPLIER: 0.01,
} as const;

// Pan configuration
export const PAN_CONFIG = {
  // Horizontal wrapping bounds
  WRAP_MIN: -1,
  WRAP_MAX: 1,
  WRAP_RANGE: 2,
} as const;

// Gesture configuration
export const GESTURE_CONFIG = {
  DRAG_THRESHOLD: 3, // pixels
  TOUCH_TARGET_MIN_SIZE: 44, // pixels - WCAG AA minimum
} as const;

// Marker visibility bounds
export const MARKER_BOUNDS = {
  MIN_X: -10, // percentage
  MAX_X: 110, // percentage
  MIN_Y: 0, // percentage
  MAX_Y: 100, // percentage
} as const;

// Image loading configuration
export const IMAGE_CONFIG = {
  BREAKPOINTS: {
    MOBILE: 768,
    DESKTOP: 1920,
  },
  RESIZE_DEBOUNCE_MS: 300,
} as const;

// Animation configuration
export const ANIMATION_CONFIG = {
  TRANSITION_DURATION: "0.1s",
  TRANSITION_EASING: "ease-out",
} as const;

// Default map state
export const DEFAULT_MAP_STATE = {
  zoom: ZOOM_CONFIG.MIN,
  panX: 0,
  panY: 0,
} as const;

// Complete map configuration object
export const MAP_CONFIG = {
  zoom: ZOOM_CONFIG,
  pan: PAN_CONFIG,
  gestures: GESTURE_CONFIG,
  markers: MARKER_BOUNDS,
  images: IMAGE_CONFIG,
  animation: ANIMATION_CONFIG,
  defaultState: DEFAULT_MAP_STATE,
} as const;

// Type exports for configuration
export type ZoomConfig = typeof ZOOM_CONFIG;
export type PanConfig = typeof PAN_CONFIG;
export type GestureConfig = typeof GESTURE_CONFIG;
export type MarkerBounds = typeof MARKER_BOUNDS;
export type ImageConfig = typeof IMAGE_CONFIG;
export type AnimationConfig = typeof ANIMATION_CONFIG;
export type MapConfig = typeof MAP_CONFIG;

// Helper functions for configuration
export const getZoomConstraints = () => ({
  min: ZOOM_CONFIG.MIN,
  max: ZOOM_CONFIG.MAX,
});

export const getPanConstraints = (zoom: number) => {
  if (zoom <= 1) {
    return { minY: 0, maxY: 0 }; // No vertical panning at zoom 1
  }
  const maxPanY = (zoom - 1) / 2;
  return {
    minY: -maxPanY,
    maxY: maxPanY,
  };
};

export const isMarkerVisible = (x: number, y: number) => {
  return (
    x >= MARKER_BOUNDS.MIN_X &&
    x <= MARKER_BOUNDS.MAX_X &&
    y >= MARKER_BOUNDS.MIN_Y &&
    y <= MARKER_BOUNDS.MAX_Y
  );
};
