## UI Design System

### Color Palette

- **CSS Variable Color System**: Centralized color palette management:
  - `--primary` (#A3C4DC): Main buttons, highlights, navigation
  - `--accent` (#6EC6FF): Links, time displays, hover effects
  - `--highlight` (#F5F5F5): Body text, general content
  - `--secondary` (#273B4A): Background panels, popovers
  - `--glow` (#B2E3FF): Hover/focus glow effects
  - `--background` (#0B0E16): Deep night blue base

### Typography System

- **Headlines**: Playfair Display (serif) - All h1, h2, h3 elements
- **Body Text**: Inter (sans-serif) - Paragraphs, lists, general content
- **Data/Times**: Orbitron (sans-serif) - Time displays, astronomical data
- **Special**: Playfair Display italic - Subtitle in header
- **FormattedTime Component**: Created reusable component handling both Date
  objects and time strings with consistent formatting, including displaying with
  raised colons for better visual hierarchy and readability

### Visual Elements

- **Glassmorphism**: `background: rgba(255, 255, 255, 0.05)`,
  `backdrop-filter: blur(8px)`, `border-radius: 24px`
- **Background Images**:
  - Body: Repeating `sky-tile.jpg` for seamless starfield
  - Header: `milky-way-hero-3.jpg` featuring galactic core
- **Button Styles**: Primary buttons with hover glow effect using #B2E3FF
- **Dark/Field Mode**: Red color scheme (#ff4444) for astronomy field use

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
