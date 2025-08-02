/*
## Instructions

Instructions for Writing Location Descriptions

Each entry should be an HTML string that will render nicely in a web app.
Use the compact location identifier as the key (matching your SPECIAL_LOCATIONS fifth element).

⸻

1. Heading:
	•	Begin with an <h2> containing the official site name (e.g., “Bryce Canyon National Park”).

⸻

2. Introductory Paragraphs:
	•	Describe the overall darkness and sky quality:
	•	Give the typical Bortle scale rating and a qualitative summary (“Bortle 2 skies”, “virtually no light pollution”, etc.).
	•	Analyze light pollution:
	•	Name nearby cities and note where glows appear on the horizon.
	•	Mention if these can be avoided by facing certain directions or by choosing specific areas.
	•	Seasonal & Celestial Highlights:
	•	Milky Way core season: Which months is it visible?
	•	Best time of night or year (e.g., “core at zenith in July”, “best after midnight in spring”).
	•	Other phenomena: Mention notable meteor showers, potential for aurora (if applicable), southern objects (Magellanic Clouds), etc.
	•	Moon phase tips: Recommend new moon or “week after first quarter” for best dark sky photography.
	•	Unique site extras:
	•	Mention any famous astronomy events (star parties, festivals, ranger-led programs).
	•	Any signature experiences or unique challenges (e.g., fog, wildlife, temperature swings).

⸻

3. Stargazing Spots (Ordered List):
	•	Use an <ol> with at least two, up to four, specific named locations in the park for night sky photography.
	•	Each <li> should include:
	•	The location name (bolded).
	•	A phrase about what makes it ideal (“wide open horizons”, “iconic foregrounds”, “reflective water”, etc.).
	•	If possible, tips on what’s visible (e.g., “core aligns with the arch in June”).

⸻

4. Practical Sections (Each as a Subheading and Paragraph):

Use <h3> for subheadings:

Camping
	•	Options inside the park (campgrounds, backcountry, dispersed, or none).
	•	Which are best for dark skies or easy night access?
	•	Mention reservations, seasonality, or special rules if relevant.

Lodging
	•	Notable hotels, lodges, or towns nearby.
	•	Which ones are closest or offer the least light pollution?

Access
	•	Best time(s) of year, seasonal closures, weather challenges.
	•	Park hours, road access, need for permits, or other tips for night shooters.

Official Links
	•	Always close with:

<p><a href="...">Official [Site Name] Website</a></p>

(or the most authoritative astronomy link if it’s a dark sky park)

⸻

Style/Tone Guidelines
	•	Friendly, knowledgeable, and encouraging.
	•	Write to an audience that includes both serious astrophotographers and newcomers.
	•	Avoid long, dense paragraphs; break up ideas for clarity.
	•	Specific, actionable info is better than generic prose (“shoot facing east from X trail for the darkest skies”).
	•	Add small “insider tips” where possible (“arrive early for astronomy events,” “bring bug spray in May”).
	•	Emphasize what makes the location special for stargazers.

⸻

Example Template

<h2>Official Site Name</h2>
<p>Describe overall sky quality and darkness, with Bortle scale.</p>
<p>Discuss sources of light pollution and how to avoid them.</p>
<p><em>Seasonal highlights:</em> When is the Milky Way visible? Are there notable meteor showers, aurora, or other celestial events?</p>
<ol>
  <li><strong>Best Spot #1</strong> – Why it’s great for stargazing or astrophotography.</li>
  <li><strong>Best Spot #2</strong> – What’s visible or unique about this spot.</li>
</ol>
<h3>Camping</h3>
<p>Options and tips for overnight stays.</p>
<h3>Lodging</h3>
<p>Closest/most useful places to stay for night sky access.</p>
<h3>Access</h3>
<p>When and how to get there, road/seasonal tips, safety info.</p>
<h3>Official Links</h3>
<p><a href="...">Official [Site Name] Website</a></p>


  */

