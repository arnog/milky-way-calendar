interface HeaderProps {
  isDarkroomMode: boolean
  onToggleDarkroomMode: () => void
}

export default function Header({ isDarkroomMode, onToggleDarkroomMode }: HeaderProps) {
  return (
    <header className="glass-morphism p-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#a8b5ff' }}>
            🌌 Milky Way Calendar
          </h1>
          <p className="text-gray-300">
            Discover the best times to observe the Milky Way throughout the year
          </p>
        </div>
        
        <button
          onClick={onToggleDarkroomMode}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            isDarkroomMode 
              ? 'bg-red-900/50 border-red-500 text-red-400' 
              : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
          }`}
        >
          {isDarkroomMode ? '🔴 Darkroom Mode' : '⚪ Normal Mode'}
        </button>
      </div>
    </header>
  )
}