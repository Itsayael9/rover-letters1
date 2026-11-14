"use client";

import { useEffect, useRef, useState } from "react";
import OppRoverCanvas from "@/components/kids/OppRoverCanvas";
import Subtitles from "@/components/kids/Subtitles";
import StarBurst from "@/components/kids/StarBurst";
import { t } from "@/data/kids/text";
import { useKidsProgress } from "@/context/KidsProgressContext";

export default function IntroPredictScene({ scene, machine, voice, onComplete }) {
  const { saveAnswer, answers } = useKidsProgress();
  const [phase, setPhase] = useState("intro");
  const [picked, setPicked] = useState(answers[`${scene.id}:predict`] ?? null);
  const [hint, setHint] = useState("");
  const [celebrate, setCelebrate] = useState(false);
  const [subtitleLines, setSubtitleLines] = useState(scene.voice);
  const doneRef = useRef(false);

  const { playLines, stop, speaking, lineIndex, active } = voice;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setSubtitleLines(scene.voice);
      await playLines(scene.voice);
      if (!cancelled) setPhase("predict");
    })();
    return () => {
      cancelled = true;
      stop();
    };
    // Scene mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id]);

  const choose = async (option) => {
    if (phase !== "predict") return;
    setPicked(option.id);
    saveAnswer(`${scene.id}:predict`, option.id);

    if (!option.correct) {
      setHint(t(scene.predict.hint));
      return;
    }

    setHint("");
    setCelebrate(true);
    setPhase("reveal");
    setSubtitleLines(scene.predict.revealVoice);
    await playLines(scene.predict.revealVoice);

    if (!doneRef.current) {
      doneRef.current = true;
      setPhase("done");
      onComplete({ stars: scene.starsOnComplete ?? 1 });
    }
  };

  const eyesOpen = phase !== "intro" || lineIndex > 0 || (!active && phase === "intro");

  return (
    <div className="kids-scene kids-scene-intro">
      <OppRoverCanvas
        modelUrl={machine.model}
        face={machine.face}
        speaking={speaking}
        eyesOpen={eyesOpen}
        celebrate={celebrate || phase === "done"}
      />

      <div className="kids-scene-panel">
        {(phase === "intro" || phase === "reveal") && (
          <Subtitles lines={subtitleLines} lineIndex={lineIndex} />
        )}

        {phase === "predict" && (
          <>
            <p className="kids-instruction">{t(scene.predict.question)}</p>
            <div
              className="kids-choice-row"
              role="group"
              aria-label="Guess how long Opp worked"
            >
              {scene.predict.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`kids-choice${picked === opt.id ? " is-picked" : ""}`}
                  onClick={() => choose(opt)}
                >
                  <span aria-hidden="true">{opt.icon}</span>
                  <span>{t(opt.label)}</span>
                </button>
              ))}
            </div>
            {hint ? (
              <p className="kids-hint" role="status">
                {hint}
              </p>
            ) : null}
          </>
        )}

        {phase === "done" && (
          <p className="kids-instruction">{t(scene.predict.celebrate)}</p>
        )}
      </div>

      <StarBurst show={celebrate} label={`+${scene.starsOnComplete ?? 1} star`} />
    </div>
  );
}