export const SPECIAL_LOCATION_DESCRIPTIONS: Record<string, string> = {
  yellowstone: `
    <h2>Yellowstone National Park</h2>
    <p>Yellowstone is a stargazer’s paradise, with vast swaths of Bortle 1–2 skies that rank among the darkest in the continental U.S. The park’s remote high plateaus, geothermal basins, and mirror-like lakes create otherworldly foregrounds for Milky Way photography.</p>
    <p>Light pollution is almost nonexistent in the park’s central and southern reaches, but faint glows can be seen toward Gardiner, West Yellowstone, and Cody on the horizons. Wildlife such as bison, elk, and wolves roam freely, making night travel here exhilarating but requiring caution.</p>
    <p>The Milky Way core is best viewed here from late May to early September, with the Galactic Core reaching its highest point in the sky around midnight in July. Autumn brings crystal-clear air, fewer visitors, and more hours of true darkness.</p>

    <ol>
      <li><strong>Lamar Valley</strong> – Sweeping meadows with unobstructed horizons and almost zero light pollution; ideal for wide-field Milky Way arcs.</li>
      <li><strong>Hayden Valley</strong> – Misty rivers at dawn provide ethereal foregrounds for night-to-day timelapses.</li>
      <li><strong>West Thumb on Yellowstone Lake</strong> – Combines geothermal features, water reflections, and pristine skies.</li>
    </ol>

    <h3>Camping</h3>
    <p>Bridge Bay Campground offers lakeside access to dark skies, while Slough Creek is perfect for remote solitude. Backcountry camping permits are required for more isolated spots.</p>

    <h3>Lodging</h3>
    <p>Old Faithful Snow Lodge is open in winter and provides rare cold-season astrophotography opportunities. Lake Yellowstone Hotel offers comfort close to prime Milky Way locations.</p>

    <h3>Access</h3>
    <p>Most interior roads open late May through early November. Snow and wildlife may restrict night driving in shoulder seasons.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/yell/">Official Yellowstone NP Website</a></p>
  `,

  yosemite: `
    <h2>Yosemite National Park</h2>
    <p>Yosemite pairs some of the world’s most iconic landscapes with surprisingly dark skies, especially in its high country. From the Bortle 2 skies of Tuolumne Meadows to the Bortle 4 glow of Yosemite Valley, the contrast in conditions is as dramatic as its granite walls.</p>
    <p>Light domes from Fresno, Madera, and Modesto subtly affect southern and western horizons, but high-elevation viewpoints easily rise above them. Summer offers warm, dry nights for Milky Way shooting, while winter brings snowy foregrounds for dramatic contrasts.</p>
    <p>The park hosts popular astronomy programs at <strong>Glacier Point</strong> on select summer weekends, featuring powerful telescopes and ranger-led talks—perfect for pairing stargazing with photography.</p>

    <ol>
      <li><strong>Glacier Point</strong> – Unbeatable panoramas of Half Dome under the Milky Way; best in July–August when the core sits high above the horizon.</li>
      <li><strong>Olmsted Point</strong> – Smooth granite slabs and sparse pines create minimalist yet striking compositions.</li>
      <li><strong>Tuolumne Meadows</strong> – Alpine meadow expanses with minimal artificial light; excellent for timelapses.</li>
    </ol>

    <h3>Camping</h3>
    <p>Tuolumne Meadows Campground offers prime high-country access but is only open summer–early fall. Upper Pines is the best valley-floor option but has more light pollution.</p>

    <h3>Lodging</h3>
    <p>The Ahwahnee Hotel offers comfort and iconic architecture but is in the valley’s brighter zone. For darker skies, White Wolf Lodge and High Sierra Camps are better bases.</p>

    <h3>Access</h3>
    <p>Tioga Pass opens late May–July depending on snowpack. Arrive early for Glacier Point events; parking fills quickly on astronomy nights.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/yose/">Official Yosemite NP Website</a></p>
  `,

  sequoia: `
    <h2>Sequoia National Park</h2>
    <p>Sequoia’s Bortle 2–3 skies come alive above the silhouettes of the largest trees on Earth. High-elevation viewpoints often sit above low-lying haze, offering pristine Milky Way visibility.</p>
    <p>Light domes from the Central Valley are visible on the western horizon, but disappear entirely when shooting east or overhead. Clear nights in summer and early fall are best; winter offers low humidity but restricted road access.</p>
    <p>The combination of ancient giant sequoias and the galactic core in a single frame is unique to this park, especially in the Giant Forest region.</p>

    <ol>
      <li><strong>Moro Rock</strong> – 360° views and a dramatic granite perch; watch for strong winds.</li>
      <li><strong>Crescent Meadow</strong> – Meadow foregrounds framed by towering trees; low visitor traffic at night.</li>
      <li><strong>Panorama Point</strong> – Elevated perspective with minimal western light dome.</li>
    </ol>

    <h3>Camping</h3>
    <p>Lodgepole Campground is well-situated for dark sky shooting. Atwood and Dorst Creek offer quieter stays deeper in the forest.</p>

    <h3>Lodging</h3>
    <p>Wuksachi Lodge provides year-round lodging in the heart of the park. Cabins in nearby Kings Canyon expand dark-sky access.</p>

    <h3>Access</h3>
    <p>Snow can linger into late May. Many high-country sites are accessible only by winding mountain roads—plan extra travel time for night shoots.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/seki/">Official Sequoia & Kings Canyon NP Website</a></p>
  `,
  kingscanyon: `
    <h2>Kings Canyon National Park</h2>
    <p>Kings Canyon is one of California’s least light-polluted mountain parks, with Bortle 2 skies dominating its deep valleys and rugged peaks. Its remote location and fewer visitors compared to Yosemite make it a quiet astrophotography haven.</p>
    <p>Light pollution is negligible except for a faint glow from Fresno to the west, which can be avoided by facing east toward the Sierra crest. Summer nights are warm in the valley but cool quickly at higher elevations.</p>
    <p>The Milky Way core is visible from late May to early September, with August offering the highest, brightest core above the canyon walls.</p>

    <ol>
      <li><strong>Panoramic Point</strong> – Expansive views across the canyon; perfect for wide-field astrophotography.</li>
      <li><strong>Cedar Grove</strong> – Towering cliffs frame the Galactic Core dramatically.</li>
      <li><strong>Zumwalt Meadow</strong> – River reflections with forest silhouettes under the Milky Way.</li>
    </ol>

    <h3>Camping</h3>
    <p>Cedar Grove and Sheep Creek Campgrounds have minimal artificial light and easy access to open views of the night sky.</p>

    <h3>Lodging</h3>
    <p>Grant Grove Cabins offer rustic charm and proximity to high-elevation viewpoints.</p>

    <h3>Access</h3>
    <p>The Cedar Grove area is only open late spring through fall due to snow. Roads are winding—allow extra time for night driving.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/seki/">Official Sequoia & Kings Canyon NP Website</a></p>
  `,

  pinnacles: `
    <h2>Pinnacles National Park</h2>
    <p>Pinnacles, known for its jagged rock spires and rare California condors, offers Bortle 3 skies in the east and Bortle 4 in the west. Its proximity to the coast means occasional marine layer fog, which can actually block coastal light domes for clearer stars above.</p>
    <p>Light domes from Salinas and Hollister affect the northern and western horizons but are easily avoided by shooting east toward the mountains.</p>

    <ol>
      <li><strong>High Peaks Trail</strong> – Sweeping views above the rock formations, ideal for galactic arcs.</li>
      <li><strong>Bear Gulch Reservoir</strong> – Calm water reflections and unique rock silhouettes.</li>
    </ol>

    <h3>Camping</h3>
    <p>Pinnacles Campground on the east side has the darkest skies and direct hiking access to prime locations.</p>

    <h3>Lodging</h3>
    <p>No lodges inside the park; nearest accommodations are in Soledad and Hollister.</p>

    <h3>Access</h3>
    <p>East entrance is best for night access; the west entrance closes at sunset.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/pinn/">Official Pinnacles NP Website</a></p>
  `,

  redwood: `
    <h2>Redwood National and State Parks</h2>
    <p>The towering coastal redwoods provide a surreal foreground for astrophotography. While the coastal fog can be a challenge, clear inland areas within the park reach Bortle 2–3 skies.</p>
    <p>Light domes from Crescent City and Eureka are minor but noticeable to the west; inland shooting toward the forest or eastward hills provides darker skies.</p>

    <ol>
      <li><strong>Prairie Creek Redwoods</strong> – Dense groves for Milky Way peeking through the canopy.</li>
      <li><strong>Bald Hills</strong> – Above the fog line, with sweeping inland views.</li>
    </ol>

    <h3>Camping</h3>
    <p>Gold Bluffs Beach Campground offers unique oceanfront stargazing opportunities, weather permitting.</p>

    <h3>Lodging</h3>
    <p>Nearby towns like Klamath and Orick have small inns; camping provides the best night sky access.</p>

    <h3>Access</h3>
    <p>Fog is common in summer; best astrophotography conditions occur after inland heat pushes fog offshore.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/redw/">Official Redwood NP Website</a></p>
  `,

  channelislands: `
    <h2>Channel Islands National Park</h2>
    <p>Offshore isolation gives the Channel Islands some of the darkest skies in Southern California (Bortle 2). The lack of large-scale lighting on the islands means pristine Milky Way views—though marine haze can affect clarity.</p>
    <p>Light domes from Los Angeles and Ventura are faint glows low on the northern horizon, largely blocked by island terrain.</p>

    <ol>
      <li><strong>Scorpion Anchorage (Santa Cruz Island)</strong> – Beachfront views with minimal obstruction.</li>
      <li><strong>Anacapa Island Lookout</strong> – Open ocean horizon and minimal artificial light.</li>
    </ol>

    <h3>Camping</h3>
    <p>Scorpion Ranch Campground offers walk-in sites right near dark beaches. All camping is primitive; bring all supplies.</p>

    <h3>Lodging</h3>
    <p>No lodging on the islands; overnight stays require camping.</p>

    <h3>Access</h3>
    <p>Reached only by boat or small plane; check ferry schedules and plan around weather.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/chis/">Official Channel Islands NP Website</a></p>
  `,

  glacier: `
    <h2>Glacier National Park</h2>
    <p>Glacier’s Bortle 1–2 skies are legendary, with towering peaks and alpine lakes perfect for Milky Way reflections. High-altitude air offers exceptional clarity, especially in late summer.</p>
    <p>Light domes are almost nonexistent except for faint glows near Kalispell and east-side towns. Ranger-led astronomy programs are held at Logan Pass and Apgar Village during summer.</p>

    <ol>
      <li><strong>Logan Pass</strong> – Milky Way rising over jagged peaks; high alpine foregrounds.</li>
      <li><strong>Lake McDonald</strong> – Still water for pristine reflections of the night sky.</li>
      <li><strong>Many Glacier</strong> – Dramatic mountain silhouettes beneath the galactic arc.</li>
    </ol>

    <h3>Camping</h3>
    <p>Many Glacier Campground provides dark skies with minimal travel after night shoots.</p>

    <h3>Lodging</h3>
    <p>Historic lodges like Many Glacier Hotel and Lake McDonald Lodge combine comfort with proximity to dark skies.</p>

    <h3>Access</h3>
    <p>Going-to-the-Sun Road opens late June–July depending on snowpack. Nights are cold even in summer.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/glac/">Official Glacier NP Website</a></p>
  `,

  grandteton: `
    <h2>Grand Teton National Park</h2>
    <p>With Bortle 1–2 skies and iconic jagged peaks, Grand Teton is a premier Milky Way location. The combination of mountains, reflective lakes, and open meadows offers countless compositions.</p>
    <p>Light domes from Jackson and Idaho Falls are faint and limited to certain horizons; the majority of the park is pristine.</p>

    <ol>
      <li><strong>Snake River Overlook</strong> – Ansel Adams’ famous viewpoint, stunning under the Milky Way.</li>
      <li><strong>Oxbow Bend</strong> – Reflections of Mount Moran beneath the stars.</li>
      <li><strong>Mormon Row</strong> – Historic barns with dramatic galactic backdrops.</li>
    </ol>

    <h3>Camping</h3>
    <p>Jenny Lake Campground offers dark skies close to iconic viewpoints.</p>

    <h3>Lodging</h3>
    <p>Jackson Lake Lodge provides comfort with panoramic mountain views.</p>

    <h3>Access</h3>
    <p>Summer and early fall are best; winter access is limited.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/grte/">Official Grand Teton NP Website</a></p>
  `,

  rockymountain: `
    <h2>Rocky Mountain National Park</h2>
    <p>High elevation and Bortle 2 skies make Rocky Mountain a superb Milky Way destination. Thin air offers sharp clarity, though summer thunderstorms are common.</p>
    <p>Light domes from Denver and Boulder affect the east, but western viewpoints remain dark.</p>

    <ol>
      <li><strong>Trail Ridge Road</strong> – Panoramic alpine views above treeline.</li>
      <li><strong>Bear Lake</strong> – Foreground reflections with mountain silhouettes.</li>
    </ol>

    <h3>Camping</h3>
    <p>Glacier Basin and Moraine Park Campgrounds are centrally located for night shoots.</p>

    <h3>Lodging</h3>
    <p>Nearby Estes Park offers lodging, but in-park camping provides better late-night access.</p>

    <h3>Access</h3>
    <p>Trail Ridge Road is seasonal, usually open late May to October.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/romo/">Official Rocky Mountain NP Website</a></p>
  `,
  whitesands: `
    <h2>White Sands National Park</h2>
    <p>White Sands is a surreal location for night photography, with rolling gypsum dunes glowing under Bortle 2 skies. The bright white sand reflects starlight, creating an almost lunar experience.</p>
    <p>Light domes from Alamogordo and Las Cruces are visible to the east and west but remain low on the horizon; the zenith and southern skies are pristine. Summer nights are warm and clear, while winter offers crisp air and fewer visitors.</p>
    <p>The Milky Way core is visible from late spring to early fall, with the contrast between the white dunes and the deep sky making for striking compositions.</p>

    <ol>
      <li><strong>Dune Life Nature Trail</strong> – Foreground dunes with minimal footprints; great for star trails.</li>
      <li><strong>Backcountry Camping Zone</strong> – Ultimate solitude and uninterrupted horizons.</li>
    </ol>

    <h3>Camping</h3>
    <p>Only backcountry camping is allowed; permits required. Campers can photograph late into the night without park exit restrictions.</p>

    <h3>Lodging</h3>
    <p>Nearby Alamogordo offers the closest accommodations; choose lodging on the park’s western side to minimize driving after night shoots.</p>

    <h3>Access</h3>
    <p>Check for missile range closures, which occasionally limit access. Summer afternoons can bring sudden thunderstorms.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/whsa/">Official White Sands NP Website</a></p>
  `,

  mojave: `
    <h2>Mojave National Preserve</h2>
    <p>Mojave’s vast desert expanse offers Bortle 2 skies across most of the preserve. The dry air, wide horizons, and unusual features like lava flows and sand dunes create unique foregrounds.</p>
    <p>Light domes from Las Vegas and Barstow are faint and far off; most of the preserve offers unobstructed views of the Galactic Core.</p>

    <ol>
      <li><strong>Kelso Dunes</strong> – Sweeping dune fields with zero artificial light nearby.</li>
      <li><strong>Hole-in-the-Wall</strong> – Dramatic rock formations under dark skies.</li>
    </ol>

    <h3>Camping</h3>
    <p>Hole-in-the-Wall and Mid Hills Campgrounds are well-placed for stargazing. Dispersed camping is allowed in many areas.</p>

    <h3>Lodging</h3>
    <p>No lodging inside the preserve; Needles and Baker offer basic accommodations.</p>

    <h3>Access</h3>
    <p>Summer days can exceed 110°F; spring and fall are ideal for night photography.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/moja/">Official Mojave NP Website</a></p>
  `,

  greatsmokymountains: `
    <h2>Great Smoky Mountains National Park</h2>
    <p>The Smokies have Bortle 3–4 skies, with the best dark areas in the park’s higher elevations and remote valleys. Humidity and haze are common, but clear nights can be spectacular.</p>
    <p>Light domes from Knoxville, Gatlinburg, and Asheville are visible in certain directions; shoot toward the park’s interior for darker skies.</p>

    <ol>
      <li><strong>Clingmans Dome</strong> – Highest point in the park, with panoramic star views.</li>
      <li><strong>Cades Cove</strong> – Wide open valley perfect for Milky Way arcs.</li>
    </ol>

    <h3>Camping</h3>
    <p>Backcountry sites offer the darkest skies; Cades Cove Campground is convenient for valley shots.</p>

    <h3>Lodging</h3>
    <p>Gatlinburg and Cherokee have plentiful lodging, but light pollution is higher near towns.</p>

    <h3>Access</h3>
    <p>Spring and fall have the clearest skies; summer humidity can reduce transparency.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/grsm/">Official Great Smoky Mountains NP Website</a></p>
  `,

  everglades: `
    <h2>Everglades National Park</h2>
    <p>Everglades offers Bortle 3 skies in its southern reaches, with open marshlands and water channels for unique night compositions. The flat terrain provides unobstructed horizons in all directions.</p>
    <p>Light domes from Miami and Naples are visible to the north and east; the darkest skies are found in Flamingo and the southern waterways.</p>

    <ol>
      <li><strong>Flamingo Marina</strong> – Expansive southern sky views with minimal obstructions.</li>
      <li><strong>Paurotis Pond</strong> – Peaceful setting with wildlife activity at night.</li>
    </ol>

    <h3>Camping</h3>
    <p>Flamingo Campground offers the darkest skies in the park and easy access to water-based shooting locations.</p>

    <h3>Lodging</h3>
    <p>Flamingo has eco-tents and limited lodging; most accommodations are outside the park.</p>

    <h3>Access</h3>
    <p>Best in the dry season (November–April) to avoid mosquitoes and heavy rains.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/ever/">Official Everglades NP Website</a></p>
  `,

  badlands: `
    <h2>Badlands National Park</h2>
    <p>Badlands is one of the darkest locations in the Midwest, with Bortle 1–2 skies and dramatic eroded formations as foregrounds. The arid climate means clear nights are common.</p>
    <p>Light domes are minimal, with only small glows from Rapid City far to the west.</p>

    <ol>
      <li><strong>Panorama Point</strong> – Wide vistas with layered badlands formations.</li>
      <li><strong>Sage Creek Basin</strong> – Remote area with wildlife and zero artificial light.</li>
    </ol>

    <h3>Camping</h3>
    <p>Cedar Pass Campground offers convenience; Sage Creek is primitive but much darker.</p>

    <h3>Lodging</h3>
    <p>Interior and Wall have small motels; camping provides better access to late-night shoots.</p>

    <h3>Access</h3>
    <p>Summer offers warm nights; winter skies are crystal clear but very cold.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/badl/">Official Badlands NP Website</a></p>
  `,

  acadia: `
    <h2>Acadia National Park</h2>
    <p>Acadia’s rocky coastline provides unique foregrounds for Milky Way shots. Bortle 3–4 skies dominate, with darker conditions on the Schoodic Peninsula.</p>
    <p>Light domes from Bar Harbor and surrounding towns affect certain horizons; timing shoots for late-night hours reduces their impact.</p>

    <ol>
      <li><strong>Cadillac Mountain</strong> – Panoramic views over the Atlantic.</li>
      <li><strong>Schoodic Point</strong> – Rugged coastlines with darker skies than Mount Desert Island.</li>
    </ol>

    <h3>Camping</h3>
    <p>Schoodic Woods Campground is quieter and darker than Blackwoods.</p>

    <h3>Lodging</h3>
    <p>Bar Harbor offers many options but with higher light pollution; consider smaller towns nearby.</p>

    <h3>Access</h3>
    <p>Fog is common in summer; fall offers clear, crisp nights.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/acad/">Official Acadia NP Website</a></p>
  `,

  haleakala: `
    <h2>Haleakalā National Park</h2>
    <p>At 10,000 feet, Haleakalā offers Bortle 1 skies and a front-row seat to the universe. The thin air and isolation in the Pacific make for unmatched clarity.</p>
    <p>Light domes from Kahului and Lahaina are minimal and blocked by terrain.</p>

    <ol>
      <li><strong>Summit Area</strong> – 360° views above the clouds.</li>
      <li><strong>Kalahaku Overlook</strong> – Stunning views into the volcanic crater under the Milky Way.</li>
    </ol>

    <h3>Camping</h3>
    <p>Hosmer Grove Campground is just below the summit and ideal for early-morning Milky Way shots.</p>

    <h3>Lodging</h3>
    <p>No lodging in the summit area; accommodations are in nearby towns.</p>

    <h3>Access</h3>
    <p>Temperatures can drop below freezing at night, even in summer; bring warm clothing.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/hale/">Official Haleakalā NP Website</a></p>
  `,

  denali: `
    <h2>Denali National Park</h2>
    <p>Denali’s vast wilderness offers Bortle 1 skies in many locations. In summer, true darkness is minimal due to long daylight hours; fall and winter are best for astrophotography.</p>
    <p>Light pollution is nonexistent except for small glows near the park entrance.</p>

    <ol>
      <li><strong>Eielson Visitor Center</strong> – Unobstructed alpine views.</li>
      <li><strong>Wonder Lake</strong> – Foregrounds with Denali itself under the stars.</li>
    </ol>

    <h3>Camping</h3>
    <p>Wonder Lake Campground is deep in the park and ideal for dark sky photography.</p>

    <h3>Lodging</h3>
    <p>Limited lodges inside the park; most are near the entrance.</p>

    <h3>Access</h3>
    <p>Park road access is limited; photography tours can help reach remote areas.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/dena/">Official Denali NP Website</a></p>
  `,

  statueofliberty: `
    <h2>Statue of Liberty National Monument</h2>
    <p>While not a dark sky location, the Statue of Liberty offers iconic night shots with city light as a dramatic backdrop. Bortle 8–9 skies mean no Milky Way visibility, but the skyline makes for spectacular urban astrophotography.</p>
    <p>Light pollution is intense, but the monument’s lighting creates strong contrast against the night sky.</p>

    <ol>
      <li><strong>Liberty Island</strong> – The best angles for the statue itself.</li>
      <li><strong>Battery Park</strong> – Skyline compositions with the statue in the distance.</li>
    </ol>

    <h3>Camping</h3>
    <p>No camping available.</p>

    <h3>Lodging</h3>
    <p>Stay in Manhattan or Jersey City for easy access.</p>

    <h3>Access</h3>
    <p>Ferry access only; night access is limited to special events.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/stli/">Official Statue of Liberty NM Website</a></p>
  `,

  naturalbridges: `
    <h2>Natural Bridges National Monument</h2>
    <p>Natural Bridges was the first International Dark Sky Park, with pristine Bortle 2 skies and iconic sandstone bridges that make stunning Milky Way foregrounds.</p>
    <p>Light domes are negligible; occasional faint glows from distant towns can be avoided by careful framing.</p>

    <ol>
      <li><strong>Owachomo Bridge</strong> – Best Milky Way alignment in summer months.</li>
      <li><strong>Kachina Bridge</strong> – Massive structure for dramatic silhouettes.</li>
    </ol>

    <h3>Camping</h3>
    <p>Small first-come, first-served campground within the monument offers immediate access to dark skies.</p>

    <h3>Lodging</h3>
    <p>Closest lodging is in Blanding, Utah, about 40 minutes away.</p>

    <h3>Access</h3>
    <p>Year-round access, but summer is best for core visibility; roads are paved.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/nabr/">Official Natural Bridges NM Website</a></p>
  `,
  deathvalley: `
    <h2>Death Valley National Park</h2>
    <p>Death Valley offers some of the darkest skies in North America, with pristine Bortle 1-2 conditions throughout most of the park. The vast desert landscape, dramatic mountain ranges, and unique geological features create stunning foregrounds for astrophotography.</p>
    <p>Light pollution is virtually nonexistent except for a faint glow from Las Vegas to the southeast, which can be avoided by facing north or west. The park's extreme elevation changes—from 282 feet below sea level to over 11,000 feet—offer diverse photographic opportunities.</p>
    <p>Death Valley's dry desert air provides exceptional atmospheric clarity, making it ideal for deep-sky photography. The Milky Way core is visible from spring through fall, with optimal viewing from May through September.</p>
    <ol>
      <li><strong>Badwater Basin</strong> – The lowest point in North America offers unique salt flat reflections under starry skies.</li>
      <li><strong>Mesquite Flat Sand Dunes</strong> – Rolling dunes create flowing foregrounds for Milky Way compositions.</li>
      <li><strong>Zabriskie Point</strong> – Iconic badlands terrain with panoramic dark sky views.</li>
      <li><strong>Racetrack Playa</strong> – Remote dry lakebed with mysterious moving rocks and pristine darkness.</li>
    </ol>
    <h3>Camping</h3>
    <p>Furnace Creek Campground is central but has some light pollution from facilities. Texas Spring offers darker skies. Backcountry camping is permitted with restrictions.</p>
    <h3>Lodging</h3>
    <p>The Inn at Death Valley (formerly Furnace Creek Inn) offers luxury accommodations, while Stovepipe Wells Village provides more budget-friendly options in a darker location.</p>
    <h3>Access</h3>
    <p>Summer temperatures can exceed 120°F, making fall through spring the best visiting seasons. Many roads are paved, but high-clearance vehicles are recommended for remote areas.</p>
    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/deva/">Official Death Valley NP Website</a></p>
  `,
  joshuatree: `
    <h2>Joshua Tree National Park</h2>
    <p>Joshua Tree is a world-class dark sky destination, with most of the park falling under Bortle 2 skies. The surreal desert landscape—filled with the park’s namesake trees and massive boulders—offers endless foreground possibilities.</p>
    <p>Light domes from Palm Springs, Twentynine Palms, and the Coachella Valley are visible near the horizon but can be avoided by facing deeper into the park. Spring and summer offer prime Milky Way visibility, with the core rising soon after sunset by mid-summer.</p>
    <p>Ranger-led astronomy programs are held at the Oasis Visitor Center and Cottonwood; local astronomy clubs often host star parties at Hidden Valley.</p>

    <ol>
      <li><strong>Arch Rock</strong> – Perfect natural framing for the Galactic Core in summer months.</li>
      <li><strong>Cap Rock</strong> – Iconic Joshua tree silhouettes with open sky.</li>
      <li><strong>Skull Rock</strong> – Unique rock formation under the Milky Way.</li>
    </ol>

    <h3>Camping</h3>
    <p>Jumbo Rocks Campground is in the heart of dark territory. Hidden Valley is popular with photographers but fills quickly.</p>

    <h3>Lodging</h3>
    <p>No in-park lodges; nearby towns like Joshua Tree and Twentynine Palms have many short-term rentals catering to astrophotographers.</p>

    <h3>Access</h3>
    <p>Summer nights are warm; winter nights are cold but crystal clear. Avoid weekends for the quietest skies.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/jotr/">Official Joshua Tree NP Website</a></p>
  `,

  arches: `
    <h2>Arches National Park</h2>
    <p>Arches offers Bortle 2 skies and iconic red rock formations that pair beautifully with the Milky Way. The desert’s dry air provides exceptional clarity most of the year.</p>
    <p>Light domes from Moab are minimal in the park interior. Milky Way season peaks in June and July, with Delicate Arch being a bucket-list shot for many photographers.</p>

    <ol>
      <li><strong>Delicate Arch</strong> – Core alignment in summer; arrive early to secure a spot.</li>
      <li><strong>Double Arch</strong> – Natural framing for wide-field shots.</li>
      <li><strong>Balanced Rock</strong> – Iconic foreground with easy roadside access.</li>
    </ol>

    <h3>Camping</h3>
    <p>Devils Garden Campground is deep in the park, offering immediate access to dark skies.</p>

    <h3>Lodging</h3>
    <p>Moab has extensive lodging, but light pollution is higher near town—stay farther from the park entrance for darker skies.</p>

    <h3>Access</h3>
    <p>Summer temperatures are hot during the day; plan to rest in the afternoon and shoot late into the night.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/arch/">Official Arches NP Website</a></p>
  `,

  canyonlands: `
    <h2>Canyonlands National Park</h2>
    <p>Bortle 1 skies and vast desert vistas make Canyonlands one of the darkest parks in the U.S. Its remote location ensures minimal light pollution from Moab and Monticello.</p>
    <p>The Island in the Sky district is most accessible and offers dramatic canyon views beneath the Milky Way. The Needles and Maze districts provide even darker skies but require more travel.</p>

    <ol>
      <li><strong>Grand View Point</strong> – Panoramic canyon views under the galactic arc.</li>
      <li><strong>Green River Overlook</strong> – Core rising above the river bends.</li>
      <li><strong>False Kiva</strong> – Framed shot within a stone alcove (check current access status).</li>
    </ol>

    <h3>Camping</h3>
    <p>Willow Flat Campground offers immediate access to Island in the Sky viewpoints.</p>

    <h3>Lodging</h3>
    <p>No in-park lodges; nearest accommodations are in Moab.</p>

    <h3>Access</h3>
    <p>Summer nights are warm; fall offers cooler, more comfortable conditions for long shoots.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/cany/">Official Canyonlands NP Website</a></p>
  `,

  capitolreef: `
    <h2>Capitol Reef National Park</h2>
    <p>Capitol Reef’s Bortle 2 skies and rugged sandstone cliffs make for spectacular nightscapes. The park is part of a designated International Dark Sky Park.</p>
    <p>Light domes from Torrey are faint and limited to the northwest horizon.</p>

    <ol>
      <li><strong>Cathedral Valley</strong> – Remote sandstone monoliths beneath a pristine Milky Way.</li>
      <li><strong>Fruita Orchard</strong> – Historic structures with star-filled skies.</li>
    </ol>

    <h3>Camping</h3>
    <p>Fruita Campground is central but has some light from facilities; Cathedral Valley camping is much darker.</p>

    <h3>Lodging</h3>
    <p>Torrey offers small inns and cabins with good access to the park’s dark areas.</p>

    <h3>Access</h3>
    <p>Backcountry roads may require high clearance vehicles, especially after rain.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/care/">Official Capitol Reef NP Website</a></p>
  `,

  brycecanyon: `
    <h2>Bryce Canyon National Park</h2>
    <p>Bryce Canyon boasts Bortle 1–2 skies and hosts renowned annual astronomy festivals. Its amphitheater of hoodoos creates unique Milky Way compositions.</p>
    <p>Light domes are almost nonexistent; only a faint glow from small towns in the distance.</p>

    <ol>
      <li><strong>Inspiration Point</strong> – Panoramic hoodoo views beneath the galactic arc.</li>
      <li><strong>Sunset Point</strong> – Iconic formations with easy access.</li>
    </ol>

    <h3>Camping</h3>
    <p>North and Sunset Campgrounds are convenient and dark; reserve early during festival weeks.</p>

    <h3>Lodging</h3>
    <p>Bryce Canyon Lodge offers rustic charm and walking access to viewpoints.</p>

    <h3>Access</h3>
    <p>High elevation means cold nights year-round; bring layers even in summer.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/brca/">Official Bryce Canyon NP Website</a></p>
  `,

  grandcanyon: `
    <h2>Grand Canyon National Park</h2>
    <p>With Bortle 2 skies along most of its rim, the Grand Canyon offers sweeping vistas for Milky Way photography. The South Rim is more accessible but has slightly more light from visitor facilities; the North Rim is darker.</p>
    <p>Light domes from Flagstaff and Page are minor, and the canyon itself blocks much horizon glow.</p>

    <ol>
      <li><strong>Mather Point</strong> – Iconic South Rim view at night.</li>
      <li><strong>Lipan Point</strong> – Best for core alignment over the canyon.</li>
      <li><strong>Cape Royal (North Rim)</strong> – Vast canyon views under pristine skies.</li>
    </ol>

    <h3>Camping</h3>
    <p>Mather Campground (South Rim) and North Rim Campground are both excellent bases for astrophotography.</p>

    <h3>Lodging</h3>
    <p>El Tovar Hotel offers comfort but is in a slightly brighter zone; North Rim Lodge is darker and quieter.</p>

    <h3>Access</h3>
    <p>North Rim is open mid-May to mid-October; South Rim is open year-round.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/grca/">Official Grand Canyon NP Website</a></p>
  `,

  greatsanddunes: `
    <h2>Great Sand Dunes National Park</h2>
    <p>With Bortle 2 skies and the tallest dunes in North America, Great Sand Dunes is a unique Milky Way location. The dark, dry air offers high transparency most of the year.</p>
    <p>Light domes from Alamosa and small towns are faint and low on the horizon.</p>

    <ol>
      <li><strong>High Dune</strong> – Sweeping views over dune fields beneath the core.</li>
      <li><strong>Medano Creek</strong> – Foregrounds with water reflections during spring runoff.</li>
    </ol>

    <h3>Camping</h3>
    <p>Pinyon Flats Campground is close to the dunes and dark skies.</p>

    <h3>Lodging</h3>
    <p>Nearby towns like Alamosa offer motels; camping provides the best access.</p>

    <h3>Access</h3>
    <p>Sand can be challenging to traverse at night—bring GPS and plenty of water.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/grsa/">Official Great Sand Dunes NP Website</a></p>
  `,

  bigbend: `
    <h2>Big Bend National Park</h2>
    <p>Big Bend’s isolation means Bortle 1 skies, among the darkest in the lower 48 states. The desert and mountains provide endless foregrounds.</p>
    <p>Light domes are virtually nonexistent; occasional faint glow from Presidio and small Mexican towns.</p>

    <ol>
      <li><strong>Santa Elena Canyon</strong> – Milky Way over towering canyon walls.</li>
      <li><strong>Chisos Basin</strong> – Dramatic mountain silhouettes beneath the stars.</li>
    </ol>

    <h3>Camping</h3>
    <p>Chisos Basin Campground offers elevation and cool nights in summer.</p>

    <h3>Lodging</h3>
    <p>Chisos Mountains Lodge is the only in-park lodging and offers immediate access to dark skies.</p>

    <h3>Access</h3>
    <p>Summer days are extremely hot; winter offers crisp, clear nights.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/bibe/">Official Big Bend NP Website</a></p>
  `,

  blackcanyon: `
    <h2>Black Canyon of the Gunnison National Park</h2>
    <p>Black Canyon’s steep, narrow gorge and Bortle 2 skies make for dramatic nightscapes. The canyon walls plunge into deep darkness, emphasizing the brilliance of the Milky Way above.</p>
    <p>Light domes from Montrose are faint and visible to the west; East Portal and North Rim areas are darker.</p>

    <ol>
      <li><strong>Chasm View</strong> – Stunning vertical drop foreground with stars.</li>
      <li><strong>North Rim Overlook</strong> – Darker and less crowded than the South Rim.</li>
    </ol>

    <h3>Camping</h3>
    <p>South Rim Campground offers convenience; North Rim Campground is darker but harder to reach.</p>

    <h3>Lodging</h3>
    <p>No in-park lodges; Montrose and Crawford have the nearest accommodations.</p>

    <h3>Access</h3>
    <p>North Rim closes in winter; summer offers the warmest, most accessible nights.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/blca/">Official Black Canyon NP Website</a></p>
  `,

  bigcypress: `
    <h2>Big Cypress National Preserve</h2>
    <p>Adjacent to Everglades National Park, Big Cypress offers Bortle 3–4 skies with unique wetland and cypress forest foregrounds. Winter is best for clear skies and fewer insects.</p>
    <p>Light domes from Miami and Naples are present to the east and west but can be minimized by shooting southward.</p>

    <ol>
      <li><strong>Oasis Visitor Center</strong> – Easy access to open night skies.</li>
      <li><strong>Loop Road</strong> – Remote pullouts with dark southern views.</li>
    </ol>

    <h3>Camping</h3>
    <p>Midway Campground and Burns Lake are popular with stargazers.</p>

    <h3>Lodging</h3>
    <p>No in-park lodges; accommodations available in Everglades City.</p>

    <h3>Access</h3>
    <p>Best in the dry season; summer brings high humidity and mosquitoes.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/bicy/">Official Big Cypress NP Website</a></p>
  `,
  petrifiedforest: `
    <h2>Petrified Forest National Park</h2>
    <p>Petrified Forest is one of Arizona’s hidden dark-sky gems, with Bortle 2–3 skies and otherworldly fossilized logs and badlands terrain for foregrounds. The park’s remote location means exceptionally low light pollution.</p>
    <p>Light domes from Holbrook and Gallup are minimal, with the darkest skies in the Painted Desert section.</p>

    <ol>
      <li><strong>Painted Desert Rim</strong> – Vivid rock colors and deep horizons beneath the Milky Way.</li>
      <li><strong>Crystal Forest</strong> – Petrified logs glowing in starlight.</li>
    </ol>

    <h3>Camping</h3>
    <p>No developed campgrounds; backcountry permits allow overnight stays for astrophotography.</p>

    <h3>Lodging</h3>
    <p>Holbrook has the nearest accommodations; choose locations east of town for less light impact.</p>

    <h3>Access</h3>
    <p>Park closes at sunset unless you have a backcountry permit; plan accordingly.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/pefo/">Official Petrified Forest NP Website</a></p>
  `,

  cratersofthemoon: `
    <h2>Craters of the Moon National Monument</h2>
    <p>Craters of the Moon offers a surreal volcanic landscape under Bortle 2 skies. The black lava fields and cinder cones create dramatic foregrounds for Milky Way shots.</p>
    <p>Light domes are minimal, with only a faint glow from Arco to the northeast.</p>

    <ol>
      <li><strong>Inferno Cone</strong> – Elevated views over the lava plain beneath the galactic arc.</li>
      <li><strong>Devils Orchard</strong> – Unusual rock spires silhouetted against the stars.</li>
    </ol>

    <h3>Camping</h3>
    <p>Lava Flow Campground is open seasonally and offers quick access to dark shooting locations.</p>

    <h3>Lodging</h3>
    <p>Arco has basic motels; Idaho Falls offers more options but is farther away.</p>

    <h3>Access</h3>
    <p>Clear nights are common in late summer and early fall; winter access may be limited by snow.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/crmo/">Official Craters of the Moon NM Website</a></p>
  `,

  chacoculture: `
    <h2>Chaco Culture National Historical Park</h2>
    <p>Chaco Culture’s Bortle 1–2 skies and ancient ruins make for unparalleled astrophotography opportunities. This UNESCO World Heritage Site has a rich history tied to celestial alignments.</p>
    <p>Light domes are virtually nonexistent; the remoteness ensures pristine conditions.</p>

    <ol>
      <li><strong>Pueblo Bonito</strong> – Iconic ruin with Milky Way overhead.</li>
      <li><strong>Chetro Ketl</strong> – Large stone walls creating dramatic shadows under starlight.</li>
    </ol>

    <h3>Camping</h3>
    <p>Gallo Campground is the only in-park option and offers dark, open skies.</p>

    <h3>Lodging</h3>
    <p>No lodges nearby; camping is essential for night photography access.</p>

    <h3>Access</h3>
    <p>Remote dirt roads can become impassable after rain; check conditions before travel.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/chcu/">Official Chaco Culture NHP Website</a></p>
  `,

  cedarbreaks: `
    <h2>Cedar Breaks National Monument</h2>
    <p>At over 10,000 feet, Cedar Breaks offers Bortle 2 skies with crystal-clear air. Its amphitheater of red rock hoodoos is a smaller, higher-elevation counterpart to Bryce Canyon.</p>
    <p>Light domes from Cedar City are visible low on the western horizon but do not affect overhead views.</p>

    <ol>
      <li><strong>Point Supreme Overlook</strong> – Best for capturing the galactic arc over the amphitheater.</li>
      <li><strong>Sunset View Overlook</strong> – Elevated views with minimal obstruction.</li>
    </ol>

    <h3>Camping</h3>
    <p>Point Supreme Campground offers easy night access to viewpoints.</p>

    <h3>Lodging</h3>
    <p>Cedar City offers the nearest accommodations; Brian Head has small inns at higher elevations.</p>

    <h3>Access</h3>
    <p>Snow can linger into late June; high-elevation weather changes quickly.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/cebr/">Official Cedar Breaks NM Website</a></p>
  `,

  capulinvolcano: `
    <h2>Capulin Volcano National Monument</h2>
    <p>This extinct cinder cone in New Mexico offers Bortle 1–2 skies and panoramic views from its summit road. The surrounding plains provide unobstructed horizons in all directions.</p>
    <p>Light domes are virtually absent, with only small glows from distant towns.</p>

    <ol>
      <li><strong>Summit Overlook</strong> – Full 360° Milky Way views.</li>
      <li><strong>Rim Trail</strong> – Foregrounds with volcanic terrain and stars overhead.</li>
    </ol>

    <h3>Camping</h3>
    <p>No camping within the monument; nearby Clayton has small campgrounds and motels.</p>

    <h3>Lodging</h3>
    <p>Clayton or Raton offer basic lodging options.</p>

    <h3>Access</h3>
    <p>Summit road closes at night except during special events—check for star party dates.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/cavo/">Official Capulin Volcano NM Website</a></p>
  `,

  florissantfossilbeds: `
    <h2>Florissant Fossil Beds National Monument</h2>
    <p>Florissant offers Bortle 3 skies with wide meadows and ancient petrified redwood stumps as unique astrophotography subjects.</p>
    <p>Light domes from Colorado Springs are visible to the east but can be avoided by shooting westward.</p>

    <ol>
      <li><strong>Petrified Stump Fields</strong> – Unique foregrounds under the Milky Way.</li>
      <li><strong>Horseshoe Trail</strong> – Meadow openings ideal for stargazing.</li>
    </ol>

    <h3>Camping</h3>
    <p>No camping in the monument; nearby Mueller State Park offers dark sites.</p>

    <h3>Lodging</h3>
    <p>Woodland Park and Florissant have small inns and rentals.</p>

    <h3>Access</h3>
    <p>Park closes at dusk; photography access requires special arrangements or events.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/flfo/">Official Florissant Fossil Beds NM Website</a></p>
  `,

  fortunion: `
    <h2>Fort Union National Monument</h2>
    <p>Fort Union preserves 19th-century adobe ruins beneath Bortle 2–3 skies. The open prairie setting offers unobstructed horizons and minimal light interference.</p>
    <p>Light domes from Las Vegas, NM are visible to the south but low on the horizon.</p>

    <ol>
      <li><strong>Main Ruins</strong> – Historic adobe walls under the Milky Way.</li>
      <li><strong>Wagon Ruts</strong> – Unique foreground for star trail photography.</li>
    </ol>

    <h3>Camping</h3>
    <p>No in-park camping; nearby state parks offer dark campsites.</p>

    <h3>Lodging</h3>
    <p>Las Vegas, NM has hotels and inns.</p>

    <h3>Access</h3>
    <p>Park closes at sunset; after-hours access may be possible during special events.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/foun/">Official Fort Union NM Website</a></p>
  `,

  hovenweep: `
    <h2>Hovenweep National Monument</h2>
    <p>Hovenweep’s Bortle 2 skies and ancient stone towers create striking night photography scenes. The remote Four Corners location ensures minimal light pollution.</p>
    <p>Light domes from Blanding and Cortez are faint and easy to avoid.</p>

    <ol>
      <li><strong>Square Tower Group</strong> – Most iconic ruin complex under the Milky Way.</li>
      <li><strong>Horseshoe and Hackberry Groups</strong> – Remote and less visited for solitude.</li>
    </ol>

    <h3>Camping</h3>
    <p>Small campground near the visitor center offers direct access to night skies.</p>

    <h3>Lodging</h3>
    <p>Blanding and Cortez offer the closest accommodations.</p>

    <h3>Access</h3>
    <p>Open year-round; nights are cold outside of summer.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/hove/">Official Hovenweep NM Website</a></p>
  `,

  salinaspueblomissions: `
    <h2>Salinas Pueblo Missions National Monument</h2>
    <p>Three separate sites with Bortle 2–3 skies and preserved Spanish mission ruins make for unique astrophotography subjects.</p>
    <p>Light domes from Albuquerque are faint in the distance.</p>

    <ol>
      <li><strong>Quarai Ruins</strong> – Best for Milky Way core alignment.</li>
      <li><strong>Gran Quivira</strong> – Remote site with minimal visitors at night.</li>
    </ol>

    <h3>Camping</h3>
    <p>No in-park camping; nearby state parks and BLM land offer options.</p>

    <h3>Lodging</h3>
    <p>Mountainair has small inns; larger hotels in Belen and Albuquerque.</p>

    <h3>Access</h3>
    <p>Sites close at sunset; night access may require special events or permits.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/sapu/">Official Salinas Pueblo Missions NM Website</a></p>
  `,

  vallescaldera: `
    <h2>Valles Caldera National Preserve</h2>
    <p>Valles Caldera’s high-altitude grasslands and surrounding peaks offer Bortle 2 skies and excellent transparency. The wide open caldera floor is perfect for panoramic Milky Way shots.</p>
    <p>Light domes from Los Alamos and Santa Fe are faint and confined to the east.</p>

    <ol>
      <li><strong>Valley Floor</strong> – Expansive open views beneath the stars.</li>
      <li><strong>Ridgetop Overlooks</strong> – Elevated positions for wide-field panoramas.</li>
    </ol>

    <h3>Camping</h3>
    <p>No developed campgrounds; dispersed camping allowed in designated areas with permit.</p>

    <h3>Lodging</h3>
    <p>Jemez Springs offers the closest accommodations.</p>

    <h3>Access</h3>
    <p>High elevation means cold nights year-round; summer thunderstorms are common.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/vall/">Official Valles Caldera NP Website</a></p>
  `,

  anzaborrego: `
    <h2>Anza-Borrego Desert State Park</h2>
    <p>California’s largest state park offers Bortle 2–3 skies, vast desert landscapes, and unique metal sculptures perfect for Milky Way compositions. Its designation as an International Dark Sky Park ensures a commitment to preserving night skies.</p>
    <p>Light domes from San Diego, Palm Springs, and El Centro are visible on the horizon but easily avoided by choosing shooting locations deep inside the park.</p>

    <ol>
      <li><strong>Galleta Meadows</strong> – Iconic sculptures, including the famous serpent, silhouetted against the Milky Way.</li>
      <li><strong>Font’s Point</strong> – Overlooks the Borrego Badlands with dramatic depth and texture.</li>
    </ol>

    <h3>Camping</h3>
    <p>Borrego Palm Canyon Campground offers easy access; dispersed camping is allowed in many areas for even darker skies.</p>

    <h3>Lodging</h3>
    <p>Borrego Springs has small hotels and rentals, many designed with night-sky-friendly lighting.</p>

    <h3>Access</h3>
    <p>Best conditions occur October–May; summer is extremely hot, even at night.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.parks.ca.gov/?page_id=638">Official Anza-Borrego DSP Website</a></p>
  `,

  antelopeisland: `
    <h2>Antelope Island State Park</h2>
    <p>Located in the Great Salt Lake, Antelope Island offers Bortle 4–5 skies—darker than surrounding urban areas but with visible light domes from Salt Lake City and Ogden. Clear winter nights can be especially striking with snow-covered foregrounds.</p>
    <p>The island’s open landscapes are ideal for Milky Way panoramas, especially on the west shore facing away from the Wasatch Front.</p>

    <ol>
      <li><strong>Buffalo Point</strong> – Elevated views with water reflections.</li>
      <li><strong>Ladyfinger Point</strong> – Rugged shoreline foregrounds for galactic shots.</li>
    </ol>

    <h3>Camping</h3>
    <p>Bridger Bay Campground offers proximity to prime night shooting locations.</p>

    <h3>Lodging</h3>
    <p>No lodges on the island; nearest accommodations are in Syracuse and Layton.</p>

    <h3>Access</h3>
    <p>Summer can bring biting gnats and heat; fall and winter offer clearer skies.</p>

    <h3>Official Links</h3>
    <p><a href="https://stateparks.utah.gov/parks/antelope-island/">Official Antelope Island SP Website</a></p>
  `,

  headlands: `
    <h2>Headlands International Dark Sky Park</h2>
    <p>Situated on the shores of Lake Michigan, Headlands offers Bortle 3 skies with minimal light intrusion from nearby towns. The lake provides reflective foregrounds and unobstructed views north toward the aurora during strong geomagnetic events.</p>
    <p>Light domes from Mackinaw City are faint but present to the east; most shooting locations face away from urban areas.</p>

    <ol>
      <li><strong>Beach Area</strong> – Wide northern views ideal for aurora and Milky Way shots.</li>
      <li><strong>Observation Deck</strong> – Elevated viewing platform with interpretive programs.</li>
    </ol>

    <h3>Camping</h3>
    <p>No camping allowed; day-use and night-use permits available for photography.</p>

    <h3>Lodging</h3>
    <p>Nearby Mackinaw City has numerous hotels and rentals.</p>

    <h3>Access</h3>
    <p>Open year-round; best Milky Way conditions from April–October.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.midarkskypark.org/">Official Headlands IDSP Website</a></p>
  `,

  oracle: `
    <h2>Oracle State Park</h2>
    <p>Oracle State Park in Arizona offers Bortle 3 skies with desert grasslands and rolling hills. Its proximity to Tucson means some light dome to the south, but views north and west are quite dark.</p>
    <p>Certified as an International Dark Sky Park, it hosts regular astronomy programs.</p>

    <ol>
      <li><strong>Kannally Ranch House Area</strong> – Historic building and open skies.</li>
      <li><strong>Windy Ridge Trail</strong> – Elevated views for wide-field astrophotography.</li>
    </ol>

    <h3>Camping</h3>
    <p>No camping; visit nearby Catalina State Park for dark overnight stays.</p>

    <h3>Lodging</h3>
    <p>Oracle and Catalina have small inns and rentals.</p>

    <h3>Access</h3>
    <p>Best conditions from late fall through spring; summer can be hot and stormy.</p>

    <h3>Official Links</h3>
    <p><a href="https://azstateparks.com/oracle">Official Oracle SP Website</a></p>
  `,

  canyonlandsidsp: `
    <h2>Canyonlands International Dark Sky Park</h2>
    <p>This designation recognizes the exceptional Bortle 1 skies across all districts of Canyonlands NP. The remoteness means almost no artificial light, making it ideal for astrophotography year-round.</p>
    <p>Milky Way visibility is best from April–October, with fall offering cooler nights and fewer visitors.</p>

    <ol>
      <li><strong>Grand View Point</strong> – Sweeping views over canyons and mesas.</li>
      <li><strong>Green River Overlook</strong> – Milky Way rising over the winding river.</li>
    </ol>

    <h3>Camping</h3>
    <p>Willow Flat Campground and Needles Campground both offer excellent dark sky access.</p>

    <h3>Lodging</h3>
    <p>Moab is the nearest town with lodging, though staying in-park offers better night access.</p>

    <h3>Access</h3>
    <p>Summer is warm and dry; bring plenty of water for night hikes.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/cany/planyourvisit/darkskies.htm">Canyonlands Dark Sky Info</a></p>
  `,

  copperbreaks: `
    <h2>Copper Breaks State Park</h2>
    <p>Located in northern Texas, Copper Breaks is a designated International Dark Sky Park with Bortle 2–3 skies. The rolling prairie and small lakes make for simple yet beautiful foregrounds.</p>
    <p>Light domes from Childress and Quanah are faint and confined to the horizon.</p>

    <ol>
      <li><strong>Lake Shore</strong> – Reflections of the Milky Way on calm nights.</li>
      <li><strong>Prairie Overlooks</strong> – Wide open horizons in every direction.</li>
    </ol>

    <h3>Camping</h3>
    <p>Developed and primitive campsites are available, all within dark sky zones.</p>

    <h3>Lodging</h3>
    <p>Nearest accommodations are in Quanah, TX.</p>

    <h3>Access</h3>
    <p>Best visiting months are spring and fall to avoid summer heat.</p>

    <h3>Official Links</h3>
    <p><a href="https://tpwd.texas.gov/state-parks/copper-breaks">Official Copper Breaks SP Website</a></p>
  `,

  claytonlake: `
    <h2>Clayton Lake State Park</h2>
    <p>In northeastern New Mexico, Clayton Lake offers Bortle 2 skies and a small reservoir that reflects the stars. Known for both stargazing and its dinosaur trackway.</p>
    <p>Light domes are minimal, with only faint glows from Clayton.</p>

    <ol>
      <li><strong>Dam Area</strong> – Elevated views over the lake with the Milky Way.</li>
      <li><strong>Shoreline Trails</strong> – Water foregrounds and unobstructed skies.</li>
    </ol>

    <h3>Camping</h3>
    <p>Campgrounds are close to the lake for immediate dark sky access.</p>

    <h3>Lodging</h3>
    <p>Clayton offers small motels; camping is preferred for astrophotographers.</p>

    <h3>Access</h3>
    <p>Clear skies are common year-round; summer offers warm nights.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.emnrd.nm.gov/spd/find-a-park/clayton-lake-state-park/">Official Clayton Lake SP Website</a></p>
  `,

  cherrysprings: `
    <h2>Cherry Springs State Park</h2>
    <p>One of the most famous dark sky sites in the eastern U.S., Cherry Springs offers Bortle 2 skies and a dedicated astronomy field for overnight observation.</p>
    <p>Light domes are extremely faint, with only minimal glow from small towns far away.</p>

    <ol>
      <li><strong>Astronomy Observation Field</strong> – Flat, unobstructed 360° horizons.</li>
      <li><strong>Public Program Area</strong> – Ranger-led programs for visitors without overnight permits.</li>
    </ol>

    <h3>Camping</h3>
    <p>Both public and astronomy field camping are available; astronomy field requires permits.</p>

    <h3>Lodging</h3>
    <p>Nearby Coudersport offers small inns and rentals.</p>

    <h3>Access</h3>
    <p>Best conditions from April–October; winter skies are crystal clear but frigid.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.dcnr.pa.gov/StateParks/FindAPark/CherrySpringsStatePark/Pages/default.aspx">Official Cherry Springs SP Website</a></p>
  `,

  blueridgeobservatory: `
    <h2>Blue Ridge Observatory and Star Park</h2>
    <p>Located in North Carolina, this site offers Bortle 3 skies in the Blue Ridge Mountains. It is a hub for regional astronomy outreach.</p>
    <p>Light domes from Asheville are faint but present; mountain ridges help block them from most viewpoints.</p>

    <ol>
      <li><strong>Observatory Grounds</strong> – Permanent telescopes and dark-sky programs.</li>
      <li><strong>Mountain Trails</strong> – Elevated positions for wide Milky Way arcs.</li>
    </ol>

    <h3>Camping</h3>
    <p>No camping on-site; nearby Pisgah National Forest has primitive options.</p>

    <h3>Lodging</h3>
    <p>Spruce Pine and Burnsville have small inns.</p>

    <h3>Access</h3>
    <p>Best skies occur in late fall and winter when humidity is low.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.mayland.edu/foundation/starpark/">Official Star Park Website</a></p>
  `,

  greatbarrierisland: `
    <h2>Great Barrier Island International Dark Sky Sanctuary</h2>
    <p>Located off the coast of New Zealand, Great Barrier Island is one of the few certified Dark Sky Sanctuaries in the world. Bortle 1 skies and zero artificial light make it an astrophotographer’s dream.</p>
    <p>Light domes are nonexistent; ocean surrounds the island on all sides.</p>

    <ol>
      <li><strong>Medlands Beach</strong> – Stunning ocean foregrounds beneath the Milky Way.</li>
      <li><strong>Mount Hobson Summit</strong> – Panoramic views over the island and stars.</li>
    </ol>

    <h3>Camping</h3>
    <p>Several DOC campgrounds are available along the coast.</p>

    <h3>Lodging</h3>
    <p>Small lodges and rentals scattered across the island; all with minimal light pollution.</p>

    <h3>Access</h3>
    <p>Accessible by ferry or small aircraft from Auckland; weather can change quickly.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.greatbarrierislandtourism.org.nz/dark-sky-sanctuary/">Official Dark Sky Sanctuary Page</a></p>
  `,
  kerry: `
    <h2>Kerry International Dark Sky Reserve</h2>
    <p>Located on Ireland’s southwest coast, Kerry offers Bortle 2 skies with a mix of Atlantic coastline, mountains, and traditional stone villages. The reserve covers the Iveragh Peninsula, an area free from major urban lighting.</p>
    <p>Light domes are minimal, with only small glows from towns like Cahersiveen and Waterville. Ocean horizons are completely dark to the west.</p>
    <p><em>Seasonal highlights:</em> The Milky Way core is best from late April to early September, arching low across the southern horizon. Winter offers crisp Orion and long nights. The Geminids (December) and Perseids (August) are both spectacular here. New moon periods are best, as rural Ireland is prone to mist and fog on damp nights.</p>

    <ol>
      <li><strong>Ballinskelligs Beach</strong> – Wide open ocean horizon for Milky Way core.</li>
      <li><strong>Valentia Island</strong> – Rugged coastal cliffs under the stars.</li>
    </ol>

    <h3>Camping</h3>
    <p>Several small campgrounds and wild camping spots along the coast; always follow Leave No Trace principles.</p>

    <h3>Lodging</h3>
    <p>Bed & breakfasts in Portmagee and Waterville offer easy night access.</p>

    <h3>Access</h3>
    <p>Weather can change quickly; coastal winds are common.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.kerrydarksky.com/">Official Kerry IDSR Website</a></p>
  `,

  mayo: `
    <h2>Mayo International Dark Sky Park</h2>
    <p>Located in Ireland’s County Mayo, this park offers Bortle 2 skies across a landscape of bogs, lakes, and Atlantic coastline. It is one of the darkest places in Europe.</p>
    <p>Light domes are rare, with only faint glows from Westport and Castlebar.</p>
    <p><em>Seasonal highlights:</em> Milky Way core visible May–September, best in July–August. Winter brings Orion, the Pleiades, and the occasional aurora over the Atlantic. The Perseids are excellent here in August under dark skies.</p>

    <ol>
      <li><strong>Ballycroy Visitor Centre</strong> – Central location with open views.</li>
      <li><strong>Claggan Mountain Coastal Trail</strong> – Oceanfront Milky Way panoramas.</li>
    </ol>

    <h3>Camping</h3>
    <p>Wild camping permitted in remote areas; check local guidelines.</p>

    <h3>Lodging</h3>
    <p>Guesthouses in Ballycroy and Mulranny provide comfortable bases.</p>

    <h3>Access</h3>
    <p>Clear skies most likely after Atlantic cold fronts pass.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.mayodarkskypark.ie/">Official Mayo IDSP Website</a></p>
  `,

  ramoncrater: `
    <h2>Ramon Crater International Dark Sky Park</h2>
    <p>Located in Israel’s Negev Desert, Ramon Crater offers Bortle 1–2 skies and surreal desert geology. The crater (makhtesh) is a massive erosion landform with cliffs and rock formations ideal for astrophotography.</p>
    <p>Light domes are negligible; distant glows from Mitzpe Ramon are minimal.</p>
    <p><em>Seasonal highlights:</em> Milky Way core is highest in June–August. Winter offers long nights and crisp skies for Orion and the winter Milky Way. The Geminids and Perseids are spectacular here. Best under new moon for the deepest desert skies.</p>

    <ol>
      <li><strong>Mitzpe Ramon Lookout</strong> – Elevated views into the crater.</li>
      <li><strong>Machtesh Rim Trails</strong> – Dramatic cliff-edge Milky Way shots.</li>
    </ol>

    <h3>Camping</h3>
    <p>Primitive camping allowed in designated sites; Ein Saharonim is the darkest.</p>

    <h3>Lodging</h3>
    <p>Mitzpe Ramon has desert lodges and small hotels catering to stargazers.</p>

    <h3>Access</h3>
    <p>Summer nights are warm; winters can be cold with occasional frost.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.israel-in-photos.com/ramon-crater.html">Ramon Crater Info</a></p>
  `,

  iriomoteishigaki: `
    <h2>Iriomote-Ishigaki National Park IDSP</h2>
    <p>Japan’s southernmost national park, located in Okinawa Prefecture, offers Bortle 1–2 skies over coral reefs and subtropical forests. It’s the first dark sky park in Japan.</p>
    <p>Light domes are almost nonexistent; ocean surrounds most shooting locations.</p>
    <p><em>Seasonal highlights:</em> Milky Way core visible February–October, peaking in summer. Best for capturing the Southern Cross in spring. Typhoon season runs July–September, so plan accordingly.</p>

    <ol>
      <li><strong>Kabira Bay</strong> – Famous turquoise waters by day, pristine Milky Way views by night.</li>
      <li><strong>Iriomote West Coast</strong> – Remote beaches with zero artificial light.</li>
    </ol>

    <h3>Camping</h3>
    <p>Limited; some beaches allow permitted overnight stays.</p>

    <h3>Lodging</h3>
    <p>Small inns and guesthouses on Ishigaki and Iriomote Islands.</p>

    <h3>Access</h3>
    <p>Access via ferry or short flights from Okinawa.</p>

    <h3>Official Links</h3>
    <p><a href="https://iriomote-ishigaki.jp/">Official Park Website</a></p>
  `,

  namibrand: `
    <h2>NamibRand Nature Reserve IDSR</h2>
    <p>In Namibia’s desert heart, NamibRand is one of the darkest places on Earth (Bortle 1). Vast dunes, mountains, and open desert plains create unmatched nightscapes.</p>
    <p>Zero light domes; the nearest towns are over 100 km away.</p>
    <p><em>Seasonal highlights:</em> Milky Way core visible February–October, arching high overhead in winter months (June–August). Excellent for Magellanic Clouds year-round. Meteor showers are dazzling in the dry season.</p>

    <ol>
      <li><strong>Dune Fields</strong> – Sand ridges with galactic arcs.</li>
      <li><strong>Mountain Outcrops</strong> – Rocky silhouettes under southern skies.</li>
    </ol>

    <h3>Camping</h3>
    <p>Several private lodges have on-site dark sky observatories.</p>

    <h3>Lodging</h3>
    <p>Luxury desert lodges and eco-camps within the reserve.</p>

    <h3>Access</h3>
    <p>Best skies in the dry season (May–September).</p>

    <h3>Official Links</h3>
    <p><a href="https://namibrand.org/">Official NamibRand Reserve Website</a></p>
  `,

  bukkzselic: `
    <h2>Bükk National Park (Zselic) IDSR</h2>
    <p>Hungary’s Bükk National Park, including the Zselic Starry Sky Park, offers Bortle 3 skies in rolling hills and dense forests.</p>
    <p>Light domes from nearby towns are small and low on the horizon.</p>
    <p><em>Seasonal highlights:</em> Milky Way core visible April–September. Winter offers long, dark nights for deep-sky imaging.</p>

    <ol>
      <li><strong>Zselic Star Park</strong> – Open clearings with full-sky views.</li>
      <li><strong>Bükk Highlands</strong> – Elevated sites above lowland haze.</li>
    </ol>

    <h3>Camping</h3>
    <p>Designated campsites within the park; some offer astronomy events.</p>

    <h3>Lodging</h3>
    <p>Guesthouses in nearby villages cater to visitors.</p>

    <h3>Access</h3>
    <p>Spring and fall offer the clearest skies.</p>

    <h3>Official Links</h3>
    <p><a href="https://zselicicsillagpark.hu/">Official Zselic Starry Sky Park Website</a></p>
  `,

  hortobagy: `
    <h2>Hortobágy National Park IDSR</h2>
    <p>Hungary’s first national park and largest continuous natural grassland, offering Bortle 3 skies and wide horizons ideal for astrophotography.</p>
    <p>Light domes from Debrecen are faint and avoidable.</p>
    <p><em>Seasonal highlights:</em> Milky Way core visible April–September. Winter offers low humidity and sharp clarity for Orion and deep-sky targets.</p>

    <ol>
      <li><strong>Puszta Plains</strong> – Endless horizon lines under the stars.</li>
      <li><strong>Traditional Shepherd Huts</strong> – Unique cultural foregrounds.</li>
    </ol>

    <h3>Camping</h3>
    <p>Permitted in designated areas; best in summer for warm nights.</p>

    <h3>Lodging</h3>
    <p>Small inns in Hortobágy village.</p>

    <h3>Access</h3>
    <p>Best after cold fronts clear the air.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.hnp.hu/en">Official Hortobágy NP Website</a></p>
  `,

  lauwersmeer: `
    <h2>Lauwersmeer National Park</h2>
    <p>Located in the Netherlands, Lauwersmeer offers Bortle 3–4 skies in a flat coastal landscape. The park’s position on the Wadden Sea makes for stunning water reflections.</p>
    <p>Light domes from Groningen are faint but visible to the south.</p>
    <p><em>Seasonal highlights:</em> Milky Way core visible April–August; in winter, excellent for Orion and long star trails. Occasional aurora sightings during strong geomagnetic storms.</p>

    <ol>
      <li><strong>Dark Sky Platform</strong> – Dedicated viewing area with information panels.</li>
      <li><strong>Shoreline Trails</strong> – Water foregrounds and low horizons.</li>
    </ol>

    <h3>Camping</h3>
    <p>Several campgrounds around the lake; best on the northern shore for darker skies.</p>

    <h3>Lodging</h3>
    <p>Small hotels in Lauwersoog and Anjum.</p>

    <h3>Access</h3>
    <p>Clear skies more frequent in autumn and winter.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.np-lauwersmeer.nl/">Official Lauwersmeer NP Website</a></p>
  `,

  southdowns: `
    <h2>South Downs National Park</h2>
    <p>In southern England, South Downs offers Bortle 4 skies, darker than much of the surrounding region. Rolling chalk hills and historic sites make for interesting night compositions.</p>
    <p>Light domes from Brighton, Portsmouth, and London limit certain directions; best views are toward the south coast.</p>
    <p><em>Seasonal highlights:</em> Milky Way visible May–September; winter offers Orion above the hills. The Perseids are a highlight in August.</p>

    <ol>
      <li><strong>Devil’s Dyke</strong> – Elevated ridge with sweeping views.</li>
      <li><strong>Old Winchester Hill</strong> – Ancient earthworks under the stars.</li>
    </ol>

    <h3>Camping</h3>
    <p>Several small campsites; wild camping not generally permitted.</p>

    <h3>Lodging</h3>
    <p>Inns and guesthouses in Lewes, Petersfield, and Midhurst.</p>

    <h3>Access</h3>
    <p>Summer has mild nights but more haze; winter is clearer but colder.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.southdowns.gov.uk/">Official South Downs NP Website</a></p>
  `,

  snowdonia: `
    <h2>Snowdonia National Park</h2>
    <p>In Wales, Snowdonia offers Bortle 3 skies, with dark mountain valleys and rugged peaks. Designated as a Dark Sky Reserve.</p>
    <p>Light domes are minimal; small glows from coastal towns are visible but not intrusive.</p>
    <p><em>Seasonal highlights:</em> Milky Way visible April–September; in winter, Orion and the Pleiades shine brightly over snow-capped peaks. Good Perseid views in August from high ridges.</p>

    <ol>
      <li><strong>Llyn y Dywarchen</strong> – Mountain lake reflections beneath the stars.</li>
      <li><strong>Tryfan</strong> – Iconic mountain silhouette against the Milky Way.</li>
    </ol>

    <h3>Camping</h3>
    <p>Numerous campgrounds in valleys; wild camping tolerated in remote high areas.</p>

    <h3>Lodging</h3>
    <p>B&Bs in Betws-y-Coed, Llanberis, and Dolgellau.</p>

    <h3>Access</h3>
    <p>Weather is unpredictable; check forecasts carefully.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.eryri.llyw.cymru/">Official Snowdonia NP Website</a></p>
  `,

  tomintoulglenlivet: `
    <h2>Tomintoul and Glenlivet Dark Sky Park</h2>
    <p>Located in the Cairngorms National Park, Scotland, this area offers Bortle 2–3 skies and open moorland for unobstructed views.</p>
    <p>Light domes are minimal, with small glows from Aberdeen to the east on rare clear nights.</p>
    <p><em>Seasonal highlights:</em> Milky Way visible May–September; winter brings long, dark nights perfect for aurora hunting during strong solar activity.</p>

    <ol>
      <li><strong>Tomintoul Viewing Area</strong> – Wide horizons in all directions.</li>
      <li><strong>Scalan</strong> – Historic chapel under pristine skies.</li>
    </ol>

    <h3>Camping</h3>
    <p>Small campsites in Tomintoul; wild camping permitted under Scottish access laws.</p>

    <h3>Lodging</h3>
    <p>Inns and guesthouses in Tomintoul and surrounding villages.</p>

    <h3>Access</h3>
    <p>Best conditions in autumn and winter; summer has shorter nights.</p>

    <h3>Official Links</h3>
    <p><a href="https://www.darkskies.glenlivet-cairngorms.co.uk/">Official Dark Sky Park Website</a></p>
  `,

  gallowayforest: `
    <h2>Galloway Forest Park</h2>
    <p>Scotland’s first Dark Sky Park offers Bortle 2–3 skies over rolling hills, lochs, and forest clearings. It is one of the largest dark sky parks in Europe.</p>
    <p>Light domes are minimal, with only faint glows from small towns.</p>
    <p><em>Seasonal highlights:</em> Milky Way visible May–September; aurora possible during strong geomagnetic events. Winter offers prime long-exposure opportunities.</p>

    <ol>
      <li><strong>Clatteringshaws Loch</strong> – Water reflections with dark skies overhead.</li>
      <li><strong>Loch Trool</strong> – Historic battlefield site under the stars.</li>
    </ol>

    <h3>Camping</h3>
    <p>Several campsites and wild camping areas in remote locations.</p>

    <h3>Lodging</h3>
    <p>Guesthouses and inns in Newton Stewart and surrounding villages.</p>

    <h3>Access</h3>
    <p>Best in autumn and winter for longest dark hours.</p>

    <h3>Official Links</h3>
    <p><a href="https://forestryandland.gov.scot/visit/galloway-forest-park">Official Galloway Forest Park Website</a></p>
  `,

  greatbasin: `
    <h2>Great Basin National Park</h2>
    <p>Great Basin, a Gold Tier International Dark Sky Park, is renowned for its extraordinarily dark, clear skies—among the darkest in the continental U.S. (Bortle 1–2). The high elevation, remote desert setting, and dry climate combine for incredible celestial clarity. With virtually no urban centers nearby, light pollution is almost non-existent.</p>
    <p>Milky Way core season peaks from late April to early September, with the galaxy arching high overhead by midnight in midsummer. Summer is prime for new moon stargazing and the park’s annual Astronomy Festival. In winter, expect dazzling Orion and crisp star fields, though nighttime temps are frigid. Meteor showers—especially the Perseids and Geminids—are spectacular here.</p>
    <ol>
      <li><strong>Mather Overlook</strong> – Sweeping, high-elevation views, perfect for panoramic Milky Way shots and astronomy events.</li>
      <li><strong>Stella Lake</strong> – Reflects Wheeler Peak and stars in its still waters; a magical spot for night photography.</li>
      <li><strong>Lehman Caves Area</strong> – Close to ranger-led night sky programs and public telescope viewing.</li>
    </ol>
    <h3>Camping</h3>
    <p>Four main campgrounds (Upper and Lower Lehman Creek, Baker Creek, and Wheeler Peak). Wheeler Peak Campground sits at 10,000 feet for the ultimate sky but can be very cold—even in summer. Summer fills fast during astronomy events; reserve if possible.</p>
    <h3>Lodging</h3>
    <p>No in-park lodging; motels and cabins in tiny Baker, NV. For best darkness, camp in the park or stay at Wheeler Peak Lodge just outside the entrance.</p>
    <h3>Access</h3>
    <p>Best access late spring through early fall. Wheeler Peak Scenic Drive closes in winter beyond Upper Lehman. Prepare for mountain weather and big temperature swings.</p>
    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/grba">Official Great Basin NPS Site</a></p>
  `,

  flagstaffmonuments: `
    <h2>Flagstaff Area National Monuments</h2>
    <p>Flagstaff, the world's first “International Dark Sky City,” is surrounded by protected monuments—<strong>Wupatki</strong>, <strong>Sunset Crater Volcano</strong>, and <strong>Walnut Canyon</strong>—all certified for their night skies. Bortle 3–4 overall, but at Wupatki you can get true darkness (Bortle 2) with minimal city glow on the horizon. Flagstaff’s strict lighting codes help, but avoid looking southwest toward the city lights.</p>
    <p>Milky Way core is best May–September, rising above the painted desert and ancient pueblos. Watch for meteor showers in August (Perseids) and December (Geminids). Occasional ranger “Explore the Stars” nights are hosted at Wupatki or Sunset Crater—arrive early for a spot!</p>
    <ol>
      <li><strong>Wukoki Pueblo (Wupatki)</strong> – Striking ruins and dark desert backdrop; best for darkest skies and wide horizons.</li>
      <li><strong>Sunset Crater Cinder Fields</strong> – Open volcanic landscape, dramatic Milky Way rises in summer.</li>
    </ol>
    <h3>Camping</h3>
    <p>Bonito Campground (adjacent to Sunset Crater) is a favorite for night access. No camping at Wupatki or Walnut Canyon; use Coconino National Forest sites nearby.</p>
    <h3>Lodging</h3>
    <p>Many hotels in Flagstaff, just a short drive away. For darkest skies, stay outside the city limits near Sunset Crater.</p>
    <h3>Access</h3>
    <p>Monuments close at sunset except for special programs, but public lands nearby offer open access. Bonito Campground is open seasonally; check for event nights for after-dark entry.</p>
    <h3>Official Links</h3>
    <p>
      <a href="https://www.nps.gov/wupa">Wupatki NPS</a> |
      <a href="https://www.nps.gov/sucr">Sunset Crater NPS</a> |
      <a href="https://www.nps.gov/waca">Walnut Canyon NPS</a>
    </p>
  `,

  mammothcave: `
    <h2>Mammoth Cave National Park</h2>
    <p>Mammoth Cave is best known for its immense underground labyrinth, but above ground, it’s also an International Dark Sky Park. Night skies here are Bortle 3, remarkably dark for the eastern U.S. The park hosts public astronomy events and “Star Party” nights in summer and fall.</p>
    <p>The Milky Way is visible June–September, with best clarity after midnight and around new moon. Humid summer nights can produce haze, so check the forecast. Light domes from Bowling Green and Nashville are faint and low on the horizon.</p>
    <ol>
      <li><strong>Doyle Valley Overlook</strong> – Sweeping sky views above the forested hills.</li>
      <li><strong>Visitor Center Parking Area</strong> – Used for ranger programs; decent darkness and convenience.</li>
    </ol>
    <h3>Camping</h3>
    <p>Three campgrounds (Mammoth Cave, Maple Springs, Houchin Ferry) with good sky access; backcountry sites offer even more solitude and darkness.</p>
    <h3>Lodging</h3>
    <p>Mammoth Cave Lodge is inside the park. Nearby Cave City and Park City have motels.</p>
    <h3>Access</h3>
    <p>Park is open year-round; main roads are paved. Night sky events are most frequent late spring through fall.</p>
    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/maca">Official Mammoth Cave NPS Site</a></p>
  `,

  buffaloriver: `
    <h2>Buffalo National River</h2>
    <p>Arkansas’s Buffalo River is a gem for stargazers—an International Dark Sky Park since 2019, with Bortle 2–3 skies over the Ozarks. The river corridor is especially dark between Tyler Bend and Buffalo Point. Light domes are minimal; small glows from Mountain Home and Harrison are low and avoidable.</p>
    <p>The Milky Way is spectacular May–September, arching over river bluffs and reflecting in calm water. Park hosts “Night Sky Viewing” events in summer and early fall. Best under new moon or after moonset for darkest skies.</p>
    <ol>
      <li><strong>Tyler Bend</strong> – Wide river bend with open sky; campground ideal for night shoots.</li>
      <li><strong>Buffalo Point</strong> – High bluff views and ranger programs for stargazers.</li>
    </ol>
    <h3>Camping</h3>
    <p>Several developed campgrounds and many riverside sites. Best darkness away from main access points; reserve ahead in peak season.</p>
    <h3>Lodging</h3>
    <p>No in-park lodging; cabins at Buffalo Point and motels in Yellville, Marshall, or Jasper.</p>
    <h3>Access</h3>
    <p>Park is open 24/7. Summer is warm, spring and fall offer crisp skies; humidity can bring haze at times.</p>
    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/buff">Official Buffalo National River Site</a></p>
  `,

  capelookout: `
    <h2>Cape Lookout National Seashore</h2>
    <p>Stretching along North Carolina’s Outer Banks, Cape Lookout offers Bortle 2–3 skies—some of the darkest on the U.S. East Coast. Once the last ferries depart, you’re left with quiet barrier islands and the vast Atlantic. Light domes from the mainland are faint and low; face east for inky darkness.</p>
    <p>The Milky Way is stunning March–October, rising over dunes and lighthouses. The Perseids are a highlight in August, with rangers sometimes hosting night sky events. In fall and spring, you can catch the zodiacal light along the eastern horizon.</p>
    <ol>
      <li><strong>Cape Lookout Lighthouse Area</strong> – Iconic Milky Way shots with the lighthouse; open Atlantic skies.</li>
      <li><strong>Shackleford Banks</strong> – Remote island, wild horses under the stars, outstanding darkness.</li>
    </ol>
    <h3>Camping</h3>
    <p>Primitive beach camping is allowed on all islands—no developed sites or facilities. Bring all supplies and follow Leave No Trace.</p>
    <h3>Lodging</h3>
    <p>Rustic cabins on Portsmouth Island or on the Core Banks (reserve ahead). Nearest hotels are on the mainland (Beaufort, Harkers Island).</p>
    <h3>Access</h3>
    <p>Accessible only by ferry or private boat. Weather changes rapidly; check forecasts. Mosquitoes can be fierce in summer—come prepared!</p>
    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/calo">Official Cape Lookout NPS Site</a></p>
  `,

  curecanti: `
    <h2>Curecanti National Recreation Area</h2>
    <p>Western Colorado’s Curecanti offers surprisingly dark skies (Bortle 2–3), thanks to its distance from cities and open reservoirs. The best views are along Blue Mesa Reservoir and at higher overlooks. Gunnison and Montrose create very faint domes low to the east and west.</p>
    <p>Milky Way season is April–September; summer is best for mirror-like reflections of the galaxy in calm water. The park hosts night sky interpretive events in summer and fall.</p>
    <ol>
      <li><strong>Dry Gulch Campground</strong> – Expansive water and sky vistas, excellent for night photography.</li>
      <li><strong>Lake Fork Area</strong> – Quiet, remote spot with minimal light pollution.</li>
    </ol>
    <h3>Camping</h3>
    <p>Multiple lakeshore campgrounds; best stargazing right from your tent by the water. Campgrounds fill in peak summer, so book early if possible.</p>
    <h3>Lodging</h3>
    <p>No in-park lodging. Gunnison (30 min) has motels and cabins. Sapinero Village offers limited lakeside cabins and RV sites.</p>
    <h3>Access</h3>
    <p>Open year-round, but some high-elevation roads close in winter. Summer is most reliable for clear skies.</p>
    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/cure">Official Curecanti NPS Site</a></p>
  `,

  dinosaur: `
    <h2>Dinosaur National Monument</h2>
    <p>Spanning the Colorado–Utah border, Dinosaur is a stargazing secret—Bortle 2 skies in its remote canyons and river valleys. Distant glows from Vernal, CO and Jensen, UT are present but can be avoided by heading deeper into the park.</p>
    <p>Milky Way best June–September, rising over Echo Park’s rock towers and rivers. Park occasionally offers night sky programs at the Quarry and Echo Park. Meteor showers and even zodiacal light can be caught from high overlooks.</p>
    <ol>
      <li><strong>Echo Park Campground</strong> – Wild, remote darkness with dramatic canyon walls.</li>
      <li><strong>Harpers Corner Overlook</strong> – Panoramic view; good for both casual stargazing and time-lapse photography.</li>
    </ol>
    <h3>Camping</h3>
    <p>Several campgrounds, with Echo Park being the darkest and most scenic for the Milky Way. Deerlodge Park (CO side) is also quiet and remote.</p>
    <h3>Lodging</h3>
    <p>No in-park lodging. Motels in Vernal, Utah or Craig, Colorado (20–60 min drives).</p>
    <h3>Access</h3>
    <p>Remote gravel roads to Echo Park—avoid them in storms. Main Quarry area is paved and easier to reach for evening programs. Summer is best for warmth and clear skies.</p>
    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/dino">Official Dinosaur NPS Site</a></p>
  `,

  mesaverde: `
    <h2>Mesa Verde National Park</h2>
    <p>Mesa Verde, a UNESCO World Heritage Site, is also a designated International Dark Sky Park (Bortle 2–3). You’ll find beautifully dark skies over ancient cliff dwellings—especially away from the visitor center, which has some lighting. Small light domes from Cortez and Durango are low and easy to avoid.</p>
    <p>Milky Way arches above the mesa May–September. Meteor showers and the occasional lightning storm add drama in monsoon season. Watch for ranger-led stargazing events in summer.</p>
    <ol>
      <li><strong>Park Point Overlook</strong> – Highest point in the park; vast views in all directions.</li>
      <li><strong>Morefield Campground Area</strong> – Wide open sky and easy access after dark.</li>
    </ol>
    <h3>Camping</h3>
    <p>Morefield Campground is the only one in the park—excellent access to darkness. Book early for summer stargazing.</p>
    <h3>Lodging</h3>
    <p>Far View Lodge inside the park. Additional motels in Cortez (10 miles west).</p>
    <h3>Access</h3>
    <p>Park is open year-round, but high mesa roads can close in winter. Summer is best for warm, dry nights and active astronomy programs.</p>
    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/meve">Official Mesa Verde NPS Site</a></p>
  `,

  goosenecks: `
    <h2>Goosenecks State Park</h2>
    <p>This small Utah state park is famed for its deep meanders of the San Juan River—and its excellent dark skies (Bortle 2). There’s virtually no light pollution; you’ll see a faint glow from Monument Valley on rare occasions.</p>
    <p>Milky Way core is stunning from April to September, rising over the canyon twists. Perseids and Geminids meteor showers are especially memorable with such open sky.</p>
    <ol>
      <li><strong>Main Overlook</strong> – Set up along the rim for classic Milky Way/canyon compositions.</li>
      <li><strong>South Rim Pullouts</strong> – For more solitude and new foregrounds.</li>
    </ol>
    <h3>Camping</h3>
    <p>Primitive camping on the rim—no facilities, but amazing darkness. First-come, first-served.</p>
    <h3>Lodging</h3>
    <p>Closest motels in Mexican Hat, Utah (4 miles). Consider camping for the full night sky experience.</p>
    <h3>Access</h3>
    <p>Open year-round, accessible by paved road. Summer brings warm, dry nights. The rim is unfenced—use caution in the dark.</p>
    <h3>Official Links</h3>
    <p><a href="https://stateparks.utah.gov/parks/goosenecks/">Official Goosenecks State Park Site</a></p>
  `,

  picturedrocks: `
    <h2>Pictured Rocks National Lakeshore</h2>
    <p>Pictured Rocks, on Lake Superior, is known for its sea cliffs—and its dark, northern skies (Bortle 2–3). Light domes from Munising and Marquette are faint and mostly low in the south and west; looking north over the lake is inky black.</p>
    <p>Milky Way and northern lights are both possible here. Best viewing May–September for the galaxy, March/April and September/October for aurora. Perseids meteor shower is a highlight every August.</p>
    <ol>
      <li><strong>Miners Castle Overlook</strong> – Lake views and dark sky, easy access.</li>
      <li><strong>Chapel Beach</strong> – Remote, beautiful stargazing with aurora potential over Lake Superior.</li>
    </ol>
    <h3>Camping</h3>
    <p>Several lakeshore campgrounds; backcountry camping offers best solitude. Camp on the beach for Milky Way over water.</p>
    <h3>Lodging</h3>
    <p>Hotels and cabins in Munising. For maximum darkness, camp in the park.</p>
    <h3>Access</h3>
    <p>Accessible spring–fall. Some sites require hikes of 1–2 miles from parking. Prepare for sudden weather changes on the lake.</p>
    <h3>Official Links</h3>
    <p><a href="https://www.nps.gov/piro">Official Pictured Rocks NPS Site</a></p>
`,

  portcrescent: `
    <h2>Port Crescent State Park</h2>
    <p>This Michigan state park on Lake Huron is famed for its dark skies (Bortle 3), with wide, sandy beaches facing north over open water. Town lights from Port Austin and Caseville are low and behind you if you shoot north.</p>
    <p>Milky Way arches across the sky May–August; aurora borealis sometimes dances above the lake in spring and autumn. Watch for meteor showers reflected in the water.</p>
    <ol>
      <li><strong>Beachfront</strong> – Expansive northern views; ideal for aurora and Milky Way shots over water.</li>
      <li><strong>Dune Overlook Trail</strong> – For higher perspective and quiet night skies.</li>
    </ol>
    <h3>Camping</h3>
    <p>Modern campground with beach access; reserve early for new moon weekends.</p>
    <h3>Lodging</h3>
    <p>No in-park lodging. Motels in Port Austin and Caseville (10–20 min drives).</p>
    <h3>Access</h3>
    <p>Accessible year-round; best skies late spring–fall. Prepare for mosquitoes in summer and chilly winds from the lake.</p>
    <h3>Official Links</h3>
    <p><a href="https://www.michigan.gov/dnr/places/state-parks/port-crescent">Official Port Crescent State Park Site</a></p>
  `,

  aorakimackenzie: `<h2>Aoraki Mackenzie International Dark Sky Reserve</h2> <p>New Zealand’s South Island is home to this legendary reserve—the world’s largest dark sky reserve, with Bortle 1–2 skies over the Southern Alps and Mackenzie Basin. Virtually no light pollution for 100 km in all directions; the Milky Way is brilliant, and the Magellanic Clouds are visible to the naked eye.</p> <p>Milky Way is visible year-round, with the core highest April–August. Aurora Australis is occasionally visible low in the south. Major stargazing events and tours at the Mt. John Observatory (Lake Tekapo).</p> <ol> <li><strong>Lake Tekapo Foreshore</strong> – Iconic church foreground and wide sky views.</li> <li><strong>Mt. John Summit</strong> – Observatory site; highest public road in NZ and 360° sky.</li> </ol> <h3>Camping</h3> <p>Multiple holiday parks and freedom camping options around Tekapo and Twizel.</p> <h3>Lodging</h3> <p>Hotels, motels, and lodges in Tekapo, Twizel, and Lake Pukaki area.</p> <h3>Access</h3> <p>Best in southern autumn and winter for clear, crisp skies. Weather can be unpredictable—bring warm layers year-round.</p> <h3>Official Links</h3> <p><a href="https://www.darksky.org/our-work/conservation/idsp/reserves/aoraki-mackenzie/">Aoraki Mackenzie Dark Sky Reserve Info</a></p>`,
};
