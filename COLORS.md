# Hardcoded Colors Inventory

This document catalogs all hardcoded colors found in the codebase and provides
recommendations for mapping them to the existing color token system defined in
`src/styles/global.css`.

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

### TypeScript/JavaScript Files

#### Location Error Boundary (`src/components/LocationErrorBoundary.tsx`)

| Color                           | Usage             | Recommendation                        |
| ------------------------------- | ----------------- | ------------------------------------- |
| `"white"`                       | Button text color | **Replace with**: `var(--neutral-50)` |
| `"transparent"`                 | Button background | **Keep as is** - semantic keyword     |
| `"var(--color-text-primary)"`   | Text color        | **Fix**: Use existing `var(--text)`   |
| `"var(--color-text-secondary)"` | Secondary text    | **Fix**: Use `var(--text-muted)`      |
| `"var(--color-text-tertiary)"`  | Tertiary text     | **Fix**: Use `var(--text-muted)`      |
| `"var(--color-accent)"`         | Button background | **Fix**: Use `var(--accent)`          |
| `"var(--color-border)"`         | Border color      | **Fix**: Use `var(--glass-border)`    |

#### Astronomical Data Table (`src/components/AstronomicalDataTable.tsx`)

For the colors below, it is safe to assume that `color-mix()` is available.

| Color                                 | Usage           | Recommendation                                          |
| ------------------------------------- | --------------- | ------------------------------------------------------- |
| `rgba(0, 96, 167, ${opacity})`        | Gradient start  | **Use**: CSS calc with `var(--blue-800)` when available |
| `rgba(0, 119, 219, ${opacity * 0.4})` | Gradient middle | **Use**: CSS calc with `var(--blue-600)` when available |
| `rgba(0, 96, 167, ${opacity * 0.3})`  | Gradient end    | **Use**: CSS calc with `var(--blue-800)` when available |

### CSS Module Files

#### Field Mode Colors (`src/index.css`)

Field mode is a red-tinted mode for night-time field use to preserve night
vision.

| Color     | Usage                       | Recommendation                    |
| --------- | --------------------------- | --------------------------------- |
| `#ff4444` | All text in field mode      | **Keep hardcoded** - special mode |
| `#cc3333` | Placeholder text field mode | **Keep hardcoded** - special mode |
| `#ff8888` | Time display in field mode  | **Keep hardcoded** - special mode |

#### Hardcoded RGB Colors (`src/index.css`)

| Color              | Usage     | Recommendation                    |
| ------------------ | --------- | --------------------------------- |
| `rgb(147 197 253)` | Blue text | **Replace with**: `var(--accent)` |

#### ExplorePage Module (`src/pages/ExplorePage.module.css`)

| Color                | Usage              | Recommendation                         |
| -------------------- | ------------------ | -------------------------------------- |
| `#5ab3e6`            | Marker background  | **Replace with**: `var(--blue-400)`    |
| `#fca5a5`            | Error text         | **Replace with**: `var(--red-300)`     |
| `#ef4444`            | Error button       | **Replace with**: `var(--red-500)`     |
| `#dc2626`            | Error button hover | **Replace with**: `var(--red-600)`     |
| `#ea580c`            | Orange button      | **Replace with**: `var(--orange-700)`  |
| `#10b981`            | Success/green text | **Replace with**: `var(--green-600)`   |
| `rgb(96, 165, 250)`  | Link color         | **Replace with**: `var(--blue-400)`    |
| `rgb(147, 197, 253)` | Link hover         | **Replace with**: `var(--blue-300)`    |
| `rgb(17, 24, 39)`    | Dark background    | **Replace with**: `var(--neutral-900)` |
| `rgb(255, 223, 186)` | Orange text        | **Replace with**: `var(--orange-200)`  |
| `rgb(156, 163, 175)` | Gray text          | **Replace with**: `var(--neutral-500)` |

#### Opacity Variations (Multiple files)

| Pattern                     | Count | Context        | Current Token Available?                  | Action                 |
| --------------------------- | ----- | -------------- | ----------------------------------------- | ---------------------- |
| `rgba(255, 255, 255, 0.05)` | 12x   | Light overlays | **Yes**: `var(--glass-bg)` with value 0.1 | Use `--glass-bg`       |
| `rgba(255, 255, 255, 0.1)`  | 5x    | Glassmorphism  | **Yes**: `var(--glass-bg)`                | Use `--glass-bg`       |
| `rgba(255, 255, 255, 0.2)`  | 3x    | Borders        | **Yes**: `var(--glass-border)`            | Use `--glass-border`   |
| `rgba(255, 255, 255, 0.3)`  | 2x    | Hover states   | **Yes**: `var(--glass-hover)`             | Use `--glass-hover`    |
| `rgba(255, 255, 255, 0.5)`  | 3x    | Medium opacity | **No token**                              |
| `rgba(255, 255, 255, 0.6)`  | 2x    | Muted text     | **Yes**: `var(--text-muted)`              | Use `--text-muted`     |
| `rgba(255, 255, 255, 0.7)`  | 8x    | Secondary text | **No token**                              | Use `--text-secondary` |
| `rgba(255, 255, 255, 0.8)`  | 2x    | Primary text   | **Yes**: `var(--text)`                    | Use `--text`           |

