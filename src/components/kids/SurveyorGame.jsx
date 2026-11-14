"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Surveyor3 from "@/components/kids/Surveyor3";
import ArtifactInspector from "@/components/kids/ArtifactInspector";
import { useRadioAudio } from "@/hooks/useRadioAudio";
import { useProgress } from "@/store/progress";
import { SURVEYOR3_KIDS } from "@/data/kids/surveyor3";

const CALL = SURVEYOR3_KIDS.radioCallouts;
const THEME = SURVEYOR3_KIDS.themeColor;
const ARTIFACTS = SURVEYOR3_KIDS.artifacts;

const SOIL_TESTS = [
  { id: "footpad", label: "Footpad load press", gain: 0.35 },
  { id: "trench", label: "17.5 cm trench dig", gain: 0.65 },
  { id: "bearing", label: "Regolith bearing test", gain: 1 },
];

const SCAN_HOTSPOTS = [
  { id: "tv-camera", artifactId: "tv-camera", label: "TV camera mirror", x: 50, y: 28, highlight: "camera" },
  { id: "soil-scoop", artifactId: "soil-scoop", label: "Blue soil scoop", x: 28, y: 55, highlight: "scoop" },
  { id: "strut-tubes", artifactId: "strut-tubes", label: "Support strut tubes", x: 58, y: 42, highlight: "solar" },
];

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

function StageDots({ stage }) {
  return (
    <div className="s3-stage-dots" aria-label={`Game stage ${stage} of 3`}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={n === stage ? "is-current" : n < stage ? "is-done" : ""} />
      ))}
    </div>
  );
}

