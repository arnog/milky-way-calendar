import { describe, it, expect } from "vitest";
import {
  calculateTwilightTimes,
  calculateDarkDuration,
} from "../utils/twilightCalculations";
import { Location } from "../types/astronomy";

describe("twilightCalculations", () => {
  const testLocation: Location = { lat: 44.6, lng: -110.5 };

  describe("calculateTwilightTimes", () => {
    it("should return valid twilight data structure", () => {
      const date = new Date("2024-07-15T00:00:00Z");
      const result = calculateTwilightTimes(date, testLocation);

      expect(result).toHaveProperty("dawn");
      expect(result).toHaveProperty("dusk");
      expect(result).toHaveProperty("nightStart");
      expect(result).toHaveProperty("nightEnd");

      expect(typeof result.dawn).toBe("number");
      expect(typeof result.dusk).toBe("number");
      expect(typeof result.nightStart).toBe("number");
      expect(typeof result.nightEnd).toBe("number");
    });

    it("should have logical time ordering for normal latitudes", () => {
      const date = new Date("2024-07-15T00:00:00Z"); // Summer
      const result = calculateTwilightTimes(date, testLocation);

      // Convert timestamps to dates for comparison
      const dusk = new Date(result.dusk);
      const night = new Date(result.nightStart);
      const dayEnd = new Date(result.nightEnd);

      // Dusk should come before night (astronomical twilight)
      expect(dusk.getTime()).toBeLessThan(night.getTime());

      // Night should last several hours
      // Handle day boundary crossing
      let adjustedDayEnd = dayEnd.getTime();
      if (adjustedDayEnd < night.getTime()) {
        adjustedDayEnd += 24 * 60 * 60 * 1000; // Add 24 hours
      }
      expect(adjustedDayEnd).toBeGreaterThan(night.getTime());
    });

    it("should handle different seasons", () => {
      const locations = [testLocation];
      const dates = [
        new Date("2024-01-15T00:00:00Z"), // Winter
        new Date("2024-04-15T00:00:00Z"), // Spring
        new Date("2024-07-15T00:00:00Z"), // Summer
        new Date("2024-10-15T00:00:00Z"), // Fall
      ];

      dates.forEach((date) => {
        locations.forEach((location) => {
          expect(() => {
            calculateTwilightTimes(date, location);
          }).not.toThrow();

          const result = calculateTwilightTimes(date, location);
          expect(typeof result.dawn).toBe("number");
          expect(typeof result.dusk).toBe("number");
          expect(typeof result.nightStart).toBe("number");
          expect(typeof result.nightEnd).toBe("number");
        });
      });
    });

    it("should handle different hemispheres", () => {
      const date = new Date("2024-07-15T00:00:00Z");
      const locations = [
        { lat: 44.6, lng: -110.5 }, // Northern hemisphere
        { lat: -33.9, lng: 151.2 }, // Southern hemisphere
        { lat: 0, lng: 0 }, // Equator
      ];

      locations.forEach((location) => {
        expect(() => {
          calculateTwilightTimes(date, location);
        }).not.toThrow();

        const result = calculateTwilightTimes(date, location);
        expect(result.dawn).toBeGreaterThan(0);
        expect(result.dusk).toBeGreaterThan(0);
        expect(result.nightStart).toBeGreaterThan(0);
        expect(result.nightEnd).toBeGreaterThan(0);
      });
    });

    it("should handle high latitude locations gracefully", () => {
      const summerDate = new Date("2024-06-21T00:00:00Z"); // Summer solstice
      const highLatLocation = { lat: 70, lng: -150 }; // Northern Alaska

      expect(() => {
        calculateTwilightTimes(summerDate, highLatLocation);
      }).not.toThrow();

      const result = calculateTwilightTimes(summerDate, highLatLocation);

      // Should return valid timestamps even if sun doesn't set
      expect(typeof result.dawn).toBe("number");
      expect(typeof result.dusk).toBe("number");
      expect(typeof result.nightStart).toBe("number");
      expect(typeof result.nightEnd).toBe("number");
    });

    it("should return consistent results for the same input", () => {
      const date = new Date("2024-07-15T12:00:00Z");

      const result1 = calculateTwilightTimes(date, testLocation);
      const result2 = calculateTwilightTimes(date, testLocation);

      expect(result1.dawn).toBe(result2.dawn);
      expect(result1.dusk).toBe(result2.dusk);
      expect(result1.nightStart).toBe(result2.nightStart);
      expect(result1.nightEnd).toBe(result2.nightEnd);
    });

    it("should handle edge cases gracefully", () => {
      // Test with extreme dates
      const veryEarlyDate = new Date("1900-01-01T00:00:00Z");
      const veryLateDate = new Date("2100-12-31T23:59:59Z");

      expect(() => {
        calculateTwilightTimes(veryEarlyDate, testLocation);
      }).not.toThrow();

      expect(() => {
        calculateTwilightTimes(veryLateDate, testLocation);
      }).not.toThrow();

      // Test with extreme locations
      const extremeNorth: Location = { lat: 89, lng: 0 };
      const extremeSouth: Location = { lat: -89, lng: 0 };

      expect(() => {
        calculateTwilightTimes(new Date(), extremeNorth);
      }).not.toThrow();

      expect(() => {
        calculateTwilightTimes(new Date(), extremeSouth);
      }).not.toThrow();
    });
  });

  describe("calculateDarkDuration", () => {
    it("should calculate reasonable dark duration for normal conditions", () => {
      const twilightData = {
        dawn: new Date("2024-07-16T05:30:00Z").getTime(),
        dusk: new Date("2024-07-15T20:30:00Z").getTime(),
        nightStart: new Date("2024-07-15T22:00:00Z").getTime(), // 10 PM
        nightEnd: new Date("2024-07-16T04:00:00Z").getTime(), // 4 AM next day
      };

      const duration = calculateDarkDuration(twilightData);

      expect(duration).toBeGreaterThan(0);
      expect(duration).toBeLessThan(24); // Should be less than 24 hours
      expect(duration).toBeCloseTo(6, 1); // Should be approximately 6 hours (10 PM to 4 AM)
    });

    it("should handle day boundary crossing", () => {
      const twilightData = {
        dawn: new Date("2024-07-16T05:30:00Z").getTime(),
        dusk: new Date("2024-07-15T20:30:00Z").getTime(),
        nightStart: new Date("2024-07-15T23:00:00Z").getTime(), // 11 PM
        nightEnd: new Date("2024-07-16T02:00:00Z").getTime(), // 2 AM next day
      };

      const duration = calculateDarkDuration(twilightData);

      expect(duration).toBeGreaterThan(0);
      expect(duration).toBeCloseTo(3, 1); // Should be approximately 3 hours
    });

    it("should handle same-day times", () => {
      // Edge case where night and dayEnd are on same day
      const sameDay = new Date("2024-07-15");
      const twilightData = {
        dawn: sameDay.getTime() + 6 * 3600000, // 6 AM
        dusk: sameDay.getTime() + 18 * 3600000, // 6 PM
        nightStart: sameDay.getTime() + 20 * 3600000, // 8 PM
        nightEnd: sameDay.getTime() + 22 * 3600000, // 10 PM same day
      };

      const duration = calculateDarkDuration(twilightData);

      expect(duration).toBeGreaterThan(0);
      expect(duration).toBeCloseTo(2, 1); // Should be approximately 2 hours
    });

    it("should handle very short dark periods", () => {
      const twilightData = {
        dawn: new Date("2024-06-21T03:00:00Z").getTime(),
        dusk: new Date("2024-06-20T21:00:00Z").getTime(),
        nightStart: new Date("2024-06-20T23:30:00Z").getTime(), // 11:30 PM
        nightEnd: new Date("2024-06-21T00:30:00Z").getTime(), // 12:30 AM (1 hour later)
      };

      const duration = calculateDarkDuration(twilightData);

      expect(duration).toBeGreaterThan(0);
      expect(duration).toBeCloseTo(1, 0.5); // Should be approximately 1 hour
    });

    it("should handle long dark periods", () => {
      const twilightData = {
        dawn: new Date("2024-12-21T08:00:00Z").getTime(),
        dusk: new Date("2024-12-20T16:00:00Z").getTime(),
        nightStart: new Date("2024-12-20T18:00:00Z").getTime(), // 6 PM
        nightEnd: new Date("2024-12-21T06:00:00Z").getTime(), // 6 AM next day (12 hours)
      };

      const duration = calculateDarkDuration(twilightData);

      expect(duration).toBeGreaterThan(0);
      expect(duration).toBeCloseTo(12, 1); // Should be approximately 12 hours
    });

    it("should return positive duration for valid input", () => {
      const testCases = [
        {
          nightStart: new Date("2024-07-15T20:00:00Z").getTime(),
          nightEnd: new Date("2024-07-16T04:00:00Z").getTime(),
        },
        {
          nightStart: new Date("2024-07-15T22:00:00Z").getTime(),
          nightEnd: new Date("2024-07-16T02:00:00Z").getTime(),
        },
        {
          nightStart: new Date("2024-07-15T21:00:00Z").getTime(),
          nightEnd: new Date("2024-07-16T05:00:00Z").getTime(),
        },
      ];

      testCases.forEach(({ nightStart, nightEnd }) => {
        const twilightData = {
          dawn: 0, // Not used in calculation
          dusk: 0, // Not used in calculation
          nightStart,
          nightEnd,
        };

        const duration = calculateDarkDuration(twilightData);
        expect(duration).toBeGreaterThan(0);
        expect(duration).toBeLessThan(24);
      });
    });
  });
});
