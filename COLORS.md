# Hardcoded Colors Inventory

This document catalogs all hardcoded colors found in the codebase and provides
recommendations for mapping them to the existing color token system defined in
`documents/UI_DESIGN_SYSTEM.md`.

## Current Color Token System

The existing design system defines these CSS variables in
`src/styles/global.css`:

### Base Colors

- `--primary` (`--blue-200`): Main buttons, highlights, navigation
- `--accent` (`--blue-300`): Links, time displays, hover effects
- `--highlight` (`--neutral-75`): Body text, general content
- `--secondary` (`--neutral-800`): Background panels, popovers
- `--glow` (`--blue-100`): Hover/focus glow effects
- `--background` (`--blue-900`): Deep night blue base

### Astronomical Clock Colors

- `--sun-twilight`: `var(--orange-400)` (Orange)
- `--sun-night`: `var(--blue-900)` (Dark blue)
- `--sun-dawn`: `var(--yellow-900)` (Yellow)
- `--moon-arc`: `var(--neutral-100)` (Silver)
- `--gc-visible`: `var(--light-blue-500)` (Light blue)
- `--gc-optimal`: `var(--cyan-500)` (Cyan)

### Status Colors

- Status light gray: `rgb(209 213 219)`
- Status orange: `rgb(251 146 60)`
- Status yellow: `rgb(254 240 138)`

## Hardcoded Colors Analysis

In the tables below, when the recommendation is "Merge token", it means that the
color can be replaced with an existing token that has a similar opacity or usage
context. When it says "Need token", it indicates that a new CSS variable should
be created to encapsulate that color.

### TypeScript/JavaScript Files

#### Clock Configuration Colors (`src/config/clockConfig.ts`)

| Color                          | Usage                      | Recommendation                        |
| ------------------------------ | -------------------------- | ------------------------------------- |
| `#FFA500` (Orange)             | Sun twilight arc           | ✅ Already has token `--sun-twilight` |
| `#1a2744` (Dark blue)          | Sun night arc              | ✅ Already has token `--sun-night`    |
| `#FFD700` (Yellow)             | Sun dawn arc               | ✅ Already has token `--sun-dawn`     |
| `#C0C0C0` (Silver)             | Moon arc                   | ✅ Already has token `--moon-arc`     |
| `rgba(61, 141, 194, 1)` (Blue) | Galactic center visibility | **Use**: `--gc-visible`               |
| `#00CEEB` (Cyan)               | Galactic center optimal    | **Use**: `--gc-optimal`               |
| `#6ec6ff` (Accent color)       | Current time indicator     | ✅ Already has token `--accent`       |

#### Astronomical Data Table Gradient (`src/components/AstronomicalDataTable.tsx`)

| Color                                 | Usage           | Recommendation                             |
| ------------------------------------- | --------------- | ------------------------------------------ |
| `rgba(42, 56, 144, ${opacity})`       | Gradient start  | **Need new token**: `--gradient-primary`   |
| `rgba(56, 88, 176, ${opacity * 0.4})` | Gradient middle | **Need new token**: `--gradient-secondary` |
| `rgba(42, 56, 144, ${opacity * 0.3})` | Gradient end    | **Need new token**: `--gradient-tertiary`  |

### CSS Module Files

#### White/Transparent Variations

| Color                       | Usage Count | Context                   | Recommendation                    |
| --------------------------- | ----------- | ------------------------- | --------------------------------- |
| `rgba(255, 255, 255, 0.05)` | 8x          | Glassmorphism backgrounds | **Merge token**: `--glass-bg`     |
| `rgba(255, 255, 255, 0.1)`  | 12x         | Glassmorphism backgrounds | **Need token**: `--glass-bg`      |
| `rgba(255, 255, 255, 0.15)` | 2x          | Glassmorphism backgrounds | **Merge token**: `--glass-bg`     |
| `rgba(255, 255, 255, 0.2)`  | 6x          | Borders, backgrounds      | **Need token**: `--glass-border`  |
| `rgba(255, 255, 255, 0.3)`  | 4x          | Hover states              | **Need token**: `--glass-hover`   |
| `rgba(255, 255, 255, 0.4)`  | 2x          | Active states             | **Need token**: `--glass-active`  |
| `rgba(255, 255, 255, 0.5)`  | 3x          | Text, strong overlays     | **Merge token**: `--text-muted`   |
| `rgba(255, 255, 255, 0.6)`  | 6x          | Muted text                | **Need token**: `--text-muted`    |
| `rgba(255, 255, 255, 0.7)`  | 7x          | Secondary text            | **Merge token**: `--text-muted`   |
| `rgba(255, 255, 255, 0.8)`  | 4x          | Primary text              | **Need token**: `--text-primary`  |
| `rgba(255, 255, 255, 0.9)`  | 1x          | Strong text               | **Merge token**: `--text-primary` |

