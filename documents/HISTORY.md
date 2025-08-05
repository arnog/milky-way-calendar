Comprehensive history of the Milky Way Calendar project, documenting major
phases, architectural decisions, and technical implementations.

This file serves as a technical reference for understanding why specific
solutions were chosen and how they evolved over time.

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

### Light Pollution Map Optimization (Phase 31)

- **Performance Problem**: Original RGB light pollution map (2.47MB) used only
  15 unique colors but required expensive RGB-to-Bortle conversion at runtime
- **Analysis**: Discovered that despite RGB format, image contained only 16
  distinct Bortle scale values with 80% black pixels (water/no-data)
- **Solution**: Converted to optimized grayscale format with direct
  Bortle-to-grayscale mapping
- **Implementation**: 
  - Created exact RGB → Bortle → Grayscale conversion preserving 100% accuracy
  - Added `grayscaleToBortleScale()` and `getGrayscalePixelData()` functions
  - Updated both main processing (`lightPollutionMap.ts`) and worker
    (`darkSiteWorker.js`)
  - Maintained backward compatibility with legacy RGB functions
- **Optimization Results**:
  - **File Size**: 2.47MB → 2.25MB (9.1% reduction)
  - **Runtime Performance**: Eliminated RGB color matching algorithm
  - **Memory Efficiency**: Single-channel processing vs 3-channel RGB
  - **Accuracy**: Perfect - all 130 tests pass with identical results
- **Technical Details**: Uses 16-value lookup table (Map) for O(1) grayscale
  to Bortle conversion vs O(n) RGB distance calculation
- **Quality Assurance**: Comprehensive testing verified zero accuracy loss
  during format conversion

### Unified Cache API Implementation (Phase 32)

- **Architecture Problem**: WorldMap component and darkSiteWorker were
  duplicating image caching logic with separate cache implementations, leading
  to redundant downloads and inconsistent caching strategies
- **Analysis**: WorldMap loaded color images directly via `<img>` tags without
  caching, while darkSiteWorker had its own Cache API implementation for
  grayscale maps, resulting in no cache sharing between components
- **Solution**: Created centralized `MapImageCacheService` providing unified
  caching for all light pollution map formats
- **Implementation**:
  - Built `src/services/mapImageCache.ts` with singleton service pattern
  - Added automatic format selection (grayscale for calculations, color for
    display) based on context and screen size
  - Implemented WebP support detection and fallback handling
  - Added memory management with object URL cleanup to prevent memory leaks
  - Enhanced WorldMap component with cached image loading and debounced resize
  - Updated darkSiteWorker to use shared cache configuration
  - Maintained backward compatibility while eliminating code duplication
- **Performance Benefits**:
  - **Shared Storage**: Cache API storage shared between main thread and worker
  - **Intelligent Loading**: Cache-first loading with 7-day expiration
  - **Format Optimization**: Automatic selection of optimal image format/size
  - **Memory Management**: Proper cleanup prevents memory leaks from object URLs
  - **Network Efficiency**: Eliminates redundant downloads across components
- **Testing**: Added comprehensive test suite (12 new tests) validating cache
  behavior, format selection, singleton pattern, and error handling
- **Architecture Impact**: Centralized caching eliminates duplicate code,
  provides consistent performance across all map-related functionality, and
  enables future cache optimizations from single point of control

### Astronomical Data Table Component Consolidation (Phase 33)

- **Architecture Problem**: DailyVisibilityTable and Calendar components had
  very similar functionality (date-based data display, star ratings, formatted
  times) but completely different implementations, leading to significant code
  duplication and maintenance overhead
- **Analysis**: Both components shared 80% of their logic but used different
  data structures, CSS files, and rendering approaches despite showing
  astronomical data in tabular format
- **Solution**: Created unified `AstronomicalDataTable` component with
  configuration-driven behavior supporting both daily and weekly modes
