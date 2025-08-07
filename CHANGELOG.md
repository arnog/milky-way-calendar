# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Mouse-cursor-centered zoom** functionality for WorldMap component ensuring
  zoom operations center on cursor position for intuitive interaction
- **RequestAnimationFrame batching** for wheel events providing smooth zoom
  operations and preventing frame drops
- **Dynamic image tier selection** with new xsmall tier (1800px) optimizing
  mobile device performance and reducing bandwidth usage
- **Image prefetching system** loading next zoom level in background for
  seamless zoom-in experience without visible loading delays
- **Enhanced Safari iOS support** with gesture event prevention and touch-action
  CSS optimizations for better mobile map interaction

- **Dual-location system** separating Home/Tonight location from Explore page
  location for independent location management without disrupting astronomy
  planning context
- **useExploreLocation hook** providing dedicated location state management for
  Explore page with automatic initialization from home location on first visit
- **Enhanced storage service** with separate localStorage keys for home
  (`milkyway-home-location`) and explore (`milkyway-explore-location`) locations
- **Find Me button improvement** showing actual user coordinates unless within
  5km of special locations (cities/dark sites), providing more accurate location
  display

- **Production-ready AstronomicalClock component** with comprehensive
  accessibility, interactive features, and robust collision handling
- **Centralized TypeScript type system** with `src/types/astronomicalClock.ts`
  containing complete interface definitions and EventType string union
- **Configuration management system** with `src/config/clockConfig.ts`
  centralizing all constants, thresholds, and styling parameters
- **WCAG accessibility compliance** including ARIA labels, keyboard navigation,
  screen reader support, and focus management
- **Bidirectional interactive highlighting** where event labels highlight
  corresponding arcs and vice versa with smooth visual feedback
- **Touch-friendly design** with adaptive sizing for mobile devices, 44px+ touch
  targets, and optimized gesture handling
- **Intelligent event consolidation** automatically combining same-time events
  into multi-icon labels (e.g., night start + optimal viewing)
- **Robust collision detection** with layered positioning algorithm preventing
  label overlaps using configurable thresholds and progressive layer assignment
- **12-hour astronomical clock visualization** in TonightCard displaying sun,
  moon, and Galactic Center events as colored arcs with interactive tooltips
- SVG-based clock with accurate time-to-angle positioning and current time
  indicator
- Interactive event labels around clock perimeter with educational tooltips
  explaining each astronomical event
- Colored arc system: orange/black/yellow for sun events, silver for moon
  (opacity based on illumination), light blue/cyan for Galactic Center
- URL query parameter support for date override (`?date=YYYY-MM-DD`) allowing
  users to view astronomical data for specific dates
- Clickable calendar rows that navigate to corresponding dates via URL
  parameters
- Dark site suggestions for locations with poor Bortle ratings (4+) showing
  nearest dark sky location within 500km
- Enhanced date navigation throughout the application with consistent state
  management
- Bortle scale rating display in Tonight card showing light pollution level for
  the current location
- Clickable Bortle rating link that navigates to the Bortle Scale explanation in
  FAQ
- Automatic scroll-to-anchor behavior for FAQ page when accessed with hash URLs
- ID anchors for FAQ articles to support direct linking to specific questions
- Nearest known location suggestions for coordinate-based locations showing
  nearby landmarks within 100km
- Coordinate preservation system that maintains exact user-entered coordinates
  while providing helpful location context
- Custom tooltips for star ratings replacing browser tooltips with consistent
  styling and better mobile support
- **Enhanced AstronomicalClock visualization** with comprehensive refinements:
  - Auto-refresh functionality updating clock position every 2 minutes
  - Increased clock size from 420px to 600px with proportional scaling
  - Moon phase icon and illumination percentage display in clock center
  - Color-coded event labels matching their respective arc colors
  - Rounded caps on all arcs for professional appearance
  - Repositioned hour tick marks from outside outer arc extending inward
  - Extended clock hand beyond center to mimic traditional clock appearance

### Fixed

- **Astronomical clock positioning errors** where events appeared at incorrect
  clock positions - solved complex time-to-angle mathematics
- **Label clipping issues** in clock visualization - optimized container sizing
  and viewBox dimensions
- **Content centering in SVG foreignObjects** - implemented proper flexbox
  alignment for icon+time labels
- **Tooltip clipping and conflicts** - fixed overflow handling and eliminated
  double tooltip issues from browser defaults
- Moon phase icons were reversed (waxing/waning phases were swapped) - fixed by
  changing the name of the icons to match the correct phases
- Moon phase calculation now properly determines waxing vs waning based on
  illumination change
- 93% illuminated moon now correctly displays as nearly full instead of as a
  crescent
- LocationPopover geolocation now shows nearby location names in input field
  while preserving exact coordinates
- Location descriptions now appear correctly for users near special locations
  using improved distance thresholds
- Star rating tooltip clipping issues in table views by adding proper padding to
  table containers
- **Event label collision detection** completely rewritten with robust layered
  positioning algorithm preventing overlaps and ensuring proper visual
  separation
- **Same-time event consolidation** now properly combines events occurring at
  identical times into single multi-icon labels
- **Over-aggressive collision detection** fixed by optimizing thresholds and
  improving spatial analysis for more natural label positioning
