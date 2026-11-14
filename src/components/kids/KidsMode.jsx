"use client";

import { useState } from "react";
import "./kids.css";
import { KidsProgressProvider } from "@/context/KidsProgressContext";
import SegmentRunner from "@/components/kids/SegmentRunner";
import { DeepDiveProvider, useDeepDive } from "@/components/deepdive/DeepDiveContext";
import DeepDive from "@/components/deepdive/DeepDive";
import SurveyorSegmentRunner from "@/components/kids/SurveyorSegmentRunner";
import Apollo12Game from "@/components/kids/Apollo12Game";
import { kidsPackFor } from "@/data/machines/index";
import { useProgress } from "@/store/progress";

function KidsStoryLayer({ machineId, machine, onExit, onCompleteCelebration }) {
  const { isOpen } = useDeepDive();
  void machineId;
  return (
    <div className={isOpen ? "kids-story-layer is-archive-open" : "kids-story-layer"} aria-hidden={isOpen}>
      <SegmentRunner machine={machine} onExit={onExit} onCompleteCelebration={onCompleteCelebration} />
    </div>
  );
}

function Apollo12Layer({ onExit, onCompleteCelebration, locked, onCloseLocked }) {
  if (locked) {
    return (
      <div className="kids-story-layer">
        <div className="kids-end-card s3-finale-card" style={{ margin: "auto", maxWidth: "24rem" }}>
          <p className="s3-finale-emoji" aria-hidden="true">
            🔒
          </p>
          <h2>Act II locked</h2>
          <p className="kids-moon-line">Finish Surveyor 3&apos;s crater exploration first — then Apollo 12 unlocks!</p>
          <button type="button" className="kids-btn kids-btn-primary" onClick={onCloseLocked}>
            Back to the Moon
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="kids-story-layer kids-mode--apollo">
      <Apollo12Game onExit={onExit} onCompleteCelebration={onCompleteCelebration} />
    </div>
  );
}

/** Kids Mode entry — machine-specific story or game path. */
export default function KidsMode({
  machineId = "opportunity",
  onClose,
  onCompleteCelebration,
}) {
  const { isCompleted, ready } = useProgress();
  const [apolloOverride, setApolloOverride] = useState(false);

  const showingApollo = machineId === "apollo-12" || apolloOverride;
  const surveyorComplete = ready && isCompleted("surveyor-3");
  const apolloLocked = showingApollo && !surveyorComplete;

  if (showingApollo) {
    return (
      <div className="kids-mode kids-mode--surveyor" role="dialog" aria-modal="true" aria-label="Apollo 12 kids adventure">
        <Apollo12Layer
          onExit={() => {
            setApolloOverride(false);
            onClose();
          }}
          onCompleteCelebration={onCompleteCelebration}
          locked={apolloLocked}
          onCloseLocked={onClose}
        />
      </div>
    );
  }

  const pack = kidsPackFor(machineId);

  if (!pack) {
    return (
      <div className="kids-mode">
        <div className="kids-end-card">
          <p>Machine not found.</p>
          <button type="button" className="kids-btn kids-btn-primary" onClick={onClose}>
            Back
          </button>
        </div>
      </div>
    );
  }

  const surveyor = machineId === "surveyor-3";

  return (
    <div
      className={`kids-mode${surveyor ? " kids-mode--surveyor" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${tName(pack)} kids adventure`}
    >
      <KidsProgressProvider machineId={machineId} startAtBeginning>
        {surveyor ? (
          <SurveyorSegmentRunner
            machine={pack}
            onExit={onClose}
            onCompleteCelebration={onCompleteCelebration}
            onContinueApollo12={() => setApolloOverride(true)}
          />
        ) : (
          <DeepDiveProvider>
            <KidsStoryLayer
              machineId={machineId}
              machine={pack}
              onExit={onClose}
              onCompleteCelebration={onCompleteCelebration}
            />
            <DeepDive />
          </DeepDiveProvider>
        )}
      </KidsProgressProvider>
    </div>
  );
}

function tName(machine) {
  const n = machine?.name;
  if (typeof n === "string") return n;
  return n?.en ?? "Rover";
}