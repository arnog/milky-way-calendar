const LARGE_CITIES = [
  ["Tokyo, Japan", "Tokyo", 35.68972, 139.69222],
  ["Delhi, India", "Delhi", 28.61, 77.23],
  ["Shanghai, China", "Shanghai", 31.22861, 121.47472, "shanghai-suzhou"],
  ["São Paulo, Brazil", "São Paulo", -23.55, -46.633],
  ["Mexico City, Mexico", "Mexico City", 19.433, -99.133],
  ["Cairo, Egypt", "Cairo", 30.04444, 31.23583],
  ["Mumbai, India", "Mumbai", 19.07611, 72.8775],
  ["Beijing, China", "Beijing", 39.90667, 116.3975],
  ["Dhaka, Bangladesh", "Dhaka", 23.76444, 90.38889],
  ["Osaka, Japan", "Osaka", 34.69389, 135.50222],
  ["New York City, USA", "NYC", 40.71278, -74.00611],
  ["Tehran, Iran", "Tehran", 35.68889, 51.38972],
  ["Karachi, Pakistan", "Karachi", 24.86, 67.01],
  ["Kolkata, India", "Kolkata", 22.5726, 88.3639],
  ["Buenos Aires, Argentina", "Buenos Aires", -34.60372, -58.38159],
  ["Chongqing, China", "Chongqing", 29.563, 106.551],
  ["Istanbul, Turkey", "Istanbul", 41.0082, 28.9784],
  ["Manila, Philippines", "Manila", 14.5995, 120.9842],
  ["Lagos, Nigeria", "Lagos", 6.5244, 3.3792],
  ["Rio de Janeiro, Brazil", "Rio", -22.90685, -43.1729],
  ["Tianjin, China", "Tianjin", 39.3433, 117.3616],
  ["Kinshasa, DR Congo", "Kinshasa", -4.44193, 15.2663],
  ["Guangzhou, China", "Guangzhou", 23.12911, 113.26439, "pearl-river-delta"],
  [
    "Los Angeles, California, USA",
    "LA",
    34.05223,
    -118.24368,
    "los-angeles-area",
  ],
  ["Moscow, Russia", "Moscow", 55.75583, 37.6173],
  ["Shenzhen, China", "Shenzhen", 22.5431, 114.05786, "pearl-river-delta"],
  ["Lahore, Pakistan", "Lahore", 31.52037, 74.35875],
  ["Bengaluru, India", "Bangalore", 12.9716, 77.5946],
  ["Paris, France", "Paris", 48.85661, 2.35222],
  ["Bogotá, Colombia", "Bogotá", 4.711, -74.0721],
  ["Jakarta, Indonesia", "Jakarta", -6.20876, 106.8456],
  ["Chennai, India", "Chennai", 13.08268, 80.27072],
  ["Lima, Peru", "Lima", -12.04637, -77.04279],
  ["Bangkok, Thailand", "Bangkok", 13.75633, 100.50177],
  ["Seoul, South Korea", "Seoul", 37.56654, 126.978],
  ["Nagoya, Japan", "Nagoya", 35.18145, 136.9064],
  ["Hyderabad, India", "Hyderabad", 17.38504, 78.48667],
  ["London, UK", "London", 51.50735, -0.12776],
  ["Chicago, Illinois, USA", "Chicago", 41.87811, -87.6298],
  ["Chengdu, China", "Chengdu", 30.57281, 104.0668],
  ["Nanjing, China", "Nanjing", 32.06025, 118.79687],
  ["Wuhan, China", "Wuhan", 30.59285, 114.30554],
  ["Ho Chi Minh City, Vietnam", "Ho Chi Minh", 10.8231, 106.6297],
  ["Luanda, Angola", "Luanda", -8.83833, 13.23444],
  ["Ahmedabad, India", "Ahmedabad", 23.0225, 72.57136],
  ["Kuala Lumpur, Malaysia", "KL", 3.139, 101.68685],
  ["Xi'an, China", "Xi'an", 34.34157, 108.93977],
  ["Hong Kong, China", "Hong Kong", 22.3193, 114.16936, "pearl-river-delta"],
  ["Dongguan, China", "Dongguan", 23.02067, 113.75179, "pearl-river-delta"],
  ["Hangzhou, China", "Hangzhou", 30.27408, 120.15507],
  ["Foshan, China", "Foshan", 23.02148, 113.12144, "pearl-river-delta"],
  ["Shenyang, China", "Shenyang", 41.80563, 123.43147],
  ["Riyadh, Saudi Arabia", "Riyadh", 24.71355, 46.6753],
  ["Baghdad, Iraq", "Baghdad", 33.31524, 44.36606],
  ["Santiago, Chile", "Santiago", -33.44889, -70.66927],
  ["Surat, India", "Surat", 21.17024, 72.83106],
  ["Madrid, Spain", "Madrid", 40.41678, -3.70379],
  ["Suzhou, China", "Suzhou", 31.29834, 120.58319, "shanghai-suzhou"],
  ["Pune, India", "Pune", 18.52043, 73.85674],
  ["Harbin, China", "Harbin", 45.80377, 126.53497],
  ["Houston, Texas, USA", "Houston", 29.76043, -95.3698],
  ["Dallas, Texas, USA", "Dallas", 32.77666, -96.79699],
  ["Toronto, Ontario, Canada", "Toronto", 43.65323, -79.38318],
  ["Dar es Salaam, Tanzania", "Dar", -6.79235, 39.20833],
  ["Miami, Florida, USA", "Miami", 25.76168, -80.19179],
  ["Belo Horizonte, Brazil", "Belo Horizonte", -19.91668, -43.93449],
  ["Singapore, Singapore", "Singapore", 1.35208, 103.81984],
  ["Philadelphia, Pennsylvania, USA", "Philly", 39.95258, -75.16522],
  ["Atlanta, USA", "Atlanta", 33.749, -84.38798],
  ["Fukuoka, Japan", "Fukuoka", 33.59035, 130.40172],
  ["Khartoum, Sudan", "Khartoum", 15.50065, 32.5599],
  ["Barcelona, Spain", "Barcelona", 41.38506, 2.1734],
  ["Johannesburg, South Africa", "Joburg", -26.2041, 28.04731],
  ["Saint Petersburg, Russia", "St. Petersburg", 59.93428, 30.3351],
  ["Qingdao, China", "Qingdao", 36.06711, 120.38261],
  ["Dalian, China", "Dalian", 38.91369, 121.61476],
  ["Washington, Washington DC, USA", "Washington DC", 38.90719, -77.03687],
  ["Yangon, Myanmar", "Yangon", 16.84086, 96.17352],
  ["Alexandria, Egypt", "Alexandria", 31.20009, 29.91874],
  ["Jinan, China", "Jinan", 36.65122, 117.12009],
  ["Guadalajara, Mexico", "Guadalajara", 20.6597, -103.3496],
  ["Monterrey, Mexico", "Monterrey", 25.68661, -100.31611],
  ["Sydney, Australia", "Sydney", -33.86882, 151.2093],
  ["Urumqi, China", "Urumqi", 43.82559, 87.61685],
  ["Changsha, China", "Changsha", 28.22821, 112.93881],
  ["Cape Town, South Africa", "Cape Town", -33.92487, 18.42406],
  ["Jeddah, Saudi Arabia", "Jeddah", 21.48581, 39.1925],
  ["Brasília, Brazil", "Brasília", -15.82669, -47.92182],
  ["Kunming, China", "Kunming", 25.03889, 102.71827],
  ["Changchun, China", "Changchun", 43.81602, 125.32357],
  ["Kabul, Afghanistan", "Kabul", 34.55535, 69.20748],
  ["Yaoundé, Cameroon", "Yaoundé", 3.848, 11.5021],
  ["Hefei, China", "Hefei", 31.82059, 117.22724],
  ["Ningbo, China", "Ningbo", 29.86834, 121.544],
  ["Shantou, China", "Shantou", 23.35409, 116.68197],
  ["Kano, Nigeria", "Kano", 12.00218, 8.59196],
  ["Tel Aviv, Israel", "Tel Aviv", 32.0853, 34.78177],
  ["New Taipei, Taiwan", "New Taipei", 25.01698, 121.46279],
  ["Shijiazhuang, China", "Shijiazhuang", 38.04276, 114.5143],
  ["Jaipur, India", "Jaipur", 26.91243, 75.78727],

  /* California Largest Cities */
  [
    "San Diego, California, USA",
    "San Diego",
    32.7157,
    -117.1611,
    "san-diego-area",
  ],
  [
    "San Jose, California, USA",
    "San Jose",
    37.3382,
    -121.8863,
    "san-jose-area",
  ],
  [
    "San Francisco, California, USA",
    "San Francisco",
    37.7749,
    -122.4194,
    "sf-bay-area",
  ],
  [
    "Fresno, California, USA",
    "Fresno",
    36.7378,
    -119.7871,
    "fresno-california",
  ],
  [
    "Sacramento, California, USA",
    "Sacramento",
    38.5816,
    -121.4944,
    "sacramento-california",
  ],
  [
    "Long Beach, California, USA",
    "Long Beach",
    33.7701,
    -118.1937,
    "los-angeles-area",
  ],
  ["Oakland, California, USA", "Oakland", 37.8044, -122.2711, "sf-bay-area"],
  [
    "Bakersfield, California, USA",
    "Bakersfield",
    35.3733,
    -119.0187,
    "bakersfield-california",
  ],
  [
    "Anaheim, California, USA",
    "Anaheim",
    33.8366,
    -117.9143,
    "los-angeles-area",
  ],
  [
    "Stockton, California, USA",
    "Stockton",
    37.9577,
    -121.2908,
    "stockton-california",
  ],
  [
    "Riverside, California, USA",
    "Riverside",
    33.9806,
    -117.3755,
    "los-angeles-area",
  ],
  ["Irvine, California, USA", "Irvine", 33.6846, -117.8265, "los-angeles-area"],
  [
    "Santa Ana, California, USA",
    "Santa Ana",
    33.7455,
    -117.8677,
    "los-angeles-area",
  ],
  [
    "Chula Vista, California, USA",
    "Chula Vista",
    32.6401,
    -117.0842,
    "san-diego-area",
  ],
  ["Fremont, California, USA", "Fremont", 37.5483, -121.9886, "sf-bay-area"],
  [
    "San Bernardino, California, USA",
    "San Bernardino",
    34.1083,
    -117.2898,
    "los-angeles-area",
  ],
  [
    "Modesto, California, USA",
    "Modesto",
    37.6391,
    -120.9969,
    "modesto-california",
  ],
  [
    "Fontana, California, USA",
    "Fontana",
    34.0922,
    -117.435,
    "los-angeles-area",
  ],
  [
    "Moreno Valley, California, USA",
    "Moreno Valley",
    33.9425,
    -117.2297,
    "los-angeles-area",
  ],
];

export const DARK_SITES = [
  /* Dark Sky Parks and Reserves and National Parks */
  [
    "Yellowstone National Park, Wyoming/Montana/Idaho, USA",
    "Yellowstone",
    44.6,
    -110.5,
    "yellowstone",
  ],
  [
    "Yosemite National Park, California, USA",
    "Yosemite",
    37.8651,
    -119.5383,
    "yosemite",
  ],
  [
    "Sequoia National Park, California, USA",
    "Sequoia",
    36.4864,
    -118.5658,
    "sequoia",
  ],
  [
    "Kings Canyon National Park, California, USA",
    "Kings Canyon",
    36.8879,
    -118.5551,
    "kingscanyon",
  ],
  [
    "Pinnacles National Park, California, USA",
    "Pinnacles",
    36.4915,
    -121.1972,
    "pinnacles",
  ],
  [
    "Redwood National and State Parks, California, USA",
    "Redwood",
    41.2132,
    -124.0046,
    "redwood",
  ],
  [
    "Channel Islands National Park, California, USA",
    "Channel Islands",
    34.0069,
    -119.7785,
    "channelislands",
  ],
  [
    "Glacier National Park, Montana, USA",
    "Glacier",
    48.7596,
    -113.787,
    "glacier",
  ],
  [
    "Grand Teton National Park, Wyoming, USA",
    "Grand Teton",
    43.7908,
    -110.6849,
    "grandteton",
  ],
  [
    "Rocky Mountain National Park, Colorado, USA",
    "Rocky Mountain",
    40.3428,
    -105.6836,
    "rockymountain",
  ],
  [
    "White Sands National Park, New Mexico, USA",
    "White Sands",
    32.7797,
    -106.1717,
    "whitesands",
  ],
  [
    "Mojave National Preserve, California, USA",
    "Mojave",
    35.1417,
    -115.5104,
    "mojave",
  ],
  [
    "Great Smoky Mountains National Park, Tennessee/North Carolina, USA",
    "Great Smoky Mountains",
    35.6118,
    -83.4895,
    "greatsmokymountains",
  ],
  [
    "Everglades National Park, Florida, USA",
    "Everglades",
    25.2866,
    -80.8987,
    "everglades",
  ],
  [
    "Badlands National Park, South Dakota, USA",
    "Badlands",
    43.8554,
    -102.3397,
    "badlands",
  ],
  ["Acadia National Park, Maine, USA", "Acadia", 44.3386, -68.2733, "acadia"],
  [
    "Haleakalā National Park, Hawaii, USA",
    "Haleakalā",
    20.7097,
    -156.2532,
    "haleakala",
  ],
  ["Denali National Park, Alaska, USA", "Denali", 63.1148, -151.1926, "denali"],
  [
    "Statue of Liberty NM, New York, USA",
    "Statue of Liberty",
    40.6892,
    -74.0445,
    "statueofliberty",
  ],
  [
    "Natural Bridges National Monument, Utah, USA",
    "Natural Bridges",
    37.6,
    -110.01,
    "naturalbridges",
  ],
  [
    "Joshua Tree National Park, California, USA",
    "Joshua Tree",
    33.87,
    -115.9,
    "joshuatree",
  ],
  ["Arches National Park, Utah, USA", "Arches", 38.68, -109.57, "arches"],
  [
    "Canyonlands National Park, Utah, USA",
    "Canyonlands",
    38.33,
    -109.88,
    "canyonlands",
  ],
  [
    "Capitol Reef National Park, Utah, USA",
    "Capitol Reef",
    38.36,
    -111.26,
    "capitolreef",
  ],
  [
    "Bryce Canyon National Park, Utah, USA",
    "Bryce Canyon",
    37.63,
    -112.17,
    "brycecanyon",
  ],
  [
    "Grand Canyon National Park, Arizona, USA",
    "Grand Canyon",
    36.06,
    -112.12,
    "grandcanyon",
  ],
  [
    "Great Sand Dunes National Park, Colorado, USA",
    "Great Sand Dunes",
    37.73,
    -105.51,
    "greatsanddunes",
  ],
  ["Big Bend National Park, Texas, USA", "Big Bend", 29.22, -103.24, "bigbend"],
  [
    "Black Canyon of the Gunnison NP, Colorado, USA",
    "Black Canyon",
    38.58,
    -107.74,
    "blackcanyon",
  ],
  [
    "Big Cypress National Preserve, Florida, USA",
    "Big Cypress",
    25.86,
    -81.03,
    "bigcypress",
  ],
  ["Glacier National Park, Montana, USA", "Glacier", 48.7, -113.72, "glacier"],
  [
    "Petrified Forest National Park, Arizona, USA",
    "Petrified Forest",
    35.98,
    -109.77,
    "petrifiedforest",
  ],
  [
    "Craters of the Moon NM, Idaho, USA",
    "Craters of the Moon",
    43.43,
    -113.48,
    "cratersofthemoon",
  ],
  [
    "Chaco Culture National Historical Park, New Mexico, USA",
    "Chaco Culture",
    36.06,
    -107.97,
    "chacoculture",
  ],
  [
    "Cedar Breaks National Monument, Utah, USA",
    "Cedar Breaks",
    37.64,
    -112.85,
    "cedarbreaks",
  ],
  [
    "Capulin Volcano National Monument, New Mexico, USA",
    "Capulin Volcano",
    36.78,
    -103.97,
    "capulinvolcano",
  ],
  [
    "Florissant Fossil Beds NM, Colorado, USA",
    "Florissant Fossil Beds",
    38.91,
    -105.17,
    "florissant",
  ],
  [
    "Fort Union National Monument, New Mexico, USA",
    "Fort Union",
    35.91,
    -105.15,
    "fortunion",
  ],
  [
    "Hovenweep National Monument, Utah/Colorado, USA",
    "Hovenweep",
    37.28,
    -109.12,
    "hovenweep",
  ],
  [
    "Salinas Pueblo Missions NM, New Mexico, USA",
    "Salinas Pueblo Missions",
    34.5,
    -106.75,
    "salinaspueblo",
  ],
  [
    "Valles Caldera National Preserve, New Mexico, USA",
    "Valles Caldera",
    35.82,
    -106.47,
    "vallescaldera",
  ],
  [
    "Anza‑Borrego Desert State Park, California, USA",
    "Anza‑Borrego",
    33.26,
    -116.4,
    "anzaborrego",
  ],
  [
    "Antelope Island State Park, Utah, USA",
    "Antelope Island",
    40.96,
    -112.21,
    "antelopeisland",
  ],
  [
    "Headlands International Dark Sky Park, Michigan, USA",
    "Headlands",
    45.78,
    -84.78,
    "headlands",
  ],
  [
    "Oracle State Park (Oracle ID Sky Park), Arizona, USA",
    "Oracle",
    32.61,
    -110.73,
    "oracle",
  ],
  [
    "Canyonlands International Dark Sky Park (overlap)",
    "Canyonlands (IDSP)",
    38.33,
    -109.88,
    "canyonlandsidsp",
  ],
  [
    "Copper Breaks State Park, Texas, USA",
    "Copper Breaks",
    34.11,
    -99.75,
    "copperbreaks",
  ],
  [
    "Clayton Lake State Park, New Mexico, USA",
    "Clayton Lake",
    36.58,
    -103.31,
    "claytonlake",
  ],
  [
    "Cherry Springs State Park, Pennsylvania, USA",
    "Cherry Springs",
    41.65,
    -77.82,
    "cherrysprings",
  ],
  [
    "Blue Ridge Observatory Star Park, North Carolina, USA",
    "Blue Ridge Observatory",
    35.93,
    -82.02,
    "blueridgeobservatory",
  ],
  [
    "Aotea/Great Barrier Island International Dark Sky Sanctuary, New Zealand",
    "Great Barrier Island",
    -36.17,
    175.38,
    "greatbarrierisland",
  ],
  [
    "Kerry International Dark Sky Reserve, Ireland",
    "Kerry",
    51.8969,
    -10.0894,
    "kerry",
  ],
  ["Mayo International Dark Sky Park, Ireland", "Mayo", 54.07, -9.69, "mayo"],
  [
    "Ramon Crater International Dark Sky Park, Israel",
    "Ramon Crater",
    30.58,
    34.82,
    "ramoncrater",
  ],
  [
    "Iriomote‑Ishigaki National Park International Dark Sky Park, Japan",
    "Iriomote‑Ishigaki",
    24.32,
    123.88,
    "iriomoteishigaki",
  ],
  [
    "NamibRand International Dark Sky Reserve, Namibia",
    "NamibRand",
    -25.12,
    15.99,
    "namibrand",
  ],
  [
    "Bükk National Park (Zselic), Hungary",
    "Bükk (Zselic)",
    48.05,
    20.53,
    "bukk",
  ],
  ["Hortobágy National Park, Hungary", "Hortobágy", 47.55, 21.12, "hortobagy"],
  [
    "Lauwersmeer National Park, Netherlands",
    "Lauwersmeer",
    53.35,
    6.19,
    "lauwersmeer",
  ],
  ["South Downs National Park, UK", "South Downs", 51.06, -0.69, "southdowns"],
  ["Snowdonia National Park, UK", "Snowdonia", 50.08, -4.08, "snowdonia"],
  [
    "Tomintoul and Glenlivet Dark Sky Park, UK",
    "Tomintoul & Glenlivet",
    57.24,
    -3.35,
    "tomintoulglenlivet",
  ],
  [
    "Galloway Forest Park, Scotland, UK",
    "Galloway Forest",
    55.03,
    -4.45,
    "gallowayforest",
  ],
  [
    "Great Basin National Park, NV, USA",
    "Great Basin",
    38.98,
    -114.3,
    "greatbasin",
  ],
  [
    "Flagstaff area NM & monuments, AZ, USA",
    "Flagstaff Monuments",
    35.2,
    -111.65,
    "flagstaffmonuments",
  ],
  [
    "Mammoth Cave National Park, Kentucky, USA",
    "Mammoth Cave",
    37.19,
    -86.13,
    "mammothcave",
  ],
  [
    "Buffalo National River, Arkansas, USA",
    "Buffalo River",
    35.91,
    -92.1,
    "buffaloriver",
  ],
  [
    "Cape Lookout National Seashore, North Carolina, USA",
    "Cape Lookout",
    34.61,
    -76.58,
    "capelookout",
  ],
  ["Curecanti NRA, Colorado, USA", "Curecanti", 38.52, -107.34, "curecanti"],
  [
    "Dinosaur National Monument, Colorado/Utah, USA",
    "Dinosaur NM",
    40.42,
    -108.99,
    "dinosaur",
  ],
  ["Mesa Verde NP, Colorado, USA", "Mesa Verde", 37.23, -108.46, "mesaverde"],
  [
    "Goosenecks State Park, Utah, USA",
    "Goosenecks",
    37.09,
    -110.76,
    "goosenecks",
  ],
  [
    "Pictured Rocks National Lakeshore, Michigan, USA",
    "Pictured Rocks",
    46.53,
    -86.65,
    "picturedrocks",
  ],
  [
    "Port Crescent State Park, Michigan, USA",
    "Port Crescent",
    44.13,
    -83.44,
    "portcrescent",
  ],
  ["Salar de Uyuni, Bolivia", "Salar de Uyuni", -20.13, -67.49],
  [
    "Tenerife (Teide area), Canary Islands, Spain",
    "Tenerife",
    28.27,
    -16.64,
    "tenerife",
  ],
  [
    "Mont‑Mégantic National Park, Québec, Canada",
    "Mont‑Mégantic",
    45.53,
    -71.32,
    "montmegantic",
  ],
  [
    "Aoraki Mackenzie International Dark Sky Reserve, NZ",
    "Aoraki Mackenzie",
    -44.0,
    170.3,
    "aorakimackenzie",
  ],
  ["Kaikōura Dark Sky Sanctuary, NZ", "Kaikōura", -42.4, 173.68, "kaikoura"],
  [
    "Pic du Midi, French Pyrenees, France",
    "Pic du Midi",
    42.94,
    0.14,
    "picdumidi",
  ],
  [
    "Millevaches Dark Sky Reserve, Limousin, France",
    "Millevaches",
    45.8,
    1.68,
    "millevaches",
  ],
  [
    "North York Moors National Park, England",
    "North York Moors",
    54.35,
    -0.87,
    "northyorkmoors",
  ],
  ["Rhön Dark Sky Reserve, Germany", "Rhön", 50.45, 10.0, "rhon"],
  ["Exmoor National Park, England", "Exmoor", 51.18, -3.68, "exmoor"],
];

