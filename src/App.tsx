import { useState, useEffect } from 'react'
import Header from './components/Header'
import TonightCard from './components/TonightCard'
import Calendar from './components/Calendar'
import { Location } from './types/astronomy'
import { findNearestSpecialLocation } from './utils/locationParser'

function App() {
  const [location, setLocation] = useState<Location | null>(null)
  const [isDarkroomMode, setIsDarkroomMode] = useState(false)

  // Initialize location from localStorage or geolocation
  useEffect(() => {
    const savedLocation = localStorage.getItem("milkyway-location");
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        if (parsed.location?.lat && parsed.location?.lng) {
          setLocation(parsed.location);
          return;
        }
      } catch (e) {
        // Invalid saved data, fall through to geolocation
      }
    }

    // Get current location if no saved location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Check if near a special location
          const nearbyLocation = findNearestSpecialLocation(newLocation);
          if (nearbyLocation) {
            setLocation(nearbyLocation.location);
            localStorage.setItem(
              "milkyway-location",
              JSON.stringify({
                location: nearbyLocation.location,
                matchedName: nearbyLocation.matchedName,
              })
            );
          } else {
            setLocation(newLocation);
            localStorage.setItem(
              "milkyway-location",
              JSON.stringify({
                location: newLocation,
                matchedName: null,
              })
            );
          }
        },
        () => {
          // Default to LA if geolocation fails
          const defaultLocation = { lat: 34.0549, lng: -118.2426 };
          setLocation(defaultLocation);
          localStorage.setItem(
            "milkyway-location",
            JSON.stringify({
              location: defaultLocation,
              matchedName: "LA",
            })
          );
        }
      );
    }
  }, []);

  return (
    <div className={`min-h-screen p-4 ${isDarkroomMode ? 'darkroom-mode' : ''}`}>
      <div className="max-w-6xl mx-auto">
        <Header 
          isDarkroomMode={isDarkroomMode}
          onToggleDarkroomMode={() => setIsDarkroomMode(!isDarkroomMode)}
        />
        
        {location && (
          <>
            <TonightCard location={location} onLocationChange={setLocation} />
            <Calendar location={location} />
          </>
        )}
      </div>
    </div>
  )
}

export default App