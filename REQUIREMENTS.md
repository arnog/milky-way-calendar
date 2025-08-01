# Milky Way Calendar

This project is a SPA. The domain is `milky-way-calendar.com`, registered with
DreamHost and deployed on Cloudflare.

The purpose of the app is to help photographers and stargazers plan their
photography sessions by providing information about the visibility of the Milky
Way and the Galactic Core at a given location.

## User Interface

The main page displays the Tonight Card, the daily visibility for the next seven
days, and the weekly visibility for the next weeks.

### Location Picker

When the user clicks on the location label, a Location Picker is displayed.

The location picker includes:

- a text input field for the user to enter a location
- a button to use the user's current location
- a map the user can click to set a new location

The text input field accepts the following formats

- Decimal degrees: "lat, long" (e.g., "37.7749, -122.4194").
- DMS (Degrees, Minutes, Seconds): "lat° long°" (e.g., "37° 46' 30.64" N, 122°
  25' 9.84" W").
- DDM (Degrees and Decimal Minutes): "lat° long'" (e.g., "37° 46.510' N, 122°
  25.164' W").
- Location name: "San Francisco"

The user lat/long is saved in the browser's local storage, so it persists
between page reloads.

If the lat/long is within 100 km of a one of the predefined locations, the app
will use the predefined location instead of the user's current location.

### Tonight Card

The Main Page of the app has a "Tonight" card that displays detailed
astronomical information for the current night, including the visibility of the
Milky Way, the Galactic Core rise and set times, moon phase, and Bortle scale
for the location.

By default, the user's current location is used, but they can change it by
clicking on a location label, which brings up a Location Picker.

The card contains the following information. Each element is listed in
chronological order (if it has a time component) and only include elements that
are in the future:

- Sun rise time (civil twilight)
- Sun set time (civil dawn)
- Astronomical twilight end time
- Astronomical twilight start time
- Moon rise time
- Moon set time
- Galactic Core rise time
- Galactic Core transit time
- Galactic Core set time
- Maximum altitude of the Galactic Core
- An icon representing the moon phase for the night
- An indicator of the visibility of the Milky Way (one to four stars)
- A percentage of the moon illumination for the night

### Daily Visibility Table

Below the Tonight card is a table with a row for the next seven days. The table
has the following columns:

- Date
- Visibility of the Milky Way (one to four stars)
- Galactic Core optimal viewing time (in local time)
- Galactic Core optimal viewing duration (in hours)

Clicking on one of the rows expands it to display the same information as the
Tonight card, but for that day, and perhaps with a more compact layout, but
without the text information about the location.

### Weekly Visibility Table

Below the Tonight card is a table with a row for each week of the year. The
table has the following columns:

- Week start date
- Visibility of the Milky Way (one to four stars)
- Galactic Core optimal viewing time (in local time)
- Galactic Core optimal viewing duration (in hours)

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
    <!-- Illustration: Star map showing location of the Galactic Core -->
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
      The <strong>brightest part</strong> of the Milky Way — the Galactic Core — is above
      the horizon at night during certain months. In the northern hemisphere, the best views
      are between <strong>April and September</strong>. In the southern hemisphere, it can be
      seen for longer and higher in the sky.
    </p>
    <!-- Illustration: Night-sky visibility calendar for both hemispheres -->
  </article>

  <article>
    <h3>6. Is the Milky Way moving?</h3>
    <p>
      Yes — the Sun and our entire solar system orbit the Galactic Core at about
      <strong>828,000 km/h</strong>, taking roughly <strong>225–250 million years</strong>
      to complete one orbit. The Milky Way itself is also moving relative to other galaxies.
    </p>
    <!-- Illustration: Animation or diagram of the Sun’s orbit in the galaxy -->
  </article>

  <article>
    <h3>7. How far away is the Galactic Core?</h3>
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

## Time Zone Handling

The timezone is handled carefully to ensure accurate date and time calculations
for the user's location.

When a time is displayed to the user it is displayed in the target location
local time in 24 hour format, and with no timezone indicator, for example
"23:45".

Internal calculations, including populating structured data, track the time zone
used.

## Astronomical Calculations

- Use the `astronomy-engine` library (https://github.com/cosinekitty/astronomy)
  to perform the necessary astronomical calculations.

- The app is built using React and TypeScript.

## Rating

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

This is combined to provide a rating from 0 to 4 stars, where:

- 0 stars: Poor visibility (e.g., moon is too bright, GC is below the horizon)
- 1 star: Fair visibility (e.g., GC is low, moon is bright)
- 2 stars: Good visibility (e.g., GC is above the horizon, moon is reasonably
  low)
- 3 stars: Very good visibility (e.g., GC is high, moon is low)
- 4 stars: Excellent visibility (e.g., GC is high, moon is below the horizon)
