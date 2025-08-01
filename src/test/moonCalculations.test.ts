import { describe, it, expect } from 'vitest'
import { calculateMoonData, getMoonPhaseEmoji, getMoonInterference } from '../utils/moonCalculations'
import { Location } from '../types/astronomy'

describe('moonCalculations', () => {
  const testLocation: Location = { lat: 44.6, lng: -110.5 }

  describe('calculateMoonData', () => {
    it('should return valid moon data structure', () => {
      const date = new Date('2024-07-15T00:00:00Z')
      const result = calculateMoonData(date, testLocation)

      expect(result).toHaveProperty('phase')
      expect(result).toHaveProperty('illumination')
      expect(result).toHaveProperty('altitude')
      expect(result).toHaveProperty('azimuth')
      expect(result).toHaveProperty('rise')
      expect(result).toHaveProperty('set')

      expect(typeof result.phase).toBe('number')
      expect(typeof result.illumination).toBe('number')
      expect(typeof result.altitude).toBe('number')
      expect(typeof result.azimuth).toBe('number')
    })

    it('should return reasonable phase values', () => {
      const date = new Date('2024-07-15T00:00:00Z')
      const result = calculateMoonData(date, testLocation)

      expect(result.phase).toBeGreaterThanOrEqual(0)
      expect(result.phase).toBeLessThanOrEqual(1)
    })

    it('should return reasonable illumination values', () => {
      const date = new Date('2024-07-15T00:00:00Z')
      const result = calculateMoonData(date, testLocation)

      expect(result.illumination).toBeGreaterThanOrEqual(0)
      expect(result.illumination).toBeLessThanOrEqual(1)
    })

    it('should return reasonable altitude values', () => {
      const date = new Date('2024-07-15T00:00:00Z')
      const result = calculateMoonData(date, testLocation)

      expect(result.altitude).toBeGreaterThanOrEqual(-90)
      expect(result.altitude).toBeLessThanOrEqual(90)
    })

    it('should return reasonable azimuth values', () => {
      const date = new Date('2024-07-15T00:00:00Z')
      const result = calculateMoonData(date, testLocation)

      expect(result.azimuth).toBeGreaterThanOrEqual(0)
      expect(result.azimuth).toBeLessThan(360)
    })

    it('should handle different locations correctly', () => {
      const date = new Date('2024-07-15T12:00:00Z')
      const locations = [
        { lat: 44.6, lng: -110.5 }, // Yellowstone
        { lat: -33.9, lng: 151.2 }, // Sydney
        { lat: 51.5, lng: -0.1 }    // London
      ]

      locations.forEach(location => {
        expect(() => {
          calculateMoonData(date, location)
        }).not.toThrow()

        const result = calculateMoonData(date, location)
        expect(result.illumination).toBeGreaterThanOrEqual(0)
        expect(result.illumination).toBeLessThanOrEqual(1)
      })
    })

    it('should handle rise/set times correctly', () => {
      const date = new Date('2024-07-15T00:00:00Z')
      const result = calculateMoonData(date, testLocation)

      // Rise and set might be null in some cases (circumpolar)
      if (result.rise && result.set) {
        expect(result.rise).toBeInstanceOf(Date)
        expect(result.set).toBeInstanceOf(Date)
      }
    })
  })

  describe('getMoonPhaseEmoji', () => {
    it('should return correct emojis for different phases', () => {
      expect(getMoonPhaseEmoji(0)).toBe('🌑') // New Moon
      expect(getMoonPhaseEmoji(0.5)).toBe('🌕') // Full Moon
    })

    it('should handle edge cases', () => {
      expect(getMoonPhaseEmoji(-0.1)).toBe('🌑') // Should handle negative
      expect(getMoonPhaseEmoji(1.1)).toBe('🌑') // Values >= 0.9375 return new moon
    })

    it('should return valid moon emojis for all phases', () => {
      const phases = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875]
      const validEmojis = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘']

      phases.forEach(phase => {
        const emoji = getMoonPhaseEmoji(phase)
        expect(validEmojis).toContain(emoji)
      })
    })
  })

  describe('getMoonInterference', () => {
    it('should return 0 when moon is below horizon', () => {
      const moonData = {
        phase: 0.5,
        illumination: 1.0, // Full moon
        altitude: -10, // Below horizon
        azimuth: 180,
        rise: null,
        set: null
      }

      const interference = getMoonInterference(moonData)
      expect(interference).toBe(0)
    })

    it('should return interference when moon is above horizon', () => {
      const moonData = {
        phase: 0.5,
        illumination: 1.0, // Full moon
        altitude: 45, // High in sky
        azimuth: 180,
        rise: null,
        set: null
      }

      const interference = getMoonInterference(moonData)
      expect(interference).toBeGreaterThan(0)
      expect(interference).toBeLessThanOrEqual(1)
    })

    it('should increase interference with altitude', () => {
      const lowMoonData = {
        phase: 0.5,
        illumination: 0.8,
        altitude: 10, // Low in sky
        azimuth: 180,
        rise: null,
        set: null
      }

      const highMoonData = {
        phase: 0.5,
        illumination: 0.8,
        altitude: 60, // High in sky
        azimuth: 180,
        rise: null,
        set: null
      }

      const lowInterference = getMoonInterference(lowMoonData)
      const highInterference = getMoonInterference(highMoonData)

      expect(highInterference).toBeGreaterThan(lowInterference)
    })

    it('should increase interference with illumination', () => {
      const darkMoonData = {
        phase: 0.1,
        illumination: 0.1, // Dark moon
        altitude: 45,
        azimuth: 180,
        rise: null,
        set: null
      }

      const brightMoonData = {
        phase: 0.5,
        illumination: 0.9, // Bright moon
        altitude: 45,
        azimuth: 180,
        rise: null,
        set: null
      }

      const darkInterference = getMoonInterference(darkMoonData)
      const brightInterference = getMoonInterference(brightMoonData)

      expect(brightInterference).toBeGreaterThan(darkInterference)
    })

    it('should return values between 0 and 1', () => {
      const testCases = [
        { illumination: 0, altitude: -10 },
        { illumination: 1, altitude: 90 },
        { illumination: 0.5, altitude: 45 },
        { illumination: 0.1, altitude: 10 }
      ]

      testCases.forEach(({ illumination, altitude }) => {
        const moonData = {
          phase: 0.5,
          illumination,
          altitude,
          azimuth: 180,
          rise: null,
          set: null
        }

        const interference = getMoonInterference(moonData)
        expect(interference).toBeGreaterThanOrEqual(0)
        expect(interference).toBeLessThanOrEqual(1)
      })
    })
  })
})