import { Location } from '../types/astronomy'
import { SPECIAL_LOCATIONS } from './locations'

interface ParsedLocation {
  location: Location
  matchedName?: string
}

// Parse location from various formats
export function parseLocationInput(input: string): ParsedLocation | null {
  const trimmed = input.trim()
  
  // First try to match against special locations
  const locationMatch = findMatchingLocation(trimmed)
  if (locationMatch) {
    return locationMatch
  }
  
  // Try decimal degrees: "lat, lng" or "lat,lng"
  const decimalMatch = trimmed.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/)
  if (decimalMatch) {
    const lat = parseFloat(decimalMatch[1])
    const lng = parseFloat(decimalMatch[2])
    if (isValidCoordinate(lat, lng)) {
      return { location: { lat, lng } }
    }
  }
  
  // Try DMS format: "37° 46' 30.64" N, 122° 25' 9.84" W"
  const dmsMatch = trimmed.match(/(\d+)°\s*(\d+)'\s*([\d.]+)"\s*([NS]),?\s*(\d+)°\s*(\d+)'\s*([\d.]+)"\s*([EW])/i)
  if (dmsMatch) {
    const lat = dmsToDecimal(
      parseInt(dmsMatch[1]),
      parseInt(dmsMatch[2]),
      parseFloat(dmsMatch[3]),
      dmsMatch[4].toUpperCase()
    )
    const lng = dmsToDecimal(
      parseInt(dmsMatch[5]),
      parseInt(dmsMatch[6]),
      parseFloat(dmsMatch[7]),
      dmsMatch[8].toUpperCase()
    )
    if (isValidCoordinate(lat, lng)) {
      return { location: { lat, lng } }
    }
  }
  
  // Try DDM format: "37° 46.510' N, 122° 25.164' W"
  const ddmMatch = trimmed.match(/(\d+)°\s*([\d.]+)'\s*([NS]),?\s*(\d+)°\s*([\d.]+)'\s*([EW])/i)
  if (ddmMatch) {
    const lat = ddmToDecimal(
      parseInt(ddmMatch[1]),
      parseFloat(ddmMatch[2]),
      ddmMatch[3].toUpperCase()
    )
    const lng = ddmToDecimal(
      parseInt(ddmMatch[4]),
      parseFloat(ddmMatch[5]),
      ddmMatch[6].toUpperCase()
    )
    if (isValidCoordinate(lat, lng)) {
      return { location: { lat, lng } }
    }
  }
  
  return null
}

// Find matching location from special locations list
function findMatchingLocation(input: string): ParsedLocation | null {
  const lowerInput = input.toLowerCase()
  
  // First try exact match
  for (const loc of SPECIAL_LOCATIONS) {
    const name = loc[0] as string
    if (name.toLowerCase() === lowerInput) {
      return {
        location: { lat: loc[1] as number, lng: loc[2] as number },
        matchedName: name
      }
    }
  }
  
  // Then try partial match
  const matches = SPECIAL_LOCATIONS.filter(loc => {
    const name = (loc[0] as string).toLowerCase()
    return name.includes(lowerInput) || lowerInput.includes(name)
  })
  
  if (matches.length === 1) {
    return {
      location: { lat: matches[0][1] as number, lng: matches[0][2] as number },
      matchedName: matches[0][0] as string
    }
  }
  
  // If multiple matches, prefer shorter names (more specific)
  if (matches.length > 1) {
    const bestMatch = matches.reduce((prev, curr) => 
      (curr[0] as string).length < (prev[0] as string).length ? curr : prev
    )
    return {
      location: { lat: bestMatch[1] as number, lng: bestMatch[2] as number },
      matchedName: bestMatch[0] as string
    }
  }
  
  return null
}

// Convert DMS to decimal degrees
function dmsToDecimal(degrees: number, minutes: number, seconds: number, direction: string): number {
  const decimal = degrees + minutes / 60 + seconds / 3600
  return (direction === 'S' || direction === 'W') ? -decimal : decimal
}

// Convert DDM to decimal degrees
function ddmToDecimal(degrees: number, minutes: number, direction: string): number {
  const decimal = degrees + minutes / 60
  return (direction === 'S' || direction === 'W') ? -decimal : decimal
}

// Validate coordinate ranges
function isValidCoordinate(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

// Calculate distance between two locations in km
export function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(loc2.lat - loc1.lat)
  const dLng = toRad(loc2.lng - loc1.lng)
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Find nearest special location within threshold
export function findNearestSpecialLocation(location: Location, thresholdKm: number = 100): ParsedLocation | null {
  let nearest: ParsedLocation | null = null
  let minDistance = thresholdKm
  
  for (const loc of SPECIAL_LOCATIONS) {
    const specialLoc = { lat: loc[1] as number, lng: loc[2] as number }
    const distance = calculateDistance(location, specialLoc)
    
    if (distance < minDistance) {
      minDistance = distance
      nearest = {
        location: specialLoc,
        matchedName: loc[0] as string
      }
    }
  }
  
  return nearest
}