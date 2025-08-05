### Coding Guidelines

#### General

- For names of files and directories, use kebab-case (e.g., `my-component.tsx`,
  `my-directory`) or all caps (e.g., `ARCHITECTURE_REVIEW.md`)

- Use the MCP Playwright to test UI components and get access to the browser
  console for debugging.

- Before launching the dev server, check if it might already be running in the
  background.

- When a task has been completed:

  - Review the code:

    - Look for opportunities to remove dead code or simplify logic
    - Look for hardcoded values that should be replaced with constants or
      configuration options
    - Look for opportunities to factor repetitive code.
    - Identify fallback code and consider removing it and throwing an error or
      logging it instead.
    - Run `npm run lint` to check for code style issues and `npm run typecheck`
      to verify TypeScript types and fix any issues

  - Update the `CHANGELOG.md` file with a summary of changes
  - Update the `CLAUDE.md` file with any new features or architectural changes

#### TypeScript

- Avoid booleans as function parameters. Instead, use specific types to clarify
  intent:

  Instead of:

  ```typescript
  function setVisibility(isDay: boolean) { ... }
  ```

  use instead:

  ```typescript
  type VisibilityMode = "day" | "night" ;

  function setVisibility(mode: VisibilityMode) { ... }
  ```

- Limit the number of function parameters to 3-4. If a function requires more,
  consider creating a configuration object or using destructuring:

  Instead of:

  ```typescript
  function area(length: number, width: number, height: number) { ... }
  ```

  use instead:

  ```typescript
  interface Dimensions {
    length: number;
    width: number;
    height: number;
  }

  function area({ length, width, height }: Dimensions) { ... }
  ```

- It's OK to combine positional and nominal parameters, but use them
  judiciously. If a function has both, ensure the positional parameters are
  essential and the nominal parameters are clearly named:

  ```typescript
  function createRectangle(length: number, width: number, options: { color?: string; filled?: boolean }) { ... }
  ```

- The first or second parameter should be the object of the function, if
  applicable. This helps clarify the function's primary purpose:

  ```typescript
  function updateUser(userId: string, userData: { name?: string; email?: string }) { ... }
  ```

- Input parameters of function should be immutable by default. If a parameter
  needs to be modified, consider using a new variable or returning a new value:

  ```typescript
  function increment(value: number): number {
    return value + 1; // value remains unchanged
  }
  ```

  If a parameter must be modified, make it clear the function is intended to
  mutate the input:

  ```typescript
  function updateUser(
    userId: string,
    userData: { name?: string; email?: string }
  ) {
    userData.name = userData.name?.toUpperCase();
  }
  ```

- Use `CONSTANT_CASE` for constants that are not configuration options or
  environment variables. For configuration options or environment variables, use
  `kebab-case`:

  ```typescript
  const MAX_RETRIES = 5; // Constant
  const API_BASE_URL = "https://api.example.com"; // Configuration option
  const UNIT_SUFFIXES = {
    milliseconds: "ms",
    seconds: "s",
  } as const;
  ```

- For private methods and properties, use `camelCase` with a leading underscore
  to indicate they are intended for internal use only:

  ```typescript
  class MyClass {
    private _internalMethod() { ... }
    private _internalProperty: string;
  }
  ```

- For methods that have no arguments, use a getter/setter syntax if they
  represent a property or computed value:

  ```typescript
  class Circle {
    private _radius: number;

    constructor(radius: number) {
      this._radius = radius;
    }

    get area(): number {
      return Math.PI * this._radius * this._radius;
    }

    set radius(value: number) {
      this._radius = value;
    }
  }
  ```

- If a method has a single optional argument, use both a getter and regular
  method:

  ```typescript
  class Time {
    private _hours: number;
    private _minutes: number;

    constructor(hours: number, minutes: number) {
      this._hours = hours;
      this._minutes = minutes;
    }

    get time(): string {
      return `${this._hours}:${this._minutes}`;
    }

    getTime(format: "12-hour" | "24-hour" = "24-hour"): string {
      if (format === "12-hour") {
        const period = this._hours >= 12 ? "PM" : "AM";
        const hours = this._hours % 12 || 12; // Convert to 12-hour format
        return `${hours}:${this._minutes} ${period}`;
      }
      return `${this._hours}:${this._minutes}`;
    }
  }
  ```

- If an array is intended to be immutable, use `readonly`:

  ```typescript
  function processItems(items: readonly string[]) {
    // items cannot be modified
  }
  ```

