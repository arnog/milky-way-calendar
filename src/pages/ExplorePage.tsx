import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import WorldMap from "../components/WorldMap";
import LocationPopover from "../components/LocationPopover";
import ResultsMap from "../components/ResultsMap";
import { Icon } from "../components/Icon";
import { Location } from "../types/astronomy";
import { DARK_SITES } from "../utils/locations";
import { locationNameToSlug } from "../utils/urlHelpers";
import {
  findMultipleDarkSites,
  MultipleDarkSitesResult,
  coordToNormalized,
} from "../utils/lightPollutionMap";
import { storageService } from "../services/storageService";
import styles from "../App.module.css";
import exploreStyles from "./ExplorePage.module.css";

interface ExplorePageProps {
  isDarkroomMode: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ExplorePage({ isDarkroomMode: _isDarkroomMode }: ExplorePageProps) {
  const navigate = useNavigate();
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  // Nearest dark site finder state
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [darkSitesResult, setDarkSitesResult] =
    useState<MultipleDarkSitesResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [showLocationPopover, setShowLocationPopover] = useState(false);
  const locationButtonRef = useRef<HTMLButtonElement>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasAutoSearched, setHasAutoSearched] = useState(false);

  // Auto-load user's previous location on page visit
  useEffect(() => {
    const savedLocationData = storageService.getLocationData();
    if (savedLocationData?.location) {
      setUserLocation(savedLocationData.location);
    }
  }, []);

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
          const result = await findMultipleDarkSites(
            userLocation,
            500, // 500km max search radius
            (progress) => setSearchProgress(progress),
            DARK_SITES // Pass known sites for secondary location matching
          );

