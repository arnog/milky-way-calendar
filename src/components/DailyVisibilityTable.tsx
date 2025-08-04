import { useState } from "react";
import { useLocation } from "../hooks/useLocation";
import { useWeeklyVisibility } from "../hooks/useWeeklyVisibility";
import StarRating from "./StarRating";
import { Icon } from "./Icon";
import {
  formatOptimalViewingTime,
  formatOptimalViewingDuration,
} from "../utils/integratedOptimalViewing";
import FormattedTime from "./FormattedTime";
import { getMoonPhaseIcon, getMoonPhaseName } from "../utils/moonPhase";
import styles from "./DailyVisibilityTable.module.css";

interface DailyVisibilityTableProps {
  currentDate?: Date;
}

export default function DailyVisibilityTable({
  currentDate,
}: DailyVisibilityTableProps) {
  const { location } = useLocation();
  const { dailyData, isLoading, error } = useWeeklyVisibility(currentDate);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);


  const formatDate = (date: Date) => {
    const today = currentDate || new Date();
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

  // Show loading if loading data
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>
          Loading daily visibility data...
        </div>
      </div>
    );
  }

  // Show error if something went wrong
  if (error) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>
          {error}
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
                          <StarRating rating={day.visibility} reason={day.visibilityReason} />
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
                                    />
                                  </span>
                                </div>
                              )}
                              {day.nightStart && (
                                <div className={styles.eventRow}>
                                  <Icon
                                    name="night-rise"
                                    title="Astronomical Night Start"
                                    className={styles.icon}
                                  />
                                  <span>
                                    <FormattedTime 
                                      date={day.nightStart}
                                    />
                                  </span>
                                </div>
                              )}
                              {day.nightEnd && (
                                <div className={styles.eventRow}>
                                  <Icon
                                    name="night-set"
                                    title="Astronomical Night End"
                                    className={styles.icon}
                                  />
                                  <span>
                                    <FormattedTime 
                                      date={day.nightEnd}
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
