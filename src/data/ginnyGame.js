/**
 * Ginny mini-game: Scout for Perseverance — copy, map, roads, coach (i18n-ready).
 */

export const ALTITUDE_MAX = 12;

export const STEPS = [
  { id: "fly", label: { en: "Fly up" } },
  { id: "spot", label: { en: "Spot dangers" } },
  { id: "choose", label: { en: "Choose the road" } },
  { id: "drive", label: { en: "Drive" } },
];

export const UI = {
  backToStory: { en: "Back to story" },
  backToMap: { en: "Back to Mars map" },
  continue: { en: "Continue" },
  playAgain: { en: "Play again" },
  didYouKnow: { en: "Did you know?" },
};

export const INTRO = {
  title: { en: "Scout for Perseverance" },
  lines: [
    { en: "Hi explorer! I flew ahead of Perseverance to look at the ground." },
    { en: "Help me spin up and pick a safe road for Percy!" },
  ],
};

export const SPIN = {
  holdButton: { en: "Lift off!" },
  takeoffIntro: { en: "Fly up to scout" },
  tapHint: {
    en: "Hold Lift off! I start at the bottom of your screen and rise to the very top.",
  },
  goalHint: { en: "The whole screen is our sky — no little box!" },
  inZoneCheer: { en: "Up we go — keep holding!" },
  holdCount: { en: "Flying up" },
  retry: { en: "Keep holding until I fly off the top!" },
  doneTakeoff: { en: "High enough! From up here we can spot dangers for Perseverance." },
};

export const COACH = {
  fly: {
    main: {
      en: "Hold FLY UP to rise. From up here we can see what Percy cannot!",
    },
    simple: { en: "Press and hold the big round button to fly higher." },
    done: { en: "WOW, look at all that ground! Now we can scout like a real helicopter." },
  },
  spot: {
    main: {
      en: "Tap each glowing circle — those are dangers Percy could not see from the ground.",
    },
    simple: { en: "Tap the yellow rings on the photo." },
    done: { en: "Great scouting! You found the tricky spots." },
  },
  choose: {
    main: {
      en: "Pick a road for Percy. The shortest path is not always the safest!",
    },
    simple: { en: "Tap a road letter, then tap Drive with that road." },
    stuck: {
      en: "That road bumps a hazard. Try Road C — it skips the rocks and sand.",
    },
    bestRoad: { en: "Road C is a smart balance — safe without going forever." },
  },
  drive: {
    main: { en: "Watch Percy drive along your safe road!" },
    simple: { en: "Sit tight — the rover is following your road." },
    success: { en: "Percy made it! Teamwork from the sky!" },
    thanksChip: { en: "Thanks Ginny!" },
  },
  safeTap: {
    en: "That spot looks okay — try a yellow danger ring instead.",
  },
};

export const LEGEND = {
  title: { en: "Danger types" },
  items: [
    { type: "rock", label: { en: "Big rock" }, desc: { en: "Can break wheels" } },
    { type: "sand", label: { en: "Sand ripple" }, desc: { en: "Wheels can get stuck" } },
    { type: "slope", label: { en: "Steep slope" }, desc: { en: "Rover can tip over" } },
  ],
};

export const FLY = {
  flyUp: { en: "FLY UP" },
  flyAria: { en: "Fly up — hold to rise, tap or Space for one meter" },
  altitude: { en: "Altitude" },
  meters: { en: "m" },
  hover: { en: "Hovering" },
};

/** Altitude marks (meters) + science cards from Ginny's story. */
export const ALTITUDE_MARKS = [
  {
    m: 3,
    icon: "🚁",
    fact: {
      en: "On April 19, 2021, I spun my blades, lifted off… and flew!",
    },
  },
  {
    m: 10,
    icon: "📷",
    fact: {
      en: "As a scout, I flew ahead and took pictures so Perseverance knew where to explore.",
    },
  },
  {
    m: 12,
    icon: "🌍",
    fact: {
      en: "From up here I can see rocks, sand, and slopes Percy might miss on the ground.",
    },
  },
];

export const ROAD = {
  spotTitle: { en: "Step 1 — Spot the dangers" },
  spotHint: { en: "Tap each yellow circle on the photo." },
  spotWhy: {
    en: "Why? Rocks can chip or break Percy's wheels. Soft sand can make his wheels spin without moving — like getting stuck in mud!",
  },
  counter: { en: "Dangers found" },
  continueSpot: { en: "Continue" },
  drawTitle: { en: "Step 2 — Tap a safe road" },
  drawHint: { en: "Tap up to 6 points from the rover flag to the goal flag." },
  undo: { en: "Undo" },
  drive: { en: "Start driving" },
  stuck: { en: "Oops — that spot looks tricky! Let's move a point and try again." },
  success: { en: "Perseverance made it! Great scouting!" },
  spotMiss: { en: "Tap one of the yellow circles on the map." },
  spotFound: { en: "Danger spotted!" },
  minFound: 2,
  maxWaypoints: 6,
  efficientBonusAt: 4,
};

export const PHOTOS = {
  ground: "/ingenuity/00-ground-view.jpg",
  groundFallback: "/ingenuity/02c-jezero-crater.jpg",
  aerial: "/ingenuity/05b-scout-view.jpg",
};

/** Native pixels of `05b-scout-view.jpg` — SVG viewBox matches so rings sit on the photo. */
export const SCOUT_AERIAL_SIZE = { w: 4208, h: 3120 };

export function scoutMapViewBox(size = SCOUT_AERIAL_SIZE) {
  return `0 0 ${size.w} ${size.h}`;
}

/** @typedef {{ id: string, x: number, y: number, r: number, type: "rock"|"sand"|"slope", hint: { en: string } }} Hazard */

