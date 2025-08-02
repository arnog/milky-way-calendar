- The icons for the moon phases are reversed (except full and new moon). They
  should be flipped horizontally, or renamed to match the actual phase.

- The Tonight cards should display the Bortle rating for the location.

- The improved observation window is not used in the DailyVisibilityTable
  component or the Calendar component.

- A query in the URL should be read to override the default date (i.e. today).
  Something like `?date=2023-10-01` should set the date to October 1, 2023.

- Clicking a row in the calendar should navigate to the corresponding date in
  the calendar, i.e. `?date=2023-10-01`.

- If the location has a poor bortle rating, a message in the Tonight card should
  suggest to explore nearby dark sites, maybe provide one or two suggestions,
  then a link to `/explore` to find more dark sites.

- When reading the user location, or when the user selects a location as
  lat/long, we should keep the location as entered. We should calculate a known
  location based on that value (closest within 100km) and use it to select a
  location description. In that case, as in the case of a poor bortle rating, we
  should show a message in the Tonight card to suggest exploring nearby dark
  sites.

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
