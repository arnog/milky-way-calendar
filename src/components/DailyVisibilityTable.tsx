import { useState, useEffect } from "react";
import { Location } from "../types/astronomy";
import StarRating from "./StarRating";
import { Icon } from "./Icon";
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
import * as Astronomy from "astronomy-engine";
import FormattedTime from "./FormattedTime";
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

// Helper function to get moon phase icon name
const getMoonPhaseIcon = (phase: number, latitude: number): string => {
  // Phase is 0-1, where 0.5 is full moon
  // In southern hemisphere, phases appear flipped horizontally
  const isNorthernHemisphere = latitude >= 0;

  // New Moon and Full Moon appear the same in both hemispheres
  if (phase < 0.0625 || phase >= 0.9375) return "moon-new"; // New Moon
  if (phase >= 0.4375 && phase < 0.5625) return "moon-full"; // Full Moon

  // For crescent and quarter phases, flip the icons in southern hemisphere
  if (isNorthernHemisphere) {
    // Northern hemisphere - standard orientation
    if (phase < 0.1875) return "moon-waxing-crescent"; // Waxing Crescent
    if (phase < 0.3125) return "moon-first-quarter"; // First Quarter
    if (phase < 0.4375) return "moon-waxing-gibbous"; // Waxing Gibbous
    if (phase < 0.6875) return "moon-waning-gibbous"; // Waning Gibbous
    if (phase < 0.8125) return "moon-third-quarter"; // Third Quarter
    return "moon-waning-crescent"; // Waning Crescent
  } else {
    // Southern hemisphere - flip waxing/waning phases
    if (phase < 0.1875) return "moon-waning-crescent"; // Waxing Crescent (appears as waning crescent)
    if (phase < 0.3125) return "moon-third-quarter"; // First Quarter (appears as third quarter)
    if (phase < 0.4375) return "moon-waning-gibbous"; // Waxing Gibbous (appears as waning gibbous)
    if (phase < 0.6875) return "moon-waxing-gibbous"; // Waning Gibbous (appears as waxing gibbous)
    if (phase < 0.8125) return "moon-first-quarter"; // Third Quarter (appears as first quarter)
    return "moon-waxing-crescent"; // Waning Crescent (appears as waxing crescent)
  }
};

// Helper function to get moon phase name
const getMoonPhaseName = (phase: number): string => {
  // Phase is 0-1, where 0.5 is full moon
  if (phase < 0.0625 || phase >= 0.9375) return "New Moon";
  if (phase < 0.1875) return "Waxing Crescent";
  if (phase < 0.3125) return "First Quarter";
  if (phase < 0.4375) return "Waxing Gibbous";
  if (phase < 0.5625) return "Full Moon";
  if (phase < 0.6875) return "Waning Gibbous";
  if (phase < 0.8125) return "Third Quarter";
  return "Waning Crescent";
};

