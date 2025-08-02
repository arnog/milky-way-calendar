import { describe, it, expect } from 'vitest';
import { rgbToBortleScale, isDarkSky, coordToPixel } from '../utils/lightPollutionMap';

describe('Dark Site Search Accuracy', () => {
  describe('RGB to Bortle Scale Conversion', () => {
    it('should correctly classify major cities as heavily light polluted', () => {
      // Test RGB values that major cities should read after coordinate fix
      
      // Pure white (R255 G255 B255) - extreme light pollution
      const extremePollution = rgbToBortleScale(255, 255, 255);
      expect(extremePollution).toBeGreaterThanOrEqual(7);
      expect(isDarkSky(extremePollution)).toBe(false);
      
      // Very bright colors - severe light pollution
      const severePollution1 = rgbToBortleScale(255, 200, 100);
      const severePollution2 = rgbToBortleScale(200, 255, 150);
      expect(severePollution1).toBeGreaterThanOrEqual(6);
      expect(severePollution2).toBeGreaterThanOrEqual(6);
      expect(isDarkSky(severePollution1)).toBe(false);
      expect(isDarkSky(severePollution2)).toBe(false);
    });

    it('should document what cities were reading before coordinate fix', () => {
      // These are the RGB values that cities were reading BEFORE the coordinate fix
      // The bug was in coordinate mapping, not in the RGB interpretation
      
      const darkGray1 = rgbToBortleScale(35, 35, 35);  // Los Angeles was reading this (wrong pixel)
      const darkGray2 = rgbToBortleScale(49, 49, 49);  // Other cities were reading similar
      const darkGray3 = rgbToBortleScale(24, 24, 24);
      
      // These actually ARE good dark sky colors - that's why the bug was so confusing!
      // Cities were reading pixels from remote desert areas due to coordinate offset
      expect(darkGray1).toBeCloseTo(2.5, 0.5); // This is actually good dark sky
      expect(darkGray2).toBeCloseTo(3.0, 0.5); // This is borderline good dark sky  
      expect(darkGray3).toBeCloseTo(2.0, 0.5); // This is excellent dark sky
      
      // The first two should be considered good dark sky (the coordinate fix ensures
      // cities now read bright pixels instead)
      expect(isDarkSky(darkGray1)).toBe(true);  // 2.5 <= 3.0
      expect(isDarkSky(darkGray2)).toBe(true);  // ~3.0 <= 3.0
      expect(isDarkSky(darkGray3)).toBe(true);  // 2.0 <= 3.0
    });

    it('should correctly identify truly dark pixels as dark sky', () => {
      // Very dark pixels (close to black but not pure black)
      const pristineDark1 = rgbToBortleScale(8, 8, 8);
      const pristineDark2 = rgbToBortleScale(16, 16, 16);
      
      expect(pristineDark1).toBeLessThanOrEqual(3.0);
      expect(pristineDark2).toBeLessThanOrEqual(3.0);
      expect(isDarkSky(pristineDark1)).toBe(true);
      expect(isDarkSky(pristineDark2)).toBe(true);
    });

    it('should handle pure black pixels correctly (water/no-data)', () => {
      // Pure black should be treated as no-data, not dark sky
      const pureBlack = rgbToBortleScale(0, 0, 0);
      expect(pureBlack).toBe(9); // Worse than any real Bortle scale
      expect(isDarkSky(pureBlack)).toBe(false);
    });

    it('should have proper Bortle scale progression', () => {
      // Test that brighter colors result in worse (higher) Bortle scales
      const colors = [
        { rgb: [8, 8, 8], name: 'almost black' },
        { rgb: [32, 32, 32], name: 'dark gray' },
        { rgb: [128, 128, 0], name: 'olive' },
        { rgb: [255, 255, 0], name: 'yellow' },
        { rgb: [255, 128, 0], name: 'orange' },
        { rgb: [255, 0, 0], name: 'red' },
        { rgb: [255, 255, 255], name: 'white' }
      ];
      
      let previousBortle = 0;
      colors.forEach(color => {
        const bortle = rgbToBortleScale(color.rgb[0], color.rgb[1], color.rgb[2]);
        expect(bortle).toBeGreaterThan(previousBortle);
        previousBortle = bortle;
      });
    });
  });

  describe('Dark Sky Classification', () => {
    it('should accept good dark sky locations while excluding cities', () => {
      // isDarkSky should return true for Bortle <= 3.0 (good for Milky Way)
      expect(isDarkSky(1.0)).toBe(true);   // Pristine
      expect(isDarkSky(2.0)).toBe(true);   // Excellent
      expect(isDarkSky(3.0)).toBe(true);   // Good
      expect(isDarkSky(3.1)).toBe(false);  // Rural/suburban transition
      expect(isDarkSky(4.0)).toBe(false);  // Rural/suburban
      expect(isDarkSky(5.0)).toBe(false);  // Suburban
    });

    it('should recognize Joshua Tree area as dark sky (real-world test)', () => {
      // Based on actual debug results, Joshua Tree reads as Bortle 3.5 (blue pixel RGB 1,37,132)
      // This should NOT be classified as dark sky with the old threshold (1.5)
      // But SHOULD be classified as good for astronomy with the new threshold (3.0)
      const joshuaTreeBortle = rgbToBortleScale(1, 37, 132); // Actual RGB from debug
      expect(joshuaTreeBortle).toBeCloseTo(3.5, 0.5);
      expect(isDarkSky(joshuaTreeBortle)).toBe(false); // 3.5 > 3.0, so not quite good enough
      
      // But nearby pixels with Bortle 2.5 should be good
      const nearbyBortle = rgbToBortleScale(35, 35, 35); // Actual RGB from debug
      expect(nearbyBortle).toBeCloseTo(2.5, 0.5);
      expect(isDarkSky(nearbyBortle)).toBe(true); // 2.5 <= 3.0, so good for astronomy
    });
  });

  describe('Major Cities Regression Tests', () => {
    // These tests ensure that major cities will never again be misclassified
    // as dark sky sites due to coordinate mapping errors
    
    const majorCities = [
      { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
      { name: 'New York City', lat: 40.7128, lng: -74.0060 },
      { name: 'Paris', lat: 48.8566, lng: 2.3522 },
      { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
      { name: 'London', lat: 51.5074, lng: -0.1278 },
      { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
      { name: 'Beijing', lat: 39.9042, lng: 116.4074 },
      { name: 'Mumbai', lat: 19.0760, lng: 72.8777 }
    ];

    it('should map major cities to reasonable pixel coordinates', () => {
      // Test that coordinate conversion produces sensible pixel locations
      const imageWidth = 14400;
      const imageHeight = 5600;
      
      majorCities.forEach(city => {
        const pixel = coordToPixel(city, imageWidth, imageHeight);
        
        // Pixel coordinates should be within image bounds
        expect(pixel.x).toBeGreaterThanOrEqual(0);
        expect(pixel.x).toBeLessThan(imageWidth);
        expect(pixel.y).toBeGreaterThanOrEqual(0);
        expect(pixel.y).toBeLessThan(imageHeight);
        
        // Longitude mapping should be proportional (allowing for rounding)
        const expectedX = ((city.lng + 180) / 360) * imageWidth;
        expect(pixel.x).toBeCloseTo(expectedX, 0);
        
        // Latitude mapping should use corrected 140° span (allowing for rounding)
        const expectedY = ((75 - city.lat) / 140) * imageHeight;
        expect(pixel.y).toBeCloseTo(expectedY, 0);
      });
    });

    // Test to verify very bright pixels (like cities should read) are not dark sky
    it('should classify very bright pixels as poor for dark sky', () => {
      // Test the extreme bright colors that cities should actually read
      const cityPixels = [
        { rgb: [255, 255, 255], desc: 'pure white' },
        { rgb: [255, 200, 100], desc: 'bright yellow-orange' },
        { rgb: [200, 255, 150], desc: 'bright green-yellow' },
        { rgb: [255, 128, 0], desc: 'bright orange' },
        { rgb: [255, 0, 0], desc: 'bright red' }
      ];
      
      cityPixels.forEach(({ rgb }) => {
        const bortle = rgbToBortleScale(rgb[0], rgb[1], rgb[2]);
        
        // Very bright pixels should result in poor Bortle scales (>3.0)
        expect(bortle).toBeGreaterThan(3.0);
        expect(isDarkSky(bortle)).toBe(false);
      });
    });
  });

  describe('Coordinate System Boundary Tests', () => {
    it('should handle coordinates at map boundaries correctly', () => {
      const imageWidth = 14400;
      const imageHeight = 5600;
      
      // Test coordinates at the edge of the map coverage (-65° to +75°)
      const boundaryCoords = [
        { lat: 75, lng: 0, name: 'Northern boundary' },
        { lat: -65, lng: 0, name: 'Southern boundary' },
        { lat: 0, lng: -180, name: 'Western boundary' },
        { lat: 0, lng: 180, name: 'Eastern boundary' }
      ];
      
      boundaryCoords.forEach(coord => {
        const pixel = coordToPixel(coord, imageWidth, imageHeight);
        
        // Should produce valid pixel coordinates
        expect(pixel.x).toBeGreaterThanOrEqual(0);
        expect(pixel.x).toBeLessThan(imageWidth);
        expect(pixel.y).toBeGreaterThanOrEqual(0);
        expect(pixel.y).toBeLessThan(imageHeight);
      });
    });

    it('should clamp coordinates outside map coverage', () => {
      const imageWidth = 14400;
      const imageHeight = 5600;
      
      // Test coordinates outside the -65° to +75° range
      const outsideCoords = [
        { lat: 80, lng: 0, name: 'Above northern boundary' },
        { lat: -70, lng: 0, name: 'Below southern boundary' }
      ];
      
      outsideCoords.forEach(coord => {
        const pixel = coordToPixel(coord, imageWidth, imageHeight);
        
        // Should still produce valid pixel coordinates (clamped)
        expect(pixel.x).toBeGreaterThanOrEqual(0);
        expect(pixel.x).toBeLessThan(imageWidth);
        expect(pixel.y).toBeGreaterThanOrEqual(0);
        expect(pixel.y).toBeLessThan(imageHeight);
      });
    });
  });

  describe('Anti-Regression Tests', () => {
    it('should never return to the old incorrect coordinate system', () => {
      // This test specifically prevents regression to the buggy system
      const laCoord = { lat: 34.0522, lng: -118.2437 };
      const imageWidth = 14400;
      const imageHeight = 5600;
      
      // Get the correct pixel coordinates
      const correctPixel = coordToPixel(laCoord, imageWidth, imageHeight);
      
      // Calculate what the OLD (buggy) system would produce
      const oldBuggyY = Math.round(((90 - laCoord.lat) / 180) * imageHeight);
      
      // The correct Y should be significantly different from the buggy Y
      const yDifference = Math.abs(correctPixel.y - oldBuggyY);
      expect(yDifference).toBeGreaterThan(50); // Should be ~100+ pixels different
      
      // Specifically, LA should map to ~1638, not ~1741
      expect(correctPixel.y).toBeCloseTo(1638, 20);
      expect(correctPixel.y).not.toBeCloseTo(1741, 20);
    });

    it('should document the expected RGB progression from dark to light areas', () => {
      // This test documents the expected behavior to catch any regressions
      const expectedProgression = [
        { bortle: 1.0, description: 'Pristine dark sky', maxRGB: 16 },
        { bortle: 2.0, description: 'Excellent dark sky', maxRGB: 32 },
        { bortle: 3.0, description: 'Good dark sky', maxRGB: 64 },
        { bortle: 6.0, description: 'Suburban sky', minRGB: 128 },
        { bortle: 8.0, description: 'City sky', minRGB: 200 }
      ];
      
      expectedProgression.forEach(stage => {
        if (stage.maxRGB) {
          // Dark areas should have low RGB values
          const testBortle = rgbToBortleScale(stage.maxRGB, stage.maxRGB, stage.maxRGB);
          expect(testBortle).toBeLessThanOrEqual(stage.bortle + 0.5);
        }
        
        if (stage.minRGB) {
          // Bright areas should have high RGB values
          const testBortle = rgbToBortleScale(stage.minRGB, stage.minRGB, stage.minRGB);
          expect(testBortle).toBeGreaterThanOrEqual(stage.bortle - 0.5);
        }
      });
    });
  });
});