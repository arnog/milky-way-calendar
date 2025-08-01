import { useState, useEffect } from "react";
import { Location } from "../types/astronomy";
import StarRating from "./StarRating";
import { calculateGalacticCenterPosition } from "../utils/galacticCenter";
import { calculateMoonData } from "../utils/moonCalculations";
import { calculateTwilightTimes } from "../utils/twilightCalculations";
import { calculateVisibilityRating } from "../utils/visibilityRating";
import {
  calculateOptimalViewingWindow,
  formatOptimalViewingTime,
  formatOptimalViewingDuration,
  OptimalViewingWindow,
} from "../utils/optimalViewing";
import { formatTimeInLocationTimezone } from "../utils/timezoneUtils";
import { getMoonPhaseEmoji } from "../utils/moonCalculations";
import styles from "./DailyVisibilityTable.module.css";

interface DailyVisibilityTableProps {
  location: Location;
}

interface DayData {
  date: Date;
  visibility: number;
  optimalWindow: OptimalViewingWindow;
  // Expanded view data
  sunRise?: Date;
  sunSet?: Date;
  astronomicalTwilightEnd?: Date;
  astronomicalTwilightStart?: Date;
  moonRise?: Date;
  moonSet?: Date;
  gcRise?: Date;
  gcTransit?: Date;
  gcSet?: Date;
  maxGcAltitude: number;
  moonPhase: number;
  moonIllumination: number;
}

