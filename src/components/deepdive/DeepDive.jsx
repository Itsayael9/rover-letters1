"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { useGLTF } from "@react-three/drei";
import sections from "@/data/opportunityDeepDive";
import { useDeepDive } from "./DeepDiveContext";
import MissionArchivePanel from "./MissionArchivePanel";
import { MODEL_URL } from "./RoverModel";
import "./mission-archive.css";

const DeepDiveScene = dynamic(() => import("./DeepDiveScene"), { ssr: false });

function MissionArchiveLoading({ onClose }) {
  return (
    <div className="mission-archive-loading" role="status" aria-live="polite" aria-busy="true">
      <div className="mission-archive-loading-card">
        <p className="mission-archive-loading-id">Mer · Opportunity · Archive</p>
        <h2 className="mission-archive-loading-title">Loading mission model</h2>
        <p className="mission-archive-loading-copy">
          Fetching NASA&apos;s 3D rover from JPL. The interactive file opens once the model and Mars scene are
          ready.
        </p>
        <div className="mission-archive-loading-bar" aria-hidden="true">
          <span className="mission-archive-loading-bar-fill" />
        </div>
        <button type="button" className="mission-archive-close mission-archive-loading-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/** Mars stays visible; mission archive panel + interactive rover. */
export default function DeepDive() {
  const { isOpen, close, nasaRoverReady } = useDeepDive();
  const closeRef = useRef(null);
  const closeFnRef = useRef(close);
  closeFnRef.current = close;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    useGLTF.preload(MODEL_URL);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") closeFnRef.current();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="deep-dive-overlay fixed inset-0 flex flex-col mission-archive-root"
      style={{ zIndex: 9999 }}
      role="dialog"
      aria-modal="true"
      aria-label="Opportunity mission archive"
      aria-busy={!nasaRoverReady}
    >
      <div className="deep-dive-layout">
        <div className="deep-dive-scene-column">
          {!nasaRoverReady ? <MissionArchiveLoading onClose={close} /> : null}
          <Suspense fallback={null}>
            <DeepDiveScene />
          </Suspense>
          {nasaRoverReady ? (
            <p className="mission-plaque pointer-events-none absolute bottom-3 left-3 max-w-[16rem] text-left">
              NASA / JPL-Caltech · MER Opportunity (3D model)
            </p>
          ) : null}
        </div>

        <div className="mission-archive" data-loading={nasaRoverReady ? undefined : "true"}>
          <header className="mission-archive-header shrink-0">
            <div className="mission-archive-header-top">
              <div>
                <p className="mission-archive-id">Mer · Opportunity · Archive</p>
                <h2 className="mission-archive-title">Interactive mission file</h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="mission-archive-close"
                aria-label="Close archive and return to story"
              >
                Close
              </button>
            </div>
          </header>
          <MissionArchivePanel sections={sections} />
        </div>
      </div>
    </div>,
    document.body
  );
}
