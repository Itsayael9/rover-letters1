// Each station is one stop on the turning ring. Order = position around the circle.
// Station 0 is always the Opportunity model (passed as children to <RingStage>).

export const STATIONS = [
  {
    id: "rover",
    label: "Opportunity",
    caption: "NASA Opportunity rover",
    note: "Landed January 2004 · last contact June 2018",
  },
  {
    id: "blueberries",
    label: "Blueberries",
    caption: "Hematite spherules, nicknamed blueberries",
    note: "A few millimetres wide · shown floating for clarity, in reality embedded in the rock",
  },
  {
    id: "water",
    label: "Water evidence",
    caption: "Rock layers shaped by water long ago",
    note: "Real image from Opportunity · NASA/JPL-Caltech",
    photo: "/opportunity/12-water-evidence.jpg",
  },
];

/** Scroll chapter → ring station (see opportunityDeepDive.js section ids). */
export const STATION_FOR_SECTION = {
  introduction: 0,
  cameras: 0,
  antenna: 0,
  "solar-panels": 0,
  wheels: 0,
  "robotic-arm": 0,
  journey: 0,
  "dust-storm": 0,
  legacy: 0,
  "ancient-water": 1,
};

export const STATION_FOR_TRIGGER = {
  rock: 1,
  blueberries: 1,
  minerals: 2,
  water: 2,
  camera: 0,
};

export const stationForSection = (sectionId) => STATION_FOR_SECTION[sectionId] ?? 0;

export const stationForTrigger = (triggerId) => STATION_FOR_TRIGGER[triggerId];
