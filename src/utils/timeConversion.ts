import { Location } from "../types/astronomy";
import { formatTimeInLocationTimezone } from "./timezoneUtils";

/**
 * Convert a Date to a 12-hour clock angle in degrees (0-360)
 * 12 o'clock = 0°, 3 o'clock = 90°, 6 o'clock = 180°, 9 o'clock = 270°
 */
export function timeToAngle(date: Date, location: Location): number {
  const timeString = formatTimeInLocationTimezone(date, location);
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Calculate total minutes from midnight
  const totalMinutes = hours * 60 + minutes;
  
  // Convert to 12-hour format (720 minutes = 12 hours)
  const minutes12 = totalMinutes % 720;
  
  // Convert to degrees (720 minutes = 360 degrees)
  // 0 minutes (midnight/noon) = 0° (12 o'clock position at top)
  const angle = (minutes12 / 720) * 360;
  
  return angle;
}

/**
 * Convert minutes from midnight to clock angle
 */
export function minutesToAngle(minutes: number): number {
  // Convert to 12-hour format (wrap at 720 minutes)
  const minutes12 = minutes % 720;
  
  // Convert to degrees (720 minutes = 360 degrees)
  // 0 minutes (midnight/noon) = 0° (12 o'clock position at top)
  const angle = (minutes12 / 720) * 360;
  
  return angle;
}

/**
 * Calculate the angle span between two times, handling day wraparound
 */
export function calculateAngleSpan(startAngle: number, endAngle: number): number {
  if (endAngle >= startAngle) {
    return endAngle - startAngle;
  } else {
    // Handle wraparound (e.g., 11 PM to 1 AM)
    return (360 - startAngle) + endAngle;
  }
}

/**
 * Check if an event should be displayed with reduced opacity
 * Reduced opacity if:
 * - Event is before 6pm the same day
 * - Event is after 6am the next day
 */
export function isEventDistant(eventTime: Date, currentTime: Date): boolean {
  const eventHours = eventTime.getHours();
  
  // Get date parts for comparison
  const eventDate = new Date(eventTime.getFullYear(), eventTime.getMonth(), eventTime.getDate());
  const currentDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
  
  const daysDiff = Math.floor((eventDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000));
  
  // Same day: show reduced opacity if before 6pm (18:00)
  if (daysDiff === 0 && eventHours < 18) {
    return true;
  }
  
  // Next day: show reduced opacity if after 6am (06:00)
  if (daysDiff === 1 && eventHours >= 6) {
    return true;
  }
  
  // Any other day difference
  if (daysDiff < 0 || daysDiff > 1) {
    return true;
  }
  
  return false;
}

/**
 * Get the current time angle for the location
 */
export function getCurrentTimeAngle(location: Location, currentDate?: Date): number {
  const now = currentDate || new Date();
  return timeToAngle(now, location);
}

/**
 * Calculate position for labels around the clock perimeter
 */
export function getClockLabelPosition(
  angle: number, 
  radius: number, 
  centerX: number = 200, 
  centerY: number = 200
): { x: number; y: number } {
  // Convert angle to radians (SVG angles start from top, clockwise)
  const radians = (angle * Math.PI) / 180;
  
  return {
    x: centerX + radius * Math.sin(radians),
    y: centerY - radius * Math.cos(radians)
  };
}

