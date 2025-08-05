import { describe, it, expect } from "vitest";
import {
  coordToPixel,
  pixelToCoord,
  coordToNormalized,
  normalizedToCoord,
} from "../utils/lightPollutionMap";

describe("Coordinate Mapping Functions", () => {
  // Standard image dimensions for testing
  const imageWidth = 14400;
  const imageHeight = 5600;

  describe("coordToPixel and pixelToCoord", () => {
    it("should handle Los Angeles coordinates correctly", () => {
      const laCoord = { lat: 34.0522, lng: -118.2437 };
      const pixel = coordToPixel(laCoord, imageWidth, imageHeight);

      // LA should map to pixel coordinates around (2470, 1638) with the corrected system
      expect(pixel.x).toBeCloseTo(2470, 0);
      expect(pixel.y).toBeCloseTo(1638, 5); // Allow small tolerance for rounding

      // Reverse conversion should get back original coordinates (allowing for pixel rounding)
      const reversedCoord = pixelToCoord(pixel, imageWidth, imageHeight);
      expect(reversedCoord.lat).toBeCloseTo(laCoord.lat, 1);
      expect(reversedCoord.lng).toBeCloseTo(laCoord.lng, 1);
    });

    it("should handle New York coordinates correctly", () => {
      const nycCoord = { lat: 40.7128, lng: -74.006 };
      const pixel = coordToPixel(nycCoord, imageWidth, imageHeight);

      // NYC should map to approximately (4240, 1371) with corrected system
      expect(pixel.x).toBeCloseTo(4240, 10);
      expect(pixel.y).toBeCloseTo(1371, 10);

      const reversedCoord = pixelToCoord(pixel, imageWidth, imageHeight);
      expect(reversedCoord.lat).toBeCloseTo(nycCoord.lat, 1);
      expect(reversedCoord.lng).toBeCloseTo(nycCoord.lng, 1);
    });

    it("should handle Paris coordinates correctly", () => {
      const parisCoord = { lat: 48.8566, lng: 2.3522 };
      const pixel = coordToPixel(parisCoord, imageWidth, imageHeight);

      // Paris should map to approximately (7294, 1046) with corrected system
      expect(pixel.x).toBeCloseTo(7294, 10);
      expect(pixel.y).toBeCloseTo(1046, 10);

      const reversedCoord = pixelToCoord(pixel, imageWidth, imageHeight);
      expect(reversedCoord.lat).toBeCloseTo(parisCoord.lat, 1);
      expect(reversedCoord.lng).toBeCloseTo(parisCoord.lng, 1);
    });

    it("should handle Tokyo coordinates correctly", () => {
      const tokyoCoord = { lat: 35.6762, lng: 139.6503 };
      const pixel = coordToPixel(tokyoCoord, imageWidth, imageHeight);

      // Tokyo should map to approximately (12786, 1573) with corrected system
      expect(pixel.x).toBeCloseTo(12786, 10);
      expect(pixel.y).toBeCloseTo(1573, 10);

      const reversedCoord = pixelToCoord(pixel, imageWidth, imageHeight);
      expect(reversedCoord.lat).toBeCloseTo(tokyoCoord.lat, 1);
      expect(reversedCoord.lng).toBeCloseTo(tokyoCoord.lng, 1);
    });

    it("should handle Sydney coordinates correctly", () => {
      const sydneyCoord = { lat: -33.8688, lng: 151.2093 };
      const pixel = coordToPixel(sydneyCoord, imageWidth, imageHeight);

      // Sydney should map to approximately (13248, 4355) with corrected system
      expect(pixel.x).toBeCloseTo(13248, 10);
      expect(pixel.y).toBeCloseTo(4355, 10);

      const reversedCoord = pixelToCoord(pixel, imageWidth, imageHeight);
      expect(reversedCoord.lat).toBeCloseTo(sydneyCoord.lat, 1);
      expect(reversedCoord.lng).toBeCloseTo(sydneyCoord.lng, 1);
    });

    it("should handle map boundary coordinates correctly", () => {
      // Test map boundaries: -65° to +75° latitude, -180° to +180° longitude
      const northBoundary = { lat: 75, lng: 0 };
      const southBoundary = { lat: -65, lng: 0 };
      const westBoundary = { lat: 0, lng: -180 };
      const eastBoundary = { lat: 0, lng: 180 };

      // North boundary should map to y=0
      const northPixel = coordToPixel(northBoundary, imageWidth, imageHeight);
      expect(northPixel.y).toBe(0);

      // South boundary should map to y=imageHeight-1
      const southPixel = coordToPixel(southBoundary, imageWidth, imageHeight);
      expect(southPixel.y).toBe(imageHeight - 1);

      // West boundary should map to x=0
      const westPixel = coordToPixel(westBoundary, imageWidth, imageHeight);
      expect(westPixel.x).toBe(0);

      // East boundary should map to x=imageWidth-1
      const eastPixel = coordToPixel(eastBoundary, imageWidth, imageHeight);
      expect(eastPixel.x).toBe(imageWidth - 1);
    });

    it("should handle coordinates outside map coverage gracefully", () => {
      // Test coordinates outside the -65° to +75° latitude range
      const arcticCoord = { lat: 80, lng: 0 }; // North of map coverage
      const antarcticCoord = { lat: -70, lng: 0 }; // South of map coverage

      const arcticPixel = coordToPixel(arcticCoord, imageWidth, imageHeight);
      const antarcticPixel = coordToPixel(
        antarcticCoord,
        imageWidth,
        imageHeight,
      );

      // Should clamp to valid pixel ranges
      expect(arcticPixel.y).toBeGreaterThanOrEqual(0);
      expect(arcticPixel.y).toBeLessThan(imageHeight);
      expect(antarcticPixel.y).toBeGreaterThanOrEqual(0);
      expect(antarcticPixel.y).toBeLessThan(imageHeight);
    });
  });

  describe("coordToNormalized and normalizedToCoord", () => {
    it("should normalize Los Angeles coordinates correctly", () => {
      const laCoord = { lat: 34.0522, lng: -118.2437 };
      const normalized = coordToNormalized(laCoord.lat, laCoord.lng);

      // Should return values between 0 and 1
      expect(normalized.x).toBeGreaterThanOrEqual(0);
      expect(normalized.x).toBeLessThanOrEqual(1);
      expect(normalized.y).toBeGreaterThanOrEqual(0);
      expect(normalized.y).toBeLessThanOrEqual(1);

      // Reverse conversion should work
      const reversed = normalizedToCoord(normalized.x, normalized.y);
      expect(reversed.lat).toBeCloseTo(laCoord.lat, 2);
      expect(reversed.lng).toBeCloseTo(laCoord.lng, 2);
    });

    it("should normalize equator and prime meridian correctly", () => {
      const equatorPrimeMeridian = { lat: 0, lng: 0 };
      const normalized = coordToNormalized(
        equatorPrimeMeridian.lat,
        equatorPrimeMeridian.lng,
      );

      // Prime meridian should be at x=0.5
      expect(normalized.x).toBeCloseTo(0.5, 3);

      // Equator should be at y = (75-0)/140 = 0.5357
      expect(normalized.y).toBeCloseTo(0.5357, 3);
    });

    it("should normalize map boundaries correctly", () => {
      // Test all four corners of the map
      const corners = [
        { lat: 75, lng: -180, expectedX: 0, expectedY: 0 }, // Northwest
        { lat: 75, lng: 180, expectedX: 1, expectedY: 0 }, // Northeast
        { lat: -65, lng: -180, expectedX: 0, expectedY: 1 }, // Southwest
        { lat: -65, lng: 180, expectedX: 1, expectedY: 1 }, // Southeast
      ];

      corners.forEach((corner) => {
        const normalized = coordToNormalized(corner.lat, corner.lng);
        expect(normalized.x).toBeCloseTo(corner.expectedX, 3);
        expect(normalized.y).toBeCloseTo(corner.expectedY, 3);
      });
    });

    it("should maintain consistency between pixel and normalized conversions", () => {
      const testCoords = [
        { lat: 34.0522, lng: -118.2437 }, // Los Angeles
        { lat: 40.7128, lng: -74.006 }, // New York
        { lat: 48.8566, lng: 2.3522 }, // Paris
        { lat: 35.6762, lng: 139.6503 }, // Tokyo
        { lat: -33.8688, lng: 151.2093 }, // Sydney
      ];

      testCoords.forEach((coord) => {
        // Convert using pixel functions
        const pixel = coordToPixel(coord, imageWidth, imageHeight);
        const pixelNormalized = {
          x: pixel.x / imageWidth,
          y: pixel.y / imageHeight,
        };

        // Convert using normalized functions
        const directNormalized = coordToNormalized(coord.lat, coord.lng);

        // Should be very close (allowing for rounding differences)
        expect(pixelNormalized.x).toBeCloseTo(directNormalized.x, 3);
        expect(pixelNormalized.y).toBeCloseTo(directNormalized.y, 3);
      });
    });
  });

  describe("Coordinate System Validation", () => {
    it("should use correct latitude range (75° to -65°, not 90° to -90°)", () => {
      // This test ensures we're using the correct map coverage
      const MAP_LAT_MAX = 75;
      const MAP_LAT_MIN = -65;
      const MAP_LAT_SPAN = MAP_LAT_MAX - MAP_LAT_MIN; // Should be 140, not 180

      expect(MAP_LAT_SPAN).toBe(140);

      // Test that the extreme latitudes map correctly
      const northPole = coordToPixel(
        { lat: MAP_LAT_MAX, lng: 0 },
        imageWidth,
        imageHeight,
      );
      const southPole = coordToPixel(
        { lat: MAP_LAT_MIN, lng: 0 },
        imageWidth,
        imageHeight,
      );

      expect(northPole.y).toBe(0);
      expect(southPole.y).toBe(imageHeight - 1);
    });

    it("should reject the old incorrect coordinate system", () => {
      // This test documents what the OLD (incorrect) system would produce
      // to ensure we never regress back to it

      const laCoord = { lat: 34.0522, lng: -118.2437 };

      // OLD (incorrect) calculation that led to the bug:
      // const oldY = ((90 - laCoord.lat) / 180) * imageHeight;
      const oldY = ((90 - laCoord.lat) / 180) * imageHeight;
      const oldExpectedY = Math.round(oldY); // Would be ~1741

      // NEW (correct) calculation:
      const newPixel = coordToPixel(laCoord, imageWidth, imageHeight);

      // The new Y should be significantly different from the old Y
      expect(newPixel.y).not.toBeCloseTo(oldExpectedY, 50);

      // The new Y should be around 1638, not 1741
      expect(newPixel.y).toBeCloseTo(1638, 10);
    });
  });
});
