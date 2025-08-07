import { describe, it, expect } from "vitest";
import { calculateTonightEvents } from "../utils/calculateTonightEvents";

describe("calculateTonightEvents", () => {
  it("should return events in chronological order", () => {
    // Test location: Los Angeles
    const location = { lat: 34.05, lng: -118.25 };

    // Test date: August 6, 2025 at 3pm
    const testDate = new Date("2025-08-06T15:00:00");

    const events = calculateTonightEvents(testDate, location);

    // Collect all events with times
    const eventTimes: { name: string; time: Date }[] = [];

    if (events.sunSet) eventTimes.push({ name: "Sunset", time: events.sunSet });
    if (events.nightStart)
      eventTimes.push({ name: "Night Start", time: events.nightStart });
    if (events.moonRise)
      eventTimes.push({ name: "Moonrise", time: events.moonRise });
    if (events.moonSet)
      eventTimes.push({ name: "Moonset", time: events.moonSet });
    if (events.gcRise)
      eventTimes.push({ name: "GC Rise", time: events.gcRise });
    if (events.gcTransit)
      eventTimes.push({ name: "GC Transit", time: events.gcTransit });
    if (events.gcSet) eventTimes.push({ name: "GC Set", time: events.gcSet });
    if (events.nightEnd)
      eventTimes.push({ name: "Night End", time: events.nightEnd });
    if (events.sunRise)
      eventTimes.push({ name: "Sunrise", time: events.sunRise });

    // Sort by time
    eventTimes.sort((a, b) => a.time.getTime() - b.time.getTime());

    // Verify specific ordering rules
    if (events.gcRise && events.gcTransit && events.gcSet) {
      // GC Transit should be between Rise and Set
      expect(events.gcTransit.getTime()).toBeGreaterThan(
        events.gcRise.getTime(),
      );
      expect(events.gcTransit.getTime()).toBeLessThan(events.gcSet.getTime());
    }

    if (events.sunSet && events.nightStart) {
      // Night Start should be after Sunset
      expect(events.nightStart.getTime()).toBeGreaterThan(
        events.sunSet.getTime(),
      );
    }

    if (events.nightEnd && events.sunRise) {
      // Night End should be before Sunrise
      expect(events.nightEnd.getTime()).toBeLessThan(events.sunRise.getTime());
    }

    // Log the events for debugging
    console.log("Events in order:");
    eventTimes.forEach((e) => {
      console.log(`  ${e.name}: ${e.time.toLocaleString()}`);
    });
  });

  it("should handle early morning times correctly", () => {
    // Test location: Los Angeles
    const location = { lat: 34.05, lng: -118.25 };

    // Test date: August 6, 2025 at 2am (should use yesterday's 6pm as fulcrum)
    const testDate = new Date("2025-08-06T02:00:00");

    const events = calculateTonightEvents(testDate, location);

    // Should still get valid events
    expect(events).toBeDefined();

    // If we have GC events, they should be in order
    if (events.gcRise && events.gcTransit && events.gcSet) {
      expect(events.gcTransit.getTime()).toBeGreaterThan(
        events.gcRise.getTime(),
      );
      expect(events.gcTransit.getTime()).toBeLessThan(events.gcSet.getTime());
    }
  });

  it("should use 6pm as fulcrum point", () => {
    // Test location: Los Angeles
    const location = { lat: 34.05, lng: -118.25 };

    // Test date: August 6, 2025 at noon
    const testDate = new Date("2025-08-06T12:00:00");
    const sixPm = new Date("2025-08-06T18:00:00");

    const events = calculateTonightEvents(testDate, location);

    // Sunset should be close to 6pm (within a few hours)
    if (events.sunSet) {
      const hoursFromSixPm =
        Math.abs(events.sunSet.getTime() - sixPm.getTime()) / (60 * 60 * 1000);
      expect(hoursFromSixPm).toBeLessThan(4); // Within 4 hours of 6pm
    }
  });
});
