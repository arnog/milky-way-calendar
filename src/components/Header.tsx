import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  isDarkroomMode: boolean;
  onToggleDarkroomMode: () => void;
}

export default function Header({
  isDarkroomMode,
  onToggleDarkroomMode,
}: HeaderProps) {
  const location = useLocation();
  const isExplorePage = location.pathname === '/explore';

  return (
    <header className="glass-morphism p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div className="flex-1">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-2 hover:text-blue-200 transition-colors">
              Milky Way Calendar
            </h1>
          </Link>
          <p className="text-lg md:text-2xl lg:text-3xl text-blue-200">
            Discover the best times to observe the Milky Way throughout the year
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {isExplorePage ? (
            <Link
              to="/"
              className="px-3 md:px-4 py-2 rounded-lg border bg-white/10 border-white/30 text-white hover:bg-white/20 transition-colors text-sm md:text-base"
            >
              Back to Calendar
            </Link>
          ) : (
            <Link
              to="/explore"
              className="px-3 md:px-4 py-2 rounded-lg border bg-white/10 border-white/30 text-white hover:bg-white/20 transition-colors text-sm md:text-base"
            >
              Explore Locations
            </Link>
          )}
          
          <button
            onClick={onToggleDarkroomMode}
            className={`px-3 md:px-4 py-2 rounded-lg border transition-colors text-sm md:text-base ${
              isDarkroomMode
                ? "bg-red-900/50 border-red-500 text-red-400"
                : "bg-white/10 border-white/30 text-white hover:bg-white/20"
            }`}
          >
            {isDarkroomMode ? "Darkroom" : "Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}
