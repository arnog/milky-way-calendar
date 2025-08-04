import { useMemo, useEffect, useState } from 'react';
import { useGuaranteedLocation } from '../hooks/useLocation';
import { 
  timeToAngle, 
  getCurrentTimeAngle
} from '../utils/timeConversion';
import { 
  createSunArc, 
  createMoonArc, 
  createGalacticCenterArc
} from '../utils/arcCalculation';
import { processAstronomicalEvents } from '../utils/clockEventProcessor';
import { 
  type AstronomicalClockProps
} from '../types/astronomicalClock';
import { 
  CLOCK_CONFIG, 
  calculateClockDimensions, 
  getHourMarkerConfig 
} from '../config/clockConfig';
import SwipeablePanels from './SwipeablePanels';
import ClockFace from './ClockFace';
import EventListView from './EventListView';
import styles from './AstronomicalClock.module.css';

export default function AstronomicalClock({ 
  events, 
  currentDate,
  size = CLOCK_CONFIG.DEFAULT_SIZE 
}: AstronomicalClockProps) {
  const { location } = useGuaranteedLocation();
  
  const [refreshTick, setRefreshTick] = useState(0);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [hoveredArcType, setHoveredArcType] = useState<'sun' | 'moon' | 'gc' | null>(null);
  const now = useMemo(() => currentDate || new Date(), [currentDate, refreshTick]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const currentTimeAngle = getCurrentTimeAngle(location, now);
  
  // Check if current time is within the display window (6pm to 6am)
  const currentHour = now.getHours();
  const showClockHand = currentHour >= 18 || currentHour < 6;
  
  // Auto-refresh clock position every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTick(tick => tick + 1);
    }, CLOCK_CONFIG.AUTO_REFRESH_INTERVAL);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate dimensions using configuration
  const dimensions = calculateClockDimensions(size);
  const { centerX, centerY, sunRadius, moonRadius, gcRadius, labelRadius } = dimensions;
  
  // Hour marker configuration
  const hourMarkerConfig = getHourMarkerConfig(dimensions);
  
  // Process events into clock positions
  const clockEvents = useMemo(() => {
    return processAstronomicalEvents(events, location, now, labelRadius, size);
  }, [events, location, now, labelRadius, size]);
  
  // Generate arc data
  const sunArcs = useMemo(() => {
    if (!events.sunSet || !events.nightStart || 
        !events.nightEnd || !events.sunRise) {
      return [];
    }
    
    return createSunArc(
      timeToAngle(events.sunSet, location),
      timeToAngle(events.nightStart, location),
      timeToAngle(events.nightEnd, location),
      timeToAngle(events.sunRise, location),
      sunRadius,
      centerX,
      centerY
    );
  }, [events, location, sunRadius, centerX, centerY]);
  
  const moonArc = useMemo(() => {
    if (!events.moonRise || !events.moonSet) {
      return null;
    }
    
    return createMoonArc(
      timeToAngle(events.moonRise, location),
      timeToAngle(events.moonSet, location),
      events.moonIllumination / 100, // Convert percentage to decimal
      moonRadius,
      centerX,
      centerY
    );
  }, [events, location, moonRadius, centerX, centerY]);
  
  const gcArcs = useMemo(() => {
    if (!events.gcRise || !events.gcSet || !events.optimalWindow.startTime || !events.optimalWindow.endTime) {
      return [];
    }
    
    return createGalacticCenterArc(
      timeToAngle(events.gcRise, location),
      timeToAngle(events.optimalWindow.startTime, location),
      timeToAngle(events.optimalWindow.endTime, location),
      timeToAngle(events.gcSet, location),
      events.optimalWindow.averageScore || 0.5,
      gcRadius,
      centerX,
      centerY
    );
  }, [events, location, gcRadius, centerX, centerY]);

  // Create panels for SwipeablePanels
  const panels = [
    {
      id: 'clock',
      title: 'Clock View',
      content: (
        <ClockFace
          size={size}
          dimensions={dimensions}
          hourMarkerConfig={hourMarkerConfig}
          clockEvents={clockEvents}
          sunArcs={sunArcs}
          moonArc={moonArc}
          gcArcs={gcArcs}
          currentTimeAngle={currentTimeAngle}
          showClockHand={showClockHand}
          now={now}
          moonPhase={events.moonPhase}
          moonIllumination={events.moonIllumination}
          hoveredEventId={hoveredEventId}
          hoveredArcType={hoveredArcType}
          onEventHover={setHoveredEventId}
          onArcHover={setHoveredArcType}
        />
      )
    },
    {
      id: 'list',
      title: 'Event List',
      content: (
        <EventListView
          clockEvents={clockEvents}
          moonPhase={events.moonPhase}
          moonIllumination={events.moonIllumination}
          optimalWindow={events.optimalWindow}
        />
      )
    }
  ];
  
  // Generate accessibility description
  const generateEventListDescription = () => {
    const eventSummary = clockEvents
      .sort((a, b) => a.time.getTime() - b.time.getTime())
      .map(event => `${event.title} at ${event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`)
      .join(', ');
    return `Tonight's astronomical events in chronological order: ${eventSummary}`;
  };

  return (
    <div className={styles.clockContainer}>
      {/* Hidden description for screen readers */}
      <div id="clock-description" className="sr-only">
        {generateEventListDescription()}
      </div>
      
      {/* ARIA live region for time updates */}
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        Current time: {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      
      <SwipeablePanels 
        panels={panels}
        initialPanel={0}
      />
    </div>
  );
}