#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to convert location name to URL-friendly slug
function locationNameToSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .trim();
}

// Read locations data from the TypeScript file
const locationsFile = fs.readFileSync(
  path.join(__dirname, "../src/utils/locations.ts"),
  "utf8",
);

// Parse location arrays using regex to match the array entries
function parseLocationArray(arrayName) {
  const locations = [];

  // Find the array declaration
  const arrayStart = locationsFile.indexOf(`export const ${arrayName} = [`);
  if (arrayStart === -1) return locations;

  const arrayEnd = locationsFile.indexOf("\n];", arrayStart);
  if (arrayEnd === -1) return locations;

  const arrayContent = locationsFile.substring(arrayStart, arrayEnd);

  // Match array entries - handles multi-line entries
  const entryRegex =
    /\[\s*"([^"]+)",\s*"([^"]+)",\s*([-\d.]+),\s*([-\d.]+)(?:,\s*"([^"]+)")?\s*\]/gs;
  let match;

  while ((match = entryRegex.exec(arrayContent)) !== null) {
    locations.push({
      fullName: match[1],
      shortName: match[2],
      lat: parseFloat(match[3]),
      lng: parseFloat(match[4]),
      customSlug: match[5] || null,
    });
  }

  return locations;
}

const darkSites = parseLocationArray("DARK_SITES");
const largeCities = parseLocationArray("LARGE_CITIES");

// Generate sitemap XML
const today = new Date().toISOString().split("T")[0];
const baseUrl = "https://milkywaycalendar.com";

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/explore</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/faq</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Dark Sky Sites -->
`;

// Add dark sky sites
darkSites.forEach((location) => {
  const slug = locationNameToSlug(location.shortName);
  sitemap += `  <url>
    <loc>${baseUrl}/location/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
});

sitemap += `
  <!-- Major Cities -->
`;

// Add major cities
largeCities.forEach((location) => {
  const slug = locationNameToSlug(location.shortName);
  sitemap += `  <url>
    <loc>${baseUrl}/location/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
});

sitemap += `</urlset>`;

// Write sitemap to public directory
const outputPath = path.join(__dirname, "../public/sitemap.xml");
fs.writeFileSync(outputPath, sitemap);

console.log(`✅ Sitemap generated successfully!`);
console.log(`📍 Location: ${outputPath}`);
console.log(`📊 Total URLs: ${3 + darkSites.length + largeCities.length}`);
console.log(`   - Static pages: 3`);
console.log(`   - Dark sky sites: ${darkSites.length}`);
console.log(`   - Major cities: ${largeCities.length}`);
