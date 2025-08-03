import { useMemo } from 'react';
import { Location } from '../types/astronomy';
import { Icon } from './Icon';
import ClockTooltip from './ClockTooltip';
import FormattedTime from './FormattedTime';
import { 
  timeToAngle, 
  getCurrentTimeAngle, 
  getClockLabelPosition, 
  isEventDistant
} from '../utils/timeConversion';
import { 
  createSunArc, 
  createMoonArc, 
  createGalacticCenterArc
} from '../utils/arcCalculation';
import styles from './AstronomicalClock.module.css';

// Interface for astronomical events (matches TonightCard data)
interface AstronomicalEvents {
  sunRise?: Date;
  sunSet?: Date;
  astronomicalTwilightEnd?: Date;
  astronomicalTwilightStart?: Date;
  moonRise?: Date;
  moonSet?: Date;
  moonIllumination: number;
  gcRise?: Date;
  gcSet?: Date;
  optimalWindow: {
    startTime: Date | null;
    endTime: Date | null;
    averageScore?: number;
  };
}

interface AstronomicalClockProps {
  events: AstronomicalEvents;
  location: Location;
  currentDate?: Date;
  size?: number; // Clock diameter in pixels
}

interface ClockEvent {
  time: Date;
  angle: number;
  icon: string;
  title: string;
  tooltip: string;
  isDistant: boolean;
}

