import { RefObject } from "react";
import { PAN_CONFIG } from "../config/mapConfig";

/**
 * Coordinate system utilities for map transformations
 */

export interface Point {
  x: number;
  y: number;
}

export interface NormalizedPoint {
  x: number; // 0-1 range
  y: number; // 0-1 range
}

export interface ScreenPoint {
  x: number; // screen pixels
  y: number; // screen pixels
}

export interface MapTransformState {
  zoom: number;
  panX: number;
  panY: number;
}

/**
 * Map coordinate system class for handling transformations
 */
export class MapCoordinateSystem {
  constructor(
    private zoom: number,
    private panX: number,
    private panY: number,
    private containerRef: RefObject<HTMLDivElement>,
  ) {}

  /**
   * Convert screen coordinates to normalized coordinates (0-1 range)
   * accounting for zoom and pan transformations
   */
  screenToNormalized(screenX: number, screenY: number): NormalizedPoint {
    const container = this.containerRef.current;
    if (!container) return { x: 0, y: 0 };

    const rect = container.getBoundingClientRect();
    const relativeX = (screenX - rect.left) / rect.width;
    const relativeY = (screenY - rect.top) / rect.height;

    // Account for zoom and pan
    let x = 0.5 + (relativeX - 0.5) / this.zoom - this.panX;
    let y = 0.5 + (relativeY - 0.5 - this.panY) / this.zoom;

    // Handle horizontal wrapping: normalize x to 0-1 range
    x = ((x % 1) + 1) % 1;

    // Constrain y to valid range (no wrapping vertically)
    y = Math.max(0, Math.min(1, y));

    return { x, y };
  }

  /**
   * Convert normalized coordinates to screen coordinates
   */
  normalizedToScreen(normalizedX: number, normalizedY: number): ScreenPoint {
    const container = this.containerRef.current;
    if (!container) return { x: 0, y: 0 };

    const rect = container.getBoundingClientRect();

    // Reverse the transformation
    const adjustedX = 0.5 + this.zoom * (normalizedX - 0.5 + this.panX);
    const adjustedY = 0.5 + this.zoom * (normalizedY - 0.5) + this.panY;

    const screenX = adjustedX * rect.width + rect.left;
    const screenY = adjustedY * rect.height + rect.top;

    return { x: screenX, y: screenY };
  }

  /**
   * Get marker position for pan offset (used for wrapped map copies)
   * This applies the same transformations as the map images
   */
  getMarkerPosition(
    normalizedX: number,
    normalizedY: number,
    panOffset: number = 0,
  ): Point {
    // Start with the base normalized coordinates (0-1 range)
    // Convert to percentage coordinates
    let x = normalizedX * 100; // Convert to 0-100 range
    let y = normalizedY * 100;

    // Step 1: Apply translation (same as maps)
    const adjustedPanX = this.panX + panOffset;
    x += adjustedPanX * 100; // Same as map's translate(${adjustedPanX * 100}%, ...)

    // For Y: match map's pixel-based Y translation, converted to percentage
    y += (this.panY / this.zoom) * 100; // Same as map's ${(panY * containerHeight) / zoom}px converted to %

    // Step 2: Apply zoom scaling around center (50%, 50%) - same as maps
    // CSS transform order: scale() then translate() means we scale the final position
    x = (x - 50) * this.zoom + 50;
    y = (y - 50) * this.zoom + 50;

    return { x, y };
  }

  /**
   * Constrain pan values to valid ranges
   */
  constrainPan(
    newPanX: number,
    newPanY: number,
    zoom: number = this.zoom,
  ): Point {
    // For horizontal (X): Wrap the pan value to keep within -1 to 1 range
    // This ensures we always stay within the 3-map strip
    let constrainedPanX = newPanX;
    while (constrainedPanX > PAN_CONFIG.WRAP_MAX) {
      constrainedPanX -= PAN_CONFIG.WRAP_RANGE;
    }
    while (constrainedPanX < PAN_CONFIG.WRAP_MIN) {
      constrainedPanX += PAN_CONFIG.WRAP_RANGE;
    }

    // For vertical (Y): Constrain to prevent showing areas beyond map bounds
    if (zoom <= 1) {
      // At zoom level 1 or less, always center the map vertically (no gaps)
      return { x: constrainedPanX, y: 0 };
    } else {
      // When zoomed in, calculate maximum allowed pan distance
      // This prevents showing empty space beyond the map bounds
      const maxPanY = (zoom - 1) / 2;
      const minPanY = -(zoom - 1) / 2;
      const constrainedPanY = Math.max(minPanY, Math.min(maxPanY, newPanY));
      return { x: constrainedPanX, y: constrainedPanY };
    }
  }

  /**
   * Update the coordinate system state
   */
  updateState(zoom: number, panX: number, panY: number): void {
    this.zoom = zoom;
    this.panX = panX;
    this.panY = panY;
  }

  /**
   * Get current transformation state
   */
  getState(): MapTransformState {
    return {
      zoom: this.zoom,
      panX: this.panX,
      panY: this.panY,
    };
  }
}

/**
 * Factory function to create a coordinate system
 */
export function createMapCoordinateSystem(
  zoom: number,
  panX: number,
  panY: number,
  containerRef: RefObject<HTMLDivElement>,
): MapCoordinateSystem {
  return new MapCoordinateSystem(zoom, panX, panY, containerRef);
}

/**
 * Utility functions for coordinate calculations
 */
export const coordinateUtils = {
  /**
   * Calculate zoom center point from screen coordinates
   */
  getZoomCenter(
    centerX: number,
    centerY: number,
    containerRef: RefObject<HTMLDivElement>,
  ): Point {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };

    const rect = container.getBoundingClientRect();
    const zoomCenterX = (centerX - rect.left) / rect.width - 0.5;
    const zoomCenterY = (centerY - rect.top) / rect.height - 0.5;

    return { x: zoomCenterX, y: zoomCenterY };
  },

  /**
   * Calculate new pan values after zoom with center point
   */
  calculateZoomPan(
    currentPan: Point,
    zoomCenter: Point,
    oldZoom: number,
    newZoom: number,
  ): Point {
    if (newZoom <= 1) {
      return { x: 0, y: 0 }; // Center map when zoom is 1 or below
    }

    const zoomFactor = newZoom / oldZoom;
    const newPanX =
      (currentPan.x + zoomCenter.x * (oldZoom - newZoom)) / zoomFactor;
    const newPanY =
      (currentPan.y + zoomCenter.y * (oldZoom - newZoom)) / zoomFactor;

    return { x: newPanX, y: newPanY };
  },

  /**
   * Check if a point is within visible bounds
   */
  isPointInBounds(
    point: Point,
    bounds: { minX: number; maxX: number; minY: number; maxY: number },
  ) {
    return (
      point.x >= bounds.minX &&
      point.x <= bounds.maxX &&
      point.y >= bounds.minY &&
      point.y <= bounds.maxY
    );
  },

  /**
   * Wrap a horizontal coordinate to keep it in the 0-1 range
   */
  wrapHorizontalCoordinate(x: number): number {
    return ((x % 1) + 1) % 1;
  },
};