export const SPECIAL_LOCATIONS = [...DARK_SITES, ...LARGE_CITIES];

export const SPECIAL_AREAS = {
  "los-angeles-area": "Los Angeles",
  "san-diego-area": "San Diego",
  "sf-bay-area": "San Francisco Bay Area",
  "shanghai-suzhou": "Shanghai/Suzhou",
  "pearl-river-delta": "Pearl River Delta",
  // Only keep area keys used by multiple locations
};

// export const SPECIAL_LOCATION_DESCRIPTIONS: Record<string, string> = {
//   arches:
//     '<h2>Arches National Park, Utah</h2><p>Arches National Park offers brilliantly dark skies (Bortle class ~2-3) and was certified as an International Dark Sky Park in 2019. This means you can see thousands of stars and the Milky Way arching over the park’s famous red rock arches. Popular spots for Milky Way photography include <strong>Panorama Point</strong>, the <strong>Balanced Rock picnic area</strong>, <strong>The Windows</strong> section, and <strong>Garden of Eden viewpoint</strong> – all areas with wide-open views of the sky. Even iconic <strong>Delicate Arch</strong> can be spectacular under starlight for those willing to hike late.</p><p>📷 <a href="https://www.nps.gov/arch">Official Park Website</a> – find astronomy programs and current conditions. <br/>🌙 <strong>Camping:</strong> The park’s only campground is <em>Devils Garden</em>, which requires advance reservations in peak season. Camping there lets you stargaze right from your site! <br/>🏨 <strong>Lodging:</strong> No lodging inside the park; the nearest hotels are in Moab (~5 miles). <br/>🚗 <strong>Accessibility:</strong> Arches is open 24/7. Note that from April–October a timed entry ticket is required to enter during mid-day, but entry after 4 pm (for evening stargazing) is allowed without a reservation. <br/>🎫 <strong>Permits:</strong> No special permit needed for night photography – just the park entry fee. Be prepared with red flashlight, and enjoy the amazing darkness!</p>',

//   bigbend:
//     '<h2>Big Bend National Park, Texas</h2><p>Big Bend is renowned for some of the darkest skies in the continental U.S. – with a Bortle scale rating around 1-2, this park offers an unparalleled view of the Milky Way. In 2012 it was designated a Gold Tier International Dark Sky Park, one of the first in the country. The night sky over Big Bend’s desert and mountain landscapes is so pristine that thousands of stars, satellites, and the band of the Milky Way are visible on a moonless night. Excellent spots for Milky Way photography include <strong>Santa Elena Canyon</strong> (with the river and canyon walls silhouetted), the <strong>Chisos Basin</strong> (where the Milky Way rises over mountain peaks), and <strong>Rio Grande Village</strong> area’s open skies. Even roadside pullouts become stargazing points here due to minimal light pollution.</p><p>📷 <a href="https://www.nps.gov/bibe">Official Big Bend NPS Site</a> – for astronomy program schedules and tips. <br/>🌙 <strong>Camping:</strong> Big Bend has multiple campgrounds (e.g. Cottonwood, Chisos Basin) and backcountry roadside camps; reservations are recommended in peak season. Campers often enjoy astounding views of the night sky from their tents. <br/>🏨 <strong>Lodging:</strong> The park’s Chisos Mountains Lodge offers rooms if you prefer not to camp (book well in advance). Additional lodging can be found in nearby communities like Study Butte. <br/>🚗 <strong>Accessibility:</strong> The park is remote; all areas are open 24/7 for those willing to drive at night. Summer nights are warm; winter brings chilly clear skies. <br/>🎫 <strong>Permits:</strong> No permit required for stargazing. Just pay the park entrance fee. If doing backcountry camping for night photography, obtain the required backcountry permit.</p>',

//   bigcypress:
//     '<h2>Big Cypress National Preserve, Florida</h2><p>Big Cypress became the first Dark Sky Place certified in Florida – a surprise to many given its proximity to Miami. But this expansive swamp preserve boasts impressively dark skies (Bortle ~3) in its interior. On clear winter nights, the Milky Way can be visible above the silhouettes of cypress trees. The preserve’s open prairies and marshes, such as around <strong>Midway Campground</strong> or <strong>Pinecrest</strong> area, offer great horizons for stargazing. Big Cypress hosts annual winter <em>astronomy festivals</em> and ranger-led night sky programs, taking advantage of cooler, mosquito-free nights when humidity is lower and skies are clearer.</p><p>📷 <a href="https://www.nps.gov/bicy">Official Big Cypress NPS Site</a> – check for night sky program listings. <br/>🌙 <strong>Camping:</strong> Several campgrounds (Midway, Monument Lake, etc.) are available; winter season is most popular for campers and also best for stargazing (summer is very humid with frequent clouds). <br/>🏨 <strong>Lodging:</strong> No lodging inside the preserve, but Everglades City or Homestead offer accommodations within driving distance. <br/>🚗 <strong>Accessibility:</strong> The preserve is open 24 hours. Roads like Loop Road offer dark pullouts. Be mindful of wildlife (panthers, gators) when driving at night! <br/>🎫 <strong>Permits:</strong> No permit needed for entry or stargazing. Standard camping fees/reservations apply for campgrounds. Bring bug spray for warmer months – the stars are stunning, but so can be the mosquitoes.</p>',

//   blackcanyon:
//     '<h2>Black Canyon of the Gunnison National Park, Colorado</h2><p>Black Canyon of the Gunnison’s night skies are as dramatic as its deep canyon walls. This park is an International Dark Sky Park, with generally Bortle class 2 conditions (and about Bortle 3 near the rims due to minor distant glows). On a clear night, the Milky Way spans brightly above the canyon, and you can even see the stars reflected faintly in the Gunnison River far below. Great spots to set up for Milky Way shots include the <strong>South Rim viewpoints</strong> like Chasm View or Dragon Point – offering sweeping sky vistas over the canyon – and the less-visited <strong>North Rim</strong> where there is virtually no light at all. The park hosts occasional <em>astronomy nights</em> in summer with telescopes.</p><p>📷 <a href="https://www.nps.gov/blca">Official Black Canyon NPS Site</a> – see “Astronomy & Stargazing” section for events. <br/>🌙 <strong>Camping:</strong> South Rim and North Rim Campgrounds are available (North Rim is more primitive but excellent for dark skies). Sites are first-come first-served or reservable in summer; staying overnight lets you immerse in the darkness. <br/>🏨 <strong>Lodging:</strong> No lodging in-park. Nearest hotels are in Montrose (~20 minutes from South Rim). Montrose’s lights do slightly affect the far western horizon, but not enough to spoil the zenithal views. <br/>🚗 <strong>Accessibility:</strong> The South Rim Drive is paved and open 24/7 (though portions close in winter). North Rim is more remote (gravel road, closed in winter). Bundle up – at 8,000 ft elevation, nights can be cold even in summer. <br/>🎫 <strong>Permits:</strong> No special permit needed for stargazing. Standard entry fee or parks pass required. If visiting at night for photography, drive carefully and use parking areas – the canyon drop-offs are literally pitch black!</p>',

//   brycecanyon:
//     '<h2>Bryce Canyon National Park, Utah</h2><p>Bryce Canyon is famous for its stunning red rock hoodoos – and at night, those hoodoos sit under an incredibly starry sky. With a Bortle class ~2 darkness (Bryce is an IDA-designated Dark Sky Park), the Milky Way glows brightly over the Bryce Amphitheater. The park holds well-attended <strong>astronomy ranger programs</strong> and an annual summer <em>astronomy festival</em>. Best Milky Way photography spots are <strong>Inspiration Point</strong>, <strong>Sunrise/Sunset Point</strong>, or <strong>Bryce Point</strong> – essentially any overlook that lets you view the expansive sky above the hoodoo-filled canyon. You’ll often see photographers’ red headlamps dotted along the rim on clear summer nights!</p><p>📷 <a href="https://www.nps.gov/brca">Official Bryce Canyon NPS Site</a> – check “Night Skies” and event calendar. <br/>🌙 <strong>Camping:</strong> Two campgrounds (North and Sunset) are near the amphitheater; North Campground in particular is popular for astrophotographers (and first-come, first-served most of the year). Camping allows you to simply walk to the rim at night. <br/>🏨 <strong>Lodging:</strong> The historic Bryce Canyon Lodge (inside the park) offers rooms and cabins; additional lodging is just outside the park in Bryce Canyon City. The lodge area has minimal lighting to preserve night vision. <br/>🚗 <strong>Accessibility:</strong> The park is open 24/7. In winter, some rim areas are accessible for stargazing, though be prepared for snow and frigid temperatures at 8,000+ feet. Summer nights are comfortable and busy with stargazers. <br/>🎫 <strong>Permits:</strong> No permits needed for night photography. Just pay the park entrance fee. During astronomy festival nights, some viewpoints may have volunteer attendants to help visitors enjoy the skies (telescopes provided!).</p>',

//   buffalo:
//     '<h2>Buffalo National River, Arkansas</h2><p>Buffalo National River is not only a scenic Ozark waterway by day – it’s also Arkansas’s first International Dark Sky Park (designated in 2019). This means exceptionally dark skies for the region, with the Milky Way clearly visible on moonless nights. The park’s rural setting (no big cities nearby) yields a Bortle class ~2-3 sky. Great stargazing spots include <strong>Tyler Bend</strong> and <strong>Buffalo Point</strong> – both have campgrounds and open skies where ranger-led night sky programs are often held. At Tyler Bend, you can enjoy the Milky Way rising above the river bluffs, creating gorgeous reflections in the water. The quiet of the Ozark night combined with thousands of stars makes for an unforgettable experience.</p><p>📷 <a href="https://www.nps.gov/buff">Official Buffalo National River Site</a> – see “Night Sky Viewing” for program info. <br/>🌙 <strong>Camping:</strong> Several campgrounds (Tyler Bend, Buffalo Point, etc.) are available – perfect for staying overnight to stargaze. Summer nights are warm and popular for camping; fall brings crisp clear skies. <br/>🏨 <strong>Lodging:</strong> No hotels inside this national river park. Nearby towns (Yellville, Marshall, etc.) have some cabins/motels. Buffalo Point has cabins managed by a concessionaire if you prefer not to camp. <br/>🚗 <strong>Accessibility:</strong> The park has many access points; roads are paved to main areas. It’s open 24/7. Humidity can be a factor in summer – the best viewing is on particularly clear, dry nights. <br/>🎫 <strong>Permits:</strong> No entry fee and no permit needed for stargazing. Just respect quiet hours in campgrounds. If paddling the river, note that overnight trips require registration – and stargazing from a gravel bar on the river can be magical!</p>',

//   canyonlands:
//     '<h2>Canyonlands National Park, Utah</h2><p>Canyonlands preserves an immense wilderness of canyons – and at night, that wilderness has truly pristine skies. In fact, Canyonlands is often cited as Bortle Class 1 in its remotest areas. It’s an International Dark Sky Park where the Milky Way can cast a faint shadow on moonless nights! The park has multiple districts; popular stargazing locales include <strong>Island in the Sky</strong> (with easily accessible viewpoints like Mesa Arch for that classic Milky Way-over-arch photo) and <strong>The Needles</strong> (where you can frame rock spires against starry skies). At Mesa Arch, photographers often gather before dawn to capture the Milky Way rising through the arch. Overall, any pullout far from the modest lights of Moab will reward you with incredible star fields.</p><p>📷 <a href="https://www.nps.gov/cany">Official Canyonlands NPS Site</a> – astronomy info available under “Nature & Science”. <br/>🌙 <strong>Camping:</strong> Island in the Sky has Willow Flat campground (first-come) and Needles district has campground (reservations spring-fall). These are primitive but situate you in dark areas; also consider backcountry camping (permit required) for the ultimate solitude under the stars. <br/>🏨 <strong>Lodging:</strong> No lodging in-park. Many visitors stay in Moab and drive ~30-40 minutes to Island in the Sky at night. Moab’s glow is low on the horizon to the north, so it doesn’t spoil the zenith. For Needles, lodging in Monticello or at the park’s gateway at Canyonlands Lodge (just outside Needles) is an option. <br/>🚗 <strong>Accessibility:</strong> Open 24 hours. The roads have no lights (bring a star map or GPS for navigation). Summers are comfortable at night; winters are cold but offer incredibly clear skies. <br/>🎫 <strong>Permits:</strong> No permit needed for entering the park at night beyond the normal entry fee. If doing overnight backcountry hikes or 4x4 trips to, say, the Maze district for stargazing, you’ll need a backcountry permit. Prepare for complete darkness – carry red-light flashlights and plenty of water.</p>',

