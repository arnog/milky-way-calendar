import { Location } from "../types/astronomy";
import {
  SPECIAL_LOCATIONS,
  SPECIAL_AREAS,
  LARGE_CITIES,
  HIGH_LATITUDE_MESSAGE,
  LARGE_CITY_MESSAGE,
  SpecialLocation,
} from "./locations";

import { SPECIAL_LOCATION_DESCRIPTIONS } from "./locationDescriptions";

// Normalize string for comparison by removing punctuation and normalizing whitespace
function normalizeForComparison(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Replace punctuation with spaces
    .replace(/\s+/g, " ") // Normalize whitespace to single spaces
    .trim();
}

interface ParsedLocation {
  location: Location;
  matchedName?: string;
}

// Parse location from various formats
export function parseLocationInput(input: string): ParsedLocation | null {
  const trimmed = input.trim();

  // First try to match against special locations
  const locationMatch = findMatchingLocation(trimmed);
  if (locationMatch) return locationMatch;

  // Try decimal degrees: "lat, lng" or "lat,lng" "or "lat lng"
  const decimalMatch = trimmed.match(
    /^(-?\d+\.?\d*)\s*(?:,\s*|\s+)(-?\d+\.?\d*)$/
  );
  if (decimalMatch) {
    const lat = parseFloat(decimalMatch[1]);
    const lng = parseFloat(decimalMatch[2]);
    if (isValidCoordinate(lat, lng)) {
      return { location: { lat, lng } };
    }
  }

  // Try DMS format: "37° 46' 30.64" N, 122° 25' 9.84" W"
  const dmsMatch = trimmed.match(
    /(\d+)°\s*(\d+)'\s*([\d.]+)"\s*([NS])\s*(?:,\s*|\s+)(\d+)°\s*(\d+)'\s*([\d.]+)"\s*([EW])/i
  );
  if (dmsMatch) {
    const lat = dmsToDecimal(
      parseInt(dmsMatch[1]),
      parseInt(dmsMatch[2]),
      parseFloat(dmsMatch[3]),
      dmsMatch[4].toUpperCase()
    );
    const lng = dmsToDecimal(
      parseInt(dmsMatch[5]),
      parseInt(dmsMatch[6]),
      parseFloat(dmsMatch[7]),
      dmsMatch[8].toUpperCase()
    );
    if (isValidCoordinate(lat, lng)) {
      return { location: { lat, lng } };
    }
  }

  // Try DDM format: "37° 46.510' N, 122° 25.164' W"
  const ddmMatch = trimmed.match(
    /(\d+)°\s*([\d.]+)'\s*([NS])\s*(?:,\s*|\s+)(\d+)°\s*([\d.]+)'\s*([EW])/i
  );
  if (ddmMatch) {
    const lat = ddmToDecimal(
      parseInt(ddmMatch[1]),
      parseFloat(ddmMatch[2]),
      ddmMatch[3].toUpperCase()
    );
    const lng = ddmToDecimal(
      parseInt(ddmMatch[4]),
      parseFloat(ddmMatch[5]),
      ddmMatch[6].toUpperCase()
    );
    if (isValidCoordinate(lat, lng)) {
      return { location: { lat, lng } };
    }
  }

  return null;
}

