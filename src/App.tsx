import { useState } from 'react'
import Header from './components/Header'
import LocationInput from './components/LocationInput'
import TonightCard from './components/TonightCard'
import Calendar from './components/Calendar'
import { Location } from './types/astronomy'

function App() {
  const [location, setLocation] = useState<Location | null>(null)
  const [isDarkroomMode, setIsDarkroomMode] = useState(false)

  return (
    <div className={`min-h-screen p-4 ${isDarkroomMode ? 'darkroom-mode' : ''}`}>
      <div className="max-w-6xl mx-auto">
        <Header 
          isDarkroomMode={isDarkroomMode}
          onToggleDarkroomMode={() => setIsDarkroomMode(!isDarkroomMode)}
        />
        
        <LocationInput 
          location={location}
          onLocationChange={setLocation}
        />
        
        {location && (
          <>
            <TonightCard location={location} />
            <Calendar location={location} />
          </>
        )}
      </div>
    </div>
  )
}

export default App