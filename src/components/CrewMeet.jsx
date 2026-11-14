"use client";

import { useState } from "react";
import { CREW, CREW_LINES, SPRITES } from "@/data/introScript";

/**
 * Leo and Pixel say hello on the planets page.
 * The user reads the lines and taps Next. No spoken voice.
 */
export default function CrewMeet({ onFinished }) {
  const [index, setIndex] = useState(0);
  const line = CREW_LINES[index];
  const last = index >= CREW_LINES.length - 1;

  const goNext = () => {
    if (last) {
      onFinished?.();
      return;
    }
    setIndex((n) => n + 1);
  };

  if (!line) return null;

  return (
    <div className="crew-meet">
      <div className="meet-crew">
        <div className={`meet-slot leo ${line.speaker === "leo" ? "is-speaking" : ""}`}>
          <img src={SPRITES.leo.idle} alt="Leo" className="crew-sprite" draggable="false" />
        </div>
        <div className={`meet-slot pixel ${line.speaker === "pixel" ? "is-speaking" : ""}`}>
          <img src={SPRITES.pixel.idle} alt="Pixel" className="crew-sprite" draggable="false" />
        </div>
      </div>

      {line.speaker === "leo" ? (
        <div className="crew-bubble left">
          <strong>{CREW.explorer.name}</strong>
          <p>{line.text}</p>
        </div>
      ) : (
        <div className="crew-bubble right">
          <strong>{CREW.robot.name}</strong>
          <p>{line.text}</p>
        </div>
      )}

      <button type="button" className="crew-next" onClick={goNext}>
        {last ? "Let’s go" : "Next"}
        <span>→</span>
      </button>

      <button type="button" className="intro-skip" onClick={() => onFinished?.()}>
        Skip
      </button>
    </div>
  );
}
