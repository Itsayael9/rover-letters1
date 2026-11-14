"use client";

import { useMemo } from "react";
import { CREW } from "@/data/introScript";

export default function ExplorerGuide({ selected }) {
  const line = useMemo(() => {
    if (selected === "moon") {
      return {
        speaker: "leo",
        text: "The Moon! Look for forgotten machines near the old footprints.",
      };
    }

    if (selected === "mars") {
      return {
        speaker: "pixel",
        text: "Mars is dusty and far from home. Opportunity is waiting in that red sand.",
      };
    }

    if (selected === "earth") {
      return {
        speaker: "leo",
        text: "That’s home. Every mission started here — then the machines kept going.",
      };
    }

    return {
      speaker: "leo",
      text: "Tap a planet with me. The forgotten machines are waiting.",
    };
  }, [selected]);

  const portrait = line.speaker === "pixel" ? CREW.robot : CREW.explorer;

  return (
    <div className={`explorer-guide${selected ? " raised" : ""}`}>
      <img
        src={portrait.image}
        alt={portrait.name}
        className="explorer-guide-face"
        draggable="false"
      />
      <div className="explorer-guide-bubble">
        <strong>{portrait.name}</strong>
        <p>{line.text}</p>
      </div>
    </div>
  );
}
