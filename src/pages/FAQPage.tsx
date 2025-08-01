import { Helmet } from "react-helmet";
import styles from "../App.module.css";
import faqStyles from "./FAQPage.module.css";

export default function FAQPage() {
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
          <section id="milky-way-faq" className={`glass-morphism ${faqStyles.faqSection}`}>
            <h2 className={faqStyles.mainTitle}>
              Milky Way Frequently Asked Questions
            </h2>

            <div className={faqStyles.questionsContainer}>
              <article className={faqStyles.questionArticle}>
                <h3 className={faqStyles.questionTitle}>
                  1. What exactly is the Milky Way?
                </h3>
                <p className={faqStyles.questionText}>
                  The Milky Way is our home galaxy — a vast collection of around{" "}
                  <strong>100–400 billion stars</strong>, along with gas, dust,
                  and dark matter, all bound together by gravity. From Earth, we
                  see it as a glowing band because we're looking along the plane
                  of its disk from inside it.
                </p>
              </article>

              <article className={faqStyles.questionArticle}>
                <h3 className={faqStyles.questionTitle}>
                  2. Why does the Milky Way look like a band?
                </h3>
                <p className={faqStyles.questionText}>
                  Our galaxy is shaped like a flattened disk. When you look
                  toward the plane of that disk, you see many more stars packed
                  together, creating the hazy, cloudlike glow. Away from the
                  plane, fewer stars are in view, so the sky looks darker.
                </p>
              </article>

              <article className={faqStyles.questionArticle}>
                <h3 className={faqStyles.questionTitle}>
                  3. Where is the <strong>Galactic Core (GC)</strong>, the
                  center of the Milky Way?
                </h3>
                <p className={faqStyles.questionText}>
                  It lies in the direction of the constellation{" "}
                  <strong>Sagittarius</strong>, at a declination of about{" "}
                  <strong>29° south</strong>. This central region contains a
                  supermassive black hole called{" "}
                  <em>
                    Sagittarius A<sup>*</sup>
                  </em>
                  , with about 4 million times the Sun's mass.
                </p>
              </article>

              <article className={faqStyles.questionArticle}>
                <h3 className={faqStyles.questionTitle}>
                  4. Can I see the Milky Way from where I live?
                </h3>
                <p className={faqStyles.questionText}>
                  If you live in or near a city, light pollution may make it
                  invisible. You'll need a <strong>dark sky site</strong> away
                  from artificial lights. It's best seen on clear, moonless
                  nights, during your region's <em>Milky Way season</em> (spring
                  to early fall in the northern hemisphere, year-round in the
                  deep south).
                </p>
                <p className={faqStyles.questionText}>
                  If you live in the Northern Hemisphere, the Galactic Core is
                  towards the South. Then, look up and follow the band of light
                  towards the North.
                </p>
                <p className={faqStyles.questionText}>
                  For the Southern Hemisphere, the Galactic Core is towards the
                  North. As a bonus point, you get to see the Magellanic Clouds
                  which are a pair of irregular dwarf galaxies that orbit the
                  Milky Way and are visible with the naked eye.
                </p>
              </article>

              <article className={faqStyles.questionArticle}>
                <h3 className={faqStyles.questionTitle}>
                  5. Why is the Milky Way brighter in some months?
                </h3>
                <p className={faqStyles.questionText}>
                  The <strong>brightest part</strong> of the Milky Way — the
                  Galactic Core — is above the horizon at night during certain
                  months. In the northern hemisphere, the best views are between{" "}
                  <strong>April and September</strong>. In the southern
                  hemisphere, it can be seen for longer and higher in the sky.
                </p>
              </article>

              <article className={faqStyles.questionArticle}>
                <h3 className={faqStyles.questionTitle}>
                  6. Is the Milky Way moving?
                </h3>
                <p className={faqStyles.questionText}>
                  Yes — the Sun and our entire solar system orbit the Galactic
                  Core at about <strong>828,000 km/h</strong>, taking roughly{" "}
                  <strong>225–250 million years</strong> to complete one orbit.
                  The Milky Way itself is also moving relative to other
                  galaxies.
                </p>
              </article>

              <article className={faqStyles.questionArticle}>
                <h3 className={faqStyles.questionTitle}>
                  7. How far away is the Galactic Core?
                </h3>
                <p className={faqStyles.questionText}>
                  It's about <strong>26,500 light-years</strong> away. The light
                  we see tonight left the center around the time humans were
                  first developing agriculture.
                </p>
              </article>

              <article className={faqStyles.questionArticle}>
                <h3 className={faqStyles.questionTitle}>
                  8. Can we photograph it with a smartphone?
                </h3>
                <p className={faqStyles.questionText}>
                  Yes, if you have a phone with <strong>night mode</strong> or a
                  dedicated astrophotography mode, and you're under a dark sky.
                  A tripod helps. For detailed, colorful shots, a DSLR or
                  mirrorless camera with a wide, fast lens will produce better
                  results.
                </p>
              </article>

              <article className={faqStyles.questionArticle}>
                <h3 className={faqStyles.questionTitle}>
                  9. Why do some photos show so much color in the Milky Way?
                </h3>
                <p className={faqStyles.questionText}>
                  Human eyes aren't sensitive enough to see faint colors in low
                  light. Long-exposure photography collects more light,
                  revealing the pinks, reds, and blues from glowing hydrogen,
                  star clusters, and dust clouds.
                </p>
              </article>

              <article className={faqStyles.questionArticle}>
                <h3 className={faqStyles.questionTitle}>
                  10. Will the Milky Way always look the same?
                </h3>
                <p className={faqStyles.questionText}>
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
