"use client";

import "./kids.css";
import { KidsProgressProvider } from "@/context/KidsProgressContext";
import SegmentRunner from "@/components/kids/SegmentRunner";
import { DeepDiveProvider, useDeepDive } from "@/components/deepdive/DeepDiveContext";
import DeepDive from "@/components/deepdive/DeepDive";
import SurveyorSegmentRunner from "@/components/kids/SurveyorSegmentRunner";
import { kidsPackFor } from "@/data/machines/index";

function KidsStoryLayer({ machineId, machine, onExit, onCompleteCelebration }) {
  const { isOpen } = useDeepDive();
  const Runner =
    machineId === "surveyor-3" ? SurveyorSegmentRunner : SegmentRunner;
  return (
    <div className={isOpen ? "kids-story-layer is-archive-open" : "kids-story-layer"} aria-hidden={isOpen}>
      <Runner
        machine={machine}
        onExit={onExit}
        onCompleteCelebration={onCompleteCelebration}
      />
    </div>
  );
}

function ApolloActTwoPlaceholder({ onClose }) {
  return (
    <div className="kids-mode">
      <div className="kids-end-card s3-finale-card" style={{ margin: "auto", maxWidth: "24rem" }}>
        <p className="s3-finale-emoji" aria-hidden="true">
          🚀
        </p>
        <h2>Apollo 12 — Act II</h2>
        <p className="kids-moon-line">
          Intrepid is on the rim above Surveyor Crater. Crewed Moon gameplay is on the way — explore Surveyor 3 while Act
          II is built!
        </p>
        <button type="button" className="kids-btn kids-btn-primary" onClick={onClose}>
          Back to the Moon
        </button>
      </div>
    </div>
  );
}

/** Kids Mode entry — machine-specific story or game path. */
export default function KidsMode({
  machineId = "opportunity",
  onClose,
  onCompleteCelebration,
}) {
  if (machineId === "apollo-12") {
    return <ApolloActTwoPlaceholder onClose={onClose} />;
  }

  const machine = kidsPackFor(machineId);

  if (!machine) {
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
      aria-label={`${tName(machine)} kids adventure`}
    >
      <KidsProgressProvider machineId={machine.id} startAtBeginning>
        {surveyor ? (
          <KidsStoryLayer
            machineId={machineId}
            machine={machine}
            onExit={onClose}
            onCompleteCelebration={onCompleteCelebration}
          />
        ) : (
          <DeepDiveProvider>
            <KidsStoryLayer
              machineId={machineId}
              machine={machine}
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
  const n = machine.name;
  if (typeof n === "string") return n;
  return n?.en ?? "Rover";
}