"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Surveyor3 from "@/components/kids/Surveyor3";
import SurveyorGame from "@/components/kids/SurveyorGame";
import MediaPanel from "@/components/kids/MediaPanel";
import SegmentQuestion from "@/components/kids/SegmentQuestion";
import { useRadioAudio } from "@/hooks/useRadioAudio";
import { useKidsProgress } from "@/context/KidsProgressContext";

function Mark({ children }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  );
}

function SkipMark() {
  return (
    <Mark>
      <path d="M6 6.5v11l8.5-5.5L6 6.5Z" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M17 6.2v11.6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </Mark>
  );
}

function PrevMark() {
  return (
    <Mark>
      <path d="M7 6.2v11.6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M18 6.5v11L9.5 12 18 6.5Z" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </Mark>
  );
}

function NextMark() {
  return (
    <Mark>
      <path d="M7 6.5 13.2 12 7 17.5V6.5Z" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M13 6.5 19.2 12 13 17.5V6.5Z" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </Mark>
  );
}

function PauseMark() {
  return (
    <Mark>
      <path d="M7.5 5.5h3.2v13H7.5zM13.3 5.5h3.2v13h-3.2z" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </Mark>
  );
}

function PlayMark() {
  return (
    <Mark>
      <path d="M8 5.8v12.4L18.2 12 8 5.8Z" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </Mark>
  );
}

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

