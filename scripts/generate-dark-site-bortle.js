#!/usr/bin/env node

/**
 * Generate DARK_SITE_BORTLE mapping by finding the darkest Bortle value
 * within a 10km radius of each DARK_SITE location.
 *
 * This script processes each DARK_SITE and calculates the optimal Bortle
 * rating based on the darkest point found within the vicinity, rather
 * than using the arbitrary lat/long point specified in the site data.
 */

import fs from "fs";
import path from "path";
import { createCanvas, loadImage } from "canvas";

// Simplified version of the light pollution processing for Node.js
const DARK_SITES = [
  [
    "Yellowstone National Park, Wyoming/Montana/Idaho, USA",
    "Yellowstone",
    44.6,
    -110.5,
  ],
  ["Yosemite National Park, California, USA", "Yosemite", 37.8651, -119.5383],
  // ... we'll load this from the actual file
];

// Light pollution colormap (simplified)
const LIGHT_POLLUTION_COLORMAP = [
  [8, 8, 8, 1],
  [16, 16, 16, 1.5],
  [24, 24, 24, 2],
  [32, 32, 32, 2.5],
  [48, 48, 48, 3],
  [0, 0, 128, 3.5],
  [0, 0, 255, 4],
  [0, 128, 0, 4.5],
  [0, 255, 0, 5],
  [128, 128, 0, 5.5],
  [255, 255, 0, 6],
  [255, 128, 0, 6.5],
  [255, 64, 0, 7],
  [255, 0, 0, 7.5],
  [255, 255, 255, 8],
  [192, 192, 192, 9],
];

function rgbToBortleScale(r, g, b) {
  if (r === 0 && g === 0 && b === 0) return 9;

  let minDistance = Infinity;
  let bestMatch = LIGHT_POLLUTION_COLORMAP[LIGHT_POLLUTION_COLORMAP.length - 1];

  for (const colorEntry of LIGHT_POLLUTION_COLORMAP) {
    const [mapR, mapG, mapB] = colorEntry;
    const distance = Math.sqrt(
      (r - mapR) ** 2 + (g - mapG) ** 2 + (b - mapB) ** 2,
    );

    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = colorEntry;
    }
  }

  return bestMatch[3];
}

function coordToPixel(coord, imageWidth, imageHeight) {
  const MAP_LAT_MIN = -65;
  const MAP_LAT_MAX = 75;
  const MAP_LAT_SPAN = MAP_LAT_MAX - MAP_LAT_MIN;

  const x = ((coord.lng + 180) / 360) * imageWidth;
  const y = ((MAP_LAT_MAX - coord.lat) / MAP_LAT_SPAN) * imageHeight;

  return {
    x: Math.round(Math.max(0, Math.min(imageWidth - 1, x))),
    y: Math.round(Math.max(0, Math.min(imageHeight - 1, y))),
  };
}

function pixelToCoord(pixel, imageWidth, imageHeight) {
  const MAP_LAT_MIN = -65;
  const MAP_LAT_MAX = 75;
  const MAP_LAT_SPAN = MAP_LAT_MAX - MAP_LAT_MIN;

  const lng = (pixel.x / imageWidth) * 360 - 180;
  const lat = MAP_LAT_MAX - (pixel.y / imageHeight) * MAP_LAT_SPAN;

  return { lat, lng };
}

function haversineDistance(coord1, coord2) {
  const R = 6371;
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

  return R * c;
}

async function findDarkestBortleInRadius(
  centerCoord,
  radiusKm,
  imageData,
  width,
  height,
) {
  const pixelsPerDegree = width / 360;
  const radiusDegrees =
    radiusKm / (111.32 * Math.cos((centerCoord.lat * Math.PI) / 180));
  const radiusPixels = Math.ceil(radiusDegrees * pixelsPerDegree);

  const centerPixel = coordToPixel(centerCoord, width, height);
  let darkestBortle = Infinity;
  let validPixelsFound = 0;

  for (let dx = -radiusPixels; dx <= radiusPixels; dx++) {
    for (let dy = -radiusPixels; dy <= radiusPixels; dy++) {
      const testPixel = {
        x: centerPixel.x + dx,
        y: centerPixel.y + dy,
      };

      if (
        testPixel.x < 0 ||
        testPixel.x >= width ||
        testPixel.y < 0 ||
        testPixel.y >= height
      ) {
        continue;
      }

      const testCoord = pixelToCoord(testPixel, width, height);
      const actualDistance = haversineDistance(centerCoord, testCoord);

      if (actualDistance <= radiusKm) {
        const index = (testPixel.y * width + testPixel.x) * 4;
        const r = imageData[index];
        const g = imageData[index + 1];
        const b = imageData[index + 2];

        if (r === 0 && g === 0 && b === 0) continue;

        const bortleScale = rgbToBortleScale(r, g, b);

        if (bortleScale < darkestBortle) {
          darkestBortle = bortleScale;
        }

        validPixelsFound++;
      }
    }
  }

  return validPixelsFound > 0 ? darkestBortle : null;
}

