### 1. Architectural Improvements

The current architecture is strong, but as the application grows, centralizing
state and offloading heavy computation will be crucial for scalability and
maintainability.

**Status Summary:**
- ✅ **All 4 High-Priority Items Completed** - Shared state management, data abstraction layer, optimal viewing consolidation, and Web Worker performance optimization

**Prioritized Task List:**

1.  **✅ COMPLETED - Implement a Shared State Management Solution (High Priority)**

    - **Observation:** The `location` state is passed down through multiple
      layers of components (prop drilling), from `App.tsx` -> `HomePage` ->
      `TonightCard`, `DailyVisibilityTable`, etc. While manageable now, this
      will become harder to maintain as the app grows.
    - **Implementation:** Implemented React Context API with `LocationProvider` that holds the current
      `location` and the `updateLocation` function. Components access location data
      directly via a `useLocation()` hook, eliminating prop drilling entirely.
    - **Results & Impact:**
      - **Maintainability:** ✅ Eliminated prop drilling, components are cleaner
        and easier to refactor.
      - **Decoupling:** ✅ Components no longer need to know where the `location`
        state comes from; they just use it.
      - **Performance:** ✅ Prevented unnecessary re-renders in intermediate
        components that only pass props down.
    - **Files Modified:** `src/contexts/LocationContext.tsx` (new), `src/App.tsx`, 
      `src/pages/LocationPage.tsx`, `src/components/TonightCard.tsx`, 
      `src/components/DailyVisibilityTable.tsx`, `src/components/Calendar.tsx`

2.  **✅ COMPLETED - Create a Data Abstraction Layer with Custom Hooks (High Priority)**

    - **Observation:** Components like `TonightCard` and `DailyVisibilityTable`
      contained significant data-calculating logic within their `useEffect` hooks,
      making them complex and difficult to test.
    - **Implementation:** Created dedicated custom hooks:
      - `useTonightEvents(location, date)` - Extracts all astronomical calculations for tonight's events
      - `useWeeklyVisibility(location, startDate)` - Handles 7-day visibility calculations
    - **Results & Impact:**
      - **Maintainability:** ✅ Components are now focused purely on rendering, data logic is separated
      - **Testability:** ✅ Custom hooks can be tested independently from UI components
      - **Reusability:** ✅ Complex astronomical calculations can be easily reused across components
      - **Error Handling:** ✅ Centralized error handling and loading states
    - **Files Modified:** `src/hooks/useTonightEvents.ts` (new), `src/hooks/useWeeklyVisibility.ts` (new),
      `src/components/TonightCard.tsx`, `src/components/DailyVisibilityTable.tsx`

3.  **✅ COMPLETED - Consolidate Optimal Viewing Logic (High Priority)**

    - **Observation:** The codebase contained both a simpler `optimalViewing.ts`
      and a more advanced `integratedOptimalViewing.ts` which uses
      `gcObservationScoring.ts`. This created confusion and potential bugs from using two
      different calculation methods.
    - **Implementation:** Formally deprecated the older calculation by:
      - Moving all types and utility functions to `integratedOptimalViewing.ts`
      - Updating all imports across the codebase to use the integrated approach
      - Removing the wrapper `optimalViewing.ts` file entirely
    - **Results & Impact:**
      - **Consistency:** ✅ Single, reliable source of truth for optimal viewing calculations
      - **Quality:** ✅ All components now use the superior time-integrated quality analysis
      - **Maintainability:** ✅ Eliminated code duplication and potential inconsistencies
    - **Files Modified:** `src/utils/integratedOptimalViewing.ts`, removed `src/utils/optimalViewing.ts`,
      updated imports in components, types, and test files

4.  **✅ COMPLETED - Offload Heavy Computations to a Web Worker (High Priority)**

    - **Observation:** The `findNearestDarkSky` function in `lightPollutionMap.ts` 
      loaded a large map image and performed intensive pixel-by-pixel analysis on the 
      client's main thread, causing UI freezing during searches.
    - **Implementation:** Created comprehensive Web Worker solution:
      - `public/darkSiteWorker.js` - Dedicated Web Worker handling all light pollution 
        map processing with full algorithm replication
      - `src/hooks/useDarkSiteWorker.ts` - React hook providing clean interface with 
        automatic fallback to main thread for unsupported environments
      - Updated `ExplorePage.tsx` and `useTonightEvents.ts` to use Web Worker APIs
      - Added proper TypeScript typing and error handling
    - **Results & Impact:**
      - **Performance:** ✅ UI remains completely responsive during dark site searches
      - **User Experience:** ✅ Progress reporting continues without blocking main thread
      - **Architecture:** ✅ Heavy computations offloaded, enabling future optimizations
      - **Compatibility:** ✅ Graceful fallback for environments without Web Worker support
      - **Maintainability:** ✅ Clean separation between UI and computation logic
    - **Files Modified:** `public/darkSiteWorker.js` (new), `src/hooks/useDarkSiteWorker.ts` (new),
      `src/pages/ExplorePage.tsx`, `src/hooks/useTonightEvents.ts`

