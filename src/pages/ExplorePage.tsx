import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import Header from '../components/Header'
import WorldMap from '../components/WorldMap'
import { Location } from '../types/astronomy'
import { DARK_SITES } from '../utils/locations'
import { locationNameToSlug } from '../utils/urlHelpers'

function ExplorePage() {
  const navigate = useNavigate()
  const [isDarkroomMode, setIsDarkroomMode] = useState(false)
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  const handleLocationClick = (location: { lat: number; lng: number; name: string }) => {
    const slug = locationNameToSlug(location.name)
    navigate(`/location/${slug}`)
  }

  const handleMapLocationChange = (location: Location) => {
    setSelectedLocation(location)
    
    // Find if this location is near a dark site
    for (const loc of DARK_SITES) {
      const specialLat = loc[2] as number
      const specialLng = loc[3] as number
      
      if (Math.abs(location.lat - specialLat) < 2 && 
          Math.abs(location.lng - specialLng) < 2) {
        const slug = locationNameToSlug(loc[1] as string)
        navigate(`/location/${slug}`)
        return
      }
    }
    
    // Navigate to coordinate-based location
    navigate(`/location/@${location.lat.toFixed(4)},${location.lng.toFixed(4)}`)
  }

  // Group locations by region for better organization
  const groupedLocations = {
    'Western USA': [] as typeof DARK_SITES,
    'Central USA': [] as typeof DARK_SITES,
    'Eastern USA': [] as typeof DARK_SITES,
    'Canada': [] as typeof DARK_SITES,
    'South America': [] as typeof DARK_SITES,
    'Europe': [] as typeof DARK_SITES,
    'Africa & Middle East': [] as typeof DARK_SITES,
    'Asia & Oceania': [] as typeof DARK_SITES,
  }

  // More detailed region detection based on coordinates
  DARK_SITES.forEach(loc => {
    const lat = loc[2] as number
    const lng = loc[3] as number
    const name = loc[0] as string
    
    // Check for specific cases first
    if (name.includes('Hawaii')) {
      groupedLocations['Western USA'].push(loc)
    } else if (name.includes('Alaska')) {
      groupedLocations['Western USA'].push(loc)
    } else if (name.includes('Canada')) {
      groupedLocations['Canada'].push(loc)
    } else if (name.includes('New Zealand') || name.includes(', NZ')) {
      groupedLocations['Asia & Oceania'].push(loc)
    } else if (name.includes('Japan')) {
      groupedLocations['Asia & Oceania'].push(loc)
    } else if (name.includes('Bolivia')) {
      groupedLocations['South America'].push(loc)
    } else if (name.includes('Namibia')) {
      groupedLocations['Africa & Middle East'].push(loc)
    } else if (name.includes('Israel')) {
      groupedLocations['Africa & Middle East'].push(loc)
    } else if (name.includes('Canary Islands')) {
      groupedLocations['Africa & Middle East'].push(loc)
    } else if (lng >= -130 && lng <= -60 && lat >= 25 && lat <= 70) {
      // Continental USA subdivision
      if (lng <= -100) {
        // West of 100°W (roughly Mountain/Pacific time zones)
        groupedLocations['Western USA'].push(loc)
      } else if (lng <= -85) {
        // Between 100°W and 85°W (roughly Central time zone)
        groupedLocations['Central USA'].push(loc)
      } else {
        // East of 85°W (roughly Eastern time zone)
        groupedLocations['Eastern USA'].push(loc)
      }
    } else if (lng >= -30 && lng <= 60 && lat >= 35) {
      // Europe
      groupedLocations['Europe'].push(loc)
    } else {
      // Default to Asia & Oceania for anything else
      groupedLocations['Asia & Oceania'].push(loc)
    }
  })

  return (
    <>
      <Helmet>
        <title>Explore Dark Sky Sites - Milky Way Calendar</title>
        <meta name="description" content="Explore the best dark sky sites and national parks around the world for Milky Way viewing. Find pristine locations for astrophotography with our interactive map." />
        <meta property="og:title" content="Explore Dark Sky Sites - Milky Way Calendar" />
        <meta property="og:description" content="Explore the best dark sky sites and national parks around the world for Milky Way viewing. Find pristine locations for astrophotography with our interactive map." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Explore Dark Sky Sites - Milky Way Calendar" />
        <meta name="twitter:description" content="Explore the best dark sky sites and national parks around the world for Milky Way viewing. Find pristine locations for astrophotography with our interactive map." />
      </Helmet>
      
      <div className={`min-h-screen p-4 ${isDarkroomMode ? 'darkroom-mode' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <Header 
            isDarkroomMode={isDarkroomMode}
            onToggleDarkroomMode={() => setIsDarkroomMode(!isDarkroomMode)}
          />
          
          <div className="mt-8">
            <h1 className="text-3xl font-bold text-white mb-2">Explore Dark Sky Sites</h1>
            <p className="text-white/70 mb-8">
              Discover the world's best dark sky parks, reserves, and national parks for Milky Way viewing. Click on any location to view detailed visibility conditions throughout the year.
            </p>

            {/* Interactive World Map */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-white mb-4">Interactive Map</h2>
              <div className="relative">
                <WorldMap
                  location={selectedLocation}
                  onLocationChange={handleMapLocationChange}
                />
                {/* Overlay markers for dark sites */}
                <svg 
                  viewBox="0 0 2754 1398" 
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ aspectRatio: "2754 / 1398" }}
                >
                  {DARK_SITES.map((loc, idx) => {
                    const fullName = loc[0] as string
                    const shortName = loc[1] as string
                    const lat = loc[2] as number
                    const lng = loc[3] as number
                    const x = ((lng + 180) * 2754) / 360
                    const y = ((90 - lat) * 1398) / 180
                    
                    return (
                      <g key={idx} className="pointer-events-auto">
                        <circle
                          cx={x}
                          cy={y}
                          r="20"
                          fill="#60a5fa"
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="cursor-pointer hover:fill-[#93c5fd] transition-colors"
                          onMouseEnter={() => setHoveredLocation(fullName)}
                          onMouseLeave={() => setHoveredLocation(null)}
                          onClick={() => handleLocationClick({ lat, lng, name: shortName })}
                        />
                        {hoveredLocation === fullName && (
                          <g>
                            <rect
                              x={x - 100}
                              y={y - 40}
                              width="200"
                              height="30"
                              fill="rgba(0, 0, 0, 0.8)"
                              stroke="white"
                              strokeWidth="1"
                              rx="4"
                            />
                            <text
                              x={x}
                              y={y - 20}
                              fill="white"
                              fontSize="14"
                              textAnchor="middle"
                              className="pointer-events-none"
                            >
                              {fullName}
                            </text>
                          </g>
                        )}
                      </g>
                    )
                  })}
                </svg>
              </div>
              <p className="text-sm text-white/50 mt-2">
                Click anywhere on the map to explore, or select a dark sky site marked in blue.
              </p>
            </div>

            {/* Dark Sites List by Region */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Dark Sky Sites by Region</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(groupedLocations).map(([region, locations]) => {
                  if (locations.length === 0) return null
                  
                  return (
                    <div key={region} className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-3">{region}</h3>
                      <ul className="space-y-2">
                        {locations.map((loc, idx) => {
                          const fullName = loc[0] as string
                          const shortName = loc[1] as string
                          const lat = loc[2] as number
                          const lng = loc[3] as number
                          
                          return (
                            <li key={idx}>
                              <button
                                onClick={() => handleLocationClick({ lat, lng, name: shortName })}
                                className="text-blue-400 hover:text-blue-300 transition-colors text-left"
                              >
                                {fullName}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ExplorePage