- Use labels for tuples to clarify their purpose:

  ```typescript
  type Coordinates = [latitude: number, longitude: number];

  function getCoordinates(): Coordinates {
    return [37.7749, -122.4194]; // San Francisco coordinates
  }
  ```

- When a block has a single statement, use a single line without braces:

  ```typescript
  if (condition) doSomething();
  ```

- Use the nullish coalescing operator (`??`) to provide default values for
  potentially `null` or `undefined` values:

  ```typescript
  const value = getData()?.property ?? "default value";
  ```

- Use nullish coalescing assignment (`??=`) to assign default values only if the
  variable is `null` or `undefined`:

  ```typescript
  let value: string | undefined;
  value ??= "default value"; // Assigns only if value is null or undefined
  ```

- Avoid fallback code for situations that should not occur. If a situation is
  unexpected, throw an error or log it for debugging:

  ```typescript
  if (unexpectedCondition) throw new Error("Unexpected condition occurred");
  ```

** Naming **

- Prefer method and function names that make **use sites** form grammatical
  English phrases.

  This improves readability and understanding of the code's purpose:

  ```typescript
  function optimalViewingWindow(location: Location): ViewingWindow { ... }
  ```

- For predicates, use the `is` prefix to indicate a boolean return type:

  ```typescript
  function isValidEmail(email: string): boolean {
    // validation logic
  }
  ```

- Name functions and methods according to their side effects:

  - If a function modifies state, use a verb that indicates the action (e.g.,
    `update`, `set`, `add`, `remove`):

    ```typescript
    function updateUser(userId: string, userData: { name?: string; email?: string }) { ... }
    ```

  - If a function performs a calculation without side effects, use a noun or
    adjective (e.g., `area`, `userName`):

    ```typescript
    function area(length: number, width: number): number { ... }

    function userName(user: User): string {
      return `${user.firstName} ${user.lastName}`;
    }
    ```

- Begin names of factory methods with "make", e.g. `x.makeIterator()`.

#### React Components

- Use function components with hooks instead of class components:

  ```typescript
  function LocationCard({ location }: { location: Location }) {
    const [isVisible, setIsVisible] = useState(false);
    // ...
  }
  ```

- Props interfaces should be named with the component name plus "Props":

  ```typescript
  interface LocationCardProps {
    location: Location;
    onLocationChange?: (location: Location) => void;
  }

  function LocationCard({ location, onLocationChange }: LocationCardProps) {
    // ...
  }
  ```

- Custom hooks should start with "use" and follow camelCase:

  ```typescript
  function useAstronomicalData(location: Location, date: Date) {
    // ...
  }
  ```

- Keep useEffect dependency arrays complete and accurate. Use ESLint
  exhaustive-deps rule:

  ```typescript
  useEffect(() => {
    calculateVisibility(location, date);
  }, [location, date]); // Include all dependencies
  ```

- Prefer component composition over prop drilling for deeply nested data:

  ```typescript
  // Instead of passing props through multiple levels
  function App() {
    return (
      <LocationProvider>
        <Calendar />
      </LocationProvider>
    );
  }
  ```

- Use meaningful component file organization:
  - Component logic in `.tsx` files
  - Styles in `.module.css` files
  - Types in dedicated `.ts` files when shared
  - Tests in `.test.tsx` files

#### Testing Guidelines

- Test files should be named `componentName.test.ts` or `utilityName.test.ts`

- Focus testing on:

  - **Astronomical calculations**: Verify accuracy with known values
  - **Edge cases**: High latitudes, extreme dates, timezone boundaries
  - **User interactions**: Location selection, date navigation
  - **Error conditions**: Failed calculations, invalid inputs

- Organize tests with descriptive describe blocks:

  ```typescript
  describe("calculateGalacticCenterAltitude", () => {
    describe("when location is at high latitude", () => {
      it("should return null when GC never rises above horizon", () => {
        // ...
      });
    });
  });
  ```

- Use realistic test data based on actual astronomical values:

  ```typescript
  const YELLOWSTONE_LOCATION = { lat: 44.6, lng: -110.5 };
  const SUMMER_SOLSTICE_2024 = new Date("2024-06-21T00:00:00Z");
  ```

- Mock expensive calculations when testing UI components:

  ```typescript
  jest.mock("../utils/astronomicalCalculations", () => ({
    calculateVisibility: jest.fn(() => ({ rating: 3, duration: 2.5 })),
  }));
  ```

#### Project-Specific Patterns

- **Astronomical calculations** should be pure functions in `src/utils/`:

  ```typescript
  function calculateGalacticCenterAltitude(
    location: Location,
    date: Date
  ): number | null {
    // Pure function with no side effects
  }
  ```

