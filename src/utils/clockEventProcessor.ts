import { Location } from '../types/astronomy';
import { timeToAngle, isEventDistant } from './timeConversion';
import { 
  type ClockEvent 
} from '../types/astronomicalClock';
import { type AstronomicalEvents } from '../types/astronomy';
import { EVENT_LABEL_CONFIG } from '../config/clockConfig';

/**
 * Calculate angular difference between two angles, handling wrap-around
 * @param angle1 First angle in degrees
 * @param angle2 Second angle in degrees
 * @returns Minimum angular difference (0-180 degrees)
 */
function getAngularDifference(angle1: number, angle2: number): number {
  let diff = Math.abs(angle1 - angle2);
  if (diff > 180) {
    diff = 360 - diff;
  }
  return diff;
}

/**
 * Consolidate events that happen at exactly the same time into combined labels
 * @param events Array of clock events
 * @returns Array with same-time events consolidated
 */
function consolidateSameTimeEvents(events: ClockEvent[]): ClockEvent[] {
  const consolidatedEvents: ClockEvent[] = [];
  const processedTimes = new Set<string>();
  
  for (const event of events) {
    const timeKey = event.time.getTime().toString();
    
    if (processedTimes.has(timeKey)) {
      continue; // Already processed this time
    }
    
    // Find all events with the same time
    const sameTimeEvents = events.filter(e => e.time.getTime() === event.time.getTime());
    
    if (sameTimeEvents.length === 1) {
      // Single event, add as-is
      consolidatedEvents.push(event);
    } else {
      // Multiple events at same time, create consolidated event
      const icons = sameTimeEvents.map(e => e.icon);
      const titles = sameTimeEvents.map(e => e.title);
      const tooltips = sameTimeEvents.map(e => e.tooltip);
      
      // Create combined event with multiple icons
      const consolidatedEvent: ClockEvent = {
        id: sameTimeEvents.map(e => e.id).join('+'),
        time: event.time,
        angle: event.angle,
        icon: icons[0], // Primary icon
        title: titles.join(' + '),
        tooltip: tooltips.join(' | '),
        isDistant: event.isDistant,
        eventClass: 'multiEvent', // New class for multi-events
        icons: icons, // Store all icons
        titles: titles, // Store all titles
        adjustedRadius: event.adjustedRadius // Preserve radius from first event
      };
      
      consolidatedEvents.push(consolidatedEvent);
    }
    
    processedTimes.add(timeKey);
  }
  
  return consolidatedEvents;
}

/**
 * Handles label collision detection and adjustment using layered positioning
 * @param events - Array of clock events to check for collisions
 * @param baseRadius - Base radius for event label positioning
 * @param size - Clock size for calculating adjustment offset
 * @returns Array of events with adjusted radii for colliding events
 */
export function adjustEventRadii(events: ClockEvent[], baseRadius: number, size: number): ClockEvent[] {
  if (events.length <= 1) return events;
  
  const adjustedEvents = [...events];
  const collisionThreshold = EVENT_LABEL_CONFIG.COLLISION_THRESHOLD;
  const radiusStep = size * EVENT_LABEL_CONFIG.COLLISION_RADIUS_STEP;
  
  // Sort events by angle for consistent processing
  adjustedEvents.sort((a, b) => a.angle - b.angle);
  
  // Initialize all events at base layer
  adjustedEvents.forEach(event => {
    event.adjustedRadius = undefined; // Reset any previous adjustments
  });
  
  // Use a more robust spacing algorithm
  // Check each event against ALL other events, not just layer-by-layer
  for (let i = 0; i < adjustedEvents.length; i++) {
    const currentEvent = adjustedEvents[i];
    let layer = 0;
    let hasCollision = true;
    
    // Keep trying layers until we find one without collisions
    while (hasCollision && layer < 5) { // Max 5 layers to prevent infinite loops
      hasCollision = false;
      const currentRadius = baseRadius + (radiusStep * layer);
      
      // Check against all other events
      for (let j = 0; j < adjustedEvents.length; j++) {
        if (i === j) continue;
        
        const otherEvent = adjustedEvents[j];
        const otherRadius = otherEvent.adjustedRadius || baseRadius;
        
        // Only check collision if events are on the same layer (same radius)
        if (Math.abs(currentRadius - otherRadius) < 1) { // Within 1px tolerance
          const angularDiff = getAngularDifference(currentEvent.angle, otherEvent.angle);
          if (angularDiff < collisionThreshold) {
            hasCollision = true;
            break;
          }
        }
      }
      
      if (!hasCollision) {
        // Found a layer without collisions
        if (layer > 0) {
          currentEvent.adjustedRadius = baseRadius + (radiusStep * layer);
        }
        break;
      }
      
      layer++;
    }
  }
  
  return adjustedEvents;
}

/**
 * Processes astronomical events into clock events with proper positioning and styling
 * @param events - Raw astronomical events data
 * @param location - Observer location for angle calculations
 * @param now - Current time for distance calculations
 * @param labelRadius - Base radius for event label positioning
 * @param size - Clock size for collision adjustment calculations
 * @returns Array of processed clock events with collision adjustment applied
 */
