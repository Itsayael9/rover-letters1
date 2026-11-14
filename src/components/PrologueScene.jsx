"use client";

import { useEffect, useRef, useState } from "react";
import CrewSprite from "@/components/CrewSprite";

const SHOTS = {
  approach: { src: "/images/hangar/empty-hangar.jpg", pos: "46% 68%" },
  enter: { src: "/images/hangar/hallway-windows.jpg", pos: "40% 58%" },
  equipment: { src: "/images/hangar/industrial-hall.jpg", pos: "36% 72%" },
  box: { src: "/images/hangar/tiled-corridor.jpg", pos: "42% 74%" },
  letter: { src: "/images/hangar/tiled-corridor.jpg", pos: "42% 74%" },
};

const ALL_SHOTS = Object.values(SHOTS);

export default function PrologueScene({
  onReady,
  onLetterDone,
  boxOpen,
  onOpenBox,
  onBeat,
}) {
  const [beat, setBeat] = useState("approach");
  const [placed, setPlaced] = useState(false);
  const [bg, setBg] = useState(SHOTS.approach);
  const [prev, setPrev] = useState(null);
  const bgRef = useRef(SHOTS.approach);
  const readySent = useRef(false);
  const doneSent = useRef(false);

  useEffect(() => {
    ALL_SHOTS.forEach((shot) => {
      const image = new window.Image();
      image.src = shot.src;
    });
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setPlaced(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    onBeat?.("approach");
    const enter = window.setTimeout(() => setBeat("enter"), 4200);
    const gear = window.setTimeout(() => setBeat("equipment"), 9000);
    const box = window.setTimeout(() => setBeat("box"), 14500);
    return () => {
      window.clearTimeout(enter);
      window.clearTimeout(gear);
      window.clearTimeout(box);
    };
  }, [onBeat]);

  useEffect(() => {
    onBeat?.(beat);
    if (beat === "box" && !readySent.current) {
      readySent.current = true;
      onReady?.();
    }
  }, [beat, onBeat, onReady]);

  useEffect(() => {
    if (boxOpen) setBeat("letter");
  }, [boxOpen]);

  useEffect(() => {
    if (!boxOpen || doneSent.current) return undefined;
    const timer = window.setTimeout(() => {
      doneSent.current = true;
      onLetterDone?.();
    }, 3200);
    return () => window.clearTimeout(timer);
  }, [boxOpen, onLetterDone]);

  useEffect(() => {
    const next = SHOTS[beat];
    if (!next || next.src === bgRef.current.src) return undefined;
    setPrev(bgRef.current);
    bgRef.current = next;
    setBg(next);
    const timer = window.setTimeout(() => setPrev(null), 900);
    return () => window.clearTimeout(timer);
  }, [beat]);

  const walking = beat === "approach" || beat === "enter";
  const leoPose =
    beat === "letter" ? "letter" : beat === "equipment" ? "surprise" : walking ? "walk" : "idle";
  const pixelPose =
    beat === "letter" || beat === "box"
      ? "point"
      : beat === "equipment"
        ? "surprise"
        : walking
          ? "walk"
          : "idle";

  return (
    <div className={`prologue-film placed-${placed} beat-${beat}`}>
      {prev && (
        <img
          className="hangar-still leaving"
          src={prev.src}
          alt=""
          style={{ objectPosition: prev.pos }}
        />
      )}
      <img
        key={bg.src}
        className="hangar-still"
        src={bg.src}
        alt=""
        style={{ objectPosition: bg.pos }}
      />
      <div className="hangar-shade" />
      <div className="hangar-dust" />

      <div className={`crew-slot leo ${walking ? "striding" : ""}`}>
        <CrewSprite
          who="leo"
          pose={leoPose}
          walking={walking}
          alt="Leo"
        />
      </div>

      <div className={`crew-slot pixel ${walking ? "striding" : ""}`}>
        <CrewSprite
          who="pixel"
          pose={pixelPose}
          walking={walking}
          flip={walking}
          alt="Pixel"
        />
      </div>

      {(beat === "box" || beat === "letter") && (
        <button
          type="button"
          className={`shiny-box ${boxOpen ? "opened" : ""}`}
          onClick={() => {
            if (beat === "box") onOpenBox?.();
          }}
          aria-label="Open the box"
        >
          <span className="box-glow" />
          <span className="box-body" />
          <span className="box-lid" />
        </button>
      )}

    </div>
  );
}