export default function DailyVisibilityTable({
  location,
}: DailyVisibilityTableProps) {
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

          const optimalWindow = calculateOptimalViewingWindow(
            gcData,
            moonData,
            twilightData
          );
          const visibility = calculateVisibilityRating(
            gcData,
            moonData,
            twilightData,
            optimalWindow,
            location
          );

          // Calculate sunrise and sunset
          const observer = new Astronomy.Observer(location.lat, location.lng, 0);
          const sunrise = Astronomy.SearchRiseSet(
            Astronomy.Body.Sun,
            observer,
            +1, // Direction: +1 = Rise
            date,
            1
          );
          const sunset = Astronomy.SearchRiseSet(
            Astronomy.Body.Sun,
            observer,
            -1, // Direction: -1 = Set
            date,
            1
          );

          data.push({
            date,
            visibility,
            optimalWindow,
            sunRise: sunrise ? sunrise.date : undefined,
            sunSet: sunset ? sunset.date : undefined,
            astronomicalTwilightEnd: twilightData.night
              ? new Date(twilightData.night)
              : undefined,
            astronomicalTwilightStart: twilightData.dayEnd
              ? new Date(twilightData.dayEnd)
              : undefined,
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
        day: "numeric",
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
                          <FormattedTime 
                            timeString={formatOptimalViewingTime(
                              day.optimalWindow,
                              location
                            )}
                            className=""
                          /> {formatOptimalViewingTime(day.optimalWindow, location) ? (
                            <>
                              <span className="small-caps"> for </span>
                              {formatOptimalViewingDuration(day.optimalWindow)}
                            </>
                          ) : (
                            "Not visible"
                          )}
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
                              {day.sunSet && (
                                <div className={styles.eventRow}>
                                  <Icon
                                    name="sunset"
                                    title="Sunset"
                                    className={styles.icon}
                                  />
                                  <span>
                                    <FormattedTime 
                                      date={day.sunSet}
                                      location={location}
                                      className="data-time"
                                    />
                                  </span>
                                </div>
                              )}
                              {day.astronomicalTwilightEnd && (
                                <div className={styles.eventRow}>
                                  <Icon
                                    name="night-rise"
                                    title="Astronomical Night Start"
                                    className={styles.icon}
                                  />
                                  <span>
                                    <FormattedTime 
                                      date={day.astronomicalTwilightEnd}
                                      location={location}
                                      className="data-time"
                                    />
                                  </span>
                                </div>
                              )}
                              {day.astronomicalTwilightStart && (
                                <div className={styles.eventRow}>
                                  <Icon
                                    name="night-set"
                                    title="Astronomical Night End"
                                    className={styles.icon}
                                  />
                                  <span>
                                    <FormattedTime 
                                      date={day.astronomicalTwilightStart}
                                      location={location}
                                      className="data-time"
                                    />
                                  </span>
                                </div>
                              )}
                              {day.sunRise && (
                                <div className={styles.eventRow}>
                                  <Icon
                                    name="sunrise"
                                    title="Sunrise"
                                    className={styles.icon}
                                  />
                                  <span>
                                    <FormattedTime 
                                      date={day.sunRise}
                                      location={location}
                                      className="data-time"
                                    />
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Moon Events */}
                          <div>
                            <h4 className={styles.sectionTitle}>Moon</h4>
                            <div className={styles.eventList}>
                              <div className={styles.eventRow}>
                                <Icon
                                  name={getMoonPhaseIcon(
                                    day.moonPhase,
                                    location.lat
                                  )}
                                  title={getMoonPhaseName(day.moonPhase)}
                                  className={styles.icon}
                                  baselineOffset={2}
                                />
                                <span className="small-caps">
                                  {Math.round(day.moonIllumination * 100)}%
                                  illuminated
                                </span>
                              </div>
                              {day.moonRise && (
                                <div className={styles.eventRow}>
                                  <Icon
                                    name="moonrise"
                                    title="Moonrise"
                                    className={styles.icon}
                                  />
                                  <span>
                                    <FormattedTime 
                                      date={day.moonRise}
                                      location={location}
                                      className="data-time"
                                    />
                                  </span>
                                </div>
                              )}
                              {day.moonSet && (
                                <div className={styles.eventRow}>
                                  <Icon
                                    name="moonset"
                                    title="Moonset"
                                    className={styles.icon}
                                  />
                                  <span>
                                    <FormattedTime 
                                      date={day.moonSet}
                                      location={location}
                                      className="data-time"
                                    />
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Galactic Core Events */}
                          <div>
                            <h4 className={styles.sectionTitle}>
                              Galactic Core
                            </h4>
                            <div className={styles.eventList}>
                              {day.gcRise && (
                                <div className={styles.eventRow}>
                                  <Icon
                                    name="galaxy-rise"
                                    title="Galactic Core Rise (≥10°)"
                                    className={styles.icon}
                                  />
                                  <span>
                                    <FormattedTime 
                                      date={day.gcRise}
                                      location={location}
                                      className="data-time"
                                    />
                                  </span>
                                </div>
                              )}
                              {day.optimalWindow.startTime && day.optimalWindow.endTime && (
                                <div className={styles.eventRow}>
                                  <Icon
                                    name="telescope"
                                    title="Optimal Observation Time"
                                    className={styles.icon}
                                  />
                                  <span>
                                    <FormattedTime 
                                      timeString={formatOptimalViewingTime(
                                        day.optimalWindow,
                                        location
                                      )}
                                      className="data-time"
                                    />
                                    <span className="small-caps">
                                      {" for "}
                                      {formatOptimalViewingDuration(day.optimalWindow)}
                                    </span>
                                  </span>
                                </div>
                              )}
                              {day.gcTransit && (
                                <div className={styles.eventRow}>
                                  <Icon
                                    name="apex"
                                    title="Galactic Core Transit"
                                    className={styles.icon}
                                  />
                                  <span>
                                    <FormattedTime 
                                      date={day.gcTransit}
                                      location={location}
                                      className="data-time"
                                    />
                                    <span className="small-caps">
                                      {" at "}
                                      {day.maxGcAltitude.toFixed(1)}°
                                    </span>
                                  </span>
                                </div>
                              )}
                              {day.gcSet && (
                                <div className={styles.eventRow}>
                                  <Icon
                                    name="galaxy-set"
                                    title="Galactic Core Set (≤10°)"
                                    className={styles.icon}
                                  />
                                  <span>
                                    <FormattedTime 
                                      date={day.gcSet}
                                      location={location}
                                      className="data-time"
                                    />
                                  </span>
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
