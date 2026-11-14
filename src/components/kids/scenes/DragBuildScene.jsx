"use client";

import { useEffect, useRef, useState } from "react";
import OppRoverCanvas from "@/components/kids/OppRoverCanvas";
import Subtitles from "@/components/kids/Subtitles";
import StarBurst from "@/components/kids/StarBurst";
import { t } from "@/data/kids/text";

export default function DragBuildScene({ scene, machine, voice, onComplete }) {
  const [placed, setPlaced] = useState({});
  const [dragging, setDragging] = useState(null);
  const [hintPart, setHintPart] = useState(null);
  const [wrongTries, setWrongTries] = useState(0);
  const [message, setMessage] = useState("");
  const [subtitleLines, setSubtitleLines] = useState([]);
  const [celebrate, setCelebrate] = useState(false);
  const [highlightSlot, setHighlightSlot] = useState(null);
  const doneRef = useRef(false);
  const stageRef = useRef(null);

  const { playLines, speaking, lineIndex } = voice;
  const remaining = scene.parts.filter((p) => !placed[p.id]);
  const allDone = scene.slots.every((s) => placed[s.id]);

  useEffect(() => {
    if (!allDone || doneRef.current) return;
    doneRef.current = true;
    (async () => {
      setCelebrate(true);
      setSubtitleLines(scene.completeVoice);
      await playLines(scene.completeVoice);
      onComplete({ stars: scene.starsOnComplete ?? 2 });
    })();
  }, [allDone, scene, playLines, onComplete]);

  const tryPlace = async (partId, slotId) => {
    const slot = scene.slots.find((s) => s.id === slotId);
    if (!slot || placed[slotId]) return;

    if (partId !== slotId) {
      const nextWrong = wrongTries + 1;
      setWrongTries(nextWrong);
      setMessage(t(slot.hint));
      if (nextWrong >= (scene.wrongTriesBeforeHint ?? 2)) {
        setHintPart(partId);
      }
      return;
    }

    setPlaced((p) => ({ ...p, [slotId]: true }));
    setMessage("");
    setHintPart(null);
    setWrongTries(0);
    setHighlightSlot(null);
    setSubtitleLines(slot.successVoice);
    await playLines(slot.successVoice);
  };

  const onPointerDown = (e, partId) => {
    e.preventDefault();
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    setDragging({
      id: partId,
      ox: e.clientX - rect.left,
      oy: e.clientY - rect.top,
      x: e.clientX,
      y: e.clientY,
    });
  };

  useEffect(() => {
    if (!dragging) return undefined;

    const onMove = (e) => {
      setDragging((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : null));
    };

    const onUp = (e) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const slotEl = el?.closest?.("[data-slot-id]");
      if (slotEl) {
        tryPlace(dragging.id, slotEl.getAttribute("data-slot-id"));
      }
      setDragging(null);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  const showHint = () => {
    const next = remaining[0];
    if (!next) return;
    setHighlightSlot(next.id);
    const slot = scene.slots.find((s) => s.id === next.id);
    setMessage(t(slot?.hint || "Look for the glowing spot!"));
  };

  return (
    <div className="kids-scene kids-scene-build">
      <p className="kids-instruction kids-instruction-top">{t(scene.instruction)}</p>

      <div className="kids-rover-stage" ref={stageRef}>
        <OppRoverCanvas
          modelUrl={machine.model}
          face={machine.face}
          speaking={speaking}
          celebrate={celebrate}
        />

        {scene.slots.map((slot) => (
          <div
            key={slot.id}
            data-slot-id={slot.id}
            className={`kids-slot${placed[slot.id] ? " is-filled" : ""}${
              highlightSlot === slot.id ? " is-hint" : ""
            }`}
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            aria-label={
              placed[slot.id]
                ? `${t(slot.label)} placed`
                : `Drop ${t(slot.label)} here`
            }
          >
            {placed[slot.id] ? (
              <span aria-hidden="true">{slot.icon}</span>
            ) : (
              <span className="kids-slot-empty">{slot.icon}</span>
            )}
          </div>
        ))}
      </div>

      <div className="kids-parts-tray" aria-label="Rover parts">
        {remaining.map((part) => (
          <button
            key={part.id}
            type="button"
            className={`kids-part-chip${hintPart === part.id ? " is-hint" : ""}`}
            aria-label={`Drag ${t(part.label)}`}
            onPointerDown={(e) => onPointerDown(e, part.id)}
          >
            <span aria-hidden="true">{part.icon}</span>
            <span>{t(part.label)}</span>
          </button>
        ))}
      </div>

      {dragging && (
        <div
          className="kids-drag-ghost"
          style={{ left: dragging.x - dragging.ox, top: dragging.y - dragging.oy }}
          aria-hidden="true"
        >
          {scene.parts.find((p) => p.id === dragging.id)?.icon}
        </div>
      )}

      <div className="kids-scene-panel">
        <Subtitles lines={subtitleLines} lineIndex={lineIndex} />
        {message ? (
          <p className="kids-hint" role="status">
            {message}
          </p>
        ) : null}
        {(wrongTries >= (scene.wrongTriesBeforeHint ?? 2) || highlightSlot) &&
          remaining.length > 0 && (
            <button type="button" className="kids-hint-btn" onClick={showHint}>
              💡 {t(scene.hintButtonLabel || "Hint")}
            </button>
          )}
      </div>

      <StarBurst show={celebrate} label={`+${scene.starsOnComplete ?? 2} stars`} />
    </div>
  );
}
