"use client";

import { useEffect, useRef, useState } from "react";
import OppRoverCanvas from "@/components/kids/OppRoverCanvas";
import Subtitles from "@/components/kids/Subtitles";
import StarBurst from "@/components/kids/StarBurst";
import { t } from "@/data/kids/text";

export default function TapPartsScene({ scene, machine, voice, onComplete }) {
  const [tapped, setTapped] = useState(() => new Set());
  const [activePart, setActivePart] = useState(null);
  const [popup, setPopup] = useState(null);
  const [subtitleLines, setSubtitleLines] = useState([]);
  const [celebrate, setCelebrate] = useState(false);
  const doneRef = useRef(false);

  const { playLines, speaking, lineIndex } = voice;

  const onTap = async (part) => {
    if (tapped.has(part.id)) return;

    setActivePart(part.id);
    setPopup(part);
    setSubtitleLines(part.voice);
    await playLines(part.voice);

    setTapped((prev) => {
      const next = new Set(prev);
      next.add(part.id);
      return next;
    });
  };

  useEffect(() => {
    if (doneRef.current) return;
    if (tapped.size < scene.parts.length) return;

    doneRef.current = true;
    (async () => {
      setCelebrate(true);
      setSubtitleLines(scene.completeVoice);
      setPopup({
        id: "badge",
        label: scene.badge,
        icon: "🏅",
      });
      await playLines(scene.completeVoice);
      onComplete({
        stars: scene.starsOnComplete ?? 1,
        badge: scene.badge,
      });
    })();
  }, [tapped, scene, playLines, onComplete]);

  return (
    <div className="kids-scene kids-scene-tap">
      <p className="kids-instruction kids-instruction-top">{t(scene.instruction)}</p>

      <div className="kids-rover-stage">
        <OppRoverCanvas
          modelUrl={machine.model}
          face={machine.face}
          speaking={speaking}
          celebrate={celebrate}
        />

        {scene.parts.map((part) => {
          const done = tapped.has(part.id);
          const hot = activePart === part.id;
          return (
            <button
              key={part.id}
              type="button"
              className={`kids-hotspot${done ? " is-done" : ""}${hot ? " is-hot" : ""}`}
              style={{ left: `${part.hotspot.x}%`, top: `${part.hotspot.y}%` }}
              aria-label={`Tap ${t(part.label)}`}
              onClick={() => onTap(part)}
            >
              <span aria-hidden="true">{part.icon}</span>
            </button>
          );
        })}

        {popup && (
          <div className="kids-part-popup" role="status">
            <span aria-hidden="true">{popup.icon}</span>
            <strong>{t(popup.label)}</strong>
          </div>
        )}
      </div>

      <div className="kids-scene-panel">
        <Subtitles lines={subtitleLines} lineIndex={lineIndex} />
        <p className="kids-progress-note">
          {tapped.size} / {scene.parts.length} parts
        </p>
      </div>

      <StarBurst
        show={celebrate}
        label={`+${scene.starsOnComplete ?? 1} · ${scene.badge || "Star"}`}
      />
    </div>
  );
}