- **Implementation**:
  - Built configurable `AstronomicalDataTable` component in
    `src/components/AstronomicalDataTable.tsx` with mode-based rendering
  - Created shared `useAstronomicalData` hook in `src/hooks/useAstronomicalData.ts`
    supporting both daily and weekly data loading patterns
  - Implemented comprehensive TypeScript interfaces in
    `src/types/astronomicalDataTable.ts` for type-safe configuration
  - Consolidated CSS styling into single `AstronomicalDataTable.module.css`
    with mode-specific variants (daily expandable rows, weekly infinite scroll)
  - Converted original components to thin configuration wrappers (24 lines each)
  - Removed unnecessary loading states since astronomical computations are fast
  - Cleaned up unused CSS classes reducing bundle size
- **Component Renaming**: Updated names for consistency and clarity:
  - `Calendar` → `WeeklyAstroTable` (clearer purpose indication)
  - `DailyVisibilityTable` → `DailyAstroTable` (consistent naming pattern)
- **Architecture Benefits**:
  - **Single Source of Truth**: All table logic centralized in one component
  - **Reduced Duplication**: Eliminated 400+ lines of duplicate code
  - **Better Maintainability**: Changes to table behavior only require updates
    in one location
  - **Type Safety**: Comprehensive interfaces prevent configuration errors
  - **Performance**: Removed unused loading states and optimized CSS bundle
- **Functionality Preservation**: All existing features maintained including
  expandable details (daily mode), infinite scroll (weekly mode), navigation
  callbacks, and structured data generation
- **Testing**: All 142 existing tests continue to pass, validating that
  consolidation preserved functionality while improving architecture

### Navigation and Global State

- **Global State**: Dark/Field mode maintained across all pages with app-level
  context

- **Navigation Bar**: Centered navigation with Home, Explore, and FAQ links,
  plus Dark/Field mode toggle at far right

- **Active States**: Navigation links show bold styling when on current page

### Code Quality & Architecture

- **Library Migration**: Successfully migrated from SunCalc to astronomy-engine
  for better accuracy and consistency
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

### Moon Phase Calculation Fix

- **Problem Identified**: Moon phase icons showed reversed phases (except
  new/full moon), with 93% illuminated moon displaying as crescent
- **Root Cause**: Incorrect moon phase calculation formula that inverted the
  relationship between phase angle and lunar cycle phase
- **Solution**: Implemented proper phase calculation based on:
  - Illumination percentage comparison with previous day to determine
    waxing/waning
  - Correct phase mapping: waxing (0-0.5), waning (0.5-1.0)
  - Edge case handling for new moon (<1%) and full moon (>99%)
- **Files Updated**: `src/utils/moonCalculations.ts` with new calculation
  algorithm
- **Impact**: Moon icons now accurately represent illumination levels across all
  phases

### Bortle Rating Display

- **Feature Added**: Bortle scale rating (1-9) displayed in Tonight card for
  current location
- **Implementation Details**:
  - Created `getBortleRatingForLocation()` function in `lightPollutionMap.ts`
  - Asynchronously fetches light pollution data and calculates Bortle rating
  - Displays as styled badge below location with data font family
- **UX Enhancement**: Made Bortle rating clickable link to FAQ explanation
  - Added anchor IDs to FAQ articles for direct linking
  - Implemented smooth scroll behavior with React Router hash navigation
  - Added hover effects with glow and transitions
- **Educational Value**: Users can instantly learn what their Bortle rating
  means for Milky Way visibility

### Time-Integrated Observation Windows

**Problem Solved**: Previously, observation windows were calculated using simple
intersection logic (GC visibility ∩ astronomical darkness), which ignored when
moon interference actually occurs during the window, leading to misleading
duration estimates that disappointed users.

**Solution Implemented**: Hour-by-hour quality analysis using the refined GC
observation scoring algorithm to provide realistic viewing windows that account
for actual viewing conditions throughout the night.

- **New Architecture**: `src/utils/integratedOptimalViewing.ts` provides
  time-integrated window calculation with quality period detection
- **Enhanced API**: `getOptimalViewingWindow()` with configurable quality
  thresholds and backward compatibility with existing
  `calculateOptimalViewingWindow()`
- **Quality Periods**: Automatic detection of continuous viewing periods above
  user-defined quality thresholds (30%+ decent, 50%+ good, 70%+ very good, 90%+
  perfect)