function ArtifactTray({ unlockedIds }) {
  return (
    <div className="s3-artifact-tray" aria-label="Recovered artifacts">
      {ARTIFACTS.map((a) => {
        const on = unlockedIds.includes(a.id);
        return (
          <div key={a.id} className={`s3-tray-slot${on ? " is-unlocked" : ""}`} title={a.name}>
            {on ? (
              <img src={a.image} alt="" />
            ) : (
              <span className="s3-tray-lock" aria-hidden="true">
                ?
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MissionCompleteSummary({ onExit }) {
  return (
    <div className="s3-mission-summary kids-mode">
      <div className="s3-finale-card s3-mission-summary-card">
        <p className="s3-finale-emoji" aria-hidden="true">
          🌙
        </p>
        <h2>Apollo Lunar Scout Certificate</h2>
        <p>You cleared Surveyor Crater, tested the soil, and helped Apollo 12 recover real Moon hardware!</p>
        <ul className="s3-summary-artifacts">
          {ARTIFACTS.map((a) => (
            <li key={a.id}>
              <img src={a.image} alt="" />
              <div>
                <strong>{a.name}</strong>
                <span>{a.nasaId}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className="s3-act2-banner">Act II: Visit Apollo 12 on the Moon whenever you like!</p>
        <button type="button" className="kids-btn kids-btn-primary s3-launch-btn" onClick={onExit}>
          Back to the Moon
        </button>
      </div>
    </div>
  );
}

/** Stage 1 — manual vernier cutoff timing bar */
function StageLanding({ radio, onSuccess }) {
  const [alt, setAlt] = useState(10);
  const [zone] = useState(() => ({
    start: 38 + Math.floor(Math.random() * 22),
    width: 16 + Math.floor(Math.random() * 8),
  }));
  const [marker, setMarker] = useState(0);
  const [result, setResult] = useState(null);
  const raf = useRef(null);
  const dir = useRef(1);
  const introDone = useRef(false);

  useEffect(() => {
    if (introDone.current) return;
    introDone.current = true;
    void radio.speakRadio(CALL.stage1Intro);
    radio.playThrusterPulse();
  }, [radio]);

  useEffect(() => {
    if (result) return undefined;
    const tick = () => {
      setMarker((m) => {
        let next = m + dir.current * 0.9;
        if (next >= 100) {
          next = 100;
          dir.current = -1;
        } else if (next <= 0) {
          next = 0;
          dir.current = 1;
        }
        return next;
      });
      setAlt((a) => Math.max(0, a - 0.018));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [result]);

  const cut = () => {
    if (result === "ok") return;
    const inZone = marker >= zone.start && marker <= zone.start + zone.width;
    if (inZone) {
      setResult("ok");
      radio.playSuccessChime();
      void radio.speakRadio(CALL.stage1Success).then(() => onSuccess());
    } else {
      setResult("retry");
      radio.playScanPing();
      void radio.speakRadio("Missed the window! Verniers still firing—try again!");
      window.setTimeout(() => {
        setResult(null);
        setAlt(10);
        setMarker(0);
      }, 1400);
    }
  };

  return (
    <div className="s3-stage">
      <h3>Stage 1 — Crater bounce stabilizer</h3>
      <p className="s3-stage-sub">14° slope · bright rocks jamming radar</p>
      <div className="s3-alt-readout">
        Altitude <strong>{alt.toFixed(1)}</strong> m
        <span className="s3-thruster-flame" aria-hidden="true" />
      </div>
      <Surveyor3
        pose="bounce"
        mood="surprised"
        highlight="legs"
        talking={radio.talking}
        waveLevel={radio.waveLevel}
        size="min(100%, 220px)"
      />
      <img
        src="/surveyor3/landing-crater.jpg"
        alt=""
        className="s3-stage-thumb"
      />
      <p className="s3-stage-hint">Tap when the gold marker is inside the green zone.</p>
      <div className="s3-timing-bar">
        <div className="s3-zone" style={{ left: `${zone.start}%`, width: `${zone.width}%` }} />
        <div className="s3-marker" style={{ left: `${marker}%` }} />
      </div>
      <button type="button" className="s3-big-btn" onClick={cut} disabled={result === "ok"}>
        CUT VERNIER ENGINES
      </button>
    </div>
  );
}

function StageScoop({ radio, onSuccess }) {
  const [step, setStep] = useState(0);
  const [psi, setPsi] = useState(0);
  const [pose, setPose] = useState("dig");
  const [running, setRunning] = useState(false);
  const [testsDone, setTestsDone] = useState(false);
  const introDone = useRef(false);

  useEffect(() => {
    if (introDone.current) return;
    introDone.current = true;
    void radio.speakRadio(CALL.stage2Intro);
  }, [radio]);

  const runTest = () => {
    const test = SOIL_TESTS[step];
    if (!test || running || testsDone) return;
    setRunning(true);
    radio.playServoDig();
    setPose("dig");
    const target = Math.round(6 * test.gain * 10) / 10;
    let t = 0;
    const id = window.setInterval(() => {
      t += 1;
      setPsi((p) => Math.min(target, p + 0.4));
      if (t > 12) {
        window.clearInterval(id);
        setRunning(false);
        if (step >= SOIL_TESTS.length - 1) {
          setPsi(6);
          setTestsDone(true);
          setPose("proud");
          radio.playSuccessChime();
          void radio.speakRadio(CALL.stage2Success).then(() => onSuccess());
        } else {
          setStep((s) => s + 1);
          setPose("proud");
        }
      }
    }, 80);
  };

  return (
    <div className="s3-stage">
      <h3>Stage 2 — Robotic soil scoop lab</h3>
      <p className="s3-stage-sub">{SOIL_TESTS[step]?.label ?? "All tests complete"}</p>
      <Surveyor3
        pose={pose}
        highlight="scoop"
        talking={radio.talking}
        waveLevel={radio.waveLevel}
        size="min(100%, 200px)"
      />
      <img src="/surveyor3/soil-trench.jpg" alt="" className="s3-stage-thumb" />
      <div className="s3-gauge">
        <div className="s3-gauge-fill" style={{ width: `${(psi / 6) * 100}%` }} />
        <span>{psi >= 6 ? "6 PSI — APOLLO SAFE" : `${psi.toFixed(1)} PSI`}</span>
      </div>
      <button type="button" className="s3-big-btn" onClick={runTest} disabled={running || testsDone}>
        {testsDone
          ? "Soil cleared for Apollo!"
          : `Run test ${Math.min(step + 1, SOIL_TESTS.length)} / ${SOIL_TESTS.length}`}
      </button>
    </div>
  );
}

function StageApollo({ radio, onSuccess, onUnlockArtifact }) {
  const [scanned, setScanned] = useState([]);
  const [beam, setBeam] = useState(null);
  const [introDone, setIntroDone] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const introStarted = useRef(false);

  useEffect(() => {
    if (introStarted.current) return;
    introStarted.current = true;
    let live = true;
    (async () => {
      await radio.speakRadio(CALL.stage3Intro, { pitch: 0.88 });
      if (!live) return;
      await radio.speakRadio(CALL.apollo12Quote, { rate: 1.02, pitch: 1.05 });
      if (live) setIntroDone(true);
    })();
    return () => {
      live = false;
    };
  }, [radio]);

  const scan = (spot) => {
    if (!introDone || scanned.includes(spot.id) || finishing) return;
    radio.playScanPing();
    setBeam(spot);
    window.setTimeout(() => {
      setScanned((prev) => {
        const next = [...prev, spot.id];
        onUnlockArtifact?.(spot.artifactId);
        if (next.length >= SCAN_HOTSPOTS.length) {
          setFinishing(true);
          radio.playSuccessChime();
          void radio.speakRadio(CALL.stage3Success).then(() => onSuccess());
        }
        return next;
      });
      setBeam(null);
    }, 700);
  };

  return (
    <div className="s3-stage s3-stage-scan">
      <h3>Stage 3 — Apollo 12 time-capsule recovery</h3>
      <p className="s3-stage-sub">Nov 1969 · scan each piece Pete Conrad carried home</p>
      <div className="s3-scan-stage">
        <img src="/surveyor3/apollo12-visit.jpg" alt="" className="s3-scan-photo" />
        <div className="s3-scan-lander">
          <Surveyor3
            pose="idle"
            highlight={beam?.highlight}
            talking={radio.talking}
            waveLevel={radio.waveLevel}
            size="100%"
          />
        </div>
        {introDone &&
          SCAN_HOTSPOTS.map((spot) => (
            <button
              key={spot.id}
              type="button"
              className={`s3-hotspot${scanned.includes(spot.id) ? " is-done" : ""}`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              onClick={() => scan(spot)}
              disabled={finishing}
            >
              {scanned.includes(spot.id) ? "✓" : spot.label}
            </button>
          ))}
        {beam ? (
          <div className="s3-scanner-beam" style={{ left: `${beam.x}%`, top: `${beam.y}%` }} />
        ) : null}
      </div>
    </div>
  );
}

export default function SurveyorGame({ onExit, onCompleteCelebration }) {
  const radio = useRadioAudio();
  const { completeMachine } = useProgress();
  const [stage, setStage] = useState(1);
  /** play → inspect → summary */
  const [flow, setFlow] = useState("play");
  const [unlockedArtifacts, setUnlockedArtifacts] = useState([]);
  const celebrated = useRef(false);

  const unlockArtifact = useCallback((id) => {
    setUnlockedArtifacts((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const finishStage3 = useCallback(() => {
    if (!celebrated.current) {
      celebrated.current = true;
      completeMachine("surveyor-3");
      onCompleteCelebration?.();
    }
    setFlow("inspect");
  }, [completeMachine, onCompleteCelebration]);

  const toggleComms = useCallback(() => {
    radio.setCommsOn((v) => !v);
    if (radio.commsOn) radio.stopRadio();
  }, [radio]);

  if (flow === "summary") {
    return <MissionCompleteSummary onExit={onExit} />;
  }

  if (flow === "inspect") {
    return (
      <div className="s3-game kids-mission-game">
        <ArtifactInspector
          artifacts={ARTIFACTS}
          themeColor={THEME}
          onDone={() => setFlow("summary")}
        />
      </div>
    );
  }

  return (
    <div className="s3-game kids-mission-game">
      <header className="s3-game-top">
        <button type="button" className="kids-icon-btn" onClick={onExit}>
          ← Moon
        </button>
        <StageDots stage={stage} />
        <button
          type="button"
          className={`s3-comms-toggle${radio.commsOn ? " is-on" : ""}`}
          onClick={toggleComms}
          aria-pressed={radio.commsOn}
        >
          COMMS AUDIO
          <WaveBars level={radio.waveLevel} active={radio.talking && radio.commsOn} />
        </button>
      </header>

      <p className="s3-game-title s3-game-title--inline">{SURVEYOR3_KIDS.missionTitle}</p>

      {stage === 1 && <StageLanding radio={radio} onSuccess={() => setStage(2)} />}
      {stage === 2 && <StageScoop radio={radio} onSuccess={() => setStage(3)} />}
      {stage === 3 && (
        <StageApollo
          radio={radio}
          onSuccess={finishStage3}
          onUnlockArtifact={unlockArtifact}
        />
      )}

      <ArtifactTray unlockedIds={unlockedArtifacts} />
    </div>
  );
}