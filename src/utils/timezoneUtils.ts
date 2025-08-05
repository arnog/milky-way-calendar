import tzLookup from "tz-lookup";
import type { Location } from "../types/astronomy";

interface TimezoneInfo {
  iana: string;
  offsetHours: number;
}

/**
 * Cache for timezone lookups to avoid repeated calculations
 */
const timezoneCache = new Map<string, TimezoneInfo>();

/**
 * Gets the IANA timezone identifier and offset for a given location
 * Uses a simplified approach that finds the closest timezone by geographical distance
 */
export function getLocationTimezone(location: Location): TimezoneInfo {
  const cacheKey = `${location.lat.toFixed(2)},${location.lng.toFixed(2)}`;

  if (timezoneCache.has(cacheKey)) {
    return timezoneCache.get(cacheKey)!;
  }

  try {
    // Get timezone using tz-lookup which converts coordinates to IANA timezone
    const ianaTimezone = tzLookup(location.lat, location.lng);

    if (!ianaTimezone) {
      // Fallback to longitude-based approximation if lookup fails
      const offsetHours = Math.round(location.lng / 15);
      const result: TimezoneInfo = {
        iana: "UTC",
        offsetHours,
      };
      timezoneCache.set(cacheKey, result);
      return result;
    }

    // Calculate current offset for the timezone using Intl.DateTimeFormat
    const now = new Date();
    const offsetMinutes = getTimezoneOffsetMinutes(ianaTimezone, now);
    const offsetHours = offsetMinutes / 60;

    const result: TimezoneInfo = {
      iana: ianaTimezone,
      offsetHours,
    };

    timezoneCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Error getting timezone for location:", error);

    // Fallback to longitude-based approximation
    const offsetHours = Math.round(location.lng / 15);
    const result: TimezoneInfo = {
      iana: "UTC",
      offsetHours,
    };
    timezoneCache.set(cacheKey, result);
    return result;
  }
}

/**
 * Gets the timezone offset in minutes for a given IANA timezone at a specific date
 */
function getTimezoneOffsetMinutes(ianaTimezone: string, date: Date): number {
  try {
    // Create formatter for the timezone
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: ianaTimezone,
      timeZoneName: "longOffset",
    });

    // Get the formatted parts
    const parts = formatter.formatToParts(date);
    const timeZoneName = parts.find(
      (part) => part.type === "timeZoneName",
    )?.value;

    if (timeZoneName) {
      // Parse offset like "GMT+05:30" or "GMT-08:00"
      const match = timeZoneName.match(/GMT([+-])(\d{2}):(\d{2})/);
      if (match) {
        const sign = match[1] === "+" ? 1 : -1;
        const hours = parseInt(match[2], 10);
        const minutes = parseInt(match[3], 10);
        return sign * (hours * 60 + minutes);
      }
    }

    // Fallback: calculate using Date objects
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
    const localTime = new Date(utcTime + 0 * 3600000); // UTC time
    const targetTime = new Date(
      localTime.toLocaleString("en-US", { timeZone: ianaTimezone }),
    );

    return Math.round((targetTime.getTime() - localTime.getTime()) / 60000);
  } catch (error) {
    console.error("Error calculating timezone offset:", error);
    return 0;
  }
}

/**
 * Formats a date in HH:MM format for the given location's timezone
 * Always uses 24-hour format without timezone suffix
 */
export function formatTimeInLocationTimezone(
  date: Date | undefined,
  location: Location,
): string {
  if (!date) return "—";

  try {
    const timezoneInfo = getLocationTimezone(location);

    // Format the time using Intl.DateTimeFormat with the proper timezone
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezoneInfo.iana,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return formatter.format(date);
  } catch (error) {
    console.error("Error formatting time in location timezone:", error);

    // Fallback to longitude-based approximation
    const timezoneOffset = Math.round(location.lng / 15);
    const localTime = new Date(
      date.getTime() + timezoneOffset * 60 * 60 * 1000,
    );
    const hours = localTime.getUTCHours().toString().padStart(2, "0");
    const minutes = localTime.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
}

/**
 * Formats a date for structured data with proper timezone offset
 * Returns ISO 8601 format with timezone offset (e.g., "2023-12-25T18:30:00+05:30")
 */
export function formatDateForStructuredData(
  date: Date,
  location: Location,
): string {
  try {
    const timezoneInfo = getLocationTimezone(location);

    // Format the date in the location's timezone
    const year = date.toLocaleString("en-US", {
      timeZone: timezoneInfo.iana,
      year: "numeric",
    });
    const month = date.toLocaleString("en-US", {
      timeZone: timezoneInfo.iana,
      month: "2-digit",
    });
    const day = date.toLocaleString("en-US", {
      timeZone: timezoneInfo.iana,
      day: "2-digit",
    });
    const hour = date.toLocaleString("en-US", {
      timeZone: timezoneInfo.iana,
      hour: "2-digit",
      hour12: false,
    });
    const minute = date.toLocaleString("en-US", {
      timeZone: timezoneInfo.iana,
      minute: "2-digit",
    });
    const second = date.toLocaleString("en-US", {
      timeZone: timezoneInfo.iana,
      second: "2-digit",
    });

    // Format the timezone offset
    const offsetHours = Math.floor(Math.abs(timezoneInfo.offsetHours));
    const offsetMinutes = Math.abs((timezoneInfo.offsetHours % 1) * 60);
    const offsetSign = timezoneInfo.offsetHours >= 0 ? "+" : "-";
    const offsetString = `${offsetSign}${offsetHours.toString().padStart(2, "0")}:${offsetMinutes.toString().padStart(2, "0")}`;

    return `${year}-${month}-${day}T${hour}:${minute}:${second}${offsetString}`;
  } catch (error) {
    console.error("Error formatting date for structured data:", error);

    // Fallback to longitude-based approximation
    const timezoneOffset = Math.round(location.lng / 15);
    const offsetString =
      timezoneOffset >= 0
        ? `+${timezoneOffset.toString().padStart(2, "0")}:00`
        : `-${Math.abs(timezoneOffset).toString().padStart(2, "0")}:00`;

    return date.toISOString().replace("Z", offsetString);
  }
}
