import { useState, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "./components/Header";
import TonightCard from "./components/TonightCard";
import DailyVisibilityTable from "./components/DailyVisibilityTable";
import Calendar from "./components/Calendar";
import LocationPage from "./pages/LocationPage";
import { LocationProvider } from "./contexts/LocationContext";
import LocationErrorBoundary from "./components/LocationErrorBoundary";
import { useDateFromQuery } from "./hooks/useDateFromQuery";
import styles from "./App.module.css";

// Lazy load pages that are not needed for initial home page experience
const ExplorePage = lazy(() => import("./pages/ExplorePage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));

// Loading component for code splitting
function PageLoader() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    </div>
  );
}

interface HomePageProps {
  isDarkroomMode: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function HomePage({ isDarkroomMode: _isDarkroomMode }: HomePageProps) {
  const [currentDate, setCurrentDate] = useDateFromQuery();

  return (
    <>
      <Helmet>
        <title>Milky Way Calendar - Optimal Viewing Conditions</title>
        <meta
          name="description"
          content="Find the best times to photograph the Milky Way throughout the year. Real astronomical calculations showing Galactic Core position, moon phases, and darkness windows for any location worldwide."
        />
        <meta
          property="og:title"
          content="Milky Way Calendar - Optimal Viewing Conditions"
        />
        <meta
          property="og:description"
          content="Find the best times to photograph the Milky Way throughout the year. Real astronomical calculations showing Galactic Core position, moon phases, and darkness windows for any location worldwide."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Milky Way Calendar - Optimal Viewing Conditions"
        />
        <meta
          name="twitter:description"
          content="Find the best times to photograph the Milky Way throughout the year. Real astronomical calculations showing Galactic Core position, moon phases, and darkness windows for any location worldwide."
        />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
          <TonightCard
            currentDate={currentDate}
          />
          <DailyVisibilityTable currentDate={currentDate} />
          <Calendar 
            currentDate={currentDate}
            onDateClick={setCurrentDate}
          />
        </div>
      </div>
    </>
  );
}

function App() {
  const [isDarkroomMode, setIsDarkroomMode] = useState(false);

  return (
    <div className={isDarkroomMode ? "darkroom-mode" : ""}>
      <Header
        isDarkroomMode={isDarkroomMode}
        onToggleDarkroomMode={() => setIsDarkroomMode(!isDarkroomMode)}
      />
      <Routes>
        <Route
          path="/"
          element={
            <LocationProvider>
              <LocationErrorBoundary>
                <HomePage isDarkroomMode={isDarkroomMode} />
              </LocationErrorBoundary>
            </LocationProvider>
          }
        />
        <Route
          path="/location/:locationSlug"
          element={<LocationPage isDarkroomMode={isDarkroomMode} />}
        />
        <Route
          path="/explore"
          element={
            <LocationProvider>
              <Suspense fallback={<PageLoader />}>
                <ExplorePage isDarkroomMode={isDarkroomMode} />
              </Suspense>
            </LocationProvider>
          }
        />
        <Route 
          path="/faq" 
          element={
            <Suspense fallback={<PageLoader />}>
              <FAQPage />
            </Suspense>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
