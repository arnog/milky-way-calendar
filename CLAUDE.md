# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Milky Way Calendar is a React/TypeScript SPA that displays optimal Milky Way viewing conditions throughout the year. The app shows a weekly calendar with visibility ratings based on astronomical calculations including Galactic Center altitude, moon phase/illumination, and darkness windows.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Development server
npm run build        # Production build
npm run lint         # Code linting
npm run preview      # Preview production build
```

## Key Features Implemented

- **Weekly calendar table** showing Milky Way visibility ratings (1-4 stars)
- **Tonight card** with detailed astronomical events for current night
- **Interactive location selection** via clickable popover with world map integration
- **Real astronomical calculations** using astronomy-engine and suncalc libraries
- **Timezone-aware time display** - all times shown in location's local timezone
- **SVG icon system** with custom tooltips for better UX
- **Glassmorphism UI** with starry sky background and responsive design
- **Location parsing** supporting coordinates, city names, and special astronomy locations

## Project Structure

- `src/components/` - React components (Calendar, TonightCard, LocationPopover, WorldMap, StarRating)
- `src/utils/` - Utility functions for astronomical calculations and location parsing
- `src/types/` - TypeScript type definitions
- `src/icons.svg` - SVG sprite with custom icons (stars, sun/moon rise/set, transit)

## Astronomical Calculations

The app calculates:

- **Galactic Center Position**: Using astronomy-engine for precise altitude/azimuth calculations
- **Moon Data**: Using suncalc for phase, illumination, rise/set times, and position
- **Twilight Times**: Astronomical twilight (sun ≥18° below horizon) for darkness windows
- **Optimal Viewing Windows**: Intersection of GC visibility (≥10° altitude), astronomical darkness, and moon interference
- **Visibility Rating**: 1-4 star system combining GC altitude, moon interference, and darkness duration
- **Timezone Conversion**: All times displayed in location's local timezone using longitude-based approximation

## Astronomical Observation Notes

- **Optimal viewing** requires GC ≥10° above horizon during astronomical darkness
- **Seasonal altitude thresholds**: Jan-Jul: 20°, Aug-Sep: 15°, Oct-Dec: 10°
- **Moon interference**: Scaled penalty based on illumination percentage when moon is up
- **Timezone handling**: Critical for international users - times must be shown in observation location's timezone

## Technical Learnings

### Timezone Challenges
- **Issue**: Browser `getHours()` returns time in user's timezone, not observation location's timezone
- **Solution**: Longitude-based timezone approximation (`Math.round(lng / 15)` hours from UTC)
- **Implementation**: Custom `formatTimeInLocationTimezone()` function for consistent time display

### UI/UX Evolution
- **Location Input**: Evolved from standalone card to integrated popover for better space utilization
- **Icon System**: Replaced Unicode emojis with custom SVG sprites for consistency
- **Information Density**: TonightCard redesigned with 3-column layout and combined event displays
- **Tooltips**: Custom CSS tooltips replace browser defaults for better mobile support

### Map Integration
- **Drag Handling**: Fixed race conditions between drag events and location state updates
- **Event Flow**: Proper mouseup handling prevents location reset on drag release

## Current Status

✅ **Phase 1**: Project Foundation - React/TypeScript setup with Vite, Tailwind CSS  
✅ **Phase 2**: Core Astronomical Engine - Real calculations implemented  
✅ **Phase 3**: Advanced UI/UX - Location popover, timezone-aware displays, SVG icons  
✅ **Phase 4**: Map Integration - Interactive world map with drag support  

**Current state**: Feature-complete astronomy calendar with international timezone support.

## Hosting

Configured for deployment on Dreamhost as a SPA.