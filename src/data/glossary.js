/** Plain-language definitions for Mission Archive (ages ~12–17). Keys match {{key}} in copy. */
export const GLOSSARY = {
  sol: {
    label: "sol",
    definition:
      "A Martian day. One sol is about 24 hours and 40 minutes—roughly 40 minutes longer than an Earth day.",
  },
  meridianiPlanum: {
    label: "Meridiani Planum",
    definition:
      "A flat, dusty plain near Mars’s equator where Opportunity landed and spent its early years exploring.",
  },
  endeavourCrater: {
    label: "Endeavour Crater",
    definition:
      "A wide, ancient impact crater Opportunity reached after years of driving. Its rim holds older rock layers than the landing site.",
  },
  pancam: {
    label: "Pancam",
    definition:
      "The Panoramic Camera on the rover’s mast. It took wide, color views of the landscape using several filters.",
  },
  navcam: {
    label: "Navcam",
    definition:
      "Navigation cameras on the rover body. They helped planners see obstacles and choose safe driving routes.",
  },
  highGainAntenna: {
    label: "high-gain antenna",
    definition:
      "A dish-shaped antenna that can point a tight radio beam at Earth for faster, clearer communication.",
  },
  lowGainAntenna: {
    label: "low-gain antenna",
    definition:
      "A simpler antenna that sends radio signals in many directions. It is slower but easier to use when precise pointing is hard.",
  },
  uhf: {
    label: "UHF",
    definition:
      "Ultra-high-frequency radio used for short-range chats with orbiters flying over the rover.",
  },
  orbiter: {
    label: "orbiter",
    definition:
      "A spacecraft circling Mars. Orbiters often relay rover data to Earth much faster than the rover can transmit alone.",
  },
  rockerBogie: {
    label: "rocker-bogie",
    definition:
      "The rover’s suspension system. It lets each wheel move up and down so all six wheels stay on the ground on rough terrain.",
  },
  regolith: {
    label: "regolith",
    definition:
      "Loose material on the surface—dust, sand, and broken rock—not solid bedrock underneath.",
  },
  rockAbrasionTool: {
    label: "Rock Abrasion Tool",
    definition:
      "A grinder on the robotic arm (nicknamed RAT). It scraped away dusty outer layers so instruments could study fresh rock.",
  },
  hematite: {
    label: "hematite",
    definition:
      "An iron-rich mineral that often forms in water. Finding it in Martian rocks was a clue that water was once present.",
  },
  spherules: {
    label: "spherules",
    definition:
      "Tiny round grains of rock, often only a few millimeters wide. Opportunity found many near its landing site.",
  },
  sulfate: {
    label: "sulfate",
    definition:
      "A type of mineral salt that can form when water evaporates, leaving dissolved chemicals behind.",
  },
  geology: {
    label: "geology",
    definition:
      "The science of rocks, soil, and how a planet’s surface formed and changed over time.",
  },
  eagleCrater: {
    label: "Eagle Crater",
    definition:
      "The small impact crater where Opportunity bounced to a stop and began its mission in January 2004.",
  },
  bedrock: {
    label: "bedrock",
    definition:
      "Solid rock that lies under loose dust and soil. Layered bedrock can record how the ground was built.",
  },
  mineral: {
    label: "mineral",
    definition:
      "A natural solid with a specific chemical recipe. Scientists read minerals to learn how a rock formed.",
  },
  acidic: {
    label: "acidic",
    definition:
      "A chemical condition like vinegar or lemon juice. Some Martian minerals form in acidic water.",
  },
  mosaic: {
    label: "mosaic",
    definition:
      "A wide picture built by stitching many smaller photos together, the way Pancam mapped the landscape.",
  },
  filter: {
    label: "filter",
    definition:
      "A colored window in front of a camera. Different filters let scientists see minerals that plain color misses.",
  },
  solarPanel: {
    label: "solar panel",
    definition:
      "A flat wing that turns sunlight into electricity. Opportunity used solar panels to charge its batteries.",
  },
  dustStorm: {
    label: "dust storm",
    definition:
      "A windstorm that lifts fine Martian dust into the sky and can block sunlight for weeks or months.",
  },
  gusevCrater: {
    label: "Gusev Crater",
    definition:
      "The large crater on the other side of Mars where Opportunity’s twin rover, Spirit, landed and worked.",
  },
  perseveranceValley: {
    label: "Perseverance Valley",
    definition:
      "A shallow channel cut into the rim of Endeavour Crater. It was Opportunity’s last major study area.",
  },
  traverse: {
    label: "traverse",
    definition:
      "The path a rover actually drives across the surface, measured and mapped by the mission team.",
  },
};

export function glossaryEntry(key) {
  return GLOSSARY[key] ?? null;
}