- **TonightCard Integration**: Now displays realistic viewing windows with
  quality percentages (e.g., "1.0h (21% quality)") instead of misleading static
  durations
- **Real-World Impact**: Example night with 62% moon interference:
  - **Before**: "3.3 hours viewing" (static intersection, misleading)
  - **After**: "1.0 hours quality viewing (21%)" (time-integrated, honest)
  - **User Benefit**: Saves 2.2 hours of poor conditions, sets realistic
    expectations
- **Progressive Enhancement**: Opt-in integrated analysis maintains full
  backward compatibility while providing superior accuracy for components that
  adopt it
- **Performance**: Uses the same optimized variable-step integration as GC
  scoring with minimal computational overhead compared to static intersection
- **Testing**: Validated with challenging real-world scenarios (high moon
  interference) and excellent conditions (new moon nights) to ensure accuracy
  across all conditions

**Technical Implementation**: The system detects continuous quality periods
within the astronomical viewing window, filters out poor-quality time
automatically, and provides users with honest expectations about both duration
and quality of their Milky Way observation sessions. See
`TIME_INTEGRATED_WINDOWS.md` for comprehensive technical details and migration
guide.

## Phases

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

✅ **Phase 15**: Typography Enhancement - Implemented enhanced time displays
with raised colons using precise CSS vertical alignment (0.2em) for improved
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
quality analysis for realistic viewing windows that account for moon
interference timing, replacing static intersection logic with time-integrated
scoring, providing users with honest duration estimates and quality percentages
for better trip planning (see TIME_INTEGRATED_WINDOWS.md for full details)

✅ **Phase 19**: Algorithm Migration Completion - Completed full migration to
integrated approach by removing the old static algorithm (118 lines),
simplifying the `getOptimalViewingWindow()` API to always use time-integrated
analysis with required parameters, updating all components and tests, and
cleaning up 8 obsolete comparison/analysis files for a cleaner codebase

✅ **Phase 20**: Moon Phase Icon Fix - Corrected moon phase calculation
algorithm to properly determine waxing/waning phases based on illumination
changes, ensuring 93% illuminated moon displays as nearly full instead of
crescent

✅ **Phase 21**: Bortle Rating Integration - Added Bortle scale rating display
to Tonight card showing light pollution level (1-9 scale) for current location,
implemented as clickable link to FAQ explanation, with hover effects and proper
styling

✅ **Phase 22**: Date Navigation Implementation - Added comprehensive URL query
parameter support (`?date=YYYY-MM-DD`) for viewing astronomical data on any
date, implemented custom `useDateFromQuery` hook for centralized date state
management, made calendar rows clickable to navigate to specific dates, and
updated all components to respect the selected date instead of always using
"today"

✅ **Phase 23**: Dark Site Suggestions - Implemented automatic dark site
suggestions for locations with poor Bortle ratings (4+), integrated with
existing dark sky search functionality to find nearest suitable locations within
500km, added visually distinct suggestion panels in TonightCard with site
details and links to the explore page for better user guidance to optimal
viewing locations

✅ **Phase 24**: Coordinate Preservation System - Implemented coordinate
preservation that maintains exact user-entered coordinates instead of
automatically switching to nearest special locations, added nearest known
location suggestions for coordinate inputs showing nearby landmarks within 100km
with distance calculation, enhanced location manager to separate coordinate
preservation from location description lookup, providing users with precise
control over their observation location while still offering helpful location
context

✅ **Phase 25**: LocationPopover Geolocation Enhancement - Fixed geolocation
behavior to display nearby location names in the input field while preserving
exact user coordinates for calculations, enhanced getSpecialLocationDescription
function to use a more generous 100km distance threshold when a matched location
name exists, ensuring users near special locations like Yellowstone receive
proper location descriptions and context

✅ **Phase 26**: Custom Tooltip System Implementation - Replaced browser
tooltips with custom tooltips for star ratings using React state management and
consistent styling matching the app's design system, implemented hover/touch
event handling for better mobile support, and fixed tooltip clipping issues in
table views by adding appropriate padding to table containers in both Daily and
Calendar views
