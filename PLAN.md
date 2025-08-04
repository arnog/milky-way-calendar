- When clicking on "find me", location input field jumps to known location Also
  shown in Location button. Should only be used to show location description.

- The DARK_SITES have a lat/long which is somewhat arbitrary, although of course
  it should be close to where the site is. However, it may not be the darkest
  site in the area. The lat/long is used to find the Bortle value for the site,
  which is then used to find the darkest site in the area. As a result, the
  reported Bortle value for some sites may not be reflective of the darkest site
  in the area.

  Let's go over each DARK_SITE, and create a new DARK_SITE_BORTLE object that
  map the slug of a DARK_SITE to a new calculated Bortle value based on the
  darkest Bortle value in a 10km radius of the DARK_SITE lat/long.

  Then, when displaying the Bortle value for a DARK_SITE, use the
  DARK_SITE_BORTLE object to find the darkest Bortle value.

- Explore is showing a bunch of nearby locations that are clustered. If a
  location is within 10km of another, move on.

- Explore may need icons for maps, etc...

- In Explore, the location button should bring up to location popover.

  - The Find Nearest Dark Site button does not seem useful. The keys for the
    Found Locations Map are redundant. There should be only one, outside the map
    box

- Primary Dark Site -> Recommended Dark Site
