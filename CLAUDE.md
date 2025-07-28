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

- Weekly calendar table showing Milky Way visibility ratings (1-4 stars)
- Location input with automatic geolocation detection
- Real astronomical calculations using astronomy-engine and suncalc libraries
- Dark mode with optional "darkroom mode" (red text instead of white)
- Glassmorphism UI with starry sky background
- Responsive design

## Project Structure

- `src/components/` - React components (Header, LocationInput, Calendar)
- `src/hooks/` - Custom React hooks (useAstronomicalData)
- `src/utils/` - Utility functions for astronomical calculations
- `src/types/` - TypeScript type definitions

## Astronomical Calculations

The app calculates:

- **Galactic Center Position**: Using astronomy-engine for precise altitude/azimuth
- **Moon Data**: Using suncalc for phase, illumination, and position
- **Twilight Times**: Astronomical twilight (sun >18° below horizon)
- **Visibility Rating**: Combines GC altitude (≥20°), moon interference, and darkness duration

## Astronomical Observation Notes

- Optimal Start of the GC should be after the astronomical dusk and before the astronomical twilight of the following day
- LA Astronomical Observation on 2025-09-21:
  - Civil twilight: 18:50 to 19:15 (elevation 0deg to -6deg)
  - Astronomical twilight: 19:44-20:13 (-12deg to -18deg)
  - Optimal Galactic Center viewing: 20:13-23:08

## Current Phase

✅ Phase 1: Project Foundation - React/TypeScript setup with Vite, Tailwind CSS
✅ Phase 2: Core Astronomical Engine - Real calculations implemented

Next phases: Location/map features, UI polish, testing & deployment.

## Hosting

Configured for deployment on Dreamhost as a SPA.