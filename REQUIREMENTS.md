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

## Time Zone Handling

The application currently approximates the user's timezone based on longitude
(Math.round(location.lng / 15)). This is not accurate and will produce incorrect
times for many users.

Problem: Timezones are political, not purely geographical. They don't always
align with 15-degree longitude lines and many have non-integer offsets (e.g.,
India at UTC+5:30, parts of Australia at UTC+9:30).

Recommendation: Implement a more robust timezone solution.

Client-Side (Good): Use the browser's native
`Intl.DateTimeFormat().resolvedOptions().timeZone` to get the user's IANA
timezone name (e.g., "America/Los_Angeles"). This works for the user's current
location but not for locations they look up.

Server-Side/Library (Better): Use a library like latlon-to-timezone or a simple
API to convert a given latitude/longitude into its corresponding IANA timezone
name. Once you have the IANA name, you can use date-fns-tz or the
`Intl.DateTimeFormat` API to format all dates and times correctly for that
specific location. This is crucial for accuracy.

The timezone should be calculated accurately in particular for the Structured
Data.

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

### Navigation

The website should include the following sections:

- Home
- Explore
- FAQ

Home is the main page that displays the Tonight card and the table with the
weekly visibility of the Milky Way.

The Explore page includes a map of the world with markers for the predefined
locations. The user can click on a marker to see the visibility of the Milky Way
for that location.

The FAQ page includes a list of frequently asked questions about the Milky Way,
with answers and illustrations (see below).

To navigate between these sections, the website should use a top navigation bar
with links to each section. The navigation bar should be displayed below the
title and main header of the page.

To the far trailing edge of the navigation links is a small icon toggle that
switches between "dark mode" and "darkroom mode". In darkroom mode, the text
color changes to red.

### FAQ

The website should include a FAQ section:

```
<section id="milky-way-faq">
  <h2>Frequently Asked Questions About the Milky Way</h2>

  <article>
    <h3>1. What exactly is the Milky Way?</h3>
    <p>
      The Milky Way is our home galaxy — a vast collection of around
      <strong>100–400 billion stars</strong>, along with gas, dust, and dark matter, all
      bound together by gravity. From Earth, we see it as a glowing band because we’re
      looking along the plane of its disk from inside it.
    </p>
    <!-- Illustration: Diagram of the Milky Way with Sun’s position marked -->
  </article>

  <article>
    <h3>2. Why does the Milky Way look like a band?</h3>
    <p>
      Our galaxy is shaped like a flattened disk. When you look toward the plane of that
      disk, you see many more stars packed together, creating the hazy, cloudlike glow.
      Away from the plane, fewer stars are in view, so the sky looks darker.
    </p>
    <!-- Illustration: Side-view of the Milky Way disk with observer's line of sight -->
  </article>

  <article>
    <h3>3. Where is the center of the Milky Way?</h3>
    <p>
      It lies in the direction of the constellation <strong>Sagittarius</strong>,
      at a declination of about <strong>29° south</strong>. This central region contains
      a supermassive black hole called <em>Sagittarius A*</em>, with about 4 million times
      the Sun’s mass.
    </p>
    <!-- Illustration: Star map showing location of the Galactic Center -->
  </article>

  <article>
    <h3>4. Can I see the Milky Way from where I live?</h3>
    <p>
      If you live in or near a city, light pollution may make it invisible. You’ll need a
      <strong>dark sky site</strong> away from artificial lights. It’s best seen on clear,
      moonless nights, during your region’s <em>Milky Way season</em>
      (spring to early fall in the northern hemisphere, year-round in the deep south).
    </p>
    <!-- Illustration: Bortle scale chart -->
  </article>

  <article>
    <h3>5. Why is the Milky Way brighter in some months?</h3>
    <p>
      The <strong>brightest part</strong> of the Milky Way — the Galactic Center — is above
      the horizon at night during certain months. In the northern hemisphere, the best views
      are between <strong>April and September</strong>. In the southern hemisphere, it can be
      seen for longer and higher in the sky.
    </p>
    <!-- Illustration: Night-sky visibility calendar for both hemispheres -->
  </article>

  <article>
    <h3>6. Is the Milky Way moving?</h3>
    <p>
      Yes — the Sun and our entire solar system orbit the Galactic Center at about
      <strong>828,000 km/h</strong>, taking roughly <strong>225–250 million years</strong>
      to complete one orbit. The Milky Way itself is also moving relative to other galaxies.
    </p>
    <!-- Illustration: Animation or diagram of the Sun’s orbit in the galaxy -->
  </article>

  <article>
    <h3>7. How far away is the Galactic Center?</h3>
    <p>
      It’s about <strong>26,500 light-years</strong> away. The light we see tonight left
      the center around the time humans were first developing agriculture.
    </p>
    <!-- Illustration: Scale comparison of light-years -->
  </article>

  <article>
    <h3>8. Can we photograph it with a smartphone?</h3>
    <p>
      Yes, if you have a phone with <strong>night mode</strong> or a dedicated astrophotography
      mode, and you’re under a dark sky. A tripod helps. For detailed, colorful shots,
      a DSLR or mirrorless camera with a wide, fast lens will produce better results.
    </p>
    <!-- Illustration: Side-by-side comparison of smartphone and DSLR shots -->
  </article>

  <article>
    <h3>9. Why do some photos show so much color in the Milky Way?</h3>
    <p>
      Human eyes aren’t sensitive enough to see faint colors in low light. Long-exposure
      photography collects more light, revealing the pinks, reds, and blues from glowing
      hydrogen, star clusters, and dust clouds.
    </p>
    <!-- Illustration: Same scene as seen by eye vs long-exposure photo -->
  </article>

  <article>
    <h3>10. Will the Milky Way always look the same?</h3>
    <p>
      Over millions of years, its shape in our sky will slowly change as stars move and the
      Sun orbits the Galaxy. Billions of years from now, the Milky Way will merge with the
      <strong>Andromeda Galaxy</strong>, creating a new galaxy often nicknamed “Milkomeda.”
    </p>
    <!-- Illustration: Simulation of Milky Way–Andromeda collision -->
  </article>
</section>
```

### General UI Requirements

The app should have a clean and modern UI, with a focus on usability.

The app should be responsive and work well on both desktop and mobile devices.

The app may be used in the field, at night. The typography should be large
enough to read in low light conditions.

It should be dark with white text. It should include a toggle that switches to
"darkroom mode", with the white text using red instead.
