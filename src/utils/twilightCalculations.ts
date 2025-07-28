import * as SunCalc from 'suncalc'
import { Location, TwilightData } from '../types/astronomy'

// Add custom times for proper astronomical twilight calculation
// Astronomical twilight: sun at -18° below horizon
SunCalc.addTime(-18, 'astronomicalDawn', 'astronomicalDusk')

// Extend SunCalc types to include our custom times
interface ExtendedTimes extends SunCalc.GetTimesResult {
  astronomicalDawn: Date
  astronomicalDusk: Date
}

export function calculateTwilightTimes(date: Date, location: Location): TwilightData {
  try {
    // Debug for Sep 21
    const debugDate = date.toISOString().split('T')[0]
    if (debugDate === '2025-09-21') {  
      console.log(`Twilight calculation for ${debugDate}:`, date)
    }
    
    const times = SunCalc.getTimes(date, location.lat, location.lng) as ExtendedTimes
    
    // Always get astronomical dawn from the next day for proper night window calculation
    // This ensures the dark window spans from dusk today to dawn tomorrow
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)
    const nextTimes = SunCalc.getTimes(nextDay, location.lat, location.lng) as ExtendedTimes
    const astronomicalDawn = nextTimes.astronomicalDawn
    
    // Debug for Sep 21
    if (debugDate === '2025-09-21') {  
      console.log(`  astronomicalDusk (night starts): ${times.astronomicalDusk.toLocaleString()}`)
      console.log(`  astronomicalDawn (night ends): ${astronomicalDawn.toLocaleString()}`)
    }
    
    return {
      dawn: times.dawn,
      dusk: times.dusk,
      night: times.astronomicalDusk, // When astronomical night begins (sun at -18°)
      dayEnd: astronomicalDawn // When astronomical night ends (sun at -18°) - next day
    }
  } catch (error) {
    console.error('Error calculating twilight times:', error)
    const fallback = new Date(date)
    return {
      dawn: new Date(fallback.setHours(6, 0, 0, 0)),
      dusk: new Date(fallback.setHours(18, 0, 0, 0)),
      night: new Date(fallback.setHours(20, 0, 0, 0)),
      dayEnd: new Date(fallback.setHours(4, 0, 0, 0))
    }
  }
}

export function isDarkTime(date: Date, twilightData: TwilightData): boolean {
  const time = date.getTime()
  
  // Dark time is between astronomical twilight end and start
  if (twilightData.night.getTime() < twilightData.dayEnd.getTime()) {
    // Normal case: night falls then day starts
    return time >= twilightData.night.getTime() && time <= twilightData.dayEnd.getTime()
  } else {
    // Edge case: night spans midnight
    return time >= twilightData.night.getTime() || time <= twilightData.dayEnd.getTime()
  }
}

export function calculateDarkDuration(twilightData: TwilightData): number {
  // Calculate duration of astronomical darkness in hours
  const nightStart = twilightData.night.getTime()
  const nightEnd = twilightData.dayEnd.getTime()
  
  let duration: number
  if (nightEnd > nightStart) {
    duration = nightEnd - nightStart
  } else {
    // Night spans midnight
    duration = (24 * 60 * 60 * 1000) - (nightStart - nightEnd)
  }
  
  return duration / (1000 * 60 * 60) // Convert to hours
}