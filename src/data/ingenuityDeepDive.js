// Ingenuity (Ginny) mission archive — Read more panel + 3D camera chapters.

export const MISSION_SOURCES = [
  {
    code: "001",
    label: "NASA Science — Ingenuity Mars Helicopter",
    url: "https://science.nasa.gov/mission/ingenuity/",
  },
  {
    code: "002",
    label: "NASA — Ingenuity mission concludes",
    url: "https://www.nasa.gov/news-release/nasas-ingenuity-mars-helicopter-mission-ends/",
  },
  {
    code: "003",
    label: "NASA — Mars Helicopter technology",
    url: "https://mars.nasa.gov/technology/helicopter/",
  },
  {
    code: "004",
    label: "NASA JPL — Ingenuity fact sheet",
    url: "https://www.jpl.nasa.gov/news/factsheets/mars-helicopter-ingenuity/",
  },
];

const sections = [
  {
    id: "introduction",
    chapter: "01",
    title: "5 FLIGHTS PLANNED. 72 FLIGHTS DONE.",
    kicker: "Introduction",
    cameraTarget: "fullHeli",
    paragraphs: [
      "Ingenuity launched on July 30, 2020, and landed in Jezero Crater on February 18, 2021. It rode to Mars attached to the belly of the Perseverance rover. It was built as a technology demonstration: up to five test flights over 30 days, to answer one question. Can an aircraft fly on another planet?",
      "On April 19, 2021, the answer was yes. Ingenuity completed the first powered, controlled flight on another world, a moment NASA calls a \"Wright Brothers moment.\" Then it kept flying for almost three years. Its nickname is Ginny, and, like Perseverance, its name was chosen by students in an essay contest.",
    ],
    telemetry: [
      { label: "Planned flights", value: "5", unit: "" },
      { label: "Flights completed", value: "72", unit: "" },
      { label: "Flight time", value: "128.8", unit: "MIN" },
      { label: "Distance flown", value: "17.0", unit: "KM" },
      { label: "Mission completed", value: "25 JAN 2024", unit: "" },
    ],
    image: {
      src: "/ingenuity/02b-under-perseverance.jpg",
      caption: "Ingenuity extends into place under Perseverance, March 29, 2021",
      credit: "NASA/JPL-Caltech/MSSS",
    },
    sources: [{ code: "001" }, { code: "002" }, { code: "003" }],
  },
  {
    id: "blades",
    chapter: "02",
    title: "BLADES FOR AIR THAT'S ALMOST NOT THERE.",
    kicker: "Rotor blades",
    cameraTarget: "rotors",
    paragraphs: [
      "Ingenuity has four carbon-fiber blades arranged in two counter-rotating rotors. Each rotor is 4 feet (1.2 meters) across, and they spin at about 2,400 rpm. That speed is needed because the Martian atmosphere is less than 1% as dense as Earth's, so each blade has very little air to push against.",
    ],
    image: {
      src: "/ingenuity/03b-blades.jpg",
      caption: "Ingenuity's two rotors",
      credit: "NASA/JPL-Caltech",
    },
    sources: [{ code: "001" }, { code: "003" }],
  },
  {
    id: "solar-battery",
    chapter: "03",
    title: "A TINY POWER PLANT ON TOP.",
    kicker: "Solar panel and batteries",
    cameraTarget: "solar",
    paragraphs: [
      "A solar array sits above the rotors and recharges Ingenuity's system of six lithium-ion batteries every day. Its cells are optimized for the sunlight that reaches Mars. The stored energy powers the heaters through nights as cold as -90 °C (-130 °F), and it powers the flights. A flight of up to 90 seconds uses about 350 watts. That is why Ginny flew briefly and then rested to recharge.",
    ],
    image: {
      src: "/ingenuity/03c-solar-panel.jpg",
      caption: "The solar array above the rotors",
      credit: "NASA/JPL-Caltech",
    },
    sources: [{ code: "003" }, { code: "004" }],
  },
  {
    id: "antenna",
    chapter: "04",
    title: "A RELAY CHAIN ACROSS A PLANET.",
    kicker: "Antennas and communication",
    cameraTarget: "antenna",
    paragraphs: [
      "Ingenuity could not call Earth directly. It talked to a base station on Perseverance over a UHF radio link (900 MHz) that works up to 1,000 meters away. Commands traveled from Earth's Deep Space Network to Perseverance, directly or through Mars orbiters, and then on to the helicopter. Data came back the same way.",
      "This relay explains the last flight. On January 18, 2024, Ingenuity lost contact with the rover when it was about 1 meter above the surface.",
    ],
    image: {
      src: "/ingenuity/03-anatomy.jpg",
      caption: "Ingenuity's communications hardware",
      credit: "NASA/JPL-Caltech",
    },
    sources: [{ code: "002" }, { code: "003" }],
  },
  {
    id: "brain-sensors",
    chapter: "05",
    title: "A TISSUE-BOX-SIZED BRAIN.",
    kicker: "Avionics, sensors and cameras",
    cameraTarget: "fuselage",
    paragraphs: [
      "Ingenuity's fuselage is about the size of a tissue box: 13.6 × 19.5 × 16.3 centimeters. Engineers packed it with computers, batteries, sensors, heaters and telecom hardware, and many parts came from cell-phone technology.",
      "It has two cameras. A 0.5-megapixel black-and-white camera looks down and helps with navigation in real time. A 13-megapixel color camera looks toward the horizon and takes pictures of the terrain.",
    ],
    image: {
      src: "/ingenuity/04b-first-flight.jpg",
      caption: "The cameras on the underside of Ingenuity",
      credit: "NASA/JPL-Caltech",
    },
    sources: [{ code: "003" }],
  },
  {
    id: "legs",
    chapter: "06",
    title: "FOUR FEET ON MARS.",
    kicker: "Legs and landing",
    cameraTarget: "legs",
    paragraphs: [
      "Ingenuity has four carbon composite legs, each about 38 centimeters long. They give it 13 centimeters of clearance above flat ground.",
      "On March 29, 2021, it was rotated out from the belly of Perseverance. On April 3, 2021, it was dropped about 13 centimeters (5 inches) onto the Martian surface. On April 4, it survived its first night alone.",
    ],
    image: {
      src: "/ingenuity/02d-turned-upright.jpg",
      caption: "Ingenuity unpacks itself from the rover's belly",
      credit: "NASA/JPL-Caltech/MSSS",
    },
    sources: [{ code: "001" }, { code: "003" }],
  },
  {
    id: "thin-air",
    chapter: "07",
    title: "LIGHT ENOUGH TO FLY.",
    kicker: "Thin air and weight",
    cameraTarget: "fullHeli",
    paragraphs: [
      "Ingenuity has a mass of 1.8 kilograms (about 4 pounds). Because gravity on Mars is weaker, it weighs only about 0.68 kilograms (1.5 pounds) there. Light weight and big, fast blades were the answer to the thin atmosphere. Its flight environment has less than 1% of the density of Earth's air.",
    ],
    image: {
      src: "/ingenuity/04-thin-air.jpg",
      caption: "Ingenuity in the Martian environment",
      credit: "NASA/JPL-Caltech",
    },
    sources: [{ code: "001" }, { code: "003" }],
  },
  {
    id: "flights",
    chapter: "08",
    title: "FROM TEST FLIGHTS TO SCOUT.",
    kicker: "Flights and scouting",
    cameraTarget: "fullHeliHigh",
    paragraphs: [
      "After the first five flights, Ingenuity began a new mission as an operations demonstration. It served as an aerial scout for Perseverance's scientists and rover drivers. NASA's tech specs list a flight altitude of up to 5 meters (15 feet), yet Ginny reached 24.0 meters (78.7 feet).",
      "It was upgraded to choose its own landing sites in treacherous terrain. It dealt with a dead sensor, cleaned itself after dust storms, and operated from 48 different airfields. In 2023, two flight tests explored the limits of its aerodynamics. NASA's navigation camera even recorded the last 29 seconds of Flight 6.",
    ],
    image: {
      src: "/ingenuity/05-flight-log.jpg",
      caption: "Last 29 seconds of Flight 6, seen by Ingenuity's navigation camera",
      credit: "NASA/JPL-Caltech",
    },
    sources: [{ code: "001" }, { code: "002" }],
  },
  {
    id: "end-of-mission",
    chapter: "09",
    title: "THE LAST FLIGHT.",
    kicker: "End of mission",
    cameraTarget: "fullHeliLow",
    paragraphs: [
      "On January 18, 2024, Ingenuity made a short vertical flight to find its location after an emergency landing on its previous flight. It reached 12 meters (40 feet), hovered for 4.5 seconds, and started down at 1 meter per second. About 1 meter above the surface, it lost contact with Perseverance.",
      "Communication returned the next day. Several days later, images showed damage to a rotor blade, and Ingenuity could no longer fly. NASA ended the mission on January 25, 2024. In NASA's announcement, the cause of the communications dropout was still being investigated.",
    ],
    image: {
      src: "/ingenuity/06-last-flight.jpg",
      caption: "Shadow of Ingenuity's damaged rotor blade after Flight 72",
      credit: "NASA/JPL-Caltech",
    },
    sources: [{ code: "002" }],
  },
  {
    id: "legacy",
    chapter: "10",
    title: "ONE SMALL HELICOPTER. A WHOLE NEW WAY TO EXPLORE.",
    kicker: "Legacy",
    cameraTarget: "fullHeliWide",
    paragraphs: [
      "Ingenuity flew 72 times. It flew more than 14 times farther than planned, and its time on Mars was more than 33 times longer than planned (almost 1,000 Martian days). It also survived a winter in which it could not power its heaters through the coldest nights. Its flight computer froze and reset, so the team redesigned its winter operations to keep flying.",
      "It carried a small swatch of fabric from the original Wright Flyer, so the first helicopter on Mars followed in the footsteps of the first airplane on Earth. Its successor, NASA's SkyFall mission, will use a mid-air deployment to deliver three next-generation Mars helicopters that will scout human landing sites and map subsurface water ice.",
    ],
    image: {
      src: "/ingenuity/06c-legacy.jpg",
      caption: "Ingenuity's legacy",
      credit: "NASA/JPL-Caltech",
    },
    sources: [{ code: "001" }, { code: "002" }, { code: "003" }],
  },
];

export default sections;