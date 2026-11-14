"use client";

import { motion } from "framer-motion";

/** One white card, one sentence, one action — same voice as Opportunity's panel. */
export default function SurveyorGameBeat({ beat, onContinue }) {
  if (!beat) return null;
  const line = beat.line || beat.facts?.[0] || "";

  return (
    <motion.div
      className="s3-beat-sheet"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      role="dialog"
      aria-labelledby="s3-beat-title"
    >
      <div className="s3-beat-card">
        <p className="kids-mars-nametag" id="s3-beat-title">
          {beat.title}
        </p>
        <p className="kids-mars-line">{line}</p>
        <button type="button" className="kids-btn kids-btn-primary s3-beat-continue" onClick={onContinue}>
          {beat.action ?? "Continue"}
        </button>
      </div>
    </motion.div>
  );
}
