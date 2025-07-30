import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  isDarkroomMode: boolean;
  onToggleDarkroomMode: () => void;
}

export default function Header({
  isDarkroomMode,
  onToggleDarkroomMode,
}: HeaderProps) {
  const location = useLocation();

  return (
    <header className="glass-morphism p-6 mb-8">
      <div className="text-center mb-6">
        <Link to="/" className="inline-block">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-2 hover:text-blue-200 transition-colors">
            Milky Way Calendar
          </h1>
        </Link>
        <p className="text-lg md:text-2xl lg:text-3xl text-blue-200">
          Discover the best times to observe the Milky Way throughout the year
        </p>
      </div>

      <div className="relative">
        <nav className="flex justify-center items-center gap-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-12">
            <Link
              to="/"
              className={`text-3xl md:text-4xl transition-colors hover:text-blue-200 ${
                location.pathname === "/" ||
                location.pathname.startsWith("/location")
                  ? "text-white font-semibold"
                  : "text-blue-200"
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`text-3xl md:text-4xl transition-colors hover:text-blue-200 ${
                location.pathname === "/explore"
                  ? "text-white font-semibold"
                  : "text-blue-200"
              }`}
            >
              Explore
            </Link>
            <Link
              to="/faq"
              className={`text-3xl md:text-4xl transition-colors hover:text-blue-200 ${
                location.pathname === "/faq"
                  ? "text-white font-semibold"
                  : "text-blue-200"
              }`}
            >
              FAQ
            </Link>
          </div>
        </nav>

        <button
          onClick={onToggleDarkroomMode}
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center px-3 md:px-4 py-2 rounded-lg border transition-colors text-sm md:text-base ${
            isDarkroomMode
              ? "bg-red-900/50 border-red-500 text-red-400"
              : "bg-white/10 border-white/30 text-white hover:bg-white/20"
          }`}
          title={
            isDarkroomMode ? "Switch to Dark Mode" : "Switch to Field Mode"
          }
        >
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
          {isDarkroomMode ? "Field" : "Dark"}
        </button>
      </div>
    </header>
  );
}