- **Error handling** for calculations should be graceful with fallbacks:

  ```typescript
  try {
    const altitude = calculateGalacticCenterAltitude(location, date);
    return altitude ?? 0; // Fallback for null results
  } catch (error) {
    console.error("Calculation failed:", error);
    return 0; // Safe fallback
  }
  ```

- **Date/time handling** must be timezone-aware:

  ```typescript
  // Always specify timezone context
  function formatTimeInTimezone(date: Date, timezone: string): string {
    return date.toLocaleTimeString("en-US", { timeZone: timezone });
  }
  ```

- **For astronomical events** particular care must be taken for events that may
  start on one day and end on the next, or end on one day and start the previous
  day.

- **Location data** should use consistent coordinate precision:

  ```typescript
  interface Location {
    lat: number; // Decimal degrees, 6 decimal places max
    lng: number; // Decimal degrees, 6 decimal places max
    name?: string; // Optional human-readable name
  }
  ```

#### Performance Considerations

- **Memoize expensive astronomical calculations**:

  ```typescript
  const memoizedCalculation = useMemo(() => {
    return calculateComplexAstronomy(location, date);
  }, [location, date]);
  ```

  But before considering memoization, ensure the calculation is indeed expensive
  and that the component re-renders frequently enough to warrant it. Do some
  performance profiling to determine if memoization is necessary.

- **Optimize component re-renders** with React.memo for pure components:

  ```typescript
  const StarRating = React.memo(({ rating }: { rating: number }) => {
    // Component that only re-renders when rating changes
  });
  ```

- **Handle large coordinate datasets** efficiently:

  ```typescript
  // Use array methods that don't mutate original data
  const filteredSites = darkSites.filter((site) => site.bortle <= 3);
  ```

- **Debounce user input** for expensive operations:

  ```typescript
  const debouncedLocationSearch = useMemo(
    () => debounce(searchLocations, 300),
    []
  );
  ```

#### Documentation Standards

- **Complex astronomical functions** require JSDoc comments:

  ```typescript
  /**
   * Calculates Galactic Center altitude for given location and time
   * @param location - Geographic coordinates in decimal degrees
   * @param date - UTC date/time for calculation
   * @returns Altitude in degrees above horizon, or null if never visible
   * @throws {Error} When astronomy-engine calculations fail
   */
  function calculateGalacticCenterAltitude(
    location: Location,
    date: Date
  ): number | null {
    // ...
  }
  ```

- **Update CHANGELOG.md** for user-facing changes:

  - New features that affect user experience
  - Bug fixes that resolve user-reported issues
  - Performance improvements users will notice

- **Update HISTORY.md** for technical changes:
  - Algorithm improvements and mathematical corrections
  - Architecture changes and refactoring
  - Library migrations and dependency updates

#### CSS Modules Patterns

- **Class names** should be descriptive and component-scoped:

  ```css
  /* LocationCard.module.css */
  .container {
    /* Main container styles */
  }

  .locationName {
    /* Specific to location name display */
  }

  .isActive {
    /* State-specific styling */
  }
  ```

- **Global styles** should use `global-` prefix in `src/styles/global.css`:

  ```css
  .global-data-time {
    font-family: "Orbitron", monospace;
    letter-spacing: 0.03em;
  }
  ```

- **CSS variables** should be defined in `:root` and used consistently:

  ```css
  :root {
    --primary: #4a90e2;
    --accent: #f39c12;
  }

  .button {
    background-color: var(--primary);
    border-color: var(--accent);
  }
  ```

#### Import/Export Organization

- **Import order** should follow this pattern:

  ```typescript
  // 1. React and external libraries
  import React, { useState, useEffect } from "react";
  import { DateTime } from "luxon";

  // 2. Internal utilities and types
  import { calculateVisibility } from "../utils/astronomicalCalculations";
  import type { Location, VisibilityRating } from "../types";

  // 3. Components
  import StarRating from "./StarRating";
  import LocationPopover from "./LocationPopover";

  // 4. Styles (always last)
  import styles from "./Calendar.module.css";
  ```

- **Re-exports** should be used sparingly and documented:

  ```typescript
  // src/utils/index.ts
  export { calculateVisibility } from "./astronomicalCalcululations";
  export { formatTime } from "./timeUtils";
  // Only re-export commonly used utilities
  ```

- **Type-only imports** should be explicit:

  ```typescript
  import type { Location } from "../types";
  import { calculateDistance } from "../utils"; // Runtime import
  ```