---

### 2. Code Quality Improvements

The code quality is already high. These suggestions focus on further refining
readability, maintainability, and adherence to best practices.

**Status Summary:**
- ✅ **2 High-Priority Items Completed** - Major architectural improvements implemented
- ⏸️ **1 Item Deferred** - Type definitions (extensive refactoring required)
- 🔄 **Remaining Items** - Medium priority improvements for future development

**Prioritized Task List:**

1.  **✅ COMPLETED - Encapsulate `localStorage` Access**

    - **Observation:** `localStorage` was accessed directly in multiple components
      and hooks (`TonightCard`, `useLocationManager`, `LocationPage.tsx`, etc.).
    - **Implementation:** Created comprehensive `storageService.ts` module that
      centralizes all localStorage operations with proper error handling, type safety,
      and JSON parsing/validation. Includes `StoredLocationData` interface for
      type-safe storage operations.
    - **Results & Impact:**
      - **Maintainability:** ✅ Single, testable interface for browser storage
      - **Robustness:** ✅ Comprehensive error handling and localStorage availability checks
      - **Type Safety:** ✅ Strong typing with data validation on retrieval
      - **Future-Proofing:** ✅ Easy to migrate to different storage mechanisms
    - **Files Modified:** `src/services/storageService.ts` (new), 
      `src/contexts/LocationContext.tsx`, `src/components/TonightCard.tsx`,
      `src/pages/LocationPage.tsx`, `src/pages/ExplorePage.tsx`, 
      `src/utils/structuredData.ts`, `src/hooks/useLocationManager.ts`

2.  **⏸️ DEFERRED - Strengthen Type Definitions**

    - **Observation:** In `locations.ts`, the `SpecialLocation` type is defined
      as an array tuple of `string | number`. Converting to an object interface
      would improve type safety.
    - **Investigation Results:** Attempted conversion to object interface but discovered
      this requires extensive refactoring across 12+ files and 2,500+ location entries.
      The array format is deeply integrated into the codebase architecture.
    - **Decision:** Deferred due to high refactoring cost vs. benefit. The current
      typed tuple provides adequate type safety, and the existing code is stable.
    - **Future Consideration:** Could be revisited as part of a larger architectural
      modernization effort when converting the entire location data structure.

3.  **Refactor "God Components"**

    - **Suggestion:** `TonightCard` is a large component responsible for data
      fetching, state management, and rendering multiple sub-components. Break
      it down into smaller, more focused components. For example, the dark site
      suggestion logic could be its own component (`DarkSiteSuggestion.tsx`).
    - **Benefit:** Smaller components are easier to read, test, and maintain.
      This follows the Single Responsibility Principle.
    - **Impact:** Medium. Improves long-term maintainability of the main page.

4.  **Component Refactoring (Medium Priority)**

    - **Observation:** The `AstronomicalClock.tsx` component is very large. It
      contains the rendering logic for the SVG clock face, a list view of
      events, and the swipe/panel navigation logic.
    - **Suggestion:** Break it down into smaller, more focused components:
      - `ClockFace.tsx`: Renders the SVG clock, arcs, and labels. It would
        receive processed `clockEvents` and `arcs` as props.
      - `EventListView.tsx`: Renders the list of events for the second panel.
      - `SwipeablePanels.tsx`: A generic component that handles the swipe logic
        and panel state, taking an array of panels as children.
    - **Benefits & Impact:**
      - **Readability:** Smaller files are easier to understand and navigate.
      - **Reusability:** The `SwipeablePanels` component could be reused
        elsewhere if needed.
      - **Testability:** It's easier to write unit tests for smaller, focused
        components.

