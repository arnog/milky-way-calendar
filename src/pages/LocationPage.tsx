import { useEffect, useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import TonightCard from '../components/TonightCard'
import Calendar from '../components/Calendar'
import { Location } from '../types/astronomy'
import { slugToLocation, generateLocationTitle, generateLocationDescription, locationToSlug } from '../utils/urlHelpers'
import { findNearestSpecialLocation } from '../utils/locationParser'

interface LocationPageProps {
  isDarkroomMode: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LocationPage({ isDarkroomMode: _isDarkroomMode }: LocationPageProps) {
  const { locationSlug } = useParams<{ locationSlug: string }>()
  const navigate = useNavigate()
  const [location, setLocation] = useState<Location | null>(null)
  const [isInvalidLocation, setIsInvalidLocation] = useState(false)

  useEffect(() => {
    if (!locationSlug) {
      setIsInvalidLocation(true)
      return
    }

    const parsedLocation = slugToLocation(locationSlug)
    if (parsedLocation) {
      setLocation(parsedLocation)
      setIsInvalidLocation(false)
      
      // Try to find if this location matches a special location for display name
      let matchedName = null
      if (!locationSlug.startsWith('@')) {
        // For named location slugs, try to find the proper display name
        const nearbyLocation = findNearestSpecialLocation(parsedLocation, 1) // Very small threshold for exact matches
        if (nearbyLocation) {
          matchedName = nearbyLocation.matchedName
        }
      }
      
      // Save to localStorage for future visits
      localStorage.setItem(
        "milkyway-location",
        JSON.stringify({
          location: parsedLocation,
          matchedName: matchedName,
        })
      )
    } else {
      setIsInvalidLocation(true)
    }
  }, [locationSlug])

  // Redirect to home if invalid location
  if (isInvalidLocation) {
    return <Navigate to="/" replace />
  }

  // Show loading while location is being parsed
  if (!location) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-white/70">Loading location...</div>
          </div>
        </div>
      </div>
    )
  }

  // Handle location changes and update URL
  const handleLocationChange = (newLocation: Location) => {
    setLocation(newLocation)
    
    // Try to find matched name for the new location
    const nearbyLocation = findNearestSpecialLocation(newLocation, 100)
    const matchedName = nearbyLocation ? nearbyLocation.matchedName : null
    
    // Update localStorage
    localStorage.setItem(
      "milkyway-location",
      JSON.stringify({
        location: newLocation,
        matchedName: matchedName,
      })
    )
    
    const slug = locationToSlug(newLocation)
    navigate(`/location/${slug}`, { replace: true })
  }

  const pageTitle = generateLocationTitle(location)
  const pageDescription = generateLocationDescription(location)

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>
      
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <TonightCard location={location} onLocationChange={handleLocationChange} />
          <Calendar location={location} />
        </div>
      </div>
    </>
  )
}

export default LocationPage