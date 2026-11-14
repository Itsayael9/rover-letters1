/**
 * Opportunity on Mars — short meet + one quiz.
 * Talk script is written for about ~60 seconds of speech.
 * All text here for easy edits / later i18n.
 */

export const OPPORTUNITY_MEET = {
  id: "opportunity",
  /** Spoken intro — keep short; aim ~60s total with TTS. */
  talk: [
    "Hi! I'm Opportunity — my friends call me Opp.",
    "I am a robot explorer living on Mars.",
    "My team planned for me to work about 90 Mars days — like 3 months.",
    "But I kept going for about 14 years!",
    "I have 6 wheels, solar panels for lunch, and a camera for eyes.",
    "I found clues that water once flowed here. Mars was not always dry!",
  ],
  maxTalkMs: 60_000,
  quiz: {
    question: "Quick check! How long did I really keep working on Mars?",
    options: [
      { id: "3m", label: "About 3 months", icon: "📅", tone: "yellow" },
      { id: "1y", label: "About 1 year", icon: "🎂", tone: "orange" },
      { id: "14y", label: "About 14 years", icon: "🌟", tone: "teal", correct: true },
    ],
    hint: "I worked way longer than the plan — think many years!",
    reveal: [
      "Yes! About 14 years. I worked much longer than anyone planned.",
      "You listened well. Ready for the next step on Mars?",
    ],
  },
  continueLabel: "Continue",
  nextStepNote: "Next Mars step coming soon — more Opp adventures!",
};
