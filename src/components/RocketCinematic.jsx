"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { lyricAt } from "@/data/introScript";
import { ROCKET_IMAGE } from "@/data/rocketAsset";

const SolarSystemView = dynamic(() => import("@/components/SolarSystemView"), {
  ssr: false,
});

/**
 * Plays rover-intro.mp3 with synced lyrics. Rocket launches, then the solar
 * system appears and the rocket orbits while the story plays.
 */
export default function RocketCinematic({ narrationRef, ambienceRef, onFinished }) {
  const [time, setTime] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [phase, setPhase] = useState("launch");

  const finish = useCallback(() => {
    narrationRef.current?.pause();
    ambienceRef.current?.pause();
    setLeaving(true);
    window.setTimeout(() => onFinished?.(), 650);
  }, [ambienceRef, narrationRef, onFinished]);

  useEffect(() => {
    const narration = narrationRef.current;
    if (!narration) return undefined;

    const onEnded = () => finish();

    narration.addEventListener("ended", onEnded);

    let frame = 0;
    let armed = false;

    const tick = () => {
      const audioTime = narration.currentTime || 0;

      if (!armed) {
        if (audioTime < 1.5) armed = true;
        else {
          frame = window.requestAnimationFrame(tick);
          return;
        }
      }

      setTime(audioTime);
      if (audioTime >= 13) setPhase("orbit");
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      narration.removeEventListener("ended", onEnded);
    };
  }, [finish, narrationRef]);

  const lyric = lyricAt(time);
  const showSystem = time >= 11.5 || phase === "orbit";

  return (
    <div className={`rocket-cinematic ${leaving ? "is-leaving" : ""}`}>
      <div className="landing-sky" aria-hidden="true" />

      {showSystem && <SolarSystemView time={time} rocketSrc={ROCKET_IMAGE} />}

      <div
        className={`cinematic-rocket-launch ${phase === "launch" ? "is-flying" : "is-gone"}`}
        aria-hidden="true"
      >
        <img src={ROCKET_IMAGE} alt="" className="cinematic-rocket-img" draggable={false} />
        <div className="landing-flame launch-flame">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="cinematic-lyrics" aria-live="polite">
        {lyric ? <p key={lyric.start}>{lyric.text}</p> : <p className="cinematic-wait"> </p>}
      </div>

      <button type="button" className="cinematic-skip" onClick={finish}>
        Skip
      </button>
    </div>
  );
}
