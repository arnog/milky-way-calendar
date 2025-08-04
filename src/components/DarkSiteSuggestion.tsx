import { Link } from "react-router-dom";
import { DarkSiteResult } from "../utils/lightPollutionMap";
import styles from "./DarkSiteSuggestion.module.css";

interface DarkSiteSuggestionProps {
  nearestDarkSite: DarkSiteResult;
  className?: string;
}

export default function DarkSiteSuggestion({ 
  nearestDarkSite, 
  className = "" 
}: DarkSiteSuggestionProps) {
  return (
    <div className={`${styles.darkSiteSuggestion} ${className}`}>
      <p className={styles.suggestionText}>
        Consider visiting a darker location for better Milky Way
        visibility:
      </p>
      <div className={styles.suggestionSite}>
        <strong>
          {nearestDarkSite.nearestKnownSite?.name ??
            `Dark site ${nearestDarkSite.distance.toFixed(0)}km away`}
        </strong>
        {nearestDarkSite.nearestKnownSite && (
          <span className={styles.siteDistance}>
            {nearestDarkSite.distance.toFixed(0)}km away
          </span>
        )}
        <span className={styles.siteBortle}>
          Bortle {nearestDarkSite.bortleScale.toFixed(1)}
        </span>
      </div>
      <Link to="/explore" className={styles.exploreLink}>
        Explore more dark sites →
      </Link>
    </div>
  );
}