// Find matching location from special locations list
function findMatchingLocation(input: string): ParsedLocation | null {
  const normalizedInput = normalizeForComparison(input);

  const result = (loc: SpecialLocation) => {
    const slug = loc[1];
    const lat = loc[2];
    const lng = loc[3];

    return { location: { lat, lng }, matchedName: slug };
  };

  // First try exact match on full name
  for (const loc of SPECIAL_LOCATIONS) {
    const normalizedFullName = normalizeForComparison(loc[0]);

    if (normalizedFullName === normalizedInput) return result(loc);
  }

  // Then try word boundary match on full name - prioritize matches at word boundaries
  for (const loc of SPECIAL_LOCATIONS) {
    const normalizedFullName = normalizeForComparison(loc[0]);

    // Create word boundary regex for the input
    const words = normalizedInput.split(" ").filter((word) => word.length > 0);
    const wordMatches = words.every((word) => {
      const wordRegex = new RegExp(
        `\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
        "i"
      );
      return wordRegex.test(normalizedFullName);
    });

    if (wordMatches) return result(loc);
  }

  // Finally try partial match as fallback
  if (normalizedInput.length >= 3) {
    for (const loc of SPECIAL_LOCATIONS) {
      const normalizedFullName = normalizeForComparison(loc[0]);

      if (normalizedFullName.includes(normalizedInput)) return result(loc);
    }
  }

  return null;
}

// Convert DMS to decimal degrees
function dmsToDecimal(
  degrees: number,
  minutes: number,
  seconds: number,
  direction: string
): number {
  const decimal = degrees + minutes / 60 + seconds / 3600;
  return direction === "S" || direction === "W" ? -decimal : decimal;
}

// Convert DDM to decimal degrees
function ddmToDecimal(
  degrees: number,
  minutes: number,
  direction: string
): number {
  const decimal = degrees + minutes / 60;
  return direction === "S" || direction === "W" ? -decimal : decimal;
}

// Validate coordinate ranges
function isValidCoordinate(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// Calculate distance between two locations in km
export function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLng = toRad(loc2.lng - loc1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.lat)) *
      Math.cos(toRad(loc2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Find nearest special location within threshold
export function findNearestSpecialLocation(
  location: Location,
  thresholdKm: number = 100
): ParsedLocation | null {
  let nearest: ParsedLocation | null = null;
  let minDistance = thresholdKm;

  for (const loc of SPECIAL_LOCATIONS) {
    const specialLoc = { lat: loc[2] as number, lng: loc[3] as number };
    const distance = calculateDistance(location, specialLoc);

    if (distance < minDistance) {
      minDistance = distance;
      const areaId = loc[4] as string | undefined;
      const displayName =
        areaId && SPECIAL_AREAS[areaId as keyof typeof SPECIAL_AREAS]
          ? SPECIAL_AREAS[areaId as keyof typeof SPECIAL_AREAS]
          : (loc[1] as string); // Use area name if available, otherwise short name

      nearest = {
        location: specialLoc,
        matchedName: displayName,
      };
    }
  }

  return nearest;
}

// Get special location description by finding matching location identifier
export function getSpecialLocationDescription(
  location: Location,
  matchedLocationName?: string | null
): string | null {
  // Check for high latitude locations first (>60°N)
  if (location.lat > 60) {
    return HIGH_LATITUDE_MESSAGE;
  }

  // Check if location matches a large city
  for (const city of LARGE_CITIES) {
    const cityLoc = { lat: city[2], lng: city[3] };
    const distance = calculateDistance(location, cityLoc);

    // If it's within ~50km of a large city center
    if (distance < 50) {
      return LARGE_CITY_MESSAGE;
    }
  }

  // If we have a matched location name, use a more generous distance threshold
  const distanceThreshold = matchedLocationName ? 100 : 1; // 100km if matched name, 1km if exact coordinates

  // Look for the special location entry that matches this location
  for (const loc of SPECIAL_LOCATIONS) {
    const specialLoc = { lat: loc[2], lng: loc[3] };
    const distance = calculateDistance(location, specialLoc);

    // If it's a close match and has an identifier (5th element)
    if (distance < distanceThreshold && loc[4]) {
      // If we have a matched name, verify it matches this location's slug/name
      if (matchedLocationName) {
        const locationSlug = loc[1] as string; // Short name/slug
        const locationFullName = loc[0] as string; // Full name
        
        // Check if the matched name corresponds to this location
        if (matchedLocationName === locationSlug || 
            matchedLocationName.toLowerCase().includes(locationFullName.toLowerCase()) ||
            locationFullName.toLowerCase().includes(matchedLocationName.toLowerCase())) {
          const identifier = loc[4];
          return SPECIAL_LOCATION_DESCRIPTIONS[identifier] || null;
        }
      } else {
        // For exact coordinates (no matched name), use the original strict distance check
        const identifier = loc[4];
        return SPECIAL_LOCATION_DESCRIPTIONS[identifier] || null;
      }
    }
  }

  return null;
}
