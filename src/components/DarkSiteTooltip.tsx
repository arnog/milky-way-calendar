import styles from "./DarkSiteTooltip.module.css";

interface DarkSiteTooltipProps {
  siteName: string;
  bortleRating: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function DarkSiteTooltip({
  siteName,
  bortleRating,
  className = "",
  style,
}: DarkSiteTooltipProps) {
  return (
    <div className={`${styles.tooltip} ${className}`} style={style}>
      <div className={styles.tooltipContent}>
        <div className={styles.tooltipHeader}>{siteName}</div>
        <div className={styles.tooltipBortle}>
          Bortle Scale: {bortleRating.toFixed(1)}
        </div>
      </div>
    </div>
  );
}
