✅ **COMPLETED**: 12-hour astronomical clock visualization in TonightCard

  **Implementation Summary**:
  - SVG-based clock face with astronomical events displayed as colored arcs
  - Three arc layers: Sun (orange/black/yellow), Moon (silver with opacity), Galactic Center (light blue/cyan)
  - Accurate time-to-angle positioning with 12-hour wrap-around handling
  - Event labels positioned around clock perimeter with icons and times
  - Interactive tooltips explaining each astronomical event
  - Distant events (>12 hours) shown with reduced opacity
  - Hour markers positioned inside clock face for better legibility
  - Optimized sizing and padding to prevent label clipping
  - Fixed content centering within SVG foreignObjects
  - Current time indicator as a glowing blue line from center
  
  **Files Created**:
  - `src/components/AstronomicalClock.tsx` - Main clock component
  - `src/components/AstronomicalClock.module.css` - Clock styling
  - `src/components/ClockTooltip.tsx` - Reusable tooltip component
  - `src/components/ClockTooltip.module.css` - Tooltip styling
  - `src/utils/timeConversion.ts` - Time-to-angle conversion utilities
  - `src/utils/arcCalculation.ts` - SVG arc path generation
  
  **Technical Achievements**:
  - Solved complex time-to-angle positioning mathematics
  - Fixed multiple label clipping issues through container optimization
  - Implemented proper content centering within SVG foreignObjects
  - Added interactive tooltips with hover/touch support
  - Eliminated tooltip conflicts and double tooltip issues
  - Responsive design with mobile-friendly sizing

- In the Tonight card, display the quality of the observation window over time
  in a simple line chart. The x-axis is the time of the night, the y-axis is the
  quality of the observation window, from 0 to 1. The line should be colored
  according to the quality of the observation window, with a gradient from
  partially transparent cyan (0) to cyan (1).
