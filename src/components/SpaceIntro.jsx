"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { lyricAt, storyObjectAt } from "@/data/introScript";

const IntroWorlds = dynamic(() => import("@/components/IntroWorlds"), {
  ssr: false,
});

export default function SpaceIntro({ onFinished, autoStart = false }) {
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [phase, setPhase] = useState("start");
  const [audioError, setAudioError] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [spark, setSpark] = useState(null);

  const narrationRef = useRef(null);
  const ambienceRef = useRef(null);

  const finishIntro = useCallback(() => {
    narrationRef.current?.pause();
    ambienceRef.current?.pause();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setLeaving(true);
    window.setTimeout(() => {
      onFinished?.();
    }, 700);
  }, [onFinished]);

  const startIntro = useCallback(async () => {
    const narration = narrationRef.current;
    const ambience = ambienceRef.current;
    if (!narration || !ambience) return;

    setAudioError(false);

    try {
      narration.pause();
      ambience.pause();
      narration.currentTime = 0;
      ambience.currentTime = 0;
      narration.volume = 1;
      ambience.volume = 0.16;

      await ambience.play();
      await narration.play();
      setTime(0);
      setStarted(true);
      setPhase("story");
    } catch {
      narration.pause();
      ambience.pause();
      setAudioError(true);
    }
  }, []);

  useEffect(() => {
    if (!autoStart) return undefined;
    const timer = window.setTimeout(() => {
      startIntro();
    }, 80);
    return () => window.clearTimeout(timer);
  }, [autoStart, startIntro]);

  useEffect(() => {
    if (phase !== "story") return;

    const narration = narrationRef.current;
    if (!narration) return;

    const onEnded = () => {
      narration.pause();
      finishIntro();
    };

    narration.addEventListener("ended", onEnded);

    let frame = 0;
    let armed = false;

    const tick = () => {
      const audioTime = narration.currentTime || 0;

      // Ignore a stale end-of-file position some browsers report before playback really starts.
      if (!armed) {
        if (audioTime < 1.5) armed = true;
        else {
          frame = window.requestAnimationFrame(tick);
          return;
        }
      }

      setTime(audioTime);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      narration.removeEventListener("ended", onEnded);
    };
  }, [phase, finishIntro]);

  useEffect(() => {
    if (!spark) return;
    const timer = window.setTimeout(() => setSpark(null), 450);
    return () => window.clearTimeout(timer);
  }, [spark]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const lyric = phase === "story" ? lyricAt(time) : null;
  const story = phase === "story" ? storyObjectAt(time) : null;
  const showWorlds = phase === "story" && time >= 13.0;

  const skipOrMeet = () => {
    finishIntro();
  };

  return (
    <div className={`space-intro ${phase} ${leaving ? "leaving" : ""} ${showWorlds ? "has-worlds" : ""}`}>
      <audio ref={narrationRef} src="/audio/rover-intro.mp3" preload="auto" />
      <audio ref={ambienceRef} src="/audio/space-ambience.mp3" preload="auto" loop />

      <div className="stars" />
      <div className="glow glow-blue" />
      <div className="glow glow-ember" />

      {showWorlds && (
        <div className={`worlds-stage ${phase === "meet" ? "blurred" : ""}`}>
          <IntroWorlds />
        </div>
      )}

      {showWorlds && phase === "story" && (
        <div className="world-names">
          <span>The Moon</span>
          <span>Mars</span>
        </div>
      )}

      {phase === "start" && (
        <div className="start-stage">
          <div className="start-signal" />
          <p className="invite">
            A forgotten signal is calling from the Moon and Mars.
          </p>
          <button type="button" className="begin" onClick={startIntro}>
            Begin
          </button>
          {audioError && (
            <p className="audio-error">
              Audio could not start. Check your sound and try again.
            </p>
          )}
        </div>
      )}

      {phase === "story" && (
        <>
          <StoryObjects
            story={story}
            spark={spark}
            onTap={(id) => setSpark(id)}
          />

          <div className="lyrics" aria-live="polite">
            {lyric ? <p key={lyric.start}>{lyric.text}</p> : <p className="waiting"> </p>}
          </div>
        </>
      )}

      <button type="button" className="skip" onClick={skipOrMeet}>
        Skip
      </button>

      <style jsx>{`
        .space-intro {
          position: fixed;
          inset: 0;
          z-index: 40;
          overflow: hidden;
          color: #f4efe4;
          background: #07080d;
          font-family: var(--font-ui), "Nunito", sans-serif;
          transition: opacity 0.7s ease;
        }

        .leaving {
          opacity: 0;
          pointer-events: none;
        }

        .stars {
          position: absolute;
          inset: -40%;
          background-image:
            radial-gradient(1px 1px at 18% 22%, #fff 98%, transparent),
            radial-gradient(1.5px 1.5px at 62% 18%, #d7e7ff 98%, transparent),
            radial-gradient(1px 1px at 78% 64%, #fff 98%, transparent),
            radial-gradient(1px 1px at 34% 72%, #c9d8ff 98%, transparent),
            radial-gradient(1.5px 1.5px at 88% 36%, #fff 98%, transparent);
          background-size: 280px 240px, 340px 300px, 260px 280px, 300px 260px, 320px 310px;
          opacity: 0.55;
          animation: drift 80s linear infinite;
        }

        .glow {
          position: absolute;
          width: 58vw;
          height: 58vw;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
        }

        .glow-blue {
          top: -28%;
          left: -18%;
          background: #1a2a6a;
          opacity: 0.28;
        }

        .glow-ember {
          right: -22%;
          bottom: -30%;
          background: #6a2a1c;
          opacity: 0.18;
        }

        :global(.meet-crew) {
          position: absolute;
          inset: 0;
          z-index: 3;
        }

        .worlds-stage {
          position: absolute;
          inset: 8% 4% 24%;
          z-index: 1;
          pointer-events: none;
          transition: filter 0.8s ease, transform 0.8s ease, opacity 0.8s ease;
        }

        .worlds-stage.blurred {
          inset: 0;
          filter: blur(14px) saturate(0.7) brightness(0.55);
          transform: scale(1.08);
          opacity: 0.7;
        }

        .world-names {
          position: absolute;
          top: 16%;
          left: 12%;
          right: 12%;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          pointer-events: none;
          font-family: var(--font-story), "Fraunces", serif;
          font-size: clamp(18px, 2.4vw, 28px);
          color: rgba(244, 239, 228, 0.82);
        }

        .start-stage {
          position: absolute;
          inset: 0;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 22px;
          padding: 32px 20px;
        }

        .start-signal {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #9ad8ff;
          box-shadow: 0 0 28px #7ecfff;
          animation: beat 2.2s ease-in-out infinite;
        }

        .invite {
          max-width: 26rem;
          margin: 0;
          color: #d8d0c2;
          font-family: var(--font-story), "Fraunces", serif;
          font-size: clamp(18px, 2.3vw, 26px);
          line-height: 1.45;
          text-align: center;
        }

        .begin,
        .next-side {
          border: 0;
          border-radius: 999px;
          padding: 12px 28px;
          color: #1a140c;
          background: #f3d27a;
          font-family: var(--font-ui), "Nunito", sans-serif;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
        }

        .begin:hover,
        .next-side:hover {
          background: #ffe08a;
        }

        .audio-error {
          color: #ffc6b9;
          font-size: 13px;
        }

        .lyrics {
          position: absolute;
          right: 10%;
          bottom: 8%;
          left: 10%;
          z-index: 6;
          min-height: 4.2rem;
          text-align: center;
          pointer-events: none;
        }

        .lyrics p {
          margin: 0;
          font-family: var(--font-story), "Fraunces", serif;
          font-size: clamp(20px, 3vw, 32px);
          line-height: 1.4;
          text-shadow: 0 2px 24px rgba(0, 0, 0, 0.7);
          animation: lyricIn 0.25s ease;
        }

        .meet {
          position: absolute;
          inset: 0;
          z-index: 6;
        }

        .mate {
          position: absolute;
          bottom: 6%;
          width: min(34vw, 280px);
          opacity: 0.42;
          transform: scale(0.92);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }

        .mate.talking {
          opacity: 1;
          transform: scale(1);
          z-index: 2;
        }

        .mate.leo {
          left: 6%;
        }

        .mate.pixel {
          right: 18%;
          width: min(28vw, 230px);
        }

        .mate img {
          display: block;
          width: 100%;
          height: auto;
          background: transparent;
          user-select: none;
          filter: drop-shadow(0 16px 28px rgba(0, 0, 0, 0.35));
        }

        .bubble {
          position: absolute;
          top: 8%;
          width: min(320px, 42vw);
          padding: 14px 16px 16px;
          border-radius: 18px;
          background: #fff8e8;
          color: #1a140c;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
          animation: lyricIn 0.28s ease;
        }

        .bubble.left {
          top: 18%;
          left: 8%;
        }

        .bubble.right {
          top: 18%;
          right: 8%;
        }

        .bubble::after {
          content: "";
          position: absolute;
          bottom: 22px;
          width: 16px;
          height: 16px;
          background: #fff8e8;
          transform: rotate(45deg);
        }

        .bubble.left::after {
          left: -6px;
        }

        .bubble.right::after {
          right: -6px;
        }

        .bubble strong {
          display: block;
          margin-bottom: 4px;
          color: #8a5a12;
          font-family: var(--font-story), "Fraunces", serif;
          font-size: 14px;
        }

        .bubble p {
          margin: 0;
          font-size: clamp(15px, 1.8vw, 18px);
          line-height: 1.4;
        }

        .next-side {
          position: absolute;
          top: 50%;
          right: 22px;
          z-index: 8;
          display: flex;
          align-items: center;
          gap: 8px;
          transform: translateY(-50%);
        }

        .skip {
          position: absolute;
          top: 22px;
          right: 22px;
          z-index: 8;
          border: 0;
          color: rgba(244, 239, 228, 0.62);
          background: transparent;
          font-size: 14px;
          cursor: pointer;
        }

        .skip:hover {
          color: #fff;
        }

        @keyframes drift {
          to { transform: translate3d(80px, 40px, 0); }
        }

        @keyframes beat {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.35); opacity: 1; }
        }

        @keyframes lyricIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 720px) {
          .mate.leo,
          .mate.pixel {
            width: 38vw;
          }

          .mate.pixel {
            right: 8%;
          }

          .bubble.left,
          .bubble.right {
            top: -18%;
            left: 50%;
            right: auto;
            width: min(260px, 70vw);
            transform: translateX(-50%);
          }

          .bubble.left::after,
          .bubble.right::after {
            left: 50%;
            right: auto;
            bottom: -7px;
            transform: translateX(-50%) rotate(45deg);
          }

          .next-side {
            top: auto;
            bottom: 18px;
            right: 16px;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

function StoryObjects({ story, spark, onTap }) {
  if (!story) return null;

  return (
    <div className="story-layer">
      {story.kind === "stars" && (
        <>
          {["18% 22%", "70% 18%", "28% 48%", "78% 42%", "52% 28%"].map((pos, i) => (
            <button
              key={i}
              type="button"
              className={`prop star ${spark === `star-${i}` ? "hit" : ""}`}
              style={{ left: pos.split(" ")[0], top: pos.split(" ")[1] }}
              onClick={() => onTap(`star-${i}`)}
              aria-label="Star"
            />
          ))}
        </>
      )}

      {story.kind === "machines" && (
        <>
          <button type="button" className={`prop rover ${spark === "rover" ? "hit" : ""}`} onClick={() => onTap("rover")}>
            <span className="rover-body" />
            <span className="rover-wheel" />
            <span className="rover-wheel two" />
          </button>
          <button type="button" className={`prop sat ${spark === "sat" ? "hit" : ""}`} onClick={() => onTap("sat")}>
            <span />
          </button>
        </>
      )}

      {story.kind === "landscapes" && (
        <button type="button" className={`prop dust ${spark === "dust" ? "hit" : ""}`} onClick={() => onTap("dust")}>
          Dust trail
        </button>
      )}

      {story.kind === "letters" && (
        <>
          <button type="button" className={`prop letter ${spark === "letter" ? "hit" : ""}`} onClick={() => onTap("letter")}>
            ✉
          </button>
          <button type="button" className={`prop relic ${spark === "relic" ? "hit" : ""}`} onClick={() => onTap("relic")}>
            ⌁
          </button>
        </>
      )}

      {story.kind === "signal" && (
        <button type="button" className={`prop beacon ${spark === "beacon" ? "hit" : ""}`} onClick={() => onTap("beacon")}>
          <i />
        </button>
      )}

      <p className="story-hint">{story.hint}</p>

      <style jsx>{`
        .story-layer {
          position: absolute;
          inset: 0;
          z-index: 4;
        }

        .prop {
          position: absolute;
          border: 0;
          background: transparent;
          color: #f4efe4;
          cursor: pointer;
        }

        .star {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 16px #9ad8ff;
        }

        .rover {
          left: 18%;
          top: 38%;
          width: 92px;
          height: 48px;
        }

        .rover-body {
          display: block;
          width: 70px;
          height: 22px;
          border-radius: 8px;
          background: linear-gradient(180deg, #d8c4a2, #8b6a3e);
        }

        .rover-wheel {
          position: absolute;
          bottom: 4px;
          left: 8px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #2b2b2b;
          box-shadow: 32px 0 0 #2b2b2b;
        }

        .sat {
          right: 20%;
          top: 24%;
          width: 54px;
          height: 54px;
        }

        .sat span {
          display: block;
          width: 18px;
          height: 18px;
          margin: 18px auto 0;
          border-radius: 4px;
          background: #c5d6ea;
          box-shadow: -22px 0 0 6px #7ea7d6, 22px 0 0 6px #7ea7d6;
        }

        .dust {
          left: 50%;
          top: 58%;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(180, 90, 50, 0.28);
          color: #f3d0b0;
          transform: translateX(-50%);
        }

        .letter,
        .relic {
          top: 30%;
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: rgba(18, 24, 40, 0.55);
          font-size: 28px;
        }

        .letter { left: 22%; }
        .relic { right: 22%; color: #f3d27a; }

        .beacon {
          left: 50%;
          top: 28%;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #9ad8ff;
          box-shadow: 0 0 28px #7ecfff;
          transform: translateX(-50%);
        }

        .hit {
          animation: pop 0.45s ease;
        }

        .story-hint {
          position: absolute;
          top: 8%;
          left: 0;
          right: 0;
          margin: 0;
          text-align: center;
          color: rgba(244, 239, 228, 0.55);
          font-size: 13px;
          pointer-events: none;
        }

        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.28); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
