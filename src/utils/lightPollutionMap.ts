/**
 * Light Pollution Map Processing Utilities
 *
 * This module handles processing of the world light pollution map to find
 * the nearest dark sky location for a given coordinate.
 */

import { type SpecialLocation } from "./locations";
import { APP_CONFIG } from "../config/appConfig";

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface PixelCoordinate {
  x: number;
  y: number;
}

export interface DarkSiteResult {
  coordinate: Coordinate;
  distance: number; // in kilometers
  bortleScale: number;
  nearestKnownSite?: {
    name: string;
    fullName: string;
    coordinate: Coordinate;
    distance: number; // distance from found dark site to known site
  };
}

export interface MultipleDarkSitesResult {
  primary: DarkSiteResult;
  alternatives: DarkSiteResult[];
}

/**
 * Calculate geodesic distance between two coordinates using Haversine formula
 */
function haversineDistance(
  coord1: Coordinate,
  coord2: Coordinate
): number {
  const lat1Rad = (coord1.lat * Math.PI) / 180;
  const lat2Rad = (coord2.lat * Math.PI) / 180;
  const deltaLatRad = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const deltaLngRad = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLngRad / 2) *
      Math.sin(deltaLngRad / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

// Earth's radius in kilometers
const EARTH_RADIUS_KM = 6371;

/**
 * Convert latitude/longitude to pixel coordinates in equirectangular projection
 * The light pollution map covers -65° to +75° latitude (140° total span)
 */
export function coordToPixel(
  coord: Coordinate,
  imageWidth: number,
  imageHeight: number
): PixelCoordinate {
  // Map coverage: -65° to +75° latitude, -180° to +180° longitude
  const MAP_LAT_MIN = -65;
  const MAP_LAT_MAX = 75;
  const MAP_LAT_SPAN = MAP_LAT_MAX - MAP_LAT_MIN; // 140°

  const x = ((coord.lng + 180) / 360) * imageWidth;
  const y = ((MAP_LAT_MAX - coord.lat) / MAP_LAT_SPAN) * imageHeight;

  const pixelX = Math.round(Math.max(0, Math.min(imageWidth - 1, x)));
  const pixelY = Math.round(Math.max(0, Math.min(imageHeight - 1, y)));

  return {
    x: pixelX,
    y: pixelY,
  };
}

/**
 * Convert pixel coordinates back to latitude/longitude
 * The light pollution map covers -65° to +75° latitude (140° total span)
 */
export function pixelToCoord(
  pixel: PixelCoordinate,
  imageWidth: number,
  imageHeight: number
): Coordinate {
  // Map coverage: -65° to +75° latitude, -180° to +180° longitude
  const MAP_LAT_MIN = -65;
  const MAP_LAT_MAX = 75;
  const MAP_LAT_SPAN = MAP_LAT_MAX - MAP_LAT_MIN; // 140°

  const lng = (pixel.x / imageWidth) * 360 - 180;
  const lat = MAP_LAT_MAX - (pixel.y / imageHeight) * MAP_LAT_SPAN;

  return { lat, lng };
}

/**
 * Convert latitude/longitude to normalized coordinates (0-1) for display positioning
 * This is used for positioning markers on the map UI (not for pixel-level operations)
 */
export function coordToNormalized(
  lat: number,
  lng: number
): { x: number; y: number } {
  // Map coverage: -65° to +75° latitude, -180° to +180° longitude
  const MAP_LAT_MIN = -65;
  const MAP_LAT_MAX = 75;
  const MAP_LAT_SPAN = MAP_LAT_MAX - MAP_LAT_MIN; // 140°

  const x = (lng + 180) / 360; // 0 to 1
  const y = (MAP_LAT_MAX - lat) / MAP_LAT_SPAN; // 0 to 1

  return { x, y };
}

/**
 * Convert normalized coordinates (0-1) back to latitude/longitude
 * This is used for interpreting click positions on the map UI
 */
export function normalizedToCoord(
  x: number,
  y: number
): { lat: number; lng: number } {
  // Map coverage: -65° to +75° latitude, -180° to +180° longitude
  const MAP_LAT_MIN = -65;
  const MAP_LAT_MAX = 75;
  const MAP_LAT_SPAN = MAP_LAT_MAX - MAP_LAT_MIN; // 140°

  const lng = x * 360 - 180;
  const lat = MAP_LAT_MAX - y * MAP_LAT_SPAN;

  return { lat, lng };
}



/**
 * Grayscale to Bortle scale lookup for the optimized grayscale format
 * This replaces the RGB colormap with a direct grayscale-to-Bortle mapping
 * for better performance and smaller file size.
 */
const GRAYSCALE_TO_BORTLE = new Map([
  [0, 9],     // Black (water/no-data)
  [10, 1],    // Pristine dark sky
  [20, 1.5],  // Excellent dark sky
  [30, 2],    // Typical dark sky
  [40, 2.5],  // Rural sky
  [50, 3],    // Rural/suburban transition
  [70, 3.5],  // Suburban sky
  [90, 4],    // Suburban/urban transition
  [110, 4.5], // Light suburban sky
  [130, 5],   // Suburban sky
  [150, 5.5], // Bright suburban sky
  [170, 6],   // Bright suburban sky
  [190, 6.5], // Suburban/urban transition
  [210, 7],   // Urban sky
  [230, 7.5], // City sky
  [240, 8],   // Inner city sky
]);

/**
 * Legacy RGB colormap - kept for reference and any remaining RGB processing
 * This is now only used for fallback scenarios or debugging
 */
const LIGHT_POLLUTION_COLORMAP = [
  // [R, G, B, magnitude_per_arcsec_min, magnitude_per_arcsec_max, bortle_scale]
  [8, 8, 8, 22.0, 21.99, 1],
  [16, 16, 16, 21.99, 21.95, 1.5],
  [24, 24, 24, 21.95, 21.91, 2],
  [32, 32, 32, 21.91, 21.87, 2.5],
  [48, 48, 48, 21.87, 21.81, 3],
  [0, 0, 128, 21.81, 21.69, 3.5],
  [0, 0, 255, 21.69, 21.51, 4],
  [0, 128, 0, 21.51, 21.25, 4.5],
  [0, 255, 0, 21.25, 20.91, 5],
  [128, 128, 0, 20.91, 20.49, 5.5],
  [255, 255, 0, 20.49, 20.02, 6],
  [255, 128, 0, 20.02, 19.5, 6.5],
  [255, 64, 0, 19.5, 18.95, 7],
  [255, 0, 0, 18.95, 18.38, 7.5],
  [255, 255, 255, 18.38, 17.8, 8],
  [192, 192, 192, 17.8, 0, 9],
];

/**
 * Convert grayscale value to Bortle scale using the optimized lookup
 * This is the primary function for the new grayscale format
 */
export function grayscaleToBortleScale(grayValue: number): number {
  return GRAYSCALE_TO_BORTLE.get(grayValue) || 9; // Default to worst case if not found
}

/**
 * Convert RGB values to Bortle scale using the legacy colorbar mapping
 * This is kept for backward compatibility and fallback scenarios
 */
export function rgbToBortleScale(r: number, g: number, b: number): number {
  // Pure black (0,0,0) represents water/no-data areas, not dark sky
  if (r === 0 && g === 0 && b === 0) {
    return 9;
  }

  // Find the closest color match in the colormap
  let minDistance = Infinity;
  let bestMatch = LIGHT_POLLUTION_COLORMAP[LIGHT_POLLUTION_COLORMAP.length - 1];

  for (const colorEntry of LIGHT_POLLUTION_COLORMAP) {
    const [mapR, mapG, mapB] = colorEntry;
    const distance = Math.sqrt(
      (r - mapR) ** 2 + (g - mapG) ** 2 + (b - mapB) ** 2
    );

    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = colorEntry;
    }
  }

  return bestMatch[5] as number;
}

