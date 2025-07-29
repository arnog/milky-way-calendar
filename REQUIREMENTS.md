# Milky Way Calendar

This project is a SPA hosted on Dreamhost.

It displays a page that contains a table with a row for each week of the year.

It has an input field for the user to enter a location (latitude and longitude)
and a button to submit the location. By default, the location is set to the
user's current location, but the user can change it by pointing to a different
location on the small world map.

An indicator of the Bortle scale for the chosen location is displayed, which
helps users understand the light pollution level at that location.

Each row includes:

- the day the week starts on
- an indicator (one to four stars) indicating the visibility of the Milky Way on
  that week
- an icon indicating the moon phase for that week
- the time when the Galactic Center is 20deg above the horizon and the duration
  of visibility

To rate the quality of the Milky Way visibility, we use the a combination of the
following factors:

✅ 1. Galactic Core Altitude • You want the GC to be ≥20° above the horizon for
a strong visual presence and cleaner photos. Its azimuth and altitude vary
through the night and season.

✅ 2. Moon Position & Illumination. Even a 30% illuminated moon can spoil
contrast. Ideal conditions: • New Moon • Or moonset well before GC visibility •
Calculate moonset time vs. GC rise and transit time.

✅ 3. Darkness Window • Astronomical twilight must be over: Sun >18° below the
horizon

## Tools

Consider using the following tools to build this project:

- https://github.com/cosinekitty/astronomy
- https://github.com/mourner/suncalc

The app is built using React and TypeScript.

## User Interface

The header of the page is "Milky Way Calendar", in large, bold text.

There is a toggle switch in the top right corner to switch between "dark mode"
and "darkroom mode".

In a card below the header, there is a small world map with a marker indicating
the user's current location. The user can click on the map to set a new
location, which updates the latitude and longitude input fields below the map.

The map is simple, black and white outline of the continents. The user lat and
long is indicated by a red dot on the map and two thin lines intersecting at the
dot, one horizontal and one vertical.

The latitude/longitude input field is below the map, with a label "Location
(Latitude, Longitude)". The user can enter a location in one of the following
formats

- Decimal degrees: "lat, long" (e.g., "37.7749, -122.4194").
- DMS (Degrees, Minutes, Seconds): "lat° long°" (e.g., "37° 46' 30.64" N, 122°
  25' 9.84" W").
- DDM (Degrees and Decimal Minutes): "lat° long'" (e.g., "37° 46.510' N, 122°
  25.164' W").
- Location name: "San Francisco"

The location is updated when the user stops typing for 200ms or presses Enter.

When the page is first loaded, the app uses the user's current location to
populate the latitude and longitude fields.

If the lat/long is within 100 km of a one of the predefined locations, the app
will use the predefined location instead of the user's current location.

The user lat/long is saved in the browser's local storage, so it persists
between page reloads.

Below the location card is another card, labeled "Tonight". The card contains
the following information. Each element is listed in chronological order (if it
has a time component) and only include elements that are in the future:

- Sun rise time (civil twilight)
- Sun set time (civil dawn)
- Astronomical twilight end time
- Astronomical twilight start time
- Moon rise time
- Moon set time
- Galactic Center rise time
- Galactic Center transit time
- Galactic Center set time
- Maximum altitude of the Galactic Center
- An icon representing the moon phase for the night
- An indicator of the Bortle scale for the location
- An indicator of the visibility of the Milky Way (one to four stars)
- A percentage of the moon illumination for the night

Below the Tonight card is a table with a row for each week of the year. The
table has the following columns:

- Week start date
- Visibility of the Milky Way (one to four stars)
- Galactic Center rise time
- Galactic Center transit time

The background of each row should vary between completely dark (indicating poor
visibility) to a light blue with some visible stars/and or picture of the Milky
Way (indicating good visibility).

The table includes row for the next 52 weeks, starting from the current week. If
a row has a visibility score of 0 stars, it should not be displayed (so the
table may contain fewer than 52 rows).

If the user scrolls past the bottom of the table, the app should load more rows
to fill the screen, 52 weeks at a time.

### General UI Requirements

The app should have a clean and modern UI, with a focus on usability.

The app should be responsive and work well on both desktop and mobile devices.

The app may be used in the field, at night. The typography should be large
enough to read in low light conditions.

It should be dark with white text. It should include a toggle that switches to
"darkroom mode", with the white text using red instead.
