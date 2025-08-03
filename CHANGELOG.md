# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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

### Technical Improvements

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