export const MAP_EASY = {
  id: "scout-easy",
  title: { en: "Flight 5 view from 10 meters" },
  image: PHOTOS.aerial,
  imageSize: SCOUT_AERIAL_SIZE,
  start: { x: 2104, y: 2650 },
  goal: { x: 2104, y: 450 },
  /** x/y/r in image pixels (same space as viewBox). */
  hazards: [
    { id: "h1", x: 1280, y: 1580, r: 115, type: "rock", hint: { en: "Rock: sharp stones can crack Percy's metal wheels." } },
    { id: "h2", x: 900, y: 700, r: 100, type: "rock", hint: { en: "Rock: big boulders are too tall — the rover could hit its belly." } },
    { id: "h3", x: 2260, y: 1440, r: 105, type: "rock", hint: { en: "Rock: a whole pile of stones blocks the way." } },
    { id: "h4", x: 2460, y: 620, r: 120, type: "sand", hint: { en: "Sand: powdery ground can trap wheels and make Percy slip." } },
  ],
};

/** Preset roads (viewBox %). C = best safe medium. */
export const PRESET_ROADS = {
  A: {
    id: "A",
    label: { en: "Road A" },
    points: [
      { x: 2104, y: 2650 },
      { x: 1347, y: 2122 },
      { x: 1515, y: 1498 },
      { x: 2104, y: 437 },
    ],
    best: false,
  },
  B: {
    id: "B",
    label: { en: "Road B" },
    points: [
      { x: 2104, y: 2650 },
      { x: 3451, y: 2434 },
      { x: 3577, y: 1622 },
      { x: 2946, y: 874 },
      { x: 2104, y: 437 },
    ],
    best: false,
  },
  C: {
    id: "C",
    label: { en: "Road C" },
    points: [
      { x: 2104, y: 2650 },
      { x: 2610, y: 2309 },
      { x: 2693, y: 1622 },
      { x: 2272, y: 811 },
      { x: 2104, y: 437 },
    ],
    best: true,
  },
};

export const ENDING = {
  photo: "/ingenuity/06-last-flight.jpg",
  caption: { en: "Ginny's last flight" },
  credit: { en: "NASA/JPL-Caltech" },
  line1: { en: "My last flight was number 72." },
  line2: { en: "I'm abandoned… but not forgotten!" },
};

export const RECAP = {
  title: { en: "Today you learned" },
  items: [
    { en: "A rover on the ground can't see far." },
    { en: "Flying up shows dangers hiding ahead." },
    { en: "The safest road isn't always the shortest." },
  ],
  scienceTitle: { en: "Science cards you collected" },
  next: { en: "Next" },
};

export const REPORT = {
  intro: { en: "Build your scout report for the wall of discovery!" },
  template: { en: "I helped Perseverance by {0}." },
  blanks: [
    [
      { en: "spotting rocks" },
      { en: "drawing a safe road" },
      { en: "picking a safe path" },
    ],
  ],
  starsLabel: { en: "Stars you earned" },
  dangersLabel: { en: "Dangers you spotted" },
  finish: { en: "Add to my pocket" },
};

const t = (x) => (typeof x === "string" ? x : x?.en ?? "");

function distPointToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-6) return Math.hypot(px - x1, py - y1);
  let t0 = ((px - x1) * dx + (py - y1) * dy) / len2;
  t0 = Math.max(0, Math.min(1, t0));
  const nx = x1 + t0 * dx;
  const ny = y1 + t0 * dy;
  return Math.hypot(px - nx, py - ny);
}

function pathLength(path) {
  let len = 0;
  for (let i = 0; i < path.length - 1; i++) {
    len += Math.hypot(path[i + 1].x - path[i].x, path[i + 1].y - path[i].y);
  }
  return len;
}

export function firstPathHazardHit(path, hazards) {
  for (let i = 0; i < path.length - 1; i++) {
    const h = pathHitsHazard([path[i], path[i + 1]], hazards);
    if (h) return { segmentIndex: i, hazard: h };
  }
  return null;
}

export function pathHitsHazard(waypoints, hazards) {
  if (!waypoints || waypoints.length < 2) return null;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i];
    const b = waypoints[i + 1];
    for (const h of hazards) {
      const d = distPointToSegment(h.x, h.y, a.x, a.y, b.x, b.y);
      if (d < h.r) return h;
    }
  }
  return null;
}

/** Chips for road picker UI. */
export function analyzeRoad(path, hazards) {
  const len = pathLength(path);
  const lengthLabel = len < 2200 ? "short" : len > 3200 ? "long" : "medium";
  const counts = { rock: 0, sand: 0, slope: 0 };
  for (let i = 0; i < path.length - 1; i++) {
    const seg = [path[i], path[i + 1]];
    for (const h of hazards) {
      if (pathHitsHazard(seg, [h])) counts[h.type] += 1;
    }
  }
  const hit = pathHitsHazard(path, hazards);
  return { lengthLabel, counts, safe: !hit, hit };
}

export function hazardAtTap(x, y, hazards, extra = 85) {
  let best = null;
  let bestD = Infinity;
  for (const h of hazards) {
    const d = Math.hypot(x - h.x, y - h.y);
    const limit = h.r + extra;
    if (d <= limit && d < bestD) {
      bestD = d;
      best = h;
    }
  }
  return best;
}

export function pointerToMapCoords(svgEl, clientX, clientY) {
  if (!svgEl) return null;
  const pt = svgEl.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svgEl.getScreenCTM();
  if (!ctm) return null;
  const local = pt.matrixTransform(ctm.inverse());
  return { x: local.x, y: local.y };
}

export function pickText(obj) {
  return t(obj);
}