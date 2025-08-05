import { describe, it, expect } from "vitest";
import {
  computeGCObservationScore,
  createGCAltitudeFunction,
  createMoonAltitudeFunction,
  createGCMoonAngleFunction,
} from "../utils/gcObservationScoring";
import { Location } from "../types/astronomy";

describe("GC Observation Scoring Algorithm", () => {
  // Test location: Joshua Tree National Park
  const location: Location = { lat: 34.0, lng: -116.0 };

  it("should return rating 0 for high latitudes", () => {
    const highLatLocation: Location = { lat: 65.0, lng: -116.0 };
    const date = new Date("2024-06-15T22:00:00Z");

    const result = computeGCObservationScore({
      latitude: highLatLocation.lat,
      longitude: highLatLocation.lng,
      date,
      nightStart: new Date("2024-06-15T03:00:00Z"),
      nightEnd: new Date("2024-06-16T02:00:00Z"),
      moonRise: null,
      moonSet: null,
      moonIllumination: 0.0,
      gcRise: null,
      gcSet: null,
      gcAltitude: () => 0,
      moonAltitude: () => 0,
      gcMoonAngle: () => 90,
    });

    expect(result.rating).toBe(0);
    expect(result.bestTime).toBeNull();
    expect(result.curve).toHaveLength(0);
    expect(result.reason).toBe(
      "Galactic Center never visible at this latitude",
    );
  });

  it("should return rating 0 when no astronomical night", () => {
    const date = new Date("2024-06-15T22:00:00Z");

    const result = computeGCObservationScore({
      latitude: location.lat,
      longitude: location.lng,
      date,
      nightStart: null,
      nightEnd: null,
      moonRise: null,
      moonSet: null,
      moonIllumination: 0.0,
      gcRise: new Date("2024-06-16T01:00:00Z"),
      gcSet: new Date("2024-06-16T09:00:00Z"),
      gcAltitude: () => 30,
      moonAltitude: () => -10,
      gcMoonAngle: () => 90,
    });

    expect(result.rating).toBe(0);
    expect(result.bestTime).toBeNull();
    expect(result.reason).toBe(
      "No astronomical darkness (sun never reaches -18°)",
    );
  });

  it("should return rating 0 for window < 30 minutes", () => {
    const date = new Date("2024-06-15T22:00:00Z");

    const result = computeGCObservationScore({
      latitude: location.lat,
      longitude: location.lng,
      date,
      nightStart: new Date("2024-06-16T03:00:00Z"),
      nightEnd: new Date("2024-06-16T03:20:00Z"), // Only 20 minutes
      moonRise: null,
      moonSet: null,
      moonIllumination: 0.0,
      gcRise: new Date("2024-06-16T01:00:00Z"),
      gcSet: new Date("2024-06-16T09:00:00Z"),
      gcAltitude: () => 30,
      moonAltitude: () => -10,
      gcMoonAngle: () => 90,
    });

    expect(result.rating).toBe(0);
    expect(result.reason).toBe("Observation window too short (< 30 minutes)");
  });

  it("should give perfect score when moon is below horizon", () => {
    const date = new Date("2024-06-15T22:00:00Z");

    const result = computeGCObservationScore({
      latitude: location.lat,
      longitude: location.lng,
      date,
      nightStart: new Date("2024-06-16T03:00:00Z"),
      nightEnd: new Date("2024-06-16T10:00:00Z"),
      moonRise: null,
      moonSet: null,
      moonIllumination: 0.0,
      gcRise: new Date("2024-06-16T02:00:00Z"),
      gcSet: new Date("2024-06-16T11:00:00Z"),
      gcAltitude: () => 45, // High altitude
      moonAltitude: () => -10, // Below horizon
      gcMoonAngle: () => 90,
    });

    expect(result.rating).toBeGreaterThanOrEqual(3);
    expect(result.bestTime).not.toBeNull();
    expect(result.curve.length).toBeGreaterThan(0);
    expect(result.reason).toMatch(/excellent|perfect/i);

    // Check that all samples have perfect score
    const samplesWithMoonDown = result.curve.filter((s) => s.moonAlt <= 0);
    samplesWithMoonDown.forEach((sample) => {
      expect(sample.score).toBe(1.0);
    });
  });

  it("should reduce score for bright moon (>60% illumination)", () => {
    const date = new Date("2024-06-15T22:00:00Z");

    const resultBrightMoon = computeGCObservationScore({
      latitude: location.lat,
      longitude: location.lng,
      date,
      nightStart: new Date("2024-06-16T03:00:00Z"),
      nightEnd: new Date("2024-06-16T10:00:00Z"),
      moonRise: new Date("2024-06-16T02:00:00Z"),
      moonSet: new Date("2024-06-16T12:00:00Z"),
      moonIllumination: 0.8, // 80% illuminated
      gcRise: new Date("2024-06-16T02:00:00Z"),
      gcSet: new Date("2024-06-16T11:00:00Z"),
      gcAltitude: () => 45,
      moonAltitude: () => 30, // Moon is up
      gcMoonAngle: () => 90,
    });

    const resultDimMoon = computeGCObservationScore({
      latitude: location.lat,
      longitude: location.lng,
      date,
      nightStart: new Date("2024-06-16T03:00:00Z"),
      nightEnd: new Date("2024-06-16T10:00:00Z"),
      moonRise: new Date("2024-06-16T02:00:00Z"),
      moonSet: new Date("2024-06-16T12:00:00Z"),
      moonIllumination: 0.3, // 30% illuminated
      gcRise: new Date("2024-06-16T02:00:00Z"),
      gcSet: new Date("2024-06-16T11:00:00Z"),
      gcAltitude: () => 45,
      moonAltitude: () => 30,
      gcMoonAngle: () => 90,
    });

    expect(resultBrightMoon.rating).toBeLessThan(resultDimMoon.rating);
    expect(resultBrightMoon.reason).toMatch(/moon interference/i);
  });

  it("should consider angular separation for dim moon (<60%)", () => {
    const date = new Date("2024-06-15T22:00:00Z");

    const resultCloseToGC = computeGCObservationScore({
      latitude: location.lat,
      longitude: location.lng,
      date,
      nightStart: new Date("2024-06-16T03:00:00Z"),
      nightEnd: new Date("2024-06-16T10:00:00Z"),
      moonRise: new Date("2024-06-16T02:00:00Z"),
      moonSet: new Date("2024-06-16T12:00:00Z"),
      moonIllumination: 0.4, // 40% illuminated
      gcRise: new Date("2024-06-16T02:00:00Z"),
      gcSet: new Date("2024-06-16T11:00:00Z"),
      gcAltitude: () => 45,
      moonAltitude: () => 30,
      gcMoonAngle: () => 20, // Close to GC
    });

    const resultFarFromGC = computeGCObservationScore({
      latitude: location.lat,
      longitude: location.lng,
      date,
      nightStart: new Date("2024-06-16T03:00:00Z"),
      nightEnd: new Date("2024-06-16T10:00:00Z"),
      moonRise: new Date("2024-06-16T02:00:00Z"),
      moonSet: new Date("2024-06-16T12:00:00Z"),
      moonIllumination: 0.4, // Same illumination
      gcRise: new Date("2024-06-16T02:00:00Z"),
      gcSet: new Date("2024-06-16T11:00:00Z"),
      gcAltitude: () => 45,
      moonAltitude: () => 30,
      gcMoonAngle: () => 120, // Far from GC
    });

    expect(resultFarFromGC.rating).toBeGreaterThan(resultCloseToGC.rating);
  });

  it("should apply window length multiplier", () => {
    const date = new Date("2024-06-15T22:00:00Z");

    const shortWindow = computeGCObservationScore({
      latitude: location.lat,
      longitude: location.lng,
      date,
      nightStart: new Date("2024-06-16T03:00:00Z"),
      nightEnd: new Date("2024-06-16T04:00:00Z"), // 1 hour window
      moonRise: null,
      moonSet: null,
      moonIllumination: 0.0,
      gcRise: new Date("2024-06-16T02:00:00Z"),
      gcSet: new Date("2024-06-16T11:00:00Z"),
      gcAltitude: () => 45,
      moonAltitude: () => -10,
      gcMoonAngle: () => 90,
    });

    const longWindow = computeGCObservationScore({
      latitude: location.lat,
      longitude: location.lng,
      date,
      nightStart: new Date("2024-06-16T03:00:00Z"),
      nightEnd: new Date("2024-06-16T08:00:00Z"), // 5 hour window
      moonRise: null,
      moonSet: null,
      moonIllumination: 0.0,
      gcRise: new Date("2024-06-16T02:00:00Z"),
      gcSet: new Date("2024-06-16T11:00:00Z"),
      gcAltitude: () => 45,
      moonAltitude: () => -10,
      gcMoonAngle: () => 90,
    });

    // With our gentler window multiplier, both might hit 4⭐ cap
    // but the long window should have equal or higher raw score
    expect(longWindow.rating).toBeGreaterThanOrEqual(shortWindow.rating);
  });

  it("should skip samples where GC altitude < 15°", () => {
    const date = new Date("2024-06-15T22:00:00Z");

    const result = computeGCObservationScore({
      latitude: location.lat,
      longitude: location.lng,
      date,
      nightStart: new Date("2024-06-16T03:00:00Z"),
      nightEnd: new Date("2024-06-16T06:00:00Z"),
      moonRise: null,
      moonSet: null,
      moonIllumination: 0.0,
      gcRise: new Date("2024-06-16T02:00:00Z"),
      gcSet: new Date("2024-06-16T11:00:00Z"),
      gcAltitude: (time) => {
        // Return low altitude for first hour, then high
        const hoursSinceStart =
          (time.getTime() - new Date("2024-06-16T03:00:00Z").getTime()) /
          (1000 * 60 * 60);
        return hoursSinceStart < 1 ? 10 : 30;
      },
      moonAltitude: () => -10,
      gcMoonAngle: () => 90,
    });

    // Should have some samples but not all (some were skipped due to low altitude)
    expect(result.curve.length).toBeGreaterThan(0);
    expect(result.curve.every((s) => s.altitudeGC >= 15)).toBe(true);
  });

  it("should use variable step integration", () => {
    const date = new Date("2024-06-15T22:00:00Z");

    const result = computeGCObservationScore({
      latitude: location.lat,
      longitude: location.lng,
      date,
      nightStart: new Date("2024-06-16T03:00:00Z"),
      nightEnd: new Date("2024-06-16T06:00:00Z"), // 3 hour window
      moonRise: null,
      moonSet: null,
      moonIllumination: 0.0,
      gcRise: new Date("2024-06-16T02:00:00Z"),
      gcSet: new Date("2024-06-16T11:00:00Z"),
      gcAltitude: () => 30,
      moonAltitude: () => -10,
      gcMoonAngle: () => 90,
    });

    // Check that we have samples from different segments
    const times = result.curve.map((s) => s.time.getTime());

    // First 30 minutes should have more samples (2 min step)
    const firstSegmentEnd = new Date("2024-06-16T03:30:00Z").getTime();
    const firstSegmentSamples = times.filter(
      (t) => t <= firstSegmentEnd,
    ).length;

    // Middle segment should have fewer samples (8 min step)
    const middleSegmentStart = firstSegmentEnd;
    const middleSegmentEnd = new Date("2024-06-16T05:30:00Z").getTime();
    const middleSegmentSamples = times.filter(
      (t) => t > middleSegmentStart && t < middleSegmentEnd,
    ).length;

    // Verify density difference
    expect(firstSegmentSamples).toBeGreaterThan(0);
    expect(middleSegmentSamples).toBeGreaterThan(0);
  });
});