          if (result) {
            setDarkSitesResult(result);
          } else {
            setSearchError(
              "No dark sky sites found within 500km of your location."
            );
          }
        } catch (error) {
          console.error("Error finding dark sites:", error);
          setSearchError("Failed to find dark sites. Please try again.");
        } finally {
          setIsSearching(false);
          setSearchProgress(0);
        }
      })();
    }
  }, [userLocation, hasAutoSearched, isSearching]);

  // Reset auto-search flag when user manually changes location
  const handleUserLocationChangeWrapper = (
    location: Location,
    shouldClose = true
  ) => {
    setUserLocation(location);
    if (shouldClose) {
      setShowLocationPopover(false);
    }
    // Clear previous results and reset auto-search flag to allow new search
    setDarkSitesResult(null);
    setSearchError(null);
    setHasAutoSearched(false);
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

    // Find if this location is near a dark site
    for (const loc of DARK_SITES) {
      const specialLat = loc[2] as number;
      const specialLng = loc[3] as number;

      if (
        Math.abs(location.lat - specialLat) < 2 &&
        Math.abs(location.lng - specialLng) < 2
      ) {
        const slug = locationNameToSlug(loc[1] as string);
        navigate(`/location/${slug}`);
        return;
      }
    }

    // Navigate to coordinate-based location
    navigate(
      `/location/@${location.lat.toFixed(4)},${location.lng.toFixed(4)}`
    );
  };

  // This is now replaced by handleUserLocationChangeWrapper

  const handleFindNearestDarkSite = async () => {
    if (!userLocation) return;

    setIsSearching(true);
    setSearchProgress(0);
    setSearchError(null);
    setDarkSitesResult(null);

    try {
      const result = await findMultipleDarkSites(
        userLocation,
        500, // 500km max search radius
        (progress) => setSearchProgress(progress),
        DARK_SITES // Pass known sites for secondary location matching
      );

      if (result) {
        setDarkSitesResult(result);
      } else {
        setSearchError(
          "No dark sky sites found within 500km of your location."
        );
      }
    } catch (error) {
      console.error("Error finding dark sites:", error);
      setSearchError("Failed to find dark sites. Please try again.");
    } finally {
      setIsSearching(false);
      setSearchProgress(0);
    }
  };

  const handleDarkSiteClick = (lat: number, lng: number) => {
    navigate(`/location/@${lat.toFixed(4)},${lng.toFixed(4)}`);
  };

  const handleGetDirections = (lat: number, lng: number) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat.toFixed(
      6
    )},${lng.toFixed(6)}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleKnownSiteClick = (siteName: string) => {
    const slug = locationNameToSlug(siteName);
    navigate(`/location/${slug}`);
  };

  // Group locations by region for better organization
  const groupedLocations = {
    "Western USA": [] as typeof DARK_SITES,
    "Central USA": [] as typeof DARK_SITES,
    "Eastern USA": [] as typeof DARK_SITES,
    Canada: [] as typeof DARK_SITES,
    "South America": [] as typeof DARK_SITES,
    Europe: [] as typeof DARK_SITES,
    "Africa & Middle East": [] as typeof DARK_SITES,
    "Asia & Oceania": [] as typeof DARK_SITES,
  };

  // More detailed region detection based on coordinates
  DARK_SITES.forEach((loc) => {
    const lat = loc[2] as number;
    const lng = loc[3] as number;
    const name = loc[0] as string;

    // Check for specific cases first
    if (name.includes("Hawaii")) {
      groupedLocations["Western USA"].push(loc);
    } else if (name.includes("Alaska")) {
      groupedLocations["Western USA"].push(loc);
    } else if (name.includes("Canada")) {
      groupedLocations["Canada"].push(loc);
    } else if (name.includes("New Zealand") || name.includes(", NZ")) {
      groupedLocations["Asia & Oceania"].push(loc);
    } else if (name.includes("Japan")) {
      groupedLocations["Asia & Oceania"].push(loc);
    } else if (name.includes("Bolivia")) {
      groupedLocations["South America"].push(loc);
    } else if (name.includes("Namibia")) {
      groupedLocations["Africa & Middle East"].push(loc);
    } else if (name.includes("Israel")) {
      groupedLocations["Africa & Middle East"].push(loc);
    } else if (name.includes("Canary Islands")) {
      groupedLocations["Africa & Middle East"].push(loc);
    } else if (lng >= -130 && lng <= -60 && lat >= 25 && lat <= 70) {
      // Continental USA subdivision
      if (lng <= -100) {
        // West of 100°W (roughly Mountain/Pacific time zones)
        groupedLocations["Western USA"].push(loc);
      } else if (lng <= -85) {
        // Between 100°W and 85°W (roughly Central time zone)
        groupedLocations["Central USA"].push(loc);
      } else {
        // East of 85°W (roughly Eastern time zone)
        groupedLocations["Eastern USA"].push(loc);
      }
    } else if (lng >= -30 && lng <= 60 && lat >= 35) {
      // Europe
      groupedLocations["Europe"].push(loc);
    } else {
      // Default to Asia & Oceania for anything else
      groupedLocations["Asia & Oceania"].push(loc);
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
                  location={selectedLocation}
                  onLocationChange={handleMapLocationChange}
                />
                {/* Overlay markers for dark sites */}
                <div className={exploreStyles.markersOverlay}>
                  {DARK_SITES.map((loc, idx) => {
                    const fullName = loc[0] as string;
                    const shortName = loc[1] as string;
                    const lat = loc[2] as number;
                    const lng = loc[3] as number;

                    // Equirectangular projection transform (matching WorldMap component and light pollution map)
                    const { x: normalizedX, y: normalizedY } =
                      coordToNormalized(lat, lng);
                    const x = normalizedX * 100;
                    const y = normalizedY * 100;

                    return (
                      <div
                        key={idx}
                        className={exploreStyles.markerPosition}
                        style={{ left: `${x}%`, top: `${y}%` }}
                      >
                        <div
                          className={exploreStyles.darkSiteMarker}
                          onMouseEnter={() => setHoveredLocation(fullName)}
                          onMouseLeave={() => setHoveredLocation(null)}
                          onClick={() =>
                            handleLocationClick({ lat, lng, name: shortName })
                          }
                        />
                        {hoveredLocation === fullName && (
                          <div className={exploreStyles.tooltip}>
                            <div className={exploreStyles.tooltipContent}>
                              {fullName}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Found dark site markers */}
                  {darkSitesResult && (
                    <>
                      {/* Primary dark site marker (red) */}
                      <div
                        className={exploreStyles.markerPosition}
                        style={{
                          left: `${
                            coordToNormalized(
                              darkSitesResult.primary.coordinate.lat,
                              darkSitesResult.primary.coordinate.lng
                            ).x * 100
                          }%`,
                          top: `${
                            coordToNormalized(
                              darkSitesResult.primary.coordinate.lat,
                              darkSitesResult.primary.coordinate.lng
                            ).y * 100
                          }%`,
                        }}
                      >
                        <div
                          className={`${exploreStyles.darkSiteMarker} ${exploreStyles.nearestMarker}`}
                          onClick={() =>
                            handleDarkSiteClick(
                              darkSitesResult.primary.coordinate.lat,
                              darkSitesResult.primary.coordinate.lng
                            )
                          }
                          title={`Primary Dark Site (${darkSitesResult.primary.distance.toFixed(
                            1
                          )}km away, Bortle ${
                            darkSitesResult.primary.bortleScale
                          })`}
                        />
                      </div>

                      {/* Alternative dark site markers (orange) */}
                      {darkSitesResult.alternatives.map((alt, idx) => (
                        <div
                          key={idx}
                          className={exploreStyles.markerPosition}
                          style={{
                            left: `${
                              coordToNormalized(
                                alt.coordinate.lat,
                                alt.coordinate.lng
                              ).x * 100
                            }%`,
                            top: `${
                              coordToNormalized(
                                alt.coordinate.lat,
                                alt.coordinate.lng
                              ).y * 100
                            }%`,
                          }}
                        >
                          <div
                            className={`${exploreStyles.darkSiteMarker} ${exploreStyles.alternativeMarker}`}
                            onClick={() =>
                              handleDarkSiteClick(
                                alt.coordinate.lat,
                                alt.coordinate.lng
                              )
                            }
                            title={`Alternative Dark Site (${alt.distance.toFixed(
                              1
                            )}km away, Bortle ${alt.bortleScale})`}
                          />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
              <p className={exploreStyles.mapDescription}>
                Click anywhere on the map to explore, or select a dark sky site
                marked in blue.
              </p>
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
                Find Nearest Dark Sky Site
              </h2>
              <p className={exploreStyles.sectionDescription}>
                {userLocation
                  ? "We've automatically loaded your saved location and searched for the nearest dark sky area."
                  : "Enter your location to find the nearest dark sky area with minimal light pollution."}
              </p>

              <div className={exploreStyles.locationFinderContainer}>
                <div className={exploreStyles.locationInputSection}>
                  <button
                    ref={locationButtonRef}
                    onClick={() => setShowLocationPopover(true)}
                    className={exploreStyles.locationButton}
                  >
                    {userLocation
                      ? `${userLocation.lat.toFixed(
                          4
                        )}, ${userLocation.lng.toFixed(4)}`
                      : "Select your location"}
                  </button>

                  <button
                    onClick={handleFindNearestDarkSite}
                    disabled={!userLocation || isSearching}
                    className={exploreStyles.findButton}
                  >
                    {isSearching ? "Searching..." : "Find Nearest Dark Site"}
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
                              darkSitesResult.primary.coordinate.lng
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
                              darkSitesResult.primary.coordinate.lng
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
                              className="global-icon-small color-accent"
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
                              1
                            )}
                            km from this dark site. This location may offer
                            better road access and facilities.
                          </p>
                          <div className={exploreStyles.knownSiteButtons}>
                            <button
                              onClick={() =>
                                handleKnownSiteClick(
                                  darkSitesResult.primary.nearestKnownSite!.name
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
                                    .coordinate.lng
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
                                <button
                                  onClick={() =>
                                    handleDarkSiteClick(
                                      alt.coordinate.lat,
                                      alt.coordinate.lng
                                    )
                                  }
                                  className={
                                    exploreStyles.alternativeActionButton
                                  }
                                  title="View Milky Way visibility data"
                                >
                                  🔭 View
                                </button>
                                <button
                                  onClick={() =>
                                    handleGetDirections(
                                      alt.coordinate.lat,
                                      alt.coordinate.lng
                                    )
                                  }
                                  className={
                                    exploreStyles.alternativeActionButton
                                  }
                                  title="Get driving directions"
                                >
                                  🗺️ Drive
                                </button>
                                {alt.nearestKnownSite && (
                                  <button
                                    onClick={() =>
                                      handleKnownSiteClick(
                                        alt.nearestKnownSite!.name
                                      )
                                    }
                                    className={
                                      exploreStyles.alternativeActionButton
                                    }
                                    title={`Nearest accessible: ${
                                      alt.nearestKnownSite.fullName
                                    } (${alt.nearestKnownSite.distance.toFixed(
                                      0
                                    )}km)`}
                                  >
                                    🏢 {alt.nearestKnownSite.name}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Results Map */}
                    <div className={exploreStyles.resultsMapSection}>
                      <h3 className={exploreStyles.resultsMapTitle}>
                        🗺️ Found Locations Map
                      </h3>
                      <p className={exploreStyles.resultsMapDescription}>
                        Your location (green) and all found dark sites. Red =
                        primary, orange = alternatives.
                      </p>

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
            <div>
              <h2 className={exploreStyles.sectionTitle}>
                Dark Sky Sites by Region
              </h2>
              <div className={exploreStyles.regionsGrid}>
                {Object.entries(groupedLocations).map(([region, locations]) => {
                  if (locations.length === 0) return null;

                  return (
                    <div key={region} className={exploreStyles.regionCard}>
                      <h3 className={exploreStyles.regionTitle}>{region}</h3>
                      <ul className={exploreStyles.locationsList}>
                        {locations.map((loc, idx) => {
                          const fullName = loc[0] as string;
                          const shortName = loc[1] as string;
                          const lat = loc[2] as number;
                          const lng = loc[3] as number;

                          return (
                            <li key={idx}>
                              <button
                                onClick={() =>
                                  handleLocationClick({
                                    lat,
                                    lng,
                                    name: shortName,
                                  })
                                }
                                className={exploreStyles.locationButton}
                              >
                                {fullName}
                              </button>
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
      {showLocationPopover && (
        <LocationPopover
          location={userLocation}
          onLocationChange={handleUserLocationChangeWrapper}
          onClose={() => setShowLocationPopover(false)}
          triggerRef={locationButtonRef}
        />
      )}
    </>
  );
}

export default ExplorePage;