export default function SurveyorSegmentRunner({
  machine,
  onExit,
  onCompleteCelebration,
  onContinueApollo12,
}) {
  const reduceMotion = useReducedMotion();
  const { ready, segmentIndex, setSegmentIndex, completedSegments, markSegmentComplete, saveAnswer } =
    useKidsProgress();
  const radio = useRadioAudio();
  const [paused, setPaused] = useState(false);
  const [phase, setPhase] = useState("lines");
  const [lineCursor, setLineCursor] = useState(0);
  const [followLine, setFollowLine] = useState("");

  const segments = machine.segments;
  const segment = segments[segmentIndex] ?? null;
  const atInvite = phase === "invite" || phase === "game" || !segment;
  const currentLine = segment?.lines?.[lineCursor] ?? null;
  const media = phase === "lines" || phase === "follow" ? currentLine?.media ?? null : null;

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const speak = radio.speakRadio;
  const stop = radio.stopRadio;

  useEffect(() => {
    if (!ready || phase !== "lines" || !segment || paused) return undefined;
    const line = segment.lines[lineCursor];
    if (!line) {
      setPhase("question");
      return undefined;
    }

    let cancelled = false;
    let timer = 0;
    let finishDwell = () => {};
    const dwell = new Promise((resolve) => {
      finishDwell = resolve;
      const ms = Math.min(6200, 1500 + line.text.length * 28);
      timer = window.setTimeout(resolve, ms);
    });
    (async () => {
      await Promise.all([speak(line.text), dwell]);
      if (cancelled || phaseRef.current !== "lines") return;
      if (lineCursor < segment.lines.length - 1) setLineCursor((c) => c + 1);
      else setPhase("question");
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      finishDwell();
      stop();
    };
  }, [ready, segment?.id, phase, lineCursor, paused, speak, stop, segment]);

  useEffect(() => {
    if (!ready || phase !== "follow" || !followLine || paused) return undefined;
    let cancelled = false;
    (async () => {
      await speak(followLine);
      if (!cancelled && phaseRef.current === "follow") setPhase("ready");
    })();
    return () => {
      cancelled = true;
      stop();
    };
  }, [ready, phase, followLine, paused, speak, stop]);

  const finishSegment = useCallback(() => {
    if (segment && !completedSegments.includes(segment.id)) {
      markSegmentComplete(segment.id, 1);
    }
    setPhase("ready");
  }, [segment, completedSegments, markSegmentComplete]);

  const onQuestionSolved = ({ line } = {}) => {
    saveAnswer(`${segment.id}:q`, { solved: true });
    if (segment && !completedSegments.includes(segment.id)) {
      markSegmentComplete(segment.id, 1);
    }
    const spoken = line || segment?.question?.explanation || "";
    if (spoken) {
      setFollowLine(spoken);
      setPhase("follow");
      return;
    }
    finishSegment();
  };

  const goNextChapter = () => {
    setPaused(false);
    stop();
    if (segmentIndex >= segments.length - 1) {
      setPhase("invite");
      return;
    }
    setLineCursor(0);
    setFollowLine("");
    setSegmentIndex(segmentIndex + 1);
    setPhase("lines");
  };

  const goPrevChapter = () => {
    setPaused(false);
    stop();
    if (phase === "invite") {
      setSegmentIndex(segments.length - 1);
      setLineCursor(0);
      setPhase("ready");
      return;
    }
    if (segmentIndex <= 0) return;
    setLineCursor(0);
    setFollowLine("");
    setSegmentIndex(segmentIndex - 1);
    setPhase("lines");
  };

  const skipVoice = () => {
    setPaused(false);
    stop();
    if (phase === "lines") setPhase("question");
    if (phase === "follow") finishSegment();
  };

  const advance = () => {
    stop();
    if (phase === "ready") {
      goNextChapter();
      return;
    }
    if (phase === "follow") {
      finishSegment();
      return;
    }
    if (phase === "lines" && segment) {
      if (lineCursor < segment.lines.length - 1) setLineCursor((c) => c + 1);
      else setPhase("question");
    }
  };

  const togglePause = () => {
    if (paused) setPaused(false);
    else {
      setPaused(true);
      stop();
    }
  };

  const toggleComms = () => {
    radio.setCommsOn((v) => !v);
    if (radio.commsOn) stop();
  };

  const mood =
    phase === "question" ? "curious" : phase === "follow" ? "happy" : currentLine?.mood || "happy";
  const pose = phase === "lines" || phase === "follow" ? currentLine?.pose || null : null;
  const highlight = phase === "lines" || phase === "follow" ? currentLine?.highlight ?? null : null;
  const spokenLine = phase === "lines" && currentLine ? currentLine.text : null;

  if (phase === "game") {
    return (
      <motion.div
        className="kids-story-layer kids-story-layer--game"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <SurveyorGame
          onExit={onExit}
          onCompleteCelebration={onCompleteCelebration}
          onContinueApollo12={onContinueApollo12}
        />
      </motion.div>
    );
  }

  return (
    <div className="kids-seg kids-seg--on-moon">
      <div className="kids-moon-fade" aria-hidden="true" />

      <header className="kids-seg-top">
        <button type="button" className="kids-icon-btn" onClick={onExit} aria-label="Back to Moon map">
          ← Moon
        </button>

        <div className="kids-dots" role="list" aria-label="Chapter progress">
          {segments.map((s, i) => (
            <span
              key={s.id}
              role="listitem"
              className={`kids-dot${i === segmentIndex && !atInvite ? " is-current" : ""}${
                completedSegments.includes(s.id) || i < segmentIndex ? " is-done" : ""
              }`}
            />
          ))}
        </div>

        <div className="kids-top-actions">
          <button
            type="button"
            className={`s3-comms-toggle s3-comms-toggle--mars-bar${radio.commsOn ? " is-on" : ""}`}
            onClick={toggleComms}
            aria-pressed={radio.commsOn}
            aria-label={radio.commsOn ? "Mute Surveyor" : "Unmute Surveyor"}
          >
            COMMS
            <WaveBars level={radio.waveLevel} active={radio.talking && radio.commsOn} />
          </button>
          <button
            type="button"
            className={`kids-nav-icon${paused ? " is-on" : ""}`}
            aria-pressed={paused}
            aria-label={paused ? "Play Surveyor" : "Pause Surveyor"}
            onClick={togglePause}
          >
            {paused ? <PlayMark /> : <PauseMark />}
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {phase === "invite" ? (
          <motion.div
            key="invite"
            className="kids-end-card kids-mars-card"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="kids-end-emoji" aria-hidden="true">
              🌙
            </p>
            <h2>{machine.inviteTitle}</h2>
            <p>{machine.inviteBody}</p>
            <div className="kids-invite-actions">
              <button type="button" className="kids-btn kids-btn-primary" onClick={() => setPhase("game")}>
                {machine.inviteYes}
              </button>
              <button type="button" className="kids-btn kids-btn-ghost" onClick={onExit}>
                {machine.inviteNo}
              </button>
            </div>
          </motion.div>
        ) : segment ? (
          <motion.div
            key={segment.id}
            className="kids-seg-main kids-seg-main--mars"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
          >
            <p className="kids-mars-nametag">{segment.title}</p>

            <div className={`kids-seg-stage kids-seg-stage--mars${media ? " has-media" : " is-solo"}`}>
              <div className="kids-seg-opp">
                <Surveyor3
                  talking={radio.talking && !paused}
                  mood={mood}
                  pose={pose}
                  highlight={highlight}
                  waveLevel={radio.waveLevel}
                  followPointer
                  size="100%"
                />
              </div>
              {media ? <MediaPanel media={media} /> : null}
            </div>

            <div className="kids-mars-panel">
              {spokenLine ? (
                <p className="kids-mars-line" aria-live="polite">
                  {spokenLine}
                </p>
              ) : null}

              {(phase === "question" || phase === "follow") && (
                <SegmentQuestion
                  key={segment.id}
                  variant="moon"
                  question={segment.question}
                  onSaveAnswer={(val) => saveAnswer(`${segment.id}:q`, val)}
                  onSolved={onQuestionSolved}
                />
              )}

              {phase === "ready" && (
                <p className="kids-mars-line kids-mars-line--soft">Nice work. Tap Next when you are ready.</p>
              )}

              <div className="kids-runner-footer kids-runner-footer--mars">
                {segmentIndex > 0 || phase === "invite" ? (
                  <button type="button" className="kids-nav-icon" onClick={goPrevChapter} aria-label="Previous chapter">
                    <PrevMark />
                  </button>
                ) : null}
                <button
                  type="button"
                  className="kids-nav-icon"
                  onClick={skipVoice}
                  disabled={phase !== "lines" && phase !== "follow"}
                  aria-label="Skip"
                >
                  <SkipMark />
                </button>
                <button
                  type="button"
                  className="kids-nav-icon"
                  disabled={phase !== "lines" && phase !== "follow" && phase !== "ready"}
                  onClick={advance}
                  aria-label="Next"
                >
                  <NextMark />
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