//   capelookout:
//     '<h2>Cape Lookout National Seashore, North Carolina</h2><p>Cape Lookout National Seashore encompasses remote barrier islands with minimal development – resulting in some of the darkest skies on the U.S. East Coast. Far from city lights, the seashore offers approximately Bortle 2-3 skies (exceptional for the East). The iconic <strong>Cape Lookout Lighthouse</strong> creates a picturesque foreground against the Milky Way. In fact, summer star viewing from the beach often reveals the Milky Way stretching over the Atlantic. Photographers love capturing the lighthouse beacon with a backdrop of stars. The best locations are on <strong>South Core Banks</strong> near the lighthouse or on <strong>Shackleford Banks</strong> where wild horses graze under starry skies. The park periodically offers “Night Sky” ranger programs here as well.</p><p>📷 <a href="https://www.nps.gov/calo">Official Cape Lookout NPS Site</a> – check for any stargazing event info. <br/>🌙 <strong>Camping:</strong> Primitive camping is allowed on these islands (no developed campgrounds – you can beach camp). Camping out on a barrier island virtually guarantees an amazing view of the night sky, with the gentle sound of waves as background. <br/>🏨 <strong>Lodging:</strong> No hotels on the islands; nearest lodging is on the mainland (Beaufort or Harkers Island). There are a few rustic cabins for rent on Portsmouth Island (North Core Banks) for those who want to overnight more comfortably – but plan ahead and bring all supplies. <br/>🚗 <strong>Accessibility:</strong> Reaching these islands requires a ferry or private boat. The effort is worth it – once day-trippers leave, the islands are dark and isolated. The lighthouse area on South Core Banks is a popular stargazing spot; note the lighthouse itself is not currently climbable at night. Weather can change quickly by the sea, so check forecasts. <br/>🎫 <strong>Permits:</strong> No entry fee to the seashore. If camping, no permit is required for beach camping (just follow Leave No Trace). If driving 4x4 on the islands, you’ll need a ORV permit. Be sure to have a good red light – it’s pitch dark and easy to get disoriented on a dark beach at night!</p>',

//   capitolreef:
//     '<h2>Capitol Reef National Park, Utah</h2><p>Capitol Reef is an underrated gem for stargazing. It was designated an International Dark Sky Park in 2015, and its skies are frequently measured as Bortle class 1-2 – meaning extremely dark. The park’s vast desert rock formations and domes create dramatic silhouettes against the Milky Way. One of the best Milky Way shots can be had at <strong>Hickman Bridge</strong> (a natural arch) – the Milky Way perfectly frames itself through the arch during certain times. Also, <strong>Panorama Point</strong> near sunset is great for transitioning into a night of stargazing (hence the name). The Fruita Historic District (orchards area) has some of the only light in the park (kept minimal), so many photographers head a short distance away on Scenic Drive pullouts or to <strong>Goosenecks Overlook</strong> to set up under truly dark skies.</p><p>📷 <a href="https://www.nps.gov/care">Official Capitol Reef NPS Site</a> – see information on astronomy festivals or night sky monitoring. <br/>🌙 <strong>Camping:</strong> The Fruita Campground (reservable) is nestled in a canyon – lovely but some cliff walls might limit sky in immediate area. It still offers good views of bright stars overhead. Primitive campgrounds at Cathedral Valley or Cedar Mesa (farther north and south in the park) have virtually zero light pollution and wide-open skies – perfect if you have a high-clearance vehicle to reach them. <br/>🏨 <strong>Lodging:</strong> No in-park lodges. The tiny town of Torrey (minutes from the park entrance) has motels and guest cabins. Torrey itself has worked on dark sky friendly lighting, so it won’t spoil your night. <br/>🚗 <strong>Accessibility:</strong> Open 24/7. Capitol Reef is in a rural area; roads are paved in main sections. Watch for deer at night. Fall and spring bring crisp, clear skies; summer nights are mild and pleasant for stargazing. <br/>🎫 <strong>Permits:</strong> No special permit needed for stargazing. Regular entry fee applies for the Scenic Drive beyond Fruita. If heading into remote sections at night (like Cathedral Valley), make sure you’re prepared – those areas are extremely isolated and dark, which is both their charm and a risk if you’re not ready.</p>',

//   capulin:
//     '<h2>Capulin Volcano National Monument, New Mexico</h2><p>Capulin Volcano is an extinct cinder cone volcano rising from the plains of northeast New Mexico – offering an ideal 360° panorama of the night sky. It’s an International Dark Sky Park known for excellent star visibility. On a clear night, the sky at Capulin is a Bortle class ~2, very dark for the region. The park often hosts summer <strong>star parties</strong> at the volcano, where visitors can drive to the rim parking lot (~7,800 ft elevation) for telescope viewing. The Milky Way looks fantastic from Capulin’s summit, unobstructed in all directions. Photographers can capture the Milky Way arching over the volcano itself or over the surrounding wide-open landscape. The volcano’s rim trail at night (with caution) gives you a feeling of being “on top of the world” under the stars.</p><p>📷 <a href="https://www.nps.gov/cavo">Official Capulin Volcano NPS Site</a> – check “Events” for scheduled astronomy nights. <br/>🌙 <strong>Camping:</strong> No camping at Capulin Volcano (it’s a day-use park). The monument closes in the evening except during official night programs. However, nearby state parks or campgrounds (e.g. Clayton Lake State Park) offer camping and similarly dark skies. If you attend a star party at Capulin, you’ll likely be allowed to stay on site for the event. <br/>🏨 <strong>Lodging:</strong> The small towns of Raton or Clayton, NM are nearest for accommodations (both about 30-40 minutes away). They have a few basic motels. Be prepared for a drive after your stargazing session if you’re not camping nearby. <br/>🚗 <strong>Accessibility:</strong> Normally, the gate to the volcano road is closed at 4:30 PM. During special stargazing events, they open it at night. The road spirals to the top – drive carefully. At the top, there are accessible viewing areas by the parking lot. Nights can be surprisingly cool even in summer at that elevation, so bring layers. <br/>🎫 <strong>Permits:</strong> No general night access unless an event is happening. If on your own, you’d have to stargaze outside the monument boundary (there are pullouts on the highway). During official events, your entry fee covers it. Always check ahead – sometimes they require free event RSVPs since space on the rim is limited.</p>',

//   cedarbreaks:
//     '<h2>Cedar Breaks National Monument, Utah</h2><p>Cedar Breaks sits at over 10,000 feet elevation and overlooks a vast natural amphitheater of eroded rock spires. Its high elevation and remote location make for **excellent** night skies – typically Bortle class 2. It’s certified as an International Dark Sky Park, and the Milky Way gleams brightly above the amphitheater. The park offers summer <strong>star parties</strong> with telescopes at Point Supreme Overlook. For photographers, <strong>Point Supreme</strong> or nearby overlooks like Sunset View are perfect to capture the glow of the Milky Way above the orange hoodoo formations. You might even get bristlecone pine silhouettes in your shots. Being so high, on clear nights you feel incredibly close to the stars (and indeed the air is thin and clear).</p><p>📷 <a href="https://www.nps.gov/cebr">Official Cedar Breaks NPS Site</a> – check “Night Sky” for program schedules. <br/>🌙 <strong>Camping:</strong> Cedar Breaks has a small campground (Point Supreme Campground) open in summer only. It’s an ideal spot to stay, as you can stargaze right from your campsite, and it’s a short walk to the main overlook. Temperatures drop a lot at night – pack warm gear. <br/>🏨 <strong>Lodging:</strong> No lodging inside the monument. The nearest town with accommodations is Brian Head (a ski town just 3 miles away) or Cedar City (~30 miles). Brian Head’s lights are minimal. Some visitors also stay at Navajo Lake cabins or camps and drive up. <br/>🚗 <strong>Accessibility:</strong> The monument is generally open late spring through fall (the road closes in winter due to snow). In summer, it’s accessible 24/7. The road to Point Supreme is paved. Be cautious of wildlife (deer, maybe porcupines) on the road at night. And note: at 10k feet, short walks can feel tiring – give yourself time to adjust when walking to viewpoints in the dark. <br/>🎫 <strong>Permits:</strong> No special permit needed, just pay the entry fee (or show your parks pass) during staffed hours. If arriving after hours for stargazing, you can self-pay. The park staff often set up telescopes on Friday/Saturday summer nights – free with entry. Enjoy one of Utah’s finest starry skies!</p>',

//   chaco:
//     '<h2>Chaco Culture National Historical Park, New Mexico</h2><p>Chaco Culture NHP is not only a UNESCO World Heritage Site rich with ancient pueblos – it’s also famed for its incredibly dark night skies. As an International Dark Sky Park, Chaco offers Bortle 1-2 skies, some of the darkest in the U.S. The park even has an observatory and regular night sky talks. Imagine gazing at the Milky Way above massive 1,000-year-old great houses – it’s an awe-inspiring sight. One of the best spots is around <strong>Casa Rinconada</strong> (a large kiva) where many iconic star photos have been taken. Also, the plaza of <strong>Pueblo Bonito</strong> during special night events is fantastic. The summer Milky Way aligns over Fajada Butte, a sacred formation, making for stunning compositions.</p><p>📷 <a href="https://www.nps.gov/chcu">Official Chaco NPS Site</a> – see “Night Sky Program” details. <br/>🌙 <strong>Camping:</strong> Gallo Campground is the only campground at Chaco. Staying there is highly recommended if you want to stargaze – because the park is extremely remote, and the campground allows you to be on-site after dark. It often fills on new moon nights. No RV hookups (dry camping). <br/>🏨 <strong>Lodging:</strong> No lodging in or immediately near the park. The nearest motels are over an hour+ away (in towns like Farmington or Nageezi). Camping is really the best way to experience Chaco at night. <br/>🚗 <strong>Accessibility:</strong> The park’s access road includes about 20 miles of rough dirt – keep that in mind if leaving after an evening program. Also, note the loop roads inside the canyon close at sunset to protect ruins; visitors must stay in campground or by the buildings area after dark unless on a ranger tour. Chaco’s elevation is ~6,200 ft and very dry, so bring water; nights can be chilly even in summer. <br/>🎫 <strong>Permits:</strong> No permit needed for stargazing in general – just the park entry fee. If you are not camping, technically the park gates close at a certain time (often 9pm in summer). Rangers typically allow night program attendees to exit after hours. If you want to do independent night photography among ruins, you’ll need special permission (and never climb on walls). The park’s incredible darkness is a treasure – please help keep it that way (no unnecessary lights)!</p>',

//   cherrysprings:
//     '<h2>Cherry Springs State Park, Pennsylvania</h2><p>Cherry Springs State Park is legendary among East Coast astronomers. It’s a small hilltop park dedicated to dark skies, and it’s one of the few places in the Eastern U.S. with a true dark sky (Bortle class 2). On a clear, moonless night at Cherry Springs, the Milky Way is brilliant – so much so that it can cast subtle shadows, and 10,000+ stars might be visible. The park features an Astronomy Observation Field with concrete pads and strictly enforced no-white-light rules. Best locations? Pretty much the <strong>"Astronomy Field"</strong> itself – an open 360° meadow specifically for stargazing and imaging. There’s also a public nighttime viewing area for casual visitors (no fee) with slightly more limited space. Astrophotographers flock here to capture the Milky Way, and annual star parties (like the Black Forest Star Party) draw enthusiasts worldwide.</p><p>📷 <a href="https://www.dcnr.pa.gov/StateParks/FindAPark/CherrySpringsStatePark">Official Cherry Springs Park Page</a> – for overnight astronomy field rules and events. <br/>🌙 <strong>Camping:</strong> The park has a small campground in the woods (suitable for general camping, though some sites still have decent sky views). For serious stargazing, you can purchase an Overnight Astronomy Observation Field permit, which allows you to set up on the main field with your equipment (red lights only!). This field has limited first-come spaces and basic amenities (outhouse, etc.). <br/>🏨 <strong>Lodging:</strong> No lodging on-site. The nearest town is Coudersport (~30 min drive) with a few motels/B&Bs. Many visitors also stay at nearby state park campgrounds (Lyman Run State Park is close). But nothing beats being right at Cherry Springs for the night. <br/>🚗 <strong>Accessibility:</strong> Cherry Springs is open year-round, 24/7. However, winters are extremely cold and often snow-covered (not ideal for stargazing). The prime season is April through October. The park sits at ~2,300 ft in a sparsely populated region, so weather can change; always check forecasts. There is very minimal cell service. During new moon weekends, expect a lot of fellow stargazers – arrive early to find a spot and remember to kill your headlights upon entry! <br/>🎫 <strong>Permits:</strong> Casual stargazing in the public area is free. If you want to use the Astronomy Field overnight with a telescope or camera, you need to register and pay a modest fee (online or on-site) for an astronomy field permit (to ensure everyone follows dark-sky etiquette). Rangers patrol to ensure light rules are followed. It’s a well-run system making Cherry Springs a true haven for dark-sky lovers.</p>',

//   chiricahua:
//     '<h2>Chiricahua National Monument, Arizona</h2><p>Chiricahua is known as a "Wonderland of Rocks" by day – and by night, those towering rock pinnacles stand under brilliantly dark skies. This monument in southeastern Arizona was designated an International Dark Sky Park. Thanks to its remote location, visitors can enjoy Bortle class 2 skies here. The Milky Way gleams above formations like the <strong>Balanced Rock</strong> and <strong>Massai Point</strong>. In fact, <strong>Massai Point Overlook</strong> (the end of the scenic drive, elevation ~6,870 ft) is the prime stargazing spot – it has panoramic views and often hosts night sky programs. Photographers love capturing star trails around the scenic stone pinnacles or the Milky Way aligned in Echo Canyon. On a clear summer night, it’s hard to beat the combination of eerie rock spires and a sky full of stars here.</p><p>📷 <a href="https://www.nps.gov/chir">Official Chiricahua NPS Site</a> – see if any Night Sky Ranger Programs are listed. <br/>🌙 <strong>Camping:</strong> The Bonita Canyon Campground (the monument’s only campground) is situated in a forested canyon – beautiful, though the canyon walls may block some of the sky directly at the campground. But it’s a short drive or even night hike to more open viewpoints. Reservations recommended in peak seasons. <br/>🏨 <strong>Lodging:</strong> No lodging in-park. Nearest accommodations are in Willcox, AZ (~35 miles) or Portal, AZ on the east side. Some people stay further out in Benson or even Tucson and make the long drive, but to fully experience the dark night you’d want to be closer. <br/>🚗 <strong>Accessibility:</strong> The park is somewhat remote. It’s open 24/7, but the entrance road is narrow and winding – drive carefully after dark (watch for deer and coati!). Massai Point has a parking area and short paths. At nearly 7,000 feet elevation, nights can be cool even in summer, pleasant in spring/fall. Monsoon season (July-Aug) might bring clouds, so plan around that for starry skies. <br/>🎫 <strong>Permits:</strong> No permit needed for nighttime entry or photography. Standard entry fee (or pass) if arriving during the day. If you plan to do any off-trail night hiking or light painting among rocks, ensure you’re following park guidelines and safety – the rocky terrain can be tricky in the dark. Chiricahua’s staff are proud of their dark skies – they even use special outdoor lighting – so enjoy and help keep it dark!</p>',

//   cosmiccampground:
//     '<h2>Cosmic Campground International Dark Sky Sanctuary, New Mexico</h2><p>The Cosmic Campground is a unique stargazing site in western New Mexico’s Gila National Forest – it was the first International Dark Sky Sanctuary in the US (designated in 2016). Being a Sanctuary, it’s incredibly remote and dark – Bortle 1 skies on a good night. Here, you’re roughly 40 miles from the nearest small town, under a truly pristine sky. The campground is essentially an open field at 5,400 ft with a 360° horizon and absolutely no artificial light visible. The Milky Way core is so bright that summer visitors often gasp upon first sight! There are four concrete telescope pads for setup, and an information kiosk on-site. This is a favorite spot for serious astrophotographers and amateur astronomers; star parties are sometimes organized by local clubs. Shooting the Milky Way here with just saguaros and desert silhouettes in the foreground can yield spectacular results.</p><p>📷 <a href="https://www.fs.usda.gov/recarea/gila/recarea/?recid=74014">USFS Cosmic Campground Info</a> – details on facilities and getting there. <br/>🌙 <strong>Camping:</strong> The campground is primitive – only a pit toilet is available, no water or electricity. Camping is free and first-come, first-served. It has a few defined sites but most people just set up near the pads. Because it’s designed for astronomy, all overnight visitors are expected to limit light use (red lights only). If you plan to camp, come self-sufficient (bring enough water, food, etc.). Nights can be surprisingly chilly in the high desert, even after hot days. <br/>🏨 <strong>Lodging:</strong> No lodging at the site (it’s far from civilization). The closest lodging might be in Reserve, NM (~20 miles north, which is a tiny town) or Silver City (~65 miles). Many people simply camp or come in RVs. <br/>🚗 <strong>Accessibility:</strong> The site is accessible via a gravel road (Forest Road 353) about 8 miles off US Hwy 180. Regular cars can typically make it, but go slow. It’s open year-round, 24/7. Weather is generally clear, but summer monsoon storms or winter snows can occur. This is a remote area with wildlife like elk – be cautious driving at night. Cell service is basically non-existent. But the trade-off: unparalleled dark skies. <br/>🎫 <strong>Permits:</strong> No entry fee or permit required. Just drive in and set up. (If you’re bringing a large group for an event, it’s polite to notify the Forest Service.) The main rule is to respect the dark – absolutely no bright lights. If you arrive after dark, park with headlights off (use parking lights or a very dim red light) to avoid disturbing others. In short, Cosmic Campground is a haven for serious stargazers – an experience of the cosmos you won’t forget!</p>',