- **AstronomicalClock night arc color** changed from pure black to dark blue
  (#1a2744) for better visibility and contrast
- **Opacity logic for distant events** now correctly shows reduced opacity for
  events before 6pm same day or after 6am next day

### Changed

- All components (TonightCard, DailyVisibilityTable, Calendar) now support
  date-based navigation
- Calendar and DailyVisibilityTable now use improved time-integrated observation
  window calculations
- Date references throughout the app now respect the selected date instead of
  always using "today"
- Moon phase calculation algorithm now uses illumination percentage and previous
  day comparison to accurately determine lunar cycle phase
- FAQ page now includes smooth scrolling behavior when navigating to specific
  sections
- Location input behavior now preserves exact user coordinates instead of
  automatically switching to nearest special locations
- Geolocation and map interactions maintain precise user coordinates while
  finding nearby locations for descriptive context
- Star rating tooltips now use custom implementation matching the app's design
  system instead of browser tooltips
- **AstronomicalClock time displays** now use global `.data-time` class with
  proper typography (letter-spacing: 0.03em, font-variant-numeric: tabular-nums)
- **Event label sizing and spacing** improved with larger icons, tighter
  spacing, and square layout for better visual hierarchy
- **EventType from enum to string union** for better tree-shaking and modern
  TypeScript practices
- **Centralized configuration system** replacing magic numbers with configurable
  constants and helper functions
- **Enhanced typography system** with raised colons in time displays using
  precise CSS vertical alignment
- **CSS variable color system** centralizing all colors for consistent theming
  and maintainability
- **Touch device detection** with adaptive UI components optimizing for mobile
  vs desktop interaction patterns
- **AstronomicalClock arc colors** added to CSS variables system for consistent
  theming across sun, moon, and galactic center events

### Technical Improvements

- **Zoom centering algorithm** using analytic formula
  `panXAfter = (mouseRelX - 0.5) / newZoom - (before.x - 0.5)` for precise
  cursor-locked zoom operations
- **Simplified useMapState hook** eliminating complex constraint system in favor
  of centralized constraint application using `applyZoomPan()` function
- **Comprehensive test coverage** for zoom centering with round-trip coordinate
  validation ensuring mathematical accuracy
- **Performance optimizations** with memoized coordinate systems and marker
  position calculations

- **New Components**: AstronomicalClock, ClockTooltip with full TypeScript
  interfaces and CSS Modules styling
- **Utility Functions**: timeConversion.ts and arcCalculation.ts for precise
  astronomical mathematics
- **SVG Graphics**: Complex path generation for sun/moon/Galactic Center arcs
  with proper color gradients and opacity
- **Time Calculations**: Robust 12-hour time-to-angle conversion with day
  wraparound handling
- **Interactive Elements**: Touch/hover support for mobile and desktop tooltip
  interactions
- Created `useDateFromQuery` custom hook for centralized date state management
- Enhanced type safety with proper null checking for Bortle rating calculations
- Fixed ESLint warnings related to React Hook dependencies
- All components now properly update when date parameters change
- Improved location manager to separate coordinate preservation from location
  description lookup
- Added coordinate-based location suggestion system with distance calculation
  and visual styling
- Enhanced getSpecialLocationDescription function to support matched location
  names with generous distance thresholds
- Implemented custom tooltip system for StarRating component with React state
  management and event handling
- Fixed table container overflow issues preventing tooltip clipping in Daily and
  Calendar views
- **AstronomicalClock scalability improvements** with all radius calculations
  now scaling proportionally with clock size for responsive design
- **Enhanced CSS variables system** with dedicated astronomical arc colors:
  --sun-twilight, --sun-night, --sun-dawn, --moon-arc, --gc-visible,
  --gc-optimal
- **TypeScript improvements** with proper interface updates for moonPhase
  support and removal of unused variables to eliminate lint warnings
- **Architecture refactoring** with extracted event processing logic,
  centralized types, and configuration management for improved maintainability
- **Advanced collision detection** using greedy layer assignment algorithm with
  wrap-around handling and configurable separation thresholds
- **Accessibility architecture** with semantic ARIA markup, keyboard navigation,
  and screen reader optimization throughout the clock interface
- **Interactive feedback system** with bidirectional highlighting, hover states,
  focus management, and smooth visual transitions
- **Multi-icon rendering system** for consolidated events with flexible layout
  and proper spacing in compact containers
- **Touch optimization** with device detection, adaptive target sizing, and
  gesture threshold adjustments for mobile platforms
- **Performance optimization** with efficient auto-refresh using state-based
  updates instead of constant re-rendering

## [1.0.0] - Previous Release

### Features

- Weekly calendar table showing Milky Way visibility ratings (1-4 stars)
- Tonight card with detailed astronomical events for current night
- Interactive location selection via clickable popover with world map
  integration
- Real astronomical calculations using astronomy-engine library
- Timezone-aware time display in location's local timezone
- Enhanced typography with raised colons for improved readability
- SVG icon system with custom tooltips
- Glassmorphism UI with starry sky background
- Location parsing supporting coordinates, city names, and special astronomy
  locations
- Explore page showcasing world's best dark sky sites
- FAQ page with comprehensive Milky Way information
- Dark/Field mode toggle for astronomy field use
- SEO optimization with XML sitemap
- Time-integrated observation windows with quality analysis
