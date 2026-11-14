// Educational copy for ages 12–17; verify against NASA sources before publish.

/** GLB mesh names from mer-opportunity-static.glb */
export const PART_MAP = {
  pancam: [],
  arm: [],
  wheels: ["Cube.000"],
  solarDeck: ["panels_right_front"],
  antenna: [],
  body: ["Silver"],
};

export const MISSION_SOURCES = [
  {
    code: "001",
    label: "NASA Science — MER Opportunity",
    url: "https://science.nasa.gov/mission/mer-opportunity/",
  },
  {
    code: "002",
    label: "NASA — Opportunity mission conclusion",
    url: "https://www.nasa.gov/news-release/nasas-record-setting-opportunity-rover-mission-on-mars-comes-to-end/",
  },
  {
    code: "003",
    label: "NASA Science — Mars Exploration Rovers archive",
    url: "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/",
  },
  {
    code: "004",
    label: "NASA Science — MER Spirit",
    url: "https://science.nasa.gov/mission/mer-spirit/",
  },
];

const sections = [
  {
    id: "introduction",
    chapter: "01",
    title: "90 DAYS. 14 YEARS. ONE INCREDIBLE ROVER.",
    kicker: "Mission opening",
    cameraTarget: "fullRover",
    paragraphs: [
      "Opportunity landed on Mars in January 2004. NASA planned a 90-{{sol}} mission (about 90 Earth days): land safely, drive a short distance, and read the {{geology}} like a field notebook. Each {{sol}} is about 40 minutes longer than an Earth day.",
      "Its twin rover, Spirit, had landed three weeks earlier on the other side of Mars. Both were part of the same Mars Exploration Rovers project—two scouts, two stories.",
      "The rover bounced inside {{eagleCrater}}, unfolded, and sent home proof that {{meridianiPlanum}} held a different past than today’s dusty plains.",
      "That “90-day” ticket turned into more than 14 years, 45.16 km of driving, and 217,000+ images—about 60 times longer than designed. Opportunity is about the size of a golf cart; its name came from a school essay contest won by a 9-year-old. It also survived a huge planet-wide dust storm in 2007—years before the even darker storm of 2018.",
    ],
    telemetry: [
      { label: "Planned mission", value: "90", unit: "SOLS" },
      { label: "Distance traveled", value: "45.16", unit: "KM" },
      { label: "Images returned", value: "217,000+", unit: "" },
      { label: "Last contact", value: "10 JUN 2018", unit: "" },
    ],
    image: {
      src: "/opportunity/06-eagle-crater.jpg",
      caption: "Eagle Crater landing site.",
      credit: "NASA / JPL-Caltech",
    },
    sources: [{ code: "001" }, { code: "002" }, { code: "004" }],
  },
  {
    id: "cameras",
    chapter: "02",
    title: "EYES ON ANOTHER WORLD.",
    kicker: "Panoramic & navigation cameras",
    cameraTarget: "cameraMast",
    paragraphs: [
      "Opportunity’s tallest feature is its camera mast. The {{pancam}} sits up high so the rover can see farther and build wide, color views of the landscape.",
      "Pancam used multiple {{filter}}s—like science-grade sunglasses—so teams on Earth could combine images into true-color {{mosaic}}s and spot interesting rocks.",
      "Lower on the body, {{navcam}} cameras helped the rover plan drives and avoid obstacles while engineers on Earth reviewed the route.",
    ],
    image: {
      src: "/opportunity/08b-camera-eyes.jpg",
      caption: "Pancam and Navcam lenses on a MER-style mast (MER illustration).",
      credit: "NASA / JPL-Caltech",
    },
    sources: [{ code: "001" }, { code: "003" }],
  },
  {
    id: "solar-panels",
    chapter: "03",
    title: "POWER FROM A Distant SUN.",
    kicker: "Solar arrays",
    cameraTarget: "solarPanels",
    paragraphs: [
      "Mars is farther from the Sun than Earth, so each square meter of sunlight is weaker. Opportunity’s {{solarPanel}}s converted that light into electricity and charged batteries for night work.",
      "Martian nights are brutally cold. Heaters kept critical electronics warm enough to survive until sunrise.",
      "Dust slowly coated the panels over time, which is one reason older rovers lose power—but wind sometimes blew dust off and gave a temporary boost. Even on “clear” days, power was never guaranteed.",
    ],
    image: {
      src: "/opportunity/07b-solar-panels.jpg",
      caption: "Solar panels on the MER rover.",
      credit: "NASA / JPL-Caltech",
    },
    imageAfterParagraph: 0,
    sources: [{ code: "001" }],
  },
  {
    id: "antenna",
    chapter: "04",
    title: "A PHONE LINE TO EARTH.",
    kicker: "Antennas",
    cameraTarget: "antenna",
    paragraphs: [
      "Opportunity's most important tool might be the one that never studied a single rock. Every photo and measurement got home through its antennas.",
      "On the rover's deck sits the {{highGainAntenna}}, a flat, round disc on a mount that can swivel. It aims a narrow radio beam straight at Earth, like a flashlight instead of a lamp, so the signal can travel across space.",
      "Next to it, the thick silver mast is the {{lowGainAntenna}}. It sends in all directions, so it never needs to be aimed, but it is slower. A third antenna, {{uhf}}, talked to {{orbiter}} circling Mars, which relayed most of the data to Earth much faster.",
      "A signal takes roughly 3 to 22 minutes to cross between Mars and Earth, so nobody could drive the rover live. The team sent a plan each day, and Opportunity carried it out alone.",
    ],
    image: {
      src: "/images/9b-antenna.jpg",
      caption: "High-gain dish and communications hardware on a MER rover.",
      credit: "NASA / JPL-Caltech",
    },
    imageAfterParagraph: 1,
    sources: [{ code: "001" }, { code: "003" }],
  },
  {
    id: "wheels",
    chapter: "05",
    title: "SIX WHEELS, NO ROADS.",
    kicker: "Mobility",
    cameraTarget: "wheelAssembly",
    paragraphs: [
      "Opportunity drives on six wheels with a {{rockerBogie}} suspension. The design keeps all wheels on the ground while climbing rocks—critical when there are no paved paths.",
      "Wheel tracks in the {{regolith}} became science data too: they showed how fine Martian dust behaves when compressed.",
      "Every drive was planned from Earth using photos from the previous day—slow, careful steps across an alien desert.",
    ],
    image: {
      src: "/opportunity/08-wheels.jpg",
      caption: "Wheel and suspension hardware.",
      credit: "NASA / JPL-Caltech",
    },
    sources: [{ code: "001" }, { code: "003" }],
  },
  {
    id: "robotic-arm",
    chapter: "06",
    title: "HANDS FOR ROCKS.",
    kicker: "Instrument deployment device",
    cameraTarget: "roboticArm",
    paragraphs: [
      "Opportunity’s robotic arm placed tools against rocks and soil. Instruments like the {{rockAbrasionTool}} (RAT) could grind away dusty crust to see fresh minerals inside.",
      "Other tools measured composition and microscopic texture—how a geologist uses a hand lens and chisel, but remotely from Earth.",
      "Each measurement took patience: the arm moved slowly, held perfectly still, and sent results home for scientists to debate.",
    ],
    image: {
      src: "/opportunity/09-arm-tool.jpg",
      caption: "Robotic arm and tools.",
      credit: "NASA / JPL-Caltech",
    },
    sources: [{ code: "001" }, { code: "003" }],
  },
  {
    id: "ancient-water",
    chapter: "07",
    title: "WAIT… MARS HAD WATER?",
    kicker: "Water evidence",
    cameraTarget: "rockEnvironment",
    paragraphs: [
      "Opportunity’s first big discovery was {{mineral}}s that usually form in water—especially in {{acidic}} conditions—and layered {{bedrock}} that may have been laid down in a shallow, salty sea.",
      "Round “blueberries” made of {{hematite}} and {{sulfate}}-rich rocks supported the idea that liquid water once soaked this region. The tiny round {{spherules}} are scattered across the ground like berries; in true-color photos they look grayish, and some enhanced images make them look bluish—that is why scientists gave them the nickname. That does not mean rivers flow there today.",
      "NASA photos below show real outcrops from the landing region—evidence that {{meridianiPlanum}} may have been wetter long ago.",
    ],
    image: {
      src: "/opportunity/11-blueberries.jpg",
      caption: "Hematite-rich spherules (“blueberries”).",
      credit: "NASA / JPL-Caltech / Cornell",
    },
    scenePhoto: {
      src: "/opportunity/12-water-evidence.jpg",
      caption: "Layered bedrock in Endurance Crater.",
      credit: "NASA / JPL-Caltech",
    },
    sources: [{ code: "001" }, { code: "003" }],
  },
  {
    id: "journey",
    chapter: "08",
    title: "45 KILOMETERS ACROSS AN ALIEN PLANET.",
    kicker: "Traverse & craters",
    cameraTarget: "fullRover",
    paragraphs: [
      "After Eagle Crater, Opportunity crossed {{meridianiPlanum}} and reached {{endeavourCrater}}—a much larger bowl with older rocks that tell an earlier chapter of Martian history.",
      "Its last major study area was {{perseveranceValley}}, cutting the rim of Endeavour. Teams debated whether water, wind, or dry flows carved it—exactly the kind of puzzle rovers are built to investigate.",
      "Official {{traverse}} maps with precise coordinates live in NASA archives; this experience uses a wide rover view while you read—not a survey-grade animated path.",
    ],
    image: {
      src: "/opportunity/13-tracks.jpg",
      caption: "Tracks across Martian soil.",
      credit: "NASA / JPL-Caltech",
    },
    routeNote:
      "Illustrative overview · see NASA MER traverse maps for official coordinates",
    sources: [{ code: "001" }, { code: "003" }],
  },
  {
    id: "dust-storm",
    chapter: "09",
    title: "THE DAY MARS WENT SILENT.",
    kicker: "End of mission",
    cameraTarget: "wideMarsView",
    sceneEffect: "dust",
    paragraphs: [
      "In June 2018 a planet-wide {{dustStorm}} darkened the sky. Dust coated solar panels, and sunlight dropped below what Opportunity needed to recharge.",
      "NASA sent more than 1,000 recovery commands. The last signal arrived on June 10, 2018. After eight months of listening, the mission was declared complete on February 13, 2019.",
      "After the storm, engineers kept sending commands through the {{highGainAntenna}} and listening for any reply—hoping a gust might clean the panels just enough for one more beep home.",
      "Poetically, many people imagine the rover growing quiet as the sky darkened—no explosions, just a slow loss of power in the storm. That mood is an interpretation, not a transcript of what the hardware “said.”",
    ],
    image: {
      src: "/opportunity/14-dust-storm.jpg",
      caption: "Global dust storm in 2018.",
      credit: "NASA / JPL-Caltech / MSSS",
    },
    sources: [{ code: "002" }],
  },
  {
    id: "legacy",
    chapter: "10",
    title: "THE MISSION ENDED. THE DISCOVERIES DIDN'T.",
    kicker: "Legacy",
    cameraTarget: "fullRover",
    paragraphs: [
      "Opportunity proved that a mobile lab could rewrite planetary science from the surface. Its water-related findings helped set the stage for later missions hunting signs of ancient life.",
      "Spirit and Opportunity together showed that two rovers could work on opposite sides of the same planet—Spirit in {{gusevCrater}}, Opportunity in Meridiani—each rewriting what we thought Mars was like.",
      "Engineers learned to drive farther, survive dustier seasons, and stretch hardware years beyond warranty—lessons Curiosity and Perseverance use today.",
      "All of Opportunity’s data remain in NASA archives for new questions, classroom projects, and future explorers.",
    ],
    image: {
      src: "/opportunity/16-legacy.jpg",
      caption: "Opportunity’s shadow on Mars.",
      credit: "NASA / JPL-Caltech",
    },
    reflectionPrompt:
      "If you could send one scientific instrument to Mars, what would you want to discover?",
    sources: [{ code: "001" }, { code: "002" }, { code: "003" }, { code: "004" }],
  },
];

export default sections;
