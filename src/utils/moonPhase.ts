/**
 * Moon phase utilities for consistent phase calculation and icon selection
 */

/**
 * Get the appropriate moon phase icon name based on phase and hemisphere
 * @param phase - Moon phase as a decimal (0-1, where 0.5 is full moon)
 * @param latitude - Observer's latitude (determines hemisphere)
 * @returns Icon name for the moon phase
 */
export function getMoonPhaseIcon(phase: number, latitude: number): string {
  // Phase is 0-1, where 0.5 is full moon
  // In southern hemisphere, phases appear flipped horizontally
  const isNorthernHemisphere = latitude >= 0;

  // New Moon and Full Moon appear the same in both hemispheres
  if (phase < 0.0625 || phase >= 0.9375) return "moon-new"; // New Moon
  if (phase >= 0.4375 && phase < 0.5625) return "moon-full"; // Full Moon

  // For crescent and quarter phases, flip the icons in southern hemisphere
  if (isNorthernHemisphere) {
    // Northern hemisphere - standard orientation
    if (phase < 0.1875) return "moon-waxing-crescent"; // Waxing Crescent
    if (phase < 0.3125) return "moon-first-quarter"; // First Quarter
    if (phase < 0.4375) return "moon-waxing-gibbous"; // Waxing Gibbous
    if (phase < 0.6875) return "moon-waning-gibbous"; // Waning Gibbous
    if (phase < 0.8125) return "moon-third-quarter"; // Third Quarter
    return "moon-waning-crescent"; // Waning Crescent
  } else {
    // Southern hemisphere - flip waxing/waning phases
    if (phase < 0.1875) return "moon-waning-crescent"; // Waxing Crescent (appears as waning crescent)
    if (phase < 0.3125) return "moon-third-quarter"; // First Quarter (appears as third quarter)
    if (phase < 0.4375) return "moon-waning-gibbous"; // Waxing Gibbous (appears as waning gibbous)
    if (phase < 0.6875) return "moon-waxing-gibbous"; // Waning Gibbous (appears as waxing gibbous)
    if (phase < 0.8125) return "moon-first-quarter"; // Third Quarter (appears as first quarter)
    return "moon-waxing-crescent"; // Waning Crescent (appears as waxing crescent)
  }
}

/**
 * Get human-readable moon phase name
 * @param phase - Moon phase as a decimal (0-1, where 0.5 is full moon)
 * @returns Human-readable phase name
 */
export function getMoonPhaseName(phase: number): string {
  // Phase is 0-1, where 0.5 is full moon
  if (phase < 0.0625 || phase >= 0.9375) return "New Moon";
  if (phase < 0.1875) return "Waxing Crescent";
  if (phase < 0.3125) return "First Quarter";
  if (phase < 0.4375) return "Waxing Gibbous";
  if (phase < 0.5625) return "Full Moon";
  if (phase < 0.6875) return "Waning Gibbous";
  if (phase < 0.8125) return "Third Quarter";
  return "Waning Crescent";
}
