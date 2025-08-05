import { useMemo, useEffect, useState, useRef } from 'react';
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
import { useSwipe } from '../hooks/useSwipe';
import SegmentedControl, { SegmentedControlOption } from './SegmentedControl';
import { Icon } from './Icon';
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
  
  // Panel state for segmented control
  type PanelMode = "clock" | "list";
  const [currentPanel, setCurrentPanel] = useState<PanelMode>("clock");
  const containerRef = useRef<HTMLDivElement>(null);
  const now = useMemo(() => currentDate || new Date(), [currentDate, refreshTick]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Handle panel changes
  const handlePanelChange = (newPanel: PanelMode) => {
    setCurrentPanel(newPanel);
  };

  // Setup swipe gestures
  const panelOrder: PanelMode[] = ["clock", "list"];
  const currentPanelIndex = panelOrder.indexOf(currentPanel);
  
  const { handlers, state } = useSwipe({
    currentIndex: currentPanelIndex,
    totalItems: panelOrder.length,
    onSwipe: (_direction, newIndex) => {
      handlePanelChange(panelOrder[newIndex]);
    }
  });
  
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
    // Need at least one of moonrise or moonset to show an arc
    if (!events.moonRise && !events.moonSet) {
      return null;
    }
    
    // Handle different scenarios:
    // 1. Both moonrise and moonset: normal arc
    // 2. Only moonset: arc from viewing window start (6pm/270°) to moonset
    // 3. Only moonrise: arc from moonrise to viewing window end (6am/270°)
    
    let startAngle: number;
    let endAngle: number;
    
    if (events.moonRise && events.moonSet) {
      // Normal case: both rise and set
      startAngle = timeToAngle(events.moonRise, location);
      endAngle = timeToAngle(events.moonSet, location);
    } else if (events.moonSet && !events.moonRise) {
      // Moon is up at start of viewing window, sets during night
      startAngle = 270; // 6pm (start of viewing window)
      endAngle = timeToAngle(events.moonSet, location);
    } else if (events.moonRise && !events.moonSet) {
      // Moon rises during night, still up at end of viewing window
      startAngle = timeToAngle(events.moonRise, location);
      endAngle = 270; // 6am next day (end of viewing window)
    } else {
      return null; // This shouldn't happen given our check above
    }
    
    return createMoonArc(
      startAngle,
      endAngle,
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

  // Create segmented control options
  const panelOptions: SegmentedControlOption<PanelMode>[] = [
    {
      value: "clock",
      label: "",
      icon: <Icon name="clock-view" size="md" />,
    },
    {
      value: "list",
      label: "",
      icon: <Icon name="list-view" size="md" />,
    },
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
      
      {/* Segmented Control for panel switching */}
      <div className={styles.controlSection}>
        <SegmentedControl
          options={panelOptions}
          value={currentPanel}
          onChange={handlePanelChange}
          size="sm"
          showCounts={false}
        />
      </div>
      
      {/* Viewport wrapper to constrain visible area */}
      <div className={styles.panelsViewport}>
        {/* Swipeable Panels Container */}
        <div 
          ref={containerRef}
          className={styles.panelsContainer}
          {...handlers}
          style={{
            transform: `translateX(calc(-${currentPanelIndex * 50}% + ${state.isDragging ? state.translateX + 'px' : '0px'}))`,
            transition: state.isDragging ? 'none' : 'transform 0.3s ease'
          }}
          role="tabpanel"
          aria-label="Swipeable astronomical clock panels"
        >
        {/* Clock Face Panel */}
        <div 
          className={styles.panel}
          role="tabpanel"
          aria-labelledby="clock-tab"
          aria-hidden={currentPanel !== "clock"}
        >
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
        </div>
        
        {/* Event List Panel */}
        <div 
          className={styles.panel}
          role="tabpanel"
          aria-labelledby="list-tab"
          aria-hidden={currentPanel !== "list"}
        >
          <EventListView
            clockEvents={clockEvents}
            moonPhase={events.moonPhase}
            moonIllumination={events.moonIllumination}
            optimalWindow={events.optimalWindow}
          />
        </div>
      </div>
      </div>
    </div>
  );
}