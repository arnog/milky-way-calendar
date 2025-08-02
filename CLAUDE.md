# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

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
- **Interactive location selection** via clickable popover with world map
  integration
- **Real astronomical calculations** using astronomy-engine library for
  consistent, accurate results
- **Timezone-aware time display** - all times shown in location's local timezone
- **Enhanced typography** - time displays with raised colons for improved readability
- **SVG icon system** with custom tooltips for better UX
- **Glassmorphism UI** with starry sky background and responsive design
- **Location parsing** supporting coordinates, city names, and special astronomy
  locations
- **Explore page** (`/explore`) showcasing world's best dark sky sites with
  interactive map
- **FAQ page** (`/faq`) with comprehensive Milky Way information and
  astrophotography guidance
- **Centered navigation bar** with Home, Explore, and FAQ sections
- **Dark/Field mode toggle** positioned at far right of navigation for optimal
  field use
- **SEO optimization** with comprehensive XML sitemap and robots.txt for search
  engine discoverability

## Project Structure

- `src/components/` - React components (Calendar, TonightCard, LocationPopover,
  WorldMap, StarRating) with corresponding `.module.css` files
- `src/pages/` - Page components (HomePage, LocationPage, ExplorePage, FAQPage)
- `src/utils/` - Utility functions for astronomical calculations and location
  parsing
- `src/types/` - TypeScript type definitions
- `src/styles/` - CSS styling with global utilities (`global.css`) and modular
  component styles
- `src/test/` - Comprehensive unit test suite (109 tests across 8 files)
- `public/icons.svg` - SVG sprite with custom icons (stars, sun/moon rise/set,
  transit)
- `public/world2024B-*.{webp,jpg,png}` - Light pollution maps in multiple
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

## Astronomical Observation Notes

- **Optimal viewing** requires GC ≥10° above horizon during astronomical
  darkness
- **Seasonal altitude thresholds**: Jan-Jul: 20°, Aug-Sep: 15°, Oct-Dec: 10°
- **Moon interference**: Scaled penalty based on illumination percentage when
  moon is up
- **Timezone handling**: Critical for international users - times must be shown
  in observation location's timezone

## UI Design System

### Color Palette

- **Primary**: #A3C4DC - Main buttons, highlights, navigation
- **Accent**: #6EC6FF - Links, time displays, hover effects
- **Highlight**: #F5F5F5 - Body text, general content
- **Secondary**: #273B4A - Background panels, popovers
- **Glow**: #B2E3FF - Hover/focus glow effects
- **Background**: #0B0E16 - Deep night blue base

### Typography System

- **Headlines**: Playfair Display (serif) - All h1, h2, h3 elements
- **Body Text**: Inter (sans-serif) - Paragraphs, lists, general content
- **Data/Times**: Orbitron (sans-serif) - Time displays, astronomical data
- **Special**: Playfair Display italic - Subtitle in header

### Visual Elements

- **Glassmorphism**: `background: rgba(255, 255, 255, 0.05)`,
  `backdrop-filter: blur(8px)`, `border-radius: 24px`
- **Background Images**:
  - Body: Repeating `sky-tile.jpg` for seamless starfield
  - Header: `milky-way-hero-3.jpg` featuring galactic core
