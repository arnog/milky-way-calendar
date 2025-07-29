import { useState, useEffect } from "react";
import { Location } from "../types/astronomy";

interface LocationInputProps {
  location: Location | null;
  onLocationChange: (location: Location) => void;
}

export default function LocationInput({
  location,
  onLocationChange,
}: LocationInputProps) {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get user's current location on component mount
    if (navigator.geolocation && !location) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLat(newLocation.lat.toString());
          setLng(newLocation.lng.toString());
          onLocationChange(newLocation);
          setIsLoading(false);
        },
        () => {
          // Default to a common location if geolocation fails
          const defaultLocation = { lat: 34.0549, lng: -118.2426 }; // LA
          setLat(defaultLocation.lat.toString());
          setLng(defaultLocation.lng.toString());
          onLocationChange(defaultLocation);
          setIsLoading(false);
        }
      );
    }
  }, [location, onLocationChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      alert("Please enter valid latitude and longitude values");
      return;
    }

    if (latNum < -90 || latNum > 90) {
      alert("Latitude must be between -90 and 90");
      return;
    }

    if (lngNum < -180 || lngNum > 180) {
      alert("Longitude must be between -180 and 180");
      return;
    }

    onLocationChange({ lat: latNum, lng: lngNum });
  };

  return (
    <div className="glass-morphism p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">📍 Your Location</h2>

      {isLoading ? (
        <p className="text-gray-300">🔍 Detecting your location...</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-4 items-end"
        >
          <div>
            <label htmlFor="lat" className="block text-sm font-medium mb-2">
              Latitude
            </label>
            <input
              id="lat"
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="px-3 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#a8b5ff")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)")
              }
              placeholder="40.7128"
              required
            />
          </div>

          <div>
            <label htmlFor="lng" className="block text-sm font-medium mb-2">
              Longitude
            </label>
            <input
              id="lng"
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="px-3 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#a8b5ff")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)")
              }
              placeholder="-74.0060"
              required
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 font-semibold rounded-lg transition-colors"
            style={{ backgroundColor: "#a8b5ff", color: "#0f0f23" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#93c5fd")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#a8b5ff")
            }
          >
            Update Location
          </button>
        </form>
      )}

      {location && (
        <p className="mt-4 text-sm text-gray-300">
          Current location: {location.lat.toFixed(4)}°,{" "}
          {location.lng.toFixed(4)}°
        </p>
      )}
    </div>
  );
}