export function processAstronomicalEvents(
  events: AstronomicalEvents,
  location: Location,
  now: Date,
  labelRadius: number,
  size: number
): ClockEvent[] {
  // Calculate the different arc radii
  const radiusStep = size * 0.12; // RADIUS_STEP_RATIO
  const sunRadius = labelRadius - radiusStep;
  const moonRadius = labelRadius;
  const gcRadius = labelRadius + radiusStep;
  const eventList: ClockEvent[] = [];
  
  // Sun events
  if (events.sunSet) {
    eventList.push({
      id: 'sunset',
      time: events.sunSet,
      angle: timeToAngle(events.sunSet, location),
      icon: 'sunset',
      title: 'Sunset',
      tooltip: 'Civil twilight begins - sun dips below horizon, but sky remains bright for photography',
      isDistant: isEventDistant(events.sunSet, now),
      eventClass: 'sunsetEvent',
      adjustedRadius: sunRadius
    });
  }
  
  if (events.nightStart) {
    eventList.push({
      id: 'twilight-end',
      time: events.nightStart,
      angle: timeToAngle(events.nightStart, location),
      icon: 'night-rise',
      title: 'Astronomical Night Start',
      tooltip: 'True darkness begins - sun reaches -18° below horizon, ideal for deep sky photography',
      isDistant: isEventDistant(events.nightStart, now),
      eventClass: 'nightEvent',
      adjustedRadius: sunRadius
    });
  }
  
  if (events.nightEnd) {
    eventList.push({
      id: 'twilight-start',
      time: events.nightEnd,
      angle: timeToAngle(events.nightEnd, location),
      icon: 'night-set',
      title: 'Astronomical Night End',
      tooltip: 'Darkness ends - sun reaches -18° below horizon, sky begins to brighten',
      isDistant: isEventDistant(events.nightEnd, now),
      eventClass: 'nightEvent',
      adjustedRadius: sunRadius
    });
  }
  
  if (events.sunRise) {
    eventList.push({
      id: 'sunrise',
      time: events.sunRise,
      angle: timeToAngle(events.sunRise, location),
      icon: 'sunrise',
      title: 'Sunrise',
      tooltip: 'Civil dawn ends - sun rises above horizon, photography session typically concludes',
      isDistant: isEventDistant(events.sunRise, now),
      eventClass: 'sunriseEvent',
      adjustedRadius: sunRadius
    });
  }
  
  // Moon events
  if (events.moonRise) {
    eventList.push({
      id: 'moonrise',
      time: events.moonRise,
      angle: timeToAngle(events.moonRise, location),
      icon: 'moonrise',
      title: 'Moonrise',
      tooltip: `Moon rises above horizon (${events.moonIllumination.toFixed(0)}% illuminated) - may interfere with faint object photography`,
      isDistant: isEventDistant(events.moonRise, now),
      eventClass: 'moonEvent',
      adjustedRadius: moonRadius
    });
  }
  
  if (events.moonSet) {
    eventList.push({
      id: 'moonset',
      time: events.moonSet,
      angle: timeToAngle(events.moonSet, location),
      icon: 'moonset',
      title: 'Moonset',
      tooltip: `Moon sets below horizon - darker skies resume for improved contrast and faint object visibility`,
      isDistant: isEventDistant(events.moonSet, now),
      eventClass: 'moonEvent',
      adjustedRadius: moonRadius
    });
  }
  
  // Galactic Center events
  if (events.gcRise) {
    eventList.push({
      id: 'gc-rise',
      time: events.gcRise,
      angle: timeToAngle(events.gcRise, location),
      icon: 'galaxy-rise',
      title: 'Galactic Core Rise',
      tooltip: 'Galactic Core reaches 10° above horizon - minimum altitude for quality Milky Way photography begins',
      isDistant: isEventDistant(events.gcRise, now),
      eventClass: 'gcEvent',
      adjustedRadius: gcRadius
    });
  }
  
  // Add GC max altitude marker (transit)
  if (events.gcTransit) {
    eventList.push({
      id: 'gc-transit',
      time: events.gcTransit,
      angle: timeToAngle(events.gcTransit, location),
      icon: 'apex',
      title: 'Galactic Core Peak',
      tooltip: `Galactic Core reaches maximum altitude of ${events.maxGcAltitude.toFixed(1)}° - best time for overhead shots`,
      isDistant: isEventDistant(events.gcTransit, now),
      eventClass: 'gcEvent',
      adjustedRadius: gcRadius
    });
  }
  
  if (events.optimalWindow.startTime) {
    const qualityScore = events.optimalWindow.averageScore || 0;
    const qualityPercent = Math.round(qualityScore * 100);
    eventList.push({
      id: 'optimal-viewing',
      time: events.optimalWindow.startTime,
      angle: timeToAngle(events.optimalWindow.startTime, location),
      icon: 'telescope',
      title: 'Optimal Viewing Start',
      tooltip: `Best viewing conditions begin - ${qualityPercent}% quality considering altitude, darkness, and moon interference`,
      isDistant: isEventDistant(events.optimalWindow.startTime, now),
      eventClass: 'optimalEvent',
      adjustedRadius: gcRadius
    });
  }
  
  if (events.gcSet) {
    eventList.push({
      id: 'gc-set',
      time: events.gcSet,
      angle: timeToAngle(events.gcSet, location),
      icon: 'galaxy-set',
      title: 'Galactic Core Set',
      tooltip: 'Galactic Core drops below 10° altitude - quality photography becomes challenging due to low elevation',
      isDistant: isEventDistant(events.gcSet, now),
      eventClass: 'gcEvent',
      adjustedRadius: gcRadius
    });
  }
  
  // First consolidate same-time events
  const consolidatedEvents = consolidateSameTimeEvents(eventList);
  
  // Return without collision adjustment since events are inside the arcs
  return consolidatedEvents;
}