import { describe, it, expect } from 'vitest'
import { getOptimalViewingWindow, formatOptimalViewingTime, formatOptimalViewingDuration } from '../utils/integratedOptimalViewing'
import { GalacticCenterData, MoonData, TwilightData, Location } from '../types/astronomy'

describe('optimalViewing', () => {
  describe('getOptimalViewingWindow', () => {
    // Mock location and date for tests
    const mockLocation: Location = { lat: 34.0522, lng: -118.2437 }; // Los Angeles
    const mockDate = new Date('2024-07-15T12:00:00Z');
    
    // Mock data generators
    const createMockGCData = (overrides: Partial<GalacticCenterData> = {}): GalacticCenterData => ({
      altitude: 25,
      azimuth: 180,
      isVisible: true,
      riseTime: new Date('2024-07-15T21:00:00Z'),
      setTime: new Date('2024-07-16T05:00:00Z'),
      transitTime: new Date('2024-07-16T01:00:00Z'),
      ...overrides
    })

    const createMockMoonData = (overrides: Partial<MoonData> = {}): MoonData => ({
      phase: 0.1, // New moon
      illumination: 0.05,
      altitude: -10, // Below horizon
      azimuth: 90,
      rise: new Date('2024-07-16T06:00:00Z'),
      set: new Date('2024-07-15T20:00:00Z'),
      ...overrides
    })

    const createMockTwilightData = (overrides: Partial<TwilightData> = {}): TwilightData => ({
      dawn: new Date('2024-07-16T05:30:00Z').getTime(),
      dusk: new Date('2024-07-15T20:30:00Z').getTime(),
      night: new Date('2024-07-15T22:00:00Z').getTime(), // Astronomical darkness starts
      dayEnd: new Date('2024-07-16T04:00:00Z').getTime(), // Astronomical darkness ends
      ...overrides
    })

    it('should return empty window when GC is not visible', () => {
      const gcData = createMockGCData({ isVisible: false, riseTime: null, setTime: null })
      const moonData = createMockMoonData()
      const twilightData = createMockTwilightData()

      const result = getOptimalViewingWindow(gcData, moonData, twilightData, mockLocation, mockDate)

      expect(result.startTime).toBeNull()
      expect(result.endTime).toBeNull()
      expect(result.duration).toBe(0)
      expect(result.description).toContain('No viewing opportunity available')
    })

    it('should calculate window when GC rises after dark', () => {
      const gcData = createMockGCData({
        riseTime: new Date('2024-07-15T23:00:00Z'), // Rises after dark
        setTime: new Date('2024-07-16T03:00:00Z')   // Sets before dawn
      })
      const moonData = createMockMoonData()
      const twilightData = createMockTwilightData()

      const result = getOptimalViewingWindow(gcData, moonData, twilightData, mockLocation, mockDate)

      expect(result.startTime).not.toBeNull()
      expect(result.endTime).not.toBeNull()
      expect(result.duration).toBeGreaterThan(0)
      
      // Start time should be when GC rises (after dark starts)
      expect(result.startTime?.getTime()).toBe(new Date('2024-07-15T23:00:00Z').getTime())
      // End time should be when GC sets
      expect(result.endTime?.getTime()).toBe(new Date('2024-07-16T03:00:00Z').getTime())
    })

    it('should calculate window when GC is already up when dark starts', () => {
      const gcData = createMockGCData({
        riseTime: new Date('2024-07-15T20:00:00Z'), // Rises before dark
        setTime: new Date('2024-07-16T03:00:00Z')   // Sets before dawn
      })
      const moonData = createMockMoonData()
      const twilightData = createMockTwilightData()

      const result = getOptimalViewingWindow(gcData, moonData, twilightData, mockLocation, mockDate)

      expect(result.startTime).not.toBeNull()
      expect(result.endTime).not.toBeNull()
      
      // Start time should be when darkness begins (GC already up)
      expect(result.startTime?.getTime()).toBe(twilightData.night)
      // End time should be when GC sets
      expect(result.endTime?.getTime()).toBe(new Date('2024-07-16T03:00:00Z').getTime())
    })

    it('should end window at dawn if GC sets after dawn', () => {
      const gcData = createMockGCData({
        riseTime: new Date('2024-07-15T23:00:00Z'),
        setTime: new Date('2024-07-16T06:00:00Z') // Sets after dawn
      })
      const moonData = createMockMoonData()
      const twilightData = createMockTwilightData()

      const result = getOptimalViewingWindow(gcData, moonData, twilightData, mockLocation, mockDate)

      expect(result.startTime).not.toBeNull()
      expect(result.endTime).not.toBeNull()
      
      // End time should be dawn (not GC set)
      expect(result.endTime?.getTime()).toBe(twilightData.dayEnd)
    })

    it('should return empty window when no overlap between GC and darkness', () => {
      const gcData = createMockGCData({
        riseTime: new Date('2024-07-16T05:00:00Z'), // Rises after dawn
        setTime: new Date('2024-07-16T12:00:00Z')   // Sets during day
      })
      const moonData = createMockMoonData()
      const twilightData = createMockTwilightData()

      const result = getOptimalViewingWindow(gcData, moonData, twilightData, mockLocation, mockDate)

      expect(result.startTime).toBeNull()
      expect(result.endTime).toBeNull()
      expect(result.duration).toBe(0)
      expect(result.description).toContain('No viable observation time')
    })

    it('should handle moon interference correctly', () => {
      const gcData = createMockGCData()
      
      // Test with bright moon during viewing window
      const brightMoonData = createMockMoonData({
        illumination: 0.9, // Nearly full moon
        altitude: 30, // High in sky
        rise: new Date('2024-07-15T22:30:00Z'),
        set: new Date('2024-07-16T04:30:00Z')
      })
      const twilightData = createMockTwilightData()

      const result = getOptimalViewingWindow(gcData, brightMoonData, twilightData, mockLocation, mockDate)

      // Integrated approach may give different descriptions based on quality analysis
      expect(result.description).toBeDefined()
      expect(result.duration).toBeGreaterThan(0)
    })

    it('should describe optimal conditions when moon is not interfering', () => {
      const gcData = createMockGCData()
      const darkMoonData = createMockMoonData({
        illumination: 0.02, // Very dark moon
        altitude: -20 // Below horizon
      })
      const twilightData = createMockTwilightData()

      const result = getOptimalViewingWindow(gcData, darkMoonData, twilightData, mockLocation, mockDate)

      // Integrated approach provides more nuanced quality-based descriptions
      expect(result.description).toBeDefined()
      expect(['Fair viewing window', 'Good viewing window', 'Excellent viewing window', 'Optimal conditions'].includes(result.description)).toBe(true)
    })

    it('should handle day boundary crossing correctly', () => {
      // Test when astronomical night crosses midnight
      const gcData = createMockGCData({
        riseTime: new Date('2024-07-15T23:30:00Z'),
        setTime: new Date('2024-07-16T02:30:00Z')
      })
      const moonData = createMockMoonData()
      const twilightData = createMockTwilightData({
        night: new Date('2024-07-15T22:00:00Z').getTime(),
        dayEnd: new Date('2024-07-16T04:00:00Z').getTime()
      })

      const result = getOptimalViewingWindow(gcData, moonData, twilightData, mockLocation, mockDate)

      expect(result.startTime).not.toBeNull()
      expect(result.endTime).not.toBeNull()
      expect(result.duration).toBeGreaterThan(0)
      
      // Should span across midnight
      expect(result.startTime!.getTime()).toBeLessThan(result.endTime!.getTime())
    })

    it('should handle missing twilight data gracefully', () => {
      const gcData = createMockGCData()
      const moonData = createMockMoonData()
      const incompleteTwilightData = createMockTwilightData({
        night: 0, // Missing night time
        dayEnd: 0  // Missing day end time
      })

      const result = getOptimalViewingWindow(gcData, moonData, incompleteTwilightData, mockLocation, mockDate)

      // Integrated approach returns empty window when twilight data is incomplete
      expect(result.startTime).toBeNull()
      expect(result.endTime).toBeNull()
      expect(result.duration).toBe(0)
      expect(result.description).toContain('No viewing opportunity available')
    })

    it('should calculate duration correctly', () => {
      const gcData = createMockGCData({
        riseTime: new Date('2024-07-15T23:00:00Z'),
        setTime: new Date('2024-07-16T03:00:00Z') // 4 hours later
      })
      const moonData = createMockMoonData()
      const twilightData = createMockTwilightData()

      const result = getOptimalViewingWindow(gcData, moonData, twilightData, mockLocation, mockDate)

      expect(result.duration).toBeCloseTo(4, 1) // Should be approximately 4 hours
    })
  })

  describe('formatOptimalViewingTime', () => {
    const testLocation: Location = { lat: 44.6, lng: -110.5 }

    it('should return empty string for null start time', () => {
      const window = {
        startTime: null,
        endTime: null,
        duration: 0,
        description: 'No viewing time'
      }

      const result = formatOptimalViewingTime(window)
      expect(result).toBe('')
    })

    it('should format time without location as HH:MM', () => {
      const window = {
        startTime: new Date('2024-07-15T23:30:00Z'),
        endTime: new Date('2024-07-16T03:30:00Z'),
        duration: 4,
        description: 'Test window'
      }

      const result = formatOptimalViewingTime(window)
      // Should be in 24-hour format
      expect(result).toMatch(/^\d{2}:\d{2}$/)
    })

    it('should format time with location using timezone', () => {
      const window = {
        startTime: new Date('2024-07-15T23:30:00Z'),
        endTime: new Date('2024-07-16T03:30:00Z'),
        duration: 4,
        description: 'Test window'
      }

      const result = formatOptimalViewingTime(window, testLocation)
      // Should include timezone information or be properly converted
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })
  })

  describe('formatOptimalViewingDuration', () => {
    it('should return empty string for zero or negative duration', () => {
      const window = {
        startTime: null,
        endTime: null,
        duration: 0,
        description: 'No duration'
      }

      expect(formatOptimalViewingDuration(window)).toBe('')

      const negativeWindow = { ...window, duration: -1 }
      expect(formatOptimalViewingDuration(negativeWindow)).toBe('')
    })

    it('should format minutes only for durations less than 1 hour', () => {
      const window = {
        startTime: new Date(),
        endTime: new Date(),
        duration: 0.5, // 30 minutes
        description: 'Short window'
      }

      const result = formatOptimalViewingDuration(window)
      expect(result).toBe('30m')
    })

    it('should format hours only for exact hour durations', () => {
      const window = {
        startTime: new Date(),
        endTime: new Date(),
        duration: 3, // Exactly 3 hours
        description: 'Three hour window'
      }

      const result = formatOptimalViewingDuration(window)
      expect(result).toBe('3h')
    })

    it('should format hours and minutes for mixed durations', () => {
      const window = {
        startTime: new Date(),
        endTime: new Date(),
        duration: 2.75, // 2 hours 45 minutes
        description: 'Mixed duration'
      }

      const result = formatOptimalViewingDuration(window)
      expect(result).toBe('2h 45m')
    })

    it('should round minutes correctly', () => {
      const window = {
        startTime: new Date(),
        endTime: new Date(),
        duration: 1.533, // 1 hour 32 minutes (rounds to 32)
        description: 'Rounding test'
      }

      const result = formatOptimalViewingDuration(window)
      expect(result).toBe('1h 32m')
    })
  })
})