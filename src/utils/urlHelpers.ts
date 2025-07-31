import { Location } from "../types/astronomy";
import { SPECIAL_LOCATIONS } from "./locations";

// Convert a location name to URL-friendly slug
export function locationNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .trim();
}

// Convert coordinates to URL format: @lat,lng
export function coordinatesToSlug(location: Location): string {
  // Round to 4 decimal places for cleaner URLs
  const lat = Math.round(location.lat * 10000) / 10000;
  const lng = Math.round(location.lng * 10000) / 10000;
  return `@${lat},${lng}`;
}

// Convert location to URL slug, preferring named locations over coordinates
export function locationToSlug(location: Location): string {
  // First, try to find if this matches a special location
  for (const loc of SPECIAL_LOCATIONS) {
    const specialLat = loc[2] as number;
    const specialLng = loc[3] as number;

    // Check if coordinates are very close (within 0.01 degrees)
    if (
      Math.abs(location.lat - specialLat) < 0.01 &&
      Math.abs(location.lng - specialLng) < 0.01
    ) {
      const shortName = loc[1] as string;
      return locationNameToSlug(shortName);
    }
  }

  // Fall back to coordinate-based slug
  return coordinatesToSlug(location);
}

// Parse slug back to location
export function slugToLocation(slug: string): Location | null {
  // Handle coordinate format: @lat,lng
  if (slug.startsWith("@")) {
    const coords = slug.substring(1); // Remove @
    const coordMatch = coords.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }
    return null;
  }

  // Handle named location slugs
  for (const loc of SPECIAL_LOCATIONS) {
    const shortName = loc[1] as string;
    const expectedSlug = locationNameToSlug(shortName);

    if (expectedSlug === slug) {
      return {
        lat: loc[2] as number,
        lng: loc[3] as number,
      };
    }
  }

  return null;
}

// Get display name for a location (for SEO titles/descriptions)
export function getLocationDisplayName(location: Location): string {
  // Try to find matching special location
  for (const loc of SPECIAL_LOCATIONS) {
    const specialLat = loc[2] as number;
    const specialLng = loc[3] as number;

    if (
      Math.abs(location.lat - specialLat) < 0.01 &&
      Math.abs(location.lng - specialLng) < 0.01
    ) {
      return loc[0] as string; // Full name
    }
  }

  // Fall back to coordinates
  return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
}

// Generate SEO-friendly title for location
export function generateLocationTitle(location: Location): string {
  const displayName = getLocationDisplayName(location);
  return `Milky Way Viewing Conditions - ${displayName}`;
}

// Generate SEO-friendly description for location
export function generateLocationDescription(location: Location): string {
  const displayName = getLocationDisplayName(location);
  return `View optimal Milky Way photography conditions for ${displayName}. See real-time visibility ratings, moon phases, darkness windows, and Galactic Core position data.`;
}
