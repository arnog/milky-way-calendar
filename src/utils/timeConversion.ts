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
 * Check if an event is more than 12 hours away from current time
 */
export function isEventDistant(eventTime: Date, currentTime: Date): boolean {
  const timeDiff = Math.abs(eventTime.getTime() - currentTime.getTime());
  const twelveHours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
  return timeDiff > twelveHours;
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

