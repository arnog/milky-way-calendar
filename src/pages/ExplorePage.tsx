import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import WorldMap, { WorldMapRef } from "../components/WorldMap";
import LocationPopover from "../components/LocationPopover";
import Tooltip from "../components/Tooltip";
import ResultsMap from "../components/ResultsMap";
import DarkSiteTooltip from "../components/DarkSiteTooltip";
import SegmentedControl, {
  SegmentedControlOption,
} from "../components/SegmentedControl";
import { Icon } from "../components/Icon";
import { Location } from "../types/astronomy";
import { DARK_SITES, SpecialLocation } from "../utils/locations";
import { locationNameToSlug } from "../utils/urlHelpers";
import { coordToNormalized } from "../utils/lightPollutionMap";
import { MultipleDarkSitesResult } from "../utils/lightPollutionMap";
import { useDarkSiteWorker } from "../hooks/useDarkSiteWorker";
import { useExploreLocation } from "../hooks/useExploreLocation";
import { APP_CONFIG, formatMessage } from "../config/appConfig";
import { getDarkSiteBortleWithFallback } from "../data/darkSiteBortle";
import styles from "../App.module.css";
import exploreStyles from "./ExplorePage.module.css";

interface ExplorePageProps {
  isDarkroomMode: boolean;
}

