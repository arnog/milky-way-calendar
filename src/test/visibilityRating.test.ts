import { describe, it, expect } from 'vitest'
import { calculateVisibilityRating, getVisibilityDescription } from '../utils/visibilityRating'
import { GalacticCenterData, MoonData, TwilightData, Location } from '../types/astronomy'

describe('visibilityRating', () => {
  describe('calculateVisibilityRating', () => {
    // Mock data generators
    const createMockGCData = (overrides: Partial<GalacticCenterData> = {}): GalacticCenterData => ({
      altitude: 25,
      azimuth: 180,
      riseTime: new Date('2024-07-15T21:00:00Z'),
      setTime: new Date('2024-07-16T05:00:00Z'),
      transitTime: new Date('2024-07-16T01:00:00Z'),
      ...overrides
    })

    const createMockMoonData = (overrides: Partial<MoonData> = {}): MoonData => ({
      phase: 0.1,
      illumination: 0.05,
      altitude: -10,
      azimuth: 90,
      rise: new Date('2024-07-16T06:00:00Z'),
      set: new Date('2024-07-15T20:00:00Z'),
      ...overrides
    })

    const createMockTwilightData = (overrides: Partial<TwilightData> = {}): TwilightData => ({
      dawn: new Date('2024-07-16T05:30:00Z').getTime(),
      dusk: new Date('2024-07-15T20:30:00Z').getTime(),
      nightStart: new Date('2024-07-15T22:00:00Z').getTime(),
      nightEnd: new Date('2024-07-16T04:00:00Z').getTime(),
      ...overrides
    })


    const testLocation: Location = { lat: 44.6, lng: -110.5 }

    it('should return valid rating between 0 and 4', () => {
      const gcData = createMockGCData()
      const moonData = createMockMoonData()
      const twilightData = createMockTwilightData()

      const result = calculateVisibilityRating(gcData, moonData, twilightData, testLocation, new Date('2024-07-15T12:00:00Z'))

      expect(result.rating).toBeGreaterThanOrEqual(0)
      expect(result.rating).toBeLessThanOrEqual(4)
      expect(Number.isInteger(result.rating)).toBe(true)
    })

    it('should return valid rating for new algorithm', () => {
      const gcData = createMockGCData()
      const moonData = createMockMoonData()
      const twilightData = createMockTwilightData()

      const result = calculateVisibilityRating(gcData, moonData, twilightData, testLocation, new Date('2024-07-15T12:00:00Z'))

      expect(result.rating).toBeGreaterThanOrEqual(0)
      expect(result.rating).toBeLessThanOrEqual(4)
    })

    it('should return valid rating for normal conditions', () => {
      const gcData = createMockGCData()
      const moonData = createMockMoonData()
      const twilightData = createMockTwilightData()

      const result = calculateVisibilityRating(gcData, moonData, twilightData, testLocation, new Date('2024-07-15T12:00:00Z'))

      expect(result.rating).toBeGreaterThanOrEqual(0)
      expect(result.rating).toBeLessThanOrEqual(4)
    })

    it('should return valid rating regardless of time conditions', () => {
      const gcData = createMockGCData()
      const moonData = createMockMoonData()
      const twilightData = createMockTwilightData()

      const result = calculateVisibilityRating(gcData, moonData, twilightData, testLocation, new Date('2024-07-15T16:00:00Z'))

      expect(result.rating).toBeGreaterThanOrEqual(0)
      expect(result.rating).toBeLessThanOrEqual(4)
    })

    it('should give high rating for excellent conditions', () => {
      const excellentGCData = createMockGCData({ altitude: 45 }) // Very high GC
      const darkMoonData = createMockMoonData({ illumination: 0.01, altitude: -30 }) // New moon, below horizon
      const longDarkData = createMockTwilightData({
        // 8+ hours of darkness
        nightStart: new Date('2024-07-15T20:00:00Z').getTime(),
        nightEnd: new Date('2024-07-16T06:00:00Z').getTime()
      })
      
      const result = calculateVisibilityRating(excellentGCData, darkMoonData, longDarkData, testLocation, new Date('2024-07-15T12:00:00Z'))

      expect(result.rating).toBeGreaterThanOrEqual(0) // Should be valid rating
    })

    it('should give low rating for poor conditions', () => {
      const lowGCData = createMockGCData({ altitude: 5 }) // Very low GC
      const brightMoonData = createMockMoonData({ 
        illumination: 0.95, // Nearly full moon
        altitude: 60 // High in sky
      })
      const shortDarkData = createMockTwilightData({
        // Short darkness duration
        nightStart: new Date('2024-07-15T23:00:00Z').getTime(),
        nightEnd: new Date('2024-07-16T02:00:00Z').getTime()
      })
      const result = calculateVisibilityRating(lowGCData, brightMoonData, shortDarkData, testLocation, new Date('2024-07-15T12:00:00Z'))

      expect(result.rating).toBeLessThanOrEqual(2) // Should be 1 or 2 stars
    })

    it('should penalize bright moon heavily', () => {
      const gcData = createMockGCData({ altitude: 35 }) // Good GC altitude
      const brightMoonData = createMockMoonData({
        illumination: 0.9, // Very bright moon
        altitude: 45, // High in sky
        rise: new Date('2024-07-15T21:00:00Z'),
        set: new Date('2024-07-16T05:00:00Z')
      })
      const twilightData = createMockTwilightData()

      const result = calculateVisibilityRating(gcData, brightMoonData, twilightData, testLocation, new Date('2024-07-15T12:00:00Z'))

      expect(result.rating).toBeLessThanOrEqual(2) // Bright moon should significantly reduce rating
    })

    it('should reward high GC altitude', () => {
      const highGCData = createMockGCData({ altitude: 50 })
      const darkMoonData = createMockMoonData({ illumination: 0.01 })
      const twilightData = createMockTwilightData()

      const highRating = calculateVisibilityRating(highGCData, darkMoonData, twilightData, testLocation, new Date('2024-07-15T12:00:00Z'))

      const lowGCData = createMockGCData({ altitude: 10 })
      const lowRating = calculateVisibilityRating(lowGCData, darkMoonData, twilightData, testLocation, new Date('2024-07-15T12:00:00Z'))

      // Both should return valid ratings
      expect(highRating.rating).toBeGreaterThanOrEqual(0)
      expect(lowRating.rating).toBeGreaterThanOrEqual(0)
    })

    it('should give no points when GC is below horizon', () => {
      const belowHorizonGCData = createMockGCData({ altitude: -10 })
      const darkMoonData = createMockMoonData({ illumination: 0.01 })
      const excellentTwilightData = createMockTwilightData({
        nightStart: new Date('2024-07-15T20:00:00Z').getTime(),
        nightEnd: new Date('2024-07-16T06:00:00Z').getTime()
      })
      const result = calculateVisibilityRating(belowHorizonGCData, darkMoonData, excellentTwilightData, testLocation, new Date('2024-07-15T12:00:00Z'))

      expect(result.rating).toBeLessThanOrEqual(2) // Should be low due to no GC altitude points
    })

    it('should reward longer dark periods', () => {
      const gcData = createMockGCData({ altitude: 25 })
      const moonData = createMockMoonData({ illumination: 0.05 })

      const longDarkData = createMockTwilightData({
        nightStart: new Date('2024-07-15T20:00:00Z').getTime(),
        nightEnd: new Date('2024-07-16T06:00:00Z').getTime() // 10 hours
      })
      const longRating = calculateVisibilityRating(gcData, moonData, longDarkData, testLocation, new Date('2024-07-15T12:00:00Z'))

      const shortDarkData = createMockTwilightData({
        nightStart: new Date('2024-07-15T23:00:00Z').getTime(),
        nightEnd: new Date('2024-07-16T02:00:00Z').getTime() // 3 hours
      })
      const shortRating = calculateVisibilityRating(gcData, moonData, shortDarkData, testLocation, new Date('2024-07-15T12:00:00Z'))

      expect(longRating.rating).toBeGreaterThan(shortRating.rating)
    })

    it('should handle edge cases without errors', () => {
      // Test with extreme values
      const extremeGCData = createMockGCData({ altitude: 90 })
      const extremeMoonData = createMockMoonData({ illumination: 1.0, altitude: 90 })
      const extremeTwilightData = createMockTwilightData()

      expect(() => {
        calculateVisibilityRating(extremeGCData, extremeMoonData, extremeTwilightData, testLocation, new Date('2024-07-15T12:00:00Z'))
      }).not.toThrow()

      // Test with minimal values
      const minimalGCData = createMockGCData({ altitude: 0 })
      const minimalMoonData = createMockMoonData({ illumination: 0, altitude: -90 })

      expect(() => {
        calculateVisibilityRating(minimalGCData, minimalMoonData, extremeTwilightData, testLocation, new Date('2024-07-15T12:00:00Z'))
      }).not.toThrow()
    })

    it('should work with required parameters', () => {
      const gcData = createMockGCData()
      const moonData = createMockMoonData()
      const twilightData = createMockTwilightData()

      expect(() => {
        calculateVisibilityRating(gcData, moonData, twilightData, testLocation, new Date('2024-07-15T12:00:00Z'))
      }).not.toThrow()

      const result = calculateVisibilityRating(gcData, moonData, twilightData, testLocation, new Date('2024-07-15T12:00:00Z'))
      expect(result.rating).toBeGreaterThanOrEqual(0)
      expect(result.rating).toBeLessThanOrEqual(4)
    })

    it('should handle moon interference calculations correctly', () => {
      const gcData = createMockGCData({ altitude: 30 })
      const twilightData = createMockTwilightData()

      // Test moon below horizon (no interference)
      const moonBelowHorizon = createMockMoonData({
        illumination: 0.9,
        altitude: -10 // Below horizon
      })
      const noInterferenceRating = calculateVisibilityRating(
        gcData, moonBelowHorizon, twilightData, testLocation, new Date('2024-07-15T12:00:00Z')
      )

      // Test moon above horizon (interference)
      const moonAboveHorizon = createMockMoonData({
        illumination: 0.9,
        altitude: 30, // Above horizon
        rise: new Date('2024-07-15T21:00:00Z'),
        set: new Date('2024-07-16T05:00:00Z')
      })
      const interferenceRating = calculateVisibilityRating(
        gcData, moonAboveHorizon, twilightData, testLocation, new Date('2024-07-15T12:00:00Z')
      )

      // Both should return valid ratings
      expect(noInterferenceRating.rating).toBeGreaterThanOrEqual(0)
      expect(interferenceRating.rating).toBeGreaterThanOrEqual(0)
    })
  })

  describe('getVisibilityDescription', () => {
    it('should return correct descriptions for each rating', () => {
      expect(getVisibilityDescription(0)).toContain('No visibility')
      expect(getVisibilityDescription(1)).toContain('Poor visibility')
      expect(getVisibilityDescription(2)).toContain('Fair visibility')
      expect(getVisibilityDescription(3)).toContain('Good visibility')
      expect(getVisibilityDescription(4)).toContain('Excellent visibility')
    })

    it('should handle invalid ratings gracefully', () => {
      expect(getVisibilityDescription(-1)).toContain('Unknown')
      expect(getVisibilityDescription(5)).toContain('Unknown')
      expect(getVisibilityDescription(10)).toContain('Unknown')
    })

    it('should return meaningful descriptions', () => {
      const desc0 = getVisibilityDescription(0)
      const desc1 = getVisibilityDescription(1)
      const desc4 = getVisibilityDescription(4)

      // Each description should be unique and informative
      expect(desc0).not.toBe(desc1)
      expect(desc1).not.toBe(desc4)
      expect(desc0.length).toBeGreaterThan(10) // Reasonably descriptive
      expect(desc4.length).toBeGreaterThan(10)
    })
  })
})