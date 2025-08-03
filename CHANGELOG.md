# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- URL query parameter support for date override (`?date=YYYY-MM-DD`) allowing users to view astronomical data for specific dates
- Clickable calendar rows that navigate to corresponding dates via URL parameters
- Dark site suggestions for locations with poor Bortle ratings (4+) showing nearest dark sky location within 500km
- Enhanced date navigation throughout the application with consistent state management
- Bortle scale rating display in Tonight card showing light pollution level for the current location
- Clickable Bortle rating link that navigates to the Bortle Scale explanation in FAQ
- Automatic scroll-to-anchor behavior for FAQ page when accessed with hash URLs
- ID anchors for FAQ articles to support direct linking to specific questions
- Nearest known location suggestions for coordinate-based locations showing nearby landmarks within 100km
- Coordinate preservation system that maintains exact user-entered coordinates while providing helpful location context

### Fixed
- Moon phase icons were reversed (waxing/waning phases were swapped) - fixed by correcting the moon phase calculation algorithm instead of swapping SVG paths
- Moon phase calculation now properly determines waxing vs waning based on illumination change
- 93% illuminated moon now correctly displays as nearly full instead of as a crescent

### Changed
- All components (TonightCard, DailyVisibilityTable, Calendar) now support date-based navigation
- Calendar and DailyVisibilityTable now use improved time-integrated observation window calculations
- Date references throughout the app now respect the selected date instead of always using "today"
- Moon phase calculation algorithm now uses illumination percentage and previous day comparison to accurately determine lunar cycle phase
- FAQ page now includes smooth scrolling behavior when navigating to specific sections
- Location input behavior now preserves exact user coordinates instead of automatically switching to nearest special locations
- Geolocation and map interactions maintain precise user coordinates while finding nearby locations for descriptive context

### Technical Improvements
- Created `useDateFromQuery` custom hook for centralized date state management
- Enhanced type safety with proper null checking for Bortle rating calculations
- Fixed ESLint warnings related to React Hook dependencies
- All components now properly update when date parameters change
- Improved location manager to separate coordinate preservation from location description lookup
- Added coordinate-based location suggestion system with distance calculation and visual styling

## [1.0.0] - Previous Release

### Features
- Weekly calendar table showing Milky Way visibility ratings (1-4 stars)
- Tonight card with detailed astronomical events for current night
- Interactive location selection via clickable popover with world map integration
- Real astronomical calculations using astronomy-engine library
- Timezone-aware time display in location's local timezone
- Enhanced typography with raised colons for improved readability
- SVG icon system with custom tooltips
- Glassmorphism UI with starry sky background
- Location parsing supporting coordinates, city names, and special astronomy locations
- Explore page showcasing world's best dark sky sites
- FAQ page with comprehensive Milky Way information
- Dark/Field mode toggle for astronomy field use
- SEO optimization with XML sitemap
- Time-integrated observation windows with quality analysis