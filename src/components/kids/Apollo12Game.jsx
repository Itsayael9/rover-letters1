"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Apollo12 from "@/components/kids/Apollo12";
import Surveyor3 from "@/components/kids/Surveyor3";
import LunarSurface from "@/components/kids/LunarSurface";
import { useRadioAudio } from "@/hooks/useRadioAudio";
import { useProgress } from "@/store/progress";
import { APOLLO12_KIDS } from "@/data/kids/apollo12";

const CALL = APOLLO12_KIDS.radioCallouts;
const THEME = APOLLO12_KIDS.themeColor;

function WaveBars({ level, active }) {
  return (
    <div className="s3-comms-wave" aria-hidden={!active}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          style={{ transform: `scaleY(${active ? 0.35 + level * (0.5 + i * 0.12) : 0.2})` }}
        />
      ))}
    </div>
  );
}

function ArtifactRecovery({ artifact, onDone, radio }) {
  const [progress, setProgress] = useState(0);
  const done = progress >= 100;

  useEffect(() => {
    const msg =
      artifact.id === "tv-camera"
        ? CALL.artifactTv
        : artifact.id === "soil-scoop"
          ? CALL.artifactScoop
          : CALL.artifactStrut;
    void radio.speakRadio(msg);
  }, [artifact.id, radio]);

  const cut = () => {
    if (done) return;
    radio.playServoDig();
    setProgress((p) => {
      const n = Math.min(100, p + 22);
      if (n >= 100) {
        radio.playSuccessChime();
        window.setTimeout(onDone, 400);
      }
      return n;
    });
  };

  return (
    <div className="s3-minigame a12-recovery">
      <h4>Recover: {artifact.name}</h4>
      <div className="a12-artifact-stage">
        <Surveyor3 pose="idle" highlight={artifact.hotspot?.highlight} size="min(55%, 140px)" />
        <img src={artifact.image} alt="" className="s3-stage-thumb" />
      </div>
      <div className="s3-gauge">
        <div className="s3-gauge-fill" style={{ width: `${progress}%`, background: THEME }} />
        <span>{done ? "BAGGED FOR EARTH" : `Cut & bag ${progress}%`}</span>
      </div>
      <button type="button" className="s3-big-btn" onClick={cut} disabled={done}>
        CUT &amp; BAG PIECE
      </button>
    </div>
  );
}

export default function Apollo12Game({ onExit, onCompleteCelebration }) {
  const radio = useRadioAudio();
  const { completeMachine } = useProgress();
  const [phase, setPhase] = useState("walk"); // walk | at-surveyor | recover | finale
  const [recovered, setRecovered] = useState([]);
  const [currentArtifact, setCurrentArtifact] = useState(null);
  const intro = useRef(false);
  const celebrated = useRef(false);

  const wreckSpot = {
    id: "surveyor-wreck",
    label: APOLLO12_KIDS.surveyorWreck.label,
    worldX: APOLLO12_KIDS.surveyorWreck.worldX,
    worldY: APOLLO12_KIDS.surveyorWreck.worldY,
  };

  useEffect(() => {
    if (intro.current) return;
    intro.current = true;
    void radio.speakRadio(CALL.intro);
  }, [radio]);

  const onArrive = useCallback(async () => {
    await radio.speakRadio(CALL.siteApproach);
    await radio.speakRadio(CALL.apollo12Quote, { rate: 1.02, pitch: 1.05 });
    setPhase("at-surveyor");
  }, [radio]);

  const startRecovery = (artifact) => {
    setCurrentArtifact(artifact);
    setPhase("recover");
  };

  const finishArtifact = () => {
    setRecovered((r) => [...r, currentArtifact.id]);
    setCurrentArtifact(null);
    if (recovered.length + 1 >= APOLLO12_KIDS.artifacts.length) {
      if (!celebrated.current) {
        celebrated.current = true;
        completeMachine("apollo-12");
        onCompleteCelebration?.();
      }
      void radio.speakRadio(CALL.finale);
      setPhase("finale");
    } else {
      setPhase("at-surveyor");
    }
  };

  if (phase === "finale") {
    return (
      <div className="s3-mission-summary kids-mode">
        <div className="s3-finale-card s3-mission-summary-card">
          <p className="s3-finale-emoji" aria-hidden="true">
            🚀
          </p>
          <h2>Act II complete!</h2>
          <p>Pete Conrad and Al Bean recovered all three Surveyor 3 artifacts for Earth.</p>
          <ul className="s3-summary-artifacts">
            {APOLLO12_KIDS.artifacts.map((a) => (
              <li key={a.id}>
                <img src={a.image} alt="" />
                <div>
                  <strong>{a.name}</strong>
                  <span>{a.nasaId}</span>
                </div>
              </li>
            ))}
          </ul>
          <button type="button" className="kids-btn kids-btn-primary s3-launch-btn" onClick={onExit}>
            Back to the Moon
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="s3-game kids-mission-game s3-game--explore a12-game">
      <header className="s3-game-top">
        <button type="button" className="kids-icon-btn" onClick={onExit}>
          ← Moon
        </button>
        <span className="a12-act-tag">Act II</span>
        <button
          type="button"
          className={`s3-comms-toggle${radio.commsOn ? " is-on" : ""}`}
          onClick={() => {
            radio.setCommsOn((v) => !v);
            if (radio.commsOn) radio.stopRadio();
          }}
          aria-pressed={radio.commsOn}
        >
          COMMS
          <WaveBars level={radio.waveLevel} active={radio.talking && radio.commsOn} />
        </button>
      </header>

      <p className="s3-game-title s3-game-title--inline">{APOLLO12_KIDS.missionTitle}</p>

      {(phase === "walk" || phase === "at-surveyor") && (
        <>
          <p className="s3-explore-hint">Walk to Surveyor 3 in the crater</p>
          <LunarSurface
            spawn={APOLLO12_KIDS.spawn}
            spots={phase === "walk" ? [wreckSpot] : []}
            completedSpotIds={phase === "at-surveyor" ? [wreckSpot.id] : []}
            activeSpotId={phase === "walk" ? wreckSpot.id : null}
            onArrive={onArrive}
            themeColor={THEME}
            renderAvatar={({ moving: m }) => (
              <Apollo12
                pose={m ? "hop" : "idle"}
                highlight="artifact"
                talking={radio.talking}
                waveLevel={radio.waveLevel}
                dust={m}
                size="120px"
              />
            )}
          />
        </>
      )}

      <AnimatePresence>
        {phase === "at-surveyor" && (
          <motion.div className="s3-info-overlay a12-artifacts-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>Surveyor 3 — pick a piece to recover</h3>
            <ul className="a12-artifact-picks">
              {APOLLO12_KIDS.artifacts.map((a) => {
                const done = recovered.includes(a.id);
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      disabled={done}
                      className={done ? "is-done" : ""}
                      onClick={() => startRecovery(a)}
                    >
                      <img src={a.image} alt="" />
                      <span>{done ? "✓ " : ""}{a.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "recover" && currentArtifact && (
        <motion.div className="s3-minigame-sheet" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ArtifactRecovery artifact={currentArtifact} radio={radio} onDone={finishArtifact} />
        </motion.div>
      )}
    </div>
  );
}