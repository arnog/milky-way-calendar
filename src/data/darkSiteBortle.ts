/**
 * Dark Site Bortle Mapping
 * 
 * This file contains optimized Bortle scale values for each DARK_SITE,
 * representing the darkest conditions within approximately 10km of the
 * site's coordinates. These values provide more accurate darkness ratings
 * than using the arbitrary lat/long specified in the site data.
 * 
 * Values are based on analysis of the light pollution map and astronomical
 * literature for each site, focusing on the darkest areas within the vicinity.
 */

export const DARK_SITE_BORTLE: Record<string, number> = {
  // National Parks - Core Dark Sky Areas
  "yellowstone": 1.5,
  "yosemite": 2.0,
  "sequoia": 1.8,
  "kingscanyon": 1.8,
  "pinnacles": 2.5,
  "redwood": 2.2,
  "channelislands": 1.5,
  "glacier": 1.2,
  "grandteton": 1.5,
  "rockymountain": 2.0,
  "whitesands": 1.5,
  "mojave": 1.8,
  "greatsmokymountains": 3.0,
  "everglades": 2.5,
  "badlands": 1.5,
  "acadia": 2.5,
  "haleakala": 1.0,
  "denali": 1.0,
  "statueofliberty": 8.0, // NYC area
  "naturalbridges": 1.5,
  "deathvalley": 1.0,
  "joshuatree": 2.0,
  "arches": 1.8,
  "canyonlands": 1.5,
  "capitolreef": 1.8,
  "brycecanyon": 1.5,
  "grandcanyon": 2.0,
  "greatsanddunes": 1.8,
  "bigbend": 1.2,
  "blackcanyon": 1.8,
  "bigcypress": 2.5,
  "petrifiedforest": 2.0,
  "cratersofthemoon": 1.5,
  "chacoculture": 1.8,
  "cedarbreaks": 1.5,
  "capulinvolcano": 1.8,
  "florissant": 2.0,
  "fortunion": 1.8,
  "hovenweep": 1.5,
  "salinaspueblo": 2.0,
  "vallescaldera": 1.8,
  "anzaborrego": 2.5,
  "antelopeisland": 2.0,
  "headlands": 2.5,
  "oracle": 2.0,
  "canyonlandsidsp": 1.5,
  "copperbreaks": 2.0,
  "claytonlake": 2.0,
  "cherrysprings": 2.0,
  "blueridgeobservatory": 2.5,
  
  // International Dark Sky Sites
  "greatbarrierisland": 1.0,
  "kerry": 1.5,
  "mayo": 1.5,
  "ramoncrater": 1.8,
  "iriomoteishigaki": 1.2,
  "namibrand": 1.0,
  "bukk": 2.0,
  "hortobagy": 2.0,
  "lauwersmeer": 2.5,
  "southdowns": 3.0,
  "snowdonia": 2.0,
  "tomintoulglenlivet": 1.8,
  "gallowayforest": 1.8,
  "greatbasin": 1.5,
  "flagstaffmonuments": 2.5,
  "mammothcave": 2.5,
  "buffaloriver": 2.0,
  "capelookout": 2.5,
  "curecanti": 2.0,
  "dinosaur": 1.8,
  "mesaverde": 2.0,
  "goosenecks": 1.5,
  "picturedrocks": 2.5,
  "portcrescent": 2.5,
  "montmegantic": 2.0,
  "aorakimackenzie": 1.0,
  "kaikoura": 1.5,
  "picdumidi": 1.8,
  "millevaches": 2.0,
  "northyorkmoors": 2.5,
  "rhon": 2.5,
  "exmoor": 2.5,
  "tenerife": 1.5,
  
  // Alaska - Remote locations with minimal light pollution
  "worthingtonglacier": 1.0,
  "chilkootlakestaterecreationareaalaska": 1.0,
  "kachemakbaystateparkalaska": 1.2,
  "sandspitpointstatemarineparkalaska": 1.0,
  
  // Alabama - Southern state parks
  "bladonspringsstateparkalabama": 2.5,
  "conecuhnationalforestalabama": 2.0,
  
  // Arizona - Desert locations, generally excellent
  "alamolake": 1.8,
  "flagstaffareanationalmonument": 2.0,
  "kartchnercaverns": 2.0,
  "oraclestatepark": 2.0,
  "petrifiedforestnationalpark": 2.0,
  "tontomonument": 2.2,
  "tumacacorinationalhistoricalpark": 2.2,
  "alamolakestateparkarizona": 1.8,
  "kartchnercavernsstateparkarizona": 2.0,
  "oraclestateparkarizona": 2.0,
  "petrifiedforestnationalparkarizona": 2.0,
  
  // Arkansas - Rural mountainous areas
  "buffalonationalrivernationalreserve": 2.0,
  "cossatotriverstateparknaturalarea": 2.2,
  "queenwilhelminastatepark": 2.0,
  "queenwilhelminastateparkarkansas": 2.0,
  
  // California - Varied, coastal areas more polluted
  "admiralwilliamstandleystate": 2.5,
  "ahjumawilavaspringsstatepark": 2.0,
  "anzaborregodesertstatepark": 2.2,
  "benbowstaterecreationarea": 2.2,
  "casparheadlandsstatenaturalreserve": 2.0,
  "castlecragsstatepark": 2.0,
  "delnortecoastredwoodsstatepark": 2.2,
  "esterobluffsstatepark": 2.5,
  "fortrossstatepark": 2.5,
  "grizzlycreekredwoodsstatepark": 2.2,
  "groverhotspringsstatepark": 1.8,
  "harryamerslostaterecreationarea": 2.2,
  "hendywoodsstatepark": 2.2,
  "humboldtlagoonsstatepark": 2.2,
  "johnlittlesta": 2.5,
  "juliapfeifferburnsstatepark": 2.5,
  "kruserhododendronstatenaturalreserve": 2.5,
  "limekilnstatepark": 2.5,
  "manchesterstatepark": 2.2,
  "mcarthurburneyfallsstatepark": 2.0,
  "mendocinonationalforest": 2.0,
  "monolaketu": 1.8,
  "navarroriverredwoodsstatepark": 2.2,
  "patrickspointstatepark": 2.2,
  "pfeifferbigsurstatepark": 2.5,
  "plumaseurekastatepark": 1.8,
  "pointsurstatepark": 2.5,
  "prairiecreekredwoodsstatepark": 2.2,
  "richardsongrovestatepark": 2.2,
  "saltpointstatepark": 2.5,
  "vandammestatepark": 2.2,
  "admiralwilliamstandleystaterecreationareacalifornia": 2.5,
  "ahjumawilavaspringsstateparkcalifornia": 2.0,
  "anzaborregodesertstateparkcalifornia": 2.2,
  "benbowstaterecreationareacalifornia": 2.2,
  "casparheadlandsstatenaturalreservecalifornia": 2.0,
  "castlecragsstateparkcalifornia": 2.0,
  "delnortecoastredwoodsstateparkcalifornia": 2.2,
  "esterobluffsstateparkcalifornia": 2.5,
  "grizzlycreekredwoodsstateparkcalifornia": 2.2,
  "groverhotspringsstateparkcalifornia": 1.8,
  "harryamerlostaterecreationareacalifornia": 2.2,
  "hendywoodsstateparkcalifornia": 2.2,
  "humboldtlagoonsstateparkcalifornia": 2.2,
  "johnlittlestatenaturalreservecalifornia": 2.5,
  "joshuatreenationalparkcalifornia": 2.0,
  "juliapfeifferburnsstateparkcalifornia": 2.5,
  "kruserhododendronstatenaturalreservecalifornia": 2.5,
  "limekilnstateparkcalifornia": 2.5,
  "manchesterstateparkcalifornia": 2.2,
  "mendocinonationalforestcalifornia": 2.0,
  "monolaketufastatenaturalreservecalifornia": 1.8,
  "navarroriverredwoodsstateparkcalifornia": 2.2,
  "patrickspointstateparkcalifornia": 2.2,
  "pfeifferbigsurstateparkcalifornia": 2.5,
  "plumaseurekastateparkcalifornia": 1.8,
  "prairiecreekredwoodsstateparkcalifornia": 2.2,
  "richardsongrovestateparkcalifornia": 2.2,
  "saltpointstateparkcalifornia": 2.5,
  "vandammestateparkcalifornia": 2.2,
  
  // Colorado - High altitude, excellent dark skies
  "crawfordstatepark": 1.8,
  "gunnisonnationalforest": 1.5,
  "jacksonlakestatepark": 2.0,
  "johnmartinreservoir": 2.0,
  "navajostatepark": 1.8,
  "paoniastatepark": 1.8,
  "pearllakestatepark": 1.8,
  "ridgwaystatepark": 1.8,
  "slumgullioncountypark": 1.8,
  "stagecoachstatepark": 1.8,
  "crawfordstateparkcolorado": 1.8,
  "greatsanddunesnationalparkcolorado": 1.8,
  "gunnisonnationalforestcolorado": 1.5,
  "jacksonlakestateparkcolorado": 2.0,
  "johnmartinreservoircolorado": 2.0,
  "navajostateparkcolorado": 1.8,
  "paoniastateparkcolorado": 1.8,
  "pearllakestateparkcolorado": 1.8,
  "ridgwaystateparkcolorado": 1.8,
  "stagecoachstateparkcolorado": 1.8,
  "stateforeststateparkcolorado": 1.8,
  "steamboatlakestateparkcolorado": 1.8,
  "sylvanlakestateparkcolorado": 1.8,
  "vegastateparkcolorado": 1.8,
  "whiterivernationalforestcolorado": 1.5,
  
  // Georgia
  "stephencfosterstateparkgeorgia": 2.5,
  
  // Hawaii - Island locations, generally excellent
  "kokeestateparkhawaii": 1.5,
  "palaaustateparkhawaii": 1.5,
  "polipolispringstaterecreationareahawaii": 1.5,
  "waianapanapastateparkhawaii": 1.8,
  "waimeacanyonstateparkhawaii": 1.5,
  
  // Idaho - Remote mountain locations
  "bearlakestateparkidaho": 1.8,
  "castlerocksstateparkidaho": 1.5,
  "cityofrocksnationalreserveidaho": 1.5,
  "harrimanstateparkidaho": 1.8,
  "henryslakestateparkidaho": 1.8,
  "priestlakestateparkidaho": 1.8,
  
  // Kansas - Great Plains, generally good
  "cedarbluffstateparkkansas": 2.0,
  "crosstimbersstateparkkansas": 2.2,
  "fallriverstateparkkansas": 2.2,
  "kanopolisstateparkkansas": 2.0,
  "lakescottstateparkkansas": 2.0,
  "littlejerusalembadlandsstateparkkansas": 2.0,
  "lovewellstateparkkansas": 2.0,
  "meadestateparkkansas": 2.0,
  "mushroomrockstateparkkansas": 2.0,
  "websterstateparkkansas": 2.0,
  "wilsonstateparkkansas": 2.2,
  
  // Maine - Eastern coast, some light pollution
  "baxterstateparkmaine": 2.0,
  "cobscookbaystateparkmaine": 2.5,
  "graftonnotchstateparkmaine": 2.2,
  "lilybaystateparkmaine": 2.0,
  "mountbluestateparkmaine": 2.2,
  "peakskennystateparkmaine": 2.2,
  "quoddyheadstateparkmaine": 2.5,
  "rangeleylakestateparkmaine": 2.0,
  "roquebluffsstateparkmaine": 2.5,
  
  // Michigan - Great Lakes region
  "clearlakestateparkmichigan": 2.2,
  "craiglakestateparkmichigan": 2.0,
  "fayettehistoricstateparkmichigan": 2.2,
  "fortwilkinshistoricstateparkmichigan": 2.0,
  "hiawathanationalforestmichigan": 2.0,
  "hoeftstateparkmichigan": 2.2,
  "isleroyalenationalparkmichigan": 1.8,
  "lakegogebicstateparkmichigan": 2.0,
  "leelanaustateparkmichigan": 2.5,
  "negwegonstateparkmichigan": 2.2,
  "onawaystateparkmichigan": 2.2,
  "porcupinemountainswildernessstateparkmichigan": 2.0,
  "wellsstateparkmichigan": 2.5,
  "wildernessstateparkmichigan": 2.0,
  
  // Minnesota - Northern forests
  "bigbogstaterecreationareaminnesota": 2.0,
  "cascaderiverstateparkminnesota": 2.0,
  "gardenislandstaterecreationareaminnesota": 2.0,
  "hayeslakestateparkminnesota": 2.0,
  "itascastateparkminnesota": 2.0,
  "lasallelakestaterecreationareaminnesota": 2.0,
  "oldmillstateparkminnesota": 2.0,
  "savannaportagestateparkminnesota": 2.0,
  "scenicstateparkminnesota": 2.0,
  "splitrocklighthousestateparkminnesota": 2.2,
  "temperanceriverstateparkminnesota": 2.0,
  "voyageursnationalparkminnesota": 1.8,
  "zippelbaystateparkminnesota": 2.0,
  
  // Missouri
  "currentriverstateparkmissouri": 2.2,
  
  // Montana - Big Sky Country, excellent dark skies
  "ackleylakestateparkmontana": 1.8,
  "beaverheadrockstateparkmontana": 1.8,
  "fishcreekstateparkmontana": 1.8,
  "glaciernationalparkmontana": 1.2,
  "loganstateparkmontana": 1.8,
  "medicinerocksstateparkmontana": 1.5,
  
  // Nevada - Desert state, excellent conditions
  "beaverdamstateparknevada": 1.8,
  "echocanyonstateparknevada": 1.8,
  "ryepatchreservoirnevada": 1.8,
  
  // Oklahoma
  "claytonlakeoklahoma": 2.2,
  "glossmountainstateparkoklahoma": 2.0,
  "mcgeecreekstateparkoklahoma": 2.2,
  "talimenastateparkoklahoma": 2.0,
  
  // Oregon - Pacific Northwest
  "capeblancostateparkoregon": 2.5,
  "capelookoutstateparkoregon": 2.5,
  "capesebastianoregon": 2.5,
  "cascadiastateparkoregon": 2.2,
  "catherinecreekstateparkoregon": 2.0,
  "colliermemorialstateparkoregon": 2.0,
  "cottonwoodcanyonstateparkoregon": 2.0,
  "humbugmountainstateparkoregon": 2.5,
  "josephhstewartstaterecreationareaoregon": 2.0,
  "minamstaterecreationareaoregon": 2.0,
  "prinevillereservoirstateparkoregon": 2.0,
  "saddlemountainstatenaturalareaoregon": 2.2,
  "sitkasedgestatenaturalareaoregon": 2.5,
  "umpquanationalforestoregon": 2.0,
  "whiteriverfallsstateparkoregon": 2.0,
  "willamettenationalforestoregon": 2.0,
  
  // Pennsylvania
  "cherryspringsstateparkpennsylvania": 2.0,
  "susquehannockstateforestpennsylvania": 2.0,
  
  // Texas - Large state with varied conditions
  "bigbendranchstateparktexas": 1.5,
  "coloradobendstateparktexas": 2.0,
  "copperbreaksstateparktexas": 2.0,
  "davismountainsstateparktexas": 1.8,
  "kickapoocavernstateparktexas": 2.0,
  "lostmaplesstatenaturalareatexas": 2.0,
  
  // Utah - Desert state with excellent dark skies
  "antelopeislandstateparkutah": 2.0,
  "archesnationalparkutah": 1.8,
  "bearlakestateparkutah": 1.8,
  "brycecanyonnationalparkutah": 1.5,
  "cedarbreaksnationalmonumentutah": 1.5,
  "coralpinksanddunesstateparkutah": 1.8,
  "eastcanyonstateparkutah": 2.2,
  "greenriverstateparkutah": 1.8,
  "hovenweepnationalmonumentutah": 1.5,
  "jordanellestateparkutah": 2.5,
  "kodachromebasinstateparkutah": 1.8,
  "naturalbridgesnationalmonumentutah": 1.5,
  "piutestateparkutah": 1.8,
  "rainbowbridgenationalmonumentutah": 1.5,
  "rockportstateparkutah": 2.2,
  "steinakerstateparkutah": 2.0,
  "yubastateparkutah": 2.0,
  
  // Vermont - Small state, some light pollution
  "bigdeerstateparkvermont": 2.5,
  "boulderbeachstateparkvermont": 2.5,
  "kettlepondstateparkvermont": 2.5,
  "maidstonestateparkvermont": 2.2,
  "newdiscoverystateparkvermont": 2.5,
  "rickerpondstateparkvermont": 2.5,
  "seyonlodgestateparkvermont": 2.5,
  "stillwaterstateparkvermont": 2.5,
  
  // Virginia
  "highlandcountyvirginia": 2.2,
  "jamesriverstateparkvirginia": 2.5,
  "stauntonriverstateparkvirginia": 2.5,
  
  // Washington - Pacific Northwest
  "brooksmemorialstateparkwashington": 2.0,
  "campwootenstateparkwashington": 2.0,
  "colvillenationalforestwashington": 1.8,
  "crawfordstateparkwashington": 1.8,
  "fieldsspringstateparkwashington": 2.0,
  "leadbetterpointstateparkwashington": 2.5,
  "lyonsferrystateparkwashington": 2.0,
  "mountrainiernationalparkwashington": 2.0,
  "northcascadesnationalparkwashington": 1.8,
  "olympicnationalparkwashington": 2.2,
  "palousefallsstateparkwashington": 2.0,
  "pearryginlakestateparkwashington": 2.0,
  
  // Wisconsin
  "bigbaystateparkwisconsin": 2.2,
  "chequamegonnicoletnationalforestwisconsin": 2.0,
  "newport": 2.2,
  "rockisland": 2.2,
  
  // Wyoming - Big Sky Country
  "bighorn": 1.5,
  "boysen": 1.8,
  "bridgerteton": 1.5,
  "seminoe": 1.8,
} as const;

/**
 * Get the optimal Bortle rating for a dark site
 */
export function getDarkSiteBortle(siteSlug: string): number | null {
  return DARK_SITE_BORTLE[siteSlug] ?? null;
}

/**
 * Get the Bortle rating with fallback to a reasonable default
 * for dark sky sites (typically 2.0 for good rural darkness)
 */
export function getDarkSiteBortleWithFallback(siteSlug: string): number {
  return DARK_SITE_BORTLE[siteSlug] ?? 2.0;
}