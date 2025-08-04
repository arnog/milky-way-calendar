/**
 * Web Worker for Dark Site Search
 * 
 * This worker handles the heavy computation of finding dark sky sites
 * without blocking the main UI thread.
 */

// Configuration constants (mirrored from appConfig.ts)
const APP_CONFIG = {
  SEARCH: {
    DEFAULT_RADIUS_KM: 500,
    PROGRESS_UPDATE_INTERVAL: 500,
  },
  BORTLE: {
    EXCELLENT_DARK_SKY_MAX: 3.0,
  },
};

// Earth's radius in kilometers
const EARTH_RADIUS_KM = 6371;

// Light pollution colormap (mirrored from lightPollutionMap.ts)
const LIGHT_POLLUTION_COLORMAP = [
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
 * Priority queue implementation for Dijkstra's algorithm
 */
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(item, priority) {
    this.items.push({ item, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.items.shift()?.item;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

/**
 * Convert latitude/longitude to pixel coordinates
 */
function coordToPixel(coord, imageWidth, imageHeight) {
  const MAP_LAT_MIN = -65;
  const MAP_LAT_MAX = 75;
  const MAP_LAT_SPAN = MAP_LAT_MAX - MAP_LAT_MIN;

  const x = ((coord.lng + 180) / 360) * imageWidth;
  const y = ((MAP_LAT_MAX - coord.lat) / MAP_LAT_SPAN) * imageHeight;

  const pixelX = Math.round(Math.max(0, Math.min(imageWidth - 1, x)));
  const pixelY = Math.round(Math.max(0, Math.min(imageHeight - 1, y)));

  return { x: pixelX, y: pixelY };
}

/**
 * Convert pixel coordinates back to latitude/longitude
 */
function pixelToCoord(pixel, imageWidth, imageHeight) {
  const MAP_LAT_MIN = -65;
  const MAP_LAT_MAX = 75;
  const MAP_LAT_SPAN = MAP_LAT_MAX - MAP_LAT_MIN;

  const lng = (pixel.x / imageWidth) * 360 - 180;
  const lat = MAP_LAT_MAX - (pixel.y / imageHeight) * MAP_LAT_SPAN;

  return { lat, lng };
}

/**
 * Calculate geodesic distance between two coordinates using Haversine formula
 */
function haversineDistance(coord1, coord2) {
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

/**
 * Convert RGB values to Bortle scale using colormap
 */
function rgbToBortleScale(r, g, b) {
  // Pure black represents water/no-data areas
  if (r === 0 && g === 0 && b === 0) {
    return 9;
  }

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

  return bestMatch[5];
}

/**
 * Check if a Bortle scale value represents good dark sky conditions
 */
function isDarkSky(bortleScale) {
  return bortleScale <= APP_CONFIG.BORTLE.EXCELLENT_DARK_SKY_MAX;
}

/**
 * Get pixel data at specific coordinates
 */
function getPixelData(imageData, pixel) {
  const index = (pixel.y * imageData.width + pixel.x) * 4;

  return {
    r: imageData.data[index],
    g: imageData.data[index + 1],
    b: imageData.data[index + 2],
    a: imageData.data[index + 3],
  };
}

/**
 * Find the nearest known dark site location to a coordinate
 */
function findNearestKnownSite(targetCoord, knownSites) {
  if (!knownSites || knownSites.length === 0) return null;

  let nearest = null;
  let minDistance = Infinity;

  for (const site of knownSites) {
    const siteCoord = { lat: site[2], lng: site[3] };
    const distance = haversineDistance(targetCoord, siteCoord);

    if (distance < minDistance) {
      minDistance = distance;
      nearest = {
        name: site[1],
        fullName: site[0],
        coordinate: siteCoord,
        distance,
      };
    }
  }

  return nearest;
}

/**
 * Calculate bearing from one coordinate to another in degrees
 */
function calculateBearing(from, to) {
  const lat1Rad = (from.lat * Math.PI) / 180;
  const lat2Rad = (to.lat * Math.PI) / 180;
  const deltaLngRad = ((to.lng - from.lng) * Math.PI) / 180;

  const y = Math.sin(deltaLngRad) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLngRad);

  const bearingRad = Math.atan2(y, x);
  const bearingDeg = (bearingRad * 180) / Math.PI;

  return (bearingDeg + 360) % 360;
}

/**
 * Load the light pollution map image
 */
async function loadLightPollutionMap() {
  return new Promise((resolve, reject) => {
    const canvas = new OffscreenCanvas(1, 1);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    // Create image bitmap from URL
    fetch('/world2024B-lg.png')
      .then(response => response.blob())
      .then(blob => createImageBitmap(blob))
      .then(imageBitmap => {
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        ctx.drawImage(imageBitmap, 0, 0);

        const imageData = ctx.getImageData(0, 0, imageBitmap.width, imageBitmap.height);

        resolve({
          imageData,
          width: imageBitmap.width,
          height: imageBitmap.height,
        });
      })
      .catch(error => {
        reject(new Error(`Failed to load light pollution map: ${error.message}`));
      });
  });
}

/**
 * Find the nearest dark sky location
 */
async function findNearestDarkSky(startCoord, maxDistance, knownSites) {
  try {
    const { imageData, width, height } = await loadLightPollutionMap();

    const startPixel = coordToPixel(startCoord, width, height);
    const visited = new Set();
    const queue = new PriorityQueue();

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
      if (processedPixels % APP_CONFIG.SEARCH.PROGRESS_UPDATE_INTERVAL === 0) {
        const progress = Math.min(processedPixels / totalEstimatedPixels, 0.95);
        self.postMessage({
          type: 'progress',
          progress,
        });
      }

      // Check if current pixel represents dark sky
      const pixelData = getPixelData(imageData, pixel);
      const bortleScale = rgbToBortleScale(
        pixelData.r,
        pixelData.g,
        pixelData.b
      );
      const coord = pixelToCoord(pixel, width, height);

      // Skip pure black pixels (water/no-data areas)
      if (pixelData.r === 0 && pixelData.g === 0 && pixelData.b === 0) {
        continue;
      }

      if (isDarkSky(bortleScale)) {
        const actualDistance = haversineDistance(startCoord, coord);

        self.postMessage({ type: 'progress', progress: 1 });

        const result = {
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
              queue.enqueue(
                { pixel: neighbor, distance: neighborDistance },
                neighborDistance
              );
            }
          }
        }
      }
    }

    self.postMessage({ type: 'progress', progress: 1 });
    return null;
  } catch (error) {
    throw new Error(`Error finding nearest dark sky: ${error.message}`);
  }
}

/**
 * Find a dark site in a specific direction
 */
async function findDarkSiteInDirection(
  startCoord,
  bearing,
  maxDistance,
  imageData,
  width,
  height,
  excludeCoords,
  knownSites
) {
  const visited = new Set();
  const queue = new PriorityQueue();

  const bearingRad = (bearing * Math.PI) / 180;
  const searchSteps = 20;

  for (let step = 1; step <= searchSteps; step++) {
    const searchDistance = (maxDistance / searchSteps) * step;

    const R = 6371;
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

    const coord = pixelToCoord(pixel, width, height);

    // Check if this coordinate is too close to excluded coordinates
    const tooClose = excludeCoords.some(
      (excludeCoord) => haversineDistance(coord, excludeCoord) < 2
    );

    if (tooClose) continue;

    const pixelData = getPixelData(imageData, pixel);

    // Skip pure black pixels
    if (pixelData.r === 0 && pixelData.g === 0 && pixelData.b === 0) {
      continue;
    }

    const bortleScale = rgbToBortleScale(pixelData.r, pixelData.g, pixelData.b);

    if (isDarkSky(bortleScale)) {
      const actualDistance = haversineDistance(startCoord, coord);

      const result = {
        coordinate: coord,
        distance: actualDistance,
        bortleScale,
      };

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

  return null;
}

/**
 * Find multiple dark sites in different directions
 */
async function findMultipleDarkSites(startCoord, maxDistance, knownSites) {
  try {
    // First, find the nearest dark site
    const primary = await findNearestDarkSky(startCoord, maxDistance, knownSites);

    if (!primary) return null;

    // Calculate the bearing to the primary dark site
    const primaryBearing = calculateBearing(startCoord, primary.coordinate);

    const searchBearings = [
      (primaryBearing + 180) % 360,
      (primaryBearing + 90) % 360,
      (primaryBearing + 270) % 360,
      (primaryBearing + 45) % 360,
      (primaryBearing + 225) % 360,
    ];

    const alternatives = [];
    const { imageData, width, height } = await loadLightPollutionMap();

    for (let i = 0; i < searchBearings.length; i++) {
      const bearing = searchBearings[i];
      const progressBase = 0.4 + i * 0.12;

      try {
        const result = await findDarkSiteInDirection(
          startCoord,
          bearing,
          maxDistance,
          imageData,
          width,
          height,
          [primary.coordinate, ...alternatives.map((alt) => alt.coordinate)],
          knownSites
        );

        if (result) {
          alternatives.push(result);
        }
      } catch (error) {
        console.warn(`Failed to find dark site in direction ${bearing}°:`, error);
      }
    }

    self.postMessage({ type: 'progress', progress: 1 });

    return {
      primary,
      alternatives,
    };
  } catch (error) {
    throw new Error(`Error finding multiple dark sites: ${error.message}`);
  }
}

/**
 * Get Bortle rating for a specific location
 */
async function getBortleRatingForLocation(coord) {
  try {
    const { imageData, width, height } = await loadLightPollutionMap();
    const pixel = coordToPixel(coord, width, height);
    const pixelData = getPixelData(imageData, pixel);
    
    // Skip pure black pixels (water/no-data areas)
    if (pixelData.r === 0 && pixelData.g === 0 && pixelData.b === 0) {
      return null;
    }
    
    return rgbToBortleScale(pixelData.r, pixelData.g, pixelData.b);
  } catch (error) {
    throw new Error(`Error getting Bortle rating: ${error.message}`);
  }
}

// Message handler
self.addEventListener('message', async (event) => {
  const { type, data, id } = event.data;

  try {
    let result;

    switch (type) {
      case 'findNearestDarkSky':
        result = await findNearestDarkSky(
          data.startCoord,
          data.maxDistance || APP_CONFIG.SEARCH.DEFAULT_RADIUS_KM,
          data.knownSites
        );
        break;

      case 'findMultipleDarkSites':
        result = await findMultipleDarkSites(
          data.startCoord,
          data.maxDistance || APP_CONFIG.SEARCH.DEFAULT_RADIUS_KM,
          data.knownSites
        );
        break;

      case 'getBortleRatingForLocation':
        result = await getBortleRatingForLocation(data.coord);
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }

    // Send success response
    self.postMessage({
      type: 'success',
      id,
      result,
    });
  } catch (error) {
    // Send error response
    self.postMessage({
      type: 'error',
      id,
      error: error.message,
    });
  }
});