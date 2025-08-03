# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Bortle scale rating display in Tonight card showing light pollution level for the current location
- Clickable Bortle rating link that navigates to the Bortle Scale explanation in FAQ
- Automatic scroll-to-anchor behavior for FAQ page when accessed with hash URLs
- ID anchors for FAQ articles to support direct linking to specific questions

### Fixed
- Moon phase icons were reversed (waxing/waning phases were swapped) - fixed by correcting the moon phase calculation algorithm instead of swapping SVG paths
- Moon phase calculation now properly determines waxing vs waning based on illumination change
- 93% illuminated moon now correctly displays as nearly full instead of as a crescent

### Changed
- Moon phase calculation algorithm now uses illumination percentage and previous day comparison to accurately determine lunar cycle phase
- FAQ page now includes smooth scrolling behavior when navigating to specific sections

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