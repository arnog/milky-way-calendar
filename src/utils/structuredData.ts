import { WeekData, Location } from "../types/astronomy";
import { findNearestSpecialLocation } from "./locationParser";
import { formatDateForStructuredData } from "./timezoneUtils";

export interface StructuredEventData {
  "@context": string;
  "@type": string;
  "name": string;
  "startDate": string;
  "endDate": string;
  "eventAttendanceMode": string;
  "eventStatus": string;
  "location": {
    "@type": string;
    "name": string;
    "geo": {
      "@type": string;
      "latitude": string;
      "longitude": string;
    };
  };
  "description": string;
}

function getVisibilityDescription(rating: number): string {
  switch (rating) {
    case 1:
      return "poor";
    case 2:
      return "fair";
    case 3:
      return "good";
    case 4:
      return "excellent";
    default:
      return "poor";
  }
}

function getLocationName(location: Location): string {
  // First check if there's a saved location with a matched name from localStorage
  try {
    const savedLocation = localStorage.getItem("milkyway-location");
    if (savedLocation) {
      const parsed = JSON.parse(savedLocation);
      if (parsed.matchedName && Math.abs(parsed.lat - location.lat) < 0.01 && Math.abs(parsed.lng - location.lng) < 0.01) {
        return parsed.matchedName;
      }
    }
  } catch {
    // Fall through to other methods if localStorage fails
  }

  // Try to find nearest special location
  const nearestLocation = findNearestSpecialLocation(location, 100); // 100km threshold
  if (nearestLocation && nearestLocation.matchedName) {
    return nearestLocation.matchedName;
  }

  // Fallback to coordinates
  return `Location ${location.lat.toFixed(1)}, ${location.lng.toFixed(1)}`;
}

export function generateEventStructuredData(
  weekData: WeekData,
  location: Location
): StructuredEventData | null {
  // Only generate structured data for weeks with optimal viewing windows
  if (!weekData.optimalWindow.startTime || !weekData.optimalWindow.endTime || weekData.visibility === 0) {
    return null;
  }

  const startDate = weekData.optimalWindow.startTime;
  const endDate = weekData.optimalWindow.endTime;
  
  // Format dates in ISO 8601 format with proper timezone handling
  const startDateISO = formatDateForStructuredData(startDate, location);
  const endDateISO = formatDateForStructuredData(endDate, location);

  const visibilityDesc = getVisibilityDescription(weekData.visibility);
  const starRating = "★".repeat(weekData.visibility);
  const duration = weekData.gcDuration;
  
  let moonDesc = "";
  if (weekData.moonIllumination > 0.05) {
    const moonPercent = Math.round(weekData.moonIllumination * 100);
    moonDesc = `, moon ${moonPercent}% illuminated`;
  } else {
    moonDesc = ", featuring a dark sky with minimal moon interference";
  }

  const description = `A night with ${visibilityDesc} (${starRating}) visibility for observing the Milky Way galactic core${moonDesc}. Optimal viewing window lasts ${duration}.`;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `Optimal Milky Way Viewing at ${getLocationName(location)}`,
    "startDate": startDateISO,
    "endDate": endDateISO,
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": getLocationName(location),
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": location.lat.toString(),
        "longitude": location.lng.toString()
      }
    },
    "description": description
  };
}

export function generateStructuredDataScript(structuredData: StructuredEventData): string {
  return `<script type="application/ld+json">\n${JSON.stringify(structuredData, null, 2)}\n</script>`;
}