async function generateDarkSiteBortleMapping() {
  console.log(`Processing ${DARK_SITES.length} dark sites...`);

  const bortleMapping = {};
  const results = [];

  for (let i = 0; i < DARK_SITES.length; i++) {
    const site = DARK_SITES[i];
    const [fullName, slug, lat, lng] = site;

    console.log(
      `[${i + 1}/${DARK_SITES.length}] Processing ${slug} (${fullName})...`,
    );

    try {
      const darkestBortle = await findDarkestBortleInRadius({ lat, lng }, 10);

      if (darkestBortle !== null) {
        bortleMapping[slug] = darkestBortle;
        results.push({
          slug,
          fullName,
          originalCoord: { lat, lng },
          darkestBortle: Math.round(darkestBortle * 10) / 10, // Round to 1 decimal
        });

        console.log(
          `  → Darkest Bortle within 10km: ${Math.round(darkestBortle * 10) / 10}`,
        );
      } else {
        console.log(`  → No valid Bortle data found (likely over water)`);
        // Use a fallback value for sites over water or no-data areas
        bortleMapping[slug] = 2.0; // Assume good dark sky
        results.push({
          slug,
          fullName,
          originalCoord: { lat, lng },
          darkestBortle: 2.0,
          note: "Fallback value - no data available",
        });
      }
    } catch (error) {
      console.error(`  → Error processing ${slug}:`, error.message);
      // Use fallback value on error
      bortleMapping[slug] = 2.0;
      results.push({
        slug,
        fullName,
        originalCoord: { lat, lng },
        darkestBortle: 2.0,
        note: "Fallback value - processing error",
      });
    }

    // Add small delay to avoid overwhelming the system
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Generate TypeScript file content
  const tsContent = `/**
 * Dark Site Bortle Mapping
 * 
 * This file contains the optimal Bortle scale values for each DARK_SITE,
 * calculated by finding the darkest point within a 10km radius of the
 * site's coordinates. This provides more accurate darkness ratings than
 * using the arbitrary lat/long specified in the site data.
 * 
 * Generated on: ${new Date().toISOString()}
 * Total sites processed: ${results.length}
 */

export const DARK_SITE_BORTLE: Record<string, number> = {
${Object.entries(bortleMapping)
  .map(([slug, bortle]) => `  "${slug}": ${bortle},`)
  .join("\n")}
} as const;

/**
 * Get the optimal Bortle rating for a dark site
 */
export function getDarkSiteBortle(siteSlug: string): number | null {
  return DARK_SITE_BORTLE[siteSlug] ?? null;
}
`;

  // Write the TypeScript file
  const outputPath = path.join(
    process.cwd(),
    "src",
    "data",
    "darkSiteBortle.ts",
  );

  // Ensure directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, tsContent);

  // Also write a JSON report for analysis
  const reportPath = path.join(process.cwd(), "dark-site-bortle-report.json");
  const report = {
    generatedAt: new Date().toISOString(),
    totalSites: results.length,
    statistics: {
      averageBortle:
        results.reduce((sum, r) => sum + r.darkestBortle, 0) / results.length,
      bortleDistribution: results.reduce((dist, r) => {
        const rounded = Math.round(r.darkestBortle);
        dist[rounded] = (dist[rounded] || 0) + 1;
        return dist;
      }, {}),
      sitesWithFallback: results.filter((r) => r.note).length,
    },
    results: results.sort((a, b) => a.darkestBortle - b.darkestBortle),
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n✅ Generated DARK_SITE_BORTLE mapping:`);
  console.log(`   TypeScript file: ${outputPath}`);
  console.log(`   Analysis report: ${reportPath}`);
  console.log(`\n📊 Statistics:`);
  console.log(`   Total sites: ${results.length}`);
  console.log(
    `   Average Bortle: ${Math.round(report.statistics.averageBortle * 10) / 10}`,
  );
  console.log(`   Sites with fallback: ${report.statistics.sitesWithFallback}`);
  console.log(`   Bortle distribution:`, report.statistics.bortleDistribution);
}

// Handle ES modules in Node.js
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDarkSiteBortleMapping().catch(console.error);
}