- **Button Styles**: Primary buttons with hover glow effect using #B2E3FF
- **Dark/Field Mode**: Red color scheme (#ff4444) for astronomy field use

## Technical Learnings

### Timezone Implementation

- **Challenge**: Browser `getHours()` returns time in user's timezone, not
  observation location's timezone
- **Previous Solution**: Longitude-based approximation (`Math.round(lng / 15)`)
  was inaccurate for many locations
- **Current Solution**: Proper IANA timezone lookup using `tz-lookup` library
  with coordinate-to-timezone conversion
- **Implementation**: `src/utils/timezoneUtils.ts` with comprehensive timezone
  handling functions
- **Accuracy Improvements**:
  - Non-integer offsets (India UTC+5:30, Australia UTC+9:30) now handled
    correctly
  - Political timezone boundaries respected (not just longitude lines)
  - Daylight saving time automatically calculated
  - Fallback to longitude approximation if timezone lookup fails
- **Performance**: Coordinate-based caching for efficient timezone lookups

### UI/UX Evolution

- **Location Input**: Evolved from standalone card to integrated popover for
  better space utilization
- **Icon System**: Replaced Unicode emojis with custom SVG sprites for
  consistency
- **Information Density**: TonightCard redesigned with 3-column layout and
  combined event displays
- **Tooltips**: Custom CSS tooltips replace browser defaults for better mobile
  support

### Map Integration

- **Light Pollution Maps**: Uses high-resolution light pollution maps
  (world2024B series) showing dark areas in black and light-polluted areas in
  yellow/orange
- **Multiple Resolutions**: Responsive loading with WebP support - small
  (3600x1400), medium (7200x2800), and large (14400x5600) versions
- **Projection System**: Equirectangular projection for accurate coordinate
  mapping (replaced Robinson projection)
- **Aspect Ratio**: Proper 18:7 aspect ratio matching source images prevents
  clipping of Alaska and New Zealand
- **Drag Handling**: Fixed race conditions between drag events and location
  state updates
- **Event Flow**: Proper mouseup handling prevents location reset on drag
  release

### Routing and Navigation

- **Route Structure**:
  - `/` - Home page with calendar for current/saved location
  - `/location/:locationSlug` - Location-specific calendar (supports both named
    locations and coordinates)
  - `/explore` - Interactive dark sky sites explorer
  - `/faq` - Comprehensive FAQ about the Milky Way galaxy
- **Location URLs**: Support both named locations (e.g.,
  `/location/yellowstone`) and coordinates (e.g., `/location/@44.6,-110.5`)
- **Navigation Bar**: Centered navigation with Home, Explore, and FAQ links,
  plus Dark/Field mode toggle at far right
- **Global State**: Dark/Field mode maintained across all pages with app-level
  state management
- **Active States**: Navigation links show bold styling when on current page

### Dark Sky Sites Explorer

- **Curated List**: Uses `DARK_SITES` constant containing ~80 prime stargazing
  locations worldwide
- **Regional Grouping**: Locations organized into balanced regions (Western USA,
  Central USA, Eastern USA, Canada, Europe, etc.)
- **Interactive Map**: WorldMap component with blue markers for each dark sky
  site, hover tooltips, and click navigation
- **Smart Categorization**: Location grouping logic handles edge cases (Alaska,
  Hawaii) and creates balanced regional distributions

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
- **Eliminated Duplication**: Removed duplicate moon calculations between
  TonightCard and utility functions
- **Consistent Moon Data**: All components now use `calculateMoonData()`
  function for moon phase, illumination, and rise/set times
- **Proper Error Handling**: Robust fallbacks for edge cases like extreme
  latitudes and failed calculations
- **Library Migration**: Successfully migrated from SunCalc to astronomy-engine
  for better accuracy and consistency
- **Timezone Accuracy**: Replaced longitude approximation with proper IANA
  timezone lookup using `tz-lookup` library
- **Modular Timezone Utils**: Created `src/utils/timezoneUtils.ts` with
  comprehensive timezone conversion functions
- **CSS Architecture Migration**: Migrated from Tailwind CSS to CSS Modules for
  better component encapsulation and maintainability
- **Algorithm Migration Completion**: Removed legacy static algorithm and
  simplified `getOptimalViewingWindow()` API to always use time-integrated
  approach with required parameters for consistent behavior

### Light Pollution Map Coordinate System Fix

- **Critical Issue Resolved**: Fixed fundamental coordinate mapping error where
  cities like Los Angeles, New York, Paris, and Tokyo were incorrectly
  identified as pristine dark sky sites (Bortle 1-1.5)
- **Root Cause**: Light pollution map covers -65° to +75° latitude (140° span),
  not the assumed -90° to +90° (180° span)
- **Before Fix**:
  - `y = ((90 - lat) / 180) * imageHeight` (incorrect 180° assumption)
  - Major cities reading dark pixels (R35 G35 B35) instead of bright pollution
- **After Fix**:
  - `y = ((75 - lat) / 140) * imageHeight` (correct 140° span)
  - Cities now correctly read bright pixels (R255 G255 B255) showing severe
    light pollution
- **Files Updated**:
  - `src/utils/lightPollutionMap.ts`: Core coordinate conversion functions
  - `src/pages/ExplorePage.tsx`: Dark site marker positioning
  - `src/components/WorldMap.tsx`: Interactive map click handling and marker
    positioning
- **Functions Added**:
  - `coordToNormalized()`: Convert lat/lng to 0-1 coordinates for UI positioning
  - `normalizedToCoord()`: Convert 0-1 coordinates back to lat/lng for click
    handling
- **Verification**: Los Angeles now correctly shows "No dark sky sites found
  within 500km" instead of being identified as a Bortle 1 dark site
- **Global Impact**: All interactive map features, dark site searches, and
  coordinate-based functionality now work accurately worldwide

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
- **Migration Benefits**:
  - Eliminated Tailwind build dependencies and configuration overhead
  - Improved component isolation with locally scoped styles
  - Better maintainability with explicit style imports
  - Reduced bundle size by removing unused utility classes
- **Consistent Styling**: All visual appearance preserved during migration with
  identical glassmorphism effects, responsive design, and dark/field modes

### Dark Sky Site Discovery Optimization

- **Bortle Scale Classification**: Uses the International Dark-Sky Association
  Bortle scale (1-9) to classify light pollution levels based on RGB values from
  the light pollution map
- **Optimized Threshold**: Dark sky threshold set to Bortle ≤3.0 to include:
  - Bortle 1: Pristine dark sky (best possible conditions)
  - Bortle 2: Excellent dark sky (minimal light pollution)
  - Bortle 3: Good dark sky (suitable for Milky Way photography)
- **Real-World Validation**: Threshold validated with actual locations:
  - Joshua Tree National Park: Bortle 2.5-3.5 (now correctly identified)
  - Death Valley National Park: Bortle 2.5 (excellent dark sky)
  - Major cities: Bortle 4+ (correctly excluded)
- **Search Algorithm**: Modified Dijkstra's algorithm finds nearest dark sites
  within 500km radius, returning primary site plus 5 alternatives in different
  directions
- **Geographic Diversity**: Alternative sites selected using bearing
  calculations to provide options in multiple directions from user location
- **Known Site Integration**: Found dark sites are matched with nearest known
  locations from curated DARK_SITES list for better accessibility information

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

### Typography Enhancement & CSS Variable System

- **Enhanced Time Typography**: Implemented typographically improved time displays
  with raised colons for better visual hierarchy and readability
- **FormattedTime Component**: Created reusable component handling both Date
  objects and time strings with consistent formatting
- **Precise Vertical Alignment**: Uses CSS `verticalAlign: '0.2em'` for subtle
  colon elevation (not disruptive `<sup>` tag)
- **Universal Implementation**: Applied to all time displays across Calendar,
  DailyVisibilityTable, TonightCard, and optimal viewing times
- **CSS Variable Color System**: Centralized color palette management:
  - `--primary` (#A3C4DC): Main buttons, highlights, navigation
  - `--accent` (#6EC6FF): Links, time displays, hover effects  
  - `--highlight` (#F5F5F5): Body text, general content
  - `--secondary` (#273B4A): Background panels, popovers
  - `--glow` (#B2E3FF): Hover/focus glow effects
  - `--background` (#0B0E16): Deep night blue base
- **Maintainability Benefits**: All hardcoded hex colors replaced with CSS
  variables for consistent theming and easy color scheme modifications
- **Enhanced TonightCard**: Complete Galactic Core event display with rise, optimal
  viewing, transit, and set times arranged chronologically, improved time filtering
  to show events from start of day for better "tonight" context

### Time-Integrated Observation Windows

**Problem Solved**: Previously, observation windows were calculated using simple 
intersection logic (GC visibility ∩ astronomical darkness), which ignored when moon 
interference actually occurs during the window, leading to misleading duration 
estimates that disappointed users.

**Solution Implemented**: Hour-by-hour quality analysis using the refined GC 
observation scoring algorithm to provide realistic viewing windows that account for 
actual viewing conditions throughout the night.

- **New Architecture**: `src/utils/integratedOptimalViewing.ts` provides 
  time-integrated window calculation with quality period detection
- **Enhanced API**: `getOptimalViewingWindow()` with configurable quality thresholds 
  and backward compatibility with existing `calculateOptimalViewingWindow()`
- **Quality Periods**: Automatic detection of continuous viewing periods above 
  user-defined quality thresholds (30%+ decent, 50%+ good, 70%+ very good, 90%+ perfect)
- **TonightCard Integration**: Now displays realistic viewing windows with quality 
  percentages (e.g., "1.0h (21% quality)") instead of misleading static durations
- **Real-World Impact**: Example night with 62% moon interference:
  - **Before**: "3.3 hours viewing" (static intersection, misleading)
  - **After**: "1.0 hours quality viewing (21%)" (time-integrated, honest)
  - **User Benefit**: Saves 2.2 hours of poor conditions, sets realistic expectations
- **Progressive Enhancement**: Opt-in integrated analysis maintains full backward 
  compatibility while providing superior accuracy for components that adopt it
- **Performance**: Uses the same optimized variable-step integration as GC scoring 
  with minimal computational overhead compared to static intersection
- **Testing**: Validated with challenging real-world scenarios (high moon interference) 
  and excellent conditions (new moon nights) to ensure accuracy across all conditions

**Technical Implementation**: The system detects continuous quality periods within 
the astronomical viewing window, filters out poor-quality time automatically, and 
provides users with honest expectations about both duration and quality of their 
Milky Way observation sessions. See `TIME_INTEGRATED_WINDOWS.md` for comprehensive 
technical details and migration guide.

## Current Status

✅ **Phase 1**: Project Foundation - React/TypeScript setup with Vite and CSS
framework  
✅ **Phase 2**: Core Astronomical Engine - Real calculations implemented  
✅ **Phase 3**: Advanced UI/UX - Location popover, timezone-aware displays, SVG
icons  
✅ **Phase 4**: Map Integration - Interactive world map with drag support  
✅ **Phase 5**: Dark Sky Sites Explorer - Dedicated page showcasing curated dark
sky locations  
✅ **Phase 6**: Code Quality Improvements - Migrated to astronomy-engine,
eliminated code duplication, improved high-latitude handling  
✅ **Phase 7**: Navigation & FAQ System - Comprehensive navigation with centered
layout, FAQ page with educational content, global dark/field mode  
✅ **Phase 8**: Timezone Accuracy Implementation - Replaced longitude
approximation with proper IANA timezone lookup using `tz-lookup` library ✅
**Phase 9**: SEO Implementation - Comprehensive XML sitemap generation with
dynamic location parsing, robots.txt configuration, and search engine
optimization ✅ **Phase 10**: Testing & Quality Assurance - Comprehensive unit
test suite with 98 tests covering all astronomy calculations, coordinate
mapping, dark site search accuracy, edge cases, and integration scenarios ✅
**Phase 11**: CSS Architecture Migration - Migrated from Tailwind CSS to CSS
Modules for better component encapsulation, maintainability, and reduced
dependencies ✅ **Phase 12**: UI Refresh Implementation - Complete visual
redesign following UI_REFRESH.md guidelines with new color palette, typography
system (Playfair Display for headings, Orbitron for data/times, Inter for body),
enhanced glassmorphism effects, and custom background imagery

✅ **Phase 13**: Critical Coordinate System Fix - Resolved fundamental light
pollution map coordinate mapping bug that incorrectly identified major cities as
pristine dark sky sites, implemented comprehensive test coverage to prevent
regression

✅ **Phase 14**: Dark Sky Classification Optimization - Fixed overly restrictive
dark sky threshold that prevented legitimate locations like Joshua Tree and
Death Valley from being found, expanded threshold from Bortle ≤1.5 to ≤3.0 to
include excellent dark sky areas suitable for Milky Way photography while still
excluding light-polluted urban areas

✅ **Phase 15**: Typography Enhancement - Implemented enhanced time displays with
raised colons using precise CSS vertical alignment (0.2em) for improved
readability across all astronomical time data, created reusable FormattedTime
component supporting both Date objects and time strings

✅ **Phase 16**: CSS Variable Color System - Centralized color palette using CSS
variables (--primary, --accent, --highlight, --secondary, --glow, --background)
replacing all hardcoded hex values for consistent theming and maintainability

✅ **Phase 17**: TonightCard Galactic Core Enhancement - Added complete Galactic
Core rise and set times to Tonight display, arranged chronologically (Rise →
Optimal Window → Transit → Set), improved time filtering to show today's events
for better "tonight" context

✅ **Phase 18**: Time-Integrated Observation Windows - Implemented hour-by-hour 
quality analysis for realistic viewing windows that account for moon interference 
timing, replacing static intersection logic with time-integrated scoring, 
providing users with honest duration estimates and quality percentages for 
better trip planning (see TIME_INTEGRATED_WINDOWS.md for full details)

✅ **Phase 19**: Algorithm Migration Completion - Completed full migration to 
integrated approach by removing the old static algorithm (118 lines), 
simplifying the `getOptimalViewingWindow()` API to always use time-integrated 
analysis with required parameters, updating all components and tests, and 
cleaning up 8 obsolete comparison/analysis files for a cleaner codebase

**Current state**: Feature-complete astronomy calendar with fully migrated
time-integrated astronomical calculations, accurate timezone handling for
international users, proper high-latitude handling, comprehensive dark sky site
discovery with corrected coordinate mapping and optimal classification
thresholds, educational FAQ system with modern navigation, full SEO optimization
for search engine discoverability, robust test coverage (109 tests) ensuring
calculation accuracy and preventing critical regressions, modern CSS Modules
architecture for scalable styling, centralized color theming with CSS variables,
enhanced typography with raised colons for optimal time readability, unified
time-integrated observation windows providing honest quality expectations across
all components, and a polished night-sky aesthetic with professional visual
design and complete astronomical event coverage.

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