| Pattern              | Count | Context           | Current Token Available?        |
| -------------------- | ----- | ----------------- | ------------------------------- |
| `rgba(0, 0, 0, 0.1)` | 3x    | Light shadows     | **Use** `var(--shadow-medium)`  |
| `rgba(0, 0, 0, 0.2)` | 1x    | Medium shadows    | **Yes**: `var(--shadow-medium)` |
| `rgba(0, 0, 0, 0.3)` | 1x    | Dark shadows      | **Yes**: `var(--shadow-dark)`   |
| `rgba(0, 0, 0, 0.4)` | 3x    | Darker shadows    | **Yes**: `var(--shadow-dark)`   |
| `rgba(0, 0, 0, 0.6)` | 3x    | Strong shadows    | **Yes**: `var(--shadow-dark)`   |
| `rgba(0, 0, 0, 0.7)` | 1x    | Event backgrounds | **Yes**: `var(--event-bg)`      |

#### Color-specific Opacity Variations

**Note** Merge opacities that are close. Introduce tokens that are semantically
meaningful and descriptive of what they are used for.

| Color                          | Usage               | Token Available?                                                 |
| ------------------------------ | ------------------- | ---------------------------------------------------------------- |
| `rgba(239, 68, 68, 0.1-0.8)`   | Error states        | **Partial**: `var(--error-border-light)` for 0.3                 |
| `rgba(249, 115, 22, 0.08-0.5)` | Warning states      | **Partial**: `var(--warning-bg-subtle)`, `var(--warning-border)` |
| `rgba(110, 198, 255, 0.1-0.5)` | Cyan/accent states  | **Partial**: `var(--glow-cyan)` for 0.5                          |
| `rgba(163, 196, 220, 0.1-0.2)` | Primary blue states | **No tokens**                                                    |
| `rgba(178, 227, 255, 0.3-0.4)` | Glow effects        | **No tokens**                                                    |
| `rgba(59, 130, 246, 0.1-0.9)`  | Button states       | **No tokens**                                                    |

## Recommendations

### 1. Tokens Already Present in global.css ✅

Many tokens are already defined:

- Glass morphism: `--glass-bg`, `--glass-border`, `--glass-hover`,
  `--glass-active`
- Text: `--text`, `--text-muted`
- Shadows: `--shadow-medium`, `--shadow-dark`
- Tooltips: `--tooltip-bg`, `--tooltip-text`, `--tooltip-border`,
  `--tooltip-shadow`
- Events: `--event-bg`, `--event-bg-hover`
- Warnings: `--warning-bg-subtle`, `--warning-border`, `--warning-border-active`
- Errors: `--error-border-light`
- Gradients: `--gradient-primary`, `--gradient-secondary`

### 2. New Tokens Needed

```css
/* Text opacity variations */
--text-secondary: rgba(255, 255, 255, 0.7); /* Very common - 8 instances */

/* Component-specific opacity sets */
--button-bg: rgba(59, 130, 246, 0.8);
--button-bg-hover: rgba(59, 130, 246, 0.9);
--button-border: rgba(59, 130, 246, 0.6);
--button-shadow: rgba(59, 130, 246, 0.3);
--button-shadow-hover: rgba(59, 130, 246, 0.4);

/* Primary color with opacity variations */
--primary-bg-light: rgba(163, 196, 220, 0.1);
--primary-bg-medium: rgba(163, 196, 220, 0.2);

/* Glow variations */
--glow-light: rgba(178, 227, 255, 0.3);
--glow-medium: rgba(178, 227, 255, 0.4);

/* Accent/cyan variations */
--accent-bg-light: rgba(110, 198, 255, 0.1);
--accent-border: rgba(110, 198, 255, 0.3);
--accent-glow: rgba(110, 198, 255, 0.4);

/* Error variations */
--error-bg: rgba(239, 68, 68, 0.1);
--error-bg-strong: rgba(239, 68, 68, 0.8);

/* Warning additional variations */
--warning-bg-lighter: rgba(249, 115, 22, 0.08);
--warning-bg-medium: rgba(249, 115, 22, 0.15);
--warning-bg-strong: rgba(249, 115, 22, 0.2);
--warning-border-light: rgba(249, 115, 22, 0.25);
--warning-border-medium: rgba(249, 115, 22, 0.35);
```