#### Black/Dark Variations

| Color                 | Usage Count | Context                   | Recommendation                     |
| --------------------- | ----------- | ------------------------- | ---------------------------------- |
| `rgba(0, 0, 0, 0.1)`  | 2x          | Light shadows/overlays    | **Merge token**: `--shadow-medium` |
| `rgba(0, 0, 0, 0.2)`  | 3x          | Medium shadows/overlays   | **Need token**: `--shadow-medium`  |
| `rgba(0, 0, 0, 0.3)`  | 4x          | Dark overlays             | **Need token**: `--shadow-dark`    |
| `rgba(0, 0, 0, 0.6)`  | 2x          | Strong shadows            | **Merge token**: `--shadow-dark`   |
| `rgba(0, 0, 0, 0.8)`  | 1x          | Very dark background      | **Need token**: `--dark-bg`        |
| `rgba(0, 0, 0, 0.9)`  | 1x          | Tooltip background        | **Merge token**: `--dark-bg`       |
| `rgba(0, 0, 0, 0.95)` | 4x          | Modal/tooltip backgrounds | **Need token**: `--dark-bg`        |

#### Blue Color Family

| Color                      | Usage Count | Context                    | Recommendation                                       |
| -------------------------- | ----------- | -------------------------- | ---------------------------------------------------- |
| `rgb(17 24 39)`            | 2x          | WorldMap background        | **Use token**: `--blue-700`                          |
| `rgba(163, 196, 220, 0.1)` | 5x          | Light blue backgrounds     | **Map to existing**: `--primary` with 0.1 alpha      |
| `rgba(163, 196, 220, 0.2)` | 3x          | Medium blue backgrounds    | **Map to existing**: `--primary` with 0.2 alpha      |
| `rgb(96 165 250)`          | 1x          | Link color                 | **Merge token**: `--link`                            |
| `rgb(147 197 253)`         | 3x          | Link/accent color          | **Need token**: `--link`                             |
| `rgba(96, 165, 250, 0.1)`  | 1x          | Link background            | **Need token**: `--link-bg`                          |
| `rgb(219 234 254)`         | 6x          | Light blue text            | **Need token**: `--text-accent`                      |
| `rgb(191 219 254)`         | 2x          | Medium blue text           | **Merge token**: `--text-accent`                     |
| `rgb(239 246 255)`         | 1x          | Very light blue text       | **Merge token**: `--text-accent`                     |
| `#5ab3e6`                  | 1x          | Selected marker background | **Use token**: `--blue-400`                          |
| `rgba(110, 198, 255, 0.1)` | 3x          | Accent backgrounds         | **Map to existing**: `--accent` with 0.1 alpha       |
| `rgba(110, 198, 255, 0.3)` | 2x          | Accent borders             | **Map to existing**: `--accent` with 0.3 alpha       |
| `rgba(110, 198, 255, 0.4)` | 1x          | Accent glow                | **Map to existing**: `--glow` with different opacity |
| `rgba(178, 227, 255, 0.3)` | 2x          | Glow effects               | **Map to existing**: `--glow`                        |
| `rgba(178, 227, 255, 0.4)` | 1x          | Text shadow glow           | **Map to existing**: `--glow`                        |
| `rgba(59, 130, 246, 0.6)`  | 1x          | Button border              | **Need token**: `--button-border`                    |
| `rgba(59, 130, 246, 0.8)`  | 1x          | Button background          | **Need token**: `--button-bg-primary`                |
| `rgba(59, 130, 246, 0.9)`  | 1x          | Button hover               | **Need token**: `--button-bg-primary-hover`          |
| `rgba(59, 130, 246, 0.3)`  | 1x          | Button shadow              | **Need token**: `--button-shadow`                    |
| `rgba(59, 130, 246, 0.4)`  | 1x          | Button hover shadow        | **Need token**: `--button-shadow-hover`              |
| `rgba(147, 197, 253, 0.3)` | 1x          | Loading spinner border     | **Need token**: `--spinner-border`                   |
| `rgb(147, 197, 253)`       | 1x          | Loading spinner top        | **Need token**: `--spinner-active`                   |

#### Red Color Family