//   cratersmoon:
//     '<h2>Craters of the Moon National Monument & Preserve, Idaho</h2><p>Craters of the Moon offers an almost otherworldly experience – both with its ancient lava flow landscape and its magnificent night skies. As an International Dark Sky Park, Craters has very little light pollution (Bortle ~2 skies). On a clear night, the stars above the black lava fields are brilliant. The Milky Way stretching over jagged lava and cinder cones truly gives an "astronaut on the Moon" vibe. Great spots include near the <strong>Spatter Cones</strong> area or <strong>Big Cinder Butte</strong> – basically, any turnout away from the lit visitor center will present wide-open sky. The park often hosts summer <strong>"Stars over the Craters"</strong> events with telescopes. The landscape has features like lava tubes and craters that make for unique foregrounds against the Milky Way.</p><p>📷 <a href="https://www.nps.gov/crmo">Official Craters of the Moon NPS Site</a> – check for astronomy programs or Full Moon hikes. <br/>🌙 <strong>Camping:</strong> The monument has a single campground (Lava Flow Campground) nestled among lava rocks. It’s first-come, first-served. Campers here enjoy dark skies once the generator curfew hits – the lava absorbs stray light, making it quite dark. If the campground is full, some stargazers use nearby BLM land for dispersed camping under the stars. <br/>🏨 <strong>Lodging:</strong> No lodging in-park. The nearest town is Arco (~18 miles) which has a couple of basic motels. Some visitors also stay in Hailey/Sun Valley (larger towns ~1 hour away) and drive out for the night – but staying close or camping is better to maximize your dark sky time. <br/>🚗 <strong>Accessibility:</strong> Park is open 24/7, though in winter the loop road closes (you can still stargaze near the visitor center). Summer nights are cool and pleasant at ~5,900 ft elevation. The main loop drive has pullouts – you can choose one and set up a tripod. Be mindful not to walk off trails in the dark; lava terrain can be very uneven and sharp. <br/>🎫 <strong>Permits:</strong> No permit needed, just standard entrance fee. If you want a truly eerie experience, consider a moonless night for maximal stars, or conversely a full moon night to see the lava landscape lit up (but fewer stars visible). Rangers advise bringing red-filtered flashlights and not shining lights into lava tube caves at night (to protect bat habitats). Craters’ combination of rugged landscape and pristine sky will leave you star-struck!</p>',

//   curecanti:
//     '<h2>Curecanti National Recreation Area, Colorado</h2><p>Curecanti NRA, encompassing reservoirs and canyons along the Gunnison River, might not be as famous as nearby Black Canyon NP – but it quietly boasts excellent dark skies and is an International Dark Sky Park in its own right. Away from the small glow of Gunnison town, the skies here are Bortle 2-3. The Milky Way reflecting in Blue Mesa Reservoir is a gorgeous sight on calm nights. One of the best spots is <strong>Dry Gulch Campground</strong> or the <strong>Lake Fork area</strong> where you have expansive views over the water and surrounding hills. NPCA highlighted a Milky Way shot over a Curecanti campground – many of the shoreline campsites are great for stargazing right from your tent. The Stevens Creek area or even up on Mesa (off Hwy 92) also offer splendid panoramas of star-filled skies above the lake.</p><p>📷 <a href="https://www.nps.gov/cure">Official Curecanti NPS Site</a> – look for any Night Sky interpretive info. <br/>🌙 <strong>Camping:</strong> Curecanti has several campgrounds (Elk Creek, Lake Fork, Stevens Creek, etc.), many right along the reservoir. These are fantastic for stargazing – especially if you secure a lakeside spot. Elk Creek is the largest (reservations accepted) with more facilities, though smaller campgrounds might be quieter/darker. <br/>🏨 <strong>Lodging:</strong> No lodges inside the NRA. The town of Gunnison (~30 min) or Montrose (~1 hour) have hotels. Some private marinas or cabin rentals exist near the park (e.g., at Sapinero Village). But staying in Gunnison means you have a bit of drive – camping by the lake really gives the full experience. <br/>🚗 <strong>Accessibility:</strong> The NRA is open 24/7. U.S. Highway 50 and CO Highway 92 run through it; the former can have some traffic even at night, but once you’re on lakeshore or a camp road, it’s very dark. Summer nights by the water are cool and sometimes breezy. At 7,500 ft elevation, even August nights can require a jacket. If you venture to high points along Hwy 92 (north shore), beware of winding roads in the dark – but the reward is incredible star visibility. <br/>🎫 <strong>Permits:</strong> No entrance fees for Curecanti. No permit needed for stargazing. If boating at night (on a new moon, the lake will be extremely dark), ensure you follow all safety regs and have proper lighting on the boat. Fishing at night is popular too – just another excuse to be under the stars. Curecanti might surprise you with how brilliant the heavens are once the sun goes down!</p>',

//   deathvalley:
//     '<h2>Death Valley National Park, California/Nevada</h2><p>Death Valley is one of the best places on Earth for stargazing – its massive size and remote location give it vast areas of Bortle class 1-2 darkness. It’s an International Dark Sky Park (Gold Tier), and on moonless nights the Milky Way stretches brightly from horizon to horizon. In fact, Death Valley is so dark that stargazers joke about "seeing by starlight". Favorite Milky Way photography locations include the <strong>Mesquite Flat Sand Dunes</strong> (imagine dunes glowing under the galaxy’s band), <strong>Badwater Basin</strong> salt flats (for creative reflections of starry skies in shallow water), and <strong>Dante’s View</strong> (which gives a high perch to look over the dark valley). The Ubehebe Crater area and Harmony Borax Works are also popular foregrounds. Each spring, the park hosts a major star party in partnership with astronomy groups.</p><p>📷 <a href="https://www.nps.gov/deva">Official Death Valley NPS Site</a> – check “Night Sky” and calendar for events. <br/>🌙 <strong>Camping:</strong> Numerous campgrounds in Death Valley. For dark-sky enthusiasts, the more remote campgrounds are better (e.g., Mesquite Spring, or Emigrant – the latter is tent-only and free). Furnace Creek campground is convenient but there’s some nearby lighting from the resort area. Camp out by the dunes at Mesquite (Stovepipe Wells campground) to be near a prime night spot. Remember, temperatures in summer nights remain hot (90°F+), so winter and spring are more comfortable for camping and stargazing. <br/>🏨 <strong>Lodging:</strong> There are several in-park lodges (The Oasis at Death Valley, Stovepipe Wells Hotel, Panamint Springs) which can give you a bed and still relatively dark skies just outside. Stovepipe Wells, for instance, turns off exterior lights at night for stargazers. Outside the park, Pahrump or Beatty are options but their town lights will diminish sky quality. Best is to stay in the park if possible. <br/>🚗 <strong>Accessibility:</strong> The park is open 24/7. Distances are huge, so plan your night – you don’t want to be driving 50 miles across the valley at 1 AM if you can avoid it (though if you do, the roads are empty and you might see nocturnal wildlife). Always carry plenty of water; even at night the desert is arid. Be cautious of old mine shafts or uneven ground if wandering in the dark (e.g., on the dunes, note where you parked!). Nighttime temps can be extremely pleasant in winter or late spring – t-shirt weather under the stars, which is magical. <br/>🎫 <strong>Permits:</strong> No permit needed for night use or photography. Just pay the park entry fee. If doing any light painting or astrophotography workshop, follow park guidelines (no light painting in busy areas like Badwater if others are stargazing nearby, etc., to preserve everyone’s night vision). Given the park’s popularity, you might encounter other astronomers – Death Valley’s dark skies are widely cherished, so enjoy them cooperatively. The motto here: “Half the park is after dark”!</p>',

//   dinosaur:
//     '<h2>Dinosaur National Monument, Colorado/Utah</h2><p>Dinosaur National Monument, straddling two states, not only harbors fossils but also an amazingly dark night sky. It’s an International Dark Sky Park with vast areas of Bortle 2 skies. The monument’s remote canyons and river valleys mean minimal light – on a clear night you’ll see the Milky Way and perhaps even zodiacal light. A notable stargazing spot is near the <strong>Quarry Exhibit Hall</strong> (in the Utah side) during special evening programs; rangers sometimes set up telescopes outside the glass-enclosed fossil quarry. But the best views are in the canyon areas: for example, <strong>Echo Park</strong> (at confluence of Green and Yampa Rivers) is spectacular – you can camp there and see the Milky Way rising between towering canyon walls. <strong>Harpers Corner</strong> on the Colorado side, a high overlook, also offers incredible panoramic night skies. Basically, any campsite or viewpoint away from the few lights at park facilities will treat you to brilliant stars.</p><p>📷 <a href="https://www.nps.gov/dino">Official Dinosaur NPS Site</a> – look for any “Night Sky” program info. <br/>🌙 <strong>Camping:</strong> The monument has several campgrounds. On the Utah side, Green River Campground is convenient (near the Quarry) but still fairly dark after hours (minimal facility lights). On the Colorado side, Echo Park Campground is remote and requires high-clearance vehicle, but the reward is an incredibly dark and dramatic setting. Deerlodge Park (east end) is another quiet, dark campground. If you can, camp out – the experience of seeing the Milky Way over your tent in Dinosaur’s wilderness is unforgettable. <br/>🏨 <strong>Lodging:</strong> No lodges in the monument. Nearest motels are in Vernal, Utah or Craig, Colorado depending on which side. Vernal is ~20 minutes from the Quarry and has plenty of accommodations (but also some light pollution – best to stay in the park for real darkness). Some folks also stay in Jensen or Dinosaur, small communities nearby. <br/>🚗 <strong>Accessibility:</strong> Parts of Dinosaur are very remote – plan your route if going out at night. The Quarry area roads are paved and easy; the Echo Park road is rough (not recommended to attempt for the first time in darkness). The sky is best in summer and fall; spring can have some weather. Keep an eye out for wildlife on roads (pronghorn, elk). At night it’s extremely quiet – you may even hear coyotes or owls. <br/>🎫 <strong>Permits:</strong> No permit needed for stargazing. Standard entry fee required during the day. If doing astrophotography at the Quarry, note the building closes at 5pm – but the outside area is accessible and occasionally opened for night events. For backcountry travel at night (if any), let someone know – it’s remote country. With constellation-filled skies and maybe the silhouette of a Stegosaurus skeleton in your imagination, Dinosaur N.M. offers a true “Jurassic” dark sky adventure!</p>',

//   elmorro:
//     '<h2>El Morro National Monument, New Mexico</h2><p>El Morro is a historic oasis in western New Mexico known for Inscription Rock – and at night, it transforms into an oasis of stars. Certified as an International Dark Sky Park, El Morro has wonderfully dark skies (Bortle ~2-3). The broad high-desert horizon means you see the Milky Way from bottom-to-top. A favorite view is the Milky Way arching over the massive sandstone bluff of El Morro, where centuries of travelers carved their names. The park sometimes hosts “Night Sky” events where rangers set up telescopes near the visitor center. Photographers might hike the short Headland trail before closing and then capture star shots with the historic inscriptions or Atsinna ruins in view (with permission on special events). Even from the campground, you’ll have a lovely view of stars above the silhouette of the bluff.</p><p>📷 <a href="https://www.nps.gov/elmo">Official El Morro NPS Site</a> – check for night programs in their events schedule. <br/>🌙 <strong>Camping:</strong> El Morro has a small, free nine-site campground just 0.25 mile from the main bluff. It’s first-come, first-served. Staying there is great for stargazing – you can walk near the base of Inscription Rock and have an expansive sky. No generators are allowed, which keeps it quiet and dark. <br/>🏨 <strong>Lodging:</strong> No lodging on-site. The nearest accommodations are in the small towns of Ramah or Grants (both some distance – Grants is ~45 miles). Many visitors do day trips, but to see the night sky, camping is your best bet unless you have nearby relatives/friends. <br/>🚗 <strong>Accessibility:</strong> The monument is open from morning until sunset for exploring the trails. After dark, you’re mostly limited to the campground or immediate area, as trails close (except during guided night programs). The road to El Morro (Highway 53) is fairly empty at night, and the monument area has essentially no lights. Weather is generally clear; summer brings thunderstorms but also incredible clear nights between them. At ~7,200 ft elevation, bring a jacket – nights can be cool. <br/>🎫 <strong>Permits:</strong> No entry fee for El Morro, and no permit needed for camping or stargazing. If you want to do night photography by the inscriptions or up on the mesa, you’d need to coordinate with park staff (they’ve done photography workshops in the past). Otherwise, enjoy the stars from the campground or pullouts. The combo of historic human marks and the timeless starry heavens at El Morro is truly moving.</p>',

//   flagstaff_monuments:
//     '<h2>Flagstaff Area National Monuments (Sunset Crater, Walnut Canyon, Wupatki), Arizona</h2><p>These three national monuments near Flagstaff have all earned International Dark Sky designations and together contribute to Flagstaff’s reputation as the world’s first "Dark Sky City". **Wupatki National Monument** offers particularly dark skies – out on the red rock plains, the Milky Way shines brightly over ancient Puebloan ruins. Popular spots include <strong>Wukoki Pueblo</strong> and <strong>Wupatki Pueblo</strong> where on certain nights rangers host "Explore the Stars" programs. **Sunset Crater Volcano NM**, with its black lava flows and cinder cones, also provides great viewing – the cinder fields near the loop road are expansive and dark (just note the park proper closes at sunset, but the skies above are visible from nearby pullouts). **Walnut Canyon NM** is closer to the city; its deep canyon of cliff dwellings can shield some city glow, but it’s a bit brighter than Wupatki. Still, on a clear night you can see countless stars from the canyon rim. Together, these monuments prove that even near a city, proper lighting and open vistas can yield amazing stargazing.</p><p>📷 <a href="https://www.nps.gov/sucr">Sunset Crater Volcano NPS</a>, <a href="https://www.nps.gov/wupa">Wupatki NPS</a>, <a href="https://www.nps.gov/waca">Walnut Canyon NPS</a> – official sites for each (check for occasional night events). <br/>🌙 <strong>Camping:</strong> Sunset Crater/Wupatki: There’s a campground at Bonito (just outside Sunset Crater NM, in national forest) which is an excellent base for stargazing these two – it’s right by Sunset Crater and very dark at night. Walnut Canyon has no campground (Flagstaff’s campgrounds or Bonito are options). <br/>🏨 <strong>Lodging:</strong> No in-park lodging; however, Flagstaff is just next door with plenty of hotels. The good news is Flagstaff has strict dark sky ordinances, so its lights are relatively subdued (still, it’s a city – expect some skyglow). If you want the darkest experience, stay out by the Sunset/Wupatki area or even in accommodations in the Navajo Nation east of Wupatki. <br/>🚗 <strong>Accessibility:</strong> Sunset Crater and Wupatki are connected by a loop road (HWY 545). Wupatki Visitor Center area and Wukoki Pueblo are good night view spots but note: officially, the monuments close around sunset (no overnight visitation unless a special program). However, nearby Forest Service pullouts or the roadsides are used by astrophotographers after hours. Walnut Canyon also closes at sunset for entry. If you attend a ranger-led night program, you’ll be allowed in after dark. The terrain can be rough – stick to areas near parking. <br/>🎫 <strong>Permits:</strong> No stargazing permit, but obey closure hours. The Flagstaff-area monuments periodically have after-dark events where they keep gates open – watch their announcements. Otherwise, one strategy is to camp at Bonito Campground and use adjacent Forest land to stargaze with the monuments’ dark skies in view. Remember, these sites are sacred to many – avoid clambering around ruins in the dark. Enjoy the cosmic views that Native people have appreciated here for generations.</p>',

//   glacier:
//     '<h2>Glacier National Park (and Waterton Lakes), Montana/Alberta</h2><p>Glacier National Park, together with Canada’s Waterton Lakes, is the world’s first International Dark Sky Park spanning an international border. Glacier’s night skies are stunning, especially on the east side away from any town lights. On a clear night at Glacier, you might see the Milky Way mirrored in alpine lakes and even the occasional aurora borealis low on the horizon. Top spots include <strong>Logan Pass</strong> (Hidden Lake Overlook) – rangers often do summer star parties there, and at 6,600 ft with no lights, the sky is incredible. Also, <strong>Two Medicine Lake</strong> area and <strong>Many Glacier</strong> have broad sky views with mountain silhouettes. Head out onto the shore of Lake McDonald (west side) and you’ll catch the stars reflecting in the water. Waterton Lakes (across the border) similarly has great darkness, particularly at <strong>Red Rock Parkway</strong> or Cameron Lake. Together, these parks are a paradise for both astrophotography and casual stargazing.</p><p>📷 <a href="https://www.nps.gov/glac">Official Glacier NPS Site</a> / <a href="https://www.pc.gc.ca/en/pn-np/ab/waterton">Parks Canada Waterton Site</a> – check for astronomy events. <br/>🌙 <strong>Camping:</strong> Numerous campgrounds. For best skies, Many Glacier, Two Medicine, or St. Mary campgrounds are ideal (east side = darker skies, since west side has a bit more glow from distant towns). Many Glacier fills up, but offers amazing views. Logan Pass is only accessible by car or shuttle, not for camping – but people do drive up late for stargazing. Bring blankets – nights are cold, even in summer. <br/>🏨 <strong>Lodging:</strong> In-park lodges like Many Glacier Hotel or Lake McDonald Lodge allow you to step outside to dark skies (Lake McDonald Lodge area has some lights but you can walk to darker spots). St. Mary Village or lodges in East Glacier are also fairly good, with minimal town light (they’re tiny towns). Waterton townsite has more light but is still small. Overall, lodging on the east side will yield better star views from your doorstep than the more developed west side. <br/>🚗 <strong>Accessibility:</strong> Glacier’s Going-to-the-Sun Road is open 24/7 in summer (check for any closures). A popular approach is to go up to Logan Pass after 10pm when traffic is gone – the parking lot becomes a grand observatory. Just be mindful of wildlife (mountain goats, etc. may wander). Also, it’s really dark – a headlamp (red mode) and situational awareness is key. If you’re in Waterton, some roads close at night, but you can stargaze from the town marina or Prince of Wales Hotel hill. High elevation = strong chance of sudden weather, so have layers. <br/>🎫 <strong>Permits:</strong> No special permit for stargazing. Note that Glacier has a ticketed entry system during daytime in summer for Going-to-the-Sun Road, but at night those restrictions don’t apply (usually after 9pm). So you can drive in late without a ticket and enjoy the stars. International travelers: remember border hours if going between parks – the crossing may not be 24hr. In all, Glacier’s wild night skies will leave you star-struck – a perfect complement to its daytime scenery.</p>',