export default function AstronomicalClock({ 
  events, 
  location, 
  currentDate,
  size = 420 
}: AstronomicalClockProps) {
  const now = useMemo(() => currentDate || new Date(), [currentDate]);
  const centerX = size / 2;
  const centerY = size / 2;
  const currentTimeAngle = getCurrentTimeAngle(location, now);
  
  // Calculate arc radii (from center outward) 
  const baseRadius = size * 0.28; // Optimal base radius for visual balance
  const sunRadius = baseRadius - 15;
  const moonRadius = baseRadius;
  const gcRadius = baseRadius + 15;
  const labelRadius = baseRadius + 45; // Closer to arcs with hour markers moved inside
  
  // Process events into clock positions
  const clockEvents = useMemo(() => {
    const eventList: ClockEvent[] = [];
    
    
    // Sun events
    if (events.sunSet) {
      eventList.push({
        time: events.sunSet,
        angle: timeToAngle(events.sunSet, location),
        icon: 'sunset',
        title: 'Sunset',
        tooltip: 'Civil twilight begins - sun dips below horizon, but sky remains bright for photography',
        isDistant: isEventDistant(events.sunSet, now)
      });
    }
    
    if (events.astronomicalTwilightEnd) {
      eventList.push({
        time: events.astronomicalTwilightEnd,
        angle: timeToAngle(events.astronomicalTwilightEnd, location),
        icon: 'night-rise',
        title: 'Astronomical Night Start',
        tooltip: 'True darkness begins - sun reaches -18° below horizon, ideal for deep sky photography',
        isDistant: isEventDistant(events.astronomicalTwilightEnd, now)
      });
    }
    
    if (events.astronomicalTwilightStart) {
      eventList.push({
        time: events.astronomicalTwilightStart,
        angle: timeToAngle(events.astronomicalTwilightStart, location),
        icon: 'night-set',
        title: 'Astronomical Night End',
        tooltip: 'Darkness ends - sun reaches -18° below horizon, sky begins to brighten',
        isDistant: isEventDistant(events.astronomicalTwilightStart, now)
      });
    }
    
    if (events.sunRise) {
      eventList.push({
        time: events.sunRise,
        angle: timeToAngle(events.sunRise, location),
        icon: 'sunrise',
        title: 'Sunrise',
        tooltip: 'Civil dawn ends - sun rises above horizon, photography session typically concludes',
        isDistant: isEventDistant(events.sunRise, now)
      });
    }
    
    // Moon events
    if (events.moonRise) {
      eventList.push({
        time: events.moonRise,
        angle: timeToAngle(events.moonRise, location),
        icon: 'moonrise',
        title: 'Moonrise',
        tooltip: `Moon rises above horizon (${events.moonIllumination.toFixed(0)}% illuminated) - may interfere with faint object photography`,
        isDistant: isEventDistant(events.moonRise, now)
      });
    }
    
    if (events.moonSet) {
      eventList.push({
        time: events.moonSet,
        angle: timeToAngle(events.moonSet, location),
        icon: 'moonset',
        title: 'Moonset',
        tooltip: `Moon sets below horizon - darker skies resume for improved contrast and faint object visibility`,
        isDistant: isEventDistant(events.moonSet, now)
      });
    }
    
    // Galactic Center events
    if (events.gcRise) {
      eventList.push({
        time: events.gcRise,
        angle: timeToAngle(events.gcRise, location),
        icon: 'galaxy-rise',
        title: 'Galactic Core Rise',
        tooltip: 'Galactic Core reaches 10° above horizon - minimum altitude for quality Milky Way photography begins',
        isDistant: isEventDistant(events.gcRise, now)
      });
    }
    
    if (events.optimalWindow.startTime) {
      const qualityScore = events.optimalWindow.averageScore || 0;
      const qualityPercent = Math.round(qualityScore * 100);
      eventList.push({
        time: events.optimalWindow.startTime,
        angle: timeToAngle(events.optimalWindow.startTime, location),
        icon: 'telescope',
        title: 'Optimal Viewing Start',
        tooltip: `Best viewing conditions begin - ${qualityPercent}% quality considering altitude, darkness, and moon interference`,
        isDistant: isEventDistant(events.optimalWindow.startTime, now)
      });
    }
    
    if (events.gcSet) {
      eventList.push({
        time: events.gcSet,
        angle: timeToAngle(events.gcSet, location),
        icon: 'galaxy-set',
        title: 'Galactic Core Set',
        tooltip: 'Galactic Core drops below 10° altitude - quality photography becomes challenging due to low elevation',
        isDistant: isEventDistant(events.gcSet, now)
      });
    }
    
    return eventList;
  }, [events, location, now]);
  
  // Generate arc data
  const sunArcs = useMemo(() => {
    if (!events.sunSet || !events.astronomicalTwilightEnd || 
        !events.astronomicalTwilightStart || !events.sunRise) {
      return [];
    }
    
    return createSunArc(
      timeToAngle(events.sunSet, location),
      timeToAngle(events.astronomicalTwilightEnd, location),
      timeToAngle(events.astronomicalTwilightStart, location),
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
  
  return (
    <div className={styles.clockContainer}>
      <svg 
        viewBox={`0 0 ${size} ${size}`} 
        className={styles.clockFace}
        width={size}
        height={size}
      >
        {/* Hour markers */}
        <g className={styles.hourMarkers}>
          {[0, 90, 180, 270].map(angle => {
            const hourMarkRadius = baseRadius - 25; // Move hour lines inside the arcs
            const hourTextRadius = baseRadius - 40; // Position hour numbers well inside the clock face
            const pos = getClockLabelPosition(angle, hourTextRadius, centerX, centerY);
            const hour = angle === 0 ? '12' : angle === 90 ? '3' : angle === 180 ? '6' : '9';
            
            return (
              <g key={angle}>
                {/* Hour line */}
                <line
                  x1={centerX + (hourMarkRadius + 10) * Math.sin((angle * Math.PI) / 180)}
                  y1={centerY - (hourMarkRadius + 10) * Math.cos((angle * Math.PI) / 180)}
                  x2={centerX + (hourMarkRadius + 25) * Math.sin((angle * Math.PI) / 180)}
                  y2={centerY - (hourMarkRadius + 25) * Math.cos((angle * Math.PI) / 180)}
                  className={styles.hourLine}
                />
                {/* Hour number */}
                <text
                  x={pos.x}
                  y={pos.y}
                  className={styles.hourText}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {hour}
                </text>
              </g>
            );
          })}
        </g>
        
        {/* Sun arcs (background layer) */}
        <g className={styles.sunArcs}>
          {sunArcs.map((arc, index) => (
            <path
              key={`sun-${index}`}
              d={arc.path}
              stroke={arc.color}
              strokeWidth={8}
              fill="none"
              className={arc.className}
              opacity={arc.opacity || 1}
            />
          ))}
        </g>
        
        {/* Moon arc (middle layer) */}
        {moonArc && (
          <g className={styles.moonArcs}>
            <path
              d={moonArc.path}
              stroke={moonArc.color}
              strokeWidth={8}
              fill="none"
              className={moonArc.className}
              opacity={moonArc.opacity || 1}
            />
          </g>
        )}
        
        {/* Galactic Center arcs (top layer) */}
        <g className={styles.gcArcs}>
          {gcArcs.map((arc, index) => (
            <path
              key={`gc-${index}`}
              d={arc.path}
              stroke={arc.color}
              strokeWidth={arc.strokeWidth || 8}
              fill="none"
              className={arc.className}
              opacity={arc.opacity || 1}
            />
          ))}
        </g>
        
        {/* Current time indicator */}
        <g className={styles.currentTimeIndicator}>
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX + (baseRadius - 40) * Math.sin((currentTimeAngle * Math.PI) / 180)}
            y2={centerY - (baseRadius - 40) * Math.cos((currentTimeAngle * Math.PI) / 180)}
            className={styles.currentTimeLine}
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={4}
            className={styles.centerDot}
          />
        </g>
        
        
        {/* Event labels */}
        <g className={styles.eventLabels}>
          {clockEvents.map((event, index) => {
            const labelPos = getClockLabelPosition(event.angle, labelRadius, centerX, centerY);
            
            return (
              <g 
                key={`event-${index}`} 
                className={`${styles.eventLabel} ${event.isDistant ? styles.distantEvent : ''}`}
              >
                {/* Event icon and time with tooltip */}
                <foreignObject
                  x={labelPos.x - 40}
                  y={labelPos.y - 35}
                  width={80}
                  height={70}
                  style={{ overflow: 'visible' }}
                >
                  <ClockTooltip content={event.tooltip}>
                    <div className={styles.eventLabelContent}>
                      <Icon
                        name={event.icon}
                        className="global-icon-small color-accent"
                      />
                      <FormattedTime 
                        date={event.time} 
                        location={location}
                        className={styles.eventTimeText}
                      />
                    </div>
                  </ClockTooltip>
                </foreignObject>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}