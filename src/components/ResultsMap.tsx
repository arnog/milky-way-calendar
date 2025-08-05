import React, { useEffect, useRef } from "react";
import Map, { Marker, NavigationControl, MapRef } from "react-map-gl";
import type { ErrorEvent } from "react-map-gl";
import { MultipleDarkSitesResult } from "../utils/lightPollutionMap";
import { Location } from "../types/astronomy";
import styles from "./ResultsMap.module.css";

// Get Mapbox access token from environment variables
// Your personal token is used when available
const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ||
  "pk.eyJ1IjoiYXJuby1nIiwiYSI6ImNqcmw3NHltNDA1aGI0NHBuZzFkYmkxM2QifQ.86n2gX8yCURFzbzR9eib5g";

// Development logging
if (!import.meta.env.VITE_MAPBOX_ACCESS_TOKEN) {
  console.info("Using fallback Mapbox token");
}

interface ResultsMapProps {
  userLocation: Location;
  darkSitesResult: MultipleDarkSitesResult;
  onLocationClick: (lat: number, lng: number) => void;
}

interface MarkerData {
  lat: number;
  lng: number;
  type: "user" | "primary" | "alternative";
  title: string;
  distance?: number;
  bortleScale?: number;
}

export default function ResultsMap({
  userLocation,
  darkSitesResult,
  onLocationClick,
}: ResultsMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [mapError, setMapError] = React.useState<string | null>(null);

  // Development logging
  React.useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("ResultsMap: User location:", userLocation);
      console.log(
        "ResultsMap: Dark sites found:",
        darkSitesResult.alternatives.length,
      );
    }
  }, [userLocation, darkSitesResult]);

  // Prepare all markers data
  const markers: MarkerData[] = React.useMemo(
    () => [
      // User location
      {
        lat: userLocation.lat,
        lng: userLocation.lng,
        type: "user",
        title: `Your Location (${userLocation.lat.toFixed(
          3,
        )}, ${userLocation.lng.toFixed(3)})`,
      },
      // Primary dark site
      {
        lat: darkSitesResult.primary.coordinate.lat,
        lng: darkSitesResult.primary.coordinate.lng,
        type: "primary",
        title: `Primary Dark Site`,
        distance: darkSitesResult.primary.distance,
        bortleScale: darkSitesResult.primary.bortleScale,
      },
      // Alternative dark sites
      ...darkSitesResult.alternatives.map((alt, idx) => ({
        lat: alt.coordinate.lat,
        lng: alt.coordinate.lng,
        type: "alternative" as const,
        title: `Alternative ${idx + 1}`,
        distance: alt.distance,
        bortleScale: alt.bortleScale,
      })),
    ],
    [userLocation, darkSitesResult],
  );

  // Calculate bounds to fit all markers
  const bounds = React.useMemo(() => {
    if (markers.length === 0) return null;

    const lats = markers.map((m) => m.lat);
    const lngs = markers.map((m) => m.lng);

    return {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs),
    };
  }, [markers]);

  // Auto-fit bounds when component mounts or markers change
  useEffect(() => {
    if (mapRef.current && bounds) {
      // Add padding around the bounds
      const padding = 50;

      mapRef.current.getMap().fitBounds(
        [
          [bounds.west, bounds.south],
          [bounds.east, bounds.north],
        ],
        {
          padding,
          duration: 1000,
        },
      );
    }
  }, [bounds]);

  const handleMarkerClick = (marker: MarkerData) => {
    if (marker.type !== "user") {
      onLocationClick(marker.lat, marker.lng);
    }
  };

  // Fallback component for when map fails to load
  if (mapError) {
    return (
      <div className={styles.mapContainer}>
        <div className={styles.mapError}>
          <h4>Interactive Map Unavailable</h4>
          <p>
            The interactive map could not be loaded. This might be due to
            network issues or API limitations.
          </p>
          <div className={styles.markersList}>
            <h5>Found Locations:</h5>
            {markers.map((marker, idx) => (
              <div key={idx} className={styles.markerItem}>
                <span className={styles.markerIcon}>
                  {marker.type === "user" && "📍"}
                  {marker.type === "primary" && "🎯"}
                  {marker.type === "alternative" && "⭐"}
                </span>
                <span>{marker.title}</span>
                {marker.distance && (
                  <span>({marker.distance.toFixed(1)}km away)</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mapContainer}>
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          zoom: 8,
        }}
        style={{ width: "100%", height: "400px" }}
        mapStyle="mapbox://styles/arno-g/cmdt9vkin00n201rh54z95plm"
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={true}
        onError={(error: ErrorEvent) => {
          console.warn("Mapbox error:", error);
          setMapError("Failed to load interactive map");
        }}
      >
        {/* Navigation controls */}
        <NavigationControl position="top-right" />

        {/* Render markers in specific order: user first, then others */}
        {markers
          .sort((a, b) => {
            const order = { user: 0, primary: 1, alternative: 2 };
            return order[a.type] - order[b.type];
          })
          .map((marker, index) => {
            return (
              <Marker
                key={`${marker.type}-${index}`}
                latitude={marker.lat}
                longitude={marker.lng}
                onClick={() => handleMarkerClick(marker)}
              >
                <div
                  className={`${styles.marker} ${
                    styles[`${marker.type}Marker`]
                  }`}
                  title={
                    marker.distance && marker.bortleScale
                      ? `${marker.title}: ${marker.distance.toFixed(
                          1,
                        )}km, Bortle ${marker.bortleScale}`
                      : marker.title
                  }
                  style={{
                    zIndex:
                      marker.type === "user"
                        ? 1000
                        : marker.type === "primary"
                          ? 100
                          : 50,
                  }}
                >
                  {marker.type === "user" && "📍"}
                  {marker.type === "primary" && "🎯"}
                  {marker.type === "alternative" && "⭐"}
                </div>
              </Marker>
            );
          })}
      </Map>

      {/* Map Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendIcon}>📍</span>
          <span>Your Location</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendIcon}>🎯</span>
          <span>Primary Dark Site</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendIcon}>⭐</span>
          <span>Alternative Sites</span>
        </div>
      </div>
    </div>
  );
}