/**
 * Check if a Bortle scale value represents good dark sky conditions
 * Bortle 1-3 are considered good for Milky Way photography
 */
export function isDarkSky(bortleScale: number): boolean {
  return bortleScale <= APP_CONFIG.BORTLE.EXCELLENT_DARK_SKY_MAX; // Pristine to good dark sky (Bortle 1-3)
}

/**
 * Check if a coordinate is too close to a major city or populated area
 */
export function isTooCloseToCity(
  coordinate: Coordinate,
  cities: Array<(string | number)[]>,
  minDistanceKm: number = 50
): boolean {
  for (const city of cities) {
    const cityCoord = { lat: city[2] as number, lng: city[3] as number };
    const distance = haversineDistance(coordinate, cityCoord);

    if (distance < minDistanceKm) {
      return true;
    }
  }
  return false;
}

/**
 * Validate that a coordinate represents a legitimate dark site
 */
export function isValidDarkSite(
  coordinate: Coordinate,
  bortleScale: number,
  cities?: Array<(string | number)[]>
): boolean {
  // Must meet Bortle scale criteria
  if (!isDarkSky(bortleScale)) {
    return false;
  }

  // Must not be too close to major cities
  if (cities && isTooCloseToCity(coordinate, cities)) {
    return false;
  }

  return true;
}

