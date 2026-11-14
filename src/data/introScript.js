export const NARRATION_END = 38.69;

// Windows measured from the real rover-intro.mp3 waveform.
// A line is shown ONLY while the voice is inside that window.
export const LYRICS = [
  { start: 0.08, end: 2.60, text: "Humanity has always looked to the stars," },
  { start: 3.00, end: 5.30, text: "wondering what lies beyond our world." },
  { start: 6.30, end: 8.70, text: "So we sent machines where we could not go…" },
  { start: 9.10, end: 12.30, text: "to explore distant worlds and uncover their secrets." },
  { start: 13.10, end: 17.05, text: "They crossed alien landscapes, studied unfamiliar places," },
  { start: 17.20, end: 19.35, text: "and sent their discoveries back home." },
  { start: 19.80, end: 22.80, text: "Some worked far longer than anyone expected." },
  { start: 23.20, end: 26.75, text: "Today, some of those machines remain far from home." },
  { start: 27.10, end: 28.65, text: "Their missions may be over…" },
  { start: 29.10, end: 30.80, text: "but their stories are not." },
  { start: 31.20, end: 33.10, text: "Every machine has a story." },
  { start: 33.35, end: 35.55, text: "Every discovery leaves a legacy." },
  { start: 35.95, end: 36.60, text: "Now…" },
  { start: 36.75, end: 38.55, text: "it's your turn to uncover them." },
];

export const STORY_OBJECTS = [
  {
    id: "stars",
    start: 0.0,
    end: 6.2,
    title: "The stars",
    hint: "Tap a star",
    kind: "stars",
  },
  {
    id: "machines",
    start: 6.2,
    end: 13.0,
    title: "The machines",
    hint: "Tap a rover",
    kind: "machines",
  },
  {
    id: "landscapes",
    start: 13.0,
    end: 19.7,
    title: "Distant worlds",
    hint: "Tap the dust",
    kind: "landscapes",
  },
  {
    id: "legacy",
    start: 19.7,
    end: 31.1,
    title: "Still waiting",
    hint: "Tap a letter",
    kind: "letters",
  },
  {
    id: "turn",
    start: 31.1,
    end: 38.7,
    title: "Your turn",
    hint: "Tap the signal",
    kind: "signal",
  },
];

export const SPRITES = {
  leo: {
    idle: "/images/leo/leo-idle.png",
    blink: "/images/leo/leo-blink.png",
    talk: ["/images/leo/leo-talk-1.png", "/images/leo/leo-talk-2.png"],
    surprise: "/images/leo/leo-surprise.png",
    side: "/images/leo/leo-side.png",
    walk: ["/images/leo/leo-walk-1.png", "/images/leo/leo-walk-2.png"],
    letter: "/images/leo/leo-letter.png",
  },
  pixel: {
    idle: "/images/pixel/pixel-idle.png",
    blink: "/images/pixel/pixel-blink.png",
    talk: ["/images/pixel/pixel-talk-1.png", "/images/pixel/pixel-talk-2.png"],
    surprise: "/images/pixel/pixel-surprise.png",
    walk: ["/images/pixel/pixel-walk.png"],
    point: "/images/pixel/pixel-point.png",
  },
};

export const CREW = {
  explorer: {
    name: "Leo",
    role: "Explorer from Earth",
    image: SPRITES.leo.idle,
  },
  robot: {
    name: "Pixel",
    role: "Robot companion",
    image: SPRITES.pixel.idle,
  },
};

export const CREW_LINES = [
  {
    speaker: "leo",
    text: "Hi! My name is Leo. I came all the way from Earth to explore with you.",
  },
  {
    speaker: "pixel",
    text: "And I’m Pixel, Leo’s robot friend. I help him find forgotten machines.",
  },
  {
    speaker: "leo",
    text: "NASA left equipment on the Moon and Mars. Those machines still have stories to tell.",
  },
  {
    speaker: "pixel",
    text: "Some of them worked for years. They sent secrets home… then waited in the dust.",
  },
  {
    speaker: "leo",
    text: "You’re coming with us. When you’re ready, tap a planet and let’s go.",
  },
];

export function lyricAt(time) {
  if (!Number.isFinite(time) || time < LYRICS[0].start) return null;
  return LYRICS.find((line) => time >= line.start && time < line.end) ?? null;
}

export function storyObjectAt(time) {
  if (!Number.isFinite(time)) return null;
  return STORY_OBJECTS.find((item) => time >= item.start && time < item.end) ?? null;
}
