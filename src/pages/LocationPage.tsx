import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import TonightCard from '../components/TonightCard'
import DailyVisibilityTable from '../components/DailyVisibilityTable'
import Calendar from '../components/Calendar'
import { Location } from '../types/astronomy'
import { slugToLocation, generateLocationTitle, generateLocationDescription } from '../utils/urlHelpers'
import { useDateFromQuery } from '../hooks/useDateFromQuery'
import { LocationProvider } from '../contexts/LocationContext'
import { useLocation } from '../hooks/useLocation'
import { findNearestSpecialLocation } from '../utils/locationParser'
import { storageService } from '../services/storageService'
import styles from '../App.module.css'

interface LocationPageProps {
  isDarkroomMode: boolean;
}

// Wrapper component that parses URL and provides location to context
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LocationPageWrapper({ isDarkroomMode: _isDarkroomMode }: LocationPageProps) {
  const { locationSlug } = useParams<{ locationSlug: string }>()
  const [parsedLocation, setParsedLocation] = useState<Location | null>(null)
  const [isInvalidLocation, setIsInvalidLocation] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!locationSlug) {
      setIsInvalidLocation(true)
      setIsLoading(false)
      return
    }

    const location = slugToLocation(locationSlug)
    if (location) {
      setParsedLocation(location)
      setIsInvalidLocation(false)
      
      // Try to find if this location matches a special location for display name
      let matchedName = null
      if (!locationSlug.startsWith('@')) {
        // For named location slugs, try to find the proper display name
        const nearbyLocation = findNearestSpecialLocation(location, 1) // Very small threshold for exact matches
        if (nearbyLocation) {
          matchedName = nearbyLocation.matchedName
        }
      }
      
      // Save to storage for future visits
      storageService.setLocationData(location, matchedName)
    } else {
      setIsInvalidLocation(true)
    }
    setIsLoading(false)
  }, [locationSlug])

  // Redirect to home if invalid location
  if (isInvalidLocation) {
    return <Navigate to="/" replace />
  }

  // Show loading while location is being parsed
  if (isLoading || !parsedLocation) {
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

  return (
    <LocationProvider initialLocation={parsedLocation} skipGeolocaton={true}>
      <LocationPageContent />
    </LocationProvider>
  )
}

// The actual content component that uses the location context
function LocationPageContent() {
  const { location } = useLocation()
  const [currentDate, setCurrentDate] = useDateFromQuery()

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
          <TonightCard currentDate={currentDate} />
          <DailyVisibilityTable currentDate={currentDate} />
          <Calendar currentDate={currentDate} onDateClick={setCurrentDate} />
        </div>
      </div>
    </>
  )
}

export default LocationPageWrapper