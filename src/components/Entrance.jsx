"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { OPPORTUNITY_LETTER_LINES } from "@/data/narration";
import { useNarration } from "@/context/NarrationProvider";

const EntranceBackdrop = dynamic(() => import("@/components/EntranceBackdrop"), {
  ssr: false,
});

/**
 * First screen: worn paper letter over slow planets.
 * Begin folds the letter away and starts narration (user gesture).
 */
export default function Entrance({ onBegin, onSkipToHub }) {
  const reduced = useReducedMotion();
  const { setMuted, muted, skip } = useNarration();
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [assetsReady, setAssetsReady] = useState(false);
  const [typedLines, setTypedLines] = useState([]);
  const [leaving, setLeaving] = useState(false);

  // Light mouse parallax on the 3D backdrop.
  useEffect(() => {
    if (reduced) return undefined;

    const onMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      setParallax({ x, y });
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  // Type the letter line by line after textures are ready.
  useEffect(() => {
    if (!assetsReady) return undefined;
    if (reduced) {
      setTypedLines(OPPORTUNITY_LETTER_LINES);
      return undefined;
    }

    setTypedLines([]);
    let line = 0;
    let char = 0;
    const timer = window.setInterval(() => {
      const text = OPPORTUNITY_LETTER_LINES[line];
      if (!text) {
        window.clearInterval(timer);
        return;
      }
      char += 1;
      setTypedLines((prev) => {
        const next = [...prev];
        next[line] = text.slice(0, char);
        return next;
      });
      if (char >= text.length) {
        line += 1;
        char = 0;
        if (line >= OPPORTUNITY_LETTER_LINES.length) window.clearInterval(timer);
      }
    }, 32);

    return () => window.clearInterval(timer);
  }, [assetsReady, reduced]);

  const handleBegin = () => {
    if (leaving) return;
    setLeaving(true);
    // Start narration in the same click (browser speech needs a user gesture).
    onBegin?.();
  };

  const handleSkip = () => {
    skip();
    onSkipToHub?.();
  };

  return (
    <div className="entrance-screen">
      <EntranceBackdrop
        parallax={reduced ? { x: 0, y: 0 } : parallax}
        onReady={() => setAssetsReady(true)}
      />

      {!assetsReady && (
        <div className="entrance-loading" aria-busy="true">
          <p>Loading the sky…</p>
        </div>
      )}

      <div className="entrance-controls">
        <button
          type="button"
          className="entrance-ctrl"
          onClick={() => setMuted((v) => !v)}
          aria-label={muted ? "Unmute narration" : "Mute narration"}
        >
          {muted ? "Unmute" : "Mute"}
        </button>
        <button type="button" className="entrance-ctrl" onClick={handleSkip} aria-label="Skip entrance">
          Skip
        </button>
      </div>

      {assetsReady && (
        <motion.div
          className="entrance-letter-wrap"
          animate={
            leaving
              ? { opacity: 0, y: reduced ? 0 : -80, rotateX: reduced ? 0 : -18, scale: 0.92 }
              : { opacity: 1, y: 0, rotateX: 0, scale: 1 }
          }
          transition={{ duration: reduced ? 0.2 : 0.65, ease: "easeInOut" }}
        >
          <article className="entrance-letter" aria-label="Letter from Opportunity">
            <div className="entrance-letter-body">
              {OPPORTUNITY_LETTER_LINES.map((full, i) => (
                <p key={full}>
                  {typedLines[i] ?? ""}
                  {!reduced &&
                    i === typedLines.length - 1 &&
                    typedLines[i]?.length < full.length && (
                      <span className="entrance-caret" aria-hidden="true" />
                    )}
                </p>
              ))}
            </div>
            <button
              type="button"
              className="entrance-seal"
              onClick={handleBegin}
              disabled={leaving}
              aria-label="Begin mission"
            >
              <span className="entrance-seal-label">Begin</span>
            </button>
          </article>
        </motion.div>
      )}
    </div>
  );
}
