import { useMemo, useEffect, useState, useRef } from 'react';
import { useLocation } from '../hooks/useLocation';
import { Icon } from './Icon';
import { getMoonPhaseIcon } from '../utils/moonPhase';
import ClockTooltip from './ClockTooltip';
import FormattedTime from './FormattedTime';
import { 
  timeToAngle, 
  getCurrentTimeAngle, 
  getClockLabelPosition
} from '../utils/timeConversion';
import { 
  createSunArc, 
  createMoonArc, 
  createGalacticCenterArc
} from '../utils/arcCalculation';
import { processAstronomicalEvents } from '../utils/clockEventProcessor';
import { 
  type AstronomicalClockProps,
  type HourMarkerConfig
} from '../types/astronomicalClock';
import { 
  CLOCK_CONFIG, 
  ARC_CONFIG,
  EVENT_LABEL_CONFIG,
  calculateClockDimensions, 
  getHourMarkerConfig 
} from '../config/clockConfig';
import styles from './AstronomicalClock.module.css';

export default function AstronomicalClock({ 
  events, 
  currentDate,
  size = CLOCK_CONFIG.DEFAULT_SIZE 
}: AstronomicalClockProps) {
  const { location } = useLocation();
  
  const [refreshTick, setRefreshTick] = useState(0);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [hoveredArcType, setHoveredArcType] = useState<'sun' | 'moon' | 'gc' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const now = useMemo(() => currentDate || new Date(), [currentDate, refreshTick]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const currentTimeAngle = getCurrentTimeAngle(location, now);
  
  // Check if current time is within the display window (6pm to 6am)
  const currentHour = now.getHours();
  const showClockHand = currentHour >= 18 || currentHour < 6;
  
  // Detect touch device for optimized interaction
  const isTouchDevice = useMemo(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);
  
  // Choose appropriate dimensions based on device type
  const labelDimensions = isTouchDevice 
    ? EVENT_LABEL_CONFIG.TOUCH_DIMENSIONS 
    : EVENT_LABEL_CONFIG.DIMENSIONS;
  
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
  const hourMarkerConfig: HourMarkerConfig = getHourMarkerConfig(dimensions);
  
  // Process events into clock positions
  const clockEvents = useMemo(() => {
    return processAstronomicalEvents(events, location, now, labelRadius, size);
  }, [events, location, now, labelRadius, size]);
  
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

  const generateEventListDescription = () => {
    const eventSummary = clockEvents
      .sort((a, b) => a.time.getTime() - b.time.getTime())
      .map(event => `${event.title} at ${event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`)
      .join(', ');
    return `Tonight's astronomical events in chronological order: ${eventSummary}`;
  };

  function renderClockView() {
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
            setHoveredArcType('sun');
            setHoveredEventId(null); // Clear event hover when hovering arc
          }}
          onMouseLeave={() => setHoveredArcType(null)}
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
              setHoveredArcType('moon');
              setHoveredEventId(null); // Clear event hover when hovering arc
            }}
            onMouseLeave={() => setHoveredArcType(null)}
          >
            <path
              d={moonArc.path}
              stroke={moonArc.color}
              strokeWidth={highlightedArcs.moon ? ARC_CONFIG.DEFAULT_STROKE_WIDTH + 5 : ARC_CONFIG.DEFAULT_STROKE_WIDTH}
              fill="none"
              className={moonArc.className}
              opacity={highlightedArcs.moon ? Math.max(0.8, moonArc.opacity || 1) : (moonArc.opacity || 1)}
              aria-label={`Moon visible period with ${events.moonIllumination.toFixed(0)}% illumination`}
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
            setHoveredArcType('gc');
            setHoveredEventId(null); // Clear event hover when hovering arc
          }}
          onMouseLeave={() => setHoveredArcType(null)}
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
                name={getMoonPhaseIcon(events.moonPhase, location.lat)}
                className="global-icon-small"
              />
              <span className={`${styles.moonIlluminationText} data-time`}>
                {events.moonIllumination.toFixed(0)}%
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
                  <ClockTooltip content={event.tooltip}>
                    <div 
                      className={styles.eventLabelContent}
                      tabIndex={0}
                      role="button"
                      aria-label={`${event.title} at ${event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. ${event.tooltip}`}
                      onMouseEnter={() => {
                        setHoveredEventId(event.id);
                        setHoveredArcType(null); // Clear arc hover when hovering event
                      }}
                      onMouseLeave={() => setHoveredEventId(null)}
                      onFocus={() => {
                        setHoveredEventId(event.id);
                        setHoveredArcType(null); // Clear arc hover when focusing event
                      }}
                      onBlur={() => setHoveredEventId(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          // Focus will show the tooltip
                        }
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
                    </div>
                  </ClockTooltip>
                </foreignObject>
              </g>
            );
          })}
        </g>
      </svg>
    );
  }
  
  function renderListView() {
    return (
      <div className={styles.listView}>
        <h3 className={styles.panelTitle}>Tonight's Events</h3>
        <div 
          className={styles.eventList}
          role="list"
          aria-label={generateEventListDescription()}
        >
          {clockEvents
            .sort((a, b) => a.time.getTime() - b.time.getTime())
            .map((event, index) => {
              const isMoonrise = event.icon === 'moonrise';
              const isOptimalViewing = event.icon === 'telescope';
              
              return (
                <div 
                  key={index} 
                  className={`${styles.listEventItem} ${event.eventClass ? styles[event.eventClass] : ''}`}
                  role="listitem"
                  aria-label={`${event.title} at ${event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                >
                  <Icon
                    name={event.icon}
                    className="global-icon-medium"
                    aria-hidden="true"
                  />
                  <div className={styles.listEventContent}>
                    <span className={styles.listEventTitle}>{event.title}</span>
                    <div className={styles.listEventDetails}>
                      <FormattedTime 
                        date={event.time} 
                      />
                      {isMoonrise && (
                        <div className={styles.listEventExtra}>
                          <Icon
                            name={getMoonPhaseIcon(events.moonPhase, location.lat)}
                            className="global-icon-small"
                          />
                          <span className="data-time">{events.moonIllumination.toFixed(0)}% illuminated</span>
                        </div>
                      )}
                      {isOptimalViewing && events.optimalWindow.averageScore && (
                        <div className={styles.listEventExtra}>
                          <span className="small-caps">{Math.round(events.optimalWindow.averageScore * 100)}% quality</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
  
  
  const panels = [
    {
      id: 'clock',
      title: 'Clock View',
      content: renderClockView()
    },
    {
      id: 'list',
      title: 'Event List',
      content: renderListView()
    }
  ];
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = currentX - startX;
    setTranslateX(diffX);
  };
  
  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    // Adaptive threshold based on device - lower for touch devices
    const threshold = isTouchDevice ? 30 : 50;
    
    if (Math.abs(translateX) > threshold) {
      if (translateX > 0 && currentPanel > 0) {
        // Swipe right - go to previous panel
        setCurrentPanel(currentPanel - 1);
      } else if (translateX < 0 && currentPanel < panels.length - 1) {
        // Swipe left - go to next panel
        setCurrentPanel(currentPanel + 1);
      }
    }
    
    setIsDragging(false);
    setTranslateX(0);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const diffX = currentX - startX;
    setTranslateX(diffX);
  };
  
  const handleMouseUp = () => {
    if (!isDragging) return;
    
    // Use same adaptive threshold as touch for consistency
    const threshold = isTouchDevice ? 30 : 50;
    
    if (Math.abs(translateX) > threshold) {
      if (translateX > 0 && currentPanel > 0) {
        setCurrentPanel(currentPanel - 1);
      } else if (translateX < 0 && currentPanel < panels.length - 1) {
        setCurrentPanel(currentPanel + 1);
      }
    }
    
    setIsDragging(false);
    setTranslateX(0);
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
      
      {/* Panel Dots Navigation */}
      <div className={styles.panelDots} role="tablist" aria-label="Clock view panels">
        {panels.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentPanel ? styles.activeDot : ''}`}
            onClick={() => setCurrentPanel(index)}
            role="tab"
            aria-label={`Go to ${panels[index].title}`}
            aria-selected={index === currentPanel}
            aria-controls={`panel-${index}`}
          />
        ))}
      </div>
      
      {/* Swipeable Panels Container */}
      <div 
        ref={containerRef}
        className={styles.panelsContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `translateX(calc(-${currentPanel * 100}% + ${isDragging ? translateX + 'px' : '0px'}))`,
          transition: isDragging ? 'none' : 'transform 0.3s ease'
        }}
        role="tabpanel"
        aria-label="Astronomical clock views"
      >
        {panels.map((panel, index) => (
          <div 
            key={panel.id} 
            className={styles.panel}
            id={`panel-${index}`}
            role="tabpanel"
            aria-labelledby={`tab-${index}`}
            aria-hidden={index !== currentPanel}
          >
            {panel.content}
          </div>
        ))}
      </div>
    </div>
  );
}