| Color                    | Usage Count | Context                 | Recommendation                             |
| ------------------------ | ----------- | ----------------------- | ------------------------------------------ |
| `rgba(239, 68, 68, 0.8)` | 2x          | Error marker background | **Use token**: `--red-400` (closest match) |
| `rgb(239, 68, 68)`       | 2x          | Error borders/colors    | **Use token**: `--semantic-red`            |
| `rgba(239, 68, 68, 0.1)` | 1x          | Error background light  | **Use token**: `--semantic-bg-red`         |
| `rgba(239, 68, 68, 0.3)` | 1x          | Error border            | **Need token**: `--error-border-light`     |
| `#fca5a5`                | 1x          | Error text              | **Use token**: `--red-300` (closest match) |
| `#ef4444`                | 1x          | Error button background | **Use token**: `--red-500` (closest match) |
| `#dc2626`                | 1x          | Error button hover      | **Use token**: `--red-600` (closest match) |
| `rgba(127, 29, 29, 0.5)` | 1x          | Error button background | **Use token**: `--red-800` (closest match) |
| `rgb(248, 113, 113)`     | 1x          | Error button text       | **Use token**: `--red-300` (closest match) |

#### Orange Color Family

| Color                      | Usage Count | Context                      | Recommendation                            |
| -------------------------- | ----------- | ---------------------------- | ----------------------------------------- |
| `rgba(255, 165, 0, 0.1)`   | 1x          | Orange suggestion background | **Use token**: `--semantic-bg-orange`     |
| `rgb(255, 223, 186)`       | 2x          | Orange suggestion text       | **Use token**: `--orange-200` (closest)   |
| `#f97316`                  | 3x          | Orange accent color          | **Use token**: `--semantic-orange`        |
| `#ea580c`                  | 1x          | Orange hover/active          | **Use token**: `--orange-700` (closest)   |
| `rgba(249, 115, 22, 0.08)` | 1x          | Orange background subtle     | **Need token**: `--warning-bg-subtle`     |
| `rgba(249, 115, 22, 0.1)`  | 1x          | Orange background            | **Use token**: `--semantic-bg-orange`     |
| `rgba(249, 115, 22, 0.12)` | 1x          | Orange background hover      | **Merge with**: `--warning-bg-subtle`     |
| `rgba(249, 115, 22, 0.15)` | 1x          | Orange background active     | **Merge with**: `--warning-bg-subtle`     |
| `rgba(249, 115, 22, 0.2)`  | 1x          | Orange background strong     | **Need token**: `--warning-bg-medium`     |
| `rgba(249, 115, 22, 0.25)` | 1x          | Orange border                | **Need token**: `--warning-border`        |
| `rgba(249, 115, 22, 0.3)`  | 1x          | Orange border strong         | **Merge with**: `--warning-border`        |
| `rgba(249, 115, 22, 0.35)` | 1x          | Orange border hover          | **Merge with**: `--warning-border`        |
| `rgba(249, 115, 22, 0.5)`  | 1x          | Orange border active         | **Need token**: `--warning-border-active` |

#### Green Color Family

| Color                     | Usage Count | Context                   | Recommendation                       |
| ------------------------- | ----------- | ------------------------- | ------------------------------------ |
| `#10b981`                 | 1x          | Success/good rating color | **Use token**: `--semantic-green`    |
| `rgba(16, 185, 129, 0.1)` | 1x          | Success background        | **Use token**: `--semantic-bg-green` |

**Note**: If green colors are used specifically for Bortle light pollution
ratings, consider creating semantic tokens `--bortle-excellent` and
`--bortle-bg-excellent` that reference the appropriate green shades.

#### Cyan Color Family

| Color                   | Usage Count | Context                        | Recommendation                |
| ----------------------- | ----------- | ------------------------------ | ----------------------------- |
| `rgba(0 255 255 / 0.5)` | 1x          | Cyan background                | **Use token**: `--gc-optimal` |
| `#00CEEB`               | 1x          | Cyan color (duplicate from TS) | **Use token**: `--gc-optimal` |

#### Yellow Color Family

| Color     | Usage Count | Context            | Recommendation                |
| --------- | ----------- | ------------------ | ----------------------------- |
| `#fbbf24` | 1x          | Yellow/amber color | **Use token**: `--yellow-500` |

#### Specific Component Colors

