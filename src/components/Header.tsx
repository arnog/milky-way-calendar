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
          content={
            isFieldMode ? "Switch to Dark Mode" : "Switch to Field Mode"
          }
          placement="bottom"
        >
          <button
            onClick={toggleFieldMode}
            className={`${styles.darkModeButton} ${
              isFieldMode
                ? styles.darkModeButtonActive
                : styles.darkModeButtonNormal
            }`}
          >
            <svg
              className={styles.darkModeIcon}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
            {isFieldMode ? "Field" : "Dark"}
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
