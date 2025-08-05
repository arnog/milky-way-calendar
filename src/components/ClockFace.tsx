import { useMemo } from 'react';
import { Icon } from './Icon';
import { getMoonPhaseIcon } from '../utils/moonPhase';
import Tooltip from './Tooltip';
import FormattedTime from './FormattedTime';
import { getClockLabelPosition } from '../utils/timeConversion';
import { 
  type ClockEvent, 
  type CalculatedArc, 
  type HourMarkerConfig
} from '../types/astronomicalClock';
import { 
  CLOCK_CONFIG, 
  ARC_CONFIG,
  EVENT_LABEL_CONFIG,
  calculateClockDimensions
} from '../config/clockConfig';
import { useGuaranteedLocation } from '../hooks/useLocation';
import styles from './ClockFace.module.css';

interface ClockFaceProps {
  size: number;
  dimensions: ReturnType<typeof calculateClockDimensions>;
  hourMarkerConfig: HourMarkerConfig;
  clockEvents: ClockEvent[];
  sunArcs: CalculatedArc[];
  moonArc: CalculatedArc | null;
  gcArcs: CalculatedArc[];
  currentTimeAngle: number;
  showClockHand: boolean;
  now: Date;
  moonPhase: number;
  moonIllumination: number;
  hoveredEventId: string | null;
  hoveredArcType: 'sun' | 'moon' | 'gc' | null;
  onEventHover: (eventId: string | null) => void;
  onArcHover: (arcType: 'sun' | 'moon' | 'gc' | null) => void;
}