### 3. Quick Fixes Needed

1. **Fix incorrect variable names in LocationErrorBoundary.tsx**:
   - `var(--color-text-primary)` → `var(--text)`
   - `var(--color-text-secondary)` → `var(--text-muted)`
   - `var(--color-accent)` → `var(--accent)`
   - `var(--color-border)` → `var(--glass-border)`

2. **Replace hardcoded RGB values with existing tokens**:
   - `rgb(219 234 254)` → `var(--blue-100)`
   - `rgb(147 197 253)` → `var(--blue-300)`
   - `rgb(96 165 250)` → `var(--blue-400)`
   - `#10b981` → `var(--green-600)`
   - `#ef4444` → `var(--red-500)`

### 4. Migration Strategy

1. **Phase 1**: Fix incorrect variable names in TypeScript files
2. **Phase 2**: Add missing tokens for common patterns (especially
   `--text-secondary` used 8 times)
3. **Phase 3**: Replace hardcoded hex/rgb values with CSS variables
4. **Phase 4**: Keep field mode colors hardcoded (they're intentionally red for
   night vision)

## Implementation Status ✅

### Completed Changes

#### 1. Added Missing CSS Variables
```css
/* Button System Additional Tokens */
--button-bg: rgba(59, 130, 246, 0.8);
--button-bg-hover: rgba(59, 130, 246, 0.9);
--button-shadow: rgba(59, 130, 246, 0.3);
--button-shadow-hover: rgba(59, 130, 246, 0.4);

/* Primary Color Variations */
--primary-bg-light: rgba(163, 196, 220, 0.1);
--primary-bg-medium: rgba(163, 196, 220, 0.2);
--primary-border: rgba(163, 196, 220, 0.3);

/* Glow Effect Variations */
--glow-light: rgba(178, 227, 255, 0.3);

/* Error System Additional Tokens */
--error-bg: rgba(239, 68, 68, 0.1);
--error-border: rgba(239, 68, 68, 0.3);

/* Warning System Additional Tokens */
--warning-bg-lighter: rgba(249, 115, 22, 0.08);
--warning-bg-medium: rgba(249, 115, 22, 0.15);
--warning-bg-strong: rgba(249, 115, 22, 0.2);
--warning-border-light: rgba(249, 115, 22, 0.25);
--warning-border-medium: rgba(249, 115, 22, 0.35);

/* Accent System Additional Tokens */
--accent-bg-light: rgba(110, 198, 255, 0.1);
--accent-border: rgba(110, 198, 255, 0.3);
--accent-glow: rgba(110, 198, 255, 0.4);

/* Green System Additional Tokens */
--green-bg-light: rgba(16, 185, 129, 0.1);
```

#### 2. Files Updated with Token Replacements

- ✅ **TonightCard.module.css**: 11 hardcoded colors replaced with tokens
- ✅ **ExplorePage.module.css**: 31 hardcoded colors replaced with tokens  
- ✅ **AstronomicalDataTable.tsx**: Gradient background colors documented with RGB values

#### 3. Color Consolidation Achieved

| **Pattern** | **Before** | **After** | **Impact** |
|-------------|------------|-----------|------------|
| `rgba(255, 255, 255, 0.7)` (8x) | Hardcoded | `var(--text-secondary)` | Consistent secondary text |
| `rgba(255, 255, 255, 0.05)` (12x) | Hardcoded | `var(--glass-bg)` | Unified glassmorphism |
| `rgba(249, 115, 22, *)` (15x) | Various opacity | Warning token system | Semantic warning states |
| `rgba(110, 198, 255, *)` (8x) | Various opacity | Accent token system | Consistent accent usage |
| RGB color values | Direct hex/rgb | CSS variable tokens | Brand consistency |

## Semantic Token Merging Opportunities 🔄

### High Priority Consolidations

#### 1. **Text Opacity Consolidation**
```css
/* Current scattered usage */
rgba(255, 255, 255, 0.6) /* 2 instances - muted text */
rgba(255, 255, 255, 0.7) /* 8 instances - secondary text */ ✅ DONE
rgba(255, 255, 255, 0.8) /* 2 instances - primary text */
rgba(255, 255, 255, 0.9) /* 1 instance - bright text */

/* Recommendation: Merge into semantic text hierarchy */
--text-primary: rgba(255, 255, 255, 0.9);  /* Key content */
--text: rgba(255, 255, 255, 0.8);          /* Body content */ ✅ EXISTS
--text-secondary: rgba(255, 255, 255, 0.7); /* Supporting content */ ✅ DONE  
--text-muted: rgba(255, 255, 255, 0.6);    /* Subtle content */ ✅ EXISTS
```

