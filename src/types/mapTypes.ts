/**
 * Comprehensive TypeScript types for map-related functionality
 */

// Basic coordinate types
export interface Point {
  x: number;
  y: number;
}

export interface NormalizedPoint extends Point {
  x: number; // 0-1 range
  y: number; // 0-1 range
}

export interface ScreenPoint extends Point {
  x: number; // screen pixels
  y: number; // screen pixels
}

export interface PercentagePoint extends Point {
  x: number; // 0-100 range
  y: number; // 0-100 range
}

// Geographic coordinate types
export interface GeographicCoordinate {
  lat: number; // latitude in degrees
  lng: number; // longitude in degrees
}

// Map state types
export interface MapTransformState {
  zoom: number;
  panX: number;
  panY: number;
}

export interface MapBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

// Component prop types
export interface MapImageProps {
  src: string;
  alt: string;
  zoom: number;
  panX: number;
  panY: number;
  panOffset: number; // -1 for left, 0 for primary, 1 for right
  isDragging: boolean;
  isPanning: boolean;
  isImageLoading: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchMove: (event: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export interface ZoomControlsProps {
  zoom: number;
  minZoom: number;
  maxZoom: number;
  zoomSpeed: number;
  onZoom: (delta: number) => void;
  isVisible: boolean;
}

export interface MarkerPosition {
  x: number; // percentage
  y: number; // percentage
}

export interface WorldMapMarker {
  id: string;
  lat: number;
  lng: number;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  title?: string;
  children?: React.ReactNode;
}

// Gesture and interaction types
export interface TouchPoint {
  x: number;
  y: number;
}

export interface GestureState {
  isDragging: boolean;
  isPanning: boolean;
  lastTouchDistance: number | null;
  lastTouchCenter: TouchPoint | null;
}

export interface GestureConfig {
  zoomSpeed?: number;
  dragThreshold?: number;
}

export interface TouchGestureInfo {
  distance: number;
  center: TouchPoint;
}

// Configuration types (re-exported from config for convenience)
export interface ZoomConfig {
  readonly MIN: number;
  readonly MAX: number;
  readonly SPEED: number;
  readonly TOUCH_SPEED_MULTIPLIER: number;
  readonly WHEEL_SPEED_MULTIPLIER: number;
}

export interface PanConfig {
  readonly WRAP_MIN: number;
  readonly WRAP_MAX: number;
  readonly WRAP_RANGE: number;
}

export interface MarkerBoundsConfig {
  readonly MIN_X: number;
  readonly MAX_X: number;
  readonly MIN_Y: number;
  readonly MAX_Y: number;
}

export interface ImageConfig {
  readonly BREAKPOINTS: {
    readonly MOBILE: number;
    readonly DESKTOP: number;
  };
  readonly RESIZE_DEBOUNCE_MS: number;
}

export interface AnimationConfig {
  readonly TRANSITION_DURATION: string;
  readonly TRANSITION_EASING: string;
}

// Event handler types
export type MouseEventHandler = (
  event: React.MouseEvent<HTMLDivElement>,
) => void;
export type TouchEventHandler = (event: React.TouchEvent) => void;
export type ZoomEventHandler = (
  delta: number,
  centerX?: number,
  centerY?: number,
) => void;
export type LocationChangeHandler = (
  location: GeographicCoordinate,
  isDragging?: boolean,
) => void;

// Coordinate transformation function types
export type ScreenToNormalizedConverter = (
  screenX: number,
  screenY: number,
) => NormalizedPoint;
export type NormalizedToScreenConverter = (
  normalizedX: number,
  normalizedY: number,
) => ScreenPoint;
export type NormalizedToCoordConverter = (
  x: number,
  y: number,
) => GeographicCoordinate;
export type CoordToNormalizedConverter = (
  lat: number,
  lng: number,
) => NormalizedPoint;
export type MarkerPositionCalculator = (
  normalizedX: number,
  normalizedY: number,
  customPanX: number,
) => MarkerPosition;

// Constraint and validation types
export type PanConstrainer = (
  newPanX: number,
  newPanY: number,
  zoom: number,
) => Point;
export type BoundsChecker = (point: Point, bounds: MapBounds) => boolean;
export type CoordinateWrapper = (x: number) => number;

// Hook return types
export interface MapStateHookReturn {
  zoom: number;
  panX: number;
  panY: number;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  setPanX: (panX: number) => void;
  setPanY: (panY: number) => void;
  setPan: (panX: number, panY: number) => void;
  resetState: () => void;
  constrainPan: PanConstrainer;
  config: {
    minZoom: number;
    maxZoom: number;
    initialZoom: number;
    initialPanX: number;
    initialPanY: number;
  };
}

export interface MapGesturesHookReturn extends GestureState {
  handleMouseDown: MouseEventHandler;
  handleTouchStart: TouchEventHandler;
  handleTouchMove: TouchEventHandler;
  handleTouchEnd: () => void;
}

// Utility class interface
export interface MapCoordinateSystemInterface {
  screenToNormalized(screenX: number, screenY: number): NormalizedPoint;
  normalizedToScreen(normalizedX: number, normalizedY: number): ScreenPoint;
  getMarkerPosition(
    normalizedX: number,
    normalizedY: number,
    panOffset?: number,
  ): MarkerPosition;
  constrainPan(newPanX: number, newPanY: number, zoom?: number): Point;
  updateState(zoom: number, panX: number, panY: number): void;
  getState(): MapTransformState;
}

// Error types
export class MapCoordinateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MapCoordinateError";
  }
}

export class MapConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MapConfigurationError";
  }
}

// Branded types for better type safety
export type Latitude = number & { readonly __brand: unique symbol };
export type Longitude = number & { readonly __brand: unique symbol };
export type ZoomLevel = number & { readonly __brand: unique symbol };
export type PanDistance = number & { readonly __brand: unique symbol };
export type ScreenPixel = number & { readonly __brand: unique symbol };
export type NormalizedCoordinate = number & { readonly __brand: unique symbol };
export type PercentageCoordinate = number & { readonly __brand: unique symbol };

// Type guards
export function isValidLatitude(value: number): value is Latitude {
  return value >= -90 && value <= 90;
}

export function isValidLongitude(value: number): value is Longitude {
  return value >= -180 && value <= 180;
}

export function isValidZoomLevel(
  value: number,
  minZoom: number,
  maxZoom: number,
): value is ZoomLevel {
  return value >= minZoom && value <= maxZoom;
}

export function isValidNormalizedCoordinate(
  value: number,
): value is NormalizedCoordinate {
  return value >= 0 && value <= 1;
}

// Union types
export type CursorState = "crosshair" | "grab" | "grabbing";
export type MapImageType = "primary" | "left-wrap" | "right-wrap";
export type InteractionMode = "drag" | "pan" | "zoom" | "idle";
export type LoadingState = "loading" | "loaded" | "error";

// Constant types
export type MapConstants = {
  readonly zoom: ZoomConfig;
  readonly pan: PanConfig;
  readonly markers: MarkerBoundsConfig;
  readonly images: ImageConfig;
  readonly animation: AnimationConfig;
};
