import { useEffect, useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import TonightCard from '../components/TonightCard'
import DailyVisibilityTable from '../components/DailyVisibilityTable'
import Calendar from '../components/Calendar'
import { Location } from '../types/astronomy'
import { slugToLocation, generateLocationTitle, generateLocationDescription, locationToSlug } from '../utils/urlHelpers'
import styles from '../App.module.css'
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
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={`global-flex-center ${styles.loadingContainer}`}>
            <div className={`global-text-lg ${styles.loadingText}`}>Loading location...</div>
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
      
      <div className={styles.container}>
        <div className={styles.content}>
          <TonightCard location={location} onLocationChange={handleLocationChange} />
          <DailyVisibilityTable location={location} />
          <Calendar location={location} />
        </div>
      </div>
    </>
  )
}

export default LocationPage