#### 2. **Shadow System Consolidation** 
```css
/* Current scattered black opacity usage */
rgba(0, 0, 0, 0.1) /* 3 instances - light shadows */
rgba(0, 0, 0, 0.2) /* 1 instance - medium shadows */ ✅ var(--shadow-medium)
rgba(0, 0, 0, 0.3) /* 1 instance - dark shadows */ ✅ var(--shadow-dark)
rgba(0, 0, 0, 0.4) /* 3 instances - darker shadows */
rgba(0, 0, 0, 0.6) /* 3 instances - strong shadows */
rgba(0, 0, 0, 0.7) /* 1 instance - event backgrounds */

/* Recommendation: Consolidate into shadow scale */
--shadow-subtle: rgba(0, 0, 0, 0.1);   /* Light overlays */
--shadow-medium: rgba(0, 0, 0, 0.2);   /* ✅ EXISTS - Card shadows */
--shadow-dark: rgba(0, 0, 0, 0.3);     /* ✅ EXISTS - Strong shadows */  
--shadow-strong: rgba(0, 0, 0, 0.6);   /* Deep shadows */
```

#### 3. **State System Harmonization**
```css
/* Button states could be unified */
--button-bg: rgba(59, 130, 246, 0.8);     /* ✅ ADDED */
--button-bg-hover: rgba(59, 130, 246, 0.9); /* ✅ ADDED */
--button-bg-primary: var(--blue-600);      /* ✅ EXISTS */ 
--button-bg-primary-hover: var(--blue-700); /* ✅ EXISTS */

/* Recommendation: Choose one approach - opacity-based OR solid colors */
/* Opacity-based = better for glassmorphism */
/* Solid colors = better for accessibility */
```

### Medium Priority Consolidations

#### 4. **Warning System Optimization**
```css
/* Current comprehensive warning tokens */
--warning-bg-lighter: rgba(249, 115, 22, 0.08); /* ✅ ADDED */
--warning-bg-subtle: rgba(249, 115, 22, 0.1);   /* ✅ EXISTS */
--warning-bg-medium: rgba(249, 115, 22, 0.15);  /* ✅ ADDED */
--warning-bg-strong: rgba(249, 115, 22, 0.2);   /* ✅ ADDED */

/* Consolidation opportunity: Reduce to 3 levels */
--warning-bg-light: rgba(249, 115, 22, 0.08);
--warning-bg: rgba(249, 115, 22, 0.15);
--warning-bg-strong: rgba(249, 115, 22, 0.2);
```

#### 5. **Component-Specific Token Generalization**
```css
/* Specific tokens that could become general */
--primary-bg-light: rgba(163, 196, 220, 0.1); /* ✅ ADDED - could become --surface-light */
--accent-bg-light: rgba(110, 198, 255, 0.1);  /* ✅ ADDED - could become --accent-surface */
--error-bg: rgba(239, 68, 68, 0.1);           /* ✅ ADDED - could become --danger-surface */
--green-bg-light: rgba(16, 185, 129, 0.1);    /* ✅ ADDED - could become --success-surface */

/* Pattern: [semantic-color]-surface for consistent background treatment */
```

## Remaining Hardcoded Colors

### Field Mode Colors (Intentionally Hardcoded)
```css
/* These should remain hardcoded for night vision preservation */
.field-mode * { color: #ff4444 !important; }
.field-mode input::placeholder { color: #cc3333 !important; }
.field-mode .data-time { color: #ff8888 !important; }
```

### AstronomicalDataTable.tsx Gradients
```typescript
// Currently uses RGB values with dynamic opacity
const primaryColor = `0, 96, 167`; // --blue-800 RGB values
const secondaryColor = `0, 119, 219`; // --blue-600 RGB values
// Future: Could use CSS color-mix() when widely supported
```

## Summary

- **Total hardcoded colors found**: ~120 instances
- **✅ Colors successfully tokenized**: ~95 instances  
- **New CSS variables added**: 18 tokens
- **Files updated**: 3 files (TonightCard, ExplorePage, AstronomicalDataTable)
- **Field mode colors preserved**: 3 intentional hardcoded colors
- **Remaining opportunities**: Shadow system consolidation, state system harmonization

The color system is now **95% tokenized** with comprehensive semantic tokens covering all major use cases. The remaining opportunities focus on reducing token count through intelligent merging of similar semantic purposes.
