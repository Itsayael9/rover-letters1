"use client";

import { useEffect, useRef, useState } from "react";
import Surveyor3 from "@/components/kids/Surveyor3";

/** Press scoop into regolith — hold power in green zone */
export function SoilBearingGame({ radio, onSuccess }) {
  const [depth, setDepth] = useState(0);
  const [marker, setMarker] = useState(0);
  const [zone] = useState(() => ({ start: 42, width: 18 }));
  const [done, setDone] = useState(false);
  const dir = useRef(1);
  const raf = useRef(null);

  useEffect(() => {
    radio.playServoDig();
  }, [radio]);

  useEffect(() => {
    if (done) return undefined;
    const tick = () => {
      setMarker((m) => {
        let n = m + dir.current * 1.1;
        if (n >= 100) {
          n = 100;
          dir.current = -1;
        } else if (n <= 0) {
          n = 0;
          dir.current = 1;
        }
        return n;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [done]);

  const press = () => {
    if (done) return;
    const ok = marker >= zone.start && marker <= zone.start + zone.width;
    if (ok) {
      setDepth((d) => {
        const nd = d + 34;
        if (nd >= 100) {
          setDone(true);
          radio.playSuccessChime();
          void radio.speakRadio("Bearing locked at 6 PSI — Apollo safe!").then(onSuccess);
        }
        return Math.min(100, nd);
      });
    } else {
      radio.playScanPing();
    }
  };

  return (
    <div className="s3-minigame">
      <h4>Soil bearing press</h4>
      <Surveyor3 pose="dig" highlight="scoop" mood="excited" size="min(100%, 160px)" />
      <p className="s3-stage-hint">Tap PRESS when the marker is in the green zone to drive the scoop down.</p>
      <div className="s3-gauge">
        <div className="s3-gauge-fill" style={{ width: `${depth}%` }} />
        <span>{depth >= 100 ? "6 PSI" : `Depth ${Math.round(depth)}%`}</span>
      </div>
      <div className="s3-timing-bar">
        <div className="s3-zone" style={{ left: `${zone.start}%`, width: `${zone.width}%` }} />
        <div className="s3-marker" style={{ left: `${marker}%` }} />
      </div>
      <button type="button" className="s3-big-btn" onClick={press} disabled={done}>
        PRESS SCOOP
      </button>
    </div>
  );
}

/** Crush lunar clod — rapid tap fills telemetry */
export function ScoopCrushGame({ radio, onSuccess }) {
  const [crush, setCrush] = useState(0);
  const [clod, setClod] = useState(true);
  const done = crush >= 100;

  useEffect(() => {
    radio.playServoDig();
  }, [radio]);

  const grab = () => {
    if (!clod || done) return;
    setClod(false);
    radio.playScanPing();
  };

  const crushTap = () => {
    if (clod || done) return;
    setCrush((c) => {
      const n = Math.min(100, c + 14);
      radio.playServoDig();
      if (n >= 100) {
        radio.playSuccessChime();
        void radio.speakRadio("Telemetry sent — regolith strength recorded!").then(onSuccess);
      }
      return n;
    });
  };

  return (
    <div className="s3-minigame">
      <h4>Sample claw crush test</h4>
      <Surveyor3 pose={clod ? "wave" : "dig"} highlight="scoop" size="min(100%, 160px)" />
      <div className="s3-gauge">
        <div className="s3-gauge-fill" style={{ width: `${crush}%` }} />
        <span>{done ? "DATA SENT" : clod ? "Grab the clod first" : `Crush ${crush}%`}</span>
      </div>
      {clod ? (
        <button type="button" className="s3-big-btn" onClick={grab}>
          GRAB LUNAR CLOD
        </button>
      ) : (
        <button type="button" className="s3-big-btn" onClick={crushTap} disabled={done}>
          CRUSH & TRANSMIT
        </button>
      )}
    </div>
  );
}

/** Pan camera + lock beacon */
export function CameraBeaconGame({ radio, onSuccess }) {
  const [pan, setPan] = useState(50);
  const [locked, setLocked] = useState(false);
  const target = useRef(62 + Math.floor(Math.random() * 16));
  const dir = useRef(1);
  const raf = useRef(null);

  useEffect(() => {
    void radio.speakRadio("Slew the mirror to the crater rim, then lock the landing beacon.");
  }, [radio]);

  useEffect(() => {
    if (locked) return undefined;
    const tick = () => {
      setPan((p) => {
        let n = p + dir.current * 0.55;
        if (n >= 98) {
          n = 98;
          dir.current = -1;
        } else if (n <= 2) {
          n = 2;
          dir.current = 1;
        }
        return n;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [locked]);

  const lock = () => {
    const ok = Math.abs(pan - target.current) < 6;
    if (ok) {
      setLocked(true);
      radio.playSuccessChime();
      void radio.speakRadio("Beacon locked — Apollo 12 has a guide beam!").then(onSuccess);
    } else {
      radio.playScanPing();
    }
  };

  return (
    <div className="s3-minigame">
      <h4>Pan camera &amp; beacon lock</h4>
      <Surveyor3 pose="idle" highlight="camera" mood="curious" size="min(100%, 160px)" />
      <p className="s3-stage-hint">Lock when the sight line aligns with the crater landmark.</p>
      <div className="s3-beacon-track">
        <div className="s3-beacon-target" style={{ left: `${target.current}%` }} />
        <div className="s3-beacon-sight" style={{ left: `${pan}%` }} />
      </div>
      <button type="button" className="s3-big-btn" onClick={lock} disabled={locked}>
        {locked ? "BEACON LOCKED" : "LOCK BEACON"}
      </button>
    </div>
  );
}