/**
 * Load and process the light pollution map image
 */
export async function loadLightPollutionMap(): Promise<{
  imageData: ImageData;
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      resolve({
        imageData,
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = () => {
      reject(new Error("Failed to load light pollution map"));
    };

    // Use the optimized grayscale version for better performance
    img.src = "/world2024B-lg-grayscale.png";
  });
}

/**
 * Get grayscale pixel data at specific coordinates (optimized for grayscale format)
 */
export function getGrayscalePixelData(
  imageData: ImageData,
  pixel: PixelCoordinate
): number {
  const index = (pixel.y * imageData.width + pixel.x) * 4;
  // For grayscale images, R, G, B channels are identical, so we just read R
  return imageData.data[index];
}

/**
 * Get pixel data at specific coordinates (legacy RGB format)
 */
export function getPixelData(
  imageData: ImageData,
  pixel: PixelCoordinate
): { r: number; g: number; b: number; a: number } {
  const index = (pixel.y * imageData.width + pixel.x) * 4;

  return {
    r: imageData.data[index],
    g: imageData.data[index + 1],
    b: imageData.data[index + 2],
    a: imageData.data[index + 3],
  };
}

/**
 * Priority queue implementation for Dijkstra's algorithm
 */
class PriorityQueue<T> {
  private items: Array<{ item: T; priority: number }> = [];

