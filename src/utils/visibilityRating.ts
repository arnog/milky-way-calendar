import { GalacticCenterData, MoonData, TwilightData } from '../types/astronomy'
import { getMoonInterference } from './moonCalculations'
import { calculateDarkDuration } from './twilightCalculations'
import { OptimalViewingWindow } from './optimalViewing'

export function calculateVisibilityRating(
  gcData: GalacticCenterData,
  moonData: MoonData,
  twilightData: TwilightData,
  optimalWindow?: OptimalViewingWindow
): number {
  // Factors that affect Milky Way visibility:
  // 1. Galactic Center altitude (≥20° is ideal)
  // 2. Moon interference (illumination + altitude)
  // 3. Dark time duration
  // 4. Actual optimal viewing window availability
  
  // If there's no actual optimal viewing window (no start time or daylight hours), 
  // there should be no stars (0 stars = no visibility)
  if (optimalWindow && (!optimalWindow.startTime || optimalWindow.duration <= 0)) {
    return 0 // No visibility if no actual viewing opportunity
  }
  
  // Also check if the start time is during daylight hours (would be hidden from display)
  if (optimalWindow && optimalWindow.startTime) {
    const hour = optimalWindow.startTime.getHours()
    if (hour >= 6 && hour <= 18) {
      return 0 // No visibility if only visible during daylight
    }
  }
  
  let score = 0
  
  // 1. Galactic Center altitude factor (0-50 points)
  if (gcData.altitude >= 20) {
    // Excellent visibility when GC is high - scale from 30 to 50 points
    score += Math.min(50, (gcData.altitude - 20) * 1.5 + 30)
  } else if (gcData.altitude > 0) {
    // Reduced visibility when GC is low but still above horizon - scale from 0 to 30
    score += gcData.altitude * 1.5
  }
  // No points if GC is below horizon
  
  // 2. Moon interference factor (0-30 points penalty)
  const moonInterference = getMoonInterference(moonData)
  const moonPenalty = moonInterference * 30
  score -= moonPenalty
  
  // 3. Dark time duration factor (0-30 points) 
  const darkHours = calculateDarkDuration(twilightData)
  if (darkHours >= 8) {
    score += 30 // Very long dark period
  } else if (darkHours >= 6) {
    score += 25 // Long dark period
  } else if (darkHours >= 4) {
    score += 20 // Moderate dark period
  } else if (darkHours >= 2) {
    score += 10 // Short dark period
  }
  // No points for very short or no dark time
  
  
  // Convert score to 1-4 star rating
  // Ensure minimum score of 0
  score = Math.max(0, score)
  
  
  if (score >= 60) return 4 // Excellent (⭐⭐⭐⭐)
  if (score >= 45) return 3 // Good (⭐⭐⭐)
  if (score >= 25) return 2 // Fair (⭐⭐)
  return 1 // Poor (⭐)
}

export function getVisibilityBackground(stars: number): string {
  switch (stars) {
    case 0: return 'bg-gray-950'
    case 1: return 'bg-gray-900'
    case 2: return 'bg-gray-800'
    case 3: return 'bg-blue-900/50'
    case 4: return 'bg-gradient-to-r from-blue-900/70 to-purple-800/50 relative'
    default: return 'bg-gray-950'
  }
}

export function getStarsDisplay(count: number): string {
  return count === 0 ? '—' : '⭐'.repeat(count)
}

export function getVisibilityDescription(stars: number): string {
  switch (stars) {
    case 0: return 'No visibility - Milky Way not visible during dark hours'
    case 1: return 'Poor visibility - significant light pollution or unfavorable conditions'
    case 2: return 'Fair visibility - some details visible with patience'
    case 3: return 'Good visibility - clear Milky Way structure visible'
    case 4: return 'Excellent visibility - optimal conditions for observation and photography'
    default: return 'Unknown visibility'
  }
}