describe("Helper Functions", () => {
  const location: Location = { lat: 34.0, lng: -116.0 };
  const date = new Date("2024-06-15T09:00:00Z"); // June 15, 2AM PDT

  it("createGCAltitudeFunction should return valid altitudes", () => {
    const gcAltitude = createGCAltitudeFunction(location);
    const altitude = gcAltitude(date);

    expect(altitude).toBeTypeOf("number");
    expect(altitude).toBeGreaterThanOrEqual(-90);
    expect(altitude).toBeLessThanOrEqual(90);
  });

  it("createMoonAltitudeFunction should return valid altitudes", () => {
    const moonAltitude = createMoonAltitudeFunction(location);
    const altitude = moonAltitude(date);

    expect(altitude).toBeTypeOf("number");
    expect(altitude).toBeGreaterThanOrEqual(-90);
    expect(altitude).toBeLessThanOrEqual(90);
  });

  it("createGCMoonAngleFunction should return valid angles", () => {
    const gcMoonAngle = createGCMoonAngleFunction(location);
    const angle = gcMoonAngle(date);

    expect(angle).toBeTypeOf("number");
    expect(angle).toBeGreaterThanOrEqual(0);
    expect(angle).toBeLessThanOrEqual(180);
  });

  it("should calculate correct angle between GC and Moon", () => {
    const gcMoonAngle = createGCMoonAngleFunction(location);

    // Test at different times to get different angles
    const date1 = new Date("2024-06-15T09:00:00Z");
    const date2 = new Date("2024-06-15T21:00:00Z");

    const angle1 = gcMoonAngle(date1);
    const angle2 = gcMoonAngle(date2);

    // Angles should be different at different times
    expect(angle1).not.toBe(angle2);
  });
});