//   grandcanyon:
//     '<h2>Grand Canyon National Park, Arizona</h2><p>The Grand Canyon’s vastness isn’t only downward – it also extends upward into the cosmos! Grand Canyon is an International Dark Sky Park, and on a clear night the canyon fills with darkness while the sky explodes with stars. Many spots on the South Rim and North Rim offer excellent stargazing. On the South Rim, points away from Grand Canyon Village are best: <strong>Lipan Point</strong> and <strong>Desert View</strong> are favorites, where you can see the Milky Way rising over the canyon with minimal interference. The North Rim, being more remote and with fewer people, has outstanding dark skies – <strong>Cape Royal</strong> or <strong>Point Imperial</strong> are fantastic (Cape Royal was featured in night sky photos with a trail silhouetted). In summer, the park hosts a popular annual <em>Grand Canyon Star Party</em> – amateur astronomers set up dozens of telescopes for the public at Yavapai Point and the North Rim lodge area. Under Bortle ~2 skies, you can see the Milky Way stretch from horizon to horizon and even faint meteors or satellites clearly.</p><p>📷 <a href="https://www.nps.gov/grca">Official Grand Canyon NPS Site</a> – info on the Star Party and astronomy programs. <br/>🌙 <strong>Camping:</strong> Both rims have campgrounds. On South Rim, Mather Campground (and adjacent Trailer Village) are in the busy area – convenient but some light nearby. Desert View Campground, 25 miles east of the village, is smaller and much darker at night (highly recommended if stargazing, and it’s right by Desert View Point). North Rim Campground is near the lodge but still relatively dark and quiet at night due to fewer people. At all campgrounds, quiet hours extinguish most lights by 10pm. You can also backpack into the canyon and have a phenomenal sky (just note inner canyon nights are warmer but you’ll see less of horizon). <br/>🏨 <strong>Lodging:</strong> South Rim has multiple lodges (e.g. El Tovar, Kachina, etc.). If you walk a short distance from these, you can find darkness – for example, behind Yavapai Geology Museum or along the Rim Trail away from the main plaza. Desert View has no lodge. North Rim Lodge area has cabins; just stepping out onto Bright Angel Point after dark gives you outstanding views. If lodging outside the park (Tusayan or Jacob Lake), those have more light, so try to stay in-park if stars are a priority. <br/>🚗 <strong>Accessibility:</strong> The park is open 24/7. On South Rim, the east desert View Drive is open at night (and actually a joy to drive under starry skies – watch for elk!). The shuttle buses don’t run late, so you’ll use your own car to reach night viewpoints. Some viewpoints have railings – great for setting up a camera. Bring a flashlight (with red filter ideally) – the Rim can be dangerously dark near drop-offs. North Rim’s roads (e.g., out to Cape Royal) are dark and sometimes closed after dusk, so check. Always be cautious of wildlife crossing roads. Weather: summer nights are pleasant on the rims (~50s-60s°F), while shoulder seasons can be chilly. <br/>🎫 <strong>Permits:</strong> No permit for night use. Just your park entry fee. During large star party events, all is organized and free. If you’re doing something like light painting or using modeling lights, be mindful of others – Grand Canyon’s darkness is treasured and photographers/astronomers cooperate to keep it that way. In sum, don’t miss looking up while at the canyon – the "grandest" views include the universe above!</p>',

//   greatbasin:
//     '<h2>Great Basin National Park, Nevada</h2><p>Great Basin is a gold-tier International Dark Sky Park and arguably has some of the darkest, clearest skies in the lower 48. Far from any cities, its night sky is often Bortle class 1-2. When you gaze upward from Great Basin, you’ll see an astonishing number of stars and one of the brightest views of the Milky Way anywhere. The park capitalizes on this with frequent astronomy programs at their observatory (they have telescopes and offer public stargazing nights). For Milky Way photography, head up to <strong>Mather Overlook</strong> on the Wheeler Peak Scenic Drive (around 9,000 ft elevation) – you’ll get sweeping sky views and perhaps the silhouette of 13,000-ft Wheeler Peak. Other great spots: the vicinity of <strong>Lehman Caves Visitor Center</strong> (they sometimes have astronomy events here) and <strong>Stella Lake</strong> (a short hike, reflecting stars and Wheeler Peak). Even the park’s campground meadows provide terrific viewing – it’s hard to find a bad spot, honestly, since there is virtually no light pollution for miles around.</p><p>📷 <a href="https://www.nps.gov/grba">Official Great Basin NPS Site</a> – look for astronomy program and Lehman Caves astronomy amphitheater info. <br/>🌙 <strong>Camping:</strong> Great Basin has multiple campgrounds (Upper Lehman, Lower Lehman, Baker Creek, Wheeler Peak campground, etc.). Wheeler Peak Campground (at 10,000 ft) puts you closer to the stars – the trade-off is very cold nights even in summer and more trees around (so find the nearby meadow clearings for best sky). Upper Lehman Creek campground is lower (warmer) and has open spots with sky views. In summer near new moon, the park often holds the annual Astronomy Festival – campgrounds will fill up, so reserve if possible or arrive early. <br/>🏨 <strong>Lodging:</strong> No lodging inside the park. The tiny town of Baker at the park entrance has a couple of motels and cabins. They are small and often fully booked during astronomy events. Nearest larger town is Ely, 60 miles west (which has more hotels but also more light – though Ely is small and its glow won’t reach the park). Honestly, camping under the absurdly starry sky is ideal here if you can swing it. <br/>🚗 <strong>Accessibility:</strong> The main park road (Wheeler Peak Scenic Drive) is paved and typically open May-Nov (closes in winter beyond Upper Lehman). You can drive up at night – just be cautious of wildlife (deer, foxes). A bonus: at high altitudes the cosmic sky is even crisper due to thin air. Do bring warm clothes; even in July it can drop into the 40s°F or lower at 10k feet. The visitor center area at 6,800 ft is milder and they often have night talks there with big telescopes. Great Basin’s arid climate means many clear nights, but check for summer thunderstorms. <br/>🎫 <strong>Permits:</strong> No permit needed for stargazing or photography. Standard entrance is free (the park doesn’t charge entry). If attending a formal astronomy program, just show up (some might require sign-up but usually not). Photographers: during big events, avoid using bright lights as lots of people will be dark-adapted. Great Basin is proud of its "one of the last true dark skies" – you’ll quickly see why. It’s an astrophotographer’s dream location.</p>',

//   greatsanddunes:
//     '<h2>Great Sand Dunes National Park & Preserve, Colorado</h2><p>Great Sand Dunes NP offers an incredible combination: the tallest sand dunes in North America with an utterly dark sky above. It’s an International Dark Sky Park and on a moonless night it’s common to see the Milky Way brilliantly arching over the dunes. The Bortle rating is around class 2 here. The openness of the San Luis Valley means you have a full dome of sky to enjoy. Photographers love trekking out onto the dunes at night – for example, capturing the Milky Way over the famous <strong>Star Dune</strong> or <strong>High Dune</strong>. Just be careful not to lose your way in the sands! Even near the parking area at <strong>Medano Creek</strong>, you’ll get superb views once the visitor center lights go off. In addition to stars, Great Sand Dunes is known for occasional neat night phenomena like moonbows (when there’s a full moon creating rainbows on Medano Creek) – but during new moons the stars reign supreme. If you’re lucky, you might even catch an overhead pass of the International Space Station or meteors reflecting off the dune flats.</p><p>📷 <a href="https://www.nps.gov/grsa">Official Great Sand Dunes NPS Site</a> – see “Stargazing” tips. <br/>🌙 <strong>Camping:</strong> The park campground (Pinon Flats) is conveniently right by the dunes. Many campers simply walk a short distance onto the sand at night for a jaw-dropping celestial show. Pinon Flats can fill up in summer – reserve if possible. Backcountry camping on the dunes is also allowed with a free permit: you can backpack a mile or more out onto the sand and set up camp in the dunes’ “no zone” area. Camping out there, you’ll have zero artificial light – just you, sand, and stars (an epic experience if prepared properly). <br/>🏨 <strong>Lodging:</strong> No in-park lodging. There are a few motels and rental cabins in nearby Mosca, Hooper, or Alamosa (~30-40 min away). Some accommodations and the park’s amphitheater host periodic star programs with local astronomers. If staying in Alamosa, you will see a light dome from the town to the southwest, but at the dunes that’s negligible. <br/>🚗 <strong>Accessibility:</strong> The main use areas are open 24/7. You can drive to the Dunes Parking lot at any hour. Walking on the sand at night is magical, but note: sand can be tricky terrain in the dark (and get surprisingly cold at night). Use a headlamp with red light and consider setting a waypoint to find your way back. The park is at 8,200 ft elevation – bring layers as nights can be cool even after hot days. Fall offers crisp skies; summer brings the occasional thunderstorm that can clear out and leave dazzling stars behind. <br/>🎫 <strong>Permits:</strong> No permit needed for general stargazing or night hiking around the frontcountry. If you plan to camp overnight on the dunes, you must get a backcountry permit (free, from the visitor center during the day). Also, remember to not disturb any wildlife – listen for the cute calls of kangaroo rats hopping about at night. The dunes under the stars are an absolute must-see: you’ll understand why they call one landmark “Star Dune”!</p>',

//   hovenweep:
//     '<h2>Hovenweep National Monument, Utah/Colorado</h2><p>Hovenweep National Monument preserves eerie and beautiful Ancestral Puebloan stone towers – and it also enjoys impressively dark skies (it’s an International Dark Sky Park). Out on the Cajon Mesa, far from city lights, Hovenweep offers roughly Bortle 2 skies where the Milky Way appears richly detailed. The sight of the Milky Way rising over a 700-year-old stone tower is truly unforgettable. The main campground and visitor center area near <strong>Square Tower Group</strong> is an excellent stargazing spot – you can see stars reflecting in the small seep spring below the ruins on a still night. Other units of Hovenweep (e.g., Hackberry or Holly groups) are even more remote and can be visited for isolated night photography (though requires a bit of hike). Many visitors bring telescopes to Hovenweep’s campground; rangers sometimes host constellation tours in summer. The lack of light also means you might catch occasional views of the Milky Way’s dark dust lanes and perhaps the Andromeda galaxy with the naked eye.</p><p>📷 <a href="https://www.nps.gov/hove">Official Hovenweep NPS Site</a> – see “Outdoor Activities” for any stargazing notes. <br/>🌙 <strong>Camping:</strong> Hovenweep has one small campground near the visitor center. It’s first-come, first-served. Camping there is fantastic for stargazing – there are no lights at all in the campground. You can walk a few yards to the rim of Little Ruin Canyon for a panoramic sky view above the towers. Be aware, no generators allowed at night, so it stays quiet and dark. <br/>🏨 <strong>Lodging:</strong> No lodging at Hovenweep. The nearest towns are Blanding or Bluff, Utah (~40-50 minutes) or Cortez, Colorado (~1 hour). These are small towns; their lights likely won’t interfere at the monument. Some people stay at San Juan County cabins or in the Navajo reservation communities if exploring multiple parks. But if you can snag a campsite, that’s ideal. <br/>🚗 <strong>Accessibility:</strong> The roads to Hovenweep are paved until the last few miles, which are good gravel – reachable by most cars (just watch for cows on open range). It is open 24/7. Walking the ruin loop trail at night is not advised unless with a ranger (unfenced drop-offs), but you can view much from near the visitor center. Spring and fall nights are mild; summer nights are warm and dry. At ~5,200 ft elevation, nights can still get a bit cool, so have a light jacket. Very occasionally, distant light from oil/gas infrastructure can faintly glow to the south, but overall it’s extremely dark. <br/>🎫 <strong>Permits:</strong> No permit or fee to enter Hovenweep. Camping has a small fee. If you plan any night photography amongst the ruins beyond normal visitor hours, just inform the rangers (they’re supportive of astronomy enthusiasts as long as nothing is disturbed). Also consider visiting during a new moon for the best starlight – conversely, a rising full moon illuminating the ancient towers is quite a spiritual sight too, albeit with fewer stars visible. At Hovenweep, you truly feel the past and present under a timeless sky.</p>',

//   joshuatree:
//     '<h2>Joshua Tree National Park, California</h2><p>Joshua Tree NP is a beloved desert park known for its distinctive yucca trees and rock formations – and it also harbors impressively dark skies, especially for Southern California. As an International Dark Sky Park, it has pockets of Bortle 2-3 darkness. You can see the Milky Way spanning above Joshua Tree’s boulders and spiky silhouettes on summer nights. Some of the best stargazing is on the park’s eastern side (Cottonwood area) which is farther from Palm Springs’ lights. Popular Milky Way photo spots include <strong>Arch Rock</strong> (near White Tank campground – photographers often light-paint the arch against the galaxy) and the <strong>Hidden Valley</strong> area where massive rocks create foreground interest. <strong>Keys View</strong> is a high viewpoint that can be nice, but it does face some distant city lights. Many just wander out from camp and find a nice Joshua tree to compose beneath the stars. Keep in mind, Joshua Tree’s night sky isn’t as pristine as some remote parks, but it’s among the darkest in SoCal, making it a haven for regional astronomers.</p><p>📷 <a href="https://www.nps.gov/jotr">Official Joshua Tree NPS Site</a> – see “Night Sky” for tips and any ranger talks. <br/>🌙 <strong>Camping:</strong> Several campgrounds are available – Jumbo Rocks, White Tank, Hidden Valley, etc. Jumbo Rocks is very popular and has incredible rock formations around (great for night photography), though it sees many visitors. White Tank is smaller, often favored by astrophotographers for its proximity to Arch Rock and generally quiet atmosphere. Indian Cove is a bit lower elevation and nearer to town lights, so not as dark as those deeper in the park. Reservations are needed in cooler seasons. Camping gives you the advantage of not having to drive out late – plus the park gates aren’t staffed at night anyway. <br/>🏨 <strong>Lodging:</strong> No lodging inside the park. Many people stay in the towns of Joshua Tree, Twentynine Palms, or Yucca Valley which border the park – they have a range of inns and rentals. These communities support dark skies to an extent (particularly Twentynine Palms, near the north entrance, has less development). But you will want to drive into the park at night for the true experience. Some accommodations offer night sky tours too. <br/>🚗 <strong>Accessibility:</strong> The park is open 24/7. If you’re coming in at night, you can self-pay at the entrance. Roads are good and paved to major sites. Do watch for wildlife – black-tailed jackrabbits and kangaroo rats often dart across the road. Also watch your step for critters (rattlesnakes often aren’t active at night unless it’s hot, but still be mindful). Summer nights can remain very warm (80s°F), but from fall through spring nights are cool/cold in the desert. If visiting in summer, plan for the Milky Way core visible in early night hours. In winter, you get long nights but bring a coat. <br/>🎫 <strong>Permits:</strong> No permit for photography or stargazing, just the entry fee. If doing any commercial night filming you’d need one, but personal use is fine. One important note: Joshua Tree sees increasing visitation – if you find a nice quiet spot, minimize use of white light so as not to impact others. Conversely, you might occasionally see distant car lights or someone’s flashlight – part of the experience in a popular park. But generally, the further in you go (e.g., Cottonwood Spring or Pinto Basin Road pullouts), the more solitude and darkness you’ll get. Enjoy the cosmic display above those whimsical Joshua trees – it’s quite the sight!</p>',

//   katahdin:
//     '<h2>Katahdin Woods and Waters National Monument, Maine</h2><p>Katahdin Woods and Waters (KWW) is a newer national monument in Maine, and it has quickly become renowned for its dark skies. In fact, it was certified as an International Dark Sky Sanctuary – one of the only such designations in the eastern U.S. Northern Maine has very little light pollution, giving KWW roughly Bortle 2 skies on a good night. The Milky Way is brilliantly visible, and in autumn you might even catch the aurora borealis glowing to the north. The monument’s designated “Stars Over Katahdin” viewpoint along the loop road is a prime spot for stargazing, offering open views toward Mt. Katahdin. Other great areas include <strong>Sandbank Campground</strong> (on the east branch of Penobscot River – you can see stars reflecting in the water) and along the <strong>Schoodic Mountain Trail</strong>. The region frequently hosts an annual <em>Stars Over Katahdin</em> event where astronomers and locals gather to celebrate the night sky. These wild forests truly give an awe-inspiring view of the cosmos.</p><p>📷 <a href="https://www.nps.gov/kaww">Official Katahdin Woods & Waters Site</a> – check for any scheduled night sky events. <br/>🌙 <strong>Camping:</strong> KWW is pretty remote. It has primitive campsites (both drive-up and hike-in) that require free permits. Lunksoos Camp and Sandbank Campground are two spots accessible by vehicle. Camping here is fantastic for stargazing – there’s no one else around and absolutely no artificial light for miles. Just be prepared for rustic conditions (no running water, etc.). Baxter State Park (next door) also has campgrounds if you’re combining trips, but Baxter has more rules and is a bit farther from some vantage points. <br/>🏨 <strong>Lodging:</strong> No lodges in the monument. The nearest small towns (Millinocket or Patten) have a few inns and motels. There’s also the historic Lunksoos Lodge just outside monument lands which sometimes hosts stargazing groups. If staying in town, you’ll need to drive ~30-60 minutes into the dark areas. A headlamp or good flashlight is a must – nights get very dark. <br/>🚗 <strong>Accessibility:</strong> The main loop road of the monument is gravel and best for high-clearance vehicles, but passenger cars can manage with caution. It’s remote – likely you’ll be the only car at night. Cell service is spotty or non-existent. Summers have some buggy nights (bring repellent), but clear weather in late summer and fall yields stunning skies. Winters are brutally cold and access is by snowmobile or skis only – though the winter night sky with perhaps snow-covered ground and stars is amazing if you’re adventurous. If you’re not intimately familiar with the area, consider going with a group or during an event, as navigation at night can be tricky. <br/>🎫 <strong>Permits:</strong> No entry fee. Camping permits are required but free – get them in advance from the Friends of KWW or NPS website. No special permit for stargazing. As always, leave no trace and be bear-aware (store food properly) if out overnight. Katahdin Woods and Waters offers a rare chance in the Northeast to see an unmarred night sky – it’s worth the effort to experience it.</p>',

