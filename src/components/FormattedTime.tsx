import { formatTimeInLocationTimezone } from "../utils/timezoneUtils";
import { useLocation } from "../hooks/useLocation";

interface FormattedTimeProps {
  date?: Date | undefined;
  timeString?: string;
  className?: string;
}

export default function FormattedTime({
  date,
  timeString,
  className = "data-time",
}: FormattedTimeProps) {
  const { location } = useLocation();

  let finalTimeString: string;

  if (timeString !== undefined) {
    // Use provided time string directly
    finalTimeString = timeString;
  } else if (date) {
    // Format the date using the timezone utils
    finalTimeString = formatTimeInLocationTimezone(date, location);
  } else {
    // No valid time to display
    return <span className={className}>—</span>;
  }

  // If the string is empty or doesn't contain a colon, return as-is
  if (!finalTimeString || !finalTimeString.includes(":")) {
    return <span className={className}>{finalTimeString || "—"}</span>;
  }

  // Split the time string on the colon and render with raised colon
  const [hours, minutes] = finalTimeString.split(":");

  return (
    <span className={className}>
      {hours}
      <span style={{ verticalAlign: "0.11em", fontSize: "1.1em" }}>:</span>
      {minutes}
    </span>
  );
}
