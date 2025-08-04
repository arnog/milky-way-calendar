/**
 * gen-dark-sites.js
 *
  * Reads the official U.S. Bortle Class 2 list (as of Aug 2, 2025);
 * subtracts your current DARK_SITES names;
 * fetches lat/lon via Wikidata (and OpenStreetMap fallback);
 * outputs a TS snippet in your desired format.
 *
 * Usage:
 *   export DARK_SITES_JSON="path/to/existing-dark-sites.json"
 *   node gen-dark-sites.js > additional-dark-sites.ts
 *
 * Output: TypeScript array `ADDITIONAL_DARK_SITES` (names, slugs, lat, lon).
 */

import fetch from "node-fetch";

import { DARK_SITES } from "../src/utils/locations";

const existingJson = DARK_SITES;

// const existingJson = process.env.DARK_SITES_JSON;
// if (!existingJson) {
//   console.error(
//     "Set env DARK_SITES_JSON to your existing DARK_SITES .json file"
//   );
//   process.exit(1);
// }

/**
 * Utility: slugify park name (for `identifier`).
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "")
    .replace(/^(\d+)/, "_$1");
}

async function loadExisting() {
  // existingJson is now the actual DARK_SITES array
  return existingJson.map((tuple) => tuple[0]);
}

async function fetchGoAstronomyList() {
  const res = await fetch(
    "https://www.go-astronomy.com/bortle-class-2-sky-sites.php"
  );
  const html = await res.text();

  // Try different regex patterns
  const patterns = [
    /<td[^>]*><u><a[^>]*>([^<]+)<\/a><\/u><\/td>\s*<td[^>]*>([^<]+)<\/td>/g,
    /<a href="dark-sky-park\.php\?Park=\d+">([^<]+)<\/a><\/u><\/td>\s*<td[^>]*>([^<]+)<\/td>/g,
  ];

  const parks = [];
  for (const pattern of patterns) {
    const matches = [...html.matchAll(pattern)];
    console.error(
      `Pattern ${patterns.indexOf(pattern)}: found ${matches.length} matches`
    );
    if (matches.length > 0) {
      for (const match of matches) {
        const name = match[1].trim();
        const state = match[2].trim();
        if (name !== "NAME" && state !== "STATE" && name && state) {
          parks.push(`${name}, ${state}`);
        }
      }
      if (parks.length > 0) break;
    }
  }

  console.error(`Extracted ${parks.length} valid parks`);
  return parks;
}

async function queryWikidataCoordinates(
  label: string
): Promise<{ lat: number; lon: number; source: string } | null> {
  // SPARQL: entity with english label = label
  const sparql = `
SELECT ?placeLabel ?coord WHERE {
  ?place rdfs:label "${label}"@en.
  ?place wdt:P625 ?coord.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}`;
  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(
    sparql
  )}`;
  const resp = await fetch(url, { headers: { Accept: "application/json" } });
  if (!resp.ok) throw new Error(`SPARQL failed for ${label}`);
  const data = await resp.json();
  const results = (data as { results: { bindings: { coord: { value: string } }[] } }).results.bindings;
  if (results && results.length > 0) {
    // coordinate in format "Point(lon lat)"
    const wkt = results[0].coord.value;
    const coords = wkt
      .slice(wkt.indexOf("(") + 1, wkt.indexOf(")"))
      .split(" ")
      .map(parseFloat);
    return { lon: coords[0], lat: coords[1], source: "Wikidata" };
  }
  return null;
}

async function queryOSMCoordinates(
  label: string
): Promise<{ lat: number; lon: number; source: string } | null> {
  const resp = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      label
    )}&limit=1&format=json`
  );
  if (!resp.ok) return null;
  const j = (await resp.json()) as { lat: string; lon: string }[];
  if (j.length === 0) return null;
  return {
    lat: parseFloat(j[0].lat as string),
    lon: parseFloat(j[0].lon as string),
    source: "OpenStreetMap",
  };
}

(async () => {
  const existingNames = await loadExisting();
  const allNames = await fetchGoAstronomyList();
  // Skip the first 35 that were already processed
  const alreadyProcessed = [
    "Bladon Springs State Park, Alabama",
    "Conecuh National Forest, Alabama",
    "Chilkoot Lake State Recreation Area, Alaska",
    "Kachemak Bay State Park, Alaska",
    "Sandspit Point State Marine Park, Alaska",
    "Alamo Lake State Park, Arizona",
    "Kartchner Caverns State Park, Arizona",
    "Oracle State Park, Arizona",
    "Petrified Forest National Park, Arizona",
    "Queen Wilhelmina State Park, Arkansas",
    "Admiral William Standley State Recreation Area, California",
    "Ahjumawi Lava Springs State Park, California",
    "Anza-Borrego Desert State Park, California",
    "Benbow State Recreation Area, California",
    "Caspar Headlands State Natural Reserve, California",
    "Castle Crags State Park, California",
    "Del Norte Coast Redwoods State Park, California",
    "Estero Bluffs State Park, California",
    "Grizzly Creek Redwoods State Park, California",
    "Grover Hot Springs State Park, California",
    "Harry A. Merlo State Recreation Area, California",
    "Hendy Woods State Park, California",
    "Humboldt Lagoons State Park, California",
    "John Little State Natural Reserve, California",
    "Joshua Tree National Park, California",
    "Julia Pfeiffer Burns State Park, California",
    "Kruse Rhododendron State Natural Reserve, California",
    "Limekiln State Park, California",
    "Manchester State Park, California",
    "Mendocino National Forest, California",
    "Mono Lake Tufa State Natural Reserve, California",
    "Navarro River Redwoods State Park, California",
    "Patrick's Point State Park, California",
    "Pfeiffer Big Sur State Park, California",
    "Plumas-Eureka State Park, California",
  ];
  const missing = allNames.filter(
    (n) => !existingNames.includes(n) && !alreadyProcessed.includes(n)
  );
  console.error(
    `Found ${missing.length} missing Bortle-2 sites from Go-Astronomy.`
  );
  const outputTuples = [];
  let processedCount = 0;
  console.error(`Processing all ${missing.length} sites...`);
  for (const fullName of missing) {
    // Add delay to avoid rate limiting (reduced delay)
    if (processedCount > 0 && processedCount % 10 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    processedCount++;
    console.error(
      `Processing ${processedCount}/${missing.length}: ${fullName}`
    );
    // Try different variations for better matches
    let coord = await queryWikidataCoordinates(fullName);
    if (!coord) {
      // Try without the state
      const nameWithoutState = fullName.replace(/, [A-Z][a-z]+$/, "");
      coord = await queryWikidataCoordinates(nameWithoutState);
    }
    if (!coord) coord = await queryOSMCoordinates(fullName);
    if (!coord) {
      // Try OSM without state
      const nameWithoutState = fullName.replace(/, [A-Z][a-z]+$/, "");
      coord = await queryOSMCoordinates(nameWithoutState + ", USA");
    }
    if (!coord) {
      console.error(`✖ No coords found for "${fullName}"`);
      continue;
    }
    const slug = slugify(fullName.replace(", USA", ""));
    const shortName = fullName
      .replace(", USA", "")
      .replace(/State (Park|Recreation|Preserve)/, "")
      .trim();
    outputTuples.push([
      `${fullName}, USA`,
      shortName,
      Number(coord.lat.toFixed(6)),
      Number(coord.lon.toFixed(6)),
      slug,
    ]);
  }

  console.log(
    "// === Auto-generated additional DARK_SITES from Go-Astronomy Bortle Class 2 list ==="
  );
  console.log("export const ADDITIONAL_DARK_SITES: SpecialLocation[] = [");
  for (const tup of outputTuples) {
    console.log(
      `  ["${tup[0]}", "${tup[1]}", ${tup[2]}, ${tup[3]}, "${tup[4]}"],`
    );
  }
  console.log("] as const;");
})();
