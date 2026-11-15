"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { useGLTF } from "@react-three/drei";
import opportunitySections, { MISSION_SOURCES as OPP_SOURCES } from "@/data/opportunityDeepDive";
import ingenuitySections, { MISSION_SOURCES as GINNY_SOURCES } from "@/data/ingenuityDeepDive";
import { useDeepDive } from "./DeepDiveContext";
import MissionArchivePanel from "./MissionArchivePanel";
import { MODEL_URL } from "./RoverModel";
import { INGENUITY_MODEL_URL } from "./IngenuityArchiveModel";
import "./mission-archive.css";

const DeepDiveScene = dynamic(() => import("./DeepDiveScene"), { ssr: false });
const IngenuityDeepDiveScene = dynamic(() => import("./IngenuityDeepDiveScene"), { ssr: false });

const ARCHIVE_META = {
  opportunity: {
    loadingId: "Mer · Opportunity · Archive",
    loadingTitle: "Loading mission model",
    loadingCopy:
      "Fetching NASA's 3D rover from JPL. The interactive file opens once the model and Mars scene are ready.",
    ariaLabel: "Opportunity mission archive",
    headerId: "Mer · Opportunity · Archive",
    plaque: "NASA / JPL-Caltech · MER Opportunity (3D model)",
    modelUrl: MODEL_URL,
    sections: opportunitySections,
    sources: OPP_SOURCES,
    Scene: DeepDiveScene,
  },
  ingenuity: {
    loadingId: "Mars · Ingenuity · Archive",
    loadingTitle: "Loading Ginny",
    loadingCopy:
      "Fetching NASA's Ingenuity Mars Helicopter model. The archive opens once the 3D file is ready.",
    ariaLabel: "Ingenuity mission archive",
    headerId: "Mars · Ingenuity · Archive",
    plaque: "NASA / JPL-Caltech · Ingenuity Mars Helicopter (3D model)",
    modelUrl: INGENUITY_MODEL_URL,
    sections: ingenuitySections,
    sources: GINNY_SOURCES,
    Scene: IngenuityDeepDiveScene,
  },
};

function MissionArchiveLoading({ meta, onClose }) {
  return (
    <div className="mission-archive-loading" role="status" aria-live="polite" aria-busy="true">
      <div className="mission-archive-loading-card">
        <p className="mission-archive-loading-id">{meta.loadingId}</p>
        <h2 className="mission-archive-loading-title">{meta.loadingTitle}</h2>
        <p className="mission-archive-loading-copy">{meta.loadingCopy}</p>
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

/** Mars stays visible; mission archive panel + interactive 3D (Opportunity or Ingenuity). */
export default function DeepDive() {
  const { isOpen, close, nasaRoverReady, archiveKind } = useDeepDive();
  const meta = ARCHIVE_META[archiveKind] ?? ARCHIVE_META.opportunity;
  const Scene = meta.Scene;
  const closeRef = useRef(null);
  const closeFnRef = useRef(close);
  closeFnRef.current = close;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    useGLTF.preload(meta.modelUrl);
  }, [isOpen, meta.modelUrl]);

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
      aria-label={meta.ariaLabel}
      aria-busy={!nasaRoverReady}
    >
      <div className="deep-dive-layout">
        <div className="deep-dive-scene-column">
          {!nasaRoverReady ? <MissionArchiveLoading meta={meta} onClose={close} /> : null}
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
          {nasaRoverReady ? (
            <p className="mission-plaque pointer-events-none absolute bottom-3 left-3 max-w-[16rem] text-left">
              {meta.plaque}
            </p>
          ) : null}
        </div>

        <div className="mission-archive" data-loading={nasaRoverReady ? undefined : "true"}>
          <header className="mission-archive-header shrink-0">
            <div className="mission-archive-header-top">
              <div>
                <p className="mission-archive-id">{meta.headerId}</p>
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
          <MissionArchivePanel sections={meta.sections} missionSources={meta.sources} />
        </div>
      </div>
    </div>,
    document.body
  );
}