//   lbj: '<h2>Lyndon B. Johnson National Historical Park, Texas</h2><p>Perhaps unexpectedly, this historical park – commemorating President Lyndon B. Johnson in the Texas Hill Country – is also recognized as an International Dark Sky Park (the first National Historical Park to get that status). The park sits in rural central Texas, and its night skies are surprisingly dark (Bortle ~3) for being not too far from Austin/San Antonio. On clear nights, especially in winter or early spring, you can see the Milky Way band faintly and plenty of stars over the LBJ Ranch fields. The park occasionally hosts public stargazing events at the LBJ Ranch, taking advantage of those open horizons. Good spots include near the <strong>Airplane Hangar visitor area</strong> or by the <strong>show barn</strong> – basically any wide field away from trees. You’ll have gentle silhouettes of oaks and maybe cattle under the stars. It’s a wonderful blend of Texas heritage and natural night sky.</p><p>📷 <a href="https://www.nps.gov/lyjo">Official LBJ Park Site</a> – check news for any night sky programs. <br/>🌙 <strong>Camping:</strong> There’s no camping within LBJ National Historical Park (it’s mostly a daytime historic site). However, nearby Pedernales Falls State Park or local private campgrounds could serve as a base if you want to overnight in the area. Pedernales Falls SP, for instance, also has decently dark skies. <br/>🏨 <strong>Lodging:</strong> The closest town is Johnson City (and Fredericksburg a bit farther) – both have small hotels and B&Bs. Fredericksburg is a bigger tourist town with more lighting, so Johnson City or Stonewall area would be better for darkness. Some ranch B&Bs around might specifically cater to stargazers. <br/>🚗 <strong>Accessibility:</strong> The LBJ Ranch unit (near Stonewall, TX) is open until 5pm typically for touring, but the grounds outside aren’t gated – one can potentially stargaze from roadside turnouts or parking areas by the ranch after hours, just be respectful. The official dark sky designation suggests the community is supportive of night skies; even streetlights in the area are likely shielded. Texas Hill Country weather is generally clear, but can have humidity or clouds especially in summer. Spring and fall bring crisp, clear nights. If you happen to be there on a night when the park or local astronomy club has a star party, definitely join in! <br/>🎫 <strong>Permits:</strong> No permit for casual stargazing, but also no formal after-dark access inside buildings or such. If an event is happening, it’s free. Lyndon Johnson often reminisced about the big Texas sky – and now visitors can enjoy the same stars he saw growing up here, thanks to efforts to keep the skies natural. So while history buffs visit by day, night sky buffs can also appreciate this park after dark.</p>',

//   mammothcave:
//     '<h2>Mammoth Cave National Park, Kentucky</h2><p>Mammoth Cave is famous for its underground wonders, but above ground it has earned recognition for its dark night skies too (it became an International Dark Sky Park). Southern Kentucky has relatively little development around the park, giving a Bortle ~3 sky at Mammoth Cave. On a clear night, especially at overlooks or open fields, you can see the Milky Way and thousands of stars. The park has begun offering occasional evening astronomy programs at the visitor center area or campground, where rangers point out constellations and even set up telescopes. Good stargazing spots include the <strong>field by the Visitor Center</strong> (once the lights are minimized during events) and <strong>Denenbrough Ferry</strong> day-use area (an open area near Green River with wide sky views). Also, consider the <strong>Big Meadow</strong> – as the name suggests, it’s a large grassy opening perfect for sky watching. The ambiance of crickets and the Green River’s fog in low areas adds to the night magic.</p><p>📷 <a href="https://www.nps.gov/maca">Official Mammoth Cave NPS Site</a> – see if any “Starry Night” events are on the schedule. <br/>🌙 <strong>Camping:</strong> The park’s main campground (Mammoth Cave Campground) is near the visitor center and offers a decent amount of tree cover – which is nice for shade, but you might want to walk to an adjacent field for the best sky. There’s also Maple Springs Group Campground (more open, but usually for groups). Backcountry camping in the park’s north side could yield great stargazing, but it’s wooded so find a trail through a prairie or riverbank for clear views. <br/>🏨 <strong>Lodging:</strong> The Lodge at Mammoth Cave (by the visitor center) is available if you prefer a bed. It’s modest, but stepping outside at night, you’re already in a dark environment aside from some path lights. Otherwise, accommodations in Cave City or Park City are ~20 minutes away but come with more skyglow. Try to stay in the park if possible when stargazing. <br/>🚗 <strong>Accessibility:</strong> The park is open 24/7 (cave tours aside). Driving the roads at night is easy, with low traffic – do watch for deer or other wildlife. The south side of the park (around the visitor center) is higher elevation and tends to have clearer skies than the river valleys which can collect fog. Summer nights are warm and humid (which can haze the sky a bit); autumn and winter bring crisper skies. One advantage in winter: leaf-off conditions open up the sky view in forested areas. <br/>🎫 <strong>Permits:</strong> No permit needed for night use. If you’re going to wander trails at night, just be careful – some karst areas have sinkholes and it’s easy to get turned around in woods. The park staff are excited about sharing the night sky, so if you see an astronomy event, jump in! It’s a wonderful bonus to the cave experience – as they say, "Half the park is after dark", even at Mammoth Cave.</p>',

//   mesaverde:
//     '<h2>Mesa Verde National Park, Colorado</h2><p>Mesa Verde is famed for its ancient cliff dwellings – and being perched on a high mesa means it also has a broad view of the heavens. Now an International Dark Sky Park, Mesa Verde enjoys dark skies (Bortle ~2-3) especially once you get away from the small lights of Far View area. Imagine seeing the Milky Way rising above the silhouette of Cliff Palace – it’s a unique sight connecting you with the Ancestral Puebloan people who surely watched those same stars. Best stargazing spots include <strong>Morefield Overlook</strong> (near the campground, wide open sky) and <strong>Park Point</strong> (highest elevation in the park at 8,572 ft, with a 360° view – incredible for sunsets and then stars). The park occasionally offers summer stargazing programs at the Morefield Amphitheater or even at Mesa Top sites where you can gaze at the sky and lit-up cliff dwellings in tandem. Late summer and fall are great times when the Milky Way is visible early and the days’ crowds have gone, leaving the quiet mesa top under starry skies.</p><p>📷 <a href="https://www.nps.gov/meve">Official Mesa Verde NPS Site</a> – check for any “Astronomy in the Park” events. <br/>🌙 <strong>Camping:</strong> Morefield Campground is the park’s campground, located in a broad canyon/valley. It is somewhat lower in elevation and surrounded by ridges – while it’s a lovely place to camp, nearby ridge tops will give a fuller sky view. But you can certainly see plenty from the campground, especially in the open meadow areas by the amphitheater. It rarely fills except peak holidays. <br/>🏨 <strong>Lodging:</strong> Far View Lodge inside the park offers comfortable rooms on the mesa – one great feature: it has balconies, and because it’s relatively isolated, you can step outside at night and do some casual stargazing (the lodge observes dark-sky friendly lighting). If not staying there, lodging is in Cortez (~30 min away) which has some lights that slightly affect the horizon to the west. Far View is best for the true dark experience. <br/>🚗 <strong>Accessibility:</strong> The park road is long and winding (about 45 minutes from entrance to the mesa top sites). It’s open at night for visitors in the lodge or campground; otherwise, some areas like Wetherill Road might be gated after dark for safety. Park Point is easy to access via a short paved path (bring a flashlight). Be mindful that Mesa Verde has wildlife like deer and even mountain lions – stick to known paths in the dark and don’t wander near cliff edges. Nights at 7-8k ft are cool; even summer evenings need a light jacket. In late fall, it can dip below freezing once the sun sets. <br/>🎫 <strong>Permits:</strong> No special permit for stargazing. If you are in the park already (camping or lodging), you’re free to enjoy the night. The main gate isn’t strictly closed overnight, but visitors not staying overnight are generally expected to leave by a certain time. During special events, they may allow night entry. There’s something spiritual about gazing at the same starry sky that Mesa Verde’s inhabitants did 800+ years ago – it adds a whole new dimension to visiting this park.</p>',

//   naturalbridges:
//     '<h2>Natural Bridges National Monument, Utah</h2><p>Natural Bridges holds a special place in dark sky history – it was the very first International Dark Sky Park designated in the world (in 2007). The reason? Its exceptionally dark skies (Bortle class 1-2) and stunning natural rock bridges that make perfect frames for the cosmos. Under a moonless sky, Natural Bridges is so dark that the Milky Way can cast faint shadows and the sky is truly jet black between stars. The monument features three giant sandstone bridges; <strong>Owachomo Bridge</strong> is a favorite for night photography, as it’s easily accessible and you can stand beneath it with the Milky Way soaring overhead. In fact, a famous photo taken here shows the Milky Way as a ribbon through Owachomo – indicating just how brilliant it is. Also, <strong>Sipapu Bridge</strong> (the largest) is an amazing sight at night, though it requires a hike down. The park encourages stargazing with an informative night sky kiosk and occasional ranger programs. Every vista here after dark is phenomenal.</p><p>📷 <a href="https://www.nps.gov/nabr">Official Natural Bridges NPS Site</a> – includes a section on stargazing. <br/>🌙 <strong>Camping:</strong> There’s a small, first-come campground at Natural Bridges (13 sites). It often fills in peak season, but if you snag a spot, you’re in for a treat – the campground has no artificial lights and is walking distance from Owachomo Bridge trailhead. Many astrophotographers will camp and then head out at 2 AM to capture the galactic core under a bridge. If the campground is full, nearest camping is dispersed on BLM land outside or at Glen Canyon NRA areas (but you’ll have a drive back in). <br/>🏨 <strong>Lodging:</strong> No lodging at the monument. The nearest very small town is Mexican Hat (~30 miles) or Blanding (~40 miles). Those are too far for quick night trips, so camping is really the way to go. Some people stay in Bluff, UT, which has a couple of inns and drive ~1 hour – doable, but you miss the full immersion. <br/>🚗 <strong>Accessibility:</strong> The loop road is open 24/7; just self-pay at the entrance if after hours. Owachomo Bridge is only a 0.2-mile walk from its parking, relatively easy (though watch your step on uneven slickrock in dark). The other bridges involve longer hikes into canyons – if doing at night, extreme caution and preferably familiarity is needed. The good news is even from pullouts and the visitor center area, the skies are astounding. Elevation ~6,500 ft means clear, thin air, but also that nights can be chilly even in summer. Summertime (May-Aug) yields the Milky Way core in early night; winter gives pristine skies with Orion and winter constellations. Bring warm clothes and maybe a reclining chair to just lie back. <br/>🎫 <strong>Permits:</strong> No special permit for stargazing or night photography. Just pay entry fee. The park staff kindly ask that light sources be minimal – and people generally respect that. Natural Bridges is often cited as having "the darkest sky in the US" – you’ll see why when you experience it. It’s a must-visit for serious dark sky enthusiasts.</p>',

//   obed: '<h2>Obed Wild & Scenic River, Tennessee</h2><p>Obed WSR is a hidden gem in eastern Tennessee – known for its river gorges and cliffs, it also boasts very dark skies for the region (and was designated an International Dark Sky Park in 2017). In fact, it’s one of the few places in the Southeast where you can see the Milky Way clearly. The park has capitalized on this with frequent “Night Skies” programs. Excellent stargazing spots include <strong>Lilly Bluff Overlook</strong> – an accessible platform offering a broad sky view over the gorge – and <strong>Nemo Bridge</strong> area, where you can stand on a historic bridge above the dark river and gaze up at the stars (a unique experience!). The Obed’s night sky has virtually no light interference; on clear nights you might even see the subtle glow of the Milky Way’s galactic arms. Fireflies in summer add a touch of magic, blinking among the woods while stars shine above.</p><p>📷 <a href="https://www.nps.gov/obed">Official Obed NPS Site</a> – check “Events” for regular Night Sky outings. <br/>🌙 <strong>Camping:</strong> Obed has one campground at Rock Creek (near Nemo) – it’s small, first-come, and fairly wooded. It provides a convenient base but for the best sky views you might walk or drive a short way to an overlook or the bridge. There are also backcountry sites accessible by trail or along the river if you’re paddling, where you’ll have zero artificial light around. <br/>🏨 <strong>Lodging:</strong> No lodging within this park (it’s mostly just river corridor). The nearest town with accommodations is Wartburg or Harriman, TN, but those are still a bit of a drive (30+ min). Many visitors come from Knoxville (about an hour) for evening programs. If you want to fully experience the darkness, camping is recommended. There are also nearby state park cabins at Pickett CCC Memorial SP or rentals in the area. <br/>🚗 <strong>Accessibility:</strong> Most Obed sites are accessible via country roads. Lilly Bluff Overlook has a parking lot and short boardwalk – very easy to reach and a common spot for star parties. Nemo Bridge is accessible by road as well. Just be cautious driving at night: it’s rural and watch for deer. The best times are fall and winter for the clearest skies (and when humidity and haze are lower). Summer is lovely and warm, but occasional haze or clouds can affect transparency. Nonetheless, summer also brings out the core of the Milky Way. Obed staff often provide free hot chocolate on winter astronomy nights! <br/>🎫 <strong>Permits:</strong> No permits or fees for general use. Camping is very cheap ($10) at Rock Creek. The park rangers and volunteers are passionate about astronomy here – they even have loaner telescopes. During events, they’ll have green laser pointers showing constellations, etc. If you go on your own, simply pick a clear night and enjoy – you’ll likely have the whole dark river gorge to yourself, under a brilliant canopy of stars.</p>',

//   organpipe:
//     '<h2>Organ Pipe Cactus National Monument, Arizona</h2><p>Organ Pipe Cactus NM is a remote park on the U.S.-Mexico border, and it’s known for some of the most pristine night skies in the Southwest. In fact, it’s often cited as having the best stargazing in Arizona south of the Grand Canyon region. The monument is not yet IDA-certified as of earlier data, but it has extremely dark skies (Bortle ~2) and they actively promote night sky viewing. The landscape of tall organ pipe and saguaro cacti creates dramatic silhouettes against the starry heavens. Ideal spots include the <strong>Alamo Canyon</strong> area (a primitive campground with canyon walls and cacti – the park even notes it as great for night photography) and the <strong>Pinkley Peak Picnic Area</strong> which has convenience and open sky. Also, the roadside <strong>waysides along Highway 85</strong> (Tillotson & Diablo) are recommended stargazing pullouts. On a clear night, you’ll see the Milky Way stretching over vast desert wilderness, and possibly distant lights from Mexico very low on the horizon – but nothing to diminish the zenithal sky. Rangers lead occasional Night Sky talks in winter when weather is perfect.</p><p>📷 <a href="https://www.nps.gov/orpi">Official Organ Pipe NPS Site</a> – see “Stargazing at Organ Pipe” for suggested locations. <br/>🌙 <strong>Camping:</strong> The main Twin Peaks Campground is near the visitor center. It’s nicely designed with minimal lights (and has an amphitheater used for night programs). It’s a good spot but some light from the restrooms might be visible – however, just walking a short distance onto the Campground Perimeter Trail or Desert View Trail gets you into darkness. Alamo Canyon Campground, as mentioned, is much smaller and very dark, but tents only and high clearance vehicle recommended. If you want solitude under the stars, Alamo is fantastic. <br/>🏨 <strong>Lodging:</strong> No lodging in the monument. The nearest is in Ajo, AZ (~30 minutes north) which has a few motels. Ajo is small with limited light, but staying in the park is better. Some folks also camp or RV on BLM lands nearby if campgrounds are full. <br/>🚗 <strong>Accessibility:</strong> The park is open 24/7. Highway 85 runs through – a few cars or border patrol vehicles might pass at night, but generally very quiet. If stargazing near the highway or on pullouts, be safe and park out of the way. The Ajo Mountain Drive (21-mile scenic loop) can be done at night for different vantage points (Pinkley Peak picnic is along that drive). Note: illegal border crossings occur in this region, so the park advises sticking to near camp or main areas at night (chances of encounter are slim, but caution given). Winter nights are cool (40s°F), ideal for crisp skies. Summer nights are warm but the monsoon can bring clouds. Spring is both pleasant and generally clear. <br/>🎫 <strong>Permits:</strong> No permit needed for nighttime access or photography. Just your park entry fee. If venturing into backcountry or up trails in dark, let someone know – the desert is unforgiving if you get lost. But overall, Organ Pipe offers a safe and superb stargazing experience right from the road or campground. Enjoy the complete darkness and listen for coyotes yipping under starry skies – it’s a true Sonoran Desert night.</p>',

