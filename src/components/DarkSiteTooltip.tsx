import styles from "./DarkSiteTooltip.module.css";

interface DarkSiteTooltipProps {
  siteName: string;
  bortleRating: number;
  className?: string;
}

export default function DarkSiteTooltip({ 
  siteName, 
  bortleRating, 
  className = "" 
}: DarkSiteTooltipProps) {
  return (
    <div className={`${styles.tooltip} ${className}`}>
      <div className={styles.tooltipContent}>
        <div className={styles.tooltipHeader}>
          {siteName}
        </div>
        <div className={styles.tooltipBortle}>
          Bortle Scale: {bortleRating.toFixed(1)}
        </div>
      </div>
    </div>
  );
}