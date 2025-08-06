import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "./components/Header";
import TonightCard from "./components/TonightCard";
import DailyAstroTable from "./components/DailyAstroTable";
import WeeklyAstroTable from "./components/WeeklyAstroTable";
import LocationPage from "./pages/LocationPage";
import { LocationProvider } from "./contexts/LocationContext";
import { FieldModeProvider } from "./contexts/FieldModeContext";
import { useFieldMode } from "./hooks/useFieldMode";
import LocationErrorBoundary from "./components/LocationErrorBoundary";
import { useDateFromQuery } from "./hooks/useDateFromQuery";
import Spinner from "./components/Spinner";
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
          <Spinner size="xl" />
        </div>
      </div>
    </div>
  );
}

function HomePage() {
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

      <div className={styles.container} data-page="home">
        <div className={styles.content}>
          <TonightCard currentDate={currentDate} />
          <DailyAstroTable currentDate={currentDate} />
          <WeeklyAstroTable
            currentDate={currentDate}
            onDateClick={setCurrentDate}
          />
        </div>
      </div>
    </>
  );
}

function AppContent() {
  const { isFieldMode } = useFieldMode();

  return (
    <LocationProvider>
      <div className={isFieldMode ? "field-mode" : ""}>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <LocationErrorBoundary>
                <HomePage />
              </LocationErrorBoundary>
            }
          />
          <Route
            path="/location/:locationSlug"
            element={<LocationPage />}
          />
          <Route
            path="/explore"
            element={
              <Suspense fallback={<PageLoader />}>
                <ExplorePage />
              </Suspense>
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
    </LocationProvider>
  );
}

function App() {
  return (
    <FieldModeProvider>
      <AppContent />
    </FieldModeProvider>
  );
}

export default App;