//   petrifiedforest:
//     '<h2>Petrified Forest National Park, Arizona</h2><p>Petrified Forest NP, known for its colorful fossilized wood and badlands, also has very dark skies – but with a catch: the park closes at night (no overnight stays except special events). It is an International Dark Sky Park, so efforts have been made to preserve its darkness. On a rare night opportunity (like a ranger-led Night Sky program or astronomy event), you can witness Bortle ~2-3 skies over the painted desert. The experience is surreal: ancient petrified logs and banded rock formations under the glow of the Milky Way. If you happen to be inside at night, <strong>Blue Mesa</strong> area or <strong>Jasper Forest</strong> are fantastic wide-open spots to set up a telescope or camera – the hoodoos and logs make eerie silhouettes. During certain scheduled events, they allow camping for astronomy groups. Otherwise, the best one can do is stargaze just outside the park boundaries at pullouts along US-180 or I-40 – even there, you’ll get a good sky because the region is sparsely populated.</p><p>📷 <a href="https://www.nps.gov/pefo">Official Petrified Forest NPS Site</a> – watch for any “Dark Sky” special events announcements. <br/>🌙 <strong>Camping:</strong> Normally, no public camping or lodging in the park. However, they do have a free backcountry permit for wilderness backpacking if you really want to stay overnight – you must hike at least a mile from a road. Backpacking out to somewhere like Red Basin or near the Black Forest could provide an incredible private stargazing experience among the formations (be prepared and experienced for this!). There are developed campgrounds in nearby communities (e.g., Holbrook, or Homolovi State Park in Winslow an hour away). <br/>🏨 <strong>Lodging:</strong> No lodge in park. Holbrook, AZ (20 miles) has many motels and is the usual base – but Holbrook has some light pollution. The ideal is if you can join a park-sanctioned night event, so you don’t have to leave. If not, perhaps stay at the Route 66 Motel and drive just out of town or to the park boundary at night to get darker sky. <br/>🚗 <strong>Accessibility:</strong> Petrified Forest’s gates currently close around 7pm (seasonally) – no visitors allowed inside after that unless on a guided program. If you do get the chance to be inside at night (volunteer or event), it’s magical. Otherwise, consider the area around Painted Desert Inn (north end) – even from just outside the fence, you’ll have good darkness to the south. Weather in northern AZ is generally clear; can be windy. At ~5500 ft elevation, nights can be a bit chilly year-round. Note: do not attempt to sneak in after hours – law enforcement does patrol, and the park is surrounded by reservation and ranch lands. Instead, coordinate with rangers who are often enthusiastic about night skies and host public telescope nights occasionally. <br/>🎫 <strong>Permits:</strong> For backpacking under the stars, get a permit at the visitor center by day (you’ll have to hike in before closing and stay until the park reopens in morning). For any other stargazing, no permit – just constraint of park hours. Petrified Forest’s badlands lit by starlight are a sight few get to see, but if you do, it’s an inspiring blend of deep time (ancient trees turned to stone) and the eternal cosmos above.</p>',

//   pipespring:
//     '<h2>Pipe Spring National Monument, Arizona</h2><p>Pipe Spring NM is a small historic site on the Arizona Strip, known for its pioneer fort and Kaibab Paiute history. Unexpectedly, it also has very dark skies (the Arizona Strip is largely empty and at ~5,000 ft elevation). It’s an International Dark Sky Park, and though the monument is tiny, the surrounding area offers Bortle ~2-3 darkness. The staff sometimes host “star parties” on the monument grounds. You can see the Milky Way clearly above the silhouette of the old Winsor Castle fort – a very cool juxtaposition. Because it’s near Grand Canyon–Parashant and other big dark areas, the sky quality is excellent. If you’re passing through at night (Highway 389) you can stop in the vicinity (monument itself closes at sunset) – even from the roadside you’ll get a broad view of the heavens. On a very clear night, zodiacal light and even hints of the Andromeda Galaxy naked-eye are possible.</p><p>📷 <a href="https://www.nps.gov/pisp">Official Pipe Spring NPS Site</a> – check for any special night programs. <br/>🌙 <strong>Camping:</strong> No campground at Pipe Spring. However, the adjacent Kaibab Paiute Reservation runs a campground/RV park (Kaibab Paiute Campground) very close by. Staying there would allow you to stargaze easily. Also, BLM lands near the monument can be used for dispersed camping (with usual Leave No Trace practices). The reservation sometimes holds public events for night sky as well, since they partnered in the dark sky efforts. <br/>🏨 <strong>Lodging:</strong> No lodging immediate. The nearest would be in Kanab, Utah (~20 min west) or Fredonia, AZ (~10 min west). Kanab has more lights than tiny Fredonia, but either is still fairly rural. If you really want to avoid any light, camping as above is best. But being such a small site, many just do an evening visit or drop by at an event. <br/>🚗 <strong>Accessibility:</strong> The monument grounds close by early evening normally. If you attend an event, you’ll have access after dark. Otherwise, the skies can be enjoyed from the surrounding area (which is wide open sagebrush and grassland). The highway has very little traffic at night. Weather is generally dry; summers warm at night, winters quite cold. This high desert can have crystal clear nights especially in fall. And since it’s far from big cities, you might feel like you have the whole sky to yourself. <br/>🎫 <strong>Permits:</strong> No permit needed for general stargazing. If you were doing any night photography on-site, you’d need to coordinate with rangers unless it’s during a public event. The monument is small enough that any presence is easy to detect. The park staff are enthusiastic about dark skies (they installed special lighting etc.), so they’re likely happy to have interested visitors come to star programs. Pipe Spring might not be a destination solely for stargazing, but if you’re in the area (perhaps en route to North Rim or Zion), it’s worth a stop to appreciate the serene night skies over this historic oasis.</p>',

//   saguaro:
//     '<h2>Saguaro National Park, Arizona</h2><p>Saguaro NP is unique among dark sky places – it’s right on the edge of a major city (Tucson) yet has been recognized as an Urban Night Sky Place for its efforts to preserve the night environment. So, while you won’t get a Milky Way as bright as in remote parks (skies are about Bortle 4-5 here), you will enjoy a remarkably starry sky for being so close to civilization, especially on the eastern Rincon Mountain District. In the Rincon (East) district, you can see the outline of thousands of giant saguaro cacti under the stars – a beautiful sight. <strong>Javelina Rocks pullout</strong> and the <strong>Desert Ecology Trail</strong> are known informal stargazing spots in the east unit, offering broad sky views with minimal immediate lights. In the Tucson Mountain (West) district, Gates Pass just outside the park is popular for night sky viewing, and within the park the <strong>Signal Hill picnic area</strong> (known for petroglyphs) is often used for star parties. The park periodically hosts “Star Parties” where local astronomers set up telescopes, taking advantage of Tucson’s very astronomy-friendly lighting ordinances. You might be surprised at how much you can see: on a moonless night, dozens of constellations and even the Milky Way’s core (faintly) are visible, framed by saguaro silhouettes.</p><p>📷 <a href="https://www.nps.gov/sagu">Official Saguaro NPS Site</a> – see news on the Urban Night Sky Place designation and any events. <br/>🌙 <strong>Camping:</strong> Saguaro NP has no drive-in campgrounds. It has a few backcountry campsites up in the Rincon Mountains for backpackers (e.g., Manning Camp) – those are high elevation and far from city lights, so actually extremely dark, but require an intense hike. Otherwise, camping options are outside the park (Gilbert Ray campground county park near west unit is a great one – very dark for being close to town). Catalina State Park north of Tucson is another with decent skies. <br/>🏨 <strong>Lodging:</strong> No lodges in Saguaro. Tucson, however, offers many hotels; if you stay on the east side of town or out towards Tanque Verde, you’ll have less urban light to contend with when driving into the park at night. Some dude ranches or B&Bs adjacent to the park tout stargazing as an activity too. In general, Tucson at night is relatively dim for a city (thanks to astronomy influence), but it’s still a city – so try to be at least a few miles out. <br/>🚗 <strong>Accessibility:</strong> Both districts of Saguaro NP are open to foot/bike 24/7, but vehicles only during certain hours (sunrise to sunset typically, in west; east has a gate open until 8pm or so). This complicates solo night visits. However, many people park outside and walk in, or attend official night events when gates remain open. The east loop drive being closed to cars at night actually can be nice – no headlights to worry about. Tucson’s climate means clear skies much of the year. Summers are hot even at night (80s°F), but winter nights can be a chilly 40°F – still, year-round stargazing is viable. Just be mindful of park hours or go with organized hikes (rangers sometimes lead Full Moon hikes or astronomy nights). Also, watch for rattlesnakes on warm nights – stick to trails or open areas. <br/>🎫 <strong>Permits:</strong> No special permit for night use on foot. If parking outside and walking in after hours, it’s allowed for stargazing (in east unit, many local astronomers do this). Just don’t block gates. The park being an Urban Night Sky Place is about balancing access and darkness, so they encourage responsible night use. If you get the chance, experiencing the desert under a starry sky – even with a faint city glow – is enchanting. The saguaros stand like silent guardians beneath the cosmos.</p>',

//   salinaspueblo:
//     '<h2>Salinas Pueblo Missions National Monument, New Mexico</h2><p>Salinas Pueblo Missions NM comprises three separate units preserving historic 17th-century Spanish mission ruins and earlier Pueblo sites – and all three units are in rural New Mexico with excellent night skies. It’s an International Dark Sky Park. Around the mission walls of Abo, Quarai, and Gran Quivira, you’ll find Bortle ~2 skies on moonless nights. The park often hosts “Starry Night” events, where locals come out to one of the mission sites for telescope viewing and constellation tours. The most remote unit, <strong>Gran Quivira</strong>, probably has the darkest sky – the Milky Way above the stark stone ruins there is jaw-dropping. <strong>Abo</strong> and <strong>Quarai</strong> also have great skies and perhaps more foreground (church walls) for photos. Quarai’s mission church silhouetted against the Milky Way has been a subject of astrophotographers. Typically, these sites are officially closed at night, but during special programs they open them. If you were to stargaze just outside the units (like from nearby roads), you’d still get an amazing view – central New Mexico has very little light pollution. Plus, this area is at 6-7000 ft elevation, giving clearer air.</p><p>📷 <a href="https://www.nps.gov/sapu">Official Salinas Pueblo Missions NPS Site</a> – check events for star parties. <br/>🌙 <strong>Camping:</strong> No camping or lodging within these monument units (day-use only). The nearest campgrounds or RV parks would be around Mountainair or in Cibola National Forest (there’s a campground at Red Canyon, Manzano Mountains). For true dark-sky camping, some people disperse camp on Forest roads not far from Gran Quivira. If attending an event, you’d likely just drive in for the evening. <br/>🏨 <strong>Lodging:</strong> A couple of small inns/B&Bs in Mountainair serve the area (Mountainair is central to all three units). Staying there keeps you close, and Mountainair itself is a tiny Dark Sky Community – lighting is minimal. So you could even do a bit of stargazing outside your lodging. For more options, one might stay in Socorro or Albuquerque and drive an hour+ (but then you’re around more light). <br/>🚗 <strong>Accessibility:</strong> By day these sites are easy to reach via paved or good roads. By night, unless an event is on, gates will be closed. But the highways or pullouts near each mission can give you essentially the same sky. If it’s an official star party, park staff will guide parking and setup – usually very family-friendly events. Weather: high desert can bring afternoon storms in summer but then clear at night. Spring and fall are excellent – crisp skies, not too cold. In winter, nights get cold but the stars are fantastic and sometimes you might even have snow on the missions with stars above. Always be mindful of the terrain – e.g., don’t wander into the ruins in the dark except on guided paths. <br/>🎫 <strong>Permits:</strong> No permit; just adhere to open hours or attend events. If you are an avid night photographer, you could inquire with the park about after-hours access for photography – they might allow it or arrange something, since they are proud of their dark sky status. But even from a fence line, you can capture plenty. Salinas Pueblo Missions offers a chance to combine cultural history with astronomy – the same stars shine now as they did when those missions were active centuries ago. It’s quite the experience.</p>',

//   timpanogos:
//     '<h2>Timpanogos Cave National Monument, Utah</h2><p>Timpanogos Cave NM is a small site in the mountains above American Fork, Utah – an unexpected place for stargazing given its proximity to urban areas. Yet, it was named an Urban Night Sky Place (like Saguaro) due to efforts to reduce light and educate the public. The monument’s cave and visitor center are in American Fork Canyon, which is somewhat shielded from the Salt Lake City/Provo metro glow by mountains. So, while the skies aren’t pitch black (Bortle ~5), you can still see major stars, planets, and some Milky Way on clear nights. The best spot is probably near the visitor center or trailhead parking after hours – the canyon walls block some city light and you can look upward at constellations framed by cliffs. The park has occasionally done “Night Sky” events, inviting visitors to see the stars after the daytime cave tours are done. Being up canyon also means darker skies than down in the city – the difference is noticeable. It’s a great opportunity for people in the metro to have a relatively dark sky experience within a short drive.</p><p>📷 <a href="https://www.nps.gov/tica">Official Timpanogos Cave NPS Site</a> – any night programs might be listed in their news or events. <br/>🌙 <strong>Camping:</strong> No camping at the monument. Uinta-Wasatch-Cache National Forest surrounds it though, and there are campgrounds in American Fork Canyon (e.g., Altamont, Timpooneke up the road). Those sites are at higher elevation and even farther from city lights, so potentially better for stars – though trees can partially cover the sky. Still, a tent night in the canyon with stars peeking through is lovely. <br/>🏨 <strong>Lodging:</strong> Stay down in the valley (plenty of hotels in Lehi/Highland/Provo). But being in the city means heavy light pollution – you’ll want to drive up the canyon for any serious stargazing. Fortunately, it’s only 15-30 minutes from those towns. If you really wanted, you could drive the Alpine Loop Road to higher viewpoints (outside the monument but nearby) for darker skies overlooking Utah Valley. <br/>🚗 <strong>Accessibility:</strong> The monument’s parking lot is right off UT-92 (the canyon road). Typically, the gates close in the evening (no entry after that), but people exiting after an event can still leave. If there’s a night event, rangers will handle it. Otherwise, you might pull off at a forest viewpoint slightly up or down canyon to stargaze. Keep in mind the canyon road can be busy with cars even at night, especially in summer (folks coming down from elsewhere). But late at night it quiets. The canyon is at about 5,000 feet at base, with peaks around blocking some sky near horizon. But overhead will be decent. Nights can be cool due to mountain breezes. <br/>🎫 <strong>Permits:</strong> No special permit, but outside of events the monument itself isn’t open at night. However, the concept of Urban Night Sky Place means they want to invite local communities to enjoy the sky – so watch for planned stargazing nights. American Fork Canyon requires a recreation pass (paid at a kiosk) if you’re recreating in the forest areas, even at night. If you’re just driving through or quickly stopping, it might not be enforced, but officially there’s a fee. Ultimately, Timpanogos Cave NM shows that even near cities, with a little effort, we can still connect with the night sky.</p>',

//   tonto:
//     '<h2>Tonto National Monument, Arizona</h2><p>Tonto NM, which preserves cliff dwellings in central Arizona, has quietly some very dark skies. It’s perched on a hillside above Theodore Roosevelt Lake, far from big cities (Phoenix is ~80 miles and over some mountains). As an International Dark Sky Park, Tonto enjoys around Bortle 2-3 conditions on moonless nights. The Milky Way gleams over the Sierra Ancha and Superstition ranges with the lake in the foreground. The monument sometimes hosts night sky events where they invite visitors to the picnic area after dark for telescope viewing. A great spot is the <strong>Lower Cliff Dwelling trail viewpoint</strong>; from the trail (closed at night normally) you’d have an incredible panorama of the sky above the ruin and lake. But even from near the visitor center or parking lot, you can see a broad expanse of stars since the monument area faces mostly wilderness and the lake (Roosevelt Lake has minimal development, just a few lights at the dam). If you’re lucky, you might see the lights of a boat on the lake as the only earthly illumination. It’s a serene and beautiful stargazing location often overlooked.</p><p>📷 <a href="https://www.nps.gov/tont">Official Tonto NPS Site</a> – see if they have “Star Party” announcements. <br/>🌙 <strong>Camping:</strong> No camping at Tonto NM itself. However, just down the road is Roosevelt Lake in Tonto National Forest, which has several campgrounds (e.g., Windy Hill, Grapevine). These campgrounds are actually great for night sky viewing too – open, by the water, and quite dark (just avoid being too near the few streetlights at marina entrances). So one could camp by the lake, then possibly attend a night event at the monument. <br/>🏨 <strong>Lodging:</strong> A couple of small motels or lodges exist in nearby communities like Tonto Basin or Punkin Center, but many visitors might day trip from Payson or Globe (each ~an hour away). If you can, staying closer (or camping) is better to avoid a late drive. <br/>🚗 <strong>Accessibility:</strong> The main challenge: the monument is typically closed after 5pm, so independent night access to the cliff dwelling area isn’t allowed. But the parking lot is just off the highway – one could potentially pull off along the highway or a nearby lakeside viewpoint to stargaze nearly in the same area. The region’s roads are paved and easy. Watch for wildlife (cows, deer) on the road after dark. Climate is warm desert; summer nights are pleasant (occasionally monsoon clouds though). Winter nights can be cool but generally above freezing. The sky is often very clear due to low humidity. <br/>🎫 <strong>Permits:</strong> No permit for stargazing, but to actually be on monument property at night you’d need to be at an official event or get permission. The staff has embraced dark skies, so it’s worth encouraging them by showing interest (they might even let a serious astrophotographer set up by arrangement). If you’re just in the area, plenty of nearby public lands to stargaze from. Tonto NM offers a combination of cultural intrigue by day and natural dark sky by night – truly a gem in the Sonoran desert region.</p>',

