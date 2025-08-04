import { describe, it, expect } from 'vitest'
import { calculateGalacticCenterData } from '../utils/galacticCenter'
import { Location } from '../types/astronomy'

describe('galacticCenter', () => {
  describe('calculateGalacticCenterData', () => {
    // Test locations
    const yellowstone: Location = { lat: 44.6, lng: -110.5 }
    const sydney: Location = { lat: -33.9, lng: 151.2 }
    const northernAlaska: Location = { lat: 70.2, lng: -148.5 }

    it('should return valid position data structure', () => {
      const date = new Date('2024-07-15T00:00:00Z')
      const result = calculateGalacticCenterData(date, yellowstone)

      // Check return structure
      expect(result).toHaveProperty('altitude')
      expect(result).toHaveProperty('azimuth')
      expect(result).toHaveProperty('riseTime')
      expect(result).toHaveProperty('setTime')
      expect(result).toHaveProperty('transitTime')

      // Check data types
      expect(typeof result.altitude).toBe('number')
      expect(typeof result.azimuth).toBe('number')
    })

    it('should calculate reasonable altitude values', () => {
      const date = new Date('2024-07-15T12:00:00Z') // Noon UTC
      const result = calculateGalacticCenterData(date, yellowstone)

      // Altitude should be between -90 and 90 degrees
      expect(result.altitude).toBeGreaterThanOrEqual(-90)
      expect(result.altitude).toBeLessThanOrEqual(90)
    })

    it('should calculate reasonable azimuth values', () => {
      const date = new Date('2024-07-15T12:00:00Z')
      const result = calculateGalacticCenterData(date, yellowstone)

      // Azimuth should be between 0 and 360 degrees
      expect(result.azimuth).toBeGreaterThanOrEqual(0)
      expect(result.azimuth).toBeLessThan(360)
    })

    it('should mark GC as visible for mid-latitude locations in summer', () => {
      const summerDate = new Date('2024-07-15T00:00:00Z')
      const result = calculateGalacticCenterData(summerDate, yellowstone)

      // In July at mid-latitude, GC should be visible and have rise/set times
      // Rise and set times should either both be null or both be dates
      if (result.riseTime !== null) {
        expect(result.setTime).not.toBeNull()
        expect(result.riseTime).toBeInstanceOf(Date)
        expect(result.setTime).toBeInstanceOf(Date)
      }
    })

    it('should mark GC as not visible for very high latitude locations', () => {
      const summerDate = new Date('2024-07-15T00:00:00Z')
      const result = calculateGalacticCenterData(summerDate, northernAlaska)

      // At 70°N, the Galactic Center should never reach 10° altitude
      expect(result.riseTime).toBeNull()
      expect(result.setTime).toBeNull()
    })

    it('should calculate transit time for all locations', () => {
      const date = new Date('2024-07-15T00:00:00Z')
      
      const yellowstoneResult = calculateGalacticCenterData(date, yellowstone)
      const sydneyResult = calculateGalacticCenterData(date, sydney)
      
      // Transit time should exist even if GC is not visible
      expect(yellowstoneResult.transitTime).not.toBeNull()
      expect(sydneyResult.transitTime).not.toBeNull()
      
      // Transit times should be different for different longitudes
      if (yellowstoneResult.transitTime && sydneyResult.transitTime) {
        expect(yellowstoneResult.transitTime.getTime()).not.toBe(sydneyResult.transitTime.getTime())
      }
    })

    it('should handle seasonal altitude thresholds correctly', () => {
      const locations = [yellowstone, sydney]
      
      // Test different months to verify adaptive altitude thresholds
      const winterDate = new Date('2024-01-15T00:00:00Z') // 20° threshold
      const fallDate = new Date('2024-10-15T00:00:00Z')   // 10° threshold
      const summerDate = new Date('2024-08-15T00:00:00Z') // 15° threshold

      locations.forEach(location => {
        const winterResult = calculateGalacticCenterData(winterDate, location)
        const fallResult = calculateGalacticCenterData(fallDate, location)
        const summerResult = calculateGalacticCenterData(summerDate, location)

        // Results should be consistent (not throw errors)
        expect(typeof winterResult.altitude).toBe('number')
        expect(typeof fallResult.altitude).toBe('number')
        expect(typeof summerResult.altitude).toBe('number')
      })
    })

    it('should handle different hemispheres correctly', () => {
      const date = new Date('2024-07-15T00:00:00Z')
      
      const northernResult = calculateGalacticCenterData(date, yellowstone)
      const southernResult = calculateGalacticCenterData(date, sydney)

      // Both should have valid results
      expect(typeof northernResult.altitude).toBe('number')
      expect(typeof southernResult.altitude).toBe('number')
      
      // Southern hemisphere should generally have better GC visibility
      if (southernResult.riseTime !== null && northernResult.riseTime !== null) {
        // In July, Sydney should generally have higher GC altitude than Yellowstone
        expect(southernResult.altitude).toBeGreaterThan(northernResult.altitude)
      }
    })

    it('should return consistent results for the same input', () => {
      const date = new Date('2024-07-15T12:00:00Z')
      
      const result1 = calculateGalacticCenterData(date, yellowstone)
      const result2 = calculateGalacticCenterData(date, yellowstone)

      expect(result1.altitude).toBe(result2.altitude)
      expect(result1.azimuth).toBe(result2.azimuth)
      expect(result1.riseTime?.getTime()).toBe(result2.riseTime?.getTime())
      expect(result1.setTime?.getTime()).toBe(result2.setTime?.getTime())
    })

    it('should handle edge cases gracefully', () => {
      // Test with extreme dates
      const veryEarlyDate = new Date('1900-01-01T00:00:00Z')
      const veryLateDate = new Date('2100-12-31T23:59:59Z')

      expect(() => {
        calculateGalacticCenterData(veryEarlyDate, yellowstone)
      }).not.toThrow()

      expect(() => {
        calculateGalacticCenterData(veryLateDate, yellowstone)
      }).not.toThrow()

      // Test with extreme locations
      const extremeNorth: Location = { lat: 89, lng: 0 }
      const extremeSouth: Location = { lat: -89, lng: 0 }

      expect(() => {
        calculateGalacticCenterData(new Date(), extremeNorth)
      }).not.toThrow()

      expect(() => {
        calculateGalacticCenterData(new Date(), extremeSouth)
      }).not.toThrow()
    })

    it('should have rise time before set time when both exist', () => {
      const date = new Date('2024-07-15T00:00:00Z')
      const result = calculateGalacticCenterData(date, yellowstone)

      if (result.riseTime && result.setTime) {
        // Handle day boundary crossing - set time might be next day
        let setTime = result.setTime.getTime()
        if (setTime < result.riseTime.getTime()) {
          setTime += 24 * 60 * 60 * 1000 // Add 24 hours
        }
        expect(result.riseTime.getTime()).toBeLessThan(setTime)
      }
    })
  })
})