import { useAstronomicalData } from '../hooks/useAstronomicalData'
import { getMoonPhaseEmoji } from '../utils/moonCalculations'
import { getVisibilityBackground, getStarsDisplay, getVisibilityDescription } from '../utils/visibilityRating'
import { Location } from '../types/astronomy'

interface CalendarProps {
  location: Location
}

export default function Calendar({ location }: CalendarProps) {
  const { weekData, isLoading } = useAstronomicalData(location)
  const currentYear = new Date().getFullYear()

  if (isLoading) {
    return (
      <div className="glass-morphism p-6">
        <h2 className="text-2xl font-semibold mb-6">
          🗓️ {currentYear} Milky Way Visibility Calendar
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 mx-auto mb-4"
              style={{ border: '2px solid transparent', borderBottom: '2px solid #a8b5ff' }}
            ></div>
            <p className="text-gray-300">Calculating astronomical data...</p>
            <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-morphism p-6">
      <h2 className="text-2xl font-semibold mb-6">
        🗓️ {currentYear} Milky Way Visibility Calendar
      </h2>
      
      <div className="text-sm text-gray-300 mb-4">
        Location: {location.lat.toFixed(2)}°, {location.lng.toFixed(2)}°
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-3 px-2">Week</th>
              <th className="text-left py-3 px-2">Date</th>
              <th className="text-left py-3 px-2">Visibility</th>
              <th className="text-left py-3 px-2">Moon</th>
              <th className="text-left py-3 px-2">Optimal Start</th>
              <th className="text-left py-3 px-2">Duration</th>
              <th className="text-left py-3 px-2">Conditions</th>
            </tr>
          </thead>
          <tbody>
            {weekData.map((week) => (
              <tr
                key={week.weekNumber}
                className={`border-b border-white/10 ${getVisibilityBackground(week.visibility)} hover:bg-white/5 transition-colors`}
                title={getVisibilityDescription(week.visibility)}
              >
                <td className="py-3 px-2 font-medium">{week.weekNumber}</td>
                <td className="py-3 px-2">
                  {week.startDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </td>
                <td className="py-3 px-2 text-lg">
                  {getStarsDisplay(week.visibility)}
                </td>
                <td className="py-3 px-2 text-lg">
                  {getMoonPhaseEmoji(week.moonPhase)}
                </td>
                <td className="py-3 px-2 font-mono">
                  {week.gcTime}
                </td>
                <td className="py-3 px-2 font-mono">
                  {week.gcDuration}
                </td>
                <td className="py-3 px-2 text-xs">
                  {week.optimalConditions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 text-xs text-gray-400">
        <p className="mb-2">
          <strong>Visibility Rating:</strong> — None • ⭐ Poor • ⭐⭐ Fair • ⭐⭐⭐ Good • ⭐⭐⭐⭐ Excellent
        </p>
        <p className="mb-2">
          <strong>Optimal Start:</strong> When GC ≥10° above horizon + astronomical dark + moon ≤10% illumination
        </p>
        <p>
          <strong>Conditions:</strong> "Optimal" = all conditions met, "Moon interference" = bright moon present
        </p>
      </div>
    </div>
  )
}