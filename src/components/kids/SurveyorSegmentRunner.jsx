"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Surveyor3 from "@/components/kids/Surveyor3";
import SurveyorGame from "@/components/kids/SurveyorGame";
import SegmentQuestion from "@/components/kids/SegmentQuestion";
import { useRadioAudio } from "@/hooks/useRadioAudio";
import { useKidsProgress } from "@/context/KidsProgressContext";

function WaveBars({ level, active }) {
  return (
    <div className="s3-comms-wave" aria-hidden={!active}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          style={{
            transform: `scaleY(${active ? 0.35 + level * (0.5 + i * 0.12) : 0.2})`,
          }}
        />
      ))}
    </div>
  );
}

export default function SurveyorSegmentRunner({ machine, onExit, onCompleteCelebration }) {
  const reduceMotion = useReducedMotion();
  const { ready, segmentIndex, setSegmentIndex, completedSegments, markSegmentComplete, saveAnswer } =
    useKidsProgress();
  const radio = useRadioAudio();
  const [phase, setPhase] = useState("briefing"); // briefing | question | ready | game
  const segments = machine.segments;
  const segment = segments[segmentIndex] ?? null;

  const speakBriefing = useCallback(async () => {
    if (!segment) return;
    await radio.speakRadio(segment.voiceLine);
  }, [segment, radio]);

  useEffect(() => {
    if (!ready || phase !== "briefing" || !segment) return undefined;
    let cancelled = false;
    (async () => {
      await speakBriefing();
      if (!cancelled) setPhase("question");
    })();
    return () => {
      cancelled = true;
      radio.stopRadio();
    };
  }, [ready, phase, segment?.id, speakBriefing, radio]);

  const launchGame = useCallback(() => {
    radio.stopRadio();
    setPhase("game");
  }, [radio]);

  const onQuestionSolved = ({ line } = {}) => {
    if (segment && !completedSegments.includes(segment.id)) {
      markSegmentComplete(segment.id, 1);
    }
    radio.stopRadio();

    if (segment?.launchGameImmediately && segmentIndex >= segments.length - 1) {
      const go = () => launchGame();
      if (line) void radio.speakRadio(line).then(go);
      else window.setTimeout(go, 500);
      return;
    }
    setPhase("ready");
  };

  const goNext = () => {
    if (segmentIndex >= segments.length - 1) {
      launchGame();
      return;
    }
    setSegmentIndex(segmentIndex + 1);
    setPhase("briefing");
  };

  const skipBriefing = () => {
    radio.stopRadio();
    if (phase === "briefing") setPhase("question");
    else if (phase === "question" && segment?.launchGameImmediately && segmentIndex >= segments.length - 1) {
      launchGame();
    }
  };

  const toggleComms = () => {
    radio.setCommsOn((v) => !v);
    if (radio.commsOn) radio.stopRadio();
  };

  if (phase === "game") {
    return (
      <SurveyorGame onExit={onExit} onCompleteCelebration={onCompleteCelebration} />
    );
  }

  return (
    <div className="kids-seg kids-seg--on-moon">
      <div className="kids-moon-fade" aria-hidden="true" />

      <header className="kids-seg-top">
        <button type="button" className="kids-icon-btn" onClick={onExit} aria-label="Back to Moon map">
          ← Moon
        </button>
        <div className="kids-dots" role="list" aria-label="Briefing progress">
          {segments.map((s, i) => (
            <span
              key={s.id}
              role="listitem"
              className={`kids-dot${i === segmentIndex ? " is-current" : ""}${
                completedSegments.includes(s.id) || i < segmentIndex ? " is-done" : ""
              }`}
            />
          ))}
        </div>
        <div className="s3-briefing-actions">
          <button
            type="button"
            className={`s3-comms-toggle${radio.commsOn ? " is-on" : ""}`}
            onClick={toggleComms}
            aria-pressed={radio.commsOn}
          >
            COMMS
            <WaveBars level={radio.waveLevel} active={radio.talking && radio.commsOn} />
          </button>
          <button type="button" className="kids-btn kids-btn-ghost" onClick={skipBriefing}>
            Skip
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {segment ? (
          <motion.div
            key={segment.id}
            className="kids-seg-main kids-seg-main--moon"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="kids-moon-nametag">{segment.title}</p>
            <div className="kids-seg-stage kids-seg-stage--moon">
              <div className="kids-seg-lander">
                <Surveyor3
                  talking={radio.talking}
                  mood={segment.mood}
                  pose={segment.pose}
                  highlight={segment.highlight}
                  waveLevel={radio.waveLevel}
                  size="min(100%, 260px)"
                />
              </div>
              {segment.image ? (
                <figure className="s3-brief-media">
                  <img src={segment.image} alt="" />
                  <figcaption>{segment.imageCaption}</figcaption>
                </figure>
              ) : null}
            </div>

            <div className="kids-moon-panel">
              <p className="kids-moon-line" aria-live="polite">
                {phase === "briefing" ? segment.voiceLine : segment.narration}
              </p>

              {phase === "question" && (
                <SegmentQuestion
                  key={segment.id}
                  question={segment.question}
                  onSaveAnswer={(val) => saveAnswer(`${segment.id}:q`, val)}
                  onSolved={onQuestionSolved}
                />
              )}

              {phase === "ready" && (
                <>
                  <p className="kids-moon-line kids-moon-line--soft">{segment.question.explanation}</p>
                  <button type="button" className="kids-btn kids-btn-primary s3-launch-btn" onClick={goNext}>
                    {segmentIndex >= segments.length - 1 ? "Launch lunar engineer game" : "Next briefing"}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}