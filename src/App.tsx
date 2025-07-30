import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import Header from './components/Header'
import TonightCard from './components/TonightCard'
import Calendar from './components/Calendar'
import LocationPage from './pages/LocationPage'
import ExplorePage from './pages/ExplorePage'
import FAQPage from './pages/FAQPage'
import { Location } from './types/astronomy'
import { findNearestSpecialLocation } from './utils/locationParser'
import { locationToSlug } from './utils/urlHelpers'

interface HomePageProps {
  isDarkroomMode: boolean;
}

function HomePage({}: HomePageProps) {
  const [location, setLocation] = useState<Location | null>(null)
  const navigate = useNavigate()

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

  // Navigate to location URL when location changes
  const handleLocationChange = (newLocation: Location) => {
    setLocation(newLocation);
    
    // Try to find matched name for the new location
    const nearbyLocation = findNearestSpecialLocation(newLocation);
    const matchedName = nearbyLocation ? nearbyLocation.matchedName : null;
    
    // Update localStorage
    localStorage.setItem(
      "milkyway-location",
      JSON.stringify({
        location: newLocation,
        matchedName: matchedName,
      })
    );
    
    const slug = locationToSlug(newLocation);
    navigate(`/location/${slug}`, { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>Milky Way Calendar - Optimal Viewing Conditions</title>
        <meta name="description" content="Find the best times to photograph the Milky Way throughout the year. Real astronomical calculations showing Galactic Center position, moon phases, and darkness windows for any location worldwide." />
        <meta property="og:title" content="Milky Way Calendar - Optimal Viewing Conditions" />
        <meta property="og:description" content="Find the best times to photograph the Milky Way throughout the year. Real astronomical calculations showing Galactic Center position, moon phases, and darkness windows for any location worldwide." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Milky Way Calendar - Optimal Viewing Conditions" />
        <meta name="twitter:description" content="Find the best times to photograph the Milky Way throughout the year. Real astronomical calculations showing Galactic Center position, moon phases, and darkness windows for any location worldwide." />
      </Helmet>
      
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {location && (
            <>
              <TonightCard location={location} onLocationChange={handleLocationChange} />
              <Calendar location={location} />
            </>
          )}
        </div>
      </div>
    </>
  )
}

function App() {
  const [isDarkroomMode, setIsDarkroomMode] = useState(false)

  return (
    <div className={isDarkroomMode ? 'darkroom-mode' : ''}>
      <Header 
        isDarkroomMode={isDarkroomMode}
        onToggleDarkroomMode={() => setIsDarkroomMode(!isDarkroomMode)}
      />
      <Routes>
        <Route path="/" element={<HomePage isDarkroomMode={isDarkroomMode} />} />
        <Route path="/location/:locationSlug" element={<LocationPage isDarkroomMode={isDarkroomMode} />} />
        <Route path="/explore" element={<ExplorePage isDarkroomMode={isDarkroomMode} />} />
        <Route path="/faq" element={<FAQPage />} />
      </Routes>
    </div>
  )
}

export default App