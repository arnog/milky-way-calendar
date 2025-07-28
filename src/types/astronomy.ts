export interface Location {
  lat: number
  lng: number
}

export interface WeekData {
  weekNumber: number
  startDate: Date
  visibility: number // 1-4 stars
  moonPhase: number // 0-7 for different moon phases
  moonIllumination: number // 0-1
  gcTime: string // Optimal viewing start time
  gcDuration: string // Duration of optimal viewing
  gcAltitude: number // Maximum altitude of GC
  twilightEnd: Date | null // When astronomical twilight ends
  twilightStart: Date | null // When astronomical twilight starts
  optimalConditions: string // Description of viewing conditions
}

export interface GalacticCenterData {
  altitude: number
  azimuth: number
  isVisible: boolean // Above 20° horizon
  riseTime: Date | null
  setTime: Date | null
  transitTime: Date | null
}

export interface MoonData {
  phase: number // 0-1 (new to full)
  illumination: number // 0-1
  altitude: number
  azimuth: number
  rise: Date | null
  set: Date | null
}

export interface TwilightData {
  dawn: Date
  dusk: Date
  night: Date // Astronomical twilight
  dayEnd: Date // Astronomical twilight
}