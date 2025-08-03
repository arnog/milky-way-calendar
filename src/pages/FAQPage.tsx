import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import styles from "../App.module.css";
import faqStyles from "./FAQPage.module.css";

export default function FAQPage() {
  const location = useLocation();

  useEffect(() => {
    // Check if there's a hash in the URL
    if (location.hash) {
      // Remove the # from the hash
      const id = location.hash.substring(1);
      // Find the element with that ID
      const element = document.getElementById(id);
      if (element) {
        // Scroll to the element with a small delay to ensure the page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);
  return (
    <>
      <Helmet>
        <title>FAQ - Milky Way Calendar</title>
        <meta
          name="description"
          content="Frequently Asked Questions about the Milky Way galaxy, its visibility, and astrophotography tips."
        />
        <meta property="og:title" content="FAQ - Milky Way Calendar" />
        <meta
          property="og:description"
          content="Frequently Asked Questions about the Milky Way galaxy, its visibility, and astrophotography tips."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="FAQ - Milky Way Calendar" />
        <meta
          name="twitter:description"
          content="Frequently Asked Questions about the Milky Way galaxy, its visibility, and astrophotography tips."
        />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
          <section
            id="milky-way-faq"
            className={`glass-morphism ${faqStyles.faqSection}`}
          >
            <h2 className={faqStyles.mainTitle}>
              Milky Way Frequently Asked Questions
            </h2>

            <div className={faqStyles.questionsContainer}>
              <article>
                <h3>What exactly is the Milky Way?</h3>
                <p>
                  The Milky Way is our home galaxy — a vast collection of around{" "}
                  <strong>100–400 billion stars</strong>, along with gas, dust,
                  and dark matter, all bound together by gravity. From Earth, we
                  see it as a glowing band because we're looking along the plane
                  of its disk from inside it.
                </p>
                <p>
                  Our galaxy is shaped like a flattened disk. When you look
                  toward the plane of that disk, you see many more stars packed
                  together, creating the hazy, cloudlike glow. Away from the
                  plane, fewer stars are in view, so the sky looks darker.
                </p>
              </article>

              <article>
                <h3>Why do I need a calendar for the Milky Way?</h3>
                <p>
                  The visibility of the Milky Way changes throughout the year
                  depending on your location, the position of the Galactic Core,
                  the phase of the Moon, and the time of night. A dedicated
                  Milky Way calendar helps you plan the best nights for viewing
                  or photographing it, ensuring dark, moonless skies when the
                  most striking parts of the galaxy are above the horizon.
                </p>
              </article>

              <article>
                <h3>Can I see the Milky Way from where I live?</h3>
                <p>
                  If you live in or near a city, light pollution may make it
                  invisible. You'll need a <strong>dark sky site</strong> away
                  from artificial lights. It's best seen on clear, moonless
                  nights, during your region's <em>Milky Way season</em> (spring
                  to early fall in the northern hemisphere, year-round in the
                  deep south).
                </p>
                <p>
                  If you live in the Northern Hemisphere, the Galactic Core is
                  towards the South. Then, look up and follow the band of light
                  towards the North.
                </p>
                <img
                  src="/looking-south.jpg"
                  alt="Looking south to see the Milky Way from the Northern Hemisphere"
                />
                <p>
                  For the Southern Hemisphere, the Galactic Core is towards the
                  North. As a bonus point, you get to see the Magellanic Clouds
                  which are a pair of irregular dwarf galaxies that orbit the
                  Milky Way and are visible with the naked eye.
                </p>
              </article>

              <article>
                <h3>Do I need special equipment to see the Milky Way?</h3>
                <p>
                  No — under dark skies, it’s visible to the naked eye as a
                  faint band of light. Binoculars can reveal star clusters and
                  nebulae, while telescopes can show finer details, but the
                  overall view is best appreciated without magnification.
                </p>
              </article>

              <article>
                <h3>Can we photograph it with a smartphone?</h3>
                <p>
                  Yes, if you have a phone with <strong>night mode</strong> or a
                  dedicated astrophotography mode, and you're under a dark sky.
                  A tripod helps. For detailed, colorful shots, a DSLR or
                  mirrorless camera with a wide, fast lens will produce better
                  results.
                </p>
              </article>

              <article>
                <h3>Why do some photos show so much color in the Milky Way?</h3>
                <p>
                  Human eyes aren't sensitive enough to see faint colors in low
                  light. Long-exposure photography collects more light,
                  revealing the pinks, reds, and blues from glowing hydrogen,
                  star clusters, and dust clouds.
                </p>
              </article>

              <article>
                <h3>How do I photograph the Milky Way without star trails?</h3>
                <p>
                  Use the “500 rule” as a guide: divide 500 by your lens focal
                  length (adjusted for crop factor) to get the maximum exposure
                  time in seconds before stars start trailing. For example, with
                  a 20&nbsp;mm lens on a full-frame camera: 500 ÷ 20 = 25
                  seconds.
                </p>
                <p>
                  If using a smartphone, just use the long exposure mode,
                  usually 30s, and your smartphone will do the rest. Make sure
                  to use a tripod, though!
                </p>
              </article>

              <article id="bortle-scale">
                <h3>What is the Bortle Scale?</h3>
                <p>
                  The <strong>Bortle scale</strong> is a nine-level scale that
                  measures the brightness of the night sky, ranging from{" "}
                  <em>Class 1</em> (excellent dark-sky site) to <em>Class 9</em>{" "}
                  (inner-city sky). It describes how much light pollution is
                  present and what celestial features can be seen with the naked
                  eye.
                </p>
                <p>
                  For example, in a Class 1 sky you can see the Milky Way
                  casting shadows and thousands of stars, while in a Class 9 sky
                  only the Moon, planets, and a few bright stars are visible.
                  Knowing your Bortle class helps you estimate how clearly
                  you'll see the Milky Way and other faint objects.
                </p>
              </article>

              <article>
                <h3>
                  Where is the <strong>Galactic Core (GC)</strong>, the center
                  of the Milky Way?
                </h3>
                <p>
                  The Milky Way is the entire galaxy, containing hundreds of
                  billions of stars. The Galactic Core is just its central
                  region, rich in stars, gas, and dust.
                </p>
                <p>
                  It lies in the direction of the constellation{" "}
                  <strong>Sagittarius</strong>, at a declination of about{" "}
                  <strong>29° south</strong>. This central region contains a
                  supermassive black hole called{" "}
                  <em>
                    Sagittarius A<sup>*</sup>
                  </em>
                  , with about 4 million times the Sun's mass.
                </p>
                <p>
                  It's about <strong>26,500 light-years</strong> away. The light
                  we see tonight left the center around the time humans were
                  first developing agriculture.
                </p>
              </article>

              <article>
                <h3>What is the best time of night to see the Milky Way?</h3>
                <p>
                  The ideal time is between the start of astronomical night,
                  when the sun is about 18° below the horizon, and before the
                  Moon rises, or after it sets, or if it's a new moon. This
                  ensures the sky is as dark as possible. The exact timing
                  depends on the season and your location, and the Milky Way
                  Calendar will give you the best time for observing, depending
                  on your location and time of the year.
                </p>
              </article>

              <article>
                <h3>Why is the Milky Way brighter in some months?</h3>
                <p>
                  The <strong>brightest part</strong> of the Milky Way — the
                  Galactic Core — is above the horizon at night during certain
                  months. In the northern hemisphere, the best views are between{" "}
                  <strong>April and September</strong>. In the southern
                  hemisphere, it can be seen for longer and higher in the sky.
                </p>
              </article>

              <article>
                <h3>
                  Why is it harder to see the Milky Way in winter in the
                  Northern Hemisphere?
                </h3>
                <p>
                  During northern winter nights, the Sun is aligned with the
                  Galactic Core, so from Earth we look outward toward the
                  galaxy’s outer disk. This part of the Milky Way has fewer
                  bright features, making it appear fainter.
                </p>
              </article>

              <article>
                <h3>What are the Magellanic Clouds?</h3>
                <p>
                  The Large and Small Magellanic Clouds are a pair of irregular
                  dwarf galaxies that orbit the Milky Way. Visible mainly from
                  the Southern Hemisphere, they appear as small, fuzzy patches
                  in the night sky and can be seen with the naked eye from dark
                  sites.
                </p>
              </article>

              <article>
                <h3>Will the Milky Way always look the same?</h3>
                <p>
                  The Sun and our entire solar system orbit the Galactic Core at
                  about <strong>828,000 km/h</strong>, taking roughly{" "}
                  <strong>225–250 million years</strong> to complete one orbit.
                  The Milky Way itself is also moving relative to other
                  galaxies.
                </p>
                <p>
                  Over millions of years, its shape in our sky will slowly
                  change as stars move and the Sun orbits the Galaxy. Billions
                  of years from now, the Milky Way will merge with the{" "}
                  <strong>Andromeda Galaxy</strong>, creating a new galaxy often
                  nicknamed "Milkomeda."
                </p>
              </article>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
