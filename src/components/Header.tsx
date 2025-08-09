import { Link, useLocation } from "react-router-dom";
import { useFieldMode } from "../hooks/useFieldMode";
import { useSimpleTransitions } from "../hooks/useSimpleTransitions";
import Tooltip from "./Tooltip";
import styles from "./Header.module.css";

export default function Header() {
  const location = useLocation();
  const { isFieldMode, toggleFieldMode } = useFieldMode();
  const { handleClick } = useSimpleTransitions();

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <nav className={styles.nav}>
          <div className={styles.navLinks}>
            <Link
              to="/"
              onClick={handleClick("/")}
              className={`${styles.navLink} ${
                location.pathname === "/" ||
                location.pathname.startsWith("/location")
                  ? styles.navLinkActive
                  : styles.navLinkInactive
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              onClick={handleClick("/explore")}
              className={`${styles.navLink} ${
                location.pathname === "/explore"
                  ? styles.navLinkActive
                  : styles.navLinkInactive
              }`}
            >
              Explore
            </Link>
            <Link
              to="/faq"
              onClick={handleClick("/faq")}
              className={`${styles.navLink} ${
                location.pathname === "/faq"
                  ? styles.navLinkActive
                  : styles.navLinkInactive
              }`}
            >
              FAQ
            </Link>
          </div>
        </nav>

        <Tooltip
          content={isFieldMode ? "Switch to Dark Mode" : "Switch to Field Mode"}
          placement="bottom"
        >
          <button
            onClick={toggleFieldMode}
            className={`${styles.toggleSwitch} ${
              isFieldMode ? styles.toggleSwitchField : styles.toggleSwitchDark
            }`}
            aria-label={isFieldMode ? "Switch to Dark Mode" : "Switch to Field Mode"}
          >
            <span className={styles.toggleTrack}>
              <span className={styles.toggleIconLeft}>
                <svg
                  className={styles.toggleIcon}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {/* Moon icon */}
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              </span>
              <span className={styles.toggleIndicator} />
              <span className={styles.toggleIconRight}>
                <svg
                  className={styles.toggleIcon}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {/* Starfield icon */}
                  <g>
                    <path d="M5 3.5L5.45 4.8a.5.5 0 00.475.35h1.372c.385 0 .545.493.234.72l-1.11.807a.5.5 0 00-.181.559l.424 1.305c.12.368-.3.671-.612.444l-1.11-.807a.5.5 0 00-.588 0l-1.11.807c-.311.227-.732-.076-.612-.444l.424-1.305a.5.5 0 00-.181-.559l-1.11-.807c-.311-.227-.151-.72.234-.72h1.372a.5.5 0 00.475-.35L5 3.5z" />
                    <path d="M15 6.5l.3.9a.3.3 0 00.285.21h.947c.231 0 .327.296.14.432l-.766.557a.3.3 0 00-.109.335l.293.9c.072.221-.18.403-.367.267l-.766-.557a.3.3 0 00-.353 0l-.766.557c-.187.136-.44-.046-.367-.267l.293-.9a.3.3 0 00-.109-.335l-.766-.557c-.187-.136-.091-.432.14-.432h.947a.3.3 0 00.285-.21L15 6.5z" />
                    <path d="M11 10.5l.225.675a.225.225 0 00.214.158h.71c.174 0 .245.222.105.324l-.574.418a.225.225 0 00-.082.251l.22.675c.054.166-.135.302-.276.2l-.574-.418a.225.225 0 00-.265 0l-.574.418c-.14.102-.33-.034-.276-.2l.22-.675a.225.225 0 00-.082-.251l-.574-.418c-.14-.102-.069-.324.105-.324h.71a.225.225 0 00.214-.158L11 10.5z" />
                    <path d="M16.5 13l.15.45a.15.15 0 00.143.105h.473c.116 0 .164.148.07.216l-.383.279a.15.15 0 00-.054.167l.146.45c.036.11-.09.201-.184.133l-.383-.279a.15.15 0 00-.176 0l-.383.279c-.094.068-.22-.023-.184-.133l.146-.45a.15.15 0 00-.054-.167l-.383-.279c-.094-.068-.046-.216.07-.216h.473a.15.15 0 00.143-.105L16.5 13z" />
                    <path d="M8 14l.18.54a.18.18 0 00.171.126h.568c.139 0 .196.178.084.259l-.46.335a.18.18 0 00-.065.2l.175.54c.043.133-.108.242-.22.16l-.46-.335a.18.18 0 00-.212 0l-.46.335c-.112.082-.263-.027-.22-.16l.175-.54a.18.18 0 00-.065-.2l-.46-.335c-.112-.081-.055-.259.084-.259h.568a.18.18 0 00.171-.126L8 14z" />
                  </g>
                </svg>
              </span>
            </span>
          </button>
        </Tooltip>
      </div>
      <div className={styles.titleSection}>
        <Link to="/" className={styles.titleLink}>
          <h1 className={styles.title}>Milky Way Calendar</h1>
        </Link>
        <p className={styles.subtitle}>
          Discover the best times to observe the Milky Way throughout the year
        </p>
      </div>
    </header>
  );
}
