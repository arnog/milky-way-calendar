import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import WorldMap from "../components/WorldMap";
import { Location } from "../types/astronomy";
import { DARK_SITES } from "../utils/locations";
import { locationNameToSlug } from "../utils/urlHelpers";
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
            <h1 className={exploreStyles.mainTitle}>
              Explore Dark Sky Sites
            </h1>
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

                    // Equirectangular projection transform (matching WorldMap component)
                    const x = ((lng + 180) / 360) * 100;
                    const y = ((90 - lat) / 180) * 100;

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
                      <h3 className={exploreStyles.regionTitle}>
                        {region}
                      </h3>
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
    </>
  );
}

export default ExplorePage;