// SVG Icon component (reused from TonightCard)
const Icon = ({
  name,
  title,
  className = "w-6 h-6",
}: {
  name: string;
  title?: string;
  className?: string;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="global-icon-wrapper"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={() => setShowTooltip(true)}
      onTouchEnd={() => setTimeout(() => setShowTooltip(false), 2000)}
    >
      <svg className={className}>
        <use href={`/icons.svg#${name}`} />
      </svg>
      {showTooltip && title && (
        <div className="global-tooltip">
          {title}
          <div className="global-tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
};

export default function DailyVisibilityTable({ location }: DailyVisibilityTableProps) {
  const [dailyData, setDailyData] = useState<DayData[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateDailyData = async () => {
      setIsLoading(true);

      try {
        const today = new Date();
        const data: DayData[] = [];

        // Calculate data for the next 7 days
        for (let i = 0; i < 7; i++) {
          const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
          
          // Calculate astronomical data for this day
          const gcData = calculateGalacticCenterPosition(date, location);
          const moonData = calculateMoonData(date, location);
          const twilightData = calculateTwilightTimes(date, location);
          
          const optimalWindow = calculateOptimalViewingWindow(gcData, moonData, twilightData);
          const visibility = calculateVisibilityRating(gcData, moonData, twilightData, optimalWindow, location);

          data.push({
            date,
            visibility,
            optimalWindow,
            sunRise: undefined, // TwilightData doesn't have sunrise/sunset, we'll calculate them separately if needed
            sunSet: undefined,
            astronomicalTwilightEnd: twilightData.night ? new Date(twilightData.night) : undefined,
            astronomicalTwilightStart: twilightData.dayEnd ? new Date(twilightData.dayEnd) : undefined,
            moonRise: moonData.rise || undefined,
            moonSet: moonData.set || undefined,
            gcRise: gcData.riseTime || undefined,
            gcTransit: gcData.transitTime || undefined,
            gcSet: gcData.setTime || undefined,
            maxGcAltitude: gcData.altitude,
            moonPhase: moonData.phase,
            moonIllumination: moonData.illumination,
          });
        }

        setDailyData(data);
      } catch (error) {
        console.error("Error calculating daily visibility data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateDailyData();
  }, [location]);

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", { 
        weekday: "short", 
        month: "short", 
        day: "numeric" 
      });
    }
  };

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>
          Loading daily visibility data...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Next 7 Days</h2>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.tableHeader}>Date</th>
              <th className={styles.tableHeader}>Visibility</th>
              <th className={styles.tableHeader}>Optimal Time</th>
              <th className={styles.tableHeader}>Duration</th>
            </tr>
          </thead>
          <tbody>
            {dailyData.map((day, index) => (
              <tr key={index}>
                <td colSpan={4} className={styles.tableCell}>
                  <div
                    className={styles.rowClickable}
                    onClick={() => toggleRow(index)}
                  >
                    <div className={styles.rowHeader}>
                      <div className={styles.rowGrid}>
                        <div className={styles.dateText}>
                          {formatDate(day.date)}
                        </div>
                        <div>
                          <StarRating rating={day.visibility} />
                        </div>
                        <div className={`${styles.timeText} data-time`}>
                          {formatOptimalViewingTime(day.optimalWindow, location) || "Not visible"}
                        </div>
                        <div className={`${styles.timeText} data-time`}>
                          {formatOptimalViewingDuration(day.optimalWindow) || "—"}
                        </div>
                      </div>
                      <div className={styles.expandIcon}>
                        {expandedRow === index ? "▲" : "▼"}
                      </div>
                    </div>
                  </div>
                  
                  {expandedRow === index && (
                    <div className={styles.expandedContent}>
                      <div className={styles.expandedPanel}>
                        <div className={styles.expandedGrid}>
                          
                          {/* Sun Events */}
                          <div>
                            <h4 className={styles.sectionTitle}>Sun</h4>
                            <div className={styles.eventList}>
                              {day.sunRise && (
                                <div className={styles.eventRow}>
                                  <Icon name="sunrise" title="Sunrise" className={styles.icon} />
                                  <span>Rise: <span className="data-time">{formatTimeInLocationTimezone(day.sunRise, location)}</span></span>
                                </div>
                              )}
                              {day.sunSet && (
                                <div className={styles.eventRow}>
                                  <Icon name="sunset" title="Sunset" className={styles.icon} />
                                  <span>Set: <span className="data-time">{formatTimeInLocationTimezone(day.sunSet, location)}</span></span>
                                </div>
                              )}
                              {day.astronomicalTwilightEnd && (
                                <div className={styles.eventRow}>
                                  <Icon name="twilight-end" title="Astronomical Twilight End" className={styles.icon} />
                                  <span>Dark: <span className="data-time">{formatTimeInLocationTimezone(day.astronomicalTwilightEnd, location)}</span></span>
                                </div>
                              )}
                              {day.astronomicalTwilightStart && (
                                <div className={styles.eventRow}>
                                  <Icon name="twilight-start" title="Astronomical Twilight Start" className={styles.icon} />
                                  <span>Dawn: <span className="data-time">{formatTimeInLocationTimezone(day.astronomicalTwilightStart, location)}</span></span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Moon Events */}
                          <div>
                            <h4 className={styles.sectionTitle}>Moon</h4>
                            <div className={styles.eventList}>
                              <div className={styles.eventRow}>
                                <span className={styles.moonEmoji}>{getMoonPhaseEmoji(day.moonPhase)}</span>
                                <span>{Math.round(day.moonIllumination * 100)}% illuminated</span>
                              </div>
                              {day.moonRise && (
                                <div className={styles.eventRow}>
                                  <Icon name="moonrise" title="Moonrise" className={styles.icon} />
                                  <span>Rise: <span className="data-time">{formatTimeInLocationTimezone(day.moonRise, location)}</span></span>
                                </div>
                              )}
                              {day.moonSet && (
                                <div className={styles.eventRow}>
                                  <Icon name="moonset" title="Moonset" className={styles.icon} />
                                  <span>Set: <span className="data-time">{formatTimeInLocationTimezone(day.moonSet, location)}</span></span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Galactic Core Events */}
                          <div>
                            <h4 className={styles.sectionTitle}>Galactic Core</h4>
                            <div className={styles.eventList}>
                              <div className={styles.eventRow}>
                                <Icon name="altitude" title="Maximum Altitude" className={styles.icon} />
                                <span>Max: {day.maxGcAltitude.toFixed(1)}°</span>
                              </div>
                              {day.gcRise && (
                                <div className={styles.eventRow}>
                                  <Icon name="gc-rise" title="Galactic Core Rise (≥10°)" className={styles.icon} />
                                  <span>Rise: <span className="data-time">{formatTimeInLocationTimezone(day.gcRise, location)}</span></span>
                                </div>
                              )}
                              {day.gcTransit && (
                                <div className={styles.eventRow}>
                                  <Icon name="gc-transit" title="Galactic Core Transit" className={styles.icon} />
                                  <span>Transit: <span className="data-time">{formatTimeInLocationTimezone(day.gcTransit, location)}</span></span>
                                </div>
                              )}
                              {day.gcSet && (
                                <div className={styles.eventRow}>
                                  <Icon name="gc-set" title="Galactic Core Set (≤10°)" className={styles.icon} />
                                  <span>Set: <span className="data-time">{formatTimeInLocationTimezone(day.gcSet, location)}</span></span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}