// Session storage keys for ExplorePage state persistence
const EXPLORE_SESSION_KEYS = {
  DARK_SITES_RESULT: "explore_dark_sites_result",
  HAS_AUTO_SEARCHED: "explore_has_auto_searched",
} as const;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ExplorePage({ isDarkroomMode: _isDarkroomMode }: ExplorePageProps) {
  const navigate = useNavigate();
  const { findMultipleDarkSites } = useDarkSiteWorker();
  const {
    location: userLocation,
    updateLocation: updateUserLocation,
    initializeFromHomeLocation,
  } = useExploreLocation();
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [hoveredCatalogLocation, setHoveredCatalogLocation] = useState<
    string | null
  >(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );

  // Bortle filter state
  type BortleFilter = "all" | "pristine" | "excellent" | "good";
  const [bortleFilter, setBortleFilter] = useState<BortleFilter>("all");

  // Nearest dark site finder state (userLocation now comes from useExploreLocation)
  const [darkSitesResult, setDarkSitesResult] =
    useState<MultipleDarkSitesResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const locationButtonRef = useRef<HTMLButtonElement>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasAutoSearched, setHasAutoSearched] = useState(false);
  const worldMapRef = useRef<WorldMapRef>(null);

  // Initialize location from home location if explore location doesn't exist
  useEffect(() => {
    initializeFromHomeLocation();
  }, [initializeFromHomeLocation]);

  // Load persisted dark sites results from sessionStorage on page load
  useEffect(() => {
    try {
      // Load dark sites search results
      const sessionDarkSitesResult = sessionStorage.getItem(
        EXPLORE_SESSION_KEYS.DARK_SITES_RESULT,
      );
      if (sessionDarkSitesResult) {
        setDarkSitesResult(JSON.parse(sessionDarkSitesResult));
      }

      // Load auto-search flag
      const sessionHasAutoSearched = sessionStorage.getItem(
        EXPLORE_SESSION_KEYS.HAS_AUTO_SEARCHED,
      );
      if (sessionHasAutoSearched) {
        setHasAutoSearched(JSON.parse(sessionHasAutoSearched));
      }
    } catch (error) {
      console.warn(
        "Failed to load ExplorePage state from sessionStorage:",
        error,
      );
    }
  }, []);

  // Location is now persisted automatically by useExploreLocation hook

  // Persist darkSitesResult to sessionStorage when it changes
  useEffect(() => {
    try {
      if (darkSitesResult) {
        sessionStorage.setItem(
          EXPLORE_SESSION_KEYS.DARK_SITES_RESULT,
          JSON.stringify(darkSitesResult),
        );
      } else {
        sessionStorage.removeItem(EXPLORE_SESSION_KEYS.DARK_SITES_RESULT);
      }
    } catch (error) {
      console.warn(
        "Failed to persist dark sites result to sessionStorage:",
        error,
      );
    }
  }, [darkSitesResult]);

  // Persist hasAutoSearched to sessionStorage when it changes
  useEffect(() => {
    try {
      sessionStorage.setItem(
        EXPLORE_SESSION_KEYS.HAS_AUTO_SEARCHED,
        JSON.stringify(hasAutoSearched),
      );
    } catch (error) {
      console.warn(
        "Failed to persist auto-search flag to sessionStorage:",
        error,
      );
    }
  }, [hasAutoSearched]);

  // Auto-search for nearest dark site when location is loaded
  useEffect(() => {
    if (userLocation && !hasAutoSearched && !isSearching) {
      setHasAutoSearched(true);
      // Call the search function directly to avoid dependency issues
      (async () => {
        setIsSearching(true);
        setSearchProgress(0);
        setSearchError(null);
        setDarkSitesResult(null);

        try {
          const result = await findMultipleDarkSites(userLocation, {
            maxDistance: APP_CONFIG.SEARCH.DEFAULT_RADIUS_KM,
            knownSites: DARK_SITES, // Pass known sites for secondary location matching
            onProgress: (progress) => setSearchProgress(progress),
          });

          if (result) {
            setDarkSitesResult(result);
          } else {
            setSearchError(
              formatMessage(APP_CONFIG.MESSAGES.NO_DARK_SITES_FOUND, {
                radius: APP_CONFIG.SEARCH.DEFAULT_RADIUS_KM,
              }),
            );
          }
        } catch (error) {
          console.error("Error finding dark sites:", error);
          setSearchError(APP_CONFIG.MESSAGES.SEARCH_ERROR);
        } finally {
          setIsSearching(false);
          setSearchProgress(0);
        }
      })();
    }
  }, [userLocation, hasAutoSearched, isSearching, findMultipleDarkSites]);

  // Filter sites based on Bortle scale
  const filterSitesByBortle = (sites: typeof DARK_SITES) => {
    return sites.filter((site) => {
      const slug = site[4] as string | undefined;
      const bortleRating = slug ? getDarkSiteBortleWithFallback(slug) : 2.0;

      switch (bortleFilter) {
        case "pristine":
          return bortleRating <= 1.0;
        case "excellent":
          return bortleRating <= 1.8;
        case "good":
          return bortleRating < 2.0;
        case "all":
        default:
          return true;
      }
    });
  };

  const filteredDarkSites = filterSitesByBortle(DARK_SITES);

  // Create markers for WorldMap
  const worldMapMarkers = [
    // Dark site markers
    ...filteredDarkSites.map((loc, idx) => ({
      id: `dark-site-${idx}`,
      lat: loc[2] as number,
      lng: loc[3] as number,
      className: `${exploreStyles.darkSiteMarker}`,
      onClick: () =>
        handleLocationClick({
          lat: loc[2] as number,
          lng: loc[3] as number,
          name: loc[1] as string,
        }),
      onMouseEnter: () => setHoveredLocation(loc[0] as string),
      onMouseLeave: () => setHoveredLocation(null),
    })),
    // Found dark site markers
    ...(darkSitesResult
      ? [
          // Primary dark site (red)
          {
            id: "primary-dark-site",
            lat: darkSitesResult.primary.coordinate.lat,
            lng: darkSitesResult.primary.coordinate.lng,
            className: `${exploreStyles.darkSiteMarker} ${exploreStyles.nearestMarker}`,
            onClick: () =>
              handleDarkSiteClick(
                darkSitesResult.primary.coordinate.lat,
                darkSitesResult.primary.coordinate.lng,
              ),
            title: `Primary Dark Site (${darkSitesResult.primary.distance.toFixed(
              1,
            )}km away, Bortle ${darkSitesResult.primary.bortleScale})`,
          },
          // Alternative dark sites (orange)
          ...darkSitesResult.alternatives.map((alt, idx) => ({
            id: `alt-dark-site-${idx}`,
            lat: alt.coordinate.lat,
            lng: alt.coordinate.lng,
            className: `${exploreStyles.darkSiteMarker} ${exploreStyles.alternativeMarker}`,
            onClick: () =>
              handleDarkSiteClick(alt.coordinate.lat, alt.coordinate.lng),
            title: `Alternative Dark Site (${alt.distance.toFixed(
              1,
            )}km away, Bortle ${alt.bortleScale})`,
          })),
        ]
      : []),
  ];

  // Create filter options with counts and icons
  const bortleFilterOptions: SegmentedControlOption<BortleFilter>[] = [
    {
      value: "all",
      label: "",
      icon: <Icon name="bortle-all" size="md" />,
      count: DARK_SITES.length,
    },
    {
      value: "good",
      label: "",
      icon: <Icon name="bortle-3dots" size="md" />,
      count: DARK_SITES.filter((site) => {
        const slug = site[4] as string | undefined;
        const rating = slug ? getDarkSiteBortleWithFallback(slug) : 2.0;
        return rating < 2.0;
      }).length,
    },
    {
      value: "excellent",
      label: "",
      icon: <Icon name="bortle-2dots" size="md" />,
      count: DARK_SITES.filter((site) => {
        const slug = site[4] as string | undefined;
        const rating = slug ? getDarkSiteBortleWithFallback(slug) : 2.0;
        return rating <= 1.8;
      }).length,
    },
    {
      value: "pristine",
      label: "",
      icon: <Icon name="bortle-1dot" size="md" />,
      count: DARK_SITES.filter((site) => {
        const slug = site[4] as string | undefined;
        const rating = slug ? getDarkSiteBortleWithFallback(slug) : 2.0;
        return rating <= 1.0;
      }).length,
    },
  ];

  // Reset auto-search flag when user manually changes location
  const handleUserLocationChangeWrapper = (location: Location) => {
    updateUserLocation(location); // Use the hook's update function
    // Note: LocationPopover closing is handled by the popover API
    // Clear previous results and reset auto-search flag to allow new search
    setDarkSitesResult(null);
    setSearchError(null);
    setHasAutoSearched(false);

    // Clear session storage for search results since we're starting fresh
    try {
      sessionStorage.removeItem(EXPLORE_SESSION_KEYS.DARK_SITES_RESULT);
      sessionStorage.removeItem(EXPLORE_SESSION_KEYS.HAS_AUTO_SEARCHED);
    } catch (error) {
      console.warn(
        "Failed to clear search results from sessionStorage:",
        error,
      );
    }
  };

  const handleLocationClick = (location: {
    lat: number;
    lng: number;
    name: string;
  }) => {
    const slug = locationNameToSlug(location.name);
    navigate(`/location/${slug}`);
  };

  const handleMapLocationChange = (location: Location) => {
    setSelectedLocation(location);

    // Update the explore location instead of navigating away
    // This keeps the user on the explore page while updating their location
    updateUserLocation(location);

    // Clear previous dark site search results and reset auto-search flag
    // so the system will automatically search for dark sites at the new location
    setDarkSitesResult(null);
    setSearchError(null);
    setHasAutoSearched(false);

    // Clear session storage for search results since we're starting fresh
    try {
      sessionStorage.removeItem(EXPLORE_SESSION_KEYS.DARK_SITES_RESULT);
      sessionStorage.removeItem(EXPLORE_SESSION_KEYS.HAS_AUTO_SEARCHED);
    } catch (error) {
      console.warn(
        "Failed to clear search results from sessionStorage:",
        error,
      );
    }
  };

  const handleDarkSiteClick = (lat: number, lng: number) => {
    navigate(`/location/@${lat.toFixed(4)},${lng.toFixed(4)}`);
  };

  const handleGetDirections = (lat: number, lng: number) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat.toFixed(
      6,
    )},${lng.toFixed(6)}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleKnownSiteClick = (siteName: string) => {
    const slug = locationNameToSlug(siteName);
    navigate(`/location/${slug}`);
  };

  // Group locations by region for better organization
  const groupedLocations: Record<string, SpecialLocation[]> = {
    "Eastern North America": [],
    "Central USA": [],
    "Northern California": [],
    "Bay Area & Central Coast": [],
    "Sierra Nevada & Central Valley": [],
    "Southern California Deserts": [],
    "Southern California Coast": [],
    Utah: [],
    Colorado: [],
    "New Mexico": [],
    Arizona: [],
    Texas: [],
    "Mountain West": [],
    "Pacific Northwest": [],
    "Alaska & Hawaii": [],
    "Africa and the Middle East": [],
    Europe: [],
    "Asia and Oceania": [],
  };

  // More detailed region detection based on coordinates and names
  filteredDarkSites.forEach((loc) => {
    const lat = loc[2] as number;
    const lng = loc[3] as number;
    const name = loc[0] as string;

    // Check for specific cases first
    if (name.includes("Canada")) {
      groupedLocations["Eastern North America"].push(loc);
    } else if (name.includes("California")) {
      // Sub-divide California by geographic regions
      if (
        name.includes("Redwood") ||
        name.includes("Del Norte") ||
        name.includes("Prairie Creek") ||
        name.includes("Humboldt") ||
        name.includes("Richardson Grove") ||
        name.includes("Benbow") ||
        name.includes("Grizzly Creek") ||
        name.includes("Ahjumawi") ||
        name.includes("Castle Crags") ||
        name.includes("McArthur-Burney") ||
        lat > 39.5 // Northern California latitude
      ) {
        groupedLocations["Northern California"].push(loc);
      } else if (
        name.includes("Yosemite") ||
        name.includes("Sequoia") ||
        name.includes("Kings Canyon") ||
        name.includes("Pinnacles") ||
        name.includes("Mono Lake") ||
        name.includes("Plumas-Eureka") ||
        (lat >= 36.2 && lat <= 39.5 && lng >= -121.5) // Sierra Nevada region
      ) {
        groupedLocations["Sierra Nevada & Central Valley"].push(loc);
      } else if (
        name.includes("Big Sur") ||
        name.includes("Julia Pfeiffer") ||
        name.includes("Pfeiffer") ||
        name.includes("Limekiln") ||
        name.includes("Point Sur") ||
        name.includes("Monterey") ||
        name.includes("Carmel") ||
        name.includes("Van Damme") ||
        name.includes("Mendocino") ||
        name.includes("Fort Ross") ||
        name.includes("Salt Point") ||
        name.includes("Kruse") ||
        name.includes("Manchester") ||
        name.includes("Navarro") ||
        name.includes("Caspar") ||
        name.includes("Estero") ||
        (lat >= 35.5 && lat <= 39.5 && lng <= -121.0) // Central Coast region
      ) {
        groupedLocations["Bay Area & Central Coast"].push(loc);
      } else if (
        name.includes("Joshua Tree") ||
        name.includes("Death Valley") ||
        name.includes("Mojave") ||
        name.includes("Anza") ||
        (lat <= 36.2 && lng <= -116) // Desert region
      ) {
        groupedLocations["Southern California Deserts"].push(loc);
      } else if (
        name.includes("Channel Islands") ||
        (lat <= 35.5 && lng >= -120 && lng <= -117) // Southern coast
      ) {
        groupedLocations["Southern California Coast"].push(loc);
      } else {
        // Default California locations to Bay Area & Central Coast
        groupedLocations["Bay Area & Central Coast"].push(loc);
      }
    } else if (name.includes("Utah")) {
      groupedLocations["Utah"].push(loc);
    } else if (name.includes("Colorado")) {
      groupedLocations["Colorado"].push(loc);
    } else if (name.includes("New Mexico")) {
      groupedLocations["New Mexico"].push(loc);
    } else if (name.includes("Arizona")) {
      groupedLocations["Arizona"].push(loc);
    } else if (name.includes("Texas")) {
      groupedLocations["Texas"].push(loc);
    } else if (name.includes("Alaska") || name.includes("Hawaii")) {
      groupedLocations["Alaska & Hawaii"].push(loc);
    } else if (
      name.includes("Montana") ||
      name.includes("Wyoming") ||
      name.includes("Idaho")
    ) {
      groupedLocations["Mountain West"].push(loc);
    } else if (name.includes("Washington") || name.includes("Oregon")) {
      groupedLocations["Pacific Northwest"].push(loc);
    } else if (name.includes("New Zealand") || name.includes(", NZ")) {
      groupedLocations["Asia and Oceania"].push(loc);
    } else if (name.includes("Japan")) {
      groupedLocations["Asia and Oceania"].push(loc);
    } else if (name.includes("Bolivia")) {
      groupedLocations["Asia and Oceania"].push(loc); // South America goes to Asia and Oceania for now
    } else if (name.includes("Namibia")) {
      groupedLocations["Africa and the Middle East"].push(loc);
    } else if (name.includes("Israel")) {
      groupedLocations["Africa and the Middle East"].push(loc);
    } else if (name.includes("Canary Islands")) {
      groupedLocations["Africa and the Middle East"].push(loc);
    } else if (lng >= -130 && lng <= -60 && lat >= 25 && lat <= 70) {
      // Continental USA subdivision
      if (lng <= -100) {
        // West of 100°W - should mostly be handled by specific state checks above
        // Any remaining western locations go to Mountain West as default
        groupedLocations["Mountain West"].push(loc);
      } else if (lng <= -85) {
        // Between 100°W and 85°W (roughly Central time zone)
        groupedLocations["Central USA"].push(loc);
      } else {
        // East of 85°W (roughly Eastern time zone) - includes eastern US
        groupedLocations["Eastern North America"].push(loc);
      }
    } else if (lng >= -30 && lng <= 60 && lat >= 35) {
      // Europe
      groupedLocations["Europe"].push(loc);
    } else {
      // Default to Asia & Oceania for anything else
      groupedLocations["Asia and Oceania"].push(loc);
    }
  });

  return (
    <>
      <Helmet>
        <title>Explore Dark Sky Sites - Milky Way Calendar</title>
        <meta
          name="description"
          content="Explore the best dark sky sites and national parks around the world for Milky Way viewing. Find pristine locations for astrophotography with our interactive map."
        />
        <meta
          property="og:title"
          content="Explore Dark Sky Sites - Milky Way Calendar"
        />
        <meta
          property="og:description"
          content="Explore the best dark sky sites and national parks around the world for Milky Way viewing. Find pristine locations for astrophotography with our interactive map."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Explore Dark Sky Sites - Milky Way Calendar"
        />
        <meta
          name="twitter:description"
          content="Explore the best dark sky sites and national parks around the world for Milky Way viewing. Find pristine locations for astrophotography with our interactive map."
        />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={exploreStyles.contentWrapper}>
            <h1 className={exploreStyles.mainTitle}>Explore Dark Sky Sites</h1>
            <p className={exploreStyles.subtitle}>
              Discover the world's best dark sky parks, reserves, and national
              parks for Milky Way viewing. Click on any location to view
              detailed visibility conditions throughout the year.
            </p>

            {/* Interactive World Map */}
            <div className={exploreStyles.mapWrapper}>
              <div className={exploreStyles.mapContainer}>
                <WorldMap
                  ref={worldMapRef}
                  location={selectedLocation}
                  onLocationChange={handleMapLocationChange}
                  markers={worldMapMarkers}
                />
                {/* Tooltips overlay for hovered markers */}
                {hoveredLocation && (
                  <div className={exploreStyles.tooltipOverlay}>
                    {filteredDarkSites.map((loc, idx) => {
                      const fullName = loc[0] as string;
                      const slug = loc[4] as string | undefined;

                      if (hoveredLocation !== fullName) return null;

                      const bortleRating = slug
                        ? getDarkSiteBortleWithFallback(slug)
                        : 2.0;

                      const lat = loc[2] as number;
                      const lng = loc[3] as number;
                      const normalized = coordToNormalized(lat, lng);

                      // Get the WorldMap's positioning functions
                      if (!worldMapRef.current) return null;

                      const { getMarkerPositionForPan, panX } =
                        worldMapRef.current;

                      // Calculate positions for all possible map instances (world wrapping)
                      const markerPositions = [
                        {
                          pos: getMarkerPositionForPan(
                            normalized.x,
                            normalized.y,
                            panX,
                          ),
                          key: "primary",
                        },
                        {
                          pos: getMarkerPositionForPan(
                            normalized.x,
                            normalized.y,
                            panX - 1,
                          ),
                          key: "left",
                        },
                        {
                          pos: getMarkerPositionForPan(
                            normalized.x,
                            normalized.y,
                            panX + 1,
                          ),
                          key: "right",
                        },
                      ];

                      // Filter to only visible positions (within viewport bounds)
                      const visiblePositions = markerPositions.filter(
                        ({ pos }) =>
                          pos.x >= -10 &&
                          pos.x <= 110 &&
                          pos.y >= -10 &&
                          pos.y <= 110,
                      );

                      return visiblePositions.map(({ pos, key }) => (
                        <DarkSiteTooltip
                          key={`${idx}-${key}`}
                          siteName={fullName}
                          bortleRating={bortleRating}
                          className={exploreStyles.mapTooltip}
                          style={{
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                            transform: "translate(-50%, -100%)", // Center horizontally, position above marker
                            marginTop: "-8px", // Small gap above marker
                          }}
                        />
                      ));
                    })}
                  </div>
                )}
              </div>
              <p className={exploreStyles.mapDescription}>
                Light Pollution Map by{" "}
                <a href="https://djlorenz.github.io/astronomy/lp/">
                  David J Lorenz
                </a>
              </p>
            </div>

            {/* Nearest Dark Site Finder */}
            <div className={exploreStyles.nearestDarkSiteSection}>
              <h2 className={exploreStyles.sectionTitle}>
                Nearby Dark Sky Site
              </h2>
              <p className={exploreStyles.sectionDescription}>
                {userLocation
                  ? "Here are some dark sky sites near you. Change location to explore a different area."
                  : "Select a location to explore nearby dark sky sites with minimal light pollution."}
              </p>

              <div className={exploreStyles.locationFinderContainer}>
                <div className={exploreStyles.locationInputSection}>
                  <button
                    ref={locationButtonRef}
                    popovertarget="explore-location-popover"
                    className={exploreStyles.locationButton}
                  >
                    {userLocation
                      ? `${userLocation.lat.toFixed(
                          4,
                        )}, ${userLocation.lng.toFixed(4)}`
                      : "Select your location"}
                  </button>
                </div>

                {isSearching && (
                  <div className={exploreStyles.progressContainer}>
                    <div className={exploreStyles.progressBar}>
                      <div
                        className={exploreStyles.progressFill}
                        style={{ width: `${searchProgress * 100}%` }}
                      />
                    </div>
                    <p className={exploreStyles.progressText}>
                      Analyzing light pollution map...{" "}
                      {Math.round(searchProgress * 100)}%
                    </p>
                  </div>
                )}

                {darkSitesResult && (
                  <div className={exploreStyles.resultsWrapper}>
                    {/* Primary Dark Site */}
                    <div className={exploreStyles.resultContainer}>
                      <h3 className={exploreStyles.resultTitle}>
                        🎯 Primary Dark Site
                      </h3>
                      <div className={exploreStyles.resultDetails}>
                        <p>
                          <strong>Distance:</strong>{" "}
                          {darkSitesResult.primary.distance.toFixed(1)} km away
                        </p>
                        <p>
                          <strong>Bortle Scale:</strong>{" "}
                          {darkSitesResult.primary.bortleScale} (Excellent dark
                          sky)
                        </p>
                        <p>
                          <strong>Coordinates:</strong>{" "}
                          {darkSitesResult.primary.coordinate.lat.toFixed(4)},{" "}
                          {darkSitesResult.primary.coordinate.lng.toFixed(4)}
                        </p>
                      </div>
                      <div className={exploreStyles.resultButtons}>
                        <button
                          onClick={() =>
                            handleDarkSiteClick(
                              darkSitesResult.primary.coordinate.lat,
                              darkSitesResult.primary.coordinate.lng,
                            )
                          }
                          className={exploreStyles.viewLocationButton}
                        >
                          View Milky Way Visibility
                        </button>
                        <button
                          onClick={() =>
                            handleGetDirections(
                              darkSitesResult.primary.coordinate.lat,
                              darkSitesResult.primary.coordinate.lng,
                            )
                          }
                          className={exploreStyles.directionsButton}
                        >
                          Get Directions
                        </button>
                      </div>

                      {/* Nearest Known Site for Primary */}
                      {darkSitesResult.primary.nearestKnownSite && (
                        <div className={exploreStyles.knownSiteSection}>
                          <h4 className={exploreStyles.knownSiteTitle}>
                            <Icon
                              name="location"
                              size="md"
                              className="color-accent"
                            />{" "}
                            Nearest Accessible Location
                          </h4>
                          <p className={exploreStyles.knownSiteDescription}>
                            <strong>
                              {
                                darkSitesResult.primary.nearestKnownSite
                                  .fullName
                              }
                            </strong>{" "}
                            is{" "}
                            {darkSitesResult.primary.nearestKnownSite.distance.toFixed(
                              1,
                            )}
                            km from this dark site. This location may offer
                            better road access and facilities.
                          </p>
                          <div className={exploreStyles.knownSiteButtons}>
                            <button
                              onClick={() =>
                                handleKnownSiteClick(
                                  darkSitesResult.primary.nearestKnownSite!
                                    .name,
                                )
                              }
                              className={exploreStyles.knownSiteButton}
                            >
                              View{" "}
                              {darkSitesResult.primary.nearestKnownSite.name}
                            </button>
                            <button
                              onClick={() =>
                                handleGetDirections(
                                  darkSitesResult.primary.nearestKnownSite!
                                    .coordinate.lat,
                                  darkSitesResult.primary.nearestKnownSite!
                                    .coordinate.lng,
                                )
                              }
                              className={
                                exploreStyles.knownSiteDirectionsButton
                              }
                            >
                              Get Directions
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Alternative Dark Sites - Compact Layout */}
                    {darkSitesResult.alternatives.length > 0 && (
                      <div className={exploreStyles.alternativesSection}>
                        <h3 className={exploreStyles.alternativesTitle}>
                          🌟 Alternative Dark Sites
                        </h3>
                        <p className={exploreStyles.alternativesDescription}>
                          {darkSitesResult.alternatives.length} additional
                          excellent locations in different directions.
                        </p>

                        <div className={exploreStyles.alternativesGrid}>
                          {darkSitesResult.alternatives.map((alt, idx) => (
                            <div
                              key={idx}
                              className={exploreStyles.alternativeCard}
                            >
                              <div
                                className={exploreStyles.alternativeCardHeader}
                              >
                                <span
                                  className={exploreStyles.alternativeNumber}
                                >
                                  #{idx + 1}
                                </span>
                                <div
                                  className={exploreStyles.alternativeMetrics}
                                >
                                  <span
                                    className={exploreStyles.distanceMetric}
                                  >
                                    {alt.distance.toFixed(0)}km
                                  </span>
                                  <span className={exploreStyles.bortleMetric}>
                                    B{alt.bortleScale}
                                  </span>
                                </div>
                              </div>

                              <div className={exploreStyles.alternativeCoords}>
                                {alt.coordinate.lat.toFixed(3)},{" "}
                                {alt.coordinate.lng.toFixed(3)}
                              </div>

                              <div className={exploreStyles.alternativeActions}>
                                <Tooltip content="View Milky Way visibility data">
                                  <button
                                    onClick={() =>
                                      handleDarkSiteClick(
                                        alt.coordinate.lat,
                                        alt.coordinate.lng,
                                      )
                                    }
                                    className={
                                      exploreStyles.alternativeActionButton
                                    }
                                  >
                                    🔭 View
                                  </button>
                                </Tooltip>
                                <Tooltip content="Get driving directions">
                                  <button
                                    onClick={() =>
                                      handleGetDirections(
                                        alt.coordinate.lat,
                                        alt.coordinate.lng,
                                      )
                                    }
                                    className={
                                      exploreStyles.alternativeActionButton
                                    }
                                  >
                                    🗺️ Drive
                                  </button>
                                </Tooltip>
                                {alt.nearestKnownSite && (
                                  <Tooltip
                                    content={`Nearest accessible: ${
                                      alt.nearestKnownSite.fullName
                                    } (${alt.nearestKnownSite.distance.toFixed(
                                      0,
                                    )}km)`}
                                  >
                                    <button
                                      onClick={() =>
                                        handleKnownSiteClick(
                                          alt.nearestKnownSite!.name,
                                        )
                                      }
                                      className={
                                        exploreStyles.alternativeActionButton
                                      }
                                    >
                                      🏢 {alt.nearestKnownSite.name}
                                    </button>
                                  </Tooltip>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Results Map */}
                    <div className={exploreStyles.resultsMapContainer}>
                      {userLocation ? (
                        <ResultsMap
                          userLocation={userLocation}
                          darkSitesResult={darkSitesResult}
                          onLocationClick={handleDarkSiteClick}
                        />
                      ) : (
                        <div className={exploreStyles.mapLoadingMessage}>
                          Loading map...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {searchError && (
                  <div className={exploreStyles.errorContainer}>
                    <p className={exploreStyles.errorMessage}>{searchError}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Dark Sites List by Region */}
            <div className={exploreStyles.darkSiteCatalog}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <h2
                  className={exploreStyles.sectionTitle}
                  style={{ marginBottom: 0 }}
                >
                  Dark Sky Sites by Region
                </h2>
                <SegmentedControl
                  options={bortleFilterOptions}
                  value={bortleFilter}
                  onChange={setBortleFilter}
                  size="sm"
                />
              </div>
              <div className={exploreStyles.regionsGrid}>
                {Object.entries(groupedLocations).map(([region, locations]) => {
                  if (locations.length === 0) return null;

                  // Determine card size based on number of locations for bento-box effect
                  const getCardSizeClass = (count: number) => {
                    if (count >= 8) return "large";
                    if (count >= 4) return "medium";
                    return "small";
                  };

                  const sizeClass = getCardSizeClass(locations.length);

                  return (
                    <div
                      key={region}
                      className={`${exploreStyles.regionCard} ${exploreStyles[sizeClass]}`}
                    >
                      <h3 className={exploreStyles.regionTitle}>
                        {region}{" "}
                        <span className={exploreStyles.locationCount}>
                          ({locations.length})
                        </span>
                      </h3>
                      <ul className={exploreStyles.locationsList}>
                        {locations.map((loc, idx) => {
                          const fullName = loc[0] as string;
                          const shortName = loc[1] as string;
                          const lat = loc[2] as number;
                          const lng = loc[3] as number;
                          const slug = loc[4] as string | undefined;

                          // Get Bortle rating for this dark site
                          const bortleRating = slug
                            ? getDarkSiteBortleWithFallback(slug)
                            : 2.0;

                          return (
                            <li key={idx} className={exploreStyles.catalogItem}>
                              <button
                                onClick={() =>
                                  handleLocationClick({
                                    lat,
                                    lng,
                                    name: shortName,
                                  })
                                }
                                className={exploreStyles.locationItem}
                                onMouseEnter={() =>
                                  setHoveredCatalogLocation(fullName)
                                }
                                onMouseLeave={() =>
                                  setHoveredCatalogLocation(null)
                                }
                              >
                                <span className={exploreStyles.locationName}>
                                  {shortName}
                                </span>
                                <span className={exploreStyles.bortleRating}>
                                  B{bortleRating.toFixed(1)}
                                </span>
                              </button>
                              {hoveredCatalogLocation === fullName && (
                                <DarkSiteTooltip
                                  siteName={fullName}
                                  bortleRating={bortleRating}
                                  className={exploreStyles.catalogTooltip}
                                />
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Popover */}
      <LocationPopover
        id="explore-location-popover"
        onLocationChange={handleUserLocationChangeWrapper}
        onClose={() => {}}
      />
    </>
  );
}

export default ExplorePage;