//   tumacacori:
//     '<h2>Tumacácori National Historical Park, Arizona</h2><p>Tumacácori NHP is another small park with a big sky. It preserves a beautiful 18th-century Spanish mission church in southern Arizona, and it was designated an International Dark Sky Park in 2018. Being about 45 miles south of Tucson, the skies here are quite dark – probably Bortle ~3 with some minor glow to the north. The mission church itself is a striking structure to photograph against the stars. On certain nights, the park has allowed night photography or hosted star parties, where they light the interior of the ruin softly and let the sky be the backdrop. When the Milky Way is positioned right, you can see it rising behind the old bell tower – a fantastic blend of history and cosmos. Even on a normal night outside the park, the Santa Cruz River Valley is dark and quiet. You might see the lights of Nogales on the horizon southward, but overhead you’ll still catch the Milky Way and many constellations. It’s quite special because you’re seeing essentially the same night sky (minus a bit of modern glow) that the mission residents saw centuries ago, before electricity.</p><p>📷 <a href="https://www.nps.gov/tuma">Official Tumacácori NPS Site</a> – look for any “Nightfall at Tumacácori” events or announcements. <br/>🌙 <strong>Camping:</strong> No camping in this park (it’s just the mission compound). However, there are campgrounds in nearby Coronado National Forest or RV parks in Rio Rico and Tubac. One option: the Anza Trail runs along the river by the mission; some folks have done special night hikes or overnight Anza Trail treks (but not typical). For most, you’d camp at Bog Springs in Madera Canyon or Patagonia Lake SP and then drive a bit. <br/>🏨 <strong>Lodging:</strong> The towns of Tubac and Green Valley to the north have hotels and B&Bs (Tubac is closer and smaller, with more emphasis on keeping things quaint – likely darker at night than Green Valley). South, Nogales also has hotels but more city lights. If you stay in Tubac, the sky is still pretty good – Tubac also has its own star gazing community. <br/>🚗 <strong>Accessibility:</strong> The park is just off I-19 and easy to find. Normally it’s closed at night. During special dark sky events, they might open it and even provide red-filtered lights or music. If you attend one, you can wander the mission grounds under starlight – a real treat. If not, you could view from the outside (through the fence) but it’s not the same. Better to find a turnout along a quiet road nearby to enjoy the sky. In winter they sometimes have night events coinciding with holidays (like Las Noches de Las Luminarias, where they light the place with candles – not dark sky related, but very atmospheric). Weather: this is about 3300 ft elevation, so a bit cooler than Tucson. Winters nights can be chilly in the 30s°F, summers warm in the 70s°F. Monsoon clouds in Jul-Aug. <br/>🎫 <strong>Permits:</strong> No special permit for the typical visitor; just come to events or contact the park if you’re a photographer who wants to attempt something – they might work with you given their dark sky status. Tumacácori’s dark sky designation shows that even a small historic park can contribute to preserving the night. If you get the chance to see the Baroque front of that old church under the stars, it’s a sight to remember – like a portal to the past under heavens unchanged.</p>',

//   vallescaldera:
//     '<h2>Valles Caldera National Preserve, New Mexico</h2><p>Valles Caldera is a massive volcanic caldera in the Jemez Mountains of New Mexico, and it’s an incredible spot for stargazing. Far from city lights (Los Alamos is not too far but is small and mostly shielded by terrain), the caldera offers Bortle class 1-2 skies on a good night. The preserve was designated an International Dark Sky Park in 2021. Picture a huge meadow (the Valle Grande) at 8,000+ feet elevation – you’re standing in this open expanse with 360° views of the sky. The Milky Way on a summer night stretches brightly across that meadow, and you might even see it reflect faintly in streams or ponds. Great stargazing spots include <strong>Valle Grande pullout</strong> (right near the main entrance with sweeping views) and <strong>Banco Bonito area</strong> (west side of the caldera, a bit more remote). The park hosts occasional night events where rangers bring out telescopes to observe galaxies and planets. Because the air is so clear and thin up here, star visibility is outstanding – many visitors are astonished by how “close” the stars feel. You can also try to catch zodiacal light and, at times, the International Space Station blazing overhead among billions of stars.</p><p>📷 <a href="https://www.nps.gov/vall">Official Valles Caldera NPS Site</a> – check for astronomy programs or gate info. <br/>🌙 <strong>Camping:</strong> Valles Caldera now allows limited backcountry car camping at a few designated primitive sites (permit required). If you can reserve one, it’s a fantastic way to spend the night under the stars. Otherwise, no developed campground yet. Many people camp just outside on Santa Fe National Forest land (there are campgrounds like San Antonio or Paliza nearby). If you’re at one of the forest campgrounds, you might have to drive a bit for truly open sky due to trees. Another approach: some astronomy clubs hold star parties in the caldera – joining one of those can let you overnight informally with them. <br/>🏨 <strong>Lodging:</strong> The nearest lodging is in Los Alamos (~30 min) or Jemez Springs (~45 min). Los Alamos dims lights at night somewhat (due to observatory on the hill), but still, in the caldera itself is far darker. Some small B&Bs around Jemez might advertise star views too. There’s also the Ridgeback Lodge near the caldera, which likely has nice dark skies on their property. <br/>🚗 <strong>Accessibility:</strong> The main preserve is gated after sunset normally. They often open the gates for scheduled events or if you have a camping permit. The pullouts along NM-4 (which runs by the Valle Grande) are always accessible – many people simply stop at the large Valle Grande overlook at night for stargazing on their own. It’s perfectly legal and a great vantage, just alongside a quiet highway. Bring warm clothing; even summer nights can drop to 40s°F here. At 8k feet altitude, there’s less oxygen – so you might notice the stars not twinkling as much (a good thing for clarity!) and also you might get winded walking around. But nothing too extreme. Watch for elk herds – they roam the valleys at night and you might hear their eerie calls during fall rut while you stargaze. <br/>🎫 <strong>Permits:</strong> No permit to stargaze from the roadside. If you want inside after dark, you’d need a special use permit or attend an event. The park’s dark sky status is new, so they’re developing more night opportunities. As an individual, if you want that experience now, the roadside viewpoint will do – or coordinating with the rangers if you’re an avid astro-photographer might be possible. The effort is absolutely worth it – Valles Caldera by day is grand, but by night, it is purely cosmic.</p>',

//   voyageurs:
//     '<h2>Voyageurs National Park, Minnesota</h2><p>Voyageurs NP is a water wonderland of lakes and boreal forests – and it’s also one of the best places in the northern U.S. to see dark skies and even the aurora borealis. As an International Dark Sky Park, Voyageurs has vast areas of Bortle 2 skies (with some light glow low from distant communities). In winter especially, the park regularly treats visitors to northern lights displays dancing across the sky. In summer, the Milky Way is spectacular, reflecting off the lakes like Rainy Lake or Kabetogama. Excellent stargazing spots include the <strong>Kabetogama Lake Visitor Center</strong> area (they often host Star Parties here) and the <strong>Ash River</strong> boat launch area – both have broad sky views to the north and south over water. If you’re kayaking or houseboating, you can just drift under starry skies in the middle of a lake – talk about immersive! Voyageurs also has a designated Dark Sky viewing area at the Beaver Pond Overlook on the Kab-Ash trail, which is easily accessible and offers a nice clearing for sky watching. On clear nights, you’ll see the Milky Way, and maybe hear loons calling in the darkness – a quintessential North Woods stargazing experience.</p><p>📷 <a href="https://www.nps.gov/voya">Official Voyageurs NPS Site</a> – check for their summer astronomy programs and aurora alerts. <br/>🌙 <strong>Camping:</strong> Voyageurs is mostly accessed by boat, and campsites are primarily boat-in. If you have a canoe or boat and camp on a secluded island, you’ll have zero light pollution – just you and the stars. There are some front-country campsites at the edges (like near Ash River) that you can hike to. Also, Woodenfrog State Forest campground on Kabetogama Lake is a drive-in option just outside the park that’s popular with stargazers – they even host events there sometimes. Reservations for park campsites via recreation.gov can secure you a spot on a lake (don’t forget your star map!). <br/>🏨 <strong>Lodging:</strong> No lodges operated by NPS, but there are private resorts and houseboat rentals in and around the park (e.g., on Crane Lake, Kabetogama, Rainy Lake). Many of these are far from big towns, so they maintain dark skies. Some resorts might keep some lights on for safety, but usually not too bad. International Falls is the largest town nearby, and if you stay there you’ll want to drive into the park at night (as Int’l Falls has more lighting). <br/>🚗 <strong>Accessibility:</strong> The main road-accessible areas (Rainy Lake VC, Kabetogama VC, Ash River) are all good night spots and open even when visitor centers are closed. No gates to worry about, you can park and stargaze. Winters are extremely cold (but offer the best aurora and star viewing if you’re brave – minus 30°F nights happen!). Summer has mild nights but occasionally mosquitoes – though on breezy open areas by lakes, bugs are less of an issue. The park does have short nights in midsummer (being so far north, it might not get truly dark until almost midnight). Fall is a sweet spot: long nights, still decent temperatures, and aurora activity often picks up. Keep an ear to weather – clouds or fog can come off the lakes. <br/>🎫 <strong>Permits:</strong> No permit needed for casual stargazing. If you go out on water at night, ensure you have proper lighting on your boat as per regulations (and know how to navigate!). Also, always wear a lifejacket if paddling in dark. The park staff are enthusiastic about their dark skies – they even have an astronomy ranger on staff some seasons. So definitely take advantage of any guided night hikes or telescope nights. Whether it’s watching the Milky Way mirrored on a calm lake or seeing green aurora curtains ripple above, Voyageurs offers a night sky adventure you won’t forget.</p>',

//   yellowstone:
//     '<h2>Yellowstone National Park, Wyoming/Montana/Idaho</h2><p>Yellowstone, with its immense size and high plateau, has many areas of very dark sky – though a few developed spots (like around Old Faithful or Mammoth) add some light. In general, away from the lodges, you can find Bortle 1-2 skies, especially in the southern and central parts of the park. The stars over Yellowstone’s geothermal features are a surreal sight: imagine the Milky Way stretching above steaming hot springs at Midway Geyser Basin, or above the silhouette of Castle Geyser during an eruption. Popular stargazing locales include <strong>Old Faithful area</strong> (after the crowds leave – the geyser basin under starlight is wonderful), <strong>Lamar Valley</strong> (no lights for miles, plus you might hear wolves howling), and <strong>Yellowstone Lake shoreline</strong> (open horizon, great reflections of stars in the water). The park doesn’t have an official dark sky designation, but it does host astronomy programs on occasion. Due to high elevation (7,000-8,000 ft on average) and clear air, the night sky is very vivid. You might even catch an aurora low on the northern horizon if solar activity is high. On moonless nights, the galaxy seems to pour out of the sky over Yellowstone’s forests and mountains.</p><p>📷 <a href="https://www.nps.gov/yell">Official Yellowstone NPS Site</a> – not heavily focused on astronomy, but check visitor center bulletin boards for any ranger-led star talks. <br/>🌙 <strong>Camping:</strong> Tons of options – Yellowstone has many campgrounds. For best stargazing, choose ones away from lodges: e.g., Pebble Creek or Slough Creek (in Lamar area, extremely dark), or Lewis Lake (south, also very dark). Mammoth and Canyon campgrounds are a bit near facilities but still okay if you walk a short distance out. Backcountry camping is stellar too – just you and the stars (get a permit). Do remember wildlife safety – keep food secured, you might see bison wandering at night near camps. Also it gets cold at night, even in summer at 8000 ft. <br/>🏨 <strong>Lodging:</strong> If you prefer lodges, consider those like Lake Hotel or Canyon Lodge. They do have lights, but not excessive – if you walk to the lakeshore by Lake Hotel, you can stargaze nicely. Old Faithful area lodging is illuminated, but again, a short walk to e.g. Geyser Hill and it’s much darker. Outside the park, the gateway towns (West Yellowstone, etc.) have more lighting, so staying inside is better for star enthusiasts. Some lodges (like Roosevelt cabins) have minimal electricity and are quite dark at night. <br/>🚗 <strong>Accessibility:</strong> Roads are open 24/7 (except seasonally closed ones in winter). It’s perfectly fine to drive at night – in fact, it’s often deserted. But do be extremely alert for animals on the road: bison, elk, even bears. Drive slow because hitting a bison would wreck your car (and the bison). The upside is you can pull off at a safe turnout anywhere and enjoy the sky – just don’t venture too far if you don’t have bear spray and a light. Some favorite easy accesses: Fountain Paint Pot parking (walk a bit onto boardwalk among glowing thermal features and stars), Lamar Valley pullouts, Hayden Valley overlook. Weather can change – summer nights might get sudden thunderstorms rolling in, but often they clear out. Winter nights are long and brutally cold, but the stars over snowy landscapes or geysers are incredible (and you might have them all to yourself). <br/>🎫 <strong>Permits:</strong> No permit needed for night use aside from normal entrance fee. If you set up telescopes in popular areas after dark, no one will mind as long as you’re safe. In recent years, interest in Yellowstone’s night skies has grown, so you might encounter other astronomers at, say, Artist Point doing Milky Way photos. All in all, Yellowstone by night offers a primeval darkness and an immense dome of stars – fitting for a place known as one of the Earth’s wildest spots.</p>',

//   yosemite:
//     '<h2>Yosemite National Park, California</h2><p>Yosemite’s iconic cliffs and peaks don’t disappear at night – they become magnificent silhouettes beneath the starry sky.</p><p> While parts of Yosemite Valley have some light from lodges, much of the park has very dark skies (Bortle 2 in high country). On a clear summer night at Glacier Point or Tuolumne Meadows, the Milky Way splashes across the sky brilliantly.</p><h3>Popular stargazing spots</h3><p><ol><li><strong>Glacier Point</strong> – a famous viewpoint where rangers often hold an evening star program; you can see the Milky Way arch above Half Dome and the valley far below.</li><li> <strong>Tuolumne Meadows</strong> – at 8600 feet, wide open and away from lights, it offers an incredible bowl of sky (many climbers bivy here and are amazed by the star density). </li><li><strong>Olmsted Point</strong> is also great, with views towards Tenaya Lake and very low light pollution. </li><li>In Yosemite Valley, <strong>Curry Village Meadow</strong> or <strong>El Capitan Meadow</strong> can be nice after midnight when most lights are off – you’ll see stars between the towering valley walls and maybe climbers’ headlamps on El Capitan like tiny stars of their own.</ol><p> Yosemite also hosts an annual astronomy event with SF Amateur Astronomers at Glacier Point. Because Yosemite’s air is generally dry (especially in late summer) and you have high elevations, the night sky is crisp. Expect to see thousands of stars, and if you’re lucky, perhaps the Andromeda Galaxy and some satellite flares. And on nights with a bright moon, the park’s waterfalls create “moonbows” – rainbows by moonlight – which, while reducing star visibility, are a unique sight.</p><p>📷 <a href="https://www.nps.gov/yose">Official Yosemite NPS Site</a> – check the “Plan Your Visit” calendar for any stargazing talks. </p><h3>🌙 Camping</h3><p> Many campgrounds. For stargazing, those at higher elevation or more open areas are better: Tuolumne Meadows Campground (when open, superb sky but it’s huge and busy), Porcupine Flat or Tamarack Flat (no lights, fairly high altitude), even Wawona Campground is decent. Valley campgrounds (North Pines, etc.) are under trees – not ideal for sky, but you can walk to meadows. Reservations are often needed far in advance. </p><h3>🏨 Lodging</h3><p> The Ahwahnee and Yosemite Valley Lodge have quite a bit of ambient light around (for safety). Try to get a room with a view and then go to a meadow for stars.</p><p> Glacier Point has no lodging except a summer tent camp, but staying there is not possible by car at night unless camping at Bridalveil Creek Campground (on Glacier Point Road) or doing the astronomy program which allows late departure.</p><p> Outside the park, Lee Vining or Groveland are small towns with some lodging – their lights won’t affect Yosemite’s sky much, but you’d then have to drive into park at night (long drive). If you can, lodging in park or camping gives you more nighttime flexibility. </p><h3>🚗 Access</h3><p> Glacier Point Road (where Glacier Point is) is typically open late spring to fall, and at night you can drive up – it’s a popular thing to do. Just be careful driving back down in the dark (steep drop-offs).</p><p> Tioga Road (through Tuolumne) likewise open in summer; lots of pulloffs to stop.</p><p>The valley is open 24/7; driving at night is peaceful, but watch for deer and even the occasional bear on roads.</p><p>There are no gates except park entrances (which are not staffed late but open).</p><p>Summer nights can be pleasant (50-60°F), but high country gets colder. Always bring a jacket. </p><h3>Light pollution sources</h3><p>A slight skyglow to west from Fresno if up on Glacier Point looking that way, but it’s minor.</p><p>Eastern horizon from Tioga might faintly show Carson City lights. But overhead and rest is dark.</p><p> Yosemite occasionally has smoke from wildfires mid-late summer, which can impact sky clarity – something to keep in mind. </p> <h3>🎫 Permits</h3><p> No permits needed for night stargazing. Just your entry fee.</p><p> If you set up expensive astronomy equipment in a busy spot, just keep an eye on it – but generally, folks in Yosemite are friendly and curious. In fact, you may become the center of an impromptu star party if you have a telescope! It’s a great way to meet people.</p><p> Above all, be safe near viewpoints (don’t wander off cliffs in the dark). With that, you’re set to enjoy Yosemite’s heavens – a perfect complement to its daytime grandeur.</p>',
// };

export const SPECIAL_LOCATION_DESCRIPTIONS: Record<string, string> = {
  yellowstone: `
    <h2>Yellowstone National Park</h2>
    <p>Yellowstone is a stargazer’s paradise, with vast swaths of Bortle 1–2 skies that rank among the darkest in the continental U.S. The park’s remote high plateaus, geothermal basins, and mirror-like lakes create otherworldly foregrounds for Milky Way photography.</p>
    <p>Light pollution is almost nonexistent in the park’s central and southern reaches, but faint glows can be seen toward Gardiner, West Yellowstone, and Cody on the horizons. Wildlife such as bison, elk, and wolves roam freely, making night travel here exhilarating but requiring caution.</p>
    <p>The Milky Way core is best viewed here from late May to early September, with the Galactic Center reaching its highest point in the sky around midnight in July. Autumn brings crystal-clear air, fewer visitors, and more hours of true darkness.</p>

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
};
