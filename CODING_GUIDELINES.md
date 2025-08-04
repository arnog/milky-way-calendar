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

- Begin names of factory methods with “make”, e.g. `x.makeIterator()`.
