import { useState, useRef, useEffect } from "react";
import { useLocation } from "../hooks/useLocation";
import { useAstronomicalData } from "../hooks/useAstronomicalData";
import {
  AstronomicalDataTableProps,
  AstronomicalDataItem,
} from "../types/astronomicalDataTable";
import StarRating from "./StarRating";
import { Icon } from "./Icon";
import Tooltip from "./Tooltip";
import FormattedTime from "./FormattedTime";
import Spinner from "./Spinner";
import { APP_CONFIG } from "../config/appConfig";
import {
  formatOptimalViewingTime,
  formatOptimalViewingDuration,
} from "../utils/integratedOptimalViewing";
import { getMoonPhaseIcon, getMoonPhaseName } from "../utils/moonPhase";
import { generateEventStructuredData } from "../utils/structuredData";
import styles from "./AstronomicalDataTable.module.css";

export default function AstronomicalDataTable({
  currentDate,
  config,
  className,
}: AstronomicalDataTableProps) {
  const { location, isLoading: locationLoading } = useLocation();
  const { items, isLoadingMore, canLoadMore, loadMore } = useAstronomicalData(
    currentDate,
    config,
  );
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Refs for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();

  // Default date formatter
  const defaultFormatDate =
    config.mode === "daily"
      ? (date: Date, currentDate?: Date) => {
          const today = currentDate || new Date();
          const tomorrow = new Date(
            today.getTime() + APP_CONFIG.ASTRONOMY.MS_PER_DAY,
          );

          if (date.toDateString() === today.toDateString()) return "Today";
          if (date.toDateString() === tomorrow.toDateString())
            return "Tomorrow";
          return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
        }
      : (date: Date) =>
          date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: date.getFullYear() !== currentYear ? "numeric" : undefined,
          });
  const formatDate = config.formatDate || defaultFormatDate;

  // Toggle expanded row (daily mode only)
  const toggleRow = (index: number) => {
    if (!config.showExpandableDetails) return;

    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  // Handle row click
  const handleRowClick = (item: AstronomicalDataItem, index: number) => {
    if (config.showExpandableDetails) {
      toggleRow(index);
    }

    if (config.onRowClick) {
      config.onRowClick(item);
    }
  };

  // Dynamic background for weekly mode
  const getRowBackground = (visibility: number) => {
    if (config.mode !== "weekly") return {};

    const opacity = visibility * 0.15;
    // Using CSS variables from global.css - gradient-primary (blue-800) and gradient-secondary (blue-600)
    // Since these map to hex values, we'll use the actual color values for now
    // TODO: Once we have CSS color-mix support, we can use: color-mix(in srgb, var(--gradient-primary) ${opacity * 100}%, transparent)
    return {
      background: `linear-gradient(to right, 
        rgba(0, 96, 167, ${opacity}), 
        rgba(0, 119, 219, ${opacity * 0.4}), 
        rgba(0, 96, 167, ${opacity * 0.3}))`,
      backgroundSize: "200% 100%",
      animation: visibility >= 3 ? "shimmer 6s ease-in-out infinite" : "none",
    };
  };

  // Setup infinite scroll (weekly mode only)
  useEffect(() => {
    if (!config.enableInfiniteScroll) return;

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && canLoadMore) {
        loadMore();
      }
    };

    observerRef.current = new IntersectionObserver(handleObserver);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [config.enableInfiniteScroll, canLoadMore, loadMore]);

  // Don't render if location is not available
  if (locationLoading || !location) {
    return null;
  }

  // Don't render if no items
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.container} ${className || ""}`}>
      {config.title && <h2 className={styles.title}>{config.title}</h2>}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <tbody>
            {items.map((item, index) => {
              if (config.mode === "daily") {
                const isExpanded = expandedRows.has(index);
                // Daily mode rendering
                return (
                  <tr key={index}>
                    <td colSpan={4} className={styles.dailyTableCell}>
                      <div
                        className={styles.dailyRowClickable}
                        onClick={() => handleRowClick(item, index)}
                      >
                        <div className={styles.dailyRowHeader}>
                          <div className={styles.dailyRowGrid}>
                            <div className={styles.dailyDateText}>
                              {formatDate(item.date, currentDate)}
                            </div>
                            <div>
                              <StarRating
                                rating={item.visibility}
                                reason={item.visibilityReason}
                              />
                            </div>
                            <div
                              className={`${styles.dailyTimeText} data-time`}
                            >
                              <FormattedTime
                                timeString={formatOptimalViewingTime(
                                  item.optimalWindow,
                                  location,
                                )}
                                className=""
                              />
                              {formatOptimalViewingTime(
                                item.optimalWindow,
                                location,
                              ) ? (
                                <>
                                  <span className="small-caps"> for </span>
                                  {formatOptimalViewingDuration(
                                    item.optimalWindow,
                                  )}
                                </>
                              ) : (
                                "Not visible"
                              )}
                            </div>
                          </div>
                          {config.showExpandableDetails && (
                            <div className={styles.expandIcon}>
                              {isExpanded ? "▲" : "▼"}
                            </div>
                          )}
                        </div>
                      </div>

                      {config.showExpandableDetails && isExpanded && (
                        <div className={styles.expandedContent}>
                          <div className={styles.expandedPanel}>
                            <div className={styles.expandedGrid}>
                              {/* Sun Events */}
                              <div>
                                <h4 className={styles.sectionTitle}>Sun</h4>
                                <div className={styles.eventList}>
                                  {item.sunSet && (
                                    <div className={styles.eventRow}>
                                      <Tooltip content="Sunset">
                                        <Icon name="sunset" size="sm" />
                                      </Tooltip>
                                      <span>
                                        <FormattedTime date={item.sunSet} />
                                      </span>
                                    </div>
                                  )}
                                  {item.nightStart && (
                                    <div className={styles.eventRow}>
                                      <Tooltip content="Astronomical Night Start">
                                        <Icon name="night-rise" size="sm" />
                                      </Tooltip>
                                      <span>
                                        <FormattedTime date={item.nightStart} />
                                      </span>
                                    </div>
                                  )}
                                  {item.nightEnd && (
                                    <div className={styles.eventRow}>
                                      <Tooltip content="Astronomical Night End">
                                        <Icon name="night-set" size="sm" />
                                      </Tooltip>
                                      <span>
                                        <FormattedTime date={item.nightEnd} />
                                      </span>
                                    </div>
                                  )}
                                  {item.sunRise && (
                                    <div className={styles.eventRow}>
                                      <Tooltip content="Sunrise">
                                        <Icon name="sunrise" size="sm" />
                                      </Tooltip>
                                      <span>
                                        <FormattedTime date={item.sunRise} />
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
                                    <Tooltip
                                      content={getMoonPhaseName(
                                        item.moonPhase!,
                                      )}
                                    >
                                      <Icon
                                        name={getMoonPhaseIcon(
                                          item.moonPhase!,
                                          location.lat,
                                        )}
                                        size="sm"
                                        baselineOffset={2}
                                      />
                                    </Tooltip>
                                    <span className="small-caps">
                                      {Math.round(item.moonIllumination! * 100)}
                                      % illuminated
                                    </span>
                                  </div>
                                  {item.moonRise && (
                                    <div className={styles.eventRow}>
                                      <Tooltip content="Moonrise">
                                        <Icon name="moonrise" size="sm" />
                                      </Tooltip>
                                      <span>
                                        <FormattedTime date={item.moonRise} />
                                      </span>
                                    </div>
                                  )}
                                  {item.moonSet && (
                                    <div className={styles.eventRow}>
                                      <Tooltip content="Moonset">
                                        <Icon name="moonset" size="sm" />
                                      </Tooltip>
                                      <span>
                                        <FormattedTime date={item.moonSet} />
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
                                  {item.gcRise && (
                                    <div className={styles.eventRow}>
                                      <Tooltip content="Galactic Core Rise (≥10°)">
                                        <Icon name="galaxy-rise" size="sm" />
                                      </Tooltip>
                                      <span>
                                        <FormattedTime date={item.gcRise} />
                                      </span>
                                    </div>
                                  )}
                                  {item.optimalWindow.startTime &&
                                    item.optimalWindow.endTime && (
                                      <div className={styles.eventRow}>
                                        <Tooltip content="Optimal Observation Time">
                                          <Icon name="telescope" size="sm" />
                                        </Tooltip>
                                        <span>
                                          <FormattedTime
                                            timeString={formatOptimalViewingTime(
                                              item.optimalWindow,
                                              location,
                                            )}
                                          />
                                          <span className="small-caps">
                                            {" for "}
                                            {formatOptimalViewingDuration(
                                              item.optimalWindow,
                                            )}
                                          </span>
                                        </span>
                                      </div>
                                    )}
                                  {item.gcTransit && (
                                    <div className={styles.eventRow}>
                                      <Tooltip content="Galactic Core Transit">
                                        <Icon name="apex" size="sm" />
                                      </Tooltip>
                                      <span>
                                        <FormattedTime date={item.gcTransit} />
                                        <span className="small-caps">
                                          {" at "}
                                          {item.maxGcAltitude!.toFixed(1)}°
                                        </span>
                                      </span>
                                    </div>
                                  )}
                                  {item.gcSet && (
                                    <div className={styles.eventRow}>
                                      <Tooltip content="Galactic Core Set (≤10°)">
                                        <Icon name="galaxy-set" size="sm" />
                                      </Tooltip>
                                      <span>
                                        <FormattedTime date={item.gcSet} />
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
                );
              } else {
                // Generate structured data for weekly mode
                const structuredData = generateEventStructuredData(
                  {
                    weekNumber: item.weekNumber!,
                    startDate: item.startDate!,
                    visibility: item.visibility,
                    gcDuration: item.gcDuration!,
                    moonIllumination: item.moonIllumination!,
                    optimalWindow: item.optimalWindow,
                    visibilityReason: item.visibilityReason,
                  },
                  location,
                );
                // Weekly mode rendering
                return (
                  <tr
                    key={`${item.startDate?.getFullYear()}-${item.weekNumber}`}
                    className={styles.tableRow}
                    style={getRowBackground(item.visibility)}
                    onClick={() => handleRowClick(item, index)}
                  >
                    <script
                      type="application/ld+json"
                      dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData, null, 2),
                      }}
                    />
                    <td className={styles.weeklyDateCell}>
                      {formatDate(item.startDate!, currentDate)}
                    </td>
                    <td className={styles.weeklyVisibilityCell}>
                      <StarRating
                        rating={item.visibility}
                        size="md"
                        reason={item.visibilityReason}
                      />
                    </td>
                    <td className={styles.weeklyTimeCell}>
                      <FormattedTime
                        timeString={formatOptimalViewingTime(
                          item.optimalWindow,
                          location,
                        )}
                        className=""
                      />
                      <span className="small-caps"> for </span>
                      {item.gcDuration}
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>

      {/* Infinite scroll loading indicator */}
      {config.enableInfiniteScroll && items.length > 0 && (
        <div ref={loadMoreRef} className={styles.loadMoreSection}>
          {isLoadingMore && (
            <div className={styles.loadingMoreContainer}>
              <Spinner size="sm" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