| Color              | Usage Count | Context             | Recommendation                    |
| ------------------ | ----------- | ------------------- | --------------------------------- |
| `#a8b5ff`          | 1x          | Table header border | **Need token**: --spinner-border` |
| `rgb(156 163 175)` | 1x          | Gray text           | **Use token**: `--text-muted`     |

## Recommendations

### 1. Minimal Token Creation Needed

Based on the master color palette now in `src/styles/global.css`, create only
these essential new tokens:

```css
/* Essential Glassmorphism/Transparency Tokens */
--glass-bg: rgba(255, 255, 255, 0.1); /* Most common transparency */
--glass-border: rgba(255, 255, 255, 0.2); /* Common border transparency */
--glass-hover: rgba(255, 255, 255, 0.3); /* Hover state */
--glass-active: rgba(255, 255, 255, 0.4); /* Active state */

/* Essential Text Opacity Tokens */
--text-muted: rgba(255, 255, 255, 0.6); /* Muted text */
--text-primary: rgba(255, 255, 255, 0.8); /* Primary readable text */

/* Essential Shadow Tokens */
--shadow-medium: rgba(0, 0, 0, 0.2); /* Medium shadows */
--shadow-dark: rgba(0, 0, 0, 0.3); /* Dark overlays */
--dark-bg: rgba(0, 0, 0, 0.95); /* Modal/tooltip backgrounds */

/* Button System (using existing blue palette) */
--button-bg-primary: var(--blue-600); /* Primary button background */
--button-bg-primary-hover: var(--blue-700); /* Primary button hover */
--button-border: var(--blue-500); /* Button borders */

/* Warning System Additions (minimal) */
--warning-bg-subtle: rgba(249, 115, 22, 0.1); /* Subtle warning backgrounds */
--warning-border: rgba(249, 115, 22, 0.3); /* Warning borders */
--warning-border-active: rgba(249, 115, 22, 0.5); /* Active warning borders */

/* Essential Utility Tokens */
--error-border-light: rgba(239, 68, 68, 0.3); /* Light error borders */
--link: var(--blue-400); /* General link color */
--text-accent: var(--blue-100); /* Accent text color */

/* Gradient System (for AstronomicalDataTable) */
--gradient-primary: var(--blue-800); /* Use existing palette */
--gradient-secondary: var(--blue-600); /* Use existing palette */
```

### 2. Migration Strategy

1. **Phase 1**: Add all missing tokens to `src/styles/global.css`
2. **Phase 2**: Update TypeScript files (`clockConfig.ts`,
   `AstronomicalDataTable.tsx`) to use CSS variables
3. **Phase 3**: Replace hardcoded colors in CSS modules systematically by
   component
4. **Phase 4**: Add validation/linting rules to prevent future hardcoded colors

### 2. High-Priority Replacements

**Most commonly used hardcoded colors to replace first:**

- `rgba(255, 255, 255, 0.1)` (12 occurrences) → `--glass-bg`
- `rgba(255, 255, 255, 0.7)` (7 occurrences) → `--text-muted`
- `rgb(219 234 254)` (6 occurrences) → `--text-accent`
- `rgba(255, 255, 255, 0.6)` (6 occurrences) → `--text-muted`
- `rgb(17 24 39)` (2 occurrences) → `--blue-800`
- `rgba(163, 196, 220, ...)` → `--primary` (use CSS
  `rgb(from var(--primary) r g b / 0.X)`)

### 3. Leverage Existing Master Palette

**Direct mappings to existing tokens:**

- `#6ec6ff` → `var(--accent)` ✅ Already mapped
- `#f97316` → `var(--semantic-orange)` ✅
- `#10b981` → `var(--semantic-green)` ✅
- `#fbbf24` → `var(--yellow-500)` ✅
- `rgb(17 24 39)` → `var(--blue-800)` ✅
- Error colors → Use `--semantic-red`, `--semantic-bg-red`, and `--red-X00`
  shades ✅
- Success colors → Use `--semantic-green` and `--semantic-bg-green` ✅

## Summary

- **Total hardcoded colors found**: ~150+ instances
- **Unique color values**: ~80+
- **New tokens needed**: ~20 (significantly reduced with master palette)
- **Existing tokens that can be leveraged**: ~60+ (with master palette)
- **Files requiring updates**: 15+ CSS modules + 2 TypeScript files

### Key Improvements Made

1. **Master color palette implemented** - Comprehensive color system with
   consistent naming
2. **Semantic tokens created** - Error, warning, success, and info color systems
3. **Reduced token proliferation** - Focus on essential tokens and reusing
   palette colors
4. **Fixed critical bugs** - Corrected `--gc-visible` reference and hardcoded
   RGB values

The color system leverages the new master palette to dramatically reduce the
need for custom tokens while maintaining the astronomical theme's specialized
requirements for transparency variations and UI states.