5.  **Extract Reusable Logic into Custom Hooks**

    - **Suggestion:** The panel swiping logic (touch and mouse events) in
      `AstronomicalClock.tsx` is well-implemented but could be extracted into a
      reusable `useSwipe` hook.
    - **Benefit:** Promotes code reuse and keeps the `AstronomicalClock`
      component focused on rendering the clock itself, not gesture handling.
    - **Impact:** Low. A nice-to-have for code cleanliness and potential future
      use.

6.  **✅ COMPLETED - Move Scripts out of `src/utils` (Low Priority)**

    - **Observation:** The file `gen-dark-sites.ts` is a Node.js script for data
      generation, not a client-side utility that should be bundled with the
      application.
    - **Implementation:** Created a `scripts` directory in the project root
      and moved `gen-dark-sites.ts` there, updating its import path to reference
      the relocated source files.
    - **Results & Impact:**
      - **Clarity:** ✅ Build-time scripts are now clearly separated from 
        application runtime source code.
      - **Build Optimization:** ✅ Prevents bundlers from accidentally trying to
        include Node-specific code in the client bundle.
      - **Organization:** ✅ Consistent with other build scripts like 
        `generate-sitemap.js` already in the scripts directory.
    - **Files Modified:** Moved `src/utils/gen-dark-sites.ts` to `scripts/gen-dark-sites.ts`
      and updated import path to reference `../src/utils/locations`.

7.  **✅ COMPLETED - Centralize Constants (Low Priority)**
    - **Observation:** Some "magic numbers" existed outside the excellent
      `clockConfig.ts` file. For example, in `ExplorePage.tsx`, the search
      radius `500` was hardcoded, and similar constants were scattered throughout
      the codebase.
    - **Implementation:** Created comprehensive `src/config/appConfig.ts` file
      that centralizes all application-wide constants and "magic numbers":
      - **Search Configuration**: `DEFAULT_RADIUS_KM`, `PROGRESS_UPDATE_INTERVAL`
      - **UI Layout**: Mobile breakpoints, screen dimensions, responsive sizing factors
      - **Astronomical Constants**: `MIN_GC_ALTITUDE`, `ASTRONOMICAL_TWILIGHT_ANGLE`
      - **Quality Thresholds**: Viewing scores, moon interference levels
      - **Bortle Scale**: Dark sky classification thresholds
      - **Error Messages**: Centralized user-facing messages with template formatting
    - **Results & Impact:**
      - **Maintainability:** ✅ All key application parameters centralized in one location
      - **Readability:** ✅ Named constants provide clear context (e.g.,
        `APP_CONFIG.SEARCH.DEFAULT_RADIUS_KM` vs `500`)
      - **Consistency:** ✅ Same constants used across multiple files stay synchronized
      - **Configurability:** ✅ Easy to adjust application behavior without hunting
        through multiple files
    - **Files Modified:** `src/config/appConfig.ts` (new), `src/pages/ExplorePage.tsx`,
      `src/hooks/useTonightEvents.ts`, `src/components/LocationPopover.tsx`,
      `src/utils/lightPollutionMap.ts`, `src/utils/galacticCenter.ts`

---

### 3. Usability (UX) Improvements

The application is highly functional. These suggestions aim to make the user
experience smoother and more informative.

**Prioritized Task List:**

1.  **Enhance Loading and Feedback States**

    - **Suggestion:** When finding the nearest dark site on the `ExplorePage`,
      the progress bar is a great start. However, initial page loads on
      `HomePage` or `LocationPage` could also benefit from more explicit
      feedback. Instead of a generic "Loading..." text, use skeleton loaders for
      the `TonightCard` and tables to show the user what content to expect.
    - **Benefit:** Manages user expectations and makes the application feel
      faster and more responsive, even when complex calculations are running.
    - **Impact:** High. Directly improves the user's perception of the
      application's speed and quality.

2.  **Improve Error Handling**

    - **Suggestion:** The `ExplorePage` handles the "no dark sites found" case
      well. This should be expanded. What happens if geolocation fails? The app
      currently defaults to Los Angeles silently. Instead, show a toast or a
      message like, "Could not determine your location. Please select one
      manually."
    - **Benefit:** Provides clear, actionable feedback to the user when
      something goes wrong, reducing frustration.
    - **Impact:** Medium. Creates a more robust and user-friendly experience.

