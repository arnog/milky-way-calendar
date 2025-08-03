✅ COMPLETED: The improved observation window is now used in both
DailyVisibilityTable and Calendar components.

✅ COMPLETED: URL query parameter support (`?date=YYYY-MM-DD`) has been
implemented with a custom `useDateFromQuery` hook for centralized date state
management.

✅ COMPLETED: Calendar rows are now clickable and navigate to the corresponding
date via URL parameters.

✅ COMPLETED: Dark site suggestions have been implemented for locations with
poor Bortle ratings (4+), showing the nearest dark site within 500km with
details and a link to `/explore`.

✅ COMPLETED: Coordinate preservation system has been implemented. When users
enter coordinates or use geolocation, the exact coordinates are preserved while
finding the nearest known location within 100km for descriptive context. The
Tonight card shows suggestions for nearby landmarks with distance information
and links to the explore page.

- In the LocationPopover, we should not automatically switch to a known
  location, that is when the user clicks the "find my location" button, we
  should use the location as returned by the browser.

- The tooltips displayed above the star rating should be our custom tooltips,
  like the ones displayed above icons, not the browser based ones.

- We should use a graphic in the Tonight card to represent the various events.
  This could be a 12hour clock face, with the events about the sun displayed as
  an arc inside the clock, another arc for the moon, and a third arc for the
  Galactic Center.

  The arcs should be colored according to the event type, so the sun arc would
  orange to indicate the sun twighlight, then black or dark blue to indicate the
  astronimical night, then yellow for the dawn.

  The moon arc is silver, with the opacity set according to the moon
  illumination.

  The Galactic Center arc is a light blue, from the Galactic Center rise , then
  switch to cyan for the observation window, and back to light blue for the
  Galactic Center set.

  The arcs should be drawn in the correct position according to the time of the
  event, and the arcs should be sized according to the duration of the event.

  The labels for the time of the events should be displayed around the clock
  face, including the icons they currently have.

  Labels for events that occur 12 hours from the current time are displayed with
  a reduced opacity, to indicate they are not relevant for the current night.

- In the Tonight card, display the quality of the observation window over time
  in a simple line chart. The x-axis is the time of the night, the y-axis is the
  quality of the observation window, from 0 to 1. The line should be colored
  according to the quality of the observation window, with a gradient from
  partially transparent cyan (0) to cyan (1).