export default function ClockFace({
  size,
  dimensions,
  hourMarkerConfig,
  clockEvents,
  sunArcs,
  moonArc,
  gcArcs,
  currentTimeAngle,
  showClockHand,
  now,
  moonPhase,
  moonIllumination,
  hoveredEventId,
  hoveredArcType,
  onEventHover,
  onArcHover
}: ClockFaceProps) {
  const { location } = useGuaranteedLocation();
  const { centerX, centerY, labelRadius } = dimensions;
  
  // Detect touch device for optimized interaction
  const isTouchDevice = useMemo(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);
  
  // Choose appropriate dimensions based on device type
  const labelDimensions = isTouchDevice 
    ? EVENT_LABEL_CONFIG.TOUCH_DIMENSIONS 
    : EVENT_LABEL_CONFIG.DIMENSIONS;

  // Determine which arcs should be highlighted for a given event
  const getHighlightedArcs = (eventId: string | null): { sun: boolean; moon: boolean; gc: boolean } => {
    if (!eventId) return { sun: false, moon: false, gc: false };
    
    switch (eventId) {
      case 'sunset':
      case 'sunrise':
      case 'twilight-end':
      case 'twilight-start':
        return { sun: true, moon: false, gc: false };
      case 'moonrise':
      case 'moonset':
        return { sun: false, moon: true, gc: false };
      case 'gc-rise':
      case 'gc-set':
      case 'gc-transit':
      case 'optimal-viewing':
        return { sun: false, moon: false, gc: true };
      default:
        return { sun: false, moon: false, gc: false };
    }
  };
  
  // Determine which events should be highlighted for a given arc type
  const getHighlightedEvents = (arcType: 'sun' | 'moon' | 'gc' | null): string[] => {
    if (!arcType) return [];
    
    switch (arcType) {
      case 'sun':
        return ['sunset', 'sunrise', 'twilight-end', 'twilight-start'];
      case 'moon':
        return ['moonrise', 'moonset'];
      case 'gc':
        return ['gc-rise', 'gc-set', 'gc-transit', 'optimal-viewing'];
      default:
        return [];
    }
  };
  
  // Combine highlighting from both event and arc hovering
  const eventHighlightedArcs = getHighlightedArcs(hoveredEventId);
  const arcHighlightedEvents = getHighlightedEvents(hoveredArcType);
  
  const highlightedArcs = {
    sun: eventHighlightedArcs.sun || hoveredArcType === 'sun',
    moon: eventHighlightedArcs.moon || hoveredArcType === 'moon',
    gc: eventHighlightedArcs.gc || hoveredArcType === 'gc'
  };
  
  // Check if an event should be highlighted (either directly hovered or via arc hover)
  const isEventHighlighted = (eventId: string): boolean => {
    return hoveredEventId === eventId || arcHighlightedEvents.includes(eventId);
  };

  // Generate accessibility description
  const generateClockDescription = () => {
    const eventCount = clockEvents.length;
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `Astronomical clock showing ${eventCount} events throughout the night. Current time: ${currentTime}. Use tab to navigate through individual events.`;
  };

  return (
    <svg 
      viewBox={`0 0 ${size} ${size}`} 
      className={styles.clockFace}
      width={size}
      height={size}
      role="img"
      aria-label={generateClockDescription()}
      aria-describedby="clock-description"
    >
      {/* Hour markers */}
      <g className={styles.hourMarkers}>
        {hourMarkerConfig.angles.map((angle, index) => {
          const pos = getClockLabelPosition(angle, hourMarkerConfig.textRadius, centerX, centerY);
          const hour = hourMarkerConfig.hours[index];
          const angleRad = (angle * Math.PI) / 180;
          
          return (
            <g key={angle}>
              {/* Hour line - from outside outer arc to inside */}
              <line
                x1={centerX + hourMarkerConfig.lineOuterRadius * Math.sin(angleRad)}
                y1={centerY - hourMarkerConfig.lineOuterRadius * Math.cos(angleRad)}
                x2={centerX + hourMarkerConfig.lineInnerRadius * Math.sin(angleRad)}
                y2={centerY - hourMarkerConfig.lineInnerRadius * Math.cos(angleRad)}
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
      <g 
        className={`${styles.sunArcs} ${highlightedArcs.sun ? styles.highlighted : ''}`} 
        aria-label="Sun and twilight periods"
        onMouseEnter={() => {
          onArcHover('sun');
          onEventHover(null); // Clear event hover when hovering arc
        }}
        onMouseLeave={() => onArcHover(null)}
      >
        {sunArcs.map((arc, index) => (
          <path
            key={`sun-${index}`}
            d={arc.path}
            stroke={arc.color}
            strokeWidth={highlightedArcs.sun ? ARC_CONFIG.DEFAULT_STROKE_WIDTH + 5 : ARC_CONFIG.DEFAULT_STROKE_WIDTH}
            fill="none"
            className={arc.className}
            opacity={highlightedArcs.sun ? 1 : (arc.opacity || 1)}
            aria-label={`${arc.className?.includes('twilight') ? 'Twilight' : arc.className?.includes('night') ? 'Night' : 'Daylight'} period`}
            style={{
              filter: highlightedArcs.sun ? 'drop-shadow(0 0 8px currentColor)' : 'none',
              transition: 'all 0.2s ease'
            }}
          />
        ))}
      </g>
      
      {/* Moon arc (middle layer) */}
      {moonArc && (
        <g 
          className={`${styles.moonArcs} ${highlightedArcs.moon ? styles.highlighted : ''}`} 
          aria-label="Moon visibility period"
          onMouseEnter={() => {
            onArcHover('moon');
            onEventHover(null); // Clear event hover when hovering arc
          }}
          onMouseLeave={() => onArcHover(null)}
        >
          <path
            d={moonArc.path}
            stroke={moonArc.color}
            strokeWidth={highlightedArcs.moon ? ARC_CONFIG.DEFAULT_STROKE_WIDTH + 5 : ARC_CONFIG.DEFAULT_STROKE_WIDTH}
            fill="none"
            className={moonArc.className}
            opacity={highlightedArcs.moon ? Math.max(0.8, moonArc.opacity || 1) : (moonArc.opacity || 1)}
            aria-label={`Moon visible period with ${moonIllumination.toFixed(0)}% illumination`}
            style={{
              filter: highlightedArcs.moon ? 'drop-shadow(0 0 8px currentColor)' : 'none',
              transition: 'all 0.2s ease'
            }}
          />
        </g>
      )}
      
      {/* Galactic Center arcs (top layer) */}
      <g 
        className={`${styles.gcArcs} ${highlightedArcs.gc ? styles.highlighted : ''}`} 
        aria-label="Galactic Center visibility periods"
        onMouseEnter={() => {
          onArcHover('gc');
          onEventHover(null); // Clear event hover when hovering arc
        }}
        onMouseLeave={() => onArcHover(null)}
      >
        {gcArcs.map((arc, index) => (
          <path
            key={`gc-${index}`}
            d={arc.path}
            stroke={arc.color}
            strokeWidth={highlightedArcs.gc ? (arc.strokeWidth || ARC_CONFIG.DEFAULT_STROKE_WIDTH) + 5 : (arc.strokeWidth || ARC_CONFIG.DEFAULT_STROKE_WIDTH)}
            fill="none"
            className={arc.className}
            opacity={highlightedArcs.gc ? Math.max(0.9, arc.opacity || 1) : (arc.opacity || 1)}
            aria-label={`${arc.className?.includes('optimal') ? 'Optimal viewing' : 'Galactic Center visible'} period`}
            style={{
              filter: highlightedArcs.gc ? 'drop-shadow(0 0 8px currentColor)' : 'none',
              transition: 'all 0.2s ease'
            }}
          />
        ))}
      </g>
      
      {/* Current time indicator - only show between 6pm and 6am */}
      {showClockHand && (
        <g className={styles.currentTimeIndicator} aria-label={`Current time: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}>
          <line
            x1={centerX - dimensions.radiusStep * Math.sin((currentTimeAngle * Math.PI) / 180)}
            y1={centerY + dimensions.radiusStep * Math.cos((currentTimeAngle * Math.PI) / 180)}
            x2={centerX + hourMarkerConfig.textRadius * Math.sin((currentTimeAngle * Math.PI) / 180)}
            y2={centerY - hourMarkerConfig.textRadius * Math.cos((currentTimeAngle * Math.PI) / 180)}
            className={styles.currentTimeLine}
            aria-label="Clock hand"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={4}
            className={styles.centerDot}
            aria-label="Clock center"
          />
        </g>
      )}
      
      {/* Moon phase icon in center */}
      <g className={styles.moonPhaseCenter}>
        <foreignObject
          x={centerX + CLOCK_CONFIG.MOON_PHASE_CENTER_OFFSET.x}
          y={centerY + CLOCK_CONFIG.MOON_PHASE_CENTER_OFFSET.y}
          width={CLOCK_CONFIG.MOON_PHASE_CENTER_OFFSET.width}
          height={CLOCK_CONFIG.MOON_PHASE_CENTER_OFFSET.height}
        >
          <div className={styles.moonPhaseCenterContent}>
            <Icon
              name={getMoonPhaseIcon(moonPhase, location.lat)}
              className="global-icon-small"
            />
            <span className={`${styles.moonIlluminationText} data-time`}>
              {moonIllumination.toFixed(0)}%
            </span>
          </div>
        </foreignObject>
      </g>
      
      {/* Event labels */}
      <g className={styles.eventLabels}>
        {clockEvents.map((event, index) => {
          const effectiveRadius = event.adjustedRadius || labelRadius;
          const labelPos = getClockLabelPosition(event.angle, effectiveRadius, centerX, centerY);
          
          return (
            <g 
              key={`event-${index}`} 
              className={`${styles.eventLabel} ${event.eventClass ? styles[event.eventClass] : ''} ${event.isDistant ? styles.distantEvent : ''} ${isEventHighlighted(event.id) ? styles.highlightedEvent : ''}`}
            >
              {/* Event icon and time with tooltip */}
              <foreignObject
                x={labelPos.x - labelDimensions.width / 2}
                y={labelPos.y - labelDimensions.height / 2}
                width={labelDimensions.width}
                height={labelDimensions.height}
                style={{ overflow: 'visible' }}
              >
                <Tooltip content={event.tooltip} placement="top">
                  <button 
                    type="button"
                    className={styles.eventLabelContent}
                    aria-label={`${event.title} at ${event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. ${event.tooltip}`}
                    onMouseEnter={() => {
                      onEventHover(event.id);
                      onArcHover(null); // Clear arc hover when hovering event
                    }}
                    onMouseLeave={() => onEventHover(null)}
                    onFocus={() => {
                      onEventHover(event.id);
                      onArcHover(null); // Clear arc hover when focusing event
                    }}
                    onBlur={() => onEventHover(null)}
                    onClick={(e) => {
                      e.preventDefault();
                      // Button click handled by event listeners above
                    }}
                  >
                    {/* Render multiple icons for consolidated events */}
                    {event.icons && event.icons.length > 1 ? (
                      <div className={styles.multiIconContainer}>
                        {event.icons.map((iconName, iconIndex) => (
                          <Icon
                            key={iconIndex}
                            name={iconName}
                            className="global-icon-small"
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    ) : (
                      <Icon
                        name={event.icon}
                        className="global-icon-small"
                        aria-hidden="true"
                      />
                    )}
                    <FormattedTime 
                      date={event.time} 
                      aria-hidden="true"
                    />
                  </button>
                </Tooltip>
              </foreignObject>
            </g>
          );
        })}
      </g>
    </svg>
  );
}