- [ ] Improve visual of clock face. - Make sun/moon arc less prominent -
      Highlight observation event with contrasting background color - Display
      observation period as a slice rather than an arc - Display observation
      countdown as a complication above clock center
- [ ] When arcs are highlited (on hover), each segment is highlighted which
      gives breaks the illusion they are a gradient. Instead, draw an arc below
      the current one, with highlighting, when the user is over the arc.
- [ ] Review how Nearby Dark Sites are calculated. Maybe should only used known
      dark sites, not just finding something on the map. The secondary sites
      could use the Bortle map. Fallback to nearest low Bortle if no known site
      within 500km.
- [ ] In field mode, the colors of clock (arcs) should transition to shades or
      red.
- [ ] Build a React Native version.
