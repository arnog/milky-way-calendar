Contents collected from previous CLAUDE.md files, for historical context.

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
