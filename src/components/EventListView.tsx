import { Icon } from "./Icon";
import { getMoonPhaseIcon } from "../utils/moonPhase";
import FormattedTime from "./FormattedTime";
import { useGuaranteedLocation } from "../hooks/useLocation";
import { type ClockEvent } from "../types/astronomicalClock";
import styles from "./EventListView.module.css";

interface EventListViewProps {
  clockEvents: ClockEvent[];
  moonPhase: number;
  moonIllumination: number;
  optimalWindow: {
    averageScore?: number;
  };
  className?: string;
}

export default function EventListView({
  clockEvents,
  moonPhase,
  moonIllumination,
  optimalWindow,
  className = "",
}: EventListViewProps) {
  const { location } = useGuaranteedLocation();

  // Generate accessibility description
  const generateEventListDescription = () => {
    const eventSummary = clockEvents
      .sort((a, b) => a.time.getTime() - b.time.getTime())
      .map(
        (event) =>
          `${event.title} at ${event.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      )
      .join(", ");
    return `Tonight's astronomical events in chronological order: ${eventSummary}`;
  };

  return (
    <div className={`${styles.listView} ${className}`}>
      <div
        className={styles.eventList}
        role="list"
        aria-label={generateEventListDescription()}
      >
        {clockEvents
          .sort((a, b) => a.time.getTime() - b.time.getTime())
          .map((event, index) => {
            const isMoonrise = event.icon === "moonrise";
            const isOptimalViewing = event.icon === "telescope";

            return (
              <div
                key={index}
                className={`${styles.listEventItem} ${event.eventClass ? styles[event.eventClass] : ""}`}
                role="listitem"
                aria-label={`${event.title} at ${event.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
              >
                <Icon name={event.icon} size="xl" aria-hidden="true" />
                <div className={styles.listEventContent}>
                  <span className={styles.listEventTitle}>{event.title}</span>
                  <div className={styles.listEventDetails}>
                    {isMoonrise && (
                      <div className={styles.listEventExtra}>
                        <Icon
                          name={getMoonPhaseIcon(moonPhase, location.lat)}
                          size="sm"
                          baselineOffset={-1}
                        />
                        <span className="data-time ">
                          {moonIllumination.toFixed(0)}%
                        </span>
                        <span className="small-caps">illuminated</span>
                      </div>
                    )}
                    {isOptimalViewing && optimalWindow.averageScore && (
                      <div className={styles.listEventExtra}>
                        <span className="data-time">
                          {Math.round(optimalWindow.averageScore * 100)}%
                        </span>
                        <span className="small-caps">quality</span>
                      </div>
                    )}
                    <FormattedTime date={event.time} />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