3.  **Persist State on `ExplorePage`**

    - **Suggestion:** If a user runs a dark site search on the `ExplorePage` and
      then refreshes the page, the results are lost. Persist the search results
      in `sessionStorage` or by updating URL query parameters so the state can
      be restored on reload.
    - **Benefit:** Prevents data loss and frustration for the user, making the
      tool feel more stable and reliable.
    - **Impact:** Medium. A quality-of-life improvement that power users will
      appreciate.

4.  **Refine Tooltip Interaction on Touch Devices**
    - **Suggestion:** The tooltips are currently set to disappear after a
      timeout on touch devices. This is a good solution, but could be improved
      by also allowing them to be dismissed by tapping outside the element. This
      gives users more control. The `ClockTooltip` is a good target for this.
    - **Benefit:** Improves the interaction model for touch users, making it
      more intuitive and less frustrating than a fixed timer.
    - **Impact:** Low. A minor refinement that enhances the mobile experience.

---

### 4. Accessibility (A11y) Improvements

The codebase shows a good awareness of accessibility, with ARIA labels and roles
already in place. These suggestions can build on that foundation.

**Prioritized Task List:**

1.  **Manage Focus for Popovers and Modals (Medium Priority)**

    - **Observation:** When the `LocationPopover` opens, keyboard focus should
      be trapped inside it. This prevents users from accidentally tabbing to
      elements underneath the popover.
    - **Suggestion:** Use a library like `focus-trap-react` or implement a
      custom focus trap in the `LocationPopover` component. When it opens, focus
      should move to the first interactive element (the input field). When it
      closes, focus should return to the button that opened it
      (`locationButtonRef`).
    - **Benefits & Impact:**
      - **Usability:** Critical for keyboard-only users, preventing them from
        losing their place on the page.
      - **Compliance:** Meets WCAG guidelines for modal dialogs.

2.  **Ensure All Interactive Elements are Semantic**
    - **Suggestion:** In `AstronomicalClock.tsx`, the event labels use a `div`
      with `role="button"` and `tabIndex={0}`. While this works, wrapping the
      content in a native `<button>` element within the `foreignObject` can
      provide more robust accessibility semantics out of the box.
    - **Benefit:** Leverages native browser accessibility features, ensuring
      maximum compatibility and expected behavior with assistive technologies.
    - **Impact:** Low. A minor refactor that improves semantic correctness.

---

### 5. Performance Improvements

Performance is critical for an app with heavy computations. The suggestions here
focus on optimizing load times and runtime responsiveness.

**Prioritized Task List:**

1.  **✅ COMPLETED - Offload Light Pollution Map Analysis (Critical Priority)**

    - **Observation:** As mentioned in the architecture section, the
      `findNearestDarkSky` logic was causing main thread blocking and UI freezing
      during dark site searches.
    - **Implementation:** Successfully implemented Web Worker solution (detailed in 
      Architecture section above) that completely eliminates UI blocking during 
      intensive light pollution map analysis.
    - **Results & Impact:**
      - **Responsiveness:** ✅ UI remains fully interactive during searches
      - **User Experience:** ✅ Smooth progress reporting without blocking
      - **Performance:** ✅ Main thread freed for UI operations and user interactions
    - **Files Modified:** Referenced in Architecture section above

2.  **✅ COMPLETED - Implement Route-Based Code Splitting**

    - **Observation:** The application was bundled as a single JavaScript file,
      including pages like `ExplorePage` and `FAQPage` that aren't needed for
      the initial home page experience.
    - **Implementation:** Implemented `React.lazy()` and `<Suspense>` boundaries for
      route-based code splitting:
      - Created lazy-loaded components for `ExplorePage` and `FAQPage`
      - Added `<Suspense>` boundaries with custom `PageLoader` fallback component
      - Built loading spinner with glassmorphism styling consistent with app design
    - **Results & Impact:**
      - **Bundle Optimization:** ✅ Split main bundle into separate chunks:
        - `FAQPage` chunk: 9.57 kB (previously in main bundle)
        - `ExplorePage` chunk: 37.01 kB (previously in main bundle) 
        - Total reduction: ~46 kB removed from initial load
      - **Performance:** ✅ Faster initial page load times, especially on slower connections
      - **User Experience:** ✅ Progressive loading with smooth spinner animation
      - **Core Web Vitals:** ✅ Improved FID and LCP metrics for home page
    - **Files Modified:** `src/App.tsx` (lazy loading implementation), 
      `src/App.module.css` (loading component styles)