  enqueue(item: T, priority: number): void {
    this.items.push({ item, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): T | undefined {
    return this.items.shift()?.item;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

/**
 * Find the nearest known dark site location to a coordinate
 */
export function findNearestKnownSite(
  targetCoord: Coordinate,
  knownSites: ReadonlyArray<SpecialLocation> // DARK_SITES format: [fullName, shortName, lat, lng, optional slug]
): {
  name: string;
  fullName: string;
  coordinate: Coordinate;
  distance: number;
} | null {
  let nearest = null;
  let minDistance = Infinity;

  for (const site of knownSites) {
    const siteCoord = { lat: site[2] as number, lng: site[3] as number };
    const distance = haversineDistance(targetCoord, siteCoord);

    if (distance < minDistance) {
      minDistance = distance;
      nearest = {
        name: site[1] as string, // short name
        fullName: site[0] as string, // full name
        coordinate: siteCoord,
        distance,
      };
    }
  }

  return nearest;
}

/**
 * Calculate bearing (direction) from one coordinate to another in degrees
 */
export function calculateBearing(from: Coordinate, to: Coordinate): number {
  const lat1Rad = (from.lat * Math.PI) / 180;
  const lat2Rad = (to.lat * Math.PI) / 180;
  const deltaLngRad = ((to.lng - from.lng) * Math.PI) / 180;

  const y = Math.sin(deltaLngRad) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLngRad);

  const bearingRad = Math.atan2(y, x);
  const bearingDeg = (bearingRad * 180) / Math.PI;

  return (bearingDeg + 360) % 360; // Normalize to 0-360
}

/**
 * Find the nearest dark sky location using modified Dijkstra's algorithm
 */
export async function findNearestDarkSky(
  startCoord: Coordinate,
  maxDistance: number = APP_CONFIG.SEARCH.DEFAULT_RADIUS_KM, // Maximum search distance in km
  onProgress?: (progress: number) => void,
  knownSites?: ReadonlyArray<SpecialLocation> // Optional known sites for secondary location
): Promise<DarkSiteResult | null> {
  try {
    const { imageData, width, height } = await loadLightPollutionMap();

    const startPixel = coordToPixel(startCoord, width, height);
    const visited = new Set<string>();
    const queue = new PriorityQueue<{
      pixel: PixelCoordinate;
      distance: number;
    }>();

    // Start with the initial pixel
    queue.enqueue({ pixel: startPixel, distance: 0 }, 0);

    const maxPixelDistance = Math.round(
      ((maxDistance / EARTH_RADIUS_KM) * Math.max(width, height)) /
        (2 * Math.PI)
    );
    let processedPixels = 0;
    const totalEstimatedPixels = Math.PI * maxPixelDistance * maxPixelDistance;

    while (!queue.isEmpty()) {
      const current = queue.dequeue();
      if (!current) break;

      const { pixel } = current;
      const key = `${pixel.x},${pixel.y}`;

      if (visited.has(key)) continue;
      visited.add(key);

      processedPixels++;
      if (onProgress && processedPixels % 1000 === 0) {
        onProgress(Math.min(processedPixels / totalEstimatedPixels, 0.95));
      }

      // Check if current pixel represents dark sky
      const grayValue = getGrayscalePixelData(imageData, pixel);
      const bortleScale = grayscaleToBortleScale(grayValue);
      const coord = pixelToCoord(pixel, width, height);

      // Optional debug logging (can be enabled for troubleshooting)
      // if (Math.abs(startCoord.lat - 34.0522) < 0.01 && Math.abs(startCoord.lng - (-118.2437)) < 0.01) {
      //   const distance = haversineDistance(startCoord, coord);
      //   if (distance < 5) { // Within 5km of LA center
      //     console.log(`DEBUG LA pixel at (${coord.lat.toFixed(4)}, ${coord.lng.toFixed(4)}):`, {
      //       distance: distance.toFixed(1) + 'km',
      //       pixelCoord: `(${pixel.x}, ${pixel.y})`,
      //       rgb: `R${pixelData.r} G${pixelData.g} B${pixelData.b}`,
      //       bortleScale,
      //       isDarkSky: isDarkSky(bortleScale)
      //     });
      //   }
      // }

      // Skip pure black pixels (water/no-data areas)
      if (grayValue === 0) {
        continue; // Skip this pixel
      }

      if (isDarkSky(bortleScale)) {
        const actualDistance = haversineDistance(startCoord, coord);

        // Optional debug logging for dark sky findings
        // console.log(`DEBUG: Found dark sky at (${coord.lat.toFixed(4)}, ${coord.lng.toFixed(4)}):`, {
        //   distance: actualDistance.toFixed(1) + 'km',
        //   bortleScale,
        //   rgb: `R${pixelData.r} G${pixelData.g} B${pixelData.b}`,
        //   startCoord: `(${startCoord.lat.toFixed(4)}, ${startCoord.lng.toFixed(4)})`
        // });

        if (onProgress) onProgress(1);

        const result: DarkSiteResult = {
          coordinate: coord,
          distance: actualDistance,
          bortleScale,
        };

        // Find nearest known site if provided
        if (knownSites) {
          const nearestKnown = findNearestKnownSite(coord, knownSites);
          if (nearestKnown) {
            result.nearestKnownSite = nearestKnown;
          }
        }

        return result;
      }

      // Add neighboring pixels to queue
      const neighbors = [
        { x: pixel.x - 1, y: pixel.y },
        { x: pixel.x + 1, y: pixel.y },
        { x: pixel.x, y: pixel.y - 1 },
        { x: pixel.x, y: pixel.y + 1 },
        // Add diagonal neighbors for better coverage
        { x: pixel.x - 1, y: pixel.y - 1 },
        { x: pixel.x + 1, y: pixel.y - 1 },
        { x: pixel.x - 1, y: pixel.y + 1 },
        { x: pixel.x + 1, y: pixel.y + 1 },
      ];

      for (const neighbor of neighbors) {
        if (
          neighbor.x >= 0 &&
          neighbor.x < width &&
          neighbor.y >= 0 &&
          neighbor.y < height
        ) {
          const neighborKey = `${neighbor.x},${neighbor.y}`;
          if (!visited.has(neighborKey)) {
            const neighborCoord = pixelToCoord(neighbor, width, height);
            const neighborDistance = haversineDistance(
              startCoord,
              neighborCoord
            );

            if (neighborDistance <= maxDistance) {
              // Priority is distance - closer pixels are processed first
              queue.enqueue(
                { pixel: neighbor, distance: neighborDistance },
                neighborDistance
              );
            }
          }
        }
      }
    }

    if (onProgress) onProgress(1);
    return null; // No dark sky found within range
  } catch (error) {
    console.error("Error finding nearest dark sky:", error);
    throw error;
  }
}

/**
 * Get the Bortle scale rating for a specific location
 */
export async function getBortleRatingForLocation(
  coord: Coordinate
): Promise<number | null> {
  try {
    const { imageData, width, height } = await loadLightPollutionMap();
    const pixel = coordToPixel(coord, width, height);
    const grayValue = getGrayscalePixelData(imageData, pixel);

    // Skip pure black pixels (water/no-data areas)
    if (grayValue === 0) {
      return null;
    }

    return grayscaleToBortleScale(grayValue);
  } catch (error) {
    console.error("Error getting Bortle rating:", error);
    return null;
  }
}

/**
 * Find the darkest (lowest) Bortle scale value within a given radius of a coordinate
 */
export async function findDarkestBortleInRadius(
  centerCoord: Coordinate,
  radiusKm: number = 10
): Promise<number | null> {
  try {
    const { imageData, width, height } = await loadLightPollutionMap();
    
    // Convert radius to approximate pixel distance
    const pixelsPerDegree = width / 360; // Approximate for longitude
    const radiusDegrees = radiusKm / (111.32 * Math.cos((centerCoord.lat * Math.PI) / 180)); // Account for latitude
    const radiusPixels = Math.ceil(radiusDegrees * pixelsPerDegree);
    
    const centerPixel = coordToPixel(centerCoord, width, height);
    let darkestBortle = Infinity;
    let validPixelsFound = 0;
    
    // Search in a square around the center, then filter by actual distance
    for (let dx = -radiusPixels; dx <= radiusPixels; dx++) {
      for (let dy = -radiusPixels; dy <= radiusPixels; dy++) {
        const testPixel = {
          x: centerPixel.x + dx,
          y: centerPixel.y + dy
        };
        
        // Check bounds
        if (testPixel.x < 0 || testPixel.x >= width || testPixel.y < 0 || testPixel.y >= height) {
          continue;
        }
        
        // Convert back to coordinates and check actual distance
        const testCoord = pixelToCoord(testPixel, width, height);
        const actualDistance = haversineDistance(centerCoord, testCoord);
        
        if (actualDistance <= radiusKm) {
          const grayValue = getGrayscalePixelData(imageData, testPixel);
          
          // Skip pure black pixels (water/no-data areas)
          if (grayValue === 0) {
            continue;
          }
          
          const bortleScale = grayscaleToBortleScale(grayValue);
          
          if (bortleScale < darkestBortle) {
            darkestBortle = bortleScale;
          }
          
          validPixelsFound++;
        }
      }
    }
    
    return validPixelsFound > 0 ? darkestBortle : null;
  } catch (error) {
    console.error("Error finding darkest Bortle in radius:", error);
    return null;
  }
}

/**
 * Find multiple dark sites in different directions from the user's location
 */
export async function findMultipleDarkSites(
  startCoord: Coordinate,
  maxDistance: number = APP_CONFIG.SEARCH.DEFAULT_RADIUS_KM,
  onProgress?: (progress: number) => void,
  knownSites?: ReadonlyArray<SpecialLocation> // Optional known sites for secondary location>
): Promise<MultipleDarkSitesResult | null> {
  try {
    // First, find the nearest dark site
    const primary = await findNearestDarkSky(
      startCoord,
      maxDistance,
      (progress) => onProgress?.(progress * 0.4), // 40% for primary search
      knownSites
    );

    if (!primary) return null;

    // Calculate the bearing to the primary dark site
    const primaryBearing = calculateBearing(startCoord, primary.coordinate);

    // Define search directions: spread around compass for maximum geographic diversity
    // Start with opposite direction, then fill in the gaps
    const searchBearings = [
      (primaryBearing + 180) % 360, // Opposite direction
      (primaryBearing + 90) % 360, // 90° clockwise (perpendicular)
      (primaryBearing + 270) % 360, // 270° clockwise (perpendicular opposite)
      (primaryBearing + 45) % 360, // 45° clockwise
      (primaryBearing + 225) % 360, // 225° clockwise (opposite + 45°)
    ];

    const alternatives: DarkSiteResult[] = [];
    const { imageData, width, height } = await loadLightPollutionMap();

    // Search in each direction
    for (let i = 0; i < searchBearings.length; i++) {
      const bearing = searchBearings[i];
      const progressBase = 0.4 + i * 0.12; // 40% + 12% per alternative (5 × 12% = 60%)

      try {
        const result = await findDarkSiteInDirection(
          startCoord,
          bearing,
          maxDistance,
          imageData,
          width,
          height,
          [primary.coordinate, ...alternatives.map((alt) => alt.coordinate)], // Exclude primary and previous alternatives
          (progress) => onProgress?.(progressBase + progress * 0.12),
          knownSites
        );

        if (result) {
          alternatives.push(result);
        }
      } catch (error) {
        console.warn(
          `Failed to find dark site in direction ${bearing}°:`,
          error
        );
      }
    }

    if (onProgress) onProgress(1);

    return {
      primary,
      alternatives,
    };
  } catch (error) {
    console.error("Error finding multiple dark sites:", error);
    throw error;
  }
}

/**
 * Find a dark site in a specific direction from the start coordinate
 */
async function findDarkSiteInDirection(
  startCoord: Coordinate,
  bearing: number, // in degrees
  maxDistance: number,
  imageData: ImageData,
  width: number,
  height: number,
  excludeCoords: Coordinate[], // coordinates to exclude from results
  onProgress?: (progress: number) => void,
  knownSites?: ReadonlyArray<SpecialLocation>
): Promise<DarkSiteResult | null> {
  const visited = new Set<string>();
  const queue = new PriorityQueue<{
    pixel: PixelCoordinate;
    distance: number;
  }>();

  // Convert bearing to radians
  const bearingRad = (bearing * Math.PI) / 180;

  // Start search from points along the bearing direction
  const searchSteps = 20; // Number of initial search points along the bearing

  for (let step = 1; step <= searchSteps; step++) {
    const searchDistance = (maxDistance / searchSteps) * step;

    // Calculate coordinate at this distance along the bearing
    const R = 6371; // Earth radius in km
    const lat1Rad = (startCoord.lat * Math.PI) / 180;
    const lng1Rad = (startCoord.lng * Math.PI) / 180;

    const lat2Rad = Math.asin(
      Math.sin(lat1Rad) * Math.cos(searchDistance / R) +
        Math.cos(lat1Rad) * Math.sin(searchDistance / R) * Math.cos(bearingRad)
    );

    const lng2Rad =
      lng1Rad +
      Math.atan2(
        Math.sin(bearingRad) * Math.sin(searchDistance / R) * Math.cos(lat1Rad),
        Math.cos(searchDistance / R) - Math.sin(lat1Rad) * Math.sin(lat2Rad)
      );

    const searchCoord = {
      lat: (lat2Rad * 180) / Math.PI,
      lng: (lng2Rad * 180) / Math.PI,
    };

    const pixel = coordToPixel(searchCoord, width, height);
    const actualDistance = haversineDistance(startCoord, searchCoord);

    if (actualDistance <= maxDistance) {
      queue.enqueue({ pixel, distance: actualDistance }, actualDistance);
    }
  }

  const maxPixelDistance = Math.round(
    ((maxDistance / 6371) * Math.max(width, height)) / (2 * Math.PI)
  );
  let processedPixels = 0;
  const totalEstimatedPixels = Math.PI * maxPixelDistance * maxPixelDistance;

  while (!queue.isEmpty()) {
    const current = queue.dequeue();
    if (!current) break;

    const { pixel } = current;
    const key = `${pixel.x},${pixel.y}`;

    if (visited.has(key)) continue;
    visited.add(key);

    processedPixels++;
    if (
      onProgress &&
      processedPixels % APP_CONFIG.SEARCH.PROGRESS_UPDATE_INTERVAL === 0
    ) {
      onProgress(Math.min(processedPixels / totalEstimatedPixels, 0.95));
    }

    const coord = pixelToCoord(pixel, width, height);

    // Check if this coordinate is too close to excluded coordinates
    const tooClose = excludeCoords.some(
      (excludeCoord) => haversineDistance(coord, excludeCoord) < 2 // 2km minimum separation
    );

    if (tooClose) continue;

    // Check if current pixel represents dark sky
    const grayValue = getGrayscalePixelData(imageData, pixel);

    // Skip pure black pixels (water/no-data areas)
    if (grayValue === 0) {
      continue;
    }

    const bortleScale = grayscaleToBortleScale(grayValue);

    if (isDarkSky(bortleScale)) {
      const actualDistance = haversineDistance(startCoord, coord);

      // Optional debug logging for directional search findings
      // console.log(`DEBUG: Found directional dark sky at (${coord.lat.toFixed(4)}, ${coord.lng.toFixed(4)}):`, {
      //   distance: actualDistance.toFixed(1) + 'km',
      //   bortleScale,
      //   rgb: `R${pixelData.r} G${pixelData.g} B${pixelData.b}`,
      //   bearing: bearing.toFixed(0) + '°'
      // });

      const result: DarkSiteResult = {
        coordinate: coord,
        distance: actualDistance,
        bortleScale,
      };

      // Find nearest known site if provided
      if (knownSites) {
        const nearestKnown = findNearestKnownSite(coord, knownSites);
        if (nearestKnown) {
          result.nearestKnownSite = nearestKnown;
        }
      }

      if (onProgress) onProgress(1);
      return result;
    }

    // Add neighboring pixels to queue (reduced set for directional search)
    const neighbors = [
      { x: pixel.x - 1, y: pixel.y },
      { x: pixel.x + 1, y: pixel.y },
      { x: pixel.x, y: pixel.y - 1 },
      { x: pixel.x, y: pixel.y + 1 },
    ];

    for (const neighbor of neighbors) {
      if (
        neighbor.x >= 0 &&
        neighbor.x < width &&
        neighbor.y >= 0 &&
        neighbor.y < height
      ) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        if (!visited.has(neighborKey)) {
          const neighborCoord = pixelToCoord(neighbor, width, height);
          const neighborDistance = haversineDistance(startCoord, neighborCoord);

          if (neighborDistance <= maxDistance) {
            queue.enqueue(
              { pixel: neighbor, distance: neighborDistance },
              neighborDistance
            );
          }
        }
      }
    }
  }

  if (onProgress) onProgress(1);
  return null;
}
