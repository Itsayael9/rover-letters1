"use client";

import "./oppMarsMeet.css";
import { useEffect, useRef, useState } from "react";
import { useSpeech } from "@/hooks/useSpeech";
import { OPPORTUNITY_MEET } from "@/data/opportunityMeet";
import Opportunity from "@/components/kids/Opportunity";

const STEPS = ["talk", "quiz", "reveal", "next"];

/**
 * Kids UI on Mars. Cartoon SVG Opp sits on the ground — no 3D overlay.
 */
export default function OppMarsMeet({ item, onClose }) {
  const meet = OPPORTUNITY_MEET;
  const { play, stop, speaking, lineIndex, supported } = useSpeech();
  const [phase, setPhase] = useState("talk");
  const [picked, setPicked] = useState(null);
  const [hint, setHint] = useState("");
  const [stars, setStars] = useState(0);
  const talkGate = useRef(false);
  const revealGate = useRef(false);

  const stepIndex = STEPS.indexOf(phase);

  useEffect(() => {
    talkGate.current = false;
    revealGate.current = false;
    play(meet.talk, item.lang);
    const maxTimer = window.setTimeout(() => {
      stop();
      setPhase((p) => (p === "talk" ? "quiz" : p));
    }, meet.maxTalkMs);

    return () => {
      window.clearTimeout(maxTimer);
      stop();
    };
  }, [item.lang, meet.talk, meet.maxTalkMs, play, stop]);

  useEffect(() => {
    if (phase !== "talk") return undefined;
    if (speaking) {
      talkGate.current = true;
      return undefined;
    }
    if (!talkGate.current) return undefined;
    const t = window.setTimeout(() => setPhase("quiz"), 400);
    return () => window.clearTimeout(t);
  }, [speaking, phase]);

  const skipTalk = () => {
    stop();
    setPhase("quiz");
  };

  const choose = (opt) => {
    if (phase !== "quiz") return;
    setPicked(opt.id);
    if (!opt.correct) {
      setHint(meet.quiz.hint);
      return;
    }
    setHint("");
    setStars((s) => s + 1);
    revealGate.current = false;
    setPhase("reveal");
    play(meet.quiz.reveal, item.lang);
  };

  useEffect(() => {
    if (phase !== "reveal") return undefined;
    if (speaking) {
      revealGate.current = true;
      return undefined;
    }
    if (!revealGate.current) return undefined;
    const t = window.setTimeout(() => setPhase("next"), 450);
    return () => window.clearTimeout(t);
  }, [phase, speaking]);

  let subtitle = meet.talk[0];
  if (phase === "talk" && lineIndex >= 0) subtitle = meet.talk[lineIndex] ?? subtitle;
  if (phase === "quiz") subtitle = meet.quiz.question;
  if (phase === "reveal" && lineIndex >= 0) {
    subtitle = meet.quiz.reveal[lineIndex] ?? meet.quiz.reveal[0];
  }
  if (phase === "next") subtitle = meet.nextStepNote;

  const mood = phase === "quiz" ? "surprised" : "happy";

  return (
    <div className="opp-mars-meet">
      <div className="opp-mars-meet-fade" aria-hidden="true" />

      <div className="opp-mars-topbar">
        <button type="button" className="opp-mars-back" onClick={onClose}>
          ← Back
        </button>

        <div className="opp-mars-dots" role="list" aria-label="Progress">
          {STEPS.map((id, i) => (
            <span
              key={id}
              role="listitem"
              className={`opp-mars-dot${i === stepIndex ? " is-current" : ""}${
                i < stepIndex ? " is-done" : ""
              }`}
              aria-label={`Step ${i + 1}${i === stepIndex ? ", current" : i < stepIndex ? ", done" : ""}`}
            />
          ))}
        </div>

        <div className="opp-mars-stars" aria-label={`${stars} stars`}>
          <span aria-hidden="true">⭐</span>
          <span>{stars}</span>
        </div>
      </div>

      <div className="opp-mars-nametag">{item.name}</div>

      {/* Cartoon Opp on the ground (SVG) */}
      <div className="opp-mars-rover-wrap" aria-hidden="false">
        <Opportunity talking={speaking} mood={mood} size="100%" />
      </div>

      <div className="opp-mars-panel">
        <p className="opp-mars-line" aria-live="polite">
          {subtitle}
        </p>

        {!supported && (
          <p className="opp-mars-warn">
            Voice needs Chrome or Edge. You can still read and tap.
          </p>
        )}

        {phase === "talk" && (
          <div className="opp-mars-actions">
            <button type="button" className="opp-mars-btn ghost" onClick={skipTalk}>
              Skip to question
            </button>
          </div>
        )}

        {phase === "quiz" && (
          <div className="opp-mars-quiz" role="group" aria-label="Opp asks a question">
            {meet.quiz.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`opp-mars-choice tone-${opt.tone || "yellow"}${
                  picked === opt.id ? " picked" : ""
                }`}
                onClick={() => choose(opt)}
              >
                <span className="opp-mars-choice-icon" aria-hidden="true">
                  {opt.icon}
                </span>
                <span>{opt.label}</span>
              </button>
            ))}
            {hint ? <p className="opp-mars-hint">{hint}</p> : null}
          </div>
        )}

        {phase === "next" && (
          <div className="opp-mars-actions">
            <button type="button" className="opp-mars-btn" onClick={onClose}>
              {meet.continueLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
