/** Letter shown on the entrance screen (Opportunity). */
export const OPPORTUNITY_LETTER_LINES = [
  "Dear Explorer,",
  "Long ago, humans sent me and my robot friends far from home.",
  "We worked hard. We found water, rocks, and secrets of other worlds.",
  "Then the missions ended, and we were left behind.",
  "But we are not forgotten, not if you listen.",
  "Will you come and hear our stories?",
  "- Opportunity",
];

/**
 * Ordered narration after the user taps Begin.
 * cue: optional event name for other screens to react to.
 * audioSrc: optional file; if set, plays instead of speechSynthesis.
 */
export const NARRATION_SCRIPT = [
  {
    id: "countdown",
    text: "Three... two... one...",
    cue: "countdown",
  },
  {
    id: "liftoff",
    text: "Liftoff! Hold on tight, Explorer.",
    cue: "launch",
  },
  {
    id: "leaving-earth",
    text: "We are leaving Earth, the only home we have ever known.",
  },
  {
    id: "solar-system",
    text:
      "Look, the Sun, and the planets, in their real order, just as they travel around it.",
    cue: "planets",
  },
  {
    id: "friends-waiting",
    text: "Our friends are waiting, far away on the Moon and on Mars.",
    cue: "approach",
  },
  {
    id: "touchdown",
    text:
      "Here we go... touchdown. Welcome to the museum of forgotten explorers.",
    cue: "landing",
  },
];
