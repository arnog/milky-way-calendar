# CLAUDE.md

## Project Overview

Milky Way Calendar is a React/TypeScript SPA that displays optimal Milky Way
viewing conditions throughout the year. The app shows a weekly calendar with
visibility ratings based on astronomical calculations including Galactic Core
altitude, moon phase/illumination, and darkness windows.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Development server
npm run build        # Production build
npm run lint         # Code linting
npm run preview      # Preview production build
npm run generate-sitemap  # Generate XML sitemap for SEO
npm test             # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:run     # Run tests once (non-watch mode)
```

## Key Features Implemented

- **Weekly calendar table** showing Milky Way visibility ratings (1-4 stars)
- **Tonight card** with detailed astronomical events for current night
- **Date navigation** via URL query parameters (`?date=YYYY-MM-DD`) allowing
  users to view astronomical data for any date
- **Clickable calendar rows** that navigate to specific dates for detailed
  viewing
- **Dark site suggestions** for locations with poor Bortle ratings (4+),
  automatically finding and suggesting nearby dark sky locations within 500km
- **Coordinate preservation system** that maintains exact user-entered
  coordinates while providing helpful location context through nearest known
  location suggestions
- **Interactive location selection** via clickable popover with world map
  integration
- **Real astronomical calculations** using astronomy-engine library for
  consistent, accurate results
- **Timezone-aware time display** - all times shown in location's local timezone
- **Enhanced typography** - time displays with raised colons for improved
  readability
- **SVG icon system** with custom tooltips for better UX
- **Glassmorphism UI** with starry sky background and responsive design
- **Location parsing** supporting coordinates, city names, and special astronomy
  locations
- **Explore page** (`/explore`) showcasing world's best dark sky sites with
  interactive map and independent location management
- **FAQ page** (`/faq`) with comprehensive Milky Way information and
  astrophotography guidance
- **Centered navigation bar** with Home, Explore, and FAQ sections
- **Dark/Field mode toggle** positioned at far right of navigation for optimal
  field use
- **SEO optimization** with comprehensive XML sitemap and robots.txt for search
  engine discoverability

## Project Structure

- `src/components/` - React components (AstronomicalDataTable, DailyAstroTable,
  WeeklyAstroTable, TonightCard, LocationPopover, WorldMap, StarRating) with
  corresponding `.module.css` files
- `src/pages/` - Page components (HomePage, LocationPage, ExplorePage, FAQPage)
- `src/hooks/` - Custom React hooks (`useDateFromQuery` for URL date state
  management, `useLocation` for home location, `useExploreLocation` for explore
  page, `useAstronomicalData` for unified daily/weekly data loading)
- `src/utils/` - Utility functions for astronomical calculations and location
  parsing
- `src/types/` - TypeScript type definitions (includes
  `astronomicalDataTable.ts` for unified table component interfaces)
- `src/styles/` - CSS styling with global utilities (`global.css`) and modular
  component styles
- `src/test/` - Comprehensive unit test suite (109 tests across 8 files)
- `public/icons.svg` - SVG sprite with custom icons (stars, sun/moon rise/set,
  transit)
- `public/world2024B-lg-grayscale.png` - Optimized grayscale light pollution map
  (2.25MB, 9.1% smaller than RGB version)
- `public/world2024B-*.{webp,jpg,png}` - Legacy light pollution maps in multiple
  resolutions
- `public/sitemap.xml` - XML sitemap for search engine optimization
- `public/robots.txt` - Search engine crawler instructions
- `scripts/generate-sitemap.js` - Dynamic sitemap generation script

## Astronomical Calculations

The app uses astronomy-engine exclusively for all astronomical calculations to
ensure consistency and accuracy:

- **Galactic Core Position**: Precise altitude/azimuth calculations using
  astronomy-engine
- **Moon Data**: Phase, illumination, rise/set times, and position using
  astronomy-engine
- **Sun & Twilight Times**: Sunrise/sunset and astronomical twilight
  calculations using astronomy-engine
- **Optimal Viewing Windows**: Time-integrated quality analysis providing
  realistic viewing periods based on hour-by-hour conditions
- **Visibility Rating**: 1-4 star system combining GC altitude, moon
  interference, and darkness duration
- **Timezone Conversion**: All times displayed in location's local timezone
  using proper IANA timezone lookup with `tz-lookup` library

## Location Management Architecture

The app implements a **dual-location system** that separates the home "Tonight"
location from the exploration location, providing optimal user experience:

### **Home Location System**

- **Purpose**: Used for Tonight card, calendar, and all `/location/` routes
- **Management**: `useLocation` hook with `LocationContext`
- **Storage**: `milkyway-home-location` in localStorage
- **Geolocation**: Automatic detection with retry logic and user-friendly error
  handling
- **Persistence**: Maintained across app sessions and page navigation

### **Explore Location System**

- **Purpose**: Independent location state for `/explore` page only
- **Management**: `useExploreLocation` hook (standalone)
- **Storage**: `milkyway-explore-location` in localStorage
- **Initialization**: Starts with home location on first visit if no explore
  location exists
- **Independence**: Changes only affect explore page, never impact home/calendar
  locations

### **User Experience Benefits**

- **Seamless exploration**: Users can browse different locations without losing
  their home base
- **Persistent exploration**: Returning to explore page preserves last explored
  location
- **Context preservation**: Home location remains stable for astronomy planning
- **Clean separation**: Independent location contexts prevent accidental
  interference

### **Storage Service Architecture**

- **Unified interface**: Single `storageService` handles both location types
- **Dedicated storage keys**: `milkyway-home-location` and
  `milkyway-explore-location`
- **Type safety**: Full TypeScript support with `StoredLocationData` interface
- **Error handling**: Graceful fallbacks for localStorage unavailability

## Astronomical Observation Notes

- **Optimal viewing** requires GC ≥10° above horizon during astronomical
  darkness
- **Moon interference**: Scaled penalty based on illumination percentage when
  moon is up
- **Timezone handling**: Critical for international users - times must be shown
  in observation location's timezone

## Technical Learnings

### Routing and Navigation

- **Route Structure**:
  - `/` - Home page with calendar for current/saved location
  - `/location/:locationSlug` - Location-specific calendar (supports both named
    locations and coordinates)
  - `/explore` - Interactive dark sky sites explorer
  - `/faq` - Comprehensive FAQ about the Milky Way galaxy
- **Location URLs**: Support both named locations (e.g.,
  `/location/yellowstone`) and coordinates (e.g., `/location/@44.6,-110.5`)
  state management

### Dark Sky Sites Explorer

- **Curated List**: Uses `DARK_SITES` constant containing prime stargazing
  locations worldwide
- **Interactive Map**: WorldMap component with blue markers for each dark sky
  site, hover tooltips, and click navigation

### FAQ System

- **Comprehensive Content**: 10 detailed questions covering galaxy basics,
  visibility, observation tips, and astrophotography
- **Educational Focus**: Covers Galactic Core location, seasonal visibility,
  light pollution effects, and photography techniques
- **Responsive Design**: Mobile-friendly layout with proper typography scaling
  and glassmorphism styling
- **SEO Optimized**: Proper meta tags and structured content for search engine
  discoverability

### High Latitude Handling

- **Galactic Core Visibility**: Automatically detects when GC is never visible
  (>60°N) and shows explanatory message
- **Astronomical Twilight**: Gracefully handles locations where sun never
  reaches -18° (white nights/polar summer)
- **UI Adaptation**: Hides empty calendar tables and irrelevant sections for
  high-latitude locations
- **Special Messages**: Shows location-specific messages for high latitudes and
  large cities with light pollution warnings

### Code Quality & Architecture

- **Single Source of Truth**: All astronomical calculations consolidated to use
  astronomy-engine exclusively
- **Consistent Moon Data**: All components use `calculateMoonData()` function
  for moon phase, illumination, and rise/set times
- **Proper Error Handling**: Robust fallbacks for edge cases like extreme
  latitudes and failed calculations
- **Modular Timezone Utils**: Created `src/utils/timezoneUtils.ts` with
  comprehensive timezone conversion functions. Use proper IANA timezone lookup
  using `tz-lookup` library

### Dark Sky Classification Threshold Optimization

- **Problem Identified**: After coordinate fix, legitimate dark sky locations
  like Joshua Tree National Park were not being found due to overly restrictive
  threshold
- **Root Cause Analysis**: `isDarkSky()` function only accepted Bortle ≤1.5, but
  real-world excellent dark sky areas read as Bortle 2.5-3.5 on the light
  pollution map
- **Debug Process**: Created visual debugging tools to analyze actual RGB values
  and Bortle classifications for Joshua Tree area:
  - Joshua Tree center: RGB(1, 37, 132) = Bortle 3.5
  - Surrounding pixels: RGB(35, 35, 35) = Bortle 2.5 (excellent for astronomy)
  - 82.3% of nearby pixels classified as good dark sky with new threshold
- **Threshold Update**: Changed from Bortle ≤1.5 to ≤3.0 based on astronomical
  standards:
  - Bortle 1-3 are considered excellent for Milky Way photography
  - Bortle 4+ represents suburban light pollution
- **Validation Results**: Joshua Tree area now correctly finds:
  - Primary dark site: 3.9km away (Bortle 3)
  - 5 alternative sites: 6-26km away (all Bortle 3)
  - Nearest known location: Sequoia National Park
- **Test Coverage**: Added comprehensive tests including real-world Joshua Tree
  validation and major city regression prevention
- **Files Updated**: `src/utils/lightPollutionMap.ts:isDarkSky()`, test files

### CSS Modules Implementation

- **Component-Scoped Styling**: Each component has its own `.module.css` file
  with locally scoped class names to prevent style conflicts
- **Global Utilities**: Shared styles consolidated in `src/styles/global.css`
  with `global-` prefixed class names for reusable patterns
- **Vite Configuration**: CSS Modules configured with camelCase conversion and
  scoped name generation for optimal development experience

### Testing & Quality Assurance

- **Comprehensive Test Suite**: 100+ unit tests across 7 test files covering all
  critical astronomy calculations, coordinate mapping, and dark site search
  accuracy
- **Test Framework**: Vitest with React Testing Library for fast, reliable
  testing
- **Coverage Areas**:
  - **Galactic Core calculations** (`galacticCenter.test.ts`) - Position,
    rise/set times, seasonal altitude thresholds, high latitude edge cases
  - **Moon calculations** (`moonCalculations.test.ts`) - Phase, illumination,
    interference factors, rise/set times
  - **Twilight calculations** (`twilightCalculations.test.ts`) -
    Civil/astronomical twilight, dark duration, day boundary handling
  - **Optimal viewing windows** (`optimalViewing.test.ts`) - Integration of GC
    visibility, darkness, and moon interference
  - **Visibility ratings** (`visibilityRating.test.ts`) - 1-4 star system based
    on viewing conditions, moon penalties, altitude rewards
  - **Coordinate mapping** (`coordinateMapping.test.ts`) - Light pollution map
    coordinate conversion, UI positioning, boundary handling, anti-regression
  - **Dark site search accuracy** (`darkSiteSearchAccuracy.test.ts`) - RGB to
    Bortle scale conversion, city classification, major city regression
    prevention, Joshua Tree area validation, dark sky threshold optimization
- **Critical Bug Prevention**: Comprehensive tests prevent regression of the
  major coordinate mapping bug that incorrectly classified cities as dark sky
  sites and ensure dark sky classification thresholds work correctly for
  real-world locations
- **Edge Case Testing**: High latitudes, extreme dates, timezone boundaries,
  calculation failures, map boundaries, coordinate system validation
- **Real Data Testing**: Uses actual astronomy-engine calculations with
  realistic locations and dates, tests major world cities
- **Continuous Integration**: All tests must pass before deployment
- **Performance**: Fast test execution (< 1 second) for rapid development
  feedback

### SEO & Search Engine Optimization

- **XML Sitemap Generation**: Automated sitemap creation with all static and
  dynamic location routes
- **Comprehensive URL Coverage**: 138 total URLs including static pages, dark
  sky sites, and major world cities
- **Search Engine Guidelines**: Proper robots.txt configuration with sitemap
  reference and crawler instructions
- **Dynamic Generation**: `scripts/generate-sitemap.js` automatically parses
  location data and generates XML sitemap
- **SEO-Friendly URLs**: Clean slug generation for all location pages using
  consistent naming conventions
- **Priority & Frequency**: Optimized sitemap attributes for different page
  types (static pages: priority 1.0, dark sites: 0.7, cities: 0.6)

## Current Status

✅ **Phase 27**: Astronomical Clock Visualization Implementation - Implemented
comprehensive 12-hour clock visualization in TonightCard showing astronomical
events as colored arcs and positioned labels around a clock face, created
SVG-based clock with time-to-angle conversion for timezone-aware positioning,
added sun arcs (orange twilight → dark night → yellow dawn), moon arc with
illumination-based opacity, and galactic center arcs (light blue visibility +
cyan optimal window), positioned event labels with icons and times around
perimeter with interactive tooltips, included current time indicator,
implemented responsive design with 420px optimized viewBox, fixed label
positioning by properly centering content within foreignObject containers using
flexbox, resolved tooltip clipping with overflow management and proper z-index,
and eliminated double tooltips by removing conflicting browser title attributes

✅ **Phase 28**: AstronomicalClock Refinements - Comprehensively enhanced the
astronomical clock with visual and functional improvements: changed night arc
color from pure black to dark blue (#1a2744) for better visibility, implemented
color-coded event labels matching their respective arc colors (orange/yellow for
sun events, silver for moon events, cyan/light blue for galactic center events),
added auto-refresh functionality updating clock position every 2 minutes,
extended clock hand beyond center to mimic traditional clock appearance,
increased clock size from 420px to 600px with proportional scaling of all
elements, added rounded caps to all arcs for professional appearance,
repositioned hour tick marks from between arcs to outside outer arc extending
inward, migrated time displays to use global data-time class with proper
typography, fixed opacity logic to show reduced opacity for events before 6pm
same day or after 6am next day, improved icon and time sizing with larger icons
and tighter spacing in square layouts, and added moon phase icon with
illumination percentage display in the clock center for enhanced astronomical
context

✅ **Phase 29**: AstronomicalClock Production Enhancement - Completed
comprehensive production readiness improvements: implemented centralized
TypeScript type system with `src/types/astronomicalClock.ts` containing all
clock interfaces and EventType string union conversion for better tree-shaking,
created configuration management system with `src/config/clockConfig.ts`
centralizing all constants and magic numbers with helper functions, added
complete WCAG accessibility compliance including ARIA labels, keyboard
navigation, screen reader support, and focus management, implemented
bidirectional interactive highlighting system where event labels highlight
corresponding arcs and vice versa with smooth transitions and visual feedback,
enhanced touch-friendly design with adaptive sizing for mobile devices (44px+
touch targets), device detection, and optimized gesture handling, created
intelligent event consolidation system that automatically combines same-time
events into multi-icon labels, developed robust layered collision detection
algorithm preventing label overlaps with progressive layer assignment and
configurable thresholds, added enhanced typography with raised colons in time
displays and centralized CSS variable color system, simplified hour marker logic
using data-driven configuration approach, and ensured production-ready code
quality with comprehensive testing and TypeScript strict mode compliance

✅ **Phase 30**: Enhanced Location UX Implementation - Completely overhauled
location selection and error handling to provide seamless user experience:
replaced silent Death Valley fallback with intuitive LocationPopover interface,
implemented smart error differentiation between permission denied (Code 1) and
technical issues (Code 2: dormant location services, Code 3: timeouts), enhanced
LocationPopover with 3-attempt retry logic using adaptive timeouts (10-20
seconds) and progressive positioning methods (network → GPS), added detailed
user feedback with loading states, retry counters, and helpful error messages
including "wake up Maps app" guidance for dormant location services, implemented
manual location bypass during initial loading with "Choose Manually" button,
auto-opening LocationPopover on geolocation failure to eliminate intermediate
error panels, centralized default location configuration in appConfig.ts with
reusable utility functions, and streamlined UI by hiding calendar and weekly
panels when location unavailable to prevent redundant loading messages, creating
a polished location experience that handles edge cases gracefully and guides
users toward solutions

✅ **Phase 31**: Light Pollution Map Optimization - Implemented comprehensive
performance optimization by converting RGB light pollution map to optimized
grayscale format: analyzed current 2.47MB RGB map with only 15 unique colors and
determined single-channel grayscale would be more efficient, created exact
RGB-to-Bortle-to-grayscale mapping preserving 100% calculation accuracy using
direct lookup table with 16 discrete values (0, 10, 20, 30, 40, 50, 70, 90, 110,
130, 150, 170, 190, 210, 230, 240), updated `lightPollutionMap.ts` with new
`grayscaleToBortleScale()` and `getGrayscalePixelData()` functions while
maintaining backward compatibility, updated `darkSiteWorker.js` to use optimized
grayscale processing throughout, replaced image file with compressed 2.25MB
grayscale version achieving 9.1% file size reduction, eliminated runtime
RGB-to-Bortle conversion overhead for significant CPU performance gains, and
verified implementation with all 130 tests passing, resulting in faster
downloads, reduced memory usage, and improved processing performance while
maintaining perfect accuracy for all dark sky calculations

✅ **Phase 32**: Unified Cache API Implementation - Implemented comprehensive
caching architecture unifying image storage across WorldMap component and
darkSiteWorker: created centralized `MapImageCacheService` managing both
grayscale (Bortle calculations) and color (visual display) map images with
automatic format selection based on screen size and WebP support, implemented
shared Cache API storage with 7-day expiration and intelligent cache-first
loading strategies, added memory management with object URL cleanup to prevent
memory leaks, enhanced WorldMap component with cached image loading and
debounced resize handling, updated darkSiteWorker to use unified cache
configuration while maintaining backward compatibility, eliminated duplicate
caching code between components, added comprehensive test coverage (12 new
tests) validating cache behavior, format selection, and error handling, and
achieved seamless image sharing between main thread and worker context with
consistent performance optimization across all map-related functionality

✅ **Phase 33**: Astronomical Data Table Component Consolidation - Implemented
comprehensive consolidation of DailyVisibilityTable and Calendar components into
a unified architecture: created configurable `AstronomicalDataTable` component
supporting both daily and weekly modes through configuration, developed shared
`useAstronomicalData` hook with unified data loading for both time scales,
implemented comprehensive TypeScript interfaces (`AstronomicalDataTableConfig`,
`AstronomicalDataItem`, `UseAstronomicalDataResult`) for type-safe
configuration, consolidated CSS styling into single
`AstronomicalDataTable.module.css` with mode-specific variants, eliminated code
duplication while preserving all existing functionality including expandable
details, infinite scroll, and navigation, removed unnecessary loading states
since astronomical computations are fast (< 100ms), cleaned up unused CSS
classes reducing bundle size, renamed components for consistency and clarity
(`Calendar` → `WeeklyAstroTable`, `DailyVisibilityTable` → `DailyAstroTable`),
and achieved single source of truth for table logic with improved
maintainability through configuration-driven approach

✅ **Phase 34**: WorldMap Component Refactoring - Successfully refactored the
635-line monolithic WorldMap component into a modular, maintainable architecture
achieving 66% size reduction (now ~215 lines): extracted reusable hooks
(`useMapState` for zoom/pan state management with constraint logic,
`useMapGestures` for unified mouse/touch event handling), decomposed into
focused components (`ZoomControls`, `MapImage`, `LocationMarker`,
`AdditionalMarkers`), created comprehensive utilities (`MapCoordinateSystem`
class for coordinate transformations, `performance.ts` with monitoring and
optimization tools), centralized configuration in `mapConfig.ts` eliminating all
magic numbers, implemented performance optimizations including React.memo
memoization throughout components, throttled high-frequency events (zoom wheel
at 60fps), intelligent marker culling for off-screen elements, debounced window
resize handling, and fixed the zoom rendering delay issue using React's
`flushSync` combined with CSS transition management (disabling transitions
during zoom operations) to ensure map and markers update synchronously,
resulting in smooth, performant map interactions with proper TypeScript typing
and clean code organization

**Current state**: Feature-complete astronomy calendar with fully migrated
time-integrated astronomical calculations, comprehensive date navigation via URL
parameters allowing users to explore any date, sophisticated coordinate
preservation system that maintains exact user locations while providing helpful
context, automatic dark site suggestions for light-polluted locations, **robust
and intuitive location selection system with smart error handling, retry logic,
and user-friendly guidance that eliminates confusion and provides clear paths
forward when geolocation fails**, **optimized light pollution map processing
with 9.1% file size reduction and eliminated runtime conversion overhead while
maintaining perfect accuracy**, **unified Cache API implementation sharing map
images between WorldMap component and darkSiteWorker with automatic format
selection, intelligent caching strategies, and memory management**,
**consolidated astronomical data table architecture with unified
AstronomicalDataTable component supporting both daily and weekly modes through
configuration, eliminating code duplication while maintaining all
functionality**, **modular and performant WorldMap component with 66% size
reduction, comprehensive performance utilities, and synchronized zoom/pan
operations eliminating visual delays**, accurate timezone handling for international users, proper
high-latitude handling, comprehensive dark sky site discovery with corrected
coordinate mapping and optimal classification thresholds, educational FAQ system
with modern navigation and anchor linking, full SEO optimization for search
engine discoverability, robust test coverage (142 tests) ensuring calculation
accuracy and preventing critical regressions, modern CSS Modules architecture
for scalable styling, centralized color theming with CSS variables, enhanced
typography with raised colons for optimal time readability, unified
time-integrated observation windows providing honest quality expectations across
all components, polished night-sky aesthetic with professional visual design and
complete astronomical event coverage, corrected moon phase display with accurate
waxing/waning determination, integrated Bortle rating display with educational
FAQ linking, custom tooltip system providing consistent styling and better
mobile support across all components, production-ready 12-hour astronomical
clock with comprehensive accessibility, bidirectional interactive highlighting,
touch-friendly design, intelligent event consolidation, and robust collision
detection ensuring perfect label positioning, and intelligent location guidance
for optimal Milky Way photography.

## Hosting

Deployed on CloudFlare Pages with Git integration.

### Deployment Process

The app is deployed using CloudFlare Pages with automatic Git integration:

1. **Make changes** to the codebase
2. **Commit changes** to Git:
   ```bash
   git add .
   git commit -m "Your commit message"
   ```
3. **Push to repository**:
   ```bash
   git push origin main
   ```
4. **CloudFlare automatically redeploys** when it detects new commits

### Build Configuration

- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Node.js version**: Latest LTS
- **Static assets**: Served from `public/` directory (includes `icons.svg`,
  `world-map.svg`, `sky-tile.jpg`, `milky-way-hero-3.jpg`)

### Coding Guidelines

Follow the guidlines in `CODING_GUIDELINES.md` for consistent code style and
best practices.

### UI Design System

See `DESIGN_SYSTEM.md` for the complete design system including color palette,
typography, and component styles.

For additional context, refer to HISTORY.md and CHANGELOG.md for detailed